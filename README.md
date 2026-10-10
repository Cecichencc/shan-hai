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
- ✅ GitHub Actions Pages workflow prepared (not activated)
- ✅ Separate **dependency-free WebGL demo** at [`preview/index.html`](preview/index.html) for viewing before npm installation
- ⏳ React/Vite package installation and actual build verification (this workspace cannot reach npm registry)
- ⏳ A separate GitHub repository and hosted development Pages URL (the connected GitHub tools do not expose repository creation)
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

## Publish a development preview without production deployment

The proposed dedicated repository is **`Cecichencc/shan-hai`** (not created yet). The linked GitHub connector can write to repositories but does not have the create-repository action. To continue:

1. Create an **empty public** repository named `shan-hai` under your GitHub account (do not initialize with README/gitignore). Share its link in ChatGPT.
2. The source bundle can then be committed to the new repository using the connected GitHub tools. A public repo is needed for GitHub Pages on many plans; do not publish designs privately assumed to be secret.
3. In **Settings → Pages**, choose **Source: GitHub Actions**.
4. Push to `main` or `develop`. `.github/workflows/pages-preview.yml` installs dependencies, tests, builds, and deploys the Pages preview.
5. Check the Actions logs and Pages URL. Expected default shape: `https://cecichencc.github.io/shan-hai/` **only once deployment is confirmed**, not a verified working URL now.

The workflow does **not** deploy to Vercel or any production project. Note: GitHub Pages is usually publicly accessible. For private playtesting, switch to an access-controlled host.

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
