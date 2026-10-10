import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { COLORS } from './constants';

function randomSeed(seed: number) {
  let current = seed >>> 0;
  return () => ((current = (Math.imul(current, 1664525) + 1013904223) >>> 0) / 4294967296);
}

export const STREAM_CENTER = (x: number) => -1.6 + Math.sin(x * 0.12) * 1.2;
export const PATH_CENTER = (z: number) => 4.7 + Math.sin((z + 11) * 0.075) * 1.35;
export const terrainHeight = (x: number, z: number) => {
  const roll = Math.sin(x * .13) * Math.cos(z * .095) * .15 + Math.cos(x * .07 + z * .11) * .09;
  const banks = Math.max(0, Math.abs(x) - 15) * .085;
  return roll + banks;
};
// The only river crossing in the first expedition is the arched stone bridge.
export function isBlocked(x: number, z: number) {
  if (Math.abs(x) > 38 || z < -39 || z > 37) return true;
  if (Math.abs(z - STREAM_CENTER(x)) < 2.6 && Math.abs(x - PATH_CENTER(0)) > 2.85) return true;
  // Keep the approach and Dijiang clearing unimpeded; collision around buildings only.
  if (Math.hypot(x + 11, z + 26) < 3.9) return true;
  return false;
}

function createLand(): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(112, 110, 72, 72);
  geo.rotateX(-Math.PI / 2);
  const a = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < a.count; i++) a.setY(i, terrainHeight(a.getX(i), a.getZ(i)) - 0.10);
  geo.computeVertexNormals(); return geo;
}
function strip(points: [number, number][], width: number, lift = 0) {
  const verts: number[] = [], normals: number[] = [], uv: number[] = [], indices: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const [x, z] = points[i], prev = points[Math.max(0, i - 1)], next = points[Math.min(points.length - 1, i + 1)];
    const dx = next[0] - prev[0], dz = next[1] - prev[1], l = Math.hypot(dx, dz) || 1;
    const nx = dz / l, nz = -dx / l;
    for (const side of [-1, 1]) {
      const xx = x + side * width * .5 * nx, zz = z + side * width * .5 * nz;
      verts.push(xx, terrainHeight(xx, zz) + lift, zz); normals.push(0, 1, 0); uv.push(side, i / 8);
    }
    if (i < points.length - 1) { const a = 2 * i; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(indices); return g;
}

const TREE_PLACES = (() => {
  const rand = randomSeed(61933); const values: Array<{ x: number, z: number, blossom: boolean, scale: number }> = [];
  let attempts = 0;
  while (values.length < 56 && attempts++ < 500) {
    const x = rand() * 73 - 36, z = rand() * 91 - 43;
    if (Math.abs(x - PATH_CENTER(z)) < 5.2 || Math.abs(z - STREAM_CENTER(x)) < 5 || Math.hypot(x - 6, z + 22) < 9.4 || Math.hypot(x + 11, z + 26) < 7.4 || Math.hypot(x - 4, z - 27) < 4.7) continue;
    values.push({ x, z, blossom: rand() < .49 || z < -14 && rand() < .6, scale: .74 + rand() * .62 });
  }
  return values;
})();
function Tree({ x, z, blossom, scale }: (typeof TREE_PLACES)[number]) {
  const c = blossom ? COLORS.blossom : COLORS.leaf;
  const c2 = blossom ? COLORS.paleBlossom : COLORS.leafLight;
  return <group position={[x, terrainHeight(x, z) - .05, z]} scale={scale}>
    <mesh position={[0, 1.18, 0]} castShadow><cylinderGeometry args={[.36, .49, 2.35, 7]} /><meshStandardMaterial color={COLORS.trunk} flatShading /></mesh>
    <mesh position={[0, 2.90, 0]} scale={[1.70, 1.36, 1.70]} castShadow><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={c} roughness={1} /></mesh>
    {[-1, 1].map((side) => <mesh key={side} position={[side * 1.16, 2.83 + side * .1, .18]} scale={[.95, 1.04, 1.04]} castShadow>
      <icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={side < 0 ? c2 : c} roughness={1} /></mesh>)}
    <mesh position={[.30, 3.64, -.32]} scale={[.98, .70, .95]} castShadow><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={c2} roughness={1}/></mesh>
  </group>;
}

function Flowers() {
  const rand = useMemo(() => randomSeed(67420), []);
  const flowerSpots = useMemo(() => Array.from({ length: 160 }, (_, i) => {
    const x = rand() * 74 - 37, z = rand() * 92 - 45;
    return { x, z, scale: .70 + rand() * .7, pink: rand() > .32, turn: rand() * Math.PI * 2, id: i };
  }).filter(v => Math.abs(v.z - STREAM_CENTER(v.x)) > 4.1 && Math.abs(v.x - PATH_CENTER(v.z)) > 1.3), [rand]);
  const petals = useRef<THREE.InstancedMesh[]>([]);
  const centers = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    flowerSpots.forEach((spot, i) => {
      const y = terrainHeight(spot.x, spot.z) + .07;
      for (let p = 0; p < 5; p++) {
        const a = p * Math.PI * .4 + spot.turn;
        dummy.position.set(spot.x + Math.cos(a) * spot.scale * .18, y + .22 * spot.scale, spot.z + Math.sin(a) * spot.scale * .18);
        dummy.scale.set(.15 * spot.scale, .10 * spot.scale, .15 * spot.scale);
        dummy.rotation.set(0, a, 0); dummy.updateMatrix();
        petals.current[p]?.setMatrixAt(i, dummy.matrix);
        petals.current[p]?.setColorAt(i, new THREE.Color(spot.pink ? COLORS.blossom : '#fff8e7'));
      }
      dummy.position.set(spot.x, y + .24 * spot.scale, spot.z);
      dummy.scale.setScalar(.09 * spot.scale); dummy.rotation.set(0, 0, 0); dummy.updateMatrix();
      centers.current?.setMatrixAt(i, dummy.matrix);
    });
    petals.current.forEach(m => { if (m) { m.instanceMatrix.needsUpdate = true; if(m.instanceColor) m.instanceColor.needsUpdate = true; } });
    if (centers.current) centers.current.instanceMatrix.needsUpdate = true;
  }, [flowerSpots]);
  return <group>
    {Array.from({ length: 5 }, (_, i) => <instancedMesh key={i} ref={m => { if(m) petals.current[i] = m; }} args={[undefined, undefined, flowerSpots.length]}>
      <sphereGeometry args={[1, 6, 5]} /><meshStandardMaterial roughness={1} color="#ffffff" />
    </instancedMesh>)}
    <instancedMesh ref={centers} args={[undefined, undefined, flowerSpots.length]}>
      <sphereGeometry args={[1, 6, 5]} /><meshStandardMaterial color="#f1c763" roughness={1} />
    </instancedMesh>
  </group>;
}

function Mountains() {
  const peaks: Array<[number, number, number, number]> = [[-38,-59,15,12],[-22,-59,22,15],[-2,-70,27,15],[20,-67,21,13],[39,-59,19,13],[55,-34,16,15]];
  return <group>{peaks.map(([x, z, y, radius], i) => <group key={i} position={[x, -.7, z]}>
    <mesh scale={[radius, y, radius*.80]} position={[0,y*.39,0]}>
      <icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={i%3===0?'#a2d3b8':i%3===1?'#9ccdb6':'#c4e2c6'} flatShading roughness={1}/>
    </mesh>
    <mesh scale={[radius*.28,y*.18,radius*.24]} position={[-radius*.12,y*.89,-radius*.05]}>
      <icosahedronGeometry args={[1,0]}/><meshStandardMaterial color="#f8f8e9" roughness={1}/>
    </mesh>
  </group>)}</group>;
}

function Cloud({pos,scale=1}:{pos:[number,number,number],scale?:number}){
  return <group position={pos} scale={scale}>{[-1,0,.95].map((v,i)=><mesh key={i} position={[v*.95,i===1?.2:0,0]} scale={[1.12,i===1?.72:.52,.66]}>
    <sphereGeometry args={[1,9,7]}/><meshBasicMaterial color="#fffdf1"/>
  </mesh>)}</group>;
}

function RiverAndPath(){
  const water=useMemo(()=>strip(Array.from({length:67},(_,i)=>{const x=-53+i*1.65;return [x,STREAM_CENTER(x)] as [number,number]}),6,.29),[]);
  const shore=useMemo(()=>strip(Array.from({length:67},(_,i)=>{const x=-53+i*1.65;return [x,STREAM_CENTER(x)] as [number,number]}),8,.08),[]);
  const path=useMemo(()=>strip(Array.from({length:79},(_,i)=>{const z=-40+i*1.0;return [PATH_CENTER(z),z] as [number,number]}),3.0,.085),[]);
  return <group>
    <mesh geometry={shore}><meshStandardMaterial color="#c7e2a2" side={THREE.DoubleSide} roughness={1}/></mesh>
    <mesh geometry={water}><meshStandardMaterial color="#71cad9" side={THREE.DoubleSide} roughness={.35} metalness={.04}/></mesh>
    <mesh geometry={path}><meshStandardMaterial color="#efdbb6" side={THREE.DoubleSide} roughness={1}/></mesh>
    {Array.from({length:57},(_,i)=>{const z=35-i*1.33,x=PATH_CENTER(z);if(Math.abs(z-STREAM_CENTER(x))<4.2)return null;
      return <mesh key={i} position={[x,terrainHeight(x,z)+.12,z]} rotation={[0,Math.sin(i*.4)*.10,0]} scale={[1.3,.08,.86]}>
        <boxGeometry args={[1,1,1]}/><meshStandardMaterial color={i%4===0?'#f8ebd1':'#e9dcbe'} roughness={1}/>
      </mesh>})}
    {/* water highlights */}
    {Array.from({length:34},(_,i)=>{const x=-36+i*2.1,z=STREAM_CENTER(x)+(i%3-1)*1.2;
      return <mesh key={i} position={[x,terrainHeight(x,z)+.314,z]} rotation={[-Math.PI/2,0,.4]}>
        <planeGeometry args={[.65,.06]}/><meshBasicMaterial color="#c3f2f4" transparent opacity={.46} side={THREE.DoubleSide}/>
      </mesh>})}
  </group>;
}

function StoneBridge() {
  const x=PATH_CENTER(0), z=STREAM_CENTER(x);
  const parts=Array.from({length:20},(_,i)=>{const zz=-6.2+i*.65;return {z:zz,y:.35+1.0*Math.sin(Math.PI*i/19)};});
  return <group position={[x,0,z]}>
    {parts.map((p,i)=><mesh key={'deck'+i} position={[0,p.y,p.z]}><boxGeometry args={[4.0,.25,.72]}/><meshStandardMaterial color={i%2?'#d5d6c7':'#e3dfcc'}/></mesh>)}
    {[-1.9,1.9].map(side=><group key={side}>
      {Array.from({length:7},(_,i)=>{const zz=-5.5+i*1.84,yy=.35+1.0*Math.sin(Math.PI*i/6);
        return <mesh key={i} position={[side, yy+.58,zz]}><cylinderGeometry args={[.14,.17,1.08,8]}/><meshStandardMaterial color="#c5cfc1"/></mesh>})}
      {Array.from({length:18},(_,i)=>{const zz=-5.6+i*.66,yy=.35+1.0*Math.sin(Math.PI*i/17);
        return <mesh key={i} position={[side,yy+1.08,zz]} rotation={[Math.atan((Math.PI/17)*Math.cos(Math.PI*i/17))*.3,0,0]}><boxGeometry args={[.22,.17,.70]}/><meshStandardMaterial color="#d5d8c6"/></mesh>})}
    </group>)}
  </group>;
}

function curvedRoofGeometry() {
  const width=6.1,depth=5.65,n=12,vert:number[]=[],ind:number[]=[];
  for(let iz=0;iz<=n;iz++)for(let ix=0;ix<=n;ix++){
    const x=(ix/n-.5)*width,z=(iz/n-.5)*depth;
    const r=Math.max(Math.abs(x/(width*.5)),Math.abs(z/(depth*.5)));
    const corners=Math.pow(Math.abs(x/(width*.5))*Math.abs(z/(depth*.5)),2);
    const y=3.6 + .82*(1-r) + .33*corners;
    vert.push(x,y,z);
  }
  for(let z=0;z<n;z++)for(let x=0;x<n;x++){
    const a=z*(n+1)+x, b=a+1,c=a+n+1,d=c+1;
    ind.push(a,c,b,b,c,d);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vert,3));geo.setIndex(ind);geo.computeVertexNormals();return geo;
}
function Pavilion(){
  const roof=useMemo(curvedRoofGeometry,[]);
  const x=-11,z=-26;
  return <group position={[x,terrainHeight(x,z),z]}>
    <mesh position={[0,.2,0]}><cylinderGeometry args={[4.0,4.1,.45,12]}/><meshStandardMaterial color="#e3d5b4"/></mesh>
    {[-2.25,2.25].flatMap(a=>[-2.05,2.05].map(b=><mesh key={`${a}-${b}`} position={[a,1.85,b]} castShadow>
      <cylinderGeometry args={[.23,.27,3.6,8]}/><meshStandardMaterial color="#ba8262"/>
    </mesh>))}
    <mesh geometry={roof} castShadow><meshStandardMaterial side={THREE.DoubleSide} color="#527e86" roughness={.91} flatShading/></mesh>
    {[-1,1].flatMap(side=>Array.from({length:8},(_,i)=>{
      const zz=-2.65+i*.76;return <mesh key={`${side}-${i}`} position={[side*2.96,3.6+.24*Math.pow(zz/2.8,4),zz]}>
        <sphereGeometry args={[.17,6,5]}/><meshStandardMaterial color="#7fadb1"/>
      </mesh>
    }))}
    <mesh position={[0,4.60,0]}><cylinderGeometry args={[.24,.40,.52,10]}/><meshStandardMaterial color="#d8b68e"/></mesh>
    {[-1,1].map(side=><group key={side}>
      <mesh position={[side*2.25,1.10,0]}><boxGeometry args={[.14,.14,3.95]}/><meshStandardMaterial color="#b88462"/></mesh>
    </group>)}
  </group>;
}
function MoonGate(){
  return <group position={[21,terrainHeight(21,-26),-27]}>
    <mesh position={[0,2.5,0]}><torusGeometry args={[2.13,.40,8,30]}/><meshStandardMaterial color="#eff0db"/></mesh>
    <mesh position={[-2.42,1.38,0]}><boxGeometry args={[.88,2.78,.89]}/><meshStandardMaterial color="#e6e7d4"/></mesh>
    <mesh position={[2.42,1.38,0]}><boxGeometry args={[.88,2.78,.89]}/><meshStandardMaterial color="#e6e7d4"/></mesh>
    <mesh position={[0,4.65,0]}><boxGeometry args={[5.3,.53,1.06]}/><meshStandardMaterial color="#587d86"/></mesh>
  </group>;
}
function Lantern({x,z}:{x:number,z:number}){
  return <group position={[x,terrainHeight(x,z),z]}>
    <mesh position={[0,.72,0]}><cylinderGeometry args={[.18,.26,1.4,7]}/><meshStandardMaterial color="#abb4ab"/></mesh>
    <mesh position={[0,1.60,0]}><boxGeometry args={[.67,.85,.67]}/><meshStandardMaterial color="#dfbf83" emissive="#b99a59" emissiveIntensity={.24}/></mesh>
    <mesh position={[0,2.05,0]}><coneGeometry args={[.75,.52,4]}/><meshStandardMaterial color="#729292"/></mesh>
  </group>;
}

export function WorldObjects(){
  const ground=useMemo(createLand,[]);
  const petals=useMemo(()=>Array.from({length:15},(_,i)=>({x:5+Math.sin(i*2.3)*5,z:-22+Math.cos(i*1.8)*4.4})),[]);
  return <group>
    <mesh geometry={ground} receiveShadow><meshStandardMaterial color="#a6d68a" roughness={1} flatShading/></mesh>
    <mesh position={[6,terrainHeight(6,-22)+.07,-22]} scale={[8.7,.20,7.8]}><sphereGeometry args={[1,18,10]}/><meshStandardMaterial color="#b8df8f" roughness={1}/></mesh>
    <RiverAndPath/><StoneBridge/><Pavilion/><MoonGate/><Mountains/>
    {TREE_PLACES.map((v,i)=><Tree key={i} {...v}/>)}
    <Flowers/>
    {[[0,-10],[10,-10],[-4,-28],[16,-29]].map(([x,z],i)=><Lantern key={i} x={x} z={z}/>)}
    {Array.from({length:22},(_,i)=>{const a=i*2.4,r=9.1+(i%3)*.7,x=6+Math.cos(a)*r,z=-22+Math.sin(a)*r;
      return <mesh key={i} position={[x,terrainHeight(x,z)+.26,z]} rotation={[0,a,0]} scale={[.58+(i%4)*.22,.28,.45]}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color={i%4===0?'#c9d2c6':'#b1bdb4'} flatShading roughness={1}/></mesh>})}
    {petals.map((p,i)=><mesh key={'petal'+i} position={[p.x,terrainHeight(p.x,p.z)+.2,p.z]} rotation={[-Math.PI/2,0,i*.5]}><planeGeometry args={[.15,.32]}/><meshBasicMaterial color="#f3a4bd" side={THREE.DoubleSide}/></mesh>)}
    {[[-20,20,-67,1.8],[6,17,-78,1.6],[27,22,-70,1.2],[0,14,-58,1.5]] .map(([x,y,z,s],i)=><Cloud key={i} pos={[x,y,z]} scale={s}/>)}
  </group>;
}
