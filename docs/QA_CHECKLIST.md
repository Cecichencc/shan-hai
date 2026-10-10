# Phase 0 review checklist

## Contract and source
- [x] Code represents 帝江 with six legs, four wings and no face.
- [x] Traveler source has brown short hair (no bun), white T-shirt, dark shorts.
- [x] Source has camera/controller/scene separation.
- [x] Node-based contract tests pass locally.

## Interactive testing — needs a real browser and npm-enabled environment
- [ ] React app builds with `npm install && npm run build`.
- [ ] Pages Actions pipeline green and URL loads.
- [ ] Desktop: WASD, arrows, Shift, E, Esc working.
- [ ] Mobile: joystick and action button reliable; no browser page scrolling.
- [ ] Traveler remains inside level bounds.
- [ ] Scene loads within acceptable time on iPhone Safari.
- [ ] Manual FPS and temperature check on iPhone Safari.
- [ ] Dijiang visible as 6/4/0 anatomically from different camera directions.
- [ ] No screen obstruction around joystick and interaction prompt.

## Known gaps
- River/bridge/tree collisions, creature rigging and battle not implemented.
- Browser screenshot validation may require a browser environment with functional WebGL/GPU support.
- No real GitHub Pages preview until new repo and Pages enablement.
