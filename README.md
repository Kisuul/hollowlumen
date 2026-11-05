# Lumenette Hollow

A cozy rural fantasy life sim where you raise living yarn creatures, decorate your cottage, and take short valley adventures — designed for real life with limited time.

**Status:** Playable prototype  
**Platforms:** Mobile + PC (web)  
**Modes:** Solo, with optional co-op / friend visits

**Proposed next milestone:** [A → B roadmap: The First Thread](docs/plan/FIRST_THREAD_A_TO_B_ROADMAP.md). This is a reviewable gameplay-evolution plan, **not** an approved replacement for the current playable prototype or evidence that the proposed RPG systems are implemented.

---

## The idea

You live in a quiet valley of soft hills and mossy burrows. Your companions are **Lumenettes** — round, glowing balls of living yarn with expressive, yarn-formed faces. You crochet, decorate, explore a little, and let your Lumenettes gently work while you’re away.

Tone: warm, slightly magical rural fantasy. Think Shire cottage + living yarn + light curiosity, without the stress.

---

## Features

### Home
- Decorate your cottage, garden, and burrow
- Place furniture, yarn decorations, and animal beds
- Friends can visit (async or live), leave reactions, small gifts, or hang out
- Photo mode for showing off your space

### Adventure
- Optional short **1–3 minute** challenges and a light story campaign
- Explore the valley, help creatures, gather rare yarns and materials
- Rewards feed back into home decoration and Lumenette customization
- Mostly curious and gentle rather than stressful

### Idle
- While you’re away, Lumenettes gather materials, grow the garden, and knit simple items
- Level up idle efficiency (speed, yield, rare chance)
- Upgrades and boosted claims are limited (about once every couple of hours) so it never becomes a chore
- Cap on offline progress so catching up stays light

### Companion & widget
- Fully customizable Lumenette (yarn colors, patterns, face styles, crocheted accessories)
- Active companion follows you in both modes
- Home-screen **battery widget** with your chosen Lumenette
- High battery gives a small in-game bonus (crafting, mood, resources)

### Shop (optional)
- Yarn color / pattern packs
- Furniture & decoration sets
- Lumenette accessories
- Seasonal / VIP packs with exclusive styles + mild quality-of-life
- No paywalls on core progress or power

---

## Prototype (current build)

The web prototype includes:

| Area | What’s in |
|------|-----------|
| **Home** | Place rugs, lamps, plants, and other pieces; open the gate for neighbor visits |
| **Wander** | Three short trips: tap drifting skeins, step around brambles, mend a scarf pattern |
| **Idle** | Yarn gathers offline; one upgrade at a time, then a short rest |
| **Yarn** | Rename Pip; change skeins, face stitches, scarf / bow / flower |
| **Shop** | Skein packs and a Hollow Patron pack (faster idle, stitch crown, moonthread) |
| **Widget** | Charge display; above ~70%, wanders and idle pay a bit more |

Progress is stored on the device for the prototype. Real multiplayer visits are still simulated.

---

## Core loop

1. Decorate and tend the cottage in short sessions  
2. Claim idle yarn when you open the game  
3. Optionally run a 1–3 minute wander for materials and tokens  
4. Unlock new furniture, skeins, and looks  
5. Show off your hollow and custom Lumenette  

Everything is built around **1–5 minute play windows**, with longer sessions available when you have them.

---

## Tech notes

- **Stack:** React, TanStack Start / Router, Tailwind CSS, Zustand (local persistence)
- **Art:** CSS / SVG Lumenettes and furniture (yarn-ball companions with stitch-style faces)
- **Save:** Local device storage in the prototype
- **Target:** Mobile-friendly layout + PC; touch and short sessions first

> Upgrade cooldowns in the prototype are shortened (e.g. a couple of minutes) as a stand-in for the live “couple of hours” cadence.

---

## Getting started

```bash
# Install
npm install

# Dev server
npm run dev

# Production build
npm run build
```

Open the local preview and start from **Pip’s cottage**. Use the bottom nav:

- **Home** — decorate and open the gate  
- **Wander** — short challenges  
- **Idle** — claim and upgrade gathering  
- **Yarn** — customize your Lumenette  
- **Shop** — optional packs  

---

## Design principles

- **Mostly cozy, light adventure** — stress is optional and brief  
- **Baby-friendly sessions** — meaningful progress in a minute or two  
- **Craft-first identity** — yarn, crochet, and soft rural fantasy  
- **Fair monetization** — cosmetics and mild convenience, never gated power  
- **Companion presence** — your Lumenette is always there, including on the battery widget  

---

## Roadmap (from the full pitch)

- [x] Home decoration + short adventures  
- [x] Customizable Lumenette  
- [x] Idle gathering + timed upgrades  
- [x] Battery widget bonus  
- [x] Optional cosmetic / VIP packs  
- [ ] Real async friend visits & sharing  
- [ ] Deeper story campaign  
- [ ] Seasonal events and collection log  
- [ ] Mobile home-screen widget (native)  
- [ ] Co-op living room activities  

---

## License

TBD — prototype only. Lumenettes are an original creature concept (yarn-ball companions); no third-party character IP.

---

## Credits

Designed as a cozy life-sim concept for short, warm play sessions. Prototype built for exploration of the full loop: home, wander, idle, companion, and shop.
