import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  newGame, migrateV1Save, migratePersistedSave, sanitizeSave, purchaseColor,
  claimIdle, upgradeIdle, finishWander, SAVE_VERSION,
} from '../src/state/game.js';
import {
  PATTERNS, MAX_CRITTERS, createCritter, editActiveCritter, selectCritter,
  selectFavorite, normalizeCollection, FIRST_CRITTER_ID,
} from '../src/state/critters.js';

const NOW = 1_800_000_000_000;
const fixture = (file) => JSON.parse(readFileSync(new URL('./fixtures/' + file, import.meta.url), 'utf8'));
const original = fixture('v1-pip-customized.json');

test('v1 migration creates exactly one stable individual and preserves all historic progress', () => {
  const v2 = migratePersistedSave(original.state, original.version, NOW);
  assert.equal(v2.saveVersion, SAVE_VERSION);
  assert.equal(v2.critters.length, 1);
  assert.equal(v2.critters[0].id, FIRST_CRITTER_ID);
  assert.equal(v2.critters[0].name, 'Pip the First');
  assert.equal(v2.critters[0].patternId, PATTERNS[0].id);
  assert.equal(v2.critters[0].appearance.color, 'lavender');
  assert.equal(v2.activeCritterId, FIRST_CRITTER_ID);
  assert.equal(v2.favoriteCritterId, FIRST_CRITTER_ID);
  assert.deepEqual(v2.household.residentIds, [FIRST_CRITTER_ID]);
  for (const key of ['yarn', 'level', 'lastClaimMs', 'nextUpgradeMs', 'ownedColors', 'decor', 'battery', 'gateOpen', 'wanderCount', 'visitCount']) {
    assert.deepEqual(v2[key], original.state[key], 'Lost v1 progress: ' + key);
  }
  assert.deepEqual(sanitizeSave(v2, NOW), v2, 'v2 sanitization should be idempotent');
  assert.deepEqual(migrateV1Save(original.state, NOW), v2, 'Migration must be deterministic');
});

test('two same-pattern individuals have independent identity, appearance and favorite', () => {
  const first = newGame(NOW);
  const two = createCritter(first);
  assert.equal(first.critters.length, 1);
  assert.equal(two.critters.length, 2);
  assert.notEqual(two.critters[0].id, two.critters[1].id);
  assert.equal(two.critters[1].id, 'critter-000002');
  assert.equal(two.critters[1].patternId, two.critters[0].patternId);
  assert.notEqual(two.critters[1].name, two.critters[0].name);
  const named = editActiveCritter(two, { name: 'Wisp', face: 'sleepy' });
  assert.equal(named.critters[0].name, 'Pip');
  assert.equal(named.critters[1].name, 'Wisp');
  const favorite = selectFavorite(named, named.critters[1].id);
  assert.equal(favorite.favoriteCritterId, named.critters[1].id);
  const switched = selectCritter(favorite, FIRST_CRITTER_ID);
  assert.equal(switched.name, 'Pip');
  assert.equal(switched.favoriteCritterId, named.critters[1].id);
  assert.equal(selectCritter(switched, 'no-such-id'), switched);
  assert.equal(selectFavorite(switched, 'no-such-id'), switched);
  assert.deepEqual(sanitizeSave(switched, NOW), switched);
});

test('purchases, rest and idle mechanics do not erase collection state', () => {
  let game = createCritter(newGame(NOW));
  game = purchaseColor(game, 'mint');
  assert.equal(game.color, 'mint');
  assert.equal(game.critters[1].appearance.color, 'mint');
  assert.equal(game.critters[0].appearance.color, 'rose');
  const firstId = game.critters[0].id, lastId=game.critters[1].id;
  game = upgradeIdle(game, NOW + 3 * 60_000);
  game = claimIdle(game, NOW + 5 * 60_000).state;
  game = finishWander(game, 'meadow');
  assert.deepEqual(game.critters.map((critter) => critter.id), [firstId, lastId]);
  assert.equal(game.activeCritterId, lastId);
});

test('malformed v2 collection is bounded, deduplicated and never trusts unknown patterns or favorites', () => {
  const save = createCritter(newGame(NOW));
  const hostile = {
    ...save, favoriteCritterId: 'not-a-critter', activeCritterId: 'bad',
    critters: [...save.critters, save.critters[0], {
      id:'critter-999999', patternId:'untrusted-pattern', patternRevision:1,
      name:'X', appearance:{color:'admin',face:'admin',accessory:'admin'},
    }],
    household: { residentIds: ['critter-000002', 'nope', 'critter-000002'] },
    nextCritterSequence: -1, color:'admin', name:'fake legacy alias',
  };
  const clean = sanitizeSave(hostile, NOW);
  assert.equal(clean.critters.length, 2);
  assert.equal(clean.activeCritterId, FIRST_CRITTER_ID);
  assert.equal(clean.favoriteCritterId, FIRST_CRITTER_ID);
  assert.equal(clean.name, 'Pip');
  assert.deepEqual(clean.household.residentIds, ['critter-000002']);
  assert.equal(clean.nextCritterSequence, 3);
  assert.equal(sanitizeSave({saveVersion:18}, NOW).saveVersion, SAVE_VERSION);
  assert.throws(() => migratePersistedSave(original.state, 9, NOW), /Unsupported/);
});

test('creation is bounded, monotonic and cannot collide after reload', () => {
  let game = newGame(NOW);
  for(let i=1;i<MAX_CRITTERS;i++)game=createCritter(game);
  assert.equal(game.critters.length, MAX_CRITTERS);
  assert.strictEqual(createCritter(game), game);
  const afterLoad = sanitizeSave(JSON.parse(JSON.stringify(game)), NOW);
  assert.deepEqual(afterLoad.critters.map(x=>x.id), game.critters.map(x=>x.id));
  assert.equal(afterLoad.nextCritterSequence, MAX_CRITTERS+1);
  assert.strictEqual(createCritter(afterLoad), afterLoad);
});
