# HollowLumen playable foundation — v0.1.0

This document describes **implemented code on the feature branch**, not the larger concept in the root README. The README remains the original product pitch.

## Run locally

Requires Node.js 20.19+ (22+ recommended) and npm. From the repository root:

```sh
npm install
npm run dev
npm test
npm run build
```

Visit the URL printed by Vite. No accounts, backend, payment integration, API keys, or external art service are required at runtime.

## Included in v0.1.0

- A responsive, five-tab web interface with original vector/CSS art.
- A customizable Lumenette: name, five yarn colors (four unlockable), three facial expressions, and four accessory states.
- A cottage visualization with purchasable decorations and a simulated garden gate.
- Three five-step **prototype** wanders with yarn rewards and no failure penalties. These are currently shorter than the intended 1–3 minute adventures.
- Idle yarn economy: two yarn per minute per level, a four-hour offline cap, a five-level upgrade path, and a two-minute *prototype* cooldown.
- Local-only shop purchases using earned yarn. No payment or purchase tracking exists.
- A **manual battery charge slider** that demonstrates the planned bonus above 70%. A browser cannot install a native home-screen widget.
- Versioned, bounded local-storage save data. It remains on the user's own browser/device.
- Node's built-in test runner for deterministic rules and abuse-resistant save restoration.

## Not yet implemented

- Real multiplayer, asynchronous visits, sharing, networking, and gift exchanges.
- A server-authoritative economy or cloud saves.
- Native Android/iOS battery widgets or device battery reading.
- Real-money transactions, paid packs, billing, or VIP membership.
- Detailed cottage furniture positioning, a full campaign, season passes, and live events.
- Production assets, accessibility audit, browser automation, deployment and security review.

## Architecture notes

- `src/state/game.js`: pure game model. Keep all currency, timing, ownership and reward rules here so they can be unit-tested independently of React.
- `src/state/useGame.js`: Zustand persistence and lightweight UI actions.
- `src/components/Lumenette.jsx`: original, self-contained SVG companion art.
- `src/App.jsx`: prototype screen components.
- `src/main.jsx`: code-based TanStack Router definitions.
- `src/styles.css`: original layout and scene illustration; Tailwind v4 imported for future utility-based styling.

The prototype is client-side only. Local storage can be edited by users; do **not** connect this economy to paid purchases or competitive multiplayer without moving authoritative validation to a server.

## Verification limits

`npm test` requires no third-party dependencies and runs the domain-model tests. In the authoring environment, package registry access was unavailable, so dependency installation, the production Vite build and a rendered browser check were **not executed**. They must be run in a network-enabled checkout before approval. A generated lockfile should be committed after a verified install.

## Next milestone

Validate a real browser build, improve the garden placement interaction, tune reward pacing with the original designer, implement saved settings and accessibility checks, and only then evaluate hosting or backend infrastructure.
