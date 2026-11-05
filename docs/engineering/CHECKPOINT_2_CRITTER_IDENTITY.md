# Checkpoint 2 — Individual Lumenettes and versioned save migration

**Status:** Feature branch implementation, pending CI and merge review.  
**Date:** 2026-11-05  
**Roadmap:** [The First Thread A→B](../plan/FIRST_THREAD_A_TO_B_ROADMAP.md).  
**Planning:** [Checkpoint 1 product hypothesis](../plan/CHECKPOINT_1_UNIFIED_GAME_DIRECTION.md).  
**Branch:** `feat/checkpoint-2-persistent-lumenettes-20261105` / PR #10.

## Scope and acceptance

One authored pattern named `round-lumenette` is registered in a pure data catalog. Individual Lumenettes now carry an immutable-format `critter-000001` style ID, pattern reference/revision, name and appearance. A canonical collection tracks `critters`, `activeCritterId`, `favoriteCritterId`, `nextCritterSequence` and a minimal `household.residentIds` list.

The Yarn screen adds a bounded **two-companion preview** with create/select/favorite controls. Home continues displaying the active critter through a compatibility view. **This is not an inhabited simulation:** movement, furnishing affordances, critter personalities and construction abilities belong to later checkpoints.

## Save contract

The same browser key remains `lumenette-hollow-save`. An old Zustand envelope has `version: 1` and a domain object with `saveVersion: 1`. The new store has:

- Zustand envelope `version: 2`.
- Canonical persisted domain `saveVersion: 2`.
- `persist.migrate(oldState, fromVersion)` explicitly handles **version one**, translating the legacy Pip into `critter-000001`.
- Original Pip's name, chosen owned color, face and accessory become that individual's own fields. Unlocked colors remain shared current inventory; future economy ownership changes are out of scope.
- `yarn`, `level`, `lastClaimMs`, `nextUpgradeMs`, `ownedColors`, `decor`, `battery`, `gateOpen`, `wanderCount`, and `visitCount` continue through the version-one sanitizer without changing their meaning.
- The exact original v1 serialized envelope is backed up once in local device storage as `lumenette-hollow-save-v1-backup` if possible. No remote upload.
- `name`, `color`, `face` and `accessory` remain **runtime compatibility projections** of `activeCritterId`, not duplicated canonical fields in the v2 envelope. The selected individual is edited when current UI customization controls change.
- A newer (future) versioned stored envelope is **not overwritten** by this older build. Unsupported migration versions throw rather than silently converting unknown schemas into a new game.
- Independently persisted theme/lighting preferences under `lumenette-hollow-appearance-v1` are untouched; preview clocks still have no input into game economy timing.

### Recovery and version policy

The v1 backup is a one-time local fallback for forensic export and manual recovery, **not an automatic rollback feature**. If localStorage is blocked or full, backup may fail; the in-memory migration can still succeed. Future versions remain incompatible unless explicitly migrated and should not be overwritten. Malformed saves are sanitized to bounded valid state according to existing rules, not treated as reliable data.

The migration is deterministic (old Pip gets a stable ID) and idempotent after becoming a v2 envelope; normal v2 hydration does **not** create a second Pip. Adding a second critter allocates a monotonic ID separate from the favorite and selected references. Direct IDs and the finite collection are validated when read from storage.

## Protected interfaces and known limits

- Existing Home, Wander, Idle, Yarn and Shop routes, purchases and idling, upgrade cooldowns and simulated battery behavior are preserved.
- Renderer `Lumenette.jsx` remains SVG-only. One active critter drives existing UI fields, so other routes do not need to understand the collection yet.
- The preview permits two critters; pure domain rules allow at most eight for forward compatibility. **Neither number is a final approved collection-size decision.**
- Pattern construction/capabilities, world state, household placement and resident AI intentionally are **not** implemented here.
- The native phone widget remains unimplemented; `favoriteCritterId` prepares for an independent adapter/feasibility test. A favorite button is not a widget.
- No genetics, RPG battle, Threadwork, monetization, server economy or Kestrel memory modifications.

## Verification and merge gate

Review [synthetic version-one fixture](../../tests/fixtures/v1-pip-customized.json), [hostile fixture](../../tests/fixtures/v1-malformed.json), [legacy sanitizer tests](../../tests/legacy-save.test.js), [critter/domain tests](../../tests/critters.test.js), and [Chromium smoke](../../tools/smoke-browser.mjs).

**Require green CI**: `npm ci`, all unit tests, Vite build, token generation/validation, 1280px/390px/320px browser routes, old-save automatic hydration and raw backup, two individuals created/renamed/favorited, restart persistence, continued day/night independence, no JS errors or overflow. An explicit human review of the new Yarn interface and actual client play preference are still required before declaring design acceptance.

This branch should remain **draft** until its final-head checks pass. Do not merge speculative CosmicDance research or replace the current application.
