# Stage 2 — Theme foundation (Lane A)

This branch deliberately **does not restyle the running game yet**. It establishes isolated, testable theme infrastructure for the later Home + Pip integration.

- `src/theme/preferences.js`: validated UI and scene preferences, independent of the `lumenette-hollow-save` economy key; supports follow-world/light/dark UI and follow-device-time/always-day/always-night scene modes.
- `tools/build-theme-css.mjs`: creates `src/theme/theme-tokens.css` from canonical DTCG tokens using Node built-ins only.
- `src/theme/theme-tokens.css`: generated day/night variables; **not imported** by runtime CSS until the integration PR.
- `tests/theme.test.js`: preference, storage failure, save isolation and generator checks.

## Check

```sh
node tools/validate-design-tokens.mjs
node tools/build-theme-css.mjs --check
node --test tests/*.test.js
npm run build
```

**Known blocker:** package registry unavailable in the authoring environment, so dependency installation and Vite build are not verified. The next agent must run the commands in a network-enabled checkout, generate/review the package lock, and **not** claim the theme is visible in the app before wiring it.

## Interface contract for Lane C

`resolveSceneNight(preferences, computedWorldNight)` computes effective scene darkness from world mode and model result. `resolveUiTheme(preferences, sceneIsNight)` returns `day` or `night` for `document.documentElement.dataset.uiTheme`. Import the generated CSS from the entry stylesheet after review; do not mutate game-save timestamps or `src/state/game.js`. A temporary preview hour is **not persisted**.

**Preserve Stage 1:** original prototype routes, earned yarn, decorations and local saves remain unchanged.
