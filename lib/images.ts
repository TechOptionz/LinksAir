import manifest from './images.generated.json';

/**
 * Image assets are pulled off the legacy WordPress host, resized and re-encoded
 * to WebP into public/img/ by `npm run images`. Content still refers to images
 * by their original upstream path (e.g. '2024/09/Cooktop.png') — this module
 * maps that key to the local file plus its intrinsic size, which next/image
 * needs in order to reserve layout space and generate a srcset.
 */
export type Img = { src: string; width: number; height: number };

type Manifest = Record<string, { name: string; w: number; h: number }>;
const MAP = manifest as Manifest;

/**
 * Resolve an upstream uploads path to the locally optimised asset.
 *
 * Throws on an unknown path rather than falling back to a placeholder: every
 * page is statically generated, so a missing entry fails the build loudly
 * instead of silently shipping the wrong picture.
 */
export function img(upstreamPath: string): Img {
  const hit = MAP[upstreamPath];
  if (!hit) {
    throw new Error(
      `[images] no local asset for "${upstreamPath}". ` +
        `Add it to ASSETS in scripts/fetch-images.mjs and run \`npm run images\`.`
    );
  }
  return { src: `/img/${hit.name}`, width: hit.w, height: hit.h };
}

export const hasImg = (upstreamPath: string) => upstreamPath in MAP;
