import manifest from './images.generated.json';
import docs from './images.docs.json';

/**
 * Image assets are pulled off the legacy WordPress host, resized and re-encoded
 * to WebP into public/img/ by `npm run images`. Content still refers to images
 * by their original upstream path (e.g. '2024/09/Cooktop.png') — this module
 * maps that key to the local file plus its intrinsic size, which next/image
 * needs in order to reserve layout space and generate a srcset.
 *
 * Images supplied with the service-page copy (scripts/import-images.mjs) live
 * in a second manifest under 'docs/<slug>-N.png' keys.
 *
 * Photos also carry a tiny inline blur preview (`blurDataURL`, built by
 * scripts/lib/blur.mjs) so their slot paints immediately while the real
 * bytes load; logos don't have one.
 */
export type Img = { src: string; width: number; height: number; blurDataURL?: string };

type Manifest = Record<string, { name: string; w: number; h: number; blur?: string }>;
const MAP: Manifest = { ...(manifest as Manifest), ...(docs as Manifest) };

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
        `Add it to ASSETS in scripts/fetch-images.mjs and run \`npm run images\`, ` +
        `or re-run scripts/import-images.mjs for docs/ keys.`
    );
  }
  return {
    src: `/img/${hit.name}`,
    width: hit.w,
    height: hit.h,
    ...(hit.blur ? { blurDataURL: hit.blur } : {}),
  };
}

/** Spread onto <Image> to show the blur preview when the asset has one. */
export const blur = (i: Img) => (i.blurDataURL ? { placeholder: 'blur' as const, blurDataURL: i.blurDataURL } : {});

export const hasImg = (upstreamPath: string) => upstreamPath in MAP;
