import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../preview/index.html',import.meta.url),'utf8');
test('standalone preview shows static scenery even when JavaScript cannot run',()=>{
  assert.match(html,/#fallback\{background-image:url\("data:image\/webp;base64,/);
  assert.match(html,/display:block;position:fixed;inset:0;background-position:center/);
  assert.match(html,/<div id="static-note" role="status">Scenery preview/);
  assert.match(html,/#scene\{position:fixed;inset:0;display:none/);
});
test('interactive joystick stays hidden until WebGL draws the first frame',()=>{
  assert.match(html,/.bottom,.tip\{display:none!important\}/);
  assert.match(html,/.scene-ready .bottom\{display:flex!important\}/);
  assert.match(html,/gl\.getError\(\)===gl\.NO_ERROR/);
});

test('mobile controls stay in front of WebGL',()=>{
  assert.match(html, /#scene\{[^}]*z-index:1/);
  assert.match(html, /\.bottom,\.tip\{z-index:4\}/);
});
