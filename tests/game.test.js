import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OFFLINE_CAP_MS, MINUTE_MS, newGame, sanitizeSave, claimIdle,
  idleEarnings, purchaseColor, purchaseDecor, finishWander, upgradeIdle,
  upgradeCost,
} from '../src/state/game.js';

const start = 1_800_000_000_000;

test('new save is deterministic and includes a starter cottage', () => {
  const game = newGame(start);
  assert.equal(game.name, 'Pip');
  assert.deepEqual(game.decor, ['rug']);
  assert.equal(game.lastClaimMs, start);
});

test('idle progress awards whole minutes and does not discard partial minutes', () => {
  const base = { ...newGame(start), battery: 50 };
  const premature = claimIdle(base, start + 30_000);
  assert.strictEqual(premature.state, base);
  const one = claimIdle(base, start + 90_000);
  assert.equal(one.earned, 2);
  assert.equal(one.state.lastClaimMs, start + MINUTE_MS);
  assert.equal(claimIdle(one.state, start + 90_000).earned, 0);
});

test('offline time is capped and a capped claim resets elapsed production', () => {
  const base = { ...newGame(start), battery: 50 };
  assert.equal(idleEarnings(base, start + OFFLINE_CAP_MS * 3).minutes, 240);
  const claimed = claimIdle(base, start + OFFLINE_CAP_MS * 3);
  assert.equal(claimed.earned, 480);
  assert.equal(claimIdle(claimed.state, start + OFFLINE_CAP_MS * 3).earned, 0);
});

test('battery reward bonus is limited to above 70 percent', () => {
  const base = newGame(start);
  assert.equal(idleEarnings({ ...base, battery: 70 }, start + 10 * MINUTE_MS).amount, 20);
  assert.equal(idleEarnings({ ...base, battery: 71 }, start + 10 * MINUTE_MS).amount, 22);
});

test('purchases are affordable, unique and cannot be repeated', () => {
  const base = newGame(start);
  const decorated = purchaseDecor(base, 'lamp');
  assert.equal(decorated.yarn, base.yarn - 34);
  assert.strictEqual(purchaseDecor(decorated, 'lamp'), decorated);
  const colored = purchaseColor(base, 'mint');
  assert.equal(colored.color, 'mint');
  assert.equal(colored.yarn, base.yarn - 24);
  assert.strictEqual(purchaseColor(colored, 'mint'), colored);
  assert.strictEqual(purchaseDecor(base, 'not-real'), base);
});

test('upgrade banks old-rate yarn before new production and enforces rest', () => {
  const base = { ...newGame(start), battery: 50 };
  assert.equal(upgradeCost(base.level), 36);
  const updated = upgradeIdle(base, start + MINUTE_MS * 3);
  assert.equal(updated.level, 2);
  assert.equal(updated.yarn, 65 + 6 - 36);
  assert.equal(updated.nextUpgradeMs, start + MINUTE_MS * 5);
  assert.strictEqual(upgradeIdle(updated, start + MINUTE_MS * 4), updated);
});

test('wander grants yarn without modifying unrelated saved fields', () => {
  const base = { ...newGame(start), battery: 50 };
  const completed = finishWander(base, 'meadow');
  assert.equal(completed.wanderCount, 1);
  assert.equal(completed.yarn, 87);
  assert.strictEqual(finishWander(base, 'unknown'), base);
});

test('invalid saves revert to defaults and malformed fields are constrained', () => {
  assert.deepEqual(sanitizeSave({ saveVersion: -1 }, start), newGame(start));
  const bad = sanitizeSave({
    ...newGame(start), name: '<script> x </script> a very long name',
    yarn: -90, level: 400, battery: 900, color: 'admin',
    ownedColors: ['rose', 'mint', 'mint', 'admin'], decor: ['lamp', 'lamp', 4],
    lastClaimMs: start + 200000,
  }, start);
  assert.equal(bad.yarn, 0);
  assert.equal(bad.level, 5);
  assert.equal(bad.battery, 100);
  assert.equal(bad.color, 'rose');
  assert.deepEqual(bad.ownedColors, ['rose', 'mint']);
  assert.deepEqual(bad.decor, ['lamp']);
  assert.equal(bad.lastClaimMs, start);
  assert.ok(bad.name.length <= 20);
});


test('upgrade can spend yarn earned offline on the same action', () => {
  const game = { ...newGame(start), yarn: 30, battery: 50 };
  const upgraded = upgradeIdle(game, start + 3 * MINUTE_MS);
  assert.equal(upgraded.level, 2);
  assert.equal(upgraded.yarn, 0);
});
