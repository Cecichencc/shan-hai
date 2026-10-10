import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from './constants';

export default function Traveler({ position, moving }: { position: React.RefObject<THREE.Vector3>; moving: React.RefObject<boolean> }) {
  const group = useRef<THREE.Group>(null);const gait = useRef<THREE.Group>(null);
  useFrame(({ clock })=>{
    if (!group.current) return;
    group.current.position.copy(position.current);
    if(gait.current) gait.current.position.y = moving.current ? Math.abs(Math.sin(clock.elapsedTime*9))*.12 : Math.sin(clock.elapsedTime*2)*.025;
  });
  return <group ref={group}><group ref={gait}>
    {[-.31,.31].map(x=><group key={x}><mesh position={[x,.69,0]}><cylinderGeometry args={[.22,.23,.82,9]}/><meshStandardMaterial color={COLORS.skin}/></mesh><mesh position={[x,.23,.07]} scale={[.29,.25,.48]}><sphereGeometry args={[1,10,8]}/><meshStandardMaterial color={COLORS.shoe}/></mesh></group>)}
    <mesh position={[0,1.20,0]}><boxGeometry args={[1.5,.75,.95]}/><meshStandardMaterial color={COLORS.shorts}/></mesh>
    <mesh position={[0,1.94,0]}><boxGeometry args={[1.72,1.25,.92]}/><meshStandardMaterial color="#fffaf0"/></mesh>
    {[-.98,.98].map(x=><mesh key={x} position={[x,1.86,0]}><cylinderGeometry args={[.2,.20,1.12,9]}/><meshStandardMaterial color={COLORS.skin}/></mesh>)}
    <mesh position={[0,2.85,0]} scale={[.75,.73,.67]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color={COLORS.skin}/></mesh>
    <mesh position={[0,3.19,.08]} scale={[.83,.41,.70]}><sphereGeometry args={[1,13,9]}/><meshStandardMaterial color={COLORS.hair}/></mesh>
    {[-.47,.40].map(x=><mesh key={x} position={[x,2.91,-.15]} scale={[.33,.38,.31]}><sphereGeometry args={[1,11,8]}/><meshStandardMaterial color={COLORS.hair}/></mesh>)}
    <mesh position={[.69,1.72,.32]}><boxGeometry args={[.72,.8,.35]}/><meshStandardMaterial color={COLORS.bag}/></mesh>
  </group></group>;
}
