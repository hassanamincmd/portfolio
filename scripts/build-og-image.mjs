import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const src = path.join(root, 'about-hassan.jpeg');
const outJpg = path.join(root, 'og-image.jpg');
const outWebp = path.join(root, 'og-image.webp');
const size = 1200;

const meta = await sharp(src).metadata();
await sharp(src)
  .grayscale()
  .resize(size, size, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(outJpg);
await sharp(src)
  .grayscale()
  .resize(size, size, { fit: 'cover', position: 'attention' })
  .webp({ quality: 85 })
  .toFile(outWebp);

const outMeta = await sharp(outJpg).metadata();
console.log(`Built og-image from ${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}`);
