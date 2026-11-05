# HollowLumen — Checkpoint 1: unified game direction

**Version:** 0.1.0-candidate  
**Prepared:** 2026-11-05  
**Status:** **PROPOSED RECONCILIATION FOR OWNER/DESIGNER REVIEW — not client-approved canon.**  
**Authority:** User coordinates/approves engineering direction and merges; the intended original designer/client judges the experience. Cross-team agent proposals are nonbinding.
**Implementation baseline:** `Kisuul/hollowlumen` `main` at `c00e15e7af5ba028584363f4be6151a373b084ec`. The Checkpoint 0 lockfile and regression work is on **open, unmerged PR #8**; do not treat its branch as part of main.  
**Research baseline:** `cosmicdance-4-2-0/hollowlumen` design revision `059d52c9acf5eb9330fb044af78605f069ad0503`. This does not merge or adopt that fork's code/specifications.

**Related:** [A → B roadmap](FIRST_THREAD_A_TO_B_ROADMAP.md) · [Checkpoint 1 decisions](CHECKPOINT_1_DECISION_LEDGER.md) · [Current prototype behavior](../PROTOTYPE.md).

> **Working genre hypothesis:** A creature-crafting homestead adventure with a living cottage, individually made yarn companions, authored exploration, and optional meaningful tactical risk.
>
> **Player promise:** Make living companions; give them somewhere to belong; discover what they can do beyond the doorstep; return to a home and world that remember your choices.

This is the **smallest coherent common direction to test**, not authorization to construct an open-world RPG. It records agreements at the *hypothesis* level, with explicit approval gates for gameplay and technical decisions.

## 1. Reconciling the three design lines

| Source | What it contributes | Reconciliation | What we do **not** infer |
| --- | --- | --- | --- |
| [Current Kisuul implementation](https://github.com/Kisuul/hollowlumen/tree/c00e15e7af5ba028584363f4be6151a373b084ec) | Running five-screen cottage prototype, Pip, local-save economy, SVG art, day/night theming, solar scene, tests | **Preserve** as the working code baseline. Incrementally reuse/revise components behind tests. | Prototype tab names, economy and demo minigames are not permanent genre requirements. |
| [CosmicDance creature-first specification](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/PRODUCT_SPEC.md) | Individually made crochet critters, patterns, relationships, collection/favorite identity, future native-widget ambition | Critter identity and creation become **candidate core differentiators**, not another cosmetic shop. | Its historical exclusion of cottage and adventures does not override the later integrated exploration or existing running software. |
| [CosmicDance integrated-game hypothesis](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/PLAYABLE_GAME_HYPOTHESIS.md) | Home → Make → Venture → Change → Return; inhabited home, material interaction rules, meaningful challenge | Adopt as the **leading testable A → B vertical-slice hypothesis**. | Proposing Threadwork or battles does not establish their quality, their mechanics or client approval. |

**Reason for this reconciliation:** The client reportedly enjoys creating, discovering and caring for characters (her response was **“all three!”**). The reported favorite games and observed Animal Crossing play suggest useful inspirations, not verified preferences for individual mechanics. The user is personally enthusiastic about RPGs; that interest must not be substituted for the client's preference for combat/difficulty. Avoid importing recognizable IP, layouts, character ensembles or capture apparatus from other franchises.

## 2. One game, three pillars and one return loop

- **MAKE — player authorship:** Discover/learn patterns; choose a few construction features; create individually named Lumenettes; craft useful and expressive objects. Patterns are definitions, individuals are owned creations. Yarn color is cosmetic; never an unexplained combat penalty.
- **INHABIT — home and belonging:** The cottage is a playable, rearrangeable place where individual residents react to furnishings and one another. Names, personal identity, small habits and household membership persist. A pleasant visit without adventuring must remain valuable.
- **VENTURE — discovery and consequence:** An optional authored outing uses understandable preparation and construction-derived interactions. Some obstacles may involve risk/tradeoffs, but retreat and failure are legible and recoverable. Solving a problem changes something persistent.

**Shared return loop:** Notice an opportunity at home → choose whether to make/prepare → venture *if desired* → obtain material, knowledge, relationship or world change → come home and see an observable consequence → discover a new possibility.

The loops must **interlock**, not become three independent currency minigames. An example is a newly made critter with a flexible attachment reaching a bridge anchor, repairing access for a visitor who later responds to the player's room arrangement. This scenario is **illustrative, not implemented content**.

### Session grammar

1. **Hearth:** Visit, greet/pet residents, place or move a furnishing, see a response; short visits are complete sessions.
2. **Maker:** Select a learned pattern, choose material/structure, create a named individual/object, examine its consequences; medium or extended sessions are valid.
3. **Frontier:** Prepare tools/companions, attempt a challenge, learn and return; a longer session may be resumed or split into short interactions.

**Invariant to test:** Playing in any one pillar is optional in a given session. Do not impose daily streaks, compulsory real-time attendance, premium relief from delays, permanent companion neglect or automatic creature loss. The home and companion identities remain safe even if an optional expedition can fail.

## 3. Product scope by evidence, not enthusiasm

**Protected existing software** (these are *current capabilities*, not guarantees that their UI is final):
- Home, Wander, Idle, Yarn and Shop navigation; a single customizable Pip; existing purchases and short challenges; save v1 and local currency/idle logic.
- SVG companion art, semantic Pastel Twilight Craft / Moonlit Lavender palettes, UI theme selection independent of scene lighting, fictional solar/day/night preview, and CI/test harness.
- Existing working behavior remains intact until a separately approved migration or replacement is demonstrated.

**Proposed First Thread slice (A → B goal, bounded):**
1. Pattern catalog with at least one authored pattern and a bounded, **meaningful** construction choice.
2. Two uniquely identified, persistent, named companions, one favorite, in a single room.
3. Three authored furnishings with a placement/interaction affordance and two readable resident reactions.
4. One visitor, one small authored destination, one construction-dependent obstacle with two actually different resolutions.
5. One persistent world change and a visible changed home interaction upon return.
6. A favorite-view mock **labelled as a mock**, independent of any real native widget.
7. Old v1 saves preserved through a migration with browser hydration and round-trip tests.

**Experiments only (not A → B completion requirements):** Full battle system, creature-versus-creature tactical combat, detailed RPG classes, stamina/sanity/hunger, multiple biomes, serious farming, genetics/breeding, procedural bodies, full autonomous behaviors, co-op, tournaments, player content exchange, commercial transactions and native phone widget delivery. A **separate, early widget feasibility spike** may run once stable critter IDs exist; it must not block the web vertical slice.

**Not acceptable without a new user/client decision:** Publishing monetized RNG or pay-to-win combat advantage, forced real-time night rewards, hard-core permanent companion loss, adding a server-authoritative economy to the current client save, or wholesale replacing the working app with a design fork.

## 4. Minimal shared vocabulary (not an engine contract)

| Term | Definition / invariant |
| --- | --- |
| **Lumenette / Critter** | One individual created or owned by the player, identified with a stable ID independent of its name or appearance. |
| **Pattern definition** | Authored specification of allowed construction alternatives, with a stable pattern ID/revision. It is not an individual. |
| **Construction** | Bounded choices made for an individual that may alter permitted interactions; cosmetics are independent. |
| **Collection** | Individual records, ownership, favorite ID and household membership; a favorite must reference a valid individual. |
| **Household** | Explicit rooms/slots, furniture placement, occupants and eligible furniture interactions. No sophisticated AI schedule is assumed. |
| **Threadwork** | *Candidate* fictional rule vocabulary for material interactions (e.g. anchor, reinforce, join, mend), authored/deterministic rather than a real crochet physics engine. |
| **World progress** | Persisted authored conditions (e.g. repaired bridge) and one-time rewards, never inferred from scene lighting. |
| **Favorite projection** | Read-only view of the chosen individual for in-app portrait and eventual widget. A browser mock does not demonstrate native widget feasibility. |

Use **pure, deterministic domain transitions** and keep presentation and persistence boundaries separate. These terms constrain conversation; they **do not freeze field names, JavaScript module paths, IDs, class systems or encounter algorithms** ahead of Checkpoint 2 interface review.

## 5. Concrete acceptance: the first complete loop

The First Thread / Broken Bridge is the current test narrative, not approved lore. An executable demonstration must prove:

| Probe | Observable evidence |
| --- | --- |
| Identity | The same pattern can produce two distinct saved critters; names/favorite remain correct after reload. |
| Inhabitation | Moving an authored furnishing changes an eligible resident reaction without breaking customization. |
| Construction | At least one non-cosmetic construction choice affects legal choices/actions. |
| Encounter | Two solutions differ in prerequisites, tradeoff, risk or world outcome, not merely button text. |
| Consequence | Completing a challenge changes a route/visitor/home state that persists, without repeat reward exploits. |
| Low-pressure play | The player can create, observe, decorate and leave without being forced to quest or attend at an hour. |
| Compatibility | Existing v1 saves, progress, timers, day/night preferences and the five baseline routes survive the experiment or an explicit approved migration. |
| Fun | The original client can understand what they are doing and willingly chooses to revisit one of the loops, with observed hesitation and dislikes recorded. |

**A green CI build proves execution, not fun.** An illustration or pitch does not satisfy the playable probes.

## 6. Decision and authority hierarchy

1. **Current code and tests are the authoritative description of what runs.** The [A → B roadmap](FIRST_THREAD_A_TO_B_ROADMAP.md) is an approved-to-document development *plan*, not gameplay implementation authorization.
2. **Recorded client acceptance** governs art/gameplay experience; approved day/night **palette direction** does not imply rendered UI signoff or approval of Threadwork, battles, critter temperament or pricing.
3. **User/owner direction** authorizes scoped engineering work and the coordination of branches/PRs. Proceeding to this checkpoint authorizes documentation/reconciliation only.
4. **CosmicDance drafts** are valuable but **nonbinding input**. No cross-repo wholesale merge and no silent elevation of draft mechanics to canonical requirements.
5. **Proposals** must earn an approval entry and—where behavior is claimed—executable evidence. The [decision ledger](CHECKPOINT_1_DECISION_LEDGER.md) lists current evidence and gaps.

Merging this file **accepts a reviewable hypothesis and shared terms**, not individual speculative mechanics. A production code contract requires explicit owner scope and actual client feedback wherever the choice affects the user experience.

## 7. Immediate checkpoint handoff and boundaries

**Checkpoint 0 remains a merge dependency:** The pinned lockfile/legacy-save fixtures on [PR #8](https://github.com/Kisuul/hollowlumen/pull/8) have a passing CI run but are **not yet in main** at authoring time. Its final review and merge must precede an integrated v2 save rewrite.

**Next coding lane after review (Checkpoint 2):** Prepare a pure domain-model proposal and tested migration plan for stable individual identities, patterns, favorite reference and household membership. Use synthetic v1 fixtures from Checkpoint 0. Do not rewrite game UI, add RPG combat, alter the economy/solar model, or start a full native widget. Existing game save uses `lumenette-hollow-save`, Zustand envelope `version: 1`, and domain `saveVersion: 1`; both version transitions need explicit handling. `lumenette-hollow-appearance-v1` stays separate.

**First playable experiment after identity acceptance (Checkpoint 3):** Two residents, one room, three furnishings; visible deterministic reactions and preserved layouts. This is enough to disprove the inhabitation hypothesis cheaply before RPG scope expands.

**Owner review requested for this Checkpoint 1 PR:** Is the combined **MAKE / INHABIT / VENTURE** hypothesis accepted for *bounded prototyping*? Are there any categorical no-go mechanics or non-negotiable features missing? Does the client want a stronger creature-first or home-first emphasis? Record the answer; do not fill it in by assumption.

## Source provenance (pinned, not imported)

- [Implementation prototype](https://github.com/Kisuul/hollowlumen/tree/c00e15e7af5ba028584363f4be6151a373b084ec) and [Visual design baseline](../design/DESIGN_SYSTEM_v1.md).
- [CosmicDance source audit](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/SOURCE_AUDIT.md) and [creature-first specification](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/PRODUCT_SPEC.md).
- [Integrated Game Vision](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/INTEGRATED_GAME_VISION.md), [Playable Game Hypothesis](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/PLAYABLE_GAME_HYPOTHESIS.md), [Five-Game Mechanics Sieve](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/FIVE_GAME_MECHANICS_SIEVE.md), [Client Review](https://github.com/cosmicdance-4-2-0/hollowlumen/blob/059d52c9acf5eb9330fb044af78605f069ad0503/docs/CLIENT_REVIEW.md).

**No runtime, gameplay economy, network service, build configuration, assets or Kestrel memory is modified by Checkpoint 1.**
