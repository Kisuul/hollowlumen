# HollowLumen — A → B roadmap: The First Thread

**Status:** PROPOSED DEVELOPMENT PLAN; not a gameplay specification or client-approved feature list.  
**Checkpoint 1 reconciliation:** [Unified game direction (candidate)](CHECKPOINT_1_UNIFIED_GAME_DIRECTION.md) · [Decision/approval ledger](CHECKPOINT_1_DECISION_LEDGER.md). These documents do **not** constitute client approval of gameplay.  
**Prepared:** 2026-11-05.  
**Implementation base inspected:** `Kisuul/hollowlumen` `main` at `cb209918e3f6fe6793564e4cb011b76854b65a1d` (PRs #1–#6 merged).  
**Parallel design research:** `cosmicdance-4-2-0/hollowlumen` branch `design/gameplay-loops-rpg-vision-2026-11-05` at `059d52c9acf5eb9330fb044af78605f069ad0503`.  
**Authority:** The original designer/client determines the intended experience; the user coordinates the teams and implementation. CosmicDance proposals inform decisions but are **nonbinding**. Do not merge the two repositories wholesale.

> **Candidate player fantasy:** Create living crochet companions; give them a home; discover their capabilities in meaningful adventures; return to a world that remembers what happened.

## A — Starting point (what actually exists)

The five-screen React/Vite web prototype already has Home, Wander, Idle, Yarn and Shop; one customizable Pip; SVG art; a version-one local save; deterministic economy/gameplay functions; cosmetic decoration ownership; short five-step wanders; semantic day/night palettes; independent appearance and fictional solar lighting; and automated tests/browser smoke infrastructure.

**What it does not yet have:** Multiple persistent critter individuals, pattern-defined construction, actual furnishing placement/affordances, resident behaviors, world/quest flags, true RPG decision-making or a native phone widget. Existing wander challenges mostly award yarn rather than permanently changing the world.

**Housekeeping still open:** A reviewed, committed `package-lock.json` was absent from this inspected main revision; CI generated a candidate. Record explicit client review of rendered Home/Pip (earlier palette choice approval is not equivalent). More complete accessibility and saved-game regression checks are also needed.

## B — Destination: one complete playable loop, not a full RPG

**Milestone name:** *The First Thread*.

At B, a player can:
1. Create or meaningfully customize an individually identified Lumenette and name it.
2. Keep two persistent companions in a small, inhabited cottage; arrange a few furnishings and observe recognizable different reactions.
3. Choose a companion and prepare for a short trip to an authored damaged bridge.
4. Solve the obstacle through at least **two mechanically distinct approaches** whose prerequisites, costs or consequences differ.
5. Return to see a **visible, persistent world/home consequence**, then make or interact again.
6. Reload and retain companions, their identities, the selected favorite, owned items, quest results and existing progress.

**Proof at B:** The client understands the loop without a narrator, can play without mandatory combat, and voluntarily wants to create, explore or revisit the home. If that does not happen, reevaluate before scaling content. Completion of all checkpoints is necessary for a technical demonstration, but **does not itself constitute client signoff**.

## Straight-line checkpoint sequence

Every checkpoint must be separately reviewable, have evidence of the claimed behavior and avoid regressions. Code changes belong on bounded branches/PRs, not in this planning document.

| Gate | Build or decision | Required exit evidence |
| --- | --- | --- |
| **0 — Baseline** | Preserve current working prototype; review rendered day/night Home/Pip; pin reviewed npm dependencies; capture a representative v1 save and browser screenshots. | Reproducible install, all baseline tests/build/smoke green, representative v1 fixture, outstanding signoffs recorded accurately. |
| **1 — Unified direction** | Reconcile the existing cottage-oriented README, the critter-collection/widget draft and the integrated homestead-RPG design. Decide provisional product pillars: creation, inhabitation, adventure. | One accepted scope/approval ledger; explicit labels for *approved*, *proposed* and *parked*. No assumption that a draft spec supersedes working code. |
| **2 — Individual critters + persistence** | Model pattern references, stable critter IDs, collections/favorites and minimal household membership; migrate v1 Pip safely. | Two named, distinguishable critters and favorite choice survive save/reload; legacy Pip, yarn, upgrades, decor, cooldowns and appearance remain intact. |
| **3 — Inhabited cottage** | One editable room; two resident reactions; three authored furnishings with specific affordances (e.g. rest, inspect, play). | Moving an object changes observable eligible reactions; behavior is deterministic/testable, not random wallpaper; arrangement persists. |
| **4 — Meaningful making** | One introductory pattern and two bounded construction choices; preserve cosmetic independence from capability. | Construction produces an understandable difference in available interaction, not merely different stats or color. |
| **5 — Threadwork experiment** | Define the *minimum* legal material actions required by the encounter (candidate terms: join, anchor, reinforce, mend); demonstrate at a safe home fixture. | Same explicit, deterministic rules explain valid and invalid interactions; no new universal physics engine. |
| **6 — First frontier encounter** | One visitor, one short trip to a damaged bridge, companion/tool selection, two distinct solutions and transparent recoverable failure/retreat. | Meaningful tradeoff in cost, prerequisite or result; no predetermined five-tap reward disguised as an adventure. |
| **7 — World remembers** | Persist repaired bridge/route status and one visible home consequence (e.g. visitor arrival, new lesson or changed workshop). | Reentering and reloading preserves change; no duplicated quest rewards; no loss of companion state. |
| **8 — Observed playtest** | Give the integrated slice to the client, with minimal coaching, and collect comments plus observed choices. | Unambiguous evidence of comprehension, attachment, interest and friction. Decide *iterate, advance, or pivot* with client/owner review. |

**Hard dependency order:** Baseline + accepted boundaries → identity/save → inhabited home and making → shared interaction grammar → encounter → persistent consequences → playtest. Checkpoints 3 and 4 may be prototyped independently **after** identity is stable; 6 must not claim completion until the shared interaction rules are testable.

## Three player loops at B

- **Hearth (approximately 1–5 minutes):** Visit → interact with individual residents → place or craft something → notice a reaction. No forced calendar duty.
- **Maker (short or medium session):** Learn a pattern → choose construction/materials → create an individual → observe what it can do → refine later.
- **Frontier (longer or chunkable):** Choose goal → prepare → venture → make tradeoffs → change a place → return and see the consequences.

Session lengths are design hypotheses, **not** hard gameplay timers. The player may happily decorate for an entire evening. Optional danger belongs beyond home, with clear, recoverable consequences; the cozy cottage must not impose login/streak pressure.

## Minimum data contracts (proposal for checkpoint 2)

These are **conceptual boundaries**, not an instruction to build an ECS, a generalized engine or a complete database.

| Contract | Minimum fields / rule |
| --- | --- |
| `PatternDefinition` | Stable `patternId`, `revision`, permitted construction choices; data catalog, not an owned individual. |
| `Critter` | Immutable `id`; `patternId` + version; `name`; `appearance`; bounded `construction`; limited `preferences` / personal history. |
| `Collection` | Critter records keyed by ID and explicit `favoriteId`; validate the favorite points at an existing individual. |
| `Household` | Resident IDs, furniture placement records (item instance/slot), interaction affordances; no fully autonomous AI needed. |
| `WorldProgress` | Explicit authored quest/route flags and one-time reward markers, separately validated from rendering. |

**Suggested module boundaries:** Pure definitions/rules for patterns, critter identity/collections, home interactions and world/quest transitions; a separate persistence/migration layer; React/SVG as presentation only. Reuse the current `src/state/game.js` pure-function/testing approach and `src/components/Lumenette.jsx` art, but do not make the renderer own identity.

### Save-migration contract — critical gate

The existing local key is `lumenette-hollow-save`. `src/state/useGame.js` uses Zustand `persist` with `version: 1`, while `src/state/game.js` stores `saveVersion: 1` in the domain object. **These are related but distinct version controls.**

The migration PR must:
1. Capture exact old persisted envelopes and clean/malformed/untrusted fixtures **before** editing persistence.
2. Define a v2 domain schema and a matching Zustand `migrate` strategy (or an intentionally chosen compatibility layer); never allow a version mismatch to silently erase valid Pip progress.
3. Convert legacy Pip's `name/color/face/accessory` to **one** stable individual ID, recorded exactly once, and set the initial `favoriteId` to that ID.
4. Preserve `yarn`, `level`, `lastClaimMs`, `nextUpgradeMs`, `ownedColors`, `decor`, `battery`, `gateOpen`, `wanderCount` and `visitCount` wherever valid.
5. Keep existing economy timestamps authoritative; never derive earnings from time previews, scene darkness or UI theme settings.
6. Keep the separate `lumenette-hollow-appearance-v1` preferences key untouched, and test after a refresh, reload, interrupted migration and repeated hydration.
7. Sanitize unknown pattern IDs, dangling favorite references, duplicate critter IDs and untrusted/malformed persisted data deterministically; document recovery and data-loss policy before shipping.
8. Provide forward-only migration tests with v1 fixtures and regression coverage. Do not assume that simply bumping `saveVersion` is enough for Zustand hydration.

**Engineering policy:** No breaking old saves merely to simplify the first critter collection. Back up representative old saves for tests without committing personal player data.

## First implementation experiment: two residents in a room

**Earliest genuinely new gameplay code** after gates 0–2: one room, two distinct saved critters, three furniture affordances. Example: a cushion (rest), a yarn basket (inspect), a window perch (watch). Each resident has one bounded authored preference; moving furniture changes its available response. Persist arrangement and individual identity.

**Acceptance:**
- The same pattern can produce two individually named, distinct records without collision.
- Both render simultaneously; the player selects a favorite and sees a correct small-size favorite preview (explicitly **not** a native phone widget).
- Furniture movement changes a visibly understandable reaction; repeated inputs and reloads reproduce the same legal state.
- No autonomous LLM, simulated hunger/sadness due to absence, or procedural anatomy.
- App retains baseline routes, game rewards, world lighting and day/night overrides.

If this fails to improve the feel of inhabitation, revise the behavior design before introducing RPG complexity.

## Parallel but nonblocking research

A **native phone-widget feasibility spike** can begin once favorite ID and renderer projection are defined. Prove target platform behavior on a real device; the web mock is not a widget. Do not hold up the playable A→B slice solely for native integration. Other future candidates—conventional creature combat, advanced gardening, breeding/genetics, procedural bodies, multiplayer, monetization—remain experiments **outside** the critical path.

For tactical depth, compare a compact traditional battle with a Threadwork obstacle *after* checkpoint 5, on equal art and instruction quality. Do not presume that the client wants no combat or that Threadwork must win.

## Protected behavior and review gates

- Preserve functioning routes, current currency rules, earned item ownership, cosmetic customization, save behavior, theme preferences, fictional solar lighting and responsive/browser checks.
- New domain transitions remain deterministic and testable apart from React wherever practical. Add abuse/malformed-input tests; confirm no duplicate rewards.
- Keep in-game appearance and world solar preview independent of game progress; no clock exploit or night-time attendance obligation.
- Preserve originality: no copied creature-capture apparatus, familiar franchise roster/UI, or copyrighted sprites. Treat actual crochet terminology as craft-authenticity work and fictional Threadwork as fiction.
- For significant changes, verify full Node tests, Vite build, Chromium navigation at tested widths, save migration fixtures and visual/accessibility evidence.
- The owner and client approve product mechanics and gameplay direction; passing CI is **not** gameplay acceptance.

## Risks and unresolved decisions

| Risk or decision | Importance | Resolution gate |
| --- | --- | --- |
| Creature-collector versus homestead-RPG center | **High** | Checkpoint 1: agree one provisional product hypothesis; keep coexistence testable. |
| Existing v1 save accidentally reset by v2 migration | **Critical** | Checkpoint 2: fixture-driven migration/rollback and browser hydration checks. |
| Crafted critters become optimized equipment instead of beloved individuals | **High** | Checkpoints 3–5: allow noncompetitive care, differentiate abilities from cosmetics. |
| Furniture behavior feels superficial or scripted | **High** | Checkpoint 3: contrast reactive and static room in actual play. |
| RPG encounter becomes a dressed-up five-tap minigame | **High** | Checkpoint 6: real different costs/prerequisites/results, observable failure recovery. |
| Companion traits, patterns and art explode combinatorially | **Medium-high** | Checkpoint 4: authored combinations, strict content budget and revisioned data. |
| Gameplay loop may not match client's preferences | **High** | Checkpoint 8: observe voluntary replay and what the client skips or dislikes. |
| Native favorite widget feasibility and target device | **Separate risk** | Early independent real-device spike; do not claim it works from a browser mock. |
| Real-world time becoming a progression gate | **Medium** | Keep astronomy presentational; time preview cannot advance economy. |
| Dependency lockfile/design acceptance incomplete | **Medium** | Checkpoint 0; record evidence, do not backfill claims of approval. |

## Source documents and precedence

1. **Implementation truth:** [Kisuul/hollowlumen](https://github.com/Kisuul/hollowlumen), current source, tests, and [existing prototype documentation](../PROTOTYPE.md).
2. **Accepted visual design:** [Visual Design System v1.0](../design/DESIGN_SYSTEM_v1.md), with actual implementation subject to rendered review.
3. **Nonbinding cross-team exploration:** [Playable Game Hypothesis](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/PLAYABLE_GAME_HYPOTHESIS.md), [Integrated Game Vision](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/INTEGRATED_GAME_VISION.md), [Five-Game Mechanics Sieve](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/FIVE_GAME_MECHANICS_SIEVE.md), and [Client Review](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/CLIENT_REVIEW.md).
4. **User/owner direction:** The A→B straight-line plan outlined in the conversation on 2026-11-05. Any material change to the accepted direction returns to the user and original designer.

**This roadmap records intent, dependencies and possible tests. It neither grants permission for a sweeping gameplay implementation nor constitutes merge authorization for runtime code.**
