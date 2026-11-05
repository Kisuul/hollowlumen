import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sanitizeV1Save, migrateV1Save, migratePersistedSave, idleEarnings, claimIdle, LEGACY_SAVE_VERSION, SAVE_VERSION, MAX_LEVEL } from '../src/state/game.js';

const NOW = 1_800_000_000_000; // Explicit deterministic clock, later than fixture timestamps.
const readFixture = (name) => JSON.parse(readFileSync(new URL('./fixtures/' + name, import.meta.url), 'utf8'));

test('synthetic v1 local-storage envelope retains all canonical Pip fields', () => {
  const persisted = readFixture('v1-pip-customized.json');
  assert.equal(persisted.version, 1, 'Zustand persist envelope version must be explicit');
  assert.equal(persisted.state.saveVersion, LEGACY_SAVE_VERSION, 'Domain state version is independent of envelope');
  assert.deepEqual(Object.keys(persisted.state).sort(), Object.keys(sanitizeV1Save(persisted.state, NOW)).sort());
  const loaded = sanitizeV1Save(persisted.state, NOW);
  assert.deepEqual(loaded, persisted.state);
  assert.equal(loaded.name, 'Pip the First');
  assert.equal(loaded.yarn, 157);
  assert.equal(loaded.level, 3);
  assert.deepEqual(loaded.ownedColors, ['rose', 'lavender']);
  assert.deepEqual(loaded.decor, ['rug', 'lamp']);
  assert.equal(loaded.lastClaimMs, 1_730_000_000_000);
  assert.equal(loaded.nextUpgradeMs, 0);
  assert.equal(loaded.gateOpen, true);
  assert.equal(loaded.wanderCount, 5);
  assert.equal(loaded.visitCount, 2);
});

test('legacy idle economics still use the persisted claim timestamp, not scene time', () => {
  const game = sanitizeV1Save(readFixture('v1-pip-customized.json').state, NOW);
  const expected = idleEarnings(game, NOW);
  assert.equal(expected.minutes, 240, 'Offline cap still applies to old saves');
  const result = claimIdle(game, NOW);
  assert.equal(result.earned, expected.amount);
  assert.equal(result.state.lastClaimMs, NOW);
  assert.equal(result.state.yarn, 157 + expected.amount);
  assert.equal(game.yarn, 157, 'Pure claim does not mutate original save');
});

test('hostile v1 fixture is sanitized without introducing untrusted identities', () => {
  const persisted = readFixture('v1-malformed.json');
  assert.equal(persisted.version, 1);
  const sanitized = sanitizeV1Save(persisted.state, NOW);
  assert.equal(sanitized.saveVersion, 1);
  assert.equal(sanitized.name, 'Pip');
  assert.equal(sanitized.color, 'rose');
  assert.equal(sanitized.face, 'smile');
  assert.equal(sanitized.accessory, 'scarf');
  assert.equal(sanitized.yarn, 0);
  assert.equal(sanitized.level, MAX_LEVEL);
  assert.equal(sanitized.lastClaimMs, NOW);
  assert.equal(sanitized.nextUpgradeMs, 0);
  assert.deepEqual(sanitized.ownedColors, ['rose']);
  assert.deepEqual(sanitized.decor, ['lamp']);
  assert.equal(sanitized.battery, 100);
  assert.equal(sanitized.gateOpen, false);
  assert.equal(sanitized.wanderCount, 0);
  assert.equal(sanitized.visitCount, 1);
});

test('the appearance preferences save remains a separate key from the game save', () => {
  const game = readFixture('v1-pip-customized.json');
  assert.equal(game.version, 1);
  assert.ok(!Object.hasOwn(game.state, 'uiMode'));
  assert.ok(!Object.hasOwn(game.state, 'sceneMode'));
  // Future migration must not merge the appearance envelope into economy state.
});
