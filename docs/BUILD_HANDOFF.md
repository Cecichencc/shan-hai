# Shan Hai build handoff — 10 October 2026

## Requirements and current direction

The complete original text prompt was not retrievable. Current repository specifications and explicit conversation decisions govern this work. Use `.agents/skills/build-shan-hai/SKILL.md`; root AGENTS.md routes future tasks to it.

The user approved the second simplified garden concept on 10 October and requested removal of the traveler’s bag. The garden rebuild implements compact scenery, a cream arched bridge, pastel trees, simple teal pavilion, moon gate, smoother characters, elevated camera and real shadows. The traveler has no bag or strap. Dijiang retains one faceless cream body, six legs and four orange/gold wings.

## Review hosting

The user made `Cecichencc/shan-hai` public and explicitly authorized the `develop` branch for the GitHub Pages environment. The live development review is https://cecichencc.github.io/shan-hai/. The deployment before this visual rebuild passed in Actions run 38050232705; browser rendering, movement, Map, restart and console were checked. Prior claims that the repository remains private or Pages is unavailable are superseded. No Vercel production deployment is authorized.

## Garden rebuild verification

Local checks: 14 tests pass, including GLB anatomy/size, bag removal, the sampled spawn-to-Dijiang route, river boundaries, bridge elevation, moon-gate opening and fallback handling. TypeScript syntax parsing passes. The hosted workflow runs dependency installation, the full tests, TypeScript checking, Vite build and Pages deployment. Record the final hosted visual/playthrough evidence after it completes.

The standalone HTML embeds the updated character assets but retains earlier procedural scenery. Use the React app for the approved garden review.

## Remaining milestone gates

- Review the newly deployed garden in the browser, including bridge crossing, Meet, Map and restart.
- Check narrow-screen controls and touch release/cancellation.
- Test on an actual iPhone in Safari; record device/browser, loading, responsiveness and sustained rendering. A desktop viewport simulation does not satisfy this gate.
- Combat, recruitment, collection and saving are outside this milestone. Starter selection and defeat persistence remain proposals.

The model generator uses Python standard library only. Generated GLBs and standalone preview remain committed alongside source. The project skill was updated to preserve the approved removal of the bag.
