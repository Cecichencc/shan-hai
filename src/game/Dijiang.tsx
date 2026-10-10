import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { REGION } from './constants';
import { terrainHeight } from './WorldObjects';

/** Production-format, independently animated GLB model. Six articulated legs, four wings, no facial features. */
export default function Dijiang({ close = false }: { close?: boolean }) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/dijiang.glb`);
  const model = useMemo(() => scene.clone(true), [scene]);
  const parent = useRef<THREE.Group>(null);
  const wings = useMemo(() => ['Wing_L_Upper', 'Wing_R_Upper', 'Wing_L_Lower', 'Wing_R_Lower'].map(n => model.getObjectByName(n)), [model]);
  const legs = useMemo(() => ['Leg_L_1', 'Leg_R_1', 'Leg_L_2', 'Leg_R_2', 'Leg_L_3', 'Leg_R_3'].map(n => model.getObjectByName(n)), [model]);
  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime(), excitement = close ? 1 : .36;
    if(parent.current) {
      parent.current.position.y = terrainHeight(REGION.dijiang[0],REGION.dijiang[2]) + Math.sin(t*1.6)*.065 + (close ? Math.max(0,Math.sin(t*4.8))*.11 : 0);
      parent.current.rotation.y += dt*.11;
    }
    wings.forEach((wing, i) => {
      if (!wing) return;
      const s = i%2 === 0 ? -1 : 1;
      wing.rotation.z = s * (.04 + Math.sin(t*(close ? 5.4 : 2.25) + i*.6) * .13 * excitement);
      wing.rotation.y = Math.cos(t*2.4+i)*.045*excitement;
    });
    legs.forEach((leg, i) => {
      if(leg) leg.rotation.x = (close ? Math.sin(t*4.8 + (i%2)*Math.PI + Math.floor(i/2)*.9)*.10 : Math.sin(t*1.15 + i)*.012);
    });
  });
  return <group ref={parent} position={[REGION.dijiang[0], 0, REGION.dijiang[2]]}>
    <primitive object={model} dispose={null} />
  </group>;
}
useGLTF.preload(`${import.meta.env.BASE_URL}models/dijiang.glb`);
