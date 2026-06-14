import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const ASSETS = path.resolve('assets');
const MAX_WIDE = 1200;
const MAX_TALL = 1120;
const QUALITY = 82;

const WIDE = new Set([
  'meridian-hero.png',
  'safety-hero.png',
  'safety-hub-p2-mobile-guess-free.png',
  'ms-overview.png',
]);

async function optimize(file) {
  const input = path.join(ASSETS, file);
  const base = file.replace(/\.png$/i, '');
  const output = path.join(ASSETS, `${base}.webp`);
  const maxWidth = WIDE.has(file) ? MAX_WIDE : MAX_TALL;

  const meta = await sharp(input).metadata();
  const width = meta.width && meta.width > maxWidth ? maxWidth : meta.width;

  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(output);

  const inStat = await stat(input);
  const outStat = await stat(output);
  console.log(
    `${file} → ${base}.webp (${Math.round(inStat.size / 1024)}KB → ${Math.round(outStat.size / 1024)}KB, ${meta.width}×${meta.height} → max ${width}px)`
  );
}

const files = (await readdir(ASSETS)).filter((f) => f.endsWith('.png'));
const targets = files.filter((f) => f.startsWith('safety-') || f.startsWith('safety-hub-') || f.startsWith('ms-') || ['dashboard.png', 'guest booking 1.png', 'public profile.png', 'analytics (2).png', 'settings.png', 'login (2).png'].includes(f));

for (const file of targets) {
  await optimize(file);
}
