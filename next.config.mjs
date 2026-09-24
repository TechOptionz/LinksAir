import { fileURLToPath } from 'url';
import { dirname } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  // `next dev` and `next build` both write to .next; running a build while the
  // dev server is up corrupts it. NEXT_DIST_DIR=.next-build lets a verification
  // build run alongside the dev server. Unset (Vercel, CI) it is the default.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  images: {
    // Sources in public/img are already WebP; AVIF halves them again at the
    // quality Next uses (q=47, effort=3) for ~1.5x the encode cost.
    formats: ['image/avif', 'image/webp'],
    // Widths actually used by the layout (gallery tiles, brand logos, cards, heroes).
    deviceSizes: [640, 750, 828, 1080, 1200, 1400],
    imageSizes: [80, 160, 240, 320, 480],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        /*
         * Files under public/ are served `max-age=0, must-revalidate` by
         * default, and the image optimizer derives each derivative's
         * Cache-Control from its source - so without this every optimized
         * image was revalidated on every page view. Filenames are
         * content-hashed by scripts/fetch-images.mjs, so this is safe.
         */
        source: '/img/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
