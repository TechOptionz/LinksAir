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

/** Placeholder used if content references a path the pipeline hasn't built. */
const MISSING: Img = { src: '/img/logo.webp', width: 183, height: 68 };

/** Resolve an upstream uploads path to the locally optimised asset. */
export function img(upstreamPath: string): Img {
  const hit = MAP[upstreamPath];
  if (!hit) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[images] no local asset for "${upstreamPath}" — run \`npm run images\``);
    }
    return MISSING;
  }
  return { src: `/img/${hit.name}`, width: hit.w, height: hit.h };
}

export const hasImg = (upstreamPath: string) => upstreamPath in MAP;
