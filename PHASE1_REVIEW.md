# Phase 1 — Mobile preview and rendering reliability

## What was reported

On iPhone, the ChatGPT attachment preview displayed the UI and sky gradient but no 3D objects. This was not a validated playable preview.

## Fix in this change

- The standalone HTML shows a high-quality valley reference image **before JavaScript** and **before WebGL** starts. No JS means it never becomes an empty gradient.
- The mobile joystick and encounter buttons are hidden until a successful WebGL render frame.
- When WebGL isn't available or context is lost, the standalone preview shows the valley image and a clear, visible message. It does not claim to be interactive.
- The React app uses the same image while it checks WebGL availability and mounts the scene; a renderer crash is caught by an error boundary.
- Both standalone and React previews retain the same 3D geometry and movement logic for supported browsers.
- The hosted React HTML includes an initial static scene even if the JavaScript bundle doesn't execute.

## Included working 3D prototype components

Rounded hills, water, stone trail, modular Chinese pavilion, stylized trees, white-T-shirt traveler, and a placeholder 帝江 with six legs and four wings and no face. All models are procedural approximations, **not** finished artist-authored game assets.

## Validation

- Node test suite: five tests passing (the WebGL renderer test uses a mocked graphics context; it does **not** establish visual compatibility on an iPhone).
- Headless Chromium tested with JavaScript disabled and with WebGL unavailable: the fallback scenery remained visible in both cases.
- Actual iOS Safari WebGL rendering: **not verified in this environment**.
- React dependency install / production build: **not verified locally**, since dependencies cannot be downloaded here. GitHub Actions should run the install and build once the new changes are pushed.

## Before Phase 1 is accepted

1. Open the hosted app in Safari, rather than the ChatGPT attachment file preview.
2. Confirm the river, path, rounded trees, pavilion, player and 帝江 render.
3. Move with the joystick and reach 帝江 to display the encounter interaction.
4. Check orientation change and reload; neither may leave a blank screen.
5. Continue with collision and environment polish only after rendering is verified on a real device.

## Scope explicitly not implemented yet

Combat, collecting, character rigging, detailed Chinese scenery, progression and saving. Those belong to later phases.
