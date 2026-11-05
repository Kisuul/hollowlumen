// Generate deterministic semantic CSS from the approved DTCG JSON; no runtime dependencies.
// Run: node tools/build-theme-css.mjs          (write generated CSS)
//      node tools/build-theme-css.mjs --check  (verify committed CSS is current)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const TOKENS = new URL('../docs/design/tokens/visual.tokens.json', import.meta.url);
const OUTPUT = new URL('../src/theme/theme-tokens.css', import.meta.url);

function lookup(data, path) {
  const node = path.split('.').reduce((value, key) => value?.[key], data);
  if (!node || !Object.hasOwn(node, '$value')) throw new Error('Missing design token: ' + path);
  return node;
}
function resolveToken(data, path, seen = new Set()) {
  if (seen.has(path)) throw new Error('Circular token alias: ' + path);
  const node = lookup(data, path);
  const value = node.$value;
  if (typeof value === 'string' && /^\{[^{}]+\}$/.test(value)) {
    const next = new Set(seen); next.add(path);
    return resolveToken(data, value.slice(1, -1), next);
  }
  return value;
}
function cssValue(value) {
  if (value?.colorSpace === 'srgb' && /^#[0-9a-f]{6}$/i.test(value.hex)) return value.hex;
  if (value && typeof value.value === 'number' && value.unit === 'px') return value.value + 'px';
  throw new Error('Unexpected token value: ' + JSON.stringify(value));
}
export function generateThemeCss(data) {
  const day = Object.keys(data.theme?.day ?? {});
  const night = Object.keys(data.theme?.night ?? {});
  if (!day.length || day.join('|') !== night.join('|')) throw new Error('Day/night semantic roles must match');
  const emit = (mode) => day.map((name) => '  --hl-' + name + ': ' + cssValue(resolveToken(data, 'theme.' + mode + '.' + name)) + ';');
  const sizes = Object.entries(data.spacing).filter(([key]) => !key.startsWith('$')).map(([key]) =>
    '  --hl-space-' + key + ': ' + cssValue(resolveToken(data, 'spacing.' + key)) + ';');
  const radii = Object.entries(data.radius).filter(([key]) => !key.startsWith('$')).map(([key]) =>
    '  --hl-radius-' + key + ': ' + cssValue(resolveToken(data, 'radius.' + key)) + ';');
  return [
    '/* GENERATED from docs/design/tokens/visual.tokens.json — do not edit by hand. */',
    ':root,',
    ':root[data-ui-theme="day"] {',
    ...emit('day'), ...sizes, ...radii,
    '}',
    ':root[data-ui-theme="night"] {',
    ...emit('night'),
    '}',
    '',
  ].join('\n');
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const source = JSON.parse(readFileSync(TOKENS, 'utf8'));
  const output = generateThemeCss(source);
  if (process.argv.includes('--check')) {
    if (readFileSync(OUTPUT, 'utf8') !== output) {
      console.error('Generated theme CSS is outdated; run node tools/build-theme-css.mjs');
      process.exitCode = 1;
    } else console.log('PASS: generated theme CSS matches design tokens');
  } else {
    writeFileSync(OUTPUT, output);
    console.log('Wrote ' + fileURLToPath(OUTPUT));
  }
}
