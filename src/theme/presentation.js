// Pure scene/UI view model. Never import the economy clock or Zustand game state here.
import { solarStateAt, solarStateFromDeviceClock } from '../solar/solar.js';
import { normalizeAppearance, resolveSceneNight, resolveUiTheme } from './preferences.js';

export function presentationAt(date, rawAppearance, previewHour = null) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new RangeError('Invalid date');
  const appearance = normalizeAppearance(rawAppearance);
  const previewActive = previewHour !== null;
  if (previewActive && (!Number.isFinite(previewHour) || previewHour < 0 || previewHour >= 24)) {
    throw new RangeError('Preview hour must be within [0,24)');
  }
  const calendar = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  let scene;
  if (appearance.sceneMode === 'always-day') {
    scene = solarStateAt({ ...calendar, solarHour: 12 });
  } else if (appearance.sceneMode === 'always-night') {
    scene = solarStateAt({ ...calendar, solarHour: 0 });
  } else if (previewActive) {
    scene = solarStateAt({ ...calendar, solarHour: previewHour });
  } else {
    scene = solarStateFromDeviceClock(date);
  }
  const sceneIsNight = resolveSceneNight(appearance, scene.isDark);
  return {
    scene,
    sceneIsNight,
    uiTheme: resolveUiTheme(appearance, sceneIsNight),
    previewActive: previewActive && appearance.sceneMode === 'follow-device-time',
    appearance,
  };
}

export function sceneLabel(scene) {
  if (scene.phase === 'night') return 'Starlit night';
  if (scene.phase === 'astronomical-twilight') return scene.rising ? 'Before dawn' : 'Night falling';
  if (scene.phase === 'nautical-twilight') return scene.rising ? 'Blue dawn' : 'Blue hour';
  if (scene.phase === 'civil-twilight') return scene.rising ? 'Lavender dawn' : 'Lavender dusk';
  if (scene.phase === 'low-sun') return scene.rising ? 'Golden sunrise' : 'Golden sunset';
  return 'Gentle daylight';
}

export function displayHour(hour) {
  if (!Number.isFinite(hour) || hour < 0 || hour >= 24) throw new RangeError('Invalid time');
  const roundedMinutes = Math.round(hour * 60);
  return String(Math.floor(roundedMinutes / 60) % 24).padStart(2, '0')
    + ':' + String(roundedMinutes % 60).padStart(2, '0');
}
