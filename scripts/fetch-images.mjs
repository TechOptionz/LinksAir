/**
 * One-off asset pipeline: pulls every image the site references off the old
 * WordPress host, resizes it to the size it is actually displayed at and
 * re-encodes to WebP under public/img/.
 *
 * Output filenames carry a content hash so public/img can be served immutable.
 * Re-running rebuilds everything from scratch (~40 images, under a minute).
 */
import { mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'img');
const UP = 'https://linksairelectrical.com.au/wp-content/uploads/';

/* Presets keyed to how each image is actually rendered.
   width is the largest CSS px the slot ever reaches, x2 for retina. */
const PRESET = {
  hero:    { w: 1400, q: 76 },  // ContentArticle / pillar cards (16:9, up to ~700px wide)
  card:    { w: 900,  q: 76 },  // pillar cards
  gallery: { w: 480,  q: 74 },  // 1:1 tiles, ~240px max on screen
  logo:    { w: 320,  q: 82 },  // brand row, 40px tall slot
  mark:    { w: 400,  q: 88 },  // header/footer wordmark (kept lossless-ish)
};

/** every image the site references, with the preset it should be built at */
const ASSETS = [
  ['2024/09/logo.png', 'mark'],

  // PILLARS + IMGS (content hero images)
  ['2024/09/split_innerimg01.jpg', 'hero'],
  ['2024/09/Outdoor-9.1kW-scaled.jpg', 'hero'],
  ['2024/09/20211027_111742.jpg', 'hero'],
  ['2024/09/20220621_142833.jpg', 'hero'],
  ['2025/04/DaikinDuctedSystem_14kw.webp', 'hero'],
  // Same file also lives under 2024/09 and is referenced by GALLERY; identical
  // bytes hash to the same output name, so this just adds a second manifest key.
  ['2024/09/DaikinDuctedSystem_14kw.webp', 'hero'],
  ['2025/04/Ducted-aircon-zoning.jpg', 'hero'],
  ['2024/09/Samsung-duct-S2_-ducted-outdoor-unit-AC120TXAPKG_SA_800x.webp', 'hero'],
  ['2024/09/6-outlets-900x442-1.jpg', 'hero'],
  ['2024/09/MHI-10kW-Open-scaled.jpg', 'hero'],
  ['2024/09/Ducted-outdoor.jpg', 'hero'],
  ['2024/09/Tripple-installation.jpg', 'hero'],
  ['2024/09/ActronAir_Stacked-scaled.jpg', 'hero'],
  ['2024/09/Multihead-8Kw-scaled.jpg', 'hero'],
  ['2024/09/builder_innerimg001.jpg', 'hero'],
  ['2024/10/residential_innerimg1.jpg', 'hero'],
  ['2024/10/data_pointsinnerimg1.jpg', 'hero'],
  ['2024/09/LED_lights.jpeg', 'hero'],
  ['2024/09/kitchen-lighting-led-under-cabinet-light-bar.jpg', 'hero'],
  ['2024/09/NICEIC.jpg', 'hero'],
  ['2024/09/Fan-Pic-04.jpg.webp', 'hero'],
  ['2024/09/20210628_113722-scaled.jpg', 'hero'],
  ['2024/09/Cooktop.png', 'hero'],
  ['2024/09/EV-Charger.png', 'hero'],
  ['2024/09/download.jpg', 'hero'],
  ['2024/09/Inspirasjon-bad-vatrom.jpg', 'hero'],
  ['2024/09/20210311_141247_HDR-scaled.jpg', 'hero'],

  // GALLERY-only extras (the rest of the gallery reuses hero sources above)
  ['2024/09/gallery_img2.jpg', 'gallery'],
  ['2024/09/AirTouch5.png', 'gallery'],
  ['2024/09/Screenshot_20250420_141657_Photos2.jpg', 'gallery'],
  ['2024/09/15.jpg', 'gallery'],
  ['2024/09/20210804_185147-scaled.jpg', 'gallery'],

  // BRANDS
  ['2025/05/logo-1.webp', 'logo'],
  ['2025/05/logo-2.webp', 'logo'],
  ['2025/05/logo-3.webp', 'logo'],
  ['2025/05/logo-4.webp', 'logo'],
  ['2025/05/logo-5.png', 'logo'],
  ['2025/05/logo-6.png', 'logo'],
  ['2025/05/logo-7.png', 'logo'],
  ['2025/05/logo-8.jpg', 'logo'],
];

/** upstream path -> flat local stem, e.g. 2024/09/Cooktop.png -> cooktop */
export const localStem = (p) =>
  p.split('/').pop().replace(/\.[a-z0-9.]+$/i, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** Assets are served with `immutable`, so the filename must change when the
 *  bytes change - hence the content hash. */
const hash8 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);

async function grab(path) {
  const res = await fetch(UP + path);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Several of the brand "logos" on the old site are 30-37 frame animated WebPs
 * that fade in, so frame 0 is blank. Pick the frame that actually carries the
 * artwork (highest entropy) and return it as a still.
 */
async function flatten(src) {
  const meta = await sharp(src, { pages: -1 }).metadata();
  if (!meta.pages || meta.pages < 2) return { buf: src, frames: 1, picked: 0 };

  let best = { entropy: -1, page: 0 };
  for (let page = 0; page < meta.pages; page++) {
    const frame = await sharp(src, { page }).png().toBuffer();
    const { entropy } = await sharp(frame).stats();
    if (entropy > best.entropy) best = { entropy, page };
  }
  return {
    buf: await sharp(src, { page: best.page }).png().toBuffer(),
    frames: meta.pages,
    picked: best.page,
  };
}

async function run() {
  await mkdir(OUT, { recursive: true });
  // Filenames are content-hashed, so stale ones would linger forever - clear first.
  for (const f of await readdir(OUT)) await rm(join(OUT, f));

  const manifest = {};
  let before = 0, after = 0, built = 0;

  for (const [path, presetName] of ASSETS) {
    const preset = PRESET[presetName];

    const src = await grab(path);
    const still = await flatten(src);
    const out = await sharp(still.buf)
      .rotate()                                  // honour EXIF orientation
      .resize({ width: preset.w, withoutEnlargement: true })
      .webp({ quality: preset.q, effort: 6, alphaQuality: 90 })
      .toBuffer();
    const meta = await sharp(out).metadata();
    const name = `${localStem(path)}.${hash8(out)}.webp`;
    await writeFile(join(OUT, name), out);

    manifest[path] = { name, w: meta.width, h: meta.height };
    before += src.length;
    after += out.length;
    built++;
    const pct = ((1 - out.length / src.length) * 100).toFixed(0);
    console.log(
      `${String(Math.round(src.length / 1024)).padStart(5)}KB -> ` +
      `${String(Math.round(out.length / 1024)).padStart(4)}KB  (-${pct.padStart(2)}%)  ` +
      `${meta.width}x${meta.height}  ${name}` +
      (still.frames > 1 ? `  [de-animated ${still.frames} frames -> frame ${still.picked}]` : '')
    );
  }

  await writeFile(
    join(ROOT, 'lib', 'images.generated.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );
  console.log(`
built ${built} assets: ${(before / 1048576).toFixed(2)}MB downloaded -> ${(after / 1048576).toFixed(2)}MB written`);
}

run().catch((e) => { console.error(e); process.exit(1); });
