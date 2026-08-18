// scripts/make-placeholders.mjs
// Emits flat-colour SVG placeholders — no runtime dependencies.
// Run:  npm run placeholders

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir       = resolve(__dirname, '..', 'src', 'assets');
const placeholdersDir = resolve(assetsDir, 'placeholders');

const BG    = '#C9CFD6';
const LABEL = '#5C6672';

function svg(w, h) {
  const label    = `${w} × ${h}`;
  const fontSize = Math.round(Math.min(w, h) * 0.045);
  const tracking = (fontSize * 0.08).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Placeholder ${label}">
  <rect width="100%" height="100%" fill="${BG}"/>
  <text x="50%" y="50%"
        font-family="ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
        font-size="${fontSize}"
        font-weight="500"
        letter-spacing="${tracking}"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="${LABEL}">${label}</text>
</svg>
`;
}

async function write(path, contents) {
  await writeFile(path, contents, 'utf8');
  console.log(`wrote ${path}`);
}

// Wipe stale artefacts from the previous sharp-based version.
for (const stale of [
  resolve(placeholdersDir, 'hero-16x9.png'),
  resolve(placeholdersDir, 'figure-4x3.png'),
  resolve(assetsDir, 'portrait.png'),
]) {
  await rm(stale, { force: true });
}

await mkdir(placeholdersDir, { recursive: true });

await write(resolve(placeholdersDir, 'hero-16x9.svg'),  svg(1600, 900));
await write(resolve(placeholdersDir, 'figure-4x3.svg'), svg(1200, 900));
await write(resolve(assetsDir,       'portrait.svg'),   svg(800, 1000));
