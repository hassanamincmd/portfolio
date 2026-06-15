import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const W = 800;
const H = 331;
const bg = { r: 12, g: 8, b: 20, alpha: 1 };

const mobileBuf = await sharp(path.join(root, 'safety-mockup-mobile.png'))
  .resize({ height: 296, withoutEnlargement: true })
  .toBuffer();
const webBuf = await sharp(path.join(root, 'safety-mockup-web.png'))
  .resize({ height: 268, withoutEnlargement: true })
  .toBuffer();

const m = await sharp(mobileBuf).metadata();
const w = await sharp(webBuf).metadata();
const gap = 20;
const total = m.width + w.width + gap;
const scale = total > W - 40 ? (W - 40) / total : 1;

const mobile = scale < 1
  ? await sharp(mobileBuf).resize({ width: Math.round(m.width * scale) }).toBuffer()
  : mobileBuf;
const web = scale < 1
  ? await sharp(webBuf).resize({ width: Math.round(w.width * scale) }).toBuffer()
  : webBuf;

const m2 = await sharp(mobile).metadata();
const w2 = await sharp(web).metadata();
const leftMobile = Math.round((W - m2.width - w2.width - gap) / 2);

const safetyHero = path.join(root, 'safety-hero.png');
await sharp({ create: { width: W, height: H, channels: 4, background: bg } })
  .composite([
    { input: mobile, left: leftMobile, top: Math.round((H - m2.height) / 2) },
    { input: web, left: leftMobile + m2.width + gap, top: Math.round((H - w2.height) / 2) },
  ])
  .png({ compressionLevel: 9 })
  .toFile(safetyHero);

await sharp(safetyHero)
  .resize({ width: 1200, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(path.join(root, 'safety-hero.webp'));

await sharp(path.join(root, 'meridian-hero.png'))
  .resize({ width: 1200, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(path.join(root, 'meridian-hero.webp'));

console.log('Built safety-hero.png/webp and meridian-hero.webp');
