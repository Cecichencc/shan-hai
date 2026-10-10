import { useMemo } from 'react';
import { COLORS } from './constants';

function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
export function River() {
  const spots = useMemo(() => Array.from({ length: 40 }, (_, i) => { const z = -63 + i * 3.1; return { x: -15 + 5 * Math.sin(z * 0.068), z }; }), []);
  return <group>{spots.map(({ x, z }, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.035, z]}>
    <circleGeometry args={[4.6, 14]} /><meshStandardMaterial color={COLORS.water} roughness={0.4} metalness={0} />
  </mesh>)}</group>;
}
function Tree({ x, z, pink, scale }: { x: number; z: number; pink: boolean; scale: number }) {
  const c = pink ? COLORS.blossom : COLORS.leaf;
  return <group position={[x, 0, z]} scale={scale}>
    <mesh position={[0, 1.4, 0]}><cylinderGeometry args={[0.42, 0.53, 2.8, 8]}/><meshStandardMaterial color={COLORS.trunk}/></mesh>
    <mesh position={[0, 3.2, 0]} scale={[2.2, 1.58, 2.05]}><sphereGeometry args={[1, 12, 10]}/><meshStandardMaterial color={c}/></mesh>
    <mesh position={[-1.1, 3.0, -0.35]} scale={[1.1, 1.15, 1.25]}><sphereGeometry args={[1, 10, 8]}/><meshStandardMaterial color={pink ? COLORS.paleBlossom : COLORS.leafLight}/></mesh>
    <mesh position={[1.1, 3.0, 0.2]} scale={[1.12, 1.0, 1.2]}><sphereGeometry args={[1, 10, 8]}/><meshStandardMaterial color={c}/></mesh>
  </group>;
}
function Pavilion() {
  return <group position={[-2, 0, -34]}>
    {[-2, 2].flatMap(x => [-2, 2].map(z => <mesh key={`${x}-${z}`} position={[x, 1.9, z]}><cylinderGeometry args={[0.27, 0.27, 3.8, 8]}/><meshStandardMaterial color={COLORS.timber}/></mesh>))}
    <mesh position={[0, 3.85, 0]}><boxGeometry args={[6.4, 0.35, 6.2]}/><meshStandardMaterial color={COLORS.roof}/></mesh>
    <mesh position={[0, 4.35, 0]}><boxGeometry args={[4.1, 0.6, 4.1]}/><meshStandardMaterial color={COLORS.roof}/></mesh>
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[4.1, 4.2, 0.26, 12]}/><meshStandardMaterial color={COLORS.stone}/></mesh>
  </group>;
}
function Bridge() {
  const x = -15 + 5 * Math.sin(-5 * .068);
  return <group position={[x, 0, -5]}>
    <mesh position={[0, .65, 0]}><boxGeometry args={[15, .5, 4.4]}/><meshStandardMaterial color={COLORS.stone}/></mesh>
    {[-1.92, 1.92].flatMap(z => [-6, -3, 0, 3, 6].map(xp => <mesh key={`${xp}-${z}`} position={[xp, 1.37, z]}><cylinderGeometry args={[.22, .22, .95, 8]}/><meshStandardMaterial color={COLORS.stoneDark}/></mesh>))}
    {[-1.92, 1.92].map(z => <mesh key={z} position={[0, 1.9, z]}><boxGeometry args={[14, .15, .18]}/><meshStandardMaterial color={COLORS.stoneDark}/></mesh>)}
  </group>;
}
export function WorldObjects() {
  const random = useMemo(() => rng(52631), []);
  const trees = useMemo(() => Array.from({length: 38}, (_, i) => {
    const x = (random() - .5) * 85, z = (random() - .5) * 94;
    return { id: i, x, z, pink: random() < .40, scale: .6 + random() * .6 };
  }).filter(v => Math.abs(v.x - (-15 + 5 * Math.sin(v.z * .068))) > 7 && Math.hypot(v.x - 8, v.z + 22) > 11 && Math.hypot(v.x - 3, v.z - 22) > 7), [random]);
  const stones = useMemo(() => Array.from({ length: 53 }, (_, i) => {
    const z = 25 - i * 1.12; return { x: 3 + 5*(i/52) + Math.sin(i * .26)*1.2, z, r: Math.sin(i*.4)*.16 };
  }), []);
  return <>
    <mesh position={[0, -1.45, -10]} scale={[65, 1.55, 66]}><sphereGeometry args={[1, 40, 24]}/><meshStandardMaterial color={COLORS.grass} roughness={1}/></mesh>
    <mesh position={[-31, -1, -10]} scale={[18, 4, 22]}><sphereGeometry args={[1, 18, 12]}/><meshStandardMaterial color={COLORS.meadow}/></mesh>
    <mesh position={[38, -1, -20]} scale={[19, 5, 19]}><sphereGeometry args={[1, 18, 12]}/><meshStandardMaterial color={COLORS.softGrass}/></mesh>
    <River/>
    {stones.map((v,i) => <mesh key={i} position={[v.x, .09, v.z]} rotation={[0,v.r,0]}><boxGeometry args={[2.24,.10,1.6]}/><meshStandardMaterial color={i%3===0?COLORS.stone:COLORS.path}/></mesh>)}
    <Bridge/><Pavilion/>
    {trees.map(v=><Tree key={v.id} {...v}/>)}
    {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <mesh key={i} position={[8+Math.cos(a)*8.4,.5,-22+Math.sin(a)*7]} scale={[1.1,.5,.8]}><sphereGeometry args={[1,8,6]}/><meshStandardMaterial color={COLORS.stone}/></mesh>})}
  </>;
}
