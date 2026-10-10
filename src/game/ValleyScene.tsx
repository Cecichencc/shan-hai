import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Dijiang from './Dijiang';
import Traveler from './Traveler';
import { REGION, COLORS } from './constants';
import { isBlocked, terrainHeight, bridgeHeight, WorldObjects } from './WorldObjects';

export type MoveVector = { x: number; z: number };
function CameraAndMovement({ move, onNear, resetToken, paused }: {
  move: React.RefObject<MoveVector>; onNear: (v: boolean) => void; resetToken: number; paused: boolean;
}) {
  const player = useRef(new THREE.Vector3(...REGION.spawn));
  const direction = useRef(0), moving = useRef(false), keys = useRef(new Set<string>());
  const { camera, size } = useThree();
  const elapsed = useRef(0), wasNear = useRef(false), initialized = useRef(false);
  const vectors = useMemo(() => ({ desired: new THREE.Vector3(), target: new THREE.Vector3(), focus: new THREE.Vector3() }), []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('button, input, textarea, [role="dialog"]')) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      keys.current.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const blur = () => { keys.current.clear(); move.current = { x: 0, z: 0 }; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', blur);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur); };
  }, [move]);
  useEffect(() => {
    player.current.set(...REGION.spawn); keys.current.clear(); wasNear.current = false; initialized.current = false; onNear(false);
  }, [resetToken, onNear]);
  useEffect(() => { if (paused) { keys.current.clear(); move.current = { x: 0, z: 0 }; } }, [paused, move]);
  useFrame((_, rawDt) => {
    const dt = Math.min(.05, rawDt), key = keys.current;
    const x = Number(key.has('d') || key.has('arrowright')) - Number(key.has('a') || key.has('arrowleft')) + move.current.x;
    const z = Number(key.has('s') || key.has('arrowdown')) - Number(key.has('w') || key.has('arrowup')) + move.current.z;
    const mag = Math.hypot(x, z), active = !paused && mag > .08;
    moving.current = active;
    if (active) {
      const v = (key.has('shift') ? 6.4 : 4.3) * dt / Math.max(1, mag);
      const xx = THREE.MathUtils.clamp(player.current.x + x * v, REGION.bounds.minX, REGION.bounds.maxX);
      const zz = THREE.MathUtils.clamp(player.current.z + z * v, REGION.bounds.minZ, REGION.bounds.maxZ);
      if (!isBlocked(xx, player.current.z)) player.current.x = xx;
      if (!isBlocked(player.current.x, zz)) player.current.z = zz;
      direction.current = Math.atan2(-x, -z);
    }
    const x0 = player.current.x, z0 = player.current.z;
    const ground = bridgeHeight(x0, z0) ?? terrainHeight(x0, z0);
    player.current.y = THREE.MathUtils.lerp(player.current.y, ground, Math.min(1, dt * 15));
    const mobile = size.width < 680;
    vectors.target.set(x0 * .63 - .4, .65, z0 * .58 - (mobile ? 2.4 : 3.2));
    if (!initialized.current) { vectors.focus.copy(vectors.target); initialized.current = true; }
    vectors.focus.lerp(vectors.target, Math.min(1, dt * 3));
    vectors.desired.set(vectors.focus.x + (mobile ? 5.5 : 9.5), vectors.focus.y + (mobile ? 22 : 21), vectors.focus.z + (mobile ? 23 : 24));
    camera.position.copy(vectors.desired); camera.lookAt(vectors.focus);
    elapsed.current += dt;
    if (elapsed.current > .12) {
      elapsed.current = 0;
      const near = Math.hypot(x0 - REGION.dijiang[0], z0 - REGION.dijiang[2]) < REGION.encounterDistance;
      if (near !== wasNear.current) { wasNear.current = near; onNear(near); }
    }
  });
  return <Traveler position={player} moving={moving} direction={direction} />;
}
function FirstFrameReady({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => { if (++frames.current === 4) onReady(); });
  return null;
}
export default function ValleyScene({ move, onNear, resetToken, onReady, near = false, paused = false }: {
  move: React.RefObject<MoveVector>; onNear: (v: boolean) => void; resetToken: number; onReady: () => void; near?: boolean; paused?: boolean;
}) {
  return <Canvas shadows dpr={[1, 1.4]} camera={{ position: [10, 22, 28], fov: 37, near: .1, far: 130 }}
    gl={{ antialias: true, alpha: false, powerPreference: 'low-power', toneMapping: THREE.ACESFilmicToneMapping }}
    onCreated={({ gl }) => { gl.setClearColor(COLORS.sky); gl.toneMappingExposure = 1; gl.shadowMap.type = THREE.PCFSoftShadowMap; }}>
    <color attach="background" args={[COLORS.sky]} /><fog attach="fog" args={[COLORS.sky, 60, 108]} />
    <hemisphereLight args={['#fff7e7', '#a1b89c', 1.1]} />
    <directionalLight position={[-12, 24, 15]} intensity={2.4} color="#fff3d8" castShadow
      shadow-mapSize={[2048, 2048]} shadow-camera-left={-25} shadow-camera-right={25}
      shadow-camera-top={24} shadow-camera-bottom={-24} shadow-camera-near={1} shadow-camera-far={75}
      shadow-normalBias={.035} shadow-bias={-.0002} shadow-radius={3} />
    <Suspense fallback={null}>
      <WorldObjects /><Dijiang close={near} />
      <CameraAndMovement move={move} onNear={onNear} resetToken={resetToken} paused={paused} />
      <FirstFrameReady onReady={onReady} />
    </Suspense>
  </Canvas>;
}
