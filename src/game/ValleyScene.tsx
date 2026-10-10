import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Dijiang from './Dijiang';
import Traveler from './Traveler';
import { REGION, COLORS } from './constants';
import { WorldObjects } from './WorldObjects';

export type MoveVector = { x: number; z: number };
function CameraAndMovement({ move, onNear, resetToken }: {move: React.RefObject<MoveVector>;onNear: (v:boolean)=>void;resetToken:number}) {
  const player = useRef(new THREE.Vector3(...REGION.spawn));const moving=useRef(false);
  const keys=useRef(new Set<string>());const {camera}=useThree();const elapsed=useRef(0);const wasNear=useRef(false);
  useEffect(()=>{const down=(e:KeyboardEvent)=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.current.add(e.key.toLowerCase());};const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());const blur=()=>keys.current.clear();window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);}},[]);
  useEffect(()=>{player.current.set(...REGION.spawn);},[resetToken]);
  useFrame((_,dt)=>{const key=keys.current;
    const x=Number(key.has('d')||key.has('arrowright'))-Number(key.has('a')||key.has('arrowleft'))+move.current.x;
    const z=Number(key.has('s')||key.has('arrowdown'))-Number(key.has('w')||key.has('arrowup'))+move.current.z;
    const magnitude=Math.hypot(x,z);moving.current=magnitude>.07;
    if(moving.current){const velocity=key.has('shift')?12:8;player.current.x+=x/Math.max(1,magnitude)*dt*velocity;player.current.z+=z/Math.max(1,magnitude)*dt*velocity;player.current.x=THREE.MathUtils.clamp(player.current.x,REGION.bounds.minX,REGION.bounds.maxX);player.current.z=THREE.MathUtils.clamp(player.current.z,REGION.bounds.minZ,REGION.bounds.maxZ);}
    const desired = new THREE.Vector3(player.current.x+(window.innerWidth<680?5:13),12,player.current.z+19);camera.position.lerp(desired,Math.min(1,dt*3));camera.lookAt(player.current.x,1.4,player.current.z-9);
    elapsed.current+=dt;if(elapsed.current>.2){elapsed.current=0;const near=Math.hypot(player.current.x-REGION.dijiang[0],player.current.z-REGION.dijiang[2])<REGION.encounterDistance;if(near!==wasNear.current){wasNear.current=near;onNear(near)}}
  });
  return <Traveler position={player} moving={moving}/>;
}
function FirstFrameReady({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => { if (++frames.current === 3) onReady(); });
  return null;
}
export default function ValleyScene({move,onNear,resetToken,onReady}:{move:React.RefObject<MoveVector>;onNear:(v:boolean)=>void;resetToken:number;onReady:()=>void}){
  return <Canvas dpr={[1,1.5]} camera={{position:[16,12,41],fov:50,near:.1,far:200}} gl={{antialias:true,powerPreference:'high-performance'}}>
    <color attach="background" args={[COLORS.sky]}/><fog attach="fog" args={[COLORS.sky,70,155]}/>
    <ambientLight intensity={1.45}/><directionalLight intensity={1.6} position={[-20,40,30]}/>
    <WorldObjects/><Dijiang/><CameraAndMovement move={move} onNear={onNear} resetToken={resetToken}/><FirstFrameReady onReady={onReady}/>
  </Canvas>;
}
