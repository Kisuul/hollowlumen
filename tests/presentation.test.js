import test from 'node:test';
import assert from 'node:assert/strict';
import { presentationAt, sceneLabel, displayHour } from '../src/theme/presentation.js';
import { newGame, idleEarnings } from '../src/state/game.js';

const date = new Date(2026, 5, 21, 18, 30, 0);
test('UI appearance is independent of the scene clock and scene override', () => {
  const lightAtNight = presentationAt(date, { uiMode: 'light', sceneMode: 'always-night' });
  assert.equal(lightAtNight.sceneIsNight, true);
  assert.equal(lightAtNight.uiTheme, 'day');
  const darkAtDay = presentationAt(date, { uiMode: 'dark', sceneMode: 'always-day' });
  assert.equal(darkAtDay.sceneIsNight, false);
  assert.equal(darkAtDay.uiTheme, 'night');
  const autoDay = presentationAt(date, { uiMode: 'follow-world', sceneMode: 'always-day' });
  const autoNight = presentationAt(date, { uiMode: 'follow-world', sceneMode: 'always-night' });
  assert.equal(autoDay.uiTheme, 'day');
  assert.equal(autoNight.uiTheme, 'night');
});

test('preview is purely presentational and uses the chosen calendar date', () => {
  const before = date.getTime();
  const morning = presentationAt(date, null, 6);
  const evening = presentationAt(date, null, 18);
  assert.equal(morning.previewActive, true);
  assert.equal(evening.previewActive, true);
  assert.equal(morning.scene.rising, true);
  assert.equal(evening.scene.rising, false);
  assert.ok(morning.scene.ambient >= 0 && morning.scene.ambient <= 1);
  assert.equal(date.getTime(), before);
  assert.equal(presentationAt(date, null).previewActive, false);
  assert.throws(() => presentationAt(date, null, 24), RangeError);
  assert.throws(() => presentationAt(date, null, NaN), RangeError);
});

test('forced scene preference ignores temporary preview but preserves manual theme', () => {
  const prefs = { uiMode: 'dark', sceneMode: 'always-day' };
  const morning = presentationAt(date, prefs, 3);
  const evening = presentationAt(date, prefs, 21);
  assert.equal(morning.previewActive, false);
  assert.equal(morning.scene.elevationDeg, evening.scene.elevationDeg);
  assert.equal(morning.uiTheme, 'night');
});

test('preview does not change idle earnings or authoritative game timestamps', () => {
  const time = date.getTime();
  const game = newGame(time - 2 * 60_000);
  const before = idleEarnings(game, time);
  presentationAt(date, null, 1);
  presentationAt(date, null, 20);
  assert.deepEqual(idleEarnings(game, time), before);
  assert.equal(game.lastClaimMs, time - 2 * 60_000);
});

test('screen-reader phase and time labels are deterministic', () => {
  const dawn = presentationAt(date, null, 5).scene;
  const night = presentationAt(date, null, 0).scene;
  assert.equal(typeof sceneLabel(dawn), 'string');
  assert.equal(sceneLabel(night), 'Starlit night');
  assert.equal(displayHour(0), '00:00');
  assert.equal(displayHour(23.75), '23:45');
});
