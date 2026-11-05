// Earth-like solar elevation for a FICTIONAL valley; not geographic sunrise/sunset.
// Model: NOAA declination approximation + geometric solar zenith, with local solar noon
// anchored to ~12:00 STANDARD civil time. No GPS, network, or gameplay-state access.
export const VALLEY_LATITUDE_DEG = 45;
export const SUNRISE_ELEVATION_DEG = -0.833333; // apparent sunrise/sunset at level horizon
const TO_RAD = Math.PI / 180;
const TO_DEG = 180 / Math.PI;
const DAY_MS = 86_400_000;
const clamp = (v, low, high) => Math.min(high, Math.max(low, v));

export function isLeapYear(year) {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) throw new RangeError('Year out of supported range');
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function dayOfYear(year, month, day) {
  isLeapYear(year);
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(day)) throw new RangeError('Invalid month/day');
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError('Invalid calendar date');
  return Math.round((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / DAY_MS) + 1;
}

export function declinationDegrees(year, month, day, solarHour = 12) {
  const ordinal = dayOfYear(year, month, day);
  if (!Number.isFinite(solarHour) || solarHour < 0 || solarHour >= 24) throw new RangeError('Solar hour must be [0,24)');
  const count = isLeapYear(year) ? 366 : 365;
  const angle = (2 * Math.PI / count) * (ordinal - 1 + (solarHour - 12) / 24);
  // NOAA fractional-year approximation for solar declination in radians.
  const delta = 0.006918 - 0.399912 * Math.cos(angle) + 0.070257 * Math.sin(angle)
    - 0.006758 * Math.cos(2 * angle) + 0.000907 * Math.sin(2 * angle)
    - 0.002697 * Math.cos(3 * angle) + 0.00148 * Math.sin(3 * angle);
  return delta * TO_DEG;
}

export function phaseFromElevation(elevationDeg) {
  if (!Number.isFinite(elevationDeg)) throw new RangeError('Invalid elevation');
  if (elevationDeg < -18) return 'night';
  if (elevationDeg < -12) return 'astronomical-twilight';
  if (elevationDeg < -6) return 'nautical-twilight';
  if (elevationDeg < SUNRISE_ELEVATION_DEG) return 'civil-twilight';
  if (elevationDeg < 6) return 'low-sun';
  return 'day';
}

function smoothstep(low, high, value) {
  const v = clamp((value - low) / (high - low), 0, 1);
  return v * v * (3 - 2 * v);
}

export function lightingFromElevation(elevationDeg) {
  if (!Number.isFinite(elevationDeg)) throw new RangeError('Invalid elevation');
  return {
    ambient: smoothstep(-18, 6, elevationDeg),
    stars: 1 - smoothstep(-18, -6, elevationDeg),
    lanterns: 1 - smoothstep(-6, 6, elevationDeg),
  };
}

export function solarStateAt({ year, month, day, solarHour, latitudeDeg = VALLEY_LATITUDE_DEG }) {
  if (!Number.isFinite(latitudeDeg) || latitudeDeg < -90 || latitudeDeg > 90) throw new RangeError('Latitude must be [-90,90]');
  if (!Number.isFinite(solarHour) || solarHour < 0 || solarHour >= 24) throw new RangeError('Solar hour must be [0,24)');
  const declinationDeg = declinationDegrees(year, month, day, solarHour);
  const hourAngleDeg = (solarHour - 12) * 15;
  const phi = latitudeDeg * TO_RAD;
  const delta = declinationDeg * TO_RAD;
  const hourAngle = hourAngleDeg * TO_RAD;
  const sineAltitude = Math.sin(phi) * Math.sin(delta)
    + Math.cos(phi) * Math.cos(delta) * Math.cos(hourAngle);
  const elevationDeg = Math.asin(clamp(sineAltitude, -1, 1)) * TO_DEG;
  const lighting = lightingFromElevation(elevationDeg);
  return {
    elevationDeg, declinationDeg, hourAngleDeg,
    phase: phaseFromElevation(elevationDeg),
    rising: hourAngleDeg < 0, // Morning vs evening is NOT determined by elevation alone.
    isDark: elevationDeg < -6, // Can drive follow-world UI; chosen stable twilight boundary.
    ...lighting,
  };
}

export function daylightHours(year, month, day, latitudeDeg = VALLEY_LATITUDE_DEG) {
  if (!Number.isFinite(latitudeDeg) || latitudeDeg < -90 || latitudeDeg > 90) throw new RangeError('Latitude must be [-90,90]');
  const phi = latitudeDeg * TO_RAD;
  const delta = declinationDegrees(year, month, day) * TO_RAD;
  const den = Math.cos(phi) * Math.cos(delta);
  const numerator = Math.sin(SUNRISE_ELEVATION_DEG * TO_RAD) - Math.sin(phi) * Math.sin(delta);
  // At the poles, daily rise/set may not exist; return a bounded duration.
  if (Math.abs(den) < 1e-12) return numerator < 0 ? 24 : 0;
  const cosH = numerator / den;
  if (cosH >= 1) return 0;
  if (cosH <= -1) return 24;
  return (2 * Math.acos(cosH) * TO_DEG) / 15;
}

export function standardTimeSolarHour(civilHour, offsetMinutes, standardOffsetMinutes) {
  if (![civilHour, offsetMinutes, standardOffsetMinutes].every(Number.isFinite)) throw new RangeError('Invalid clock or offset');
  if (civilHour < 0 || civilHour >= 24) throw new RangeError('Civil hour must be [0,24)');
  // Spring-forward: +1 wall hour and -60 timezone minutes cancel out.
  const adjustedHour = civilHour + (offsetMinutes - standardOffsetMinutes) / 60;
  return ((adjustedHour % 24) + 24) % 24;
}

export function solarStateFromDeviceClock(date = new Date(), latitudeDeg = VALLEY_LATITUDE_DEG) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new RangeError('Invalid device date');
  const year = date.getFullYear();
  // Use the larger Jan/July offset as the approximation to STANDARD offset
  // (works for the ordinary DST pattern; historical timezone changes can differ).
  const standardOffset = Math.max(new Date(year, 0, 1).getTimezoneOffset(), new Date(year, 6, 1).getTimezoneOffset());
  const civilHour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const rawSolarHour = civilHour + (date.getTimezoneOffset() - standardOffset) / 60;
  const dayShift = Math.floor(rawSolarHour / 24);
  const adjustedDate = new Date(year, date.getMonth(), date.getDate() + dayShift);
  return solarStateAt({
    year: adjustedDate.getFullYear(), month: adjustedDate.getMonth() + 1, day: adjustedDate.getDate(),
    solarHour: standardTimeSolarHour(civilHour, date.getTimezoneOffset(), standardOffset),
    latitudeDeg,
  });
}
