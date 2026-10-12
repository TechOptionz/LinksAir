/**
 * Build the default Open Graph / Twitter card image (1200x630 JPEG) from one
 * of the branded service photos in public/img, and record it in
 * lib/og-image.json for app/layout.tsx. Content-hashed like the other assets
 * so /img/* can stay `immutable`.
 *
 *   node scripts/og-image.mjs
 */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_KEY = 'docs/ac-services-1.png';
const W = 1200, H = 630;

const docs = JSON.parse(readFileSync('lib/images.docs.json', 'utf8'));
const src = docs[SOURCE_KEY];
if (!src) throw new Error(`${SOURCE_KEY} not in lib/images.docs.json`);

const buf = await sharp(join('public/img', src.name))
  .resize(W, H, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();

const hash = createHash('md5').update(buf).digest('hex').slice(0, 8);
const name = `og-image.${hash}.jpg`;
for (const f of readdirSync('public/img')) if (/^og-image\.[0-9a-f]{8}\.jpg$/.test(f) && f !== name) unlinkSync(join('public/img', f));
writeFileSync(join('public/img', name), buf);
writeFileSync('lib/og-image.json', JSON.stringify({ name, w: W, h: H }, null, 2) + '\n');
console.log(`wrote public/img/${name} (${Math.round(buf.length / 1024)} KB)`);
