import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
const code = readFileSync(new URL('../src/game/constants.ts',import.meta.url),'utf8');
test('dijiang anatomy contract is documented in code',()=>{
  assert.match(code,/legs:\s*6/);assert.match(code,/wings:\s*4/);assert.match(code,/facialFeatures:\s*0/);
});
test('starter scene has a named region and spawn',()=>{
  assert.match(code,/id:\s*'tianshan'/);assert.match(code,/spawn:/);assert.match(code,/dijiang:/);
});
