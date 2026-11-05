import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  APPEARANCE_STORAGE_KEY, DEFAULT_APPEARANCE, normalizeAppearance,
  readAppearance, writeAppearance, resolveSceneNight, resolveUiTheme,
} from '../src/theme/preferences.js';
import { generateThemeCss } from '../tools/build-theme-css.mjs';

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    values,
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
}

test('appearance defaults and malformed settings never alter game state', () => {
  assert.deepEqual(normalizeAppearance(null), DEFAULT_APPEARANCE);
  assert.deepEqual(normalizeAppearance([]), DEFAULT_APPEARANCE);
  assert.deepEqual(normalizeAppearance({ uiMode: 'admin', sceneMode: 'wrong' }), DEFAULT_APPEARANCE);
  const storage = memoryStorage({ 'lumenette-hollow-save': '{"yarn":800}' });
  assert.deepEqual(readAppearance(storage), DEFAULT_APPEARANCE);
  assert.equal(writeAppearance(storage, { uiMode: 'dark', sceneMode: 'always-day' }), true);
  assert.deepEqual(readAppearance(storage), { uiMode: 'dark', sceneMode: 'always-day' });
  assert.equal(storage.values.get('lumenette-hollow-save'), '{"yarn":800}');
  assert.ok(storage.values.has(APPEARANCE_STORAGE_KEY));
});

test('invalid JSON, save versions, and denied storage fail safely', () => {
  assert.deepEqual(readAppearance(memoryStorage({ [APPEARANCE_STORAGE_KEY]: '{' })), DEFAULT_APPEARANCE);
  assert.deepEqual(readAppearance(memoryStorage({ [APPEARANCE_STORAGE_KEY]: '{"version":2,"uiMode":"dark"}' })), DEFAULT_APPEARANCE);
  assert.deepEqual(readAppearance({ getItem() { throw Error('blocked'); } }), DEFAULT_APPEARANCE);
  assert.equal(writeAppearance({ setItem() { throw Error('quota'); } }, { uiMode: 'dark' }), false);
});

test('forced interface theme overrides scene and scene preference does not change interface override', () => {
  assert.equal(resolveUiTheme({ uiMode: 'light' }, true), 'day');
  assert.equal(resolveUiTheme({ uiMode: 'dark' }, false), 'night');
  assert.equal(resolveUiTheme({ uiMode: 'follow-world' }, true), 'night');
  assert.equal(resolveUiTheme({ uiMode: 'follow-world' }, false), 'day');
  assert.equal(resolveSceneNight({ sceneMode: 'always-day' }, true), false);
  assert.equal(resolveSceneNight({ sceneMode: 'always-night' }, false), true);
  assert.equal(resolveSceneNight({ sceneMode: 'follow-device-time' }, true), true);
});

test('generated CSS is deterministic and matches the committed design tokens', () => {
  const tokens = JSON.parse(readFileSync(new URL('../docs/design/tokens/visual.tokens.json', import.meta.url), 'utf8'));
  const generated = generateThemeCss(tokens);
  assert.equal(generated, readFileSync(new URL('../src/theme/theme-tokens.css', import.meta.url), 'utf8'));
  assert.match(generated, /--hl-canvas: #fcf8ff/);
  assert.match(generated, /--hl-canvas: #1b182a/);
  assert.match(generated, /--hl-action-fg: #1b182a/);
});
