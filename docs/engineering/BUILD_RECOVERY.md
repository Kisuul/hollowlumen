# Build recovery diagnostic — Stage 2

## Observed state (2026-11-05)

- `main` head `1231692f6c1be23765dc636095b4f49f41df6f5b`.
- Two independent changes, PR #3 (theme) and PR #4 (solar), were merged. Both added isolated files; neither imported its new module into the entrypoint nor changed the application route tree, existing stylesheet, or game economy.
- `package.json` includes Vite, React 19, TanStack Router, Tailwind v4, Zustand, but **no package-lock.json** is committed.
- The original gameplay-only Node test suite passes 9/9 on a saved source snapshot.
- In the diagnostic environment, the npm registry and github.com are unreachable by DNS, so `npm install` and `npm run build` are not verified.
- No commit status checks or CI workflow were present on the previous main revision.
- This does **not** identify the user's reported failure; more information is required for a targeted fix.

## Purpose of this branch

Provide a GitHub-hosted, read-only build-verification workflow. It attempts a dependency resolution to a **candidate** lockfile, installs from that file, validates design tokens and theme CSS, runs unit tests, and attempts the production build. If possible, it uploads the candidate lockfile for review.

**The workflow does not push the lockfile, alter main, or perform deployment.** Actions are pinned by commit SHA; token permissions are read-only.

## Review gates

1. Confirm workflow run availability and inspect actual job logs, not just PR metadata.
2. On success, obtain the candidate lockfile; review transitive package versions and any lifecycle scripts before committing a pinned lockfile.
3. On failure, identify the exact command and error, patch the narrow root cause, rerun.
4. Test the browser navigation, accessibility and an existing saved-game round-trip before declaring the project repaired.
5. Keep this PR unmerged until the checks are proven; the workflow alone is not proof of a working app.

**If Actions are disabled or npm is inaccessible on the runner**, collect the local error output from the user's machine to reproduce the problem. Do not claim a root cause from missing CI or lockfile alone.
