import sharp from 'sharp';

/** Photos at or above this width get a blur placeholder; logos/wordmarks don't
 *  (a blurred transparent logo on a white card just looks like a smudge). */
export const BLUR_MIN_WIDTH = 480;

/**
 * Tiny inline preview for next/image's placeholder="blur": a 16px-wide WebP
 * (~150-250 bytes base64) that paints in the image's slot before the real
 * bytes arrive, so lazy tiles and heroes never flash an empty grey box.
 */
export async function blurDataURL(buf) {
  const tiny = await sharp(buf).resize({ width: 16 }).webp({ quality: 40, alphaQuality: 40 }).toBuffer();
  return `data:image/webp;base64,${tiny.toString('base64')}`;
}

/** Manifest entry {name,w,h} -> same entry plus `blur` when the image qualifies. */
export async function withBlur(entry, buf) {
  if (entry.w < BLUR_MIN_WIDTH) return entry;
  return { ...entry, blur: await blurDataURL(buf) };
}
