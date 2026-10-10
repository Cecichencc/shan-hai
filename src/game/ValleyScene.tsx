import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Dijiang from './Dijiang';
import Traveler from './Traveler';
import { REGION, COLORS } from './constants';
import { isBlocked, terrainHeight, WorldObjects, STREAM_CENTER, PATH_CENTER } from './WorldObjects';

export type MoveVector = { x: number; z: number };
function CameraAndMovement({ move, onNear, resetToken, paused }: {
  move: React.RefObject<MoveVector>; onNear: (v: boolean) => void;resetToken: number;paused: boolean;
}) {
  const player = useRef(new THREE.Vector3(...REGION.spawn));
  const direction = useRef(0), moving = useRef(false), keys = useRef(new Set<string>());
  const { camera } = useThree(), elapsed = useRef(0), wasNear = useRef(false);
  useEffect(()=>{
    const down=(e:KeyboardEvent)=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.current.add(e.key.toLowerCase());};
    const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());const blur=()=>keys.current.clear();
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur)};
  },[]);
  useEffect(()=>{player.current.set(...REGION.spawn);keys.current.clear();wasNear.current=false;onNear(false);},[resetToken,onNear]);
  useFrame((_,rawDt)=>{
    const dt=Math.min(.07,rawDt),key=keys.current;
    const x=(Number(key.has('d')||key.has('arrowright'))-Number(key.has('a')||key.has('arrowleft')))+move.current.x;
    const z=(Number(key.has('s')||key.has('arrowdown'))-Number(key.has('w')||key.has('arrowup')))+move.current.z;
    const mag=Math.hypot(x,z), active=!paused&&mag>.08;
    moving.current=active;
    if(active){
      const v=(key.has('shift')?8.2:5.1)*dt/Math.max(1,mag);
      const xx=THREE.MathUtils.clamp(player.current.x+x*v,REGION.bounds.minX,REGION.bounds.maxX);
      const zz=THREE.MathUtils.clamp(player.current.z+z*v,REGION.bounds.minZ,REGION.bounds.maxZ);
      // Independent axial movement lets the traveler slide past the river edge and pavilion.
      if(!isBlocked(xx,player.current.z))player.current.x=xx;
      if(!isBlocked(player.current.x,zz))player.current.z=zz;
      direction.current=Math.atan2(-x,-z);
    }
    const x0=player.current.x,z0=player.current.z;
    const onBridge=Math.abs(x0-PATH_CENTER(0))<2.75 && Math.abs(z0-STREAM_CENTER(x0))<6.3;
    let ground=terrainHeight(x0,z0);
    if(onBridge){const local=Math.abs(z0-STREAM_CENTER(x0)), elevated=.27+Math.sin(Math.PI*Math.max(0,1-local/6.3))*1.04;ground=Math.max(ground,elevated);}
    player.current.y=THREE.MathUtils.lerp(player.current.y,ground,Math.min(1,dt*10));
    const mobile=window.innerWidth<680;
    const desired=new THREE.Vector3(x0+(mobile?3.8:6.6),player.current.y+(mobile?7.3:8.4),z0+(mobile?11.8:13.5));
    camera.position.lerp(desired,Math.min(1,dt*3.2));
    const target=new THREE.Vector3(x0,player.current.y+1.35,z0-5.1);
    camera.lookAt(target);
    elapsed.current+=dt;
    if(elapsed.current>.16){
      elapsed.current=0;
      const near=Math.hypot(x0-REGION.dijiang[0],z0-REGION.dijiang[2])<REGION.encounterDistance;
      if(near!==wasNear.current){wasNear.current=near;onNear(near)}
    }
  });
  return <Traveler position={player} moving={moving} direction={direction}/>;
}
function FirstFrameReady({ onReady }: {onReady:()=>void}) {
  const frames=useRef(0);
  useFrame(()=>{if(++frames.current===4)onReady();});
  return null;
}
export default function ValleyScene({move,onNear,resetToken,onReady,paused=false}: {
  move:React.RefObject<MoveVector>;onNear:(v:boolean)=>void;resetToken:number;onReady:()=>void;paused?:boolean;
}){
  return <Canvas
    dpr={[1,Math.min(window.devicePixelRatio||1,1.4)]}
    camera={{position:[8,9,42],fov:51,near:.1,far:180}}
    gl={{antialias:true,alpha:false,powerPreference:'low-power',preserveDrawingBuffer:false}}
    onCreated={({gl})=>gl.setClearColor(COLORS.sky)}>
    <color attach="background" args={[COLORS.sky]}/><fog attach="fog" args={[COLORS.sky,68,142]}/>
    <hemisphereLight args={['#fffdf0','#8ab7ad',2.15]}/>
    <directionalLight intensity={2.1} color="#fff6d9" position={[-24,32,15]}/>
    <Suspense fallback={null}>
      <WorldObjects/>
      <Dijiang/>
      <CameraAndMovement move={move} onNear={onNear} resetToken={resetToken} paused={paused}/>
      <FirstFrameReady onReady={onReady}/>
    </Suspense>
  </Canvas>;
}
