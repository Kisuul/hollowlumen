# HollowLumen — Visual Design System v1.0

**Status:** Design-language baseline complete for review; **day and night palette choices approved by the original designer**, as reported by the user on 2026-11-05. This is not a sign-off on rendered UI, font procurement, simulation accuracy or a release.

**Creative identity:** **Pastel Twilight Craft** by day, **Moonlit Lavender** by night. One handmade rural-fantasy world of living yarn companions, soft lavender, welcoming cottages and gentle magic.

**Authority:** This is the canonical design-language specification. [Day mood/style notes](STYLE_GUIDE_v0.1.md) and [night/astronomy exploration](NIGHT_MODE_v0.1.md) preserve supporting rationale. [Design token data](tokens/visual.tokens.json) is the authoritative list of exact color values and semantic roles. [Implementation acceptance gates](IMPLEMENTATION_ACCEPTANCE.md) govern the next development stage.

## 1. Principles that must not change

1. **Crafted, not glossy:** felt, wool, embroidery, painted wood, paper and moss. Never cyberpunk neon, plastic sheen or cluttered texture.
2. **Purple is identity, not wallpaper:** lavender is unmistakable even when pink, sage, blue and warm cream carry the supporting narrative.
3. **Cozy, not infantilizing:** soft silhouettes and gentle faces; avoid tiny critical labels, excessive glitter, or novelty at the expense of legibility.
4. **Unhurried by design:** no streak guilt, urgent timers or artificial purchasing pressure; no night-only rewards that punish players for sleeping.
5. **Readable everywhere:** important UI uses semantic contrast-tested colors, stable surfaces and non-color-only state cues.
6. **Same world, different light:** day/dusk/night change environment lighting, not game balance or companion identity.

## 2. The two approved palettes

### Day: Pastel Twilight Craft

| Role / swatch | Hex |
| --- | --- |
| Lavender Bloom | `#B79CFF` |
| Lilac Mist | `#D8C7FF` |
| Plum Jam | `#6F548F` |
| Warm Cream | `#F9F1E7` |
| Petal Pink | `#F7D6E8` |
| Moss Milk | `#D8E8D8` |
| Powder Blue | `#D7E7F6` |
| Apricot Puff | `#F6DFC9` |
| Moonmilk canvas | `#FCF8FF` |
| Mulberry Ink | `#4C3E57` |

### Night: Moonlit Lavender

| Role / swatch | Hex |
| --- | --- |
| Midnight Aubergine | `#1B182A` |
| Velvet Plum | `#241F37` |
| Dusk Heather | `#30273F` |
| Night Moonmilk | `#F3ECFF` |
| Moonlit Lilac | `#D8C7FF` |
| Lavender Bloom | `#B79CFF` |
| Misty Mauve | `#C8BDD9` |
| Twilight Rose | `#E9B6D7` |
| Firefly Gold | `#F6DFA5` |
| Moonwater Blue | `#A9C7E8` |
| Moon Sage | `#B8D5BE` |
| Slate Lavender | `#8276A1` |

All swatch choices above are based on the approved palette direction. UI states, scene gradients, glow intensity and actual assets remain subject to visual acceptance.

### Semantic token contract

The [DTCG 2025.10 JSON file](tokens/visual.tokens.json) contains primitives `palette.day.*` and `palette.night.*`, plus **mirrored** role aliases `theme.day.*` and `theme.night.*`. Rendering code will eventually bind **roles** rather than hex strings.

| Role | Day | Night |
| --- | --- | --- |
| `canvas` | Moonmilk | Midnight Aubergine |
| `surface` | Warm Cream | Velvet Plum |
| `surface-raised` | Soft Linen | Dusk Heather |
| `text-primary` | Mulberry Ink | Night Moonmilk |
| `text-secondary` | Plum Jam | Misty Mauve |
| `action-bg` / `action-fg` | Plum Jam / white | Moonlit Lilac / Midnight Aubergine |
| `secondary-bg` / `secondary-fg` | Lilac Mist / Midnight Thread | Dusk Heather / Night Moonmilk |
| `focus` | Midnight Thread | Firefly Gold |
| `outline` | Plum Jam | Slate Lavender |
| `accent` | Lavender Bloom | Lavender Bloom |

Do not place white normal-sized text on Lavender Bloom (**2.28:1**). Midnight Thread text on lavender passes normal-size contrast (**5.55:1**); white on Plum Jam passes (**6.29:1**). Night Moonmilk on Midnight Aubergine is **15.08:1**. Solid-swatch calculations cannot establish rendered contrast on semi-transparent surfaces or gradients.

## 3. Typography, spacing and shape

- **Candidate heading font:** Quicksand (rounded, gentle). **Candidate body font:** Nunito Sans. They are *not yet licensed, bundled, or approved as actual font files*; use readable system fallbacks until resolved.
- Titles 26–32px, cards 18–22px; primary text ideally 16px, secondary 14–16px. Avoid 10px essential content, especially on phones.
- Spacing scale 4 / 8 / 12 / 16 / 24 / 32 / 48px. Mobile side gutters 16–20px; let layouts breathe.
- Corners: inputs about 12px; actions 16px or pills; cards about 22px; dialogs about 26px.
- Typical icon style: rounded, simple, medium-weight, consistent stroke and legible at 20–24px. Five primary tabs use **icon + label**.
- Decorative yarn-weave, stitched borders and diffuse shadows belong **behind** legible content, never overlaid on reading surfaces.

## 4. Component-state grammar

| Component | Appearance | Behavior / acceptance |
| --- | --- | --- |
| Primary button | Themed solid fill and strongly contrasted text | Hover, active, focus-visible, disabled and loading states; visible without color discrimination |
| Secondary button | Raised surface with clear outline | Not confused with an inert text label; works with keyboard and touch |
| Navigation | Five stable icon+text destinations | Selected pill plus clear text/icon state; same destinations and keyboard order in both themes |
| Resource pill | Yarn icon and numeric total | Accessible quantity, no visual-only change or noisy reward burst |
| Cottage scene | Rounded environmental illustration with Pip | Lighting changes without altering interaction geometry or hiding the companion |
| Swatch picker | Wool-color circles, selected check and thick ring | Focusable, labeled and operable with keyboard; preferred 44x44px targets |
| Progress | Yarn/ribbon meter with amount displayed | Not conveyed solely by color/fill; accessible name/value |
| Dialog | Fabric/paper-like calm container | Clear heading, escape close and focus management |
| System status | Text + gentle iconography | No guilt/shaming, explicit result and next step |

Audit *default, hover, pressed, focused, selected, loading, disabled, empty and error* for both appearances. A dimmed button is not exempt from explaining why it is unavailable.

## 5. Screen-specific art direction

- **Home:** cream/pink/lilac cottage by day; warm window glow against cool moonlight at night. House, path and Pip remain recognizable.
- **Wander:** powder-blue valleys and lavender skies; interactive objects must stand out against both bright and dark environments.
- **Idle:** sage/soft wool, patient growth metaphors; never imply night demands a claim.
- **Yarn:** Pip's stitches, face and chosen accessories are identifiable at small sizes regardless of ambient lighting.
- **Shop:** lilac, plum and occasional warm-gold thread; visual premium is fine, manipulative scarcity and fabricated payments are not.

## 6. Motion, lighting, audio and voice

- UI transitions approximately 140–240ms ease-out; low-travel scale/opacity changes.
- Pip may gently breathe or bob (~3–5s). In the night scene, a **subtle warm inner glow** may become more apparent, not a blinding bloom.
- Allow optional quiet cloth/yarn rustles, soft chimes and evening insects in a future audio pass; sound is never the sole indicator of an outcome, nor does it play loudly without user control.
- Honor reduced motion: continuous animation stops; important changes stay intelligible through text and static imagery.
- Copy should be gentle: “Pip gathered yarn while you were away.” Avoid guilt or manufactured urgency.
- Do not place critical copy directly over fireflies, moon glow or animated illumination.

## 7. Time-of-day is separate from theme

**Environment light** and **interface theme** are independent systems. The world can be night while the UI remains light. Never apply an opacity or hue filter to the whole application.

**Suggested interface preference:** `follow-world` (initial default), `light`, `dark`; `system` optional. Explicit override wins. A stable threshold/hysteresis prevents flip-flopping near dawn and dusk.

**Suggested world preference:** `follow-device-time` (approximate fictional solar time), `always-day`, `always-night`. A temporary 0–24h preview scrubber must not affect game rewards, cooldowns, or economy timestamps.

**Solar model for prototype, not a geographic claim:** fictional 45°N valley, Earth's ~24h solar day and seasonal axial tilt, device calendar and local civil clock mapped to *approximate* local solar hours (noon near 12). This approximates changing daylight length; it does **not** compute the player's actual sunrise or sunset. Do not request location by default. A real-location mode would be separate opt-in work requiring accurate astronomical calculations and time-zone treatment.

**Environmental phases:** night below -18° solar elevation; astronomical twilight -18°…-12°; nautical -12°…-6°; civil -6°…~-0.83°; warm low sun ~-0.83°…+6°; daytime above +6°. **Blend continuously**, distinguish dawn from dusk by whether the sun is ascending or descending. Moon phases and position are not realistic unless a lunar model is actually implemented; no invented “realistic full moon every night.”

At dawn/sunset, windows and lanterns fade between cool global sky light and warm emission; the cottage remains visibly safe and navigable. The *scene* may be cinematic, but actual UI must remain legible.

## 8. Accessibility, privacy and quality gates

- Target WCAG 2.2 AA: 4.5:1 normal text; 3:1 qualifying large text and key non-text boundaries, plus visible focus.
- Prefer 44x44px touch targets as a project design goal; WCAG 2.2 AA minimum is generally 24x24px with exceptions.
- Verify in actual browser at 320px width, 200% zoom, on phones and desktop; ensure focus order, semantic labels and reduced-motion.
- Persist UI appearance **separately** from world-time preference; neither overrides the economy clock or resets stage-one saves.
- Avoid unnecessary geolocation, night-time notifications or analytics about users' sleep patterns.

## 9. Completion boundary

**Design-language deliverables:** approved day/night palettes, consistent semantic tokens, component and typography rules, motion/audio/voice constraints, scene/clock separation, and a testable implementation checklist. These are complete as a **design handoff**.

**Not complete:** CSS implementation, original designer's acceptance of rendered Home/Pip, astronomical code, browser build/regression, font packaging, or release readiness.

Run `node tools/validate-design-tokens.mjs` for token-format and contrast checks. Then use [IMPLEMENTATION_ACCEPTANCE.md](IMPLEMENTATION_ACCEPTANCE.md) for the next build's acceptance gate. Neither test substitutes for a real UI audit.

**References:** [Stable DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/), [USNO twilight definitions](https://aa.usno.navy.mil/faq/RST_defs), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
