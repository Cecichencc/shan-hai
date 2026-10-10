import { Component, useCallback, useEffect, useRef, useState, type ReactNode, type ErrorInfo } from 'react';
import ValleyScene, { type MoveVector } from './game/ValleyScene';

type Sheet = 'encounter' | 'map' | null;
type GraphicsState = 'checking' | 'starting' | 'ready' | 'unsupported' | 'lost' | 'error';

/** A WebGL error should never erase the entire game screen. */
class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Shan Hai renderer crashed:', error, info);
    this.props.onError();
  }
  render() { return this.state.failed ? null : this.props.children; }
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { powerPreference: 'low-power' }) || canvas.getContext('webgl', { powerPreference: 'low-power' });
    if (!gl) return false;
    const lost = gl.isContextLost();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !lost;
  } catch (error) {
    console.warn('Shan Hai graphics preflight failed:', error);
    return false;
  }
}

export default function App() {
  const movement = useRef<MoveVector>({ x: 0, z: 0 });
  const pad = useRef<HTMLDivElement>(null);
  const [graphics, setGraphics] = useState<GraphicsState>('checking');
  const [near, setNear] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [resetToken, setResetToken] = useState(0);
  const onNear = useCallback((value: boolean) => setNear(value), []);
  const onFrameReady = useCallback(() => setGraphics('ready'), []);
  const onSceneError = useCallback(() => setGraphics('error'), []);
  const playable = graphics === 'ready';

  useEffect(() => {
    setGraphics(canUseWebGL() ? 'starting' : 'unsupported');
    const lost = (event: Event) => {
      event.preventDefault();
      setGraphics('lost');
    };
    window.addEventListener('webglcontextlost', lost, true);
    return () => window.removeEventListener('webglcontextlost', lost, true);
  }, []);

  useEffect(() => {
    if (graphics !== 'starting') return;
    const timeout = window.setTimeout(() => setGraphics(current => current === 'starting' ? 'error' : current), 8000);
    return () => window.clearTimeout(timeout);
  }, [graphics]);

  useEffect(() => {
    if (!playable) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && near) setSheet('encounter');
      if (e.key === 'Escape') setSheet(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [near, playable]);

  const updatePad = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = pad.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const x = (e.clientX - cx) / (r.width * .32), z = (e.clientY - cy) / (r.height * .32);
    const m = Math.max(1, Math.hypot(x, z));
    movement.current = { x: x / m, z: z / m };
    pad.current?.style.setProperty('--stick-x', `${movement.current.x * r.width * .20}px`);
    pad.current?.style.setProperty('--stick-y', `${movement.current.z * r.height * .20}px`);
  };
  const resetPad = () => {
    movement.current = { x: 0, z: 0 };
    pad.current?.style.setProperty('--stick-x', '0px');
    pad.current?.style.setProperty('--stick-y', '0px');
  };

  const statusText = graphics === 'checking' || graphics === 'starting'
    ? 'Preparing your 3D world…'
    : graphics === 'unsupported'
      ? '3D is unavailable in this viewer. Open the hosted development game in Safari or Chrome to play.'
      : 'The 3D world could not render. Try reopening it in Safari or reloading the page.';

  return <main className="game-root">
    <div className="world">
      <div className="world-art-fallback" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}fallback-world.webp)` }} aria-hidden="true" />
      {graphics !== 'unsupported' && graphics !== 'lost' && graphics !== 'error' && <SceneErrorBoundary onError={onSceneError}>
        <div className={`world-canvas ${playable ? 'world-canvas--ready' : ''}`}>
          <ValleyScene move={movement} onNear={onNear} resetToken={resetToken} onReady={onFrameReady} paused={sheet !== null} />
        </div>
      </SceneErrorBoundary>}
    </div>
    <div className="game-vignette" aria-hidden="true" />
    <header className="game-header">
      <div className="brand"><span className="brand-cloud">☁</span><div><div className="brand-cn">山海经</div><div className="brand-en">SHAN HAI · DANCING VALLEY</div></div></div>
      <span className="phase-label">PHASE 2<br/>3D MODELS</span>
    </header>
    <aside className="quest"><small>✿ FIRST JOURNEY</small><strong>Find 帝江 · Dijiang</strong><span>Follow the stone path to the dancing spirit.</span></aside>
    {!playable && <div className="graphics-status" role="status">{statusText}</div>}
    {playable && <>
      <div className="game-bottom">
        <div ref={pad} className="movement-pad" role="application" aria-label="Touch joystick for walking"
          onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); updatePad(e); }}
          onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) updatePad(e); }}
          onPointerUp={resetPad} onPointerCancel={resetPad}><div className="movement-knob" /></div>
        <div className="game-actions">
          <button className="ghost-action" onClick={() => setSheet('map')}>☷ Map</button>
          <button className="ghost-action" onClick={() => { setResetToken(n => n + 1); setNear(false); resetPad(); }}>↺ Start</button>
          {near && <button className="meet-action" onClick={() => setSheet('encounter')}>✦ Meet 帝江</button>}
        </div>
      </div>
      <div className="keyboard-hint">{near ? 'You found 帝江! Tap Meet or press E' : 'WASD / arrow keys to move · E to interact'}</div>
    </>}
    {sheet && <div className="dialog-backdrop" onClick={() => setSheet(null)}><section className="dialog-card" role="dialog" aria-modal="true" aria-label={sheet === 'map' ? 'World map' : 'Dijiang encounter'} onClick={e => e.stopPropagation()}>
      {sheet === 'encounter' && <><span className="dialog-mark">✦</span><h2>You found 帝江!</h2><p>Meet the real 3D 帝江 model: <strong>six short legs</strong>, <strong>four animated wings</strong>, and a completely faceless fluffy body.</p><p className="muted">The battle system comes next. This build focuses on a fully modeled 3D encounter and walkable valley.</p></>}
      {sheet === 'map' && <><span className="dialog-mark">◈</span><h2>World map</h2><p><strong>天山 · Dancing Valley</strong><br />The first explorable region.</p><p className="muted">The remaining regions will unlock in future builds.</p></>}
      <button className="dialog-close" onClick={() => setSheet(null)}>Continue exploring</button>
    </section></div>}
  </main>;
}
