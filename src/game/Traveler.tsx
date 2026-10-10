import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/** Modern playable human: short hair, white T-shirt, dark shorts, trainers and a little sage bag. */
export default function Traveler({ position, moving, direction }: {
  position: React.RefObject<THREE.Vector3>;
  moving: React.RefObject<boolean>;
  direction: React.RefObject<number>;
}) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/traveler.glb`);
  const model = useMemo(()=>(() => {
    const copy = scene.clone(true);
    copy.traverse(object => { if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; } });
    return copy;
  })(),[scene]);
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const legs = useMemo(()=>['Leg_L','Leg_R'].map(n=>model.getObjectByName(n)),[model]);
  const arms = useMemo(()=>['Arm_L','Arm_R'].map(n=>model.getObjectByName(n)),[model]);
  const gait = useRef(0);
  useFrame((_,dt)=>{
    if (!outer.current || !inner.current) return;
    outer.current.position.copy(position.current);
    let delta = direction.current - outer.current.rotation.y;
    delta = Math.atan2(Math.sin(delta),Math.cos(delta));
    outer.current.rotation.y += delta * Math.min(1,dt*9);
    const speed = moving.current ? 1 : 0;
    if(speed)gait.current+=dt*10.5;
    inner.current.position.y = speed ? Math.abs(Math.sin(gait.current))*.065 : Math.sin(gait.current*.35)*.02;
    legs.forEach((v,i)=>{if(v)v.rotation.x=Math.sin(gait.current+i*Math.PI)*.42*speed});
    arms.forEach((v,i)=>{if(v)v.rotation.x=-Math.sin(gait.current+i*Math.PI)*.27*speed});
  });
  return <group ref={outer}><group ref={inner}><primitive object={model} dispose={null}/></group></group>;
}
useGLTF.preload(`${import.meta.env.BASE_URL}models/traveler.glb`);
