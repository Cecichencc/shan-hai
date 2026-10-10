# Shan Hai build handoff — 10 October 2026

## Source of requirements

Recovered the project direction from the conversation “Generate 帝江 Visual” and the current repository specifications. The complete later master Codex prompt was not retrievable, so this handoff does not claim to reproduce it.

Use the project skill at `.agents/skills/build-shan-hai/SKILL.md`. It preserves the locked appearance, real-3D requirement, repository architecture, phase boundaries, and verification gates. Root `AGENTS.md` routes future work to the skill.

## Confirmed baseline

Development commit: [5e4f731](https://github.com/Cecichencc/shan-hai/commit/5e4f731a0d6ab57a1a642c84140b9bf52bba9184).

- Phase 2 includes Dijiang and traveler GLBs, a React Three Fiber valley, movement, river/bridge collision logic, follow camera, proximity interaction, Map, restart, and fallback handling.
- Dijiang: one round faceless cream body, six short legs, four orange/gold wings.
- Traveler: short hair without a bun, white T-shirt, dark shorts, sneakers, crossbody bag.
- Visual direction: rounded pastel toy-like 3D with simplified Chinese architecture.
- The standalone HTML uses the same GLBs but earlier, less detailed scenery. It is not a full substitute for reviewing the React app.
- Battle, recruitment, collection, and saving are not implemented in this milestone. Starter selection and defeat persistence remain proposals.

## Verification evidence

[GitHub Actions run 38018277174](https://github.com/Cecichencc/shan-hai/actions/runs/38018277174), for the baseline commit:

| Check | Result |
| --- | --- |
| Dependency installation | Passed |
| Existing tests | 10 passed, 0 failed |
| TypeScript and Vite build | Passed |
| GitHub Pages configuration | Failed: Pages site Not Found |
| Hosted deployment | Skipped |

The repository is private. No repository visibility, hosting access, or production settings were changed. Do not assume a GitHub Pages URL is live. Older README/phase-review claims that the repository does not exist or compilation has never passed are superseded by this evidence.

A graphical playthrough was attempted on 10 October 2026. The local environment rejected opening a listening server, and the browser's security policy rejected local `file:` URLs. No workaround or security change was attempted. Neither actual WebGL playability nor iPhone Safari performance was verified in this session.

## Next justified milestone

Finish Phase 2 verification using an authorized hosted development URL or a user-run local server:

1. Load the actual React app and confirm the models render.
2. Walk from spawn to Dijiang; check stream boundaries, bridge crossing, level bounds, camera, Meet, close, restart, Map, and paused movement.
3. Check narrow-screen layout, touch joystick release/cancellation, safe areas, and action-button access.
4. Test on an actual iPhone in Safari; record device, browser, load behavior, responsiveness, and sustained rendering.
5. Inspect Dijiang from multiple angles and refine its gait, four-wing silhouette, materials, and scene staging against approved references.
6. Advance to combat only after the visual/movement gate is met and unresolved gameplay choices are resolved.

## Skill verification

The Skill Creator initializer generated the skill structure and UI metadata. The standard Python validator could not run because PyYAML was unavailable; equivalent frontmatter/name/description, UI metadata, placeholder, and reference checks passed with the installed js-yaml parser. An independent read-only application of the skill selected Phase 2 verification and preserved the unresolved decisions.

This handoff changes project guidance only. It does not represent a new game build or a completed device test.
