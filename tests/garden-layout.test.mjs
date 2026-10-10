import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REGION } from '../src/game/constants.ts';
import { isBlocked, bridgeHeight, STREAM_CENTER, BRIDGE_X, BRIDGE_Z } from '../src/game/world-layout.ts';

test('the complete spawn-to-spirit route crosses the bridge without blocked positions', () => {
  const route = [[REGION.spawn[0], REGION.spawn[2]], [BRIDGE_X, BRIDGE_Z + 4], [BRIDGE_X, BRIDGE_Z - 4], [REGION.dijiang[0], REGION.dijiang[2]]];
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1], b = route[i];
    for (let step = 0; step <= 100; step++) {
      const t = step / 100, x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
      assert.equal(isBlocked(x, z), false, `route blocked at ${x}, ${z}`);
    }
  }
});
test('water blocks walking except at the bridge', () => {
  for (const x of [-13, -8, 4, 8, 13]) assert.equal(isBlocked(x, STREAM_CENTER(x)), true);
  assert.equal(isBlocked(BRIDGE_X, BRIDGE_Z), false);
  assert.ok(bridgeHeight(BRIDGE_X, BRIDGE_Z) > .8);
  assert.equal(bridgeHeight(BRIDGE_X + 3, BRIDGE_Z), null);
});
test('the moon gate opening is accessible but its wall is solid', () => {
  assert.equal(isBlocked(11.6, -8), false);
  assert.equal(isBlocked(14.3, -8), true);
});
test('garden bounds and the pavilion remain solid', () => {
  assert.equal(isBlocked(20, 0), true);
  assert.equal(isBlocked(0, -20), true);
  assert.equal(isBlocked(7.8, -10.5), true);
});
