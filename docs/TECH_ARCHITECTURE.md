# Technical architecture

## Phase 0 implementation
- React 19 + TypeScript + Vite, Three.js / React Three Fiber (when dependencies are available).
- Procedural modular meshes instead of finished GLB assets; no backend.
- Single `Canvas` rendering world, traveler proxy and 帝江 proxy.
- `App` for HUD/buttons/dialogs, movement ref shared with 3D scene, proximity callback controls Meet action.
- Camera follows avatar each render frame; avatar is intentionally a simple nonrigged proxy.
- Additional **standalone dependency-free WebGL** demo under `preview/index.html` so Phase 0 can be reviewed without waiting for npm install or GitHub activation.

## Later architecture boundaries
`systems/battle.ts` pure deterministic functions; `state/` Zustand game phase/roster; `data/creatures.ts`; `assets/` scene GLBs; `ui/BattlePanel.tsx`; `scenes/Collection.tsx`. No battle rules buried in Three.js or JSX.

## Performance approach
WebGL first; ~30 FPS target on selected iOS Safari test hardware; desktop ~60 target. Start with low draw-call meshes, dpr capped 1.5, small shared materials. Avoid heavy post-processing and photorealistic fur.

## QA acceptance
Phase 0 verifies scene initialization, controls, initial view and encounter proximity, manual responsive check and JS anatomy-contract test. Actual React build/test on a dependency-equipped environment still pending.
