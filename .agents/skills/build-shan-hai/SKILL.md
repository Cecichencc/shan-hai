---
name: build-shan-hai
description: Continue, debug, review, or extend Chen Chen's Shan Hai (山海经) 3D browser game in Cecichencc/shan-hai. Use for Dijiang/帝江 modeling, Dancing Valley exploration, traveler controls, assets, game phases, or development previews. Preserve the established visual and anatomy contracts, distinguish planned features from implemented behavior, and verify actual WebGL gameplay.
---

# Build Shan Hai

## Establish the current task
1. Locate the dedicated `Cecichencc/shan-hai` repository and read its AGENTS.md when present. If it is absent, report that fact and continue from the skill and project specifications.
2. Inspect the current branch, worktree changes, package scripts, latest phase review, and CI evidence. If only a source snapshot is local, use the authorized GitHub connector for repository evidence and atomic Git commits; do not describe that snapshot as a Git checkout. Continue `develop` unless the user specifies otherwise. Preserve unrelated work.
3. Read [project-map.md](references/project-map.md) to select the relevant authoritative files. Treat source code and recent verified results as current implementation evidence; older Phase 0 documentation can be stale.
4. Preserve the latest explicit user direction. Do not invent requirements from inaccessible uploads, generated image labels, assistant proposals, or memory summaries. Identify any remaining unknown requirement.

## Preserve the project contracts
- Keep this project separate from Wonderland and Kitchen Garden.
- Build true, walkable 3D geometry with React, TypeScript, Vite, Three.js, and React Three Fiber. Use the existing architecture before introducing dependencies or a backend.
- Use simple rounded toy-like forms, pastel matte materials, cream surfaces, aqua water, peach blossoms, gentle lighting, and simplified Chinese curved-roof architecture. Use approved images as visual references; never present a scenery image as evidence of working gameplay.
- Preserve the traveler: short brown hair without a bun, plain white T-shirt, dark shorts, sneakers, modest crossbody bag.
- Preserve Dijiang: one round cream body, exactly six short independent legs, four distinct orange/gold wings, and no eyes, nose, mouth, ears, brows, or whiskers. Avoid feline paws.
- Use the actual Phase 2 pivot names in `docs/ASSET_PIPELINE_PHASE2.md`, checked against the GLB and loader. Older model-name proposals differ.
- Keep English as the default and structure new strings for Simplified Chinese localization.
- Treat battle rules, defeat persistence, and the starter companion as proposals until an explicit user decision resolves them. Do not silently turn 精卫 into an approved playable starter.

## Implement a bounded milestone
1. State the concrete outcome and acceptance checks before editing.
2. For scene changes, inspect `ValleyScene.tsx`, `WorldObjects.tsx`, and `constants.ts`. Preserve the spawn-to-Dijiang route, stream crossing, collision, level bounds, follow camera, touch joystick, and encounter proximity.
3. For character changes, inspect both GLBs, their generator, and the React loaders. Keep named pivots and regenerate dependent assets/previews when their source changes.
4. Keep game rules separate from Three.js rendering. Add deterministic battle/state logic only when the current milestone authorizes it.
5. Keep mobile rendering lightweight: shared geometry/materials, instancing where appropriate, capped pixel ratio, and no heavy fur simulation or post-processing.
6. Keep static fallback, loading, unsupported graphics, context loss, and playable states explicit. Show active controls only when rendering is operational.

## Verify the complete experience
- Run existing relevant tests and `npm run build`. Report failures accurately; do not disable failing gates to make the status green.
- Test the actual React app in a graphical browser when available: scene loads, models render, movement changes position, bridge/water behavior, approach-to-Meet, dialog open/close, restart, Map, and pause behavior.
- Check a narrow mobile viewport for clipping, safe areas, joystick cancellation, and action-button reachability. Treat emulation as emulation.
- Require an actual iPhone Safari check before advancing from the 3D visual/movement milestone into combat. If unavailable, record that gate as pending; do not claim device performance from desktop or mock WebGL tests.
- Inspect the six-leg/four-wing silhouette from multiple angles when changing Dijiang. Count semantic pivots as well as inspecting the visible model.
- Distinguish the standalone `preview/index.html` from the React game: the standalone uses the same GLBs but its scenery and control behavior can lag behind.
- Diagnose code/build, runtime, asset loading, host configuration, and embedded-viewer limitations separately. A screenshot of fallback art proves neither rendering nor playability.

## Save and report
- Commit the scoped source/skill changes to the development workflow and preserve the repository's existing history.
- Keep Vercel production unchanged unless the user explicitly authorizes production publishing.
- Inspect CI for the actual commit. Do not invent a Pages URL or claim that source on GitHub is a running game.
- Do not change repository visibility or hosting access to resolve a preview failure without authorization for that access change.
- Give the verified review URL when available, the commit link, concise changes, and concrete unverified gates. State clearly when only a source/commit link is available.
