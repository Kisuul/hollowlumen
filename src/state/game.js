import { starterCollection, normalizeCollection, editActiveCritter } from './critters.js';
/** Pure, deterministic economy and save rules. UI and persistence live elsewhere. */
export const LEGACY_SAVE_VERSION = 1;
export const SAVE_VERSION = 2;
export const MINUTE_MS = 60_000;
export const OFFLINE_CAP_MS = 4 * 60 * MINUTE_MS;
export const UPGRADE_REST_MS = 2 * MINUTE_MS; // Prototype cadence.
export const MAX_LEVEL = 5;

export const COLORS = [
  { id: 'rose', label: 'Roseberry', hex: '#ec9b9e', price: 0 },
  { id: 'lavender', label: 'Lilac mist', hex: '#b9a1d5', price: 24 },
  { id: 'mint', label: 'Fern mint', hex: '#98c5ac', price: 24 },
  { id: 'butter', label: 'Honey gold', hex: '#e4bd7c', price: 32 },
  { id: 'sky', label: 'Cloud blue', hex: '#a5bbd9', price: 32 },
];

export const DECOR = [
  { id: 'rug', label: 'Patchwork rug', emoji: '🧶', price: 22, description: 'A soft spot for tiny paws.' },
  { id: 'lamp', label: 'Firefly lamp', emoji: '🏮', price: 34, description: 'Keeps the warm glow going.' },
  { id: 'plant', label: 'Fern pot', emoji: '🪴', price: 18, description: 'A very polite little fern.' },
  { id: 'basket', label: 'Yarn basket', emoji: '🧺', price: 30, description: 'Everything in its place.' },
];

export const ROUTES = [
  { id: 'meadow', title: 'Skein meadow', icon: '🌼', subtitle: 'Catch a pocketful of drifting yarn', reward: 22, steps: 5 },
  { id: 'brambles', title: 'Bramble lane', icon: '🌿', subtitle: 'Choose the gentle way through', reward: 28, steps: 5 },
  { id: 'scarf', title: 'The lost scarf', icon: '🧣', subtitle: 'Help mend a neighbor’s stitches', reward: 25, steps: 5 },
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const finite = (value, fallback, min, max) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
const uniqAllowed = (value, allowed) => Array.isArray(value)
  ? [...new Set(value.filter((item) => typeof item === 'string' && allowed.includes(item)))]
  : [];

function newLegacyGame(now = Date.now()) {
  return {
    saveVersion: LEGACY_SAVE_VERSION,
    name: 'Pip', color: 'rose', face: 'smile', accessory: 'scarf',
    yarn: 65, level: 1, lastClaimMs: now, nextUpgradeMs: 0,
    ownedColors: ['rose'], decor: ['rug'], battery: 82,
    gateOpen: false, wanderCount: 0, visitCount: 0,
  };
}

/** The exact version-one sanitizer remains testable against locked synthetic fixtures. */
export function sanitizeV1Save(input, now = Date.now()) {
  const defaults = newLegacyGame(now);
  if (!isObject(input) || input.saveVersion !== LEGACY_SAVE_VERSION) return defaults;
  const colorIds = COLORS.map((item) => item.id);
  const decorIds = DECOR.map((item) => item.id);
  const ownedColors = [...new Set(['rose', ...uniqAllowed(input.ownedColors, colorIds)])];
  const decor = uniqAllowed(input.decor, decorIds);
  const name = typeof input.name === 'string' ? input.name.trim().slice(0, 20) : defaults.name;
  return {
    saveVersion: LEGACY_SAVE_VERSION,
    name: name || defaults.name,
    color: ownedColors.includes(input.color) ? input.color : 'rose',
    face: ['smile', 'sleepy', 'bright'].includes(input.face) ? input.face : defaults.face,
    accessory: ['scarf', 'bow', 'flower', 'none'].includes(input.accessory) ? input.accessory : defaults.accessory,
    yarn: Math.floor(finite(input.yarn, defaults.yarn, 0, 1_000_000)),
    level: Math.floor(finite(input.level, 1, 1, MAX_LEVEL)),
    lastClaimMs: finite(input.lastClaimMs, now, 0, now),
    nextUpgradeMs: finite(input.nextUpgradeMs, 0, 0, now + UPGRADE_REST_MS),
    ownedColors, decor,
    battery: Math.round(finite(input.battery, 82, 0, 100)),
    gateOpen: input.gateOpen === true,
    wanderCount: Math.floor(finite(input.wanderCount, 0, 0, 1_000_000)),
    visitCount: Math.floor(finite(input.visitCount, 0, 0, 1_000_000)),
  };
}

const ECONOMY_FIELDS = [
  'yarn', 'level', 'lastClaimMs', 'nextUpgradeMs', 'ownedColors', 'decor',
  'battery', 'gateOpen', 'wanderCount', 'visitCount',
];
const keepEconomy = (state) => Object.fromEntries(ECONOMY_FIELDS.map((key) => [key, state[key]]));

export function newGame(now = Date.now()) {
  return { saveVersion: SAVE_VERSION, ...keepEconomy(newLegacyGame(now)), ...starterCollection() };
}

/** A v1 Pip becomes exactly one named individual with a stable deterministic ID. */
export function migrateV1Save(input, now = Date.now()) {
  const legacy = sanitizeV1Save(input, now);
  return { saveVersion: SAVE_VERSION, ...keepEconomy(legacy), ...starterCollection(legacy) };
}

/** Called only on Zustand envelope version mismatch; unknown versions must not be silently reset. */
export function migratePersistedSave(input, fromVersion, now = Date.now()) {
  if (fromVersion === LEGACY_SAVE_VERSION) return migrateV1Save(input, now);
  throw new Error('Unsupported HollowLumen save version ' + fromVersion + '; refusing automatic migration');
}

/** Sanitizes canonical v2 state; old flat fields are NOT authoritative after migration. */
export function sanitizeSave(input, now = Date.now()) {
  if (!isObject(input) || input.saveVersion !== SAVE_VERSION) return newGame(now);
  const economy = keepEconomy(sanitizeV1Save({ ...input, saveVersion: LEGACY_SAVE_VERSION }, now));
  const collection = normalizeCollection(input, economy.ownedColors);
  return { saveVersion: SAVE_VERSION, ...economy, ...collection };
}

export const upgradeCost = (level) => 36 * level;
export const perMinute = (level) => 2 * level;
export const batteryMultiplier = (battery) => battery > 70 ? 1.1 : 1;

export function idleEarnings(game, now = Date.now()) {
  const elapsed = Math.max(0, Math.min(OFFLINE_CAP_MS, now - game.lastClaimMs));
  const minutes = Math.floor(elapsed / MINUTE_MS);
  return {
    minutes,
    amount: Math.floor(minutes * perMinute(game.level) * batteryMultiplier(game.battery)),
  };
}

export function claimIdle(game, now = Date.now()) {
  const { amount, minutes } = idleEarnings(game, now);
  if (minutes === 0) return { state: game, earned: 0 };
  const overdue = now - game.lastClaimMs >= OFFLINE_CAP_MS;
  return {
    state: {
      ...game,
      yarn: game.yarn + amount,
      lastClaimMs: overdue ? now : game.lastClaimMs + minutes * MINUTE_MS,
    },
    earned: amount,
  };
}

export function purchaseDecor(game, id) {
  const item = DECOR.find((entry) => entry.id === id);
  if (!item || game.decor.includes(id) || game.yarn < item.price) return game;
  return { ...game, yarn: game.yarn - item.price, decor: [...game.decor, id] };
}

export function purchaseColor(game, id) {
  const item = COLORS.find((entry) => entry.id === id);
  if (!item || game.ownedColors.includes(id) || game.yarn < item.price) return game;
  const purchased = {
    ...game,
    yarn: game.yarn - item.price,
    ownedColors: [...game.ownedColors, id],
  };
  return editActiveCritter(purchased, { color: id });
}

export function upgradeIdle(game, now = Date.now()) {
  if (game.level >= MAX_LEVEL || now < game.nextUpgradeMs) return game;
  const claimed = claimIdle(game, now).state; // Bank production earned at the previous rate.
  if (claimed.yarn < upgradeCost(game.level)) return claimed;
  return {
    ...claimed,
    yarn: claimed.yarn - upgradeCost(game.level),
    level: game.level + 1,
    nextUpgradeMs: now + UPGRADE_REST_MS,
  };
}

export function finishWander(game, routeId) {
  const route = ROUTES.find((entry) => entry.id === routeId);
  if (!route) return game;
  return { ...game, yarn: game.yarn + Math.floor(route.reward * batteryMultiplier(game.battery)), wanderCount: game.wanderCount + 1 };
}
