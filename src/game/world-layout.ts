import { REGION } from './constants.ts';

export const STREAM_CENTER = (x: number) => 1.8 + Math.sin(x * .18) * 1.05;
export const PATH_CENTER = (z: number) => 2.8 - 4.8 * Math.exp(-((z - 1.4) ** 2) / 23);
export const BRIDGE_X = -2;
export const BRIDGE_Z = STREAM_CENTER(BRIDGE_X);
export const terrainHeight = (x: number, z: number) => Math.sin(x * .16) * Math.cos(z * .19) * .055;
export function bridgeHeight(x: number, z: number) {
  const dz = Math.abs(z - BRIDGE_Z);
  return Math.abs(x - BRIDGE_X) < 1.83 && dz < 3.65 ? .12 + .85 * (1 - (dz / 3.65) ** 2) : null;
}
export const TREES: Array<[number, number, number, boolean]> = [
  [-9, 9, 1.12, true], [9, 12, 1.04, true], [-9.4, -4.8, 1.13, true],
  [-4.8, -10.2, 1.05, true], [12.5, -5.5, 1.12, true],
  [-12, 2.9, .90, false], [9.4, -14, .95, false],
];
export const ROCKS: Array<[number, number, number]> = [
  [-7.5, 3.8, .95], [-10.3, -.8, 1.1], [-5.9, -1.8, .68], [1.3, 4.8, .64],
  [4.4, .2, .85], [8, 4.9, 1.2], [11.7, 1.4, .72], [13.5, 5.6, 1.05],
  [-12.4, -8.8, 1.5], [5, -12.8, .70], [-6, 12.8, .68], [7, 10.2, .80],
];
export function isBlocked(x: number, z: number) {
  const b = REGION.bounds;
  if (x < b.minX || x > b.maxX || z < b.minZ || z > b.maxZ) return true;
  if (Math.abs(z - STREAM_CENTER(x)) < 2.03 && Math.abs(x - BRIDGE_X) > 1.55) return true;
  if (Math.abs(x - 7.8) < 2.45 && Math.abs(z + 10.5) < 2.45) return true;
  if (TREES.some(([tx, tz, s]) => Math.hypot(x - tx, z - tz) < .50 * s)) return true;
  if (ROCKS.some(([rx, rz, s]) => Math.hypot(x - rx, z - rz) < s * .63)) return true;
  // The moon-gate opening remains traversable.
  const localX = x - 11.6, localZ = z + 8;
  if (Math.abs(localZ) < .58 && Math.abs(localX) > 1.22 && Math.abs(localX) < 3.15) return true;
  return false;
}

