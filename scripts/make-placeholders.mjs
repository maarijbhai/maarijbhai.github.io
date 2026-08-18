// scripts/make-placeholders.mjs
// Generates flat PNG placeholders in the design palette.
// Run:  node scripts/make-placeholders.mjs

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'src', 'assets', 'placeholders');

const RULE  = '#C9CFD6';
const MUTED = '#5C6672';
const PAPER = '#FBFBF9';

function svg(w, h, label) {
  const inset = Math.round(Math.min(w, h) * 0.04);
  const fontSize = Math.round(Math.min(w, h) * 0.045);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${RULE}"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}"
        fill="none" stroke="${PAPER}" stroke-width="1"/>
  <text x="${w / 2}" y="${h / 2}"
        font-family="IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace"
        font-size="${fontSize}"
        letter-spacing="${fontSize * 0.14}"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="${MUTED}">${label}</text>
</svg>`;
}

async function makePlaceholder(name, w, h, label) {
  const buf = Buffer.from(svg(w, h, label));
  const out = resolve(outDir, name);
  await sharp(buf).png({ compressionLevel: 9 }).toFile(out);
  console.log(`wrote ${out}`);
}

await mkdir(outDir, { recursive: true });
await makePlaceholder('hero-16x9.png',  1600, 900, 'PLACEHOLDER · 1600 × 900');
await makePlaceholder('figure-4x3.png', 1200, 900, 'PLACEHOLDER · 1200 × 900');
