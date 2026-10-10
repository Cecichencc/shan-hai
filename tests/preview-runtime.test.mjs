import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('../preview/index.html', import.meta.url), 'utf8');
const inline = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
test('standalone WebGL scene initializes and draws without JS runtime exceptions', () => {
  assert.ok(inline, 'missing inline preview renderer');
  let draws=0,frame;const handlers={};
  const noop=()=>{};
  const gl=new Proxy({
    VERTEX_SHADER:0x8B31,FRAGMENT_SHADER:0x8B30,COMPILE_STATUS:0x8B81,LINK_STATUS:0x8B82,
    ARRAY_BUFFER:0x8892,ELEMENT_ARRAY_BUFFER:0x8893,STATIC_DRAW:0x88E4,
    FLOAT:0x1406,UNSIGNED_SHORT:0x1403,DEPTH_TEST:0x0B71,LEQUAL:0x0203,
    COLOR_BUFFER_BIT:0x4000,DEPTH_BUFFER_BIT:0x0100,TRIANGLES:0x0004,
    createShader:()=>({}),createProgram:()=>({}),createBuffer:()=>({}),
    getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:()=>({}),
    drawElements:()=>{draws++},
  },{get:(o,k)=>k in o?o[k]:noop});
  const objects={};const element=id=>objects[id]??=(id==='scene'?{getContext:()=>gl,width:0,height:0,style:{}}:{style:{setProperty:noop},classList:{classes:new Set(),add(k){this.classes.add(k)},remove(k){this.classes.delete(k)},toggle(k,on){if(on)this.classes.add(k);else this.classes.delete(k)}},addEventListener:noop,textContent:'',getBoundingClientRect:()=>({left:0,top:0,width:100,height:100})});
  const ctx={document:{getElementById:element},window:{devicePixelRatio:1,addEventListener:(name,fn)=>{handlers[name]=fn}},innerWidth:1200,innerHeight:850,performance:{now:()=>0},requestAnimationFrame:(cb)=>{frame=cb},Math,Float32Array,Uint16Array,console};
  vm.runInNewContext(inline,ctx,{timeout:10000});
  for(let i=1;i<=5;i++){const f=frame;frame=undefined;f(i*16);}
  assert.ok(draws>200,'expected multiple visible mesh draw calls');
  handlers.keydown({key:'w',preventDefault:noop});
  for(let i=6;i<=325;i++){const f=frame;frame=undefined;f(i*16);}
  assert.ok(element('action').classList.classes.has('show'),'walking toward the glade should reveal Meet action');
});
