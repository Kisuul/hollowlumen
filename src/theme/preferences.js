// HollowLumen appearance settings are deliberately separate from the game economy save.
// This module has no browser globals at import time and can be tested in Node.
export const APPEARANCE_STORAGE_KEY = 'lumenette-hollow-appearance-v1';
export const DEFAULT_APPEARANCE = Object.freeze({
  uiMode: 'follow-world',
  sceneMode: 'follow-device-time',
});
const UI_MODES = new Set(['follow-world', 'light', 'dark']);
const SCENE_MODES = new Set(['follow-device-time', 'always-day', 'always-night']);

export function normalizeAppearance(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ...DEFAULT_APPEARANCE };
  return {
    uiMode: UI_MODES.has(input.uiMode) ? input.uiMode : DEFAULT_APPEARANCE.uiMode,
    sceneMode: SCENE_MODES.has(input.sceneMode) ? input.sceneMode : DEFAULT_APPEARANCE.sceneMode,
  };
}

export function readAppearance(storage) {
  try {
    const saved = JSON.parse(storage.getItem(APPEARANCE_STORAGE_KEY));
    return saved?.version === 1 ? normalizeAppearance(saved) : { ...DEFAULT_APPEARANCE };
  } catch {
    return { ...DEFAULT_APPEARANCE };
  }
}

export function writeAppearance(storage, input) {
  const preferences = normalizeAppearance(input);
  try {
    storage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify({ version: 1, ...preferences }));
    return true;
  } catch {
    return false; // Private browsing, blocked storage or quota exhaustion.
  }
}

export function resolveSceneNight(preferences, computedWorldNight = false) {
  const { sceneMode } = normalizeAppearance(preferences);
  if (sceneMode === 'always-day') return false;
  if (sceneMode === 'always-night') return true;
  return computedWorldNight === true;
}

export function resolveUiTheme(preferences, sceneIsNight = false) {
  const { uiMode } = normalizeAppearance(preferences);
  if (uiMode === 'light') return 'day';
  if (uiMode === 'dark') return 'night';
  return sceneIsNight === true ? 'night' : 'day';
}
