/** Pure, bounded individual-critter and collection rules. No React or browser globals. */
export const PATTERNS = Object.freeze([
  Object.freeze({ id: 'round-lumenette', revision: 1, label: 'Round Lumenette' }),
]);
export const MAX_CRITTERS = 8;
export const FIRST_CRITTER_ID = 'critter-000001';
const MAX_SEQUENCE = 999999;
const ID = /^critter-([0-9]{6})$/;
const FACES = ['smile', 'sleepy', 'bright'];
const ACCESSORIES = ['scarf', 'bow', 'flower', 'none'];
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const validId = (value) => typeof value === 'string' && ID.test(value) && Number(value.slice(8)) > 0;
const nameOr = (value, fallback) => typeof value === 'string' ? value.trim().slice(0, 20) || fallback : fallback;
const takeAllowed = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
const numberOr = (value, fallback) => Number.isSafeInteger(value) && value > 0 && value <= MAX_SEQUENCE ? value : fallback;

export function makeCritter(id = FIRST_CRITTER_ID, name = 'Pip', appearance = {}) {
  return {
    id, patternId: PATTERNS[0].id, patternRevision: PATTERNS[0].revision,
    name,
    appearance: {
      color: appearance.color ?? 'rose',
      face: appearance.face ?? 'smile',
      accessory: appearance.accessory ?? 'scarf',
    },
  };
}

export function starterCollection(legacy = {}) {
  const first = makeCritter(FIRST_CRITTER_ID, nameOr(legacy.name, 'Pip'), {
    color: legacy.color ?? 'rose', face: legacy.face ?? 'smile', accessory: legacy.accessory ?? 'scarf',
  });
  return {
    critters: [first], activeCritterId: first.id, favoriteCritterId: first.id,
    nextCritterSequence: 2, household: { residentIds: [first.id] },
    name: first.name, ...first.appearance, // Runtime-only view of the selected individual.
  };
}

export function activeProjection(collection) {
  const active = collection.critters.find((critter) => critter.id === collection.activeCritterId);
  if (!active) throw new Error('Active critter reference is invalid');
  return { name: active.name, ...active.appearance };
}

function normalizeCritter(raw, ownedColors) {
  if (!isObject(raw) || !validId(raw.id) ||
      raw.patternId !== PATTERNS[0].id || raw.patternRevision !== PATTERNS[0].revision) return null;
  const appearance = isObject(raw.appearance) ? raw.appearance : {};
  return makeCritter(raw.id, nameOr(raw.name, 'Lumenette'), {
    color: takeAllowed(appearance.color, ownedColors, 'rose'),
    face: takeAllowed(appearance.face, FACES, 'smile'),
    accessory: takeAllowed(appearance.accessory, ACCESSORIES, 'none'),
  });
}

/** Canonical stored state: pattern references and individuals are separate from UI aliases. */
export function normalizeCollection(raw, ownedColors) {
  const collection = isObject(raw) ? raw : {};
  const ids = new Set();
  const critters = [];
  for (const entry of Array.isArray(collection.critters) ? collection.critters.slice(0, 128) : []) {
    const critter = normalizeCritter(entry, ownedColors);
    if (critter && !ids.has(critter.id) && critters.length < MAX_CRITTERS) {
      ids.add(critter.id);
      critters.push(critter);
    }
  }
  if (!critters.length) return starterCollection();
  const fallback = critters[0].id;
  const activeCritterId = ids.has(collection.activeCritterId) ? collection.activeCritterId : fallback;
  const favoriteCritterId = ids.has(collection.favoriteCritterId) ? collection.favoriteCritterId : fallback;
  const residentIds = [...new Set((Array.isArray(collection.household?.residentIds)
    ? collection.household.residentIds : critters.map((item) => item.id))
    .filter((id) => ids.has(id)))];
  const maxSeen = Math.max(...critters.map((item) => Number(item.id.slice(8))));
  const nextCritterSequence = Math.max(maxSeen + 1, numberOr(collection.nextCritterSequence, 2));
  const next = {
    critters, activeCritterId, favoriteCritterId,
    nextCritterSequence, household: { residentIds },
  };
  return { ...next, ...activeProjection(next) };
}

export function selectCritter(state, id) {
  if (id === state.activeCritterId || !state.critters.some((critter) => critter.id === id)) return state;
  const next = { ...state, activeCritterId: id };
  return { ...next, ...activeProjection(next) };
}

export function selectFavorite(state, id) {
  if (id === state.favoriteCritterId || !state.critters.some((critter) => critter.id === id)) return state;
  return { ...state, favoriteCritterId: id };
}

export function createCritter(state) {
  if (state.critters.length >= MAX_CRITTERS || state.nextCritterSequence > MAX_SEQUENCE) return state;
  const id = 'critter-' + String(state.nextCritterSequence).padStart(6, '0');
  if (state.critters.some((critter) => critter.id === id)) return state;
  const critter = makeCritter(id, 'Lumenette ' + (state.critters.length + 1), {
    color: 'rose', face: 'bright', accessory: 'bow',
  });
  const next = {
    ...state, critters: [...state.critters, critter], activeCritterId: id,
    nextCritterSequence: state.nextCritterSequence + 1,
    household: { residentIds: [...state.household.residentIds, id] },
  };
  return { ...next, ...activeProjection(next) };
}

/** Update only the selected individual; keep the old Home/Yarn UI projection synchronized. */
export function editActiveCritter(state, patch) {
  if (!isObject(patch)) return state;
  const selected = state.critters.find((critter) => critter.id === state.activeCritterId);
  if (!selected) return state;
  const name = Object.hasOwn(patch, 'name') ? nameOr(patch.name, 'Pip') : selected.name;
  const appearance = {
    color: Object.hasOwn(patch, 'color') ? takeAllowed(patch.color, state.ownedColors, selected.appearance.color) : selected.appearance.color,
    face: Object.hasOwn(patch, 'face') ? takeAllowed(patch.face, FACES, selected.appearance.face) : selected.appearance.face,
    accessory: Object.hasOwn(patch, 'accessory') ? takeAllowed(patch.accessory, ACCESSORIES, selected.appearance.accessory) : selected.appearance.accessory,
  };
  if (name === selected.name && Object.keys(appearance).every((key) => appearance[key] === selected.appearance[key])) return state;
  const next = {
    ...state,
    critters: state.critters.map((item) => item.id === selected.id ? { ...item, name, appearance } : item),
  };
  return { ...next, ...activeProjection(next) };
}
