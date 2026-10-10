# First playable area: 天山 · Dancing Valley

The design is a fictional stylization inspired by Chinese mythology, **not** a geographical reconstruction of a canonical map.

## Gameplay route
Spawn terrace → blossom path → stream / stone bridge landmark → pavilion clearing → 帝江's dance glade → short return loop. There is one primary creature encounter.

## Approximate world coordinates (Phase 0 procedural scene)
- Origin: grassy center.
- Start: `(3, 0, 22)`.
- 帝江: `(8, 0, -22)`.
- Stream: north–south ribbon around x ≈ `-15 + 5 sin(z × .068)`.
- Pavilion: `(-2, 0, -34)`.
- Bridge: across the stream near z = -5.
- Play bounds: x [-41,41], z [-39,35].

### Current limitations
The Phase 0 scene is intentionally **a visual and movement greybox**. River segments are cosmetic and traversable; the bridge and trees do not have collision yet. No pathfinding AI, jumping or combat positions. The environment is not a production-scale handcrafted level.

## Phase 1 tasks
1. Replace approximate meshes with a single walkable base terrain mesh and height curve.
2. Add primitive static colliders to trees, bridge rails and pavilion.
3. Add nontraversable water boundaries or a clear crossing affordance.
4. Stabilize spawn/return loop and landmark visibility.
5. Add region-specific ambience and a tiny hint near the dance glade.

## Visual exclusions
No floating interface labels printed into the world, no giant high-poly architecture, no moving crowds, no photorealistic sky, no full-region collision simulation.
