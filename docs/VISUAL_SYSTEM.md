# Visual system — simple, bright, playful

## Approved direction
Pastel toy-like **true 3D** (not flattened painted scenery): chunky rounded forms, bright sky, saturated aqua water, mint/leaf greens, peach blossoms, cream UI surfaces, gentle diffuse light and almost no outline. Key scenery modules: rounded trees, puffy petals, river, stone arch bridge, Chinese pavilion/gate with curved roof accents, layered hills and distant waterfalls.

The build should be simpler than the concept images: no high-poly roof carving, heavy bloom, hair simulation, individual 3D leaves or simulated cloth.

## Color tokens (first-pass, not final calibrated values)
| Token | Color | Use |
|---|---|---|
| Leaf Green | `#7ABB70` | round canopies |
| Meadow | `#A5D783` | grassy ground |
| Aqua | `#74CBD9` | rivers |
| Sky | `#9DDFFA` | background |
| Blossom | `#F4A7C1` | pink trees and flowers |
| Cream | `#FFF0DB` | cards and creature body |
| Cinnabar | `#EC8D69` | Dijiang body detail |
| Wing Gold | `#FFC07F` | wing tips |
| Roof Teal | `#48727C` | Chinese pavilion |
| Timber | `#C08A69` | pavilion columns |
| Ink | `#31584C` | UI text |

## Level assets (Phase 1 art kit)
- Rounded canopy trees: 3 sizes, 2 palettes, shared geometry and instancing.
- Peach/blossom trees: 2 silhouettes from shared trunk/canopy primitives.
- Grass: 2 rolling hill meshes + continuous traversable base.
- Flowers: 2 puffy petal types + low-detail stems; instanced clusters.
- River: single shallow ribbon and banks, low-cost shimmer.
- Stone bridge: 1 modular walkable bridge with simple rails.
- Pavilion: 1 low-detail curved roof module, 4 repeating wooden columns, floor.
- Lantern: 1 shared sculpted form.
- Rocks: 3 types reused at different scales/orientations.

## UI treatment
Warm cream cards, round corners ~16–24px, soft shadows, ocean/leaf typography, pink/cinnabar for interaction highlights. Avoid permanent full-height overlays on gameplay. Language content: translation keys, English default, Simplified Chinese later.

## Source reference images
`design/references/01-mvp-screen-flow.jpg`, `02-battle-collection.jpg`, `03-ui-kit.jpg` — user-provided visual exploration. Do not mistake any screenshot for finished game UI or exact gameplay spec.
