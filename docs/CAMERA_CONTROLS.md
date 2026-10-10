# Camera and movement — Phase 0

## Exploration camera
An elevated, three-quarter follow camera at roughly `(player.x+13, 12, player.z+19)` looking near `(player.x, 1.4, player.z-9)`; follows smoothly rather than snapping. Landscape should be readable as three-dimensional geometry with the path visible in front.

Future encounter mode zooms toward 帝江 while the traveler/companion remain visible. Inspection mode uses a separate white background and 360-degree orbit. Neither is active in Phase 0.

## Inputs
- WASD / arrows = movement along world x/z plane.
- Shift = faster movement (React version); E = interact near 帝江.
- Esc = close modal.
- Mobile virtual joystick lower left; encounter action appears at proximity.
- Restart restores player's initial spawn.

Touch targets ≥44px, safe-area-inset padding and no hover-only interactions. Prevent browser arrow-key scrolling when gameplay is active. Tap buttons should not block the joystick.

## Future Phase 1 controls
Add obstruction-aware camera and optionally drag-to-orbit. Determine whether walking should be camera-relative after user testing. Add collider constraints and water boundaries.
