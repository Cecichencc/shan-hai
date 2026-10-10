# 山海经 — SHAN HAI

**Phase 0 · Independent 3D web-game foundation**  
React + TypeScript + Vite + React Three Fiber · mobile-first · English-first / zh-CN-ready

A friendly, pastel, Chinese-mythology-inspired creature-collecting adventure. Start with a modern traveler wandering around a simplified 3D **天山 / Dancing Valley**; later challenge wild mythical creatures in turn-based battles and recruit companions.

## Current status

- ✅ Independent repository-ready source and specification documents
- ✅ Phase 0 procedural 3D environment implementation: meadow, stream, bridge, pavilion, blossoms, walkable traveler, basic follow camera
- ✅ Provisional **帝江 / Dijiang** procedural creature: entirely faceless, six short legs, four orange wings
- ✅ WASD / arrow controls; mobile touch joystick; restart; proximity interaction placeholder
- ✅ Mobile-safe-area UI, loading-friendly lightweight geometry, versioned project conventions
- ✅ GitHub Actions Pages workflow committed (enable the Pages source in Settings)
- ✅ Separate **dependency-free WebGL demo** at [`preview/index.html`](preview/index.html) for viewing before npm installation
- ⏳ React/Vite package installation and actual build verification (this workspace cannot reach npm registry)
- ✅ Repository created and source committed to `Cecichencc/shan-hai` on `main`
- ⏳ Hosted GitHub Pages development link pending Pages enablement and successful workflow run
- ⏳ Actual encounter battle, collection, proper art/rigging and polished collision (scheduled for later phases)

**No user production app, Vercel project, or existing repo has been modified.**

## Local development

Requires Node.js 20.19+ and a working npm registry connection:

```bash
npm install
npm run dev
```

Visit the local URL printed by Vite (usually `http://localhost:5173`). Test the static dependency-free demo by opening `preview/index.html` directly in a modern WebGL browser (or serving the folder with `npx http-server preview`).

```bash
npm test       # source-contract checks
npm run build  # TypeScript compile and Vite build, once dependencies are installed
```

### Basic controls

| Device | Control |
| --- | --- |
| Desktop | WASD / arrows move, Shift walk faster, E interact near 帝江, Esc close dialog |
| Mobile | Lower-left joystick, Meet button near 帝江 |
| Both | Map shows region availability; Start resets avatar position |

The Phase 0 collider is only a simple level boundary. Water, trees, and the pavilion are currently visual geometry, not complete physics colliders. Proper connected walkable surfaces and collision are a **Phase 1** acceptance item.

## Enable the GitHub Pages development preview

The independent repository is **[Cecichencc/shan-hai](https://github.com/Cecichencc/shan-hai)**, currently **private**. Phase 0 source and tests are committed to `main`.

1. In the GitHub repository, open **Settings → Pages** and set **Build and deployment → Source → GitHub Actions**.
2. On the **Actions** tab, open **Shan Hai development preview**, then select **Run workflow** on the `main` branch if no successful deployment is shown.
3. Wait for the workflow to install packages, run tests, build the Vite app, and deploy `dist/`. Open the link reported in the successful deployment.

**Privacy warning:** GitHub Pages websites are generally **public even when the source repository is private**. A private repository typically requires GitHub Pro or an eligible higher plan for Pages; GitHub Free requires a public repository. Do not change repository visibility or publish private assets without approval.

The expected project-site address shape is `https://cecichencc.github.io/shan-hai/`, but it is **not a confirmed live URL** until GitHub Pages succeeds.

The original three UI screenshot references remain available in the separate Phase 0 starter ZIP but have **not yet been uploaded as binary images into this repository**; code, executable standalone preview, test suite, specifications and CI workflow are present.

No Vercel production deployment is configured or triggered.

## Folder overview

```text
shan-hai-phase0/
├── .github/workflows/pages-preview.yml  # development hosting
├── design/references/                   # provided UI design source images
├── docs/                               # product, visual, camera, character, MVP, QA
├── preview/index.html                  # dependency-free, standalone WebGL demo
├── public/phase0-preview.html          # fallback demo (at /phase0-preview.html after deploy)
├── src/
│   ├── App.tsx                         # exploration HUD, map, encounter placeholder
│   ├── game/                           # world, Dijiang, traveler, controller
│   └── styles/                         # game UI styles
├── tests/spec.test.mjs
├── package.json
└── vite.config.ts
```

## Scope boundaries and design integrity

All visual screenshots under `design/references` are **references, not playable meshes or production-ready assets**. The game's creature and environment art are intentionally inspired by the supplied design exploration, not direct screen-image reconstruction. The displayed 3D models are procedural Phase 0 stand-ins.

For 帝江 specifically, never substitute a cat face or feline paws. Preserve the anatomy in [`docs/CHARACTER_DIJIANG.md`](docs/CHARACTER_DIJIANG.md). Avoid copying Pokémon branding, gameplay UI, animations, art or proprietary source directly: inspiration should not become cloning.
