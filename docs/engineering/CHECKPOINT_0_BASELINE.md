# Checkpoint 0 — baseline hardening and v1 save preservation

**Date:** 2026-11-05  
**Status:** Implementation checkpoint; awaiting CI run, lockfile review, and original designer's rendered UI acceptance.  
**Roadmap:** [First Thread A → B](../plan/FIRST_THREAD_A_TO_B_ROADMAP.md).  
**Base:** `main` `c00e15e7af5ba028584363f4be6151a373b084ec`.

## Scope

- Pin the existing React/Vite/TanStack/Zustand development dependency graph to a tracked npm lockfile.
- Change continuous integration from *resolving a new graph on every run* to `npm ci` against the committed lockfile.
- Preserve the **current version-one game save contract**, including exact currency, unlock, cooldown and claim behavior.
- Add synthetic representative/hostile Zustand v1 storage-envelope fixtures and deterministic Node tests.
- Do **not** change runtime gameplay, add multiple critters, modify the economy, silently migrate saves or modify appearance/solar behavior.

## Current v1 persistence semantics

- Storage key: `lumenette-hollow-save`.
- Zustand `persist` envelope version: **1**.
- Domain field `saveVersion`: **1**.
- `src/state/useGame.js` merges `sanitizeSave(persisted, Date.now())`; no explicit `migrate` function yet.
- Separate appearance settings: `lumenette-hollow-appearance-v1` (must stay separate).
- Old saves have direct `name`, `color`, `face`, `accessory` fields representing one Pip; the next checkpoint will need stable individual identity and an explicit migration.
- Date-sensitive test fixtures use an injected deterministic clock, not the developer's real device time.

**The fixtures in `tests/fixtures/` are entirely SYNTHETIC, not exports of any real person's saves.** They are normative examples of the current wire-format and sanitizer behavior, not proof of migration correctness after the schema changes.

## Reproducible build requirements

1. Review root package dependencies against the generated `package-lock.json` (lockfile v3).
2. Pin the package-lock exactly once on this controlled branch; never rewrite `main` automatically.
3. CI must use `npm ci` as its sole installation path for app dependencies and must verify `npm test`, `npm run build`, token validation and Chromium browser smoke tests.
4. The Playwright test harness remains isolated: installing it with `--no-save --no-package-lock` must not mutate the tracked lockfile.
5. Run independent verification that `npm ci` doesn't change the lockfile (e.g., `git diff --exit-code -- package-lock.json`).
6. Inspect audit findings and runtime package risk; unexpected critical/high vulnerabilities should be recorded, not ignored.
7. Do not claim a new lockfile is safe merely because compilation passes; this gate establishes version reproducibility.

## Temporary CI bootstrap

To avoid copying a lockfile by hand, the branch initially includes an **ephemeral one-time, same-repository PR-only lockfile pinning workflow**. The job is constrained to the exact `chore/checkpoint-0-baseline-protection-20261105` branch and checks whether a lockfile already exists before performing any push. This workflow is to be **removed before the PR is declared review-ready**, restoring read-only CI permissions. Its only intended write is `package-lock.json` on this branch.

## Acceptance ledger

| Requirement | Status at branch creation |
| --- | --- |
| Version-one synthetic save fixtures and sanitizer regression tests | Added; awaiting CI |
| Existing Node/game/domain test coverage | Existing; rerun on branch |
| Reviewed pinned `package-lock.json` | Outstanding until generated and examined |
| Reproducible CI (`npm ci` without new dependency resolution) | Outstanding until pinned |
| Vite production build and Chromium 1280/390/320 responsive smoke | Existing workflow; rerun |
| Original designer approval of rendered day/night Home/Pip | **Open: no independent approval evidence** |
| Broader screen-reader/zoom/color audit | Still open; not a claim of Checkpoint 0 completion |

## Merge authorization

This is a **bounded housekeeping PR**. No RPG/gameplay design proposal becomes binding by merging it. Review committed lockfile, CI and test evidence separately; do not merge solely because the roadmap exists.

**No Kestrel memory updates**, per standing user request.
