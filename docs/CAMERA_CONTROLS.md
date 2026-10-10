# Camera and movement — garden review

An elevated three-quarter perspective camera follows a smoothed focus ahead of the traveler. Desktop offset from the focus is `(9.5, 21, 24)`, vertical field of view 37 degrees. Narrow screens use `(5.5, 22, 23)` to keep the route readable. The compact garden centers on the arched bridge, with Dijiang beyond it.

- WASD / arrows: world-axis movement; Shift: faster movement.
- E / Meet: interact near Dijiang; Esc: close modal.
- Touch joystick: lower left; releasing, losing capture, or changing window focus clears movement.
- Map gives the route; Restart restores spawn and camera.
- Dialogs pause walking. Water, trees, rocks, pavilion and garden limits block movement; the bridge and moon-gate opening remain traversable.

`src/game/world-layout.ts` defines scenery placement, collision and bridge height together. Tests sample the complete spawn-to-Dijiang route. Keyboard and narrow-screen browser checks supplement, but do not replace, an actual iPhone Safari test. Combat remains outside this milestone.
