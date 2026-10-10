"""Build a stand-alone HTML demo with the actual embedded GLB characters.
No npm, CORS, external CDN or app web server is needed for this preview.
The full React game has more refined terrain & collisions; this standalone uses
its existing WebGL valley blockout to show the SAME imported, animated characters.
"""
import re,base64
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=(root/'tools/phase1_standalone_template.html').read_text('utf-8')
source=source.replace('Phase 1 Preview','Phase 2 · Actual 3D Models')
source=source.replace('PHASE 1 · MOBILE<br/>PREVIEW','PHASE 2 · REAL 3D<br/>CHARACTER MODELS')
source=source.replace('This is the first interactive 3D encounter. The next phase will add custom creature animations, combat, and collection.', 'You are meeting the real 3D creature asset, not a picture or placeholder. Its wings and six legs move independently. Combat comes later.')
source=source.replace('No JS means it never becomes an empty gradient.', 'If this file viewer blocks 3D, an illustrative fallback is shown.')
modelA=base64.b64encode((root/'public/models/dijiang.glb').read_bytes()).decode('ascii')
modelB=base64.b64encode((root/'public/models/traveler.glb').read_bytes()).decode('ascii')

loader=r'''
// Actual GLB model importer: decodes the same exported 3D assets used by the React game.
function importGLB(data64){
  const binary=atob(data64),arr=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)arr[i]=binary.charCodeAt(i);
  const dv=new DataView(arr.buffer),jsonLength=dv.getUint32(12,true);
  const json=JSON.parse(new TextDecoder().decode(arr.subarray(20,20+jsonLength)));
  const binOffset=20+jsonLength+8;
  if(dv.getUint32(0,true)!==0x46546c67)throw Error('Not a GLB model');
  function values(index){
    const acc=json.accessors[index],bv=json.bufferViews[acc.bufferView];
    const count=acc.count,components=acc.type==='VEC3'?3:acc.type==='VEC2'?2:1;
    const sz=acc.componentType===5126||acc.componentType===5125?4:acc.componentType===5123?2:1;
    const off=binOffset+(bv.byteOffset||0)+(acc.byteOffset||0),stride=bv.byteStride||sz*components;
    const out=[];
    for(let i=0;i<count;i++)for(let c=0;c<components;c++){
      const p=off+i*stride+c*sz;
      out.push(acc.componentType===5126?dv.getFloat32(p,true):acc.componentType===5125?dv.getUint32(p,true):acc.componentType===5123?dv.getUint16(p,true):dv.getUint8(p));
    }
    return out;
  }
  const meshes=json.meshes.map(mesh=>mesh.primitives.map(pr=>{
    const pos=values(pr.attributes.POSITION),indices=values(pr.indices);
    const norm=pr.attributes.NORMAL!==undefined?values(pr.attributes.NORMAL):new Array(pos.length).fill(0);
    if(pr.attributes.NORMAL===undefined){
      for(let j=0;j<indices.length;j+=3){
        const a=indices[j]*3,b=indices[j+1]*3,c=indices[j+2]*3;
        const ab=[pos[b]-pos[a],pos[b+1]-pos[a+1],pos[b+2]-pos[a+2]];
        const ac=[pos[c]-pos[a],pos[c+1]-pos[a+1],pos[c+2]-pos[a+2]];
        const n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
        for(const q of [a,b,c])for(let k=0;k<3;k++)norm[q+k]+=n[k];
      }
      for(let j=0;j<norm.length;j+=3){let len=Math.hypot(norm[j],norm[j+1],norm[j+2])||1;for(let k=0;k<3;k++)norm[j+k]/=len;}
    }
    const material=json.materials[pr.material]?.pbrMetallicRoughness?.baseColorFactor||[1,1,1,1];
    return {mesh:makeMesh(pos,norm,indices),color:material.slice(0,3)};
  }));
  return {json,meshes};
}
const dijiangModel=importGLB('__DIJIANG__');
const travelerModel=importGLB('__TRAVELER__');
function rz(v){let c=Math.cos(v),s=Math.sin(v);return [c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]}
function rx(v){let c=Math.cos(v),s=Math.sin(v);return [1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]}
function nodeTransform(n){
  if(n.matrix)return n.matrix;
  let t=n.translation||[0,0,0],s=n.scale||[1,1,1],q=n.rotation||[0,0,0,1];
  const [x,y,z,w]=q;
  return [
    (1-2*(y*y+z*z))*s[0],2*(x*y+z*w)*s[0],2*(x*z-y*w)*s[0],0,
    2*(x*y-z*w)*s[1],(1-2*(x*x+z*z))*s[1],2*(y*z+x*w)*s[1],0,
    2*(x*z+y*w)*s[2],2*(y*z-x*w)*s[2],(1-2*(x*x+y*y))*s[2],0,
    t[0],t[1],t[2],1
  ];
}
function drawRealMesh(geometry,world,color){
  gl.uniformMatrix4fv(loc.m,false,world);
  gl.uniform3fv(loc.color,color);
  gl.bindBuffer(gl.ARRAY_BUFFER,geometry.b);
  gl.vertexAttribPointer(loc.p,3,gl.FLOAT,false,24,0);
  gl.vertexAttribPointer(loc.n,3,gl.FLOAT,false,24,12);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,geometry.ib);
  gl.drawElements(gl.TRIANGLES,geometry.len,gl.UNSIGNED_SHORT,0);
}
function renderRealAsset(asset,position,rotation=0){
  const base=model(position[0],position[1],position[2],1,1,1,rotation);
  function visit(i,parent){
    let node=asset.json.nodes[i],local=nodeTransform(node),n=node.name||'';
    if(/^Wing_[LR]_(Upper|Lower)$/.test(n)){
      const side=n.includes('_L_')?-1:1;
      local=mul(local,rz(side*Math.sin(tick*(near?4.9:2.6)+(n.includes('Lower')?.8:0))*(near?.17:.09)));
    }
    if(/^Leg_[LR](?:_[123])?$/.test(n)){
      const side=n.includes('_L')?0:Math.PI;
      const pace=asset===travelerModel?movingNow?0.36:0:near?.09:.02;
      local=mul(local,rx(Math.sin(tick*(asset===travelerModel?10.5:4.5)+side+(/_2/.test(n)?1.1:0))*pace));
    }
    if(n.startsWith('Arm_'))local=mul(local,rx(Math.sin(tick*10.5+(n.includes('_L')?0:Math.PI))*(movingNow?.24:0)));
    const world=mul(parent,local);
    if(node.mesh!==undefined)for(const p of asset.meshes[node.mesh])drawRealMesh(p.mesh,world,p.color);
    for(const child of node.children||[])visit(child,world);
  }
  for(const i of asset.json.scenes[asset.json.scene||0].nodes)visit(i,base);
}
'''.replace('__DIJIANG__',modelA).replace('__TRAVELER__',modelB)

# Keep the old procedural environment but render the imported assets instead of proxies.
source=source.replace('let player={x:3,z:22}', 'let player={x:3,z:22}')
start=source.index('function traveler(){')
end=source.index('function resize(){',start)
source=source[:start]+"let movingNow=false;\n"+source[end:]
where=source.index('let player={x:3,z:22}')
source=source[:where]+loader+'\n'+source[where:]
source=source.replace('for(let o of objs)drawPart(o);dijiang();traveler();',"for(let o of objs)drawPart(o);renderRealAsset(dijiangModel,[8,Math.sin(tick*1.5)*.07,-22]);renderRealAsset(travelerModel,[player.x,0,player.z],playerDirection);")
source=source.replace('let tick=0;', 'let tick=0;let playerDirection=0;')
source=source.replace('if(l>.01&&!opened){let vel=', 'movingNow=l>.01&&!opened;if(movingNow){playerDirection=Math.atan2(-mx,-mz);let vel=')
source=source.replace('for(let o of objs)drawPart(o);renderRealAsset', 'for(let o of objs)drawPart(o);renderRealAsset')
source=source.replace('PHASE 1 · MOBILE', 'PHASE 2 · REAL 3D')
source=source.replace('The next phase will add', 'Later phases will add')
(root/'preview/index.html').write_text(source,'utf-8')
(root/'public/phase2-preview.html').write_text(source,'utf-8')
Path('/mnt/data/shan-hai-phase2-preview.html').write_text(source,'utf-8')
print('Standalone preview',len(source),'characters embedded as GLB',len(modelA),len(modelB))
