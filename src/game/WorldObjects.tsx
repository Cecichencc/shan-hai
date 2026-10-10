import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { COLORS } from './constants';

import { STREAM_CENTER, PATH_CENTER, BRIDGE_X, BRIDGE_Z, terrainHeight, TREES, ROCKS } from './world-layout';
export { isBlocked, terrainHeight, bridgeHeight } from './world-layout';

function landGeometry() {
  const g = new THREE.PlaneGeometry(68, 68, 36, 36); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) p.setY(i, terrainHeight(p.getX(i), p.getZ(i)) - .09);
  g.computeVertexNormals(); return g;
}
function ribbon(points: [number, number][], width: number, lift: number) {
  const v: number[] = [], indices: number[] = [];
  points.forEach(([x, z], i) => {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1;
    for (const side of [-1, 1]) {
      const xx = x + side * dz / l * width / 2, zz = z - side * dx / l * width / 2;
      v.push(xx, terrainHeight(xx, zz) + lift, zz);
    }
    if (i < points.length - 1) { const q = 2 * i; indices.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); }
  });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.setIndex(indices); g.computeVertexNormals(); return g;
}
function RiverAndPath() {
  const shapes = useMemo(() => {
    const river: [number, number][] = Array.from({ length: 100 }, (_, i) => { const x = -34 + i * 68 / 99; return [x, STREAM_CENTER(x)]; });
    const path: [number, number][] = Array.from({ length: 72 }, (_, i) => { const z = 20 - i * 31 / 71; return [PATH_CENTER(z), z]; });
    const before = path.filter(p => p[1] > BRIDGE_Z + 3.25), after = path.filter(p => p[1] < BRIDGE_Z - 3.25);
    return { bank: ribbon(river, 4.8, -.025), edge: ribbon(river, 4.15, .005), water: ribbon(river, 3.8, .018), paths: [ribbon(before, 2.7, .013), ribbon(after, 2.8, .013)] };
  }, []);
  return <group>
    <mesh geometry={shapes.bank} receiveShadow><meshStandardMaterial color="#99bf77" /></mesh>
    <mesh geometry={shapes.edge}><meshStandardMaterial color="#86d5ca" roughness={.9} /></mesh>
    <mesh geometry={shapes.water} receiveShadow><meshStandardMaterial color={COLORS.water} roughness={.72} /></mesh>
    {shapes.paths.map((g, i) => <mesh key={i} geometry={g} receiveShadow><meshStandardMaterial color={COLORS.path} /></mesh>)}
    {[-11, -8, -5, 1.6, 5, 9.5, 13].map((x, i) => <Ripple key={x} x={x} z={STREAM_CENTER(x) + (i % 2 ? .65 : -.62)} />)}
    {[14, 11.7, 9.2, 6.9, -3.8, -7.9, -10].map((z, i) => <mesh key={z} position={[PATH_CENTER(z) + (i % 2 ? .48 : -.50), terrainHeight(PATH_CENTER(z), z) + .045, z]} rotation={[0, i * .74, 0]} scale={[.46, .085, .34]} receiveShadow castShadow>
      <dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={i % 2 ? '#e4d8bb' : '#eee4c9'} flatShading />
    </mesh>)}
  </group>;
}
function Ripple({ x, z }: { x: number; z: number }) {
  const g = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.63, 0, -.10), new THREE.Vector3(-.21, 0, .02), new THREE.Vector3(.22, 0, .04), new THREE.Vector3(.51, 0, -.02),
  ]), 12, .024, 4, false), []);
  return <mesh geometry={g} position={[x, terrainHeight(x, z) + .045, z]}><meshBasicMaterial color={COLORS.waterHighlight} /></mesh>;
}
function Branch({ a, b, radius }: { a: [number, number, number]; b: [number, number, number]; radius: number }) {
  const transform = useMemo(() => {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), direction = end.clone().sub(start);
    return { length: direction.length(), middle: start.add(end).multiplyScalar(.5), rotation: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()) };
  }, [a, b]);
  return <mesh position={transform.middle} quaternion={transform.rotation} castShadow>
    <cylinderGeometry args={[radius * .65, radius, transform.length, 7]} /><meshStandardMaterial color={COLORS.trunk} />
  </mesh>;
}
function Tree({ entry }: { entry: typeof TREES[number] }) {
  const [x, z, s, pink] = entry;
  const crowns: Array<[number, number, number, number]> = [[-.8, 2.75, 0, 1.08], [.75, 3.06, -.18, 1.13], [.07, 3.75, -.03, 1.03], [0, 2.9, .65, .91], [-.4, 3.36, -.7, .88]];
  return <group position={[x, terrainHeight(x, z), z]} scale={s}>
    <Branch a={[0, 0, 0]} b={[.15, 2.5, -.06]} radius={.32} />
    <Branch a={[.05, 1.2, 0]} b={[-.9, 2.7, .02]} radius={.20} />
    <Branch a={[.1, 1.8, 0]} b={[.8, 3, -.17]} radius={.19} />
    {crowns.map(([cx, cy, cz, size], i) => <mesh key={i} position={[cx, cy, cz]} scale={[size, size * .79, size * .92]} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 2]} /><meshStandardMaterial color={pink ? (i % 2 ? COLORS.blossom : COLORS.paleBlossom) : (i % 2 ? COLORS.leaf : COLORS.leafLight)} roughness={1} />
    </mesh>)}
  </group>;
}
const BEDS: Array<[number, number, number]> = [
  [-4.6, 7, 1.1], [1.1, 8.9, .82], [5.7, 13.6, 1], [-7.6, 10.5, 1], [6, 6.1, .9],
  [-5, -2, .9], [-6.9, -5.1, 1], [-.6, -8.1, .9], [5.6, -8, .8],
  [10.9, -11.5, .9], [13.7, -3.1, 1.1], [7.5, -.3, .9], [-10.6, -.8, .7],
  [-11.5, 5.2, 1.1], [11.6, 8.1, 1.0], [-4.3, -12.2, 1.0],
];
function Flowers() {
  const bushes = useRef<THREE.InstancedMesh>(null), petals = useRef<THREE.InstancedMesh>(null), centers = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D(); let p = 0, c = 0, b = 0;
    for (const [x, z, scale] of BEDS) {
      for (let k = 0; k < 4; k++) {
        const a = k * 2.4, xx = x + Math.cos(a) * .40 * scale, zz = z + Math.sin(a) * .35 * scale;
        dummy.position.set(xx, terrainHeight(xx, zz) + .29 * scale, zz); dummy.scale.set(.51 * scale, (.36 + k % 2 * .1) * scale, .47 * scale); dummy.rotation.set(0, a, 0); dummy.updateMatrix();
        bushes.current!.setMatrixAt(b, dummy.matrix); bushes.current!.setColorAt(b++, new THREE.Color(k % 2 ? '#86b85b' : '#a4c768'));
      }
      for (let k = 0; k < 3; k++) {
        const a = k * 2.2, xx = x + Math.cos(a) * .47 * scale, zz = z + Math.sin(a) * .36 * scale;
        const y = terrainHeight(xx, zz) + .65 * scale;
        for (let j = 0; j < 5; j++) {
          const angle = j * Math.PI * 2 / 5;
          dummy.position.set(xx + Math.cos(angle) * .12, y, zz + Math.sin(angle) * .12); dummy.rotation.set(0, angle, 0); dummy.scale.set(.13, .052, .078); dummy.updateMatrix();
          petals.current!.setMatrixAt(p, dummy.matrix); petals.current!.setColorAt(p++, new THREE.Color(k % 2 ? '#f5a6ab' : '#fff4d9'));
        }
        dummy.position.set(xx, y + .028, zz); dummy.scale.set(.068, .048, .068); dummy.updateMatrix(); centers.current!.setMatrixAt(c++, dummy.matrix);
      }
    }
    for (const ref of [bushes, petals, centers]) { ref.current!.instanceMatrix.needsUpdate = true; if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true; }
  }, []);
  return <group>
    <instancedMesh ref={bushes} args={[undefined, undefined, BEDS.length * 4]} castShadow receiveShadow><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial roughness={1} /></instancedMesh>
    <instancedMesh ref={petals} args={[undefined, undefined, BEDS.length * 15]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial roughness={1} /></instancedMesh>
    <instancedMesh ref={centers} args={[undefined, undefined, BEDS.length * 3]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#efbd53" roughness={1} /></instancedMesh>
  </group>;
}
function archBeam(x: number, width: number, height: number, lift: number) {
  const vertices: number[] = [], indices: number[] = [], count = 28;
  for (let i = 0; i <= count; i++) {
    const z = -3.6 + i * 7.2 / count, y = .12 + .85 * (1 - (z / 3.65) ** 2) + lift;
    vertices.push(x - width / 2, y, z, x + width / 2, y, z, x - width / 2, y - height, z, x + width / 2, y - height, z);
    if (i < count) {
      const a = i * 4, b = a + 4;
      indices.push(a, b, a + 1, a + 1, b, b + 1, a + 2, a + 3, b + 2, a + 3, b + 3, b + 2,
        a, a + 2, b, a + 2, b + 2, b, a + 1, b + 1, a + 3, a + 3, b + 1, b + 3);
    }
  }
  indices.push(0, 1, 2, 1, 3, 2);
  const q = count * 4; indices.push(q, q + 2, q + 1, q + 1, q + 2, q + 3);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));g.setIndex(indices);g.computeVertexNormals();return g;
}
function StoneBridge() {
  const parts = useMemo(() => ({ deck: archBeam(0, 3.65, .3, 0), rails: [-1, 1].map(s => archBeam(s * 1.88, .17, .16, .88)), edges: [-1, 1].map(s => archBeam(s * 1.84, .23, .45, -.05)) }), []);
  return <group position={[BRIDGE_X, 0, BRIDGE_Z]}>
    {[parts.deck, ...parts.edges, ...parts.rails].map((g, i) => <mesh key={i} geometry={g} castShadow receiveShadow><meshStandardMaterial color={i === 0 ? '#f0e6cd' : COLORS.stone} /></mesh>)}
    {[-1, 1].flatMap(side => [-3.2, -1.05, 1.05, 3.2].map(z => {
      const y = .12 + .85 * (1 - (z / 3.65) ** 2);
      return <group key={`${side}:${z}`} position={[side * 1.87, y, z]}>
        <mesh position={[0, .43, 0]} castShadow><boxGeometry args={[.25, .86, .25]} /><meshStandardMaterial color={COLORS.stone} /></mesh>
        <mesh position={[0, .93, 0]} castShadow><sphereGeometry args={[.18, 12, 8]} /><meshStandardMaterial color="#f1e8d0" /></mesh>
      </group>;
    }))}
    {[-1, 1].flatMap(side => [0, 1, 2, 3].map(i => {
      const z = side * (2.30 + i * .32), y = .12 + .85 * (1 - (z / 3.65) ** 2);
      return <mesh key={`step:${side}:${i}`} position={[0, y - .04, z]} receiveShadow><boxGeometry args={[3.43, .09, .33]} /><meshStandardMaterial color={i % 2 ? '#ede3c9' : '#e8dec4'} /></mesh>;
    }))}
  </group>;
}
function roofGeometry() {
  const v: number[] = [], idx: number[] = [], n = 24;
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
    const u = i / n * 2 - 1, w = j / n * 2 - 1, r = Math.max(Math.abs(u), Math.abs(w));
    const y = 1.43 * (1 - Math.pow(r, .62)) + .47 * Math.pow(r, 7) * (.35 + .65 * Math.abs(u * w));
    v.push(u * 3.0, y, w * 2.9);
    if (i < n && j < n) { const a = i * (n + 1) + j, b = a + n + 1; idx.push(a, a + 1, b, a + 1, b + 1, b); }
  }
  const g = new THREE.BufferGeometry();g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function Pavilion() {
  const roof = useMemo(roofGeometry, []);
  return <group position={[7.8, 0, -10.5]}>
    <mesh position={[0, .17, 0]} receiveShadow><boxGeometry args={[4.8, .34, 4.8]} /><meshStandardMaterial color={COLORS.stone} /></mesh>
    {[0, 1].map(i => <mesh key={i} position={[0, .08 + i * .08, 2.95 - i * .32]} receiveShadow><boxGeometry args={[2.2, .16 + i * .16, .7]} /><meshStandardMaterial color="#ded5ba" /></mesh>)}
    {[-1, 1].flatMap(x => [-1, 1].map(z => <group key={`${x}:${z}`} position={[x * 1.8, 0, z * 1.8]}>
      <mesh position={[0, 1.95, 0]} castShadow><cylinderGeometry args={[.145, .17, 3.35, 10]} /><meshStandardMaterial color={COLORS.timber} /></mesh>
      <mesh position={[0, .42, 0]} castShadow><boxGeometry args={[.4, .3, .4]} /><meshStandardMaterial color="#e6d7bb" /></mesh>
    </group>))}
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 1.8, 3.49, 0]} castShadow><boxGeometry args={[.2, .25, 3.9]} /><meshStandardMaterial color="#935a42" /></mesh>
      <mesh position={[0, 3.49, side * 1.8]} castShadow><boxGeometry args={[3.9, .25, .2]} /><meshStandardMaterial color="#935a42" /></mesh>
      <mesh position={[side * 1.8, .95, 0]} castShadow><boxGeometry args={[.16, .13, 3.6]} /><meshStandardMaterial color={COLORS.timber} /></mesh>
    </group>)}
    <mesh geometry={roof} position={[0, 3.65, 0]} castShadow receiveShadow><meshStandardMaterial color={COLORS.roof} side={THREE.DoubleSide} roughness={.85} /></mesh>
    <mesh geometry={roof} position={[0, 3.58, 0]} scale={[1.027, 1, 1.027]} castShadow><meshStandardMaterial color="#6da8a5" side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 5.17, 0]} scale={[.16, .27, .16]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#74aba4" /></mesh>
  </group>;
}
function MoonGate() {
  const geometry = useMemo(() => {
    const outline = new THREE.Shape();outline.moveTo(-3.1, 0);outline.lineTo(3.1, 0);outline.lineTo(3.1, 4.4);outline.quadraticCurveTo(0, 3.6, -3.1, 4.4);outline.closePath();
    const hole = new THREE.Path();hole.absarc(0, 1.65, 1.62, 0, Math.PI * 2, true);outline.holes.push(hole);
    return new THREE.ExtrudeGeometry(outline, { depth: .35, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .07, bevelThickness: .07, curveSegments: 32 });
  }, []);
  const top = useMemo(() => new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-3.12, 4.4, .17), new THREE.Vector3(0, 3.6, .17), new THREE.Vector3(3.12, 4.4, .17)), 24, .13, 6, false), []);
  return <group position={[11.6, .02, -8]}>
    <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial color="#f1e6c9" /></mesh>
    <mesh geometry={top} castShadow><meshStandardMaterial color="#64969a" /></mesh>
  </group>;
}
function Lantern({ x, z }: { x: number; z: number }) {
  return <group position={[x, terrainHeight(x, z), z]}>
    <mesh position={[0, .13, 0]} castShadow receiveShadow><boxGeometry args={[.73, .26, .73]} /><meshStandardMaterial color={COLORS.stoneDark} /></mesh>
    <mesh position={[0, .66, 0]} castShadow><cylinderGeometry args={[.16, .22, .83, 8]} /><meshStandardMaterial color={COLORS.stone} /></mesh>
    <mesh position={[0, 1.24, 0]}><boxGeometry args={[.43, .51, .43]} /><meshStandardMaterial color="#ffe4a4" emissive="#edba63" emissiveIntensity={.3} /></mesh>
    {[-1, 1].flatMap(x0 => [-1, 1].map(z0 => <mesh key={`${x0}:${z0}`} position={[x0 * .25, 1.24, z0 * .25]} castShadow><boxGeometry args={[.09, .67, .09]} /><meshStandardMaterial color={COLORS.stone} /></mesh>))}
    <mesh position={[0, 1.62, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[.57, .33, 4]} /><meshStandardMaterial color={COLORS.stoneDark} /></mesh>
    <mesh position={[0, 1.86, 0]} castShadow><sphereGeometry args={[.1, 10, 6]} /><meshStandardMaterial color={COLORS.stone} /></mesh>
  </group>;
}
function Mountains() {
  return <group>{[[-21, -25, 9, 5], [-5, -30, 11, 7], [13, -28, 10, 5.5], [25, -22, 9, 5]].map(([x, z, s, h], i) => <mesh key={i} position={[x, h * .15, z]} scale={[s, h, s * .7]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={i % 2 ? '#a1c7b1' : '#b5d4ba'} roughness={1} /></mesh>)}</group>;
}
export function WorldObjects() {
  const land = useMemo(landGeometry, []);
  return <group>
    <mesh geometry={land} receiveShadow><meshStandardMaterial color={COLORS.grass} roughness={1} /></mesh>
    <Mountains /><RiverAndPath /><StoneBridge /><Pavilion /><MoonGate />
    {TREES.map((entry, i) => <Tree key={i} entry={entry} />)}
    {ROCKS.map(([x, z, s], i) => <mesh key={i} position={[x, terrainHeight(x, z) + .40 * s, z]} rotation={[.1, i * .8, .13]} scale={[s, s * .69, s * .8]} castShadow receiveShadow><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={i % 2 ? '#a7b6af' : '#b9c2b7'} flatShading /></mesh>)}
    <Flowers /><Lantern x={-4.3} z={5.8} /><Lantern x={.55} z={-2.5} />
  </group>;
}
