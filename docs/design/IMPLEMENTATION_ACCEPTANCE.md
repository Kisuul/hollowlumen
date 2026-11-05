# Design implementation — acceptance criteria

**Design contract:** [Visual Design System v1.0](DESIGN_SYSTEM_v1.md)  
**Token data:** [visual.tokens.json](tokens/visual.tokens.json)  
**Baseline:** Day and night palette choices approved, user-reported (2026-11-05). **Design docs only; no runtime changes.**

## Design-phase sign-off ledger

| Area | Evidence | Status |
| --- | --- | --- |
| Stage-one game loop | User tested and reported it works as expected | Provisional functional sign-off |
| Day palette and visual mood | Designer approved earlier reference image, user-reported | Approved palette direction |
| Night palette | Designer approved proposed palette choices, user-reported | Approved palette direction |
| Theme/font/component renderings | Not yet seen in application | Open |
| Solar/day-night implementation | Not yet coded or demonstrated | Open |
| Release/build/a11y | No new verified checks in this design PR | Open |

Do not conflate **designer-selected palette** with approval of all future UI screens or exact local sunrise accuracy.

## Next stage: bounded implementation plan

1. **Theme-token integration:** Map canonical DTCG role aliases to CSS variables; preserve v0.1.0 economy and local-save semantics. No payment or backend.
2. **Settings and preference precedence:** Implement follow-world / light / dark, and separate always-day / always-night scene overrides; settings migration tested.
3. **Pure astronomical approximation:** Earth-like declination and solar hour angle for fictional 45°N valley. Unit tests for sunrise/sunset order and approximate seasonal daylight.
4. **Home + Pip proof of concept:** Scene sky gradient, warm/cool lighting, Pip glow, a temporary time preview; responsive review at phone and desktop.
5. **Scale to Wander, Idle, Yarn, Shop:** Apply shared design components, consistent contrast and focus behavior, and scene rules.
6. **Adversarial QA:** Regression, browser accessibility and visual review before merging implementation.

## Required verification matrix

| Feature | Acceptance requirement |
| --- | --- |
| Token integrity | JSON parse, DTCG color values and aliases resolve, tested pairs meet minimum contrast. Run `node tools/validate-design-tokens.mjs`. |
| UI appearance | Every normal-text pair ≥4.5:1; essential icons/boundaries ≥3:1 in actual screenshots including alpha layers. |
| Interaction states | Light/dark selected, focus-visible, hover, pressed, disabled, loading and error clearly distinct; not color-only. |
| Responsive | 320px mobile, desktop, 200% zoom, touch targets and no horizontal overflow or lost tab actions. |
| Astronomy | Tests at spring/autumn equinox, both solstices, leap date, midnight, DST changes and returning from a suspended browser tab. |
| Approximation honesty | Fictional solar model clearly not represented as user's real local sunrise. Real geolocation remains opt-in and deferred. |
| Override independence | Dark UI can coexist with daylight scene, light UI with night scene, without changing earned yarn or cooldowns. |
| Motion/a11y | Reduced-motion removes automatic animation but does not suppress information; keyboard + assistive labels preserved. |
| Visual review | Designer sees Home/Pip at dawn, noon, golden hour, dusk, deep night in both UI appearances. |
| Persistence | Old game saves restored without loss; setting migration and manual clock preview do not alter economy time source. |
| Performance | Smooth phone navigation; lighting updates efficiently and no costly continuous React-wide rerender. |
| Scope | No unapproved monetization, multiplayer, weather, moon ephemeris or native widget work. |

## Completion and authority

Design language can be treated as **specification-complete** with accepted color values and this handoff. Stage two is **not** approved or verified merely because docs are committed; new implementation requires ordinary engineering review and acceptance.

Keep implementation in separate feature PRs; do not silently merge into main. Do not confuse previous permission to draft design documentation with permission for deployment or commercial release.
