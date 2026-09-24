/**
 * Optimise the images that ship inside the service-page Word documents.
 *
 *   python scripts/import-docx.py <docx_dir> --out-png <png_dir>
 *   node   scripts/import-images.mjs <png_dir>
 *
 * Each PNG is resized to the hero preset (1400px wide, same as
 * fetch-images.mjs), re-encoded to WebP under public/img/ with a content hash
 * in the filename, and recorded in lib/images.docs.json under the key the
 * content refers to it by: 'docs/<slug>-1.png' (hero photo) or
 * 'docs/<slug>-2.png' (in-article explainer graphic). lib/images.ts merges
 * that manifest with the one fetch-images.mjs writes.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { withBlur } from './lib/blur.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'img');
const MANIFEST = join(ROOT, 'lib', 'images.docs.json');
const PRESET = { w: 1400, q: 76 };

const hash8 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);

async function run() {
  const dir = process.argv[2];
  if (!dir) throw new Error('usage: node scripts/import-images.mjs <png_dir>');
  await mkdir(OUT, { recursive: true });

  let manifest = {};
  try { manifest = JSON.parse(await readFile(MANIFEST, 'utf8')); } catch { /* first run */ }

  const files = (await readdir(resolve(dir))).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  let before = 0, after = 0;
  for (const file of files) {
    const src = await readFile(join(resolve(dir), file));
    const out = await sharp(src)
      .rotate()
      .resize({ width: PRESET.w, withoutEnlargement: true })
      .webp({ quality: PRESET.q, effort: 6 })
      .toBuffer();
    const meta = await sharp(out).metadata();
    const key = 'docs/' + file;
    const name = `${basename(file, extname(file)).toLowerCase()}.${hash8(out)}.webp`;
    const prev = manifest[key];
    if (prev && prev.name !== name) await rm(join(OUT, prev.name), { force: true });
    await writeFile(join(OUT, name), out);
    manifest[key] = await withBlur({ name, w: meta.width, h: meta.height }, out);
    before += src.length; after += out.length;
    console.log(`${String(Math.round(src.length / 1024)).padStart(5)}KB -> ${String(Math.round(out.length / 1024)).padStart(4)}KB  ${meta.width}x${meta.height}  ${name}`);
  }
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`\n${files.length} images: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);
}

run().catch((e) => { console.error(e); process.exit(1); });
