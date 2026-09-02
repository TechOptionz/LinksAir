import { fileURLToPath } from 'url';
import { dirname } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  images: {
    // Sources in public/img are already WebP; AVIF buys another ~20% on photos.
    formats: ['image/avif', 'image/webp'],
    // Widths actually used by the layout (gallery tiles, brand logos, cards, heroes).
    deviceSizes: [640, 750, 828, 1080, 1200, 1400],
    imageSizes: [80, 160, 240, 320, 480],
    // Optimised derivatives are immutable - cache them hard at the edge.
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
