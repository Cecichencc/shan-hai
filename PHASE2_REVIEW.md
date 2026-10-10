# Phase 2 — First real 3D models and encounter scenery

**Branch:** `develop` (no production deployment requested)

## Implemented

- Exported reusable animated-part GLB assets: `public/models/dijiang.glb` and `public/models/traveler.glb`.
- Dijiang has exactly **six independently named leg roots** and **four independently named wing roots**, with no facial features, based on the approved concept. Stump-like orange feet and layered ivory fur shapes are deliberately simplified for browser performance.
- The traveler has short hair **without a bun**, plain white T-shirt, dark shorts, sneakers, and a little sage messenger bag.
- React Three Fiber loads **actual GLB meshes** (not 2D character images), applies wing/leg/arm animation, and moves the player in 3D.
- A rebuilt, traversable Dancing Valley with a 3D ground mesh, curved stream, walkable arched stone bridge, rolling hills, flower clusters (instanced), rounded trees, Chinese-style pavilion with curved roof, moon gate, mountains, and lanterns.
- River collision blocking away from the bridge and a simple pavilion blocker; following third-person camera, desktop movement and mobile joystick.
- Self-contained standalone WebGL preview includes and renders the **same actual GLB assets**, embedded in the HTML; scenery in this preview remains the earlier lightweight 3D blockout. The more detailed scenery is in the React app.
- Fallback illustration stays visible when WebGL or file viewers do not permit a live canvas. Fallback is not falsely presented as interactive.
- Model generator in `tools/generate_models.py` and preview packager `tools/make_standalone_preview.py`.

## Verified

- `node --test tests/*.test.mjs`: asset contract and standalone simulation (includes walking to the encounter).
- GLBs independently parsed by `trimesh` and independently rendered via VTK software rendering.
- JS parse validation of the embedded preview.
- Reproducible glTF meshes with material base colors and real geometry.

## Not verified / limitations

- Chromium graphical browser screenshots could **not** be run in this particular environment: managed browser policies blocked navigation to local web/file URLs (`ERR_BLOCKED_BY_ADMINISTRATOR`). A mock WebGL test is not equivalent to actual iPhone Safari testing.
- Installing React / Vite dependencies from NPM was blocked by network restrictions here, so the production bundle's TypeScript build must be validated in GitHub Actions. No claim of a successful React build is made yet.
- The current models are **first low-poly versions**, not production character art identical to the approved illustrations. Fur and feather layering need later artistic refinement and rig smoothing. React movement uses procedural pivot animation, not a professionally skeletal-rigged Blender animation.
- Combat, recruitment, party collection, and saving are not implemented in this milestone.
- The private GitHub Pages development URL has not been verified live; GitHub Pages availability depends on repository settings and user plan.

## How to review

- Open `shan-hai-phase2-preview.html` for the standalone 3D valley **if WebGL can run in the file viewer**. If it cannot, use a standard Safari/Chrome page served via HTTP(S) to interact.
- In the standalone preview, use WASD/arrow keys or the on-screen joystick and approach 帝江. This standalone renders the exported GLB characters with the earlier, less detailed procedural scenery.
- After a successful GitHub Actions build and Pages setup, open the hosted React app for the **new** 3D scenery and character assets.

## Next milestone

Compare rendered model and environment against approved concept art in actual iPhone Safari, refine six-leg gait, wing silhouette, Japanese-free authentic Chinese architecture proportions, and scene staging. Then build turn-based combat.
