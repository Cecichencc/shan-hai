import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, KEY_ANATOMY, REGION } from './constants';

// Phase 0 procedural proxy. Final art/rigging will replace this model in Phase 2.
// Don't add eyes, ears, nose or mouth: the creature is intentionally faceless.
export default function Dijiang() {
  const bodyRef = useRef<THREE.Group>(null);
  const wingRef = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (bodyRef.current) bodyRef.current.position.y = Math.sin(t * 1.8) * .10;
    wingRef.current.forEach((wing, i) => { if (wing) wing.rotation.z = Math.sin(t * 2.8 + i * 1.4) * .16; });
  });
  return <group position={REGION.dijiang}><group ref={bodyRef}>
    {Array.from({length: KEY_ANATOMY.legs},(_,i)=>{
      const side = i%2===0 ? -1:1, row=Math.floor(i/2);
      return <group key={`leg-${i}`} position={[side*1.18,.68,(row-1)*1.12]}>
        <mesh><sphereGeometry args={[.61,12,10]}/><meshStandardMaterial color={COLORS.ivory}/></mesh>
        <mesh position={[0,-.46,0]}><sphereGeometry args={[.59,12,8]}/><meshStandardMaterial color={COLORS.cinnabar}/></mesh>
      </group>;
    })}
    <mesh position={[0,2.12,0]} scale={[2.16,1.80,1.92]}><sphereGeometry args={[1,22,16]}/><meshStandardMaterial color={COLORS.ivory} roughness={1}/></mesh>
    {Array.from({length:15},(_,i)=>{const a=i*2.399,r=(i%5)*.31;return <mesh key={`fluff-${i}`} position={[Math.cos(a)*r,3.50+Math.sin(i)*.16,Math.sin(a)*r]} scale={[.34,.42,.55]}><sphereGeometry args={[1,8,6]}/><meshStandardMaterial color={i%4===0?COLORS.orange:COLORS.ivory}/></mesh>})}
    {Array.from({length:KEY_ANATOMY.wings},(_,i)=>{
      const side=i%2===0?-1:1,upper=i<2;
      return <group key={`wing-${i}`} ref={el=>{wingRef.current[i]=el;}} position={[side*1.85,upper?3.0:2.35,upper?.50:-.75]} rotation={[0,side*.17,side*.22]}>
        {Array.from({length:5},(_,j)=><mesh key={j} position={[side*(.42+j*.23),(j-2)*.32,0]} rotation={[0,0,side*(j-2)*.10]} scale={[.75,.28,.48]}><sphereGeometry args={[1,10,8]}/><meshStandardMaterial color={j%2===0?COLORS.cinnabar:COLORS.orange}/></mesh>)}
      </group>;
    })}
  </group></group>;
}
