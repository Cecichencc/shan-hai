# Actual 3D asset pipeline (Phase 2)

## Character source and exports

`tools/generate_models.py` generates the GLB assets from editable 3D geometry. Runtime production assets live in `public/models/`.

### Dijiang anatomy contract

- `SpiritRoot`: body and decorative tuft layers.
- Six pivots: `Leg_L_1`, `Leg_R_1`, `Leg_L_2`, `Leg_R_2`, `Leg_L_3`, `Leg_R_3`.
- Four pivots: `Wing_L_Upper`, `Wing_R_Upper`, `Wing_L_Lower`, `Wing_R_Lower`.
- No eyes, ears, nose, mouth or whiskers; this is essential to the Chinese classical description.
- Layers are rounded and separated for WebGL-friendly animated motion, not particle fur simulation.

### Traveler design contract

- Short hair without a bun; plain white T-shirt, dark shorts and trainers; small crossbody bag.
- Movement pivots `Leg_L`, `Leg_R`, `Arm_L`, `Arm_R`.

## Engine conventions

- World Y is up; world forward is negative Z.
- The GLB pivot names are consumed in `src/game/Dijiang.tsx` and `src/game/Traveler.tsx`.
- Use `import.meta.env.BASE_URL` so assets work on a `/shan-hai/` GitHub Pages subpath.
- Keep default GLBs comfortably under 500 KiB each for mobile; do not replace them with a multi-megabyte illustration or 3D scan.
- The standalone preview embeds the GLBs as base64 so it can be shared as a single HTML file. The React app loads the GLBs directly from the `models/` directory.

## Rebuild

From the project root:

```bash
python -m pip install trimesh numpy
python tools/generate_models.py
python tools/make_standalone_preview.py
npm install
npm test
npm run build
```

Next art iteration: fewer tiled fur lumps and more unified tuft surfaces, wider four-wing silhouettes, six-leg gait easing, palette tuning to match approved soft-pastel Chinese game illustration.
