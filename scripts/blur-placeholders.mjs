/**
 * Adds blur placeholders to lib/images.generated.json and lib/images.docs.json
 * from the files already in public/img/, without re-fetching or re-encoding
 * anything. fetch-images.mjs and import-images.mjs produce them for new images;
 * this fills in the rest after a checkout or a preset change.
 *
 *   node scripts/blur-placeholders.mjs          # only entries missing `blur`
 *   node scripts/blur-placeholders.mjs --force  # rebuild every placeholder
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { withBlur } from './lib/blur.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'public', 'img');
const force = process.argv.includes('--force');

for (const file of ['images.generated.json', 'images.docs.json']) {
  const path = join(ROOT, 'lib', file);
  const manifest = JSON.parse(await readFile(path, 'utf8'));
  let added = 0;
  for (const [key, entry] of Object.entries(manifest)) {
    if (entry.blur && !force) continue;
    const next = await withBlur(entry, await readFile(join(IMG, entry.name)));
    if (next.blur) { manifest[key] = next; added++; }
  }
  await writeFile(path, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`${file}: ${added} placeholder(s) written`);
}
