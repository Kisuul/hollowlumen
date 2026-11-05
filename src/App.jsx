import { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { Lumenette } from './components/Lumenette.jsx';
import { useAppearance } from './theme/AppearanceProvider.jsx';
import { sceneLabel, displayHour } from './theme/presentation.js';
import {
  batteryMultiplier, COLORS, DECOR, idleEarnings, MAX_LEVEL,
  OFFLINE_CAP_MS, perMinute, ROUTES, upgradeCost,
} from './state/game.js';
import { useGame } from './state/useGame.js';

const NAV = [
  { path: '/', icon: '⌂', name: 'Home' },
  { path: '/wander', icon: '✦', name: 'Wander' },
  { path: '/idle', icon: '◷', name: 'Idle' },
  { path: '/yarn', icon: '❀', name: 'Yarn' },
  { path: '/shop', icon: '♧', name: 'Shop' },
];

function useClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

function Heading({ kicker, title, description }) {
  return <header className="page-heading"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{description}</p></header>;
}

function Resource({ compact = false }) {
  const yarn = useGame((state) => state.yarn);
  return <span className={`resource ${compact ? 'resource-small' : ''}`} aria-label={`${yarn} yarn`}><span aria-hidden="true">🧶</span> {yarn.toLocaleString()} <span className="resource-label">yarn</span></span>;
}


function AppearanceControls() {
  const { appearance, updateAppearance, scene } = useAppearance();
  return (
    <section className="appearance-toolbar" aria-label="Valley appearance settings">
      <span className="appearance-heading" aria-hidden="true">✧ &nbsp; Make the hollow yours</span>
      <label className="appearance-field">
        <span>Interface</span>
        <select aria-label="Interface appearance" value={appearance.uiMode} onChange={(event) => updateAppearance({ uiMode: event.target.value })}>
          <option value="follow-world">Follow world</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label className="appearance-field">
        <span>Valley light</span>
        <select aria-label="Valley lighting" value={appearance.sceneMode} onChange={(event) => updateAppearance({ sceneMode: event.target.value })}>
          <option value="follow-device-time">Follow clock</option>
          <option value="always-day">Always day</option>
          <option value="always-night">Always night</option>
        </select>
      </label>
      <span className="appearance-phase" role="status">{sceneLabel(scene)}</span>
    </section>
  );
}

function TimePreview() {
  const { clock, previewHour, setPreviewHour, appearance, previewActive } = useAppearance();
  const liveHour = clock.getHours() + clock.getMinutes() / 60;
  const selectedHour = previewHour ?? liveHour;
  const isEnabled = appearance.sceneMode === 'follow-device-time';
  return (
    <div className="time-preview">
      <div className="time-preview-copy">
        <div>
          <strong>Explore the hours</strong>
          <span>See the cottage change from sunrise to starlight.</span>
        </div>
        <output htmlFor="valley-time-preview" aria-live="off">{previewActive ? displayHour(previewHour) : 'Live clock'}</output>
      </div>
      <input id="valley-time-preview" type="range" min="0" max="23.75" step=".25"
        value={selectedHour} disabled={!isEnabled} aria-label="Preview valley time of day"
        onChange={(event) => setPreviewHour(Number(event.target.value))} />
      <div className="time-preview-footer">
        <span>☼ Dawn</span><span>☀ Noon</span><span>☾ Night</span>
        <button type="button" className="button secondary preview-reset"
          onClick={() => setPreviewHour(null)} disabled={!previewActive}>Return to live</button>
      </div>
      <p className="time-disclaimer">Fictional valley lighting · approximate seasons · no effect on yarn or cooldowns.</p>
      {!isEnabled && <p className="time-disclaimer">Choose “Follow clock” above to explore the day.</p>}
    </div>
  );
}

export function Shell() {
  const name = useGame((state) => state.name);
  const { scene } = useAppearance();
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link to="/" className="brand" aria-label="Lumenette Hollow home">
          <span className="brand-mark">✿</span>
          <span><strong>Lumenette</strong><small>HOLLOW</small></span>
        </Link>
        <div className="sidebar-intro"><span className="tiny-sun">{scene.isDark ? "☾" : "☀"}</span><p>A little world to come home to.</p></div>
        <nav className="nav" aria-label="Main navigation">
          {NAV.map((item) => <Link key={item.path} to={item.path} activeOptions={{ exact: true }} className="nav-link" activeProps={{ className: 'nav-link current' }}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.name}</span>
          </Link>)}
        </nav>
        <div className="sidebar-foot"><span>✧</span><p>Small moments. Soft magic.</p><small>Prototype v0.1 · saved on this device</small></div>
      </aside>
      <div className="main-column">
        <div className="topbar"><div className="topbar-greeting">{scene.isDark ? "☾" : "☼"} &nbsp; Welcome back, friend <span>·</span> {name} is happy you're here.</div><Resource /></div>
        <AppearanceControls />
        <main id="main-content" className="main-content"><Outlet /></main>
        <nav className="bottom-nav" aria-label="Mobile navigation">
          {NAV.map((item) => <Link key={item.path} to={item.path} activeOptions={{ exact: true }} className="bottom-link" activeProps={{ className: 'bottom-link current' }}>
            <span aria-hidden="true">{item.icon}</span><small>{item.name}</small>
          </Link>)}
        </nav>
      </div>
    </div>
  );
}

function BatteryWidget() {
  const battery = useGame((state) => state.battery);
  const setBattery = useGame((state) => state.setBattery);
  const high = battery > 70;
  return <div className="battery-card">
    <div className="mini-heading"><span>⌁ &nbsp; Companion widget</span><span className="demo-pill">WEB DEMO</span></div>
    <div className="battery-row"><div className="battery-shell" aria-hidden="true"><div style={{ width: `${battery}%` }} className="battery-fill" /></div><strong>{battery}%</strong></div>
    <label htmlFor="battery-control" className="muted tiny">Simulated phone charge</label>
    <input id="battery-control" className="battery-slider" type="range" min="0" max="100" value={battery} onChange={(event) => setBattery(event.target.value)} />
    <p className="battery-note">{high ? '✦ Over 70%: +10% on yarn rewards.' : 'Charge above 70% to activate a gentle yarn bonus.'}</p>
  </div>;
}

export function Home() {
  const game = useGame();
  const { scene } = useAppearance();
  const sceneVars = {
    '--scene-daylight': `${Math.round(scene.ambient * 100)}%`,
    '--scene-starlight': scene.stars,
    '--scene-lanterns': scene.lanterns,
  };
  const visitor = game.gateOpen ? 'The garden gate is open for imagined neighbors.' : 'A quiet morning in your own little hollow.';
  return <div className="content-wrap">
    <Heading kicker="CHAPTER ONE · THE HOLLOW" title={<>A softer kind of <em>adventure.</em></>} description="Make yourself at home. The valley is in no hurry, and neither are you." />
    <section className="home-grid" aria-label="Your cottage">
      <div className="scene-card">
        <div className="scene-top"><span>✿ &nbsp; PIP'S COTTAGE</span><span className="scene-weather">{scene.isDark ? "☾" : "☀"} &nbsp; {sceneLabel(scene)}</span></div>
        <div className="hollow-scene" style={sceneVars} data-scene-phase={scene.phase}>
          <div className="scene-stars" aria-hidden="true" />
          <div className="scene-cloud cloud-one"/><div className="scene-cloud cloud-two"/>
          <span className="scene-sun" aria-hidden="true">✺</span>
          <div className="far-hill"/><div className="near-hill"/>
          <div className="cottage" aria-hidden="true"><div className="chimney"/><div className="roof"/><div className="house"><span className="house-window">✧</span><span className="house-door"/></div></div>
          <div className="scene-flowers" aria-hidden="true">✿ &nbsp; ❀ &nbsp; ✿ &nbsp; ❀</div>
          <div className="scene-path"/>
          <div className="scene-companion"><Lumenette name={game.name} color={game.color} face={game.face} accessory={game.accessory}/></div>
          <div className="scene-decor" aria-label="Cottage decorations">{game.decor.filter((item) => item !== 'rug').map((item) => <span key={item} title={DECOR.find((decor) => decor.id === item)?.label}>{DECOR.find((decor) => decor.id === item)?.emoji}</span>)}</div>
        </div>
        <TimePreview />
        <div className="scene-caption"><div><strong>{game.name}'s little corner</strong><p>{visitor}</p></div><button type="button" className="button secondary" onClick={game.toggleGate}>{game.gateOpen ? 'Close gate' : 'Open gate'} <span aria-hidden="true">↗</span></button></div>
      </div>
      <aside className="side-stack"><div className="friend-card"><span className="eyebrow">YOUR LITTLE FRIEND</span><div className="friend-portrait"><Lumenette name={game.name} color={game.color} face={game.face} accessory={game.accessory}/></div><h2>Meet {game.name} <span>✿</span></h2><p>A tiny heart made of yarn. Very good at keeping you company.</p><Link to="/yarn" className="text-link">Dress up {game.name} ↗</Link></div><BatteryWidget /></aside>
    </section>
    <section className="below-grid" aria-label="Things to do"><div className="activity-card"><span className="activity-icon">🌷</span><div><span className="eyebrow">A LITTLE EXPLORING</span><h3>The valley is calling</h3><p>Find lost skeins, wander flower paths, and help your neighbors.</p><Link to="/wander" className="text-link">Take a wander ↗</Link></div></div><div className="activity-card"><span className="activity-icon">🧺</span><div><span className="eyebrow">WHILE YOU WERE AWAY</span><h3>Yarn keeps growing</h3><p>Even when you're off living your life, the hollow stays busy.</p><Link to="/idle" className="text-link">Check your basket ↗</Link></div></div></section>
  </div>;
}

export function Idle() {
  const game = useGame();
  const now = useClock();
  const earned = idleEarnings(game, now);
  const rest = Math.max(0, Math.ceil((game.nextUpgradeMs - now) / 1000));
  const canUpgrade = game.level < MAX_LEVEL && rest === 0 && game.yarn + earned.amount >= upgradeCost(game.level);
  const [message, setMessage] = useState('');
  function collect() { const amount = game.claim(); setMessage(amount > 0 ? `You tucked ${amount} yarn into your basket!` : 'The yarn needs a little more time.'); }
  function upgrade() { game.upgrade(); setMessage('Your friends learned to gather a little faster!'); }
  return <div className="content-wrap"><Heading kicker="THE GENTLE RHYTHM" title={<>Let the hollow <em>rest.</em></>} description="Your friends gather yarn while you do other things. No streaks, no pressure, no falling behind." />
    <div className="panel-grid"><section className="panel basket-panel"><div className="basket-art" aria-hidden="true">🧺</div><span className="eyebrow">READY IN YOUR BASKET</span><div className="big-number">{earned.amount} <span>🧶</span></div><p>At level {game.level}, your friends gather {perMinute(game.level)} yarn per minute.</p><div className="progress-track"><div style={{ width: `${Math.min(100, ((now - game.lastClaimMs) / OFFLINE_CAP_MS) * 100)}%` }}/></div><small className="muted">Up to 4 hours of offline gathering are saved.</small><button type="button" className="button primary wide" onClick={collect} disabled={earned.amount === 0}>Claim {earned.amount} yarn</button></section>
    <section className="panel upgrade-panel"><span className="eyebrow">COZY UPGRADES</span><h2>Yarn gatherers <span>✿</span></h2><p>Every little skill makes your friends more efficient. Upgrades have a short rest between them.</p><div className="level-dots" aria-label={`Gathering level ${game.level} of ${MAX_LEVEL}`}>{Array.from({ length: MAX_LEVEL }, (_, i) => <span key={i} className={i < game.level ? 'lit' : ''}>✦</span>)}</div><div className="upgrade-detail"><span>Current level</span><strong>{game.level} / {MAX_LEVEL}</strong></div><div className="upgrade-detail"><span>Next level</span><strong>{game.level === MAX_LEVEL ? 'Fully trained!' : `${perMinute(game.level + 1)} yarn / minute`}</strong></div><button className="button primary wide" type="button" onClick={upgrade} disabled={!canUpgrade}>{game.level === MAX_LEVEL ? 'All done ✿' : rest > 0 ? `Resting · ${rest}s` : `Upgrade · ${upgradeCost(game.level)} yarn`}</button><small className="muted">Available yarn includes yarn waiting to be claimed.</small></section></div>
    {message && <p className="notice" role="status">✦ {message}</p>}
  </div>;
}

const scarfPattern = ['knit', 'purl', 'knit', 'knit', 'purl'];
const safeDirection = (step) => step % 2 === 0 ? 'left' : 'right';

export function Wander() {
  const game = useGame();
  const [routeId, setRouteId] = useState(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState('');
  const finishedRef = useRef(false);
  const route = ROUTES.find((entry) => entry.id === routeId);
  function start(id) { setRouteId(id); setStep(0); setDone(false); setMessage(''); finishedRef.current = false; }
  function choose(choice) {
    if (!route || done || finishedRef.current) return;
    const correct = routeId === 'meadow' || (routeId === 'brambles' ? choice === safeDirection(step) : choice === scarfPattern[step]);
    if (!correct) { setMessage('A little detour! Try the other choice. No harm done.'); return; }
    setMessage('Lovely! One more little step.');
    if (step + 1 >= route.steps) {
      finishedRef.current = true;
      game.finishWander(route.id);
      setDone(true);
    } else setStep((value) => value + 1);
  }
  return <div className="content-wrap"><Heading kicker="BEYOND THE GARDEN GATE" title={<>A little <em>wander.</em></>} description="Five small steps, a little reward, and home before the kettle boils." />
    {!route ? <div className="route-grid">{ROUTES.map((item) => <article key={item.id} className="route-card"><div className="route-illustration" aria-hidden="true">{item.icon}</div><h2>{item.title}</h2><p>{item.subtitle}</p><div className="route-footer"><span>🧶 {Math.floor(item.reward * batteryMultiplier(game.battery))} yarn</span><button type="button" className="button primary" onClick={() => start(item.id)}>Explore ↗</button></div></article>)}</div> : <section className="panel encounter-panel"><button type="button" className="back-link" onClick={() => setRouteId(null)}>← All trails</button><div className="encounter-illustration" aria-hidden="true">{done ? '✨' : route.icon}</div><span className="eyebrow">{route.title.toUpperCase()}</span><h2>{done ? 'A very lovely wander!' : routeId === 'meadow' ? 'Gather the glowing skeins' : routeId === 'brambles' ? 'Find the clear path' : 'Finish the next stitch'}</h2><p>{done ? `${game.name} found a little more yarn for the hollow.` : routeId === 'meadow' ? 'Tap any floating skein to gather it.' : routeId === 'brambles' ? `The brambles lean ${safeDirection(step) === 'left' ? 'right' : 'left'}; which way is clear?` : `Next stitch: ${scarfPattern[step] === 'knit' ? 'Knit' : 'Purl'}.`}</p>
      {done ? <><p className="reward-message">+{Math.floor(route.reward * batteryMultiplier(game.battery))} yarn earned 🧶</p><button type="button" className="button primary" onClick={() => setRouteId(null)}>Back to the valley</button></> : <><div className="step-markers" aria-label={`Step ${step + 1} of ${route.steps}`}>{Array.from({ length: route.steps }, (_, i) => <span key={i} className={i <= step ? 'lit' : ''}/>)}</div><div className="choices">{(routeId === 'meadow' ? ['🧶', '🧵', '🧶'] : routeId === 'brambles' ? ['left', 'right'] : ['knit', 'purl']).map((choice, index) => <button type="button" key={`${choice}-${index}`} className="choice" onClick={() => choose(choice)}>{routeId === 'meadow' ? <span className="big-emoji">{choice}</span> : choice === 'left' ? '← Left trail' : choice === 'right' ? 'Right trail →' : choice === 'knit' ? '🪡 Knit' : '🧵 Purl'}</button>)}</div><p className="muted tiny" role="status">{message || 'There are no wrong turns that cost you anything.'}</p></>}
    </section>}
  </div>;
}

export function Yarn() {
  const game = useGame();
  const [draftName, setDraftName] = useState(game.name);
  useEffect(() => setDraftName(game.name), [game.activeCritterId, game.name]);
  return <div className="content-wrap"><Heading kicker="MAKE THEM YOUR OWN" title={<>A friend made of <em>yarn.</em></>} description="Every stitch tells a little story. Give your companion a look that feels like home." />
    <section className="panel critter-collection" aria-label="Your Lumenettes">
      <div className="critter-collection-head">
        <div><span className="eyebrow">A SMALL HOUSEHOLD</span><h2>Your Lumenettes</h2><p>Each little friend has their own name and look. Pick one to customize, and choose a favorite.</p></div>
        <span className="critter-count">{game.critters.length} / 2 in this preview</span>
      </div>
      <div className="critter-grid">
        {game.critters.map((critter) => <article className="critter-card" key={critter.id}>
          <Lumenette name={critter.name} color={critter.appearance.color} face={critter.appearance.face} accessory={critter.appearance.accessory}/>
          <div className="critter-info"><strong>{critter.name}</strong><span>{critter.id === game.favoriteCritterId ? '★ Favorite' : '✧ Cottage resident'}</span></div>
          <div className="critter-actions">
            <button type="button" className="button secondary" aria-pressed={game.activeCritterId === critter.id}
              onClick={() => game.selectCritter(critter.id)}>{game.activeCritterId === critter.id ? 'Customizing ✓' : 'Customize'}</button>
            <button type="button" className="button secondary" aria-label={`Favorite ${critter.name}`}
              aria-pressed={game.favoriteCritterId === critter.id}
              onClick={() => game.setFavoriteCritter(critter.id)}>{game.favoriteCritterId === critter.id ? '★ Favorite' : '☆ Favorite'}</button>
          </div>
        </article>)}
      </div>
      <button type="button" className="button primary" disabled={game.critters.length >= 2}
        onClick={game.createCritter}>{game.critters.length >= 2 ? 'Two friends ready ✿' : 'Make another Lumenette ✿'}</button>
      <p className="muted tiny">Checkpoint 2 collection preview: one authored pattern; no construction abilities or resident AI yet.</p>
    </section>
    <div className="custom-grid"><section className="panel preview-card"><span className="eyebrow">YOUR COMPANION</span><div className="preview-orbit"><Lumenette name={game.name} color={game.color} face={game.face} accessory={game.accessory}/></div><h2>{game.name} <span>✿</span></h2><p>Your ever-present little yarn friend.</p></section>
    <section className="panel custom-controls"><div className="input-row"><label htmlFor="companion-name" className="field-title">Companion's name</label><div className="name-row"><input id="companion-name" type="text" maxLength="20" value={draftName} onChange={(event) => setDraftName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') game.setName(draftName); }}/><button type="button" className="button secondary" onClick={() => game.setName(draftName)}>Save</button></div></div>
    <fieldset><legend className="field-title">Pick a yarn color</legend><div className="swatches">{COLORS.map((color) => <button type="button" key={color.id} className={`swatch ${game.color === color.id ? 'selected' : ''}`} style={{ '--swatch': color.hex }} disabled={!game.ownedColors.includes(color.id)} aria-label={`${color.label}${!game.ownedColors.includes(color.id) ? ', locked' : ''}`} aria-pressed={game.color === color.id} title={color.label} onClick={() => game.setColor(color.id)}><span aria-hidden="true">{!game.ownedColors.includes(color.id) ? '🔒' : game.color === color.id ? '✓' : ''}</span></button>)}</div><Link to="/shop" className="text-link tiny">Find more colors in the shop ↗</Link></fieldset>
    <fieldset><legend className="field-title">Stitched expression</legend><div className="option-row">{['smile', 'sleepy', 'bright'].map((face) => <button key={face} type="button" onClick={() => game.setFace(face)} className={`option ${game.face === face ? 'selected' : ''}`} aria-pressed={game.face === face}>{face === 'smile' ? '☺' : face === 'sleepy' ? 'ᴗ' : '◕'} <span>{face}</span></button>)}</div></fieldset>
    <fieldset><legend className="field-title">Little accessories</legend><div className="option-row">{['scarf', 'bow', 'flower', 'none'].map((accessory) => <button key={accessory} type="button" onClick={() => game.setAccessory(accessory)} className={`option ${game.accessory === accessory ? 'selected' : ''}`} aria-pressed={game.accessory === accessory}>{accessory === 'scarf' ? '🧣' : accessory === 'bow' ? '🎀' : accessory === 'flower' ? '🌼' : '✧'} <span>{accessory}</span></button>)}</div></fieldset>
    </section></div>
  </div>;
}

export function Shop() {
  const game = useGame();
  return <div className="content-wrap"><Heading kicker="THE LITTLE MARKET" title={<>Pretty things, <em>gently earned.</em></>} description="A few treasures for your cottage and companion. No payments, ads, or power purchases in this prototype." />
    <div className="shop-section"><div className="section-heading"><h2>For your cottage</h2><Resource compact /></div><div className="market-grid">{DECOR.map((item) => { const owned = game.decor.includes(item.id); return <article className="market-item" key={item.id}><div className="market-art" aria-hidden="true">{item.emoji}</div><h3>{item.label}</h3><p>{item.description}</p><button type="button" className={`button ${owned ? 'secondary' : 'primary'}`} disabled={owned || game.yarn < item.price} onClick={() => game.buyDecor(item.id)}>{owned ? 'In your cottage ✓' : `Get for ${item.price} 🧶`}</button></article>; })}</div></div>
    <div className="shop-section"><div className="section-heading"><h2>For your Lumenette</h2></div><div className="market-grid">{COLORS.filter((item) => item.price > 0).map((item) => { const owned = game.ownedColors.includes(item.id); return <article className="market-item" key={item.id}><div className="market-art"><span className="market-yarn" style={{ background: item.hex }} aria-hidden="true" /></div><h3>{item.label}</h3><p>A new skein for a fresh look.</p><button type="button" className={`button ${owned ? 'secondary' : 'primary'}`} disabled={owned || game.yarn < item.price} onClick={() => game.buyColor(item.id)}>{owned ? 'In your collection ✓' : `Get for ${item.price} 🧶`}</button></article>; })}</div></div>
    <div className="market-disclaimer"><span>✿</span><p>Paid packs, memberships, and real multiplayer are <strong>not implemented</strong>. This shop uses earned, local-only yarn and is just a design prototype.</p></div>
  </div>;
}
