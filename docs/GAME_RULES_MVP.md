# Battle + collection MVP (future; not Phase 0)

## Provisional rules
Turn-based 1v1 combat with commands Attack, Guard, Special, Retreat. After a move is chosen, resolve both actors, animate results and update health. Victory unlocks 帝江 as a companion; failure restarts current expedition. Permanently recruited companions stay unlocked under the recommended save model; a hardcore full restart could be an optional difficulty setting later.

Starter companion: **精卫** is a placeholder proposal, not confirmed. It should not be represented as collected or usable until a proper companion 3D asset exists.

The user has discussed a game similar to Pokémon. We must create original illustrations, sprites, battle panels, damage feedback and move names; avoid copying franchise trademarks or art.

## Data-driven model (future)
`CreatureDefinition`: id, enName, zhName, mythologySource, region, elements, stats, moves, modelUrl, animations, encounterRules.

`BattleState`: playerHP, enemyHP, turn, selectedMove, actionLog, outcome.

`GameSave`: version, visitedRegions, recruitedCreatures, lastSafeSpawn, expeditionNumber.

## Screen flow
Title → Map / Explore → Encounter prompt → Battle actions → Victory (recruit) or Defeat (restart) → Journal / Explore.

Nothing here is implemented in Phase 0. This document records the agreed design direction and unresolved choices.
