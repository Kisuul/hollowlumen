# Lumenette Hollow — Moonlit Lavender: Night Palette & Day/Night System v0.1

**Status:** Nighttime palette choices approved (user-reported, 2026-11-05); solar behavior and rendered experience still proposed. Canonical spec: [Visual Design System v1.0](DESIGN_SYSTEM_v1.md).  
**Companion to:** [Pastel Twilight Craft style guide](STYLE_GUIDE_v0.1.md)  
**Date:** 2026-11-05  
**Scope:** Design tokens, scene lighting, simulated astronomical cycle, accessibility and acceptance criteria. **This document does not implement the system.**

## 1. Creative target

**Day:** a lavender garden cottage lit by gentle sunlight.  
**Dusk:** peach-lilac horizon, long shadows, lamps beginning to glow.  
**Night:** deep aubergine sky, cool moonlit paths, luminous yarn companions and inviting amber windows.  
**Dawn:** slate-blue sky warming toward petals and pale lavender.

The original designer approved the earlier **daylight visual reference** and subsequently the **nighttime palette choices**, as reported by the user. Environmental and UI implementation details are still speculative. All pastel accents retain the same character identity; the world should not become black, neon, gothic or illegibly dark.

**Two independent concerns:**
1. **World lighting** tracks day/night/time/season.
2. **User-interface theme** (light/dark) stays readable and overridable.

Never darken all UI text and controls merely by applying an opacity filter to the entire app.

## 2. Moonlit Lavender tokens

| Token | Hex | Role |
| --- | --- | --- |
| `night.canvas` — Midnight Aubergine | `#1B182A` | Background and night sky foundation |
| `night.surface` — Velvet Plum | `#241F37` | Cards and panels |
| `night.surfaceRaised` — Dusk Heather | `#30273F` | Popovers, elevated surfaces |
| `night.text` — Moonmilk | `#F3ECFF` | Main text |
| `night.textSecondary` — Misty Mauve | `#C8BDD9` | Secondary text |
| `night.action` — Moonlit Lilac | `#D8C7FF` | Primary button/background highlight |
| `night.actionText` — Midnight Aubergine | `#1B182A` | Text/icons on light action |
| `night.magic` — Lavender Bloom | `#B79CFF` | Lumenette glow, selected ornaments |
| `night.rose` — Twilight Rose | `#E9B6D7` | Petals, customization accents |
| `night.lamp` — Firefly Gold | `#F6DFA5` | Window, lantern and warm light |
| `night.skyAccent` — Moonwater Blue | `#A9C7E8` | Moonlit sky and reflected light |
| `night.leaf` — Moon Sage | `#B8D5BE` | Cool illuminated foliage |
| `night.border` — Slate Lavender | `#8276A1` | Essential UI boundaries and focus contrast |

These are **semantic starting points**, not a mandate to make every light and shadow a flat color swatch.

### Contrast sanity checks

Calculated with the WCAG relative luminance formula on **solid opaque colors**:

| Combination | Ratio | Interpretation |
| --- | --- | --- |
| Moonmilk `#F3ECFF` / Midnight Aubergine `#1B182A` | **15.08:1** | Strong main text |
| Misty Mauve `#C8BDD9` / Velvet Plum `#241F37` | **8.85:1** | Secondary text |
| Midnight Aubergine `#1B182A` / Moonlit Lilac `#D8C7FF` | **11.18:1** | Main button |
| Lavender Bloom `#B79CFF` / Velvet Plum `#241F37` | **6.95:1** | Accent text when appropriate |
| Slate Lavender `#8276A1` / Velvet Plum `#241F37` | **3.81:1** | Visible essential UI stroke |
| Firefly Gold `#F6DFA5` / Velvet Plum `#241F37` | **12.08:1** | Focus and lit glyphs |
| Plum Jam `#6F548F` / Midnight Aubergine `#1B182A` | **2.76:1** | Too low as the sole essential control boundary |

For the implemented interface, check alpha blending, transitions, hover, disabled/selected states and overlapping backgrounds independently.

## 3. Environmental progression

The scene uses a **continuous** solar elevation value rather than four abrupt clock-based switches. The named stages below are useful **art direction** labels.

| Stage | Approximate solar elevation | Scene treatment |
| --- | --- | --- |
| Full night | Below -18° | Stars visible when weather permits; deep aubergine sky; strongest warm window contrast |
| Astronomical/nautical twilight | -18° to -6° | Slow slate-blue → lilac gradient; silhouettes become visible |
| Civil twilight | -6° to about -0.83° | Rose-lavender horizon; brighter path edges; porch lamps still on |
| Low sun / golden light | About -0.83° to +6° | Warm peach highlights and long shadows; sunrise/sunset distinguished by solar hour angle |
| Day | Above +6° | Existing Pastel Twilight Craft palette, sunlit flowers, less lamp emphasis |

The boundaries are guidance, **not discrete theme toggles**. -6°, -12° and -18° are standard twilight classifications; apparent sunrise/sunset is often approximated at solar elevation ~-0.83°. Realistic sky brightness also depends on clouds, terrain and atmosphere.

### Stable scene variables

- **Sky gradient** varies smoothly with sun elevation and time-of-day direction.
- **Sun/moon positions** use astronomical or stylized motion, never a random static moon every night. Accurate lunar phase/rise/set is a separate feature.
- **Illumination**: soft global ambient + warm lantern/window emission + subtle Lumenette self-glow.
- **Props**: paths, foliage and cottage walls stay recognizable after dark; shadows lengthen in morning/evening, soften at night.
- **Weather**: optional overcast/rain modulates light but does not redefine the base time-of-day state.
- **Stars** appear gradually as twilight deepens and sky clears. Avoid intense bloom or strobing.

## 4. Timekeeping proposal — privacy-preserving by default

For an initial prototype, use a **fictional valley** at approximately **45°N latitude**, with an Earth-like 24-hour solar day and annual solar declination. Treat **12:00** as approximate local solar noon in the fictional world. Compute sun elevation from latitude, declination and hour angle. This creates plausible seasonally changing day lengths without collecting geolocation.

- **World clock (default):** map the user's device local wall-clock time and date to the fictional valley's solar time. Respect device time-zone and daylight-saving changes; do not imply the computed sunrise is the user's actual local sunrise.
- **World clock (optional):** a player-selected game-time offset / preview scrubber, useful for night-shift schedules or visual accessibility. This should not change economy or reward entitlements.
- **Real-location solar times (later, opt-in only):** ask for location permission or manual approximate coordinates. Use a validated solar-position routine, current timezone and date. No hidden GPS collection or server upload.
- **Mode choice:** allow light/dark/automatic interface appearance, independently of world lighting. Auto can follow the scene, but manual override always wins.
- **Fallback:** if device clock/date cannot be trusted, keep a stable saved preference and explain that lighting is approximate.

An illustrative approximation (not an ephemeris): at fictional 45°N, an Earth-like summer solstice provides ~15.4 hours of daylight and winter solstice ~8.6 hours, ignoring refraction and terrain. Real solar rise/set needs longitude, timezone correction, equation of time, altitude/horizon handling and polar safeguards.

**Important:** Passing time has **no gameplay penalties**. Do not introduce streaks, missed claims, night-only obligations, automatic required check-ins, or time-gated purchases. The existing capped idle economy remains its own tested logic.

## 5. UX, performance and accessibility

- Recompute the lighting state on app start, resume, relevant settings change and at a modest cadence (~once per minute for the clock); do not needlessly rerender all React components every frame.
- For visual transitions, prefer CSS variables or efficient scene-specific SVG/CSS. Keep heavyweight shadows/blur under control on mobile.
- Animated light, clouds and stars honor `prefers-reduced-motion: reduce`. Static time-of-day changes remain allowed, with no flashing or continuous movement required.
- Changing UI appearance should not reset or corrupt local save data. Persist `themePreference` separately from `worldTimeMode`.
- On theme changes, preserve keyboard focus, screen-reader announcements where needed and visible control boundaries; text/UI contrast requirements are not relaxed at night.
- Offer a "preview time of day" slider in the design review build so the original designer can inspect dawn/dusk/night without waiting for real time.
- Night vision: don't put glowing windows or Lumenette bloom directly behind body copy.

## 6. Engineering acceptance tests

1. Contrast and selected/focus states across five tabs and both themes.
2. Time/date transitions across midnight, solstices, equinoxes and DST shifts; no negative or discontinuous sun-elevation output outside the expected smooth daily curve.
3. Summer/winter daylight lengths at fictional latitude; distinguish sunrise from sunset by time direction, not elevation alone.
4. Reduced-motion setting, background-tab resume, device-clock change, manual time preview and persisted user override.
5. Economy tests remain unchanged and passing; no time-of-day reward advantage added.
6. Screenshots/review at dawn, noon, sunset, twilight, and night, on narrow/mobile and desktop viewports.
7. Confirm that the preview artwork is a **speculative illustration**, not a literal UI implementation or exact source of token values.

## 7. Boundaries and handoff

**Now:** treat the palette choices as approved; the actual time-of-day simulation and rendered scenes need a separate prototype acceptance.  
**Next:** implement a minimal theme-token layer and a deterministic pure solar-elevation/time-phase utility in a separate branch; wire the existing cottage lighting first.  
**Later:** independently scope weather, lunar phases, cloud cover, real-location astronomy and native device widgets.

**References**
- [NOAA: General Solar Position Calculations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF)
- [US Naval Observatory: Rise, Set and Twilight Definitions](https://aa.usno.navy.mil/faq/RST_defs)
- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/)
