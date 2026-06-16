import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets');

const files = [
  'dashboard.png',
  'guest booking 1.png',
  'public profile.png',
  'analytics (2).png',
  'settings.png',
  'login (2).png',
];

for (const file of files) {
  const src = path.join(root, file);
  const trimmed = await sharp(src).trim({ threshold: 40 }).png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  await sharp(trimmed).toFile(src);
  await sharp(trimmed).webp({ quality: 88 }).toFile(src.replace(/\.png$/i, '.webp'));
  console.log(`${file} → ${meta.width}x${meta.height}`);
}
