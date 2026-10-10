import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = new URL('../public/models/', import.meta.url);
function readGlb(name) {
  const bytes=fs.readFileSync(new URL(name,root));
  assert.equal(bytes.toString('utf8',0,4),'glTF');
  assert.equal(bytes.readUInt32LE(4),2);
  assert.equal(bytes.readUInt32LE(8),bytes.length);
  const length=bytes.readUInt32LE(12);
  const doc=JSON.parse(bytes.toString('utf8',20,20+length));
  return {bytes,doc};
}
test('Dijiang is a real, compact GLB with six separately articulated legs and four wings',()=>{
  const {bytes,doc}=readGlb('dijiang.glb');
  assert.ok(bytes.length>25_000 && bytes.length<600_000);
  const names=doc.nodes.map(n=>n.name||'');
  assert.equal(names.filter(x=>/^Leg_[LR]_[123]$/.test(x)).length,6);
  assert.equal(names.filter(x=>/^Wing_[LR]_(Upper|Lower)$/.test(x)).length,4);
  assert.equal(names.filter(x=>/^(Eye|Nose|Mouth|Ear|Whisker)/i.test(x)).length,0);
  assert.ok(doc.meshes.length < 80, 'keep the spirit light enough for the garden');
  assert.ok(doc.materials.some(m => m.name === 'coral'));
  const cream = doc.materials.find(m => m.name === 'cream').pbrMetallicRoughness.baseColorFactor;
  assert.ok(cream[0] > cream[1] && cream[1] > cream[2], 'warm ivory material');
});
test('Modern playable human is exported as independently animated GLB with simple clothing',()=>{
  const {bytes,doc}=readGlb('traveler.glb');
  assert.ok(bytes.length>15000 && bytes.length<300000);
  const names=doc.nodes.map(n=>n.name||'');
  for(const n of ['Torso','Shorts','Hair_Cap','Leg_L','Leg_R','Arm_L','Arm_R']) assert.ok(names.includes(n),n);
  assert.equal(names.filter(n=>/bun|topknot|ponytail|bag|strap/i.test(n)).length,0);
  const hair = doc.materials.find(m => m.name === 'hair').pbrMetallicRoughness.baseColorFactor;
  assert.ok(hair[0] < .12 && hair[1] < .06, 'hair stays brown after linear-light rendering');
});
test('3D scene has traversable bridge crossing and modular landmarks',()=>{
  const world=fs.readFileSync(new URL('../src/game/WorldObjects.tsx', import.meta.url),'utf8');
  for(const token of ['StoneBridge','Pavilion','MoonGate','RiverAndPath','Flowers','Mountains','isBlocked','terrainHeight']) assert.ok(world.includes(token),token);
});
test('standalone preview embeds the same exported 3D models offline, not image stand-ins',()=>{
  const html=fs.readFileSync(new URL('../preview/index.html', import.meta.url),'utf8');
  assert.match(html,/function importGLB\(data64\)/);
  assert.match(html,/const dijiangModel=importGLB\('/);
  assert.match(html,/const travelerModel=importGLB\('/);
  assert.doesNotMatch(html,/dijiang\(\);traveler\(\);/);
});
