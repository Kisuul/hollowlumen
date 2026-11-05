# Palette integration — Home/Pip preview (Stage 2, Lane C)

This PR connects the already merged design tokens and solar mathematics to the actual React prototype. All five routes adopt the **approved light/dark semantic palettes**; Home also gains the first continuous time-of-day cottage lighting treatment and a temporary 24-hour scrubber.

## Architecture

- `src/theme/presentation.js` is pure and game-independent; it computes `uiTheme`, scene phase, glow intensities, and whether time preview is active.
- `src/theme/AppearanceProvider.jsx` manages a minute-resolution browser clock, scene preview and user preferences. Preferences use the existing `lumenette-hollow-appearance-v1` key, never `lumenette-hollow-save`.
- `src/theme/palette.css` maps visual components to the DTCG-generated semantic variables after `src/styles.css`. Night mode has matching text/surface roles; there is no whole-app dimming.
- `src/App.jsx` adds global accessible interface/scene selectors and a Home-only time scrubber; lighting modifies presentation values, **not** idle/reward timestamps.
- `src/main.jsx` loads the semantic tokens and applies the initial theme before mounting React, reducing flash for saved dark settings.

## User controls

**Interface:** Follow World, Light, Dark.  
**World lighting:** Follow Clock, Always Day, Always Night.  
**Home scene preview:** Slider for hours 00:00–23:45 with a “Return to live” button. Preview is not saved, does not claim real local sunrise, and is inactive while world mode is forced.

The device clock is mapped to the fictional 45°N Hollow valley. There is no GPS, cloud processing, weather or real lunar ephemeris. Starglow is decorative.

## Acceptance / regression

- Day palette recognizable and no residual inaccessible green-primary text.
- Dark palette readable across Home, Wander, Idle, Yarn and Shop; prominent controls have 44px minimum hit height where practicable.
- Keyboard-operable dropdowns and time slider; labeled selections and focus-visible.
- No appearance preference changes to gameplay save or existing earned yarn calculations.
- Time-of-day gradient, cottage window glow, stars and Pip glow react to the slider; animation respects reduced motion.
- Run `node tools/validate-design-tokens.mjs`, `node tools/build-theme-css.mjs --check`, `npm test`, `npm run build`, and the Chromium production smoke at three viewport widths.
- Manually review screenshots on mobile/desktop and test old saved games before authorizing release.

**Do not merge merely because unit tests pass.** Designer-facing approval of the rendered Home/Pip experience is a separate gate.
