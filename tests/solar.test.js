import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VALLEY_LATITUDE_DEG, isLeapYear, dayOfYear, declinationDegrees, phaseFromElevation,
  lightingFromElevation, solarStateAt, daylightHours, standardTimeSolarHour,
  solarStateFromDeviceClock,
} from '../src/solar/solar.js';

const at = (year, month, day, solarHour, latitudeDeg = VALLEY_LATITUDE_DEG) =>
  solarStateAt({ year, month, day, solarHour, latitudeDeg });
const within = (actual, expected, tolerance) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, 'Expected '+actual+' within '+tolerance+' of '+expected);

test('calendar input validates dates, including leap day and century rules', () => {
  assert.equal(isLeapYear(2000), true);
  assert.equal(isLeapYear(2100), false);
  assert.equal(isLeapYear(2028), true);
  assert.equal(dayOfYear(2028, 2, 29), 60);
  assert.equal(dayOfYear(2028, 3, 1), 61);
  assert.throws(() => dayOfYear(2027, 2, 29), RangeError);
  assert.throws(() => solarStateAt({year:2026,month:6,day:21,solarHour:24}), RangeError);
  assert.throws(() => solarStateAt({year:2026,month:6,day:21,solarHour:12,latitudeDeg:91}), RangeError);
});

test('equinox sun at 45N is about 45 degrees high at local noon', () => {
  within(at(2026, 3, 20, 12).elevationDeg, 45, 1.5);
  assert.ok(at(2026, 3, 20, 0).elevationDeg < -40);
  assert.ok(Math.abs(declinationDegrees(2026, 3, 20)) < 1.5);
});

test('seasons alter declination and day length, not game economy', () => {
  assert.ok(declinationDegrees(2026, 6, 21) > 22.5);
  assert.ok(declinationDegrees(2026, 12, 21) < -22.5);
  const summer = daylightHours(2026, 6, 21), winter = daylightHours(2026, 12, 21);
  assert.ok(summer > 15 && summer < 16, 'summer daylight '+summer);
  assert.ok(winter > 8 && winter < 10, 'winter daylight '+winter);
  within(daylightHours(2026, 3, 20), 12, 0.4);
});

test('polar conditions are bounded, no NaN sunrise or false sunrise claim', () => {
  assert.equal(daylightHours(2026, 6, 21, 90), 24);
  assert.equal(daylightHours(2026, 12, 21, 90), 0);
  assert.equal(daylightHours(2026, 6, 21, -90), 0);
});

test('dawn and dusk have comparable elevation but opposite rising direction', () => {
  const dawn = at(2026, 6, 21, 6), dusk = at(2026, 6, 21, 18);
  assert.equal(dawn.rising, true);
  assert.equal(dusk.rising, false);
  within(dawn.elevationDeg, dusk.elevationDeg, 0.1);
  assert.equal(at(2026,6,21,12).rising, false);
});

test('defined twilight thresholds are contiguous and explicit', () => {
  assert.equal(phaseFromElevation(-19), 'night');
  assert.equal(phaseFromElevation(-15), 'astronomical-twilight');
  assert.equal(phaseFromElevation(-9), 'nautical-twilight');
  assert.equal(phaseFromElevation(-3), 'civil-twilight');
  assert.equal(phaseFromElevation(0), 'low-sun');
  assert.equal(phaseFromElevation(10), 'day');
});

test('lighting weights stay bounded and smoothly transition', () => {
  for (let alt=-90;alt<=90;alt+=0.5) {
    const light=lightingFromElevation(alt);
    for(const value of Object.values(light))assert.ok(value>=0&&value<=1);
  }
  assert.equal(lightingFromElevation(-30).stars, 1);
  assert.equal(lightingFromElevation(15).stars, 0);
  assert.equal(lightingFromElevation(15).lanterns, 0);
  assert.equal(lightingFromElevation(-30).lanterns, 1);
  assert.ok(lightingFromElevation(-12).ambient < lightingFromElevation(0).ambient);
});

test('DST wall-clock shifts can be normalized to continuous fictional solar time', () => {
  within(standardTimeSolarHour(1+59/60,480,480), 1+59/60, 0.00001);
  within(standardTimeSolarHour(3,420,480), 2, 0.00001);
  within(standardTimeSolarHour(1+59/60,420,480), 59/60, 0.00001);
  within(standardTimeSolarHour(1,480,480), 1, 0.00001);
  assert.throws(() => standardTimeSolarHour(24,480,480), RangeError);
});

test('device clock adapter is finite and does not mutate its input', () => {
  const date=new Date(2026,5,21,19,30,20);
  const before=date.getTime();
  const state=solarStateFromDeviceClock(date);
  assert.ok(Number.isFinite(state.elevationDeg));
  assert.ok(state.ambient>=0&&state.ambient<=1);
  assert.equal(date.getTime(), before);
  assert.throws(() => solarStateFromDeviceClock(new Date(NaN)), RangeError);
});

test('solar scene has no game-specific fields or reward side effects', () => {
  const solar=at(2026,12,21,21);
  assert.deepEqual(Object.keys(solar).sort(),[
    'ambient','declinationDeg','elevationDeg','hourAngleDeg','isDark',
    'lanterns','phase','rising','stars',
  ].sort());
  assert.equal(typeof solar.isDark,'boolean');
});
