# Stage 2 — Pure solar model (Lane B)

This branch adds **only** a zero-dependency, deterministic fictional solar model. It does **not** change React, CSS, current gameplay, saves or the economic clock.

## Goals

- Reproduce approximate Earth-like seasonal daylight at 45°N.
- Model smooth solar elevation (not a hard 18:00 toggle), morning/evening direction and twilight phases.
- Produce normalized ambient, star and lantern intensities for future Home/Pip lighting.
- Isolate approximate solar clock calculations from idle earnings, timer and rewards.

## API

`src/solar/solar.js` exports:

- `solarStateAt({ year, month, day, solarHour, latitudeDeg })` pure input/output model; solarHour 0–24 **exclusive**.
- `daylightHours(year,month,day,lat)` theoretical day length (flat horizon; approximate standard refraction).
- `solarStateFromDeviceClock(date)` adapter to the fictional solar time.
- `phaseFromElevation(deg)` and `lightingFromElevation(deg)` for readable, continuous scene updates.
- `standardTimeSolarHour(hour,offsetMinutes,standardOffsetMinutes)` that prevents a 1-hour daylight-saving wall-clock jump in the fictional solar simulation.
- Calendar validation helpers.

## Accuracy boundaries

The declination uses NOAA's fractional-year approximation, and the elevation uses the standard geometric solar position equation. Fictional solar noon is aligned with **standard device wall-clock noon**; longitude, equation-of-time corrections, local horizon, actual location and lunar phase are intentionally absent. At DST, local clock hour is offset against Jan/July standard-time estimate (typical zones only; historical/civic timezone reforms can differ).

**Do not tell players these are their actual local sunrise/sunset times.** The scene is intentionally plausible for a fictional world, not a navigation/astronomy application.

## Verify before merge

```sh
node --test tests/solar.test.js
node --test tests/*.test.js
npm run build
```

Tests cover equinox, solstices, seasonal day lengths, leap dates, polar handling, twilight thresholds, rising-vs-setting, bounded lighting, DST clock behavior, and scene/economy separation.

## Integration boundary

Lane C may import `solarStateFromDeviceClock` for current-time lighting and `solarStateAt` for temporary preview; **neither** may replace `Date.now()` in `src/state/game.js`, modify `lumenette-hollow-save`, or grant any time-based rewards. For scene overrides, use Lane A's independent appearance preferences. Real moon astronomy, weather and GPS remain deferred.
