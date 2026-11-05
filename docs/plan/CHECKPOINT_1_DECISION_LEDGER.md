# HollowLumen — Checkpoint 1 decision and approval ledger

**Date:** 2026-11-05  
**Status:** Review aid; factual observations and recommendations kept distinct.  
**Partner:** [Unified direction candidate](CHECKPOINT_1_UNIFIED_GAME_DIRECTION.md) · [A → B roadmap](FIRST_THREAD_A_TO_B_ROADMAP.md).

## Status semantics

- **EXISTS:** Current running code or already recorded document evidence; does **not** mean the client loves it.
- **OWNER-DIRECTION:** User has asked to investigate/proceed with the **development plan**; this is not an automatic client approval of an exact gameplay mechanic.
- **CANDIDATE:** Preferred reconciliation or engineering experiment; requires review before promotion to a production contract.
- **OPEN:** Unanswered choice that materially affects design or architecture.
- **PARKED:** Not part of the first integrated vertical slice.
- **ACCEPTED:** Only use with attributable explicit owner/client decision and date; do not convert candidates to accepted merely because a document PR merges.

## Evidence register

| ID | Claim and source of evidence | Status | Implication |
| --- | --- | --- | --- |
| EV-01 | Current `Kisuul/hollowlumen` main has one Pip, local v1 save, five routes, SVG art, theme/solar components. Source inspected at `c00e15e`. | **EXISTS** | Preserve code and regressions. |
| EV-02 | User reported the original designer chose the day and night palette **directions**. | **OWNER-DIRECTION** | Do not extend to approval of rendered application or new character art. |
| EV-03 | User reported client's favorite games: Stardew Valley, Minecraft, Don't Starve, Pokémon; observed repeated Animal Crossing use. | **OWNER-DIRECTION** | Genre references only; do not infer preferred difficulty or specific submechanics. |
| EV-04 | Asked about creating, discovering, caring, client replied **“all three!”**. User report. | **OWNER-DIRECTION** | All three motivations should have visible places in prototypes. |
| EV-05 | User expressed personal liking for RPGs and approval **in principle** of expanded homestead direction. | **OWNER-DIRECTION** | Authorize exploration/hypothesis testing, not a forced combat-first game. |
| EV-06 | CosmicDance research proposes individually created critters, pattern construction, native favorite widget ambition, and optional RPG loop. Pinned design revision `059d52c`. | **CANDIDATE** | Review as creative input, not binding engineering requirements. |
| EV-07 | The First Thread A → B roadmap has been merged on main as planning documentation. | **EXISTS** | Defines safe checkpoint sequence, not product signoff. |
| EV-08 | Checkpoint 0 PR #8 has passed CI but is open and unmerged at this ledger's preparation. | **EXISTS** | Review/merge its baseline protections before runtime save migration. |

## Product direction decisions

| ID | Question / proposed default | Status | Approval or evidence needed |
| --- | --- | --- | --- |
| DIR-01 | **Unifying premise:** Make living companions → inhabit personal home → venture → return with persistent change. | **CANDIDATE** | Owner approval of **bounded prototyping**; client reaction to executable slice before product-canon promotion. |
| DIR-02 | **Primary attachment:** Individual critters, not interchangeable units or a currency counter; the home enables those relationships. | **CANDIDATE** | Two independently saved residents, observed recognition/attachment. |
| DIR-03 | **Home stays playable** with a limited ability to arrange meaningful objects. | **CANDIDATE** | Compare inhabited room to static room; protect current cottage. |
| DIR-04 | **Pattern-defined construction** affects possible interactions, while color/appearance remains cosmetic. | **CANDIDATE** | Simple make/test experiment; confirm client enjoys chosen tradeoffs. |
| DIR-05 | **Short, optional frontier** with explicit choice and recoverable risk. | **CANDIDATE** | Compare risk/no-risk; client preference not yet known. |
| DIR-06 | **Threadwork** (anchor, reinforce, join, mend etc.) is a hypothetical common interaction vocabulary, not a mandatory RPG engine. | **OPEN** | Compare with familiar battle/puzzle actions after simple authored test. |
| DIR-07 | **Full RPG combat:** no decision to require or forbid battles. | **OPEN** | Equal-polish paired encounter tests; user likes RPGs but this does not resolve client preferences. |
| DIR-08 | **Native favorite phone widget:** source concept aspiration; device/platform feasibility unproven. | **CANDIDATE** | Choose target platform and run separate real-device spike after identity projection exists. |
| DIR-09 | **Progression:** knowledge, relationships, expressive options and changed places over a single currency ladder. | **CANDIDATE** | First loop should provide at least one non-currency return reward. |
| DIR-10 | **Offline idle/battery-based reward boost:** preserve current behavior but don't make these the game's defining progression until tested. | **CANDIDATE** | Explicit owner decision before any economy/UI removal. |
| DIR-11 | **Home care:** no compulsory login schedule, punitive neglect or irreversible companion loss in default slice. | **CANDIDATE** | Test optional risk outside home; ask client about acceptable care consequences. |
| DIR-12 | **Native building, 3D, open world, breeding, procedural anatomy, social co-op, paid shop:** not dependencies of the first integrated slice. | **PARKED** | Independent hypotheses, cost/benefit and new approval. |

## Implementation gates (nonbinding until approved work order)

| ID | Gate | Status at preparation | Cannot claim success without |
| --- | --- | --- | --- |
| ENG-00 | Reproducible locked dependencies + saved v1 fixtures | **OPEN: PR #8 unmerged** | Reviewed PR merge and green final-head CI. |
| ENG-01 | Scope reconciliation | **CANDIDATE: this PR** | User agrees provisional pillar/contract; client gameplay feedback still explicitly open. |
| ENG-02 | V2 critter identities / favorites / pattern refs | **OPEN** | Exact v1 fixtures, explicit Zustand `persist` version migration, sanitation tests, no state loss. |
| ENG-03 | Inhabited-home experiment | **OPEN** | Two individuals + three furnishing interactions, deterministic/replayable, persistent. |
| ENG-04 | Construction and material vocabulary | **OPEN** | At least one real capability choice and legal action rules, not cosmetic-only or physics engine. |
| ENG-05 | Bridge outing and consequence | **OPEN** | Two distinct solutions and one world/home flag survived reload, no duplicate reward. |
| ENG-06 | Original designer playtest | **OPEN** | Observed comprehension, voluntary return and client-stated likes/dislikes recorded with permission. |

## Minimal questions to return to owner/client

1. **Orientation:** Does the provisional `MAKE / INHABIT / VENTURE` center match the intended fantasy, or is *creature-first and cottage as staging area* more accurate?
2. **Creature authored construction:** Is a simple piece/ability choice enjoyable, or should construction be mostly tactile/cosmetic?
3. **Adventure challenge:** Should the first test emphasize environmental repair, direct tactical conflict, or compare both on equal terms?
4. **Risk tolerance:** Are supply loss and recoverable fraying welcome; what about time pressure or creature injury?
5. **Favorite widget platform:** Which actual phone/device is the first target? A responsive browser mock is not a shipping home-screen widget.
6. **Rendered appearance:** Has the client actually seen and accepted the new Home/Pip day/night implementation? Record the artifact and date rather than inferring.
7. **Authenticity:** Who can review crochet construction visuals and terms? `knit/purl` in the current minigame is knitting vocabulary, not crochet instruction.

## Evidence and approval recording protocol

Use an explicit entry whenever a choice changes status:

```text
Decision ID:
Status (CANDIDATE / ACCEPTED / REJECTED / PARKED):
Exact decision or scope:
Decision-maker (owner / original designer):
Date:
Artifact, build, screenshot or test actually reviewed:
Direct feedback (quotation only if supplied and permitted):
Approval boundaries and unresolved issues:
Next bounded coding task:
```

Keep subjective praise, feature requests and technical acceptance separate. Never claim client signoff based on agent consensus, a merged documentation PR, a palette selection or a passing test. Avoid recording private personal data in public repositories without the person's permission.

**Standing protection:** No Kestrel memory edits and no automatic merges were authorized by this documentation checkpoint.
