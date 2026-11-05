# Lumenette Hollow — Mini Visual Style Guide v0.1

**Working title:** Pastel Twilight Craft  
**Status:** Daytime palette and visual reference approved (user-reported, 2026-11-05). Canonical specification: [Visual Design System v1.0](DESIGN_SYSTEM_v1.md).  
**Prepared:** 2026-11-05  
**Scope:** Brand and UI direction for the web prototype and future mobile extensions. **No gameplay or CSS implementation is implied by this document.**

## 1. Creative direction

**One-line brief:** A handmade lavender cottage fantasy where living yarn companions inhabit a gentle, glowing world.

**Feeling:** restful, tactile, whimsical, slightly magical, welcoming. Imagine a storybook cottage at lavender dusk, with warm lamplight and carefully stitched keepsakes.

**Design principles**

1. **Lavender-led, never neon.** Purple is the signature; supporting pastels contribute warmth and environmental variety.
2. **Crafted, not glossy.** Wool, fabric, paper, and painted wood are the material vocabulary.
3. **Gentle, not infantilizing.** Rounded and charming without sacrificing readability or clarity.
4. **Relaxed, not demanding.** No urgent countdowns, aggressive offers, guilt-inducing copy, or flashing rewards.
5. **Clear before cute.** Decoration must never obscure actions, status, navigation, or meaningful content.

The companion [Moonlit Lavender night guide](NIGHT_MODE_v0.1.md) contains the approved night palette and an *unimplemented* proposed solar cycle. Both palettes were approved; [Visual Design System v1.0](DESIGN_SYSTEM_v1.md) is the canonical design specification.

## 2. Palette and color roles

| Token name | Hex | Intended use |
| --- | --- | --- |
| Lavender Bloom | `#B79CFF` | Signature accent, selection highlights, decorative glow |
| Lilac Mist | `#D8C7FF` | Soft panels, selected backgrounds, dusk skies |
| Plum Jam | `#6F548F` | Solid primary actions, interactive outlines, headers on light surfaces |
| Warm Cream | `#F9F1E7` | Cottage interiors, secondary cards, warm surfaces |
| Petal Pink | `#F7D6E8` | Flowers, accessories, delight accents |
| Moss Milk | `#D8E8D8` | Gardens, growing, peaceful progress |
| Powder Blue | `#D7E7F6` | Valleys, moonlight, magical items |
| Apricot Puff | `#F6DFC9` | Warm light, wood, subtle encouragement |
| Moonmilk | `#FCF8FF` | Main application canvas |
| Soft Linen | `#F3ECF7` | Recessed areas and alternating surfaces |
| Mulberry Ink | `#4C3E57` | Ordinary text on pale surfaces |
| Midnight Thread | `#3B2E44` | Text over Lavender Bloom; high-contrast icons and focus |
| Dusty Mauve | `#B8A9BC` | **Decorative** separators only, not essential control boundaries |

**Semantic color rules**

- Canvas = Moonmilk; everyday card = Warm Cream or white-lilac; title/body text = Mulberry Ink.
- Solid primary action = **Plum Jam with white text**, not Lavender Bloom with white text.
- Lavender Bloom with Midnight Thread is an acceptable alternate action/highlight combination.
- Selected state = pastel fill **plus** visible shape/stroke/icon or text label; never hue alone.
- Garden/idle areas lean sage, wander leans blue-lilac, home leans cream-blush, customization leans lavender-pink. Purple remains recognizable across all screens.
- Do not use a pastel fill as text, and do not rely on Dusty Mauve as the sole stroke that makes an interactive control recognizable.

### Verified contrast examples

Ratios below use WCAG relative-luminance calculations for **opaque, solid** swatches. Transparent layers, gradients, screenshots and states must be checked separately.

| Text / foreground | Background | Contrast | Use |
| --- | --- | --- | --- |
| Mulberry Ink `#4C3E57` | Moonmilk `#FCF8FF` | 9.38:1 | Body text — passes AA normal text |
| Mulberry Ink `#4C3E57` | Warm Cream `#F9F1E7` | 8.79:1 | Body text — passes AA normal text |
| Midnight Thread `#3B2E44` | Lavender Bloom `#B79CFF` | 5.55:1 | Text on lavender — passes AA normal text |
| White `#FFFFFF` | Plum Jam `#6F548F` | 6.29:1 | Primary buttons — passes AA normal text |
| White `#FFFFFF` | Lavender Bloom `#B79CFF` | 2.28:1 | **Do not use for normal button text** |
| Mulberry Ink `#4C3E57` | Lavender Bloom `#B79CFF` | 4.32:1 | **Not sufficient for AA normal text** |

## 3. Type and spacing

**Candidate font pairing:** Quicksand for titles; Nunito Sans for UI/body. Use vetted, appropriately licensed webfont files if adopted; until then, use available rounded system fallbacks. Avoid relying on a remote font at runtime.

- Display title: 32–44 px, semibold, used sparingly.
- Screen title: 26–32 px.
- Card heading: 18–22 px.
- Main body/control labels: 16 px; secondary body ideally 14–16 px.
- Very small decorative annotations are allowed, **not** for essential information or actions.
- Body line height approximately 1.5; no long all-caps labels.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48 px. Mobile edges ~16–20 px; desktop edges ~24–48 px.

**Shape vocabulary:** rounded rectangles, knitted circles, soft arches, scalloped edges in decorative places. Suggested radii: inputs 12–14 px, buttons 16–18 px or pills, cards 20–24 px, dialogs 24–28 px.

## 4. Materials, illustration and icons

- Art may suggest **crochet stitches**, **felt**, **weave**, **embroidery**, **painted wood**, **moss**, and **lamp glow**. Prefer economical CSS/SVG with scalable detail.
- Limit texture to gentle, low-opacity layers. Keep text on stable clean surfaces; use soft shadows, not dark embossed UI.
- Lumenettes are identifiable yarn-ball silhouettes with stitched expressive faces, subtle inner glow, and personalized colors/accessories.
- At phone size, shape and face must remain readable without intricate strand rendering. Offer at least one clear visual cue beyond color for accessory/selection states.
- Icons: simple, rounded, moderately weighty, consistent stroke style. Label unfamiliar icons in the five-tab navigation. Decorative stars and stitch marks must not substitute for instructions.
- Magic uses diffuse lilac, pale gold or blue glow; never vivid strobe, cyberpunk neon, or reward explosions.

## 5. Components and states

| Component | Default | Interaction/state |
| --- | --- | --- |
| Primary button | Plum solid; white readable text; pill or 16px radius | Gentle darkening/press; visible keyboard focus; disabled still clearly explained |
| Secondary button | Cream/lilac pale surface; Mulberry Ink label; sufficiently strong outline | Hover/focus distinguishable without color alone |
| Cards | 20–24px radius, soft diffuse shadow, optional stitch trim | Actions and content clearly separated |
| Bottom navigation | Five icon + text labels; soft background | Selected tab uses filled pill plus icon/label distinction |
| Customization swatches | Circular yarn preview, generous hit region | Selected via checkmark and visible high-contrast ring, not merely colored outline |
| Progress meter | Soft skein/ribbon motif with accessible track | Numeric or textual value alongside visual fill |
| Dialog | Calm paper/fabric panel; clear title and dismiss control | Focus handling, escape behavior, non-destructive defaults |

**Mobile-first defaults:** interactive target **at least 44 × 44 CSS px as a project preference** (WCAG 2.2 AA minimum is generally 24 × 24 with documented exceptions); sufficient gaps between targets. Avoid hiding an important action behind hover.

## 6. Motion and game feedback

- Microinteractions: roughly 140–240 ms, ease-out, minimal travel.
- Pip may gently breathe or bob over ~3–5 seconds; this is atmospheric, not a signal to tap.
- Rewards appear as a small puff of thread or a gentle rise/fade; do not interrupt control.
- Honor `prefers-reduced-motion: reduce` by stopping continuous animation and replacing transitions with immediate feedback.
- Never convey rarity, success, or error **only** through color, sound, or animation.

**Microcopy samples**
- Prefer: “Pip gathered some yarn while you were away.”
- Prefer: “Your garden will be here whenever you return.”
- Avoid: “You missed your collection window!”
- Avoid: “Hurry! Limited-time deal expires in 30 seconds!”

## 7. Accessibility and quality gates

Target **WCAG 2.2 Level AA** for the interface. The basic requirements used in this proposal are 4.5:1 contrast for normal text, 3:1 for qualifying large text and essential UI graphics, a visible keyboard focus state, non-color-only status and sufficient pointer target sizes. See [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Design review checklist:

- [x] Original designer approves the daylight visual reference (user-reported; precise tokens, typography and implementation still require review).
- [ ] Home, Wander, Idle, Yarn, and Shop share a coherent purple identity without uniform monochrome.
- [ ] Core text and controls pass checked contrast **in actual rendered states**.
- [ ] At 320px viewport and at 200% zoom, essential actions remain visible and usable.
- [ ] Keyboard access, labeled controls and visible focus work through all five tabs.
- [ ] Reduced motion preserves understanding, without automatic looping effects.
- [ ] No dark-pattern urgency or paid advantage is introduced by the visual redesign.
- [ ] The original stage-one gameplay mechanics and local saves continue to work after theme implementation.

## 8. Proposed implementation sequence

1. **Approve this guide** (or annotate revisions) before changing gameplay screens.
2. Map semantic design tokens into `src/styles.css` without changing economy logic.
3. Reskin **Home** and **Pip** first as a representative vertical slice; evaluate on phone and desktop.
4. Apply patterns to the other four screens; run contrast, keyboard, reduced-motion, and regression checks.
5. Only then evaluate new art, native widget treatments, or seasonal palette extensions.

**This guide is not evidence that styling, QA, or the complete product vision is implemented.** Use the [implementation acceptance checklist](IMPLEMENTATION_ACCEPTANCE.md).

**Source context:** `README.md`, `docs/PROTOTYPE.md`, and `src/styles.css` at HollowLumen main `4e2ade8a019f45bc39a6ea0d17b949eb4ced97b9`; user reported that the first gameplay version worked as expected and provisionally signed off stage one on 2026-11-05.
