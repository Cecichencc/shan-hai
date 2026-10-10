import { useCallback, useEffect, useRef, useState } from 'react';
import ValleyScene, { type MoveVector } from './game/ValleyScene';

type Sheet = 'encounter' | 'map' | 'settings' | null;
export default function App() {
  const movement = useRef<MoveVector>({x:0,z:0});
  const pad = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [resetToken,setResetToken] = useState(0);
  const onNear = useCallback((value: boolean)=>setNear(value),[]);
  useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key.toLowerCase()==='e'&&near) setSheet('encounter');if(e.key==='Escape')setSheet(null)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[near]);
  const updatePad = (e:React.PointerEvent<HTMLDivElement>)=>{
    const r=pad.current?.getBoundingClientRect();if(!r)return;
    const cx=r.left+r.width/2,cy=r.top+r.height/2;
    const x=(e.clientX-cx)/(r.width*.32),z=(e.clientY-cy)/(r.height*.32);
    const m=Math.max(1,Math.hypot(x,z));movement.current={x:x/m,z:z/m};
    pad.current?.style.setProperty('--stick-x',`${movement.current.x*r.width*.20}px`);
    pad.current?.style.setProperty('--stick-y',`${movement.current.z*r.height*.20}px`);
  };
  const resetPad=()=>{movement.current={x:0,z:0};pad.current?.style.setProperty('--stick-x','0px');pad.current?.style.setProperty('--stick-y','0px')};
  return <main className="game-root">
    <div className="world"><ValleyScene move={movement} onNear={onNear} resetToken={resetToken}/></div>
    <div className="game-vignette" aria-hidden="true"/>
    <header className="game-header">
      <div className="brand"><span className="brand-cloud">☁</span><div><div className="brand-cn">山海经</div><div className="brand-en">SHAN HAI · DANCING VALLEY</div></div></div>
      <span className="phase-label">PHASE 0<br/>DEVELOPMENT PREVIEW</span>
    </header>
    <aside className="quest"><small>✿ FIRST JOURNEY</small><strong>Find 帝江 · Dijiang</strong><span>Follow the stone path to the dancing spirit.</span></aside>
    <div className="game-bottom">
      <div ref={pad} className="movement-pad" role="application" aria-label="Touch joystick for walking"
        onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);updatePad(e)}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))updatePad(e)}}
        onPointerUp={resetPad} onPointerCancel={resetPad}><div className="movement-knob"/></div>
      <div className="game-actions">
        <button className="ghost-action" onClick={()=>setSheet('map')}>☷ Map</button>
        <button className="ghost-action" onClick={()=>{setResetToken(n=>n+1);setNear(false)}}>↺ Start</button>
        {near&&<button className="meet-action" onClick={()=>setSheet('encounter')}>✦ Meet 帝江</button>}
      </div>
    </div>
    <div className="keyboard-hint">{near?'You found 帝江! Press E or tap Meet':'WASD / arrow keys to move · E to interact'}</div>
    {sheet&&<div className="dialog-backdrop" onClick={()=>setSheet(null)}><section className="dialog-card" role="dialog" aria-modal="true" aria-label={sheet==='map'?'World map':sheet==='encounter'?'Dijiang encounter':'Settings'} onClick={e=>e.stopPropagation()}>
      {sheet==='encounter'&&<><span className="dialog-mark">✦</span><h2>You found 帝江!</h2><p>A mythical dance spirit with <strong>six short legs</strong>, <strong>four wings</strong>, and no facial features.</p><p className="muted">The encounter animation and turn-based battle arrive in later phases. This Phase 0 prototype tests the 3D valley and controls.</p></>}
      {sheet==='map'&&<><span className="dialog-mark">◈</span><h2>World map</h2><p><strong>天山 · Dancing Valley</strong><br/>Your first explorable region.</p><p className="muted">Jade Forest, Crimson Hills, Snow Peaks and other regions are intentionally locked until later releases.</p></>}
      {sheet==='settings'&&<><h2>Settings</h2><p>Language, sound and graphics options will be added later.</p></>}
      <button className="dialog-close" onClick={()=>setSheet(null)}>Continue exploring</button>
    </section></div>}
  </main>;
}
