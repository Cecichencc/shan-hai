# Project map

Repository: `Cecichencc/shan-hai`. Development branch: `develop`.

Read files from the current checkout; this map is navigation, not a frozen copy of their contents.

| Need | Files |
| --- | --- |
| Locked choices vs proposals | `docs/DECISIONS.md`, latest user instructions |
| Product and future core loop | `docs/PRODUCT_VISION.md`, `docs/GAME_RULES_MVP.md` |
| Visual and anatomy contracts | `docs/VISUAL_SYSTEM.md`, `docs/CHARACTER_DIJIANG.md` |
| Current GLB pivot names and rebuild steps | `docs/ASSET_PIPELINE_PHASE2.md`, `tools/generate_models.py` |
| Camera, movement, collision, layout | `docs/CAMERA_CONTROLS.md`, `docs/WORLD_01_TIANSHAN.md`, `src/game/ValleyScene.tsx`, `src/game/WorldObjects.tsx`, `src/game/constants.ts` |
| Character loading and animation | `src/game/Dijiang.tsx`, `src/game/Traveler.tsx`, `public/models/` |
| HUD, graphics state, dialogs, joystick | `src/App.tsx`, `src/styles/game.css` |
| Phase status and verification | Most recent `PHASE*_REVIEW.md`, `docs/ROADMAP.md`, `docs/QA_CHECKLIST.md`, current CI logs |
| Build and preview | `package.json`, `vite.config.ts`, `.github/workflows/pages-preview.yml` |
| Standalone preview | `preview/index.html`, `tools/make_standalone_preview.py`, `tools/phase1_standalone_template.html` |
| Regression checks | `tests/assets.test.mjs`, `tests/fallback.test.mjs`, `tests/preview-runtime.test.mjs`, `tests/spec.test.mjs` |

## Recovered context and contradictions

At retrieval on 10 October 2026, development head was `5e4f731a0d6ab57a1a642c84140b9bf52bba9184`.
Phase 2 uses real exported GLBs and a more detailed React valley. Earlier docs still describe a repository that did not yet exist and Phase 0 proxies; those status statements are stale.

The current Dijiang pivots are `Leg_L_1`, `Leg_R_1`, `Leg_L_2`, `Leg_R_2`, `Leg_L_3`, `Leg_R_3`; wings are `Wing_L_Upper`, `Wing_R_Upper`, `Wing_L_Lower`, `Wing_R_Lower`. Confirm names against the current assets when editing.

GitHub run `38018277174` for that commit passed dependency installation, all 10 tests, TypeScript, and Vite build. Its `actions/configure-pages` step failed with a Pages site Not Found response; deployment was skipped. This is historical evidence, not a claim that later commits pass or a preview is live. Read fresh CI evidence for each changed commit.

The complete later master prompt from the conversation “Generate 帝江 Visual” could not be retrieved. This skill captures the recovered repository specifications and confirmed conversation constraints; it must not claim exact fidelity to that unseen prompt.

## Current milestone boundary

Verify and refine the real 3D valley and character experience first, including actual iPhone Safari playability. Combat and recruitment remain later phases. The proposed future loop is exploration, encounter, battle, recruitment or expedition restart, collection, and return to exploration. Defeat persistence and starter selection remain unresolved.
