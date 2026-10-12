/**
 * Origin used for every absolute URL the site emits: the canonical link,
 * Open Graph URLs, robots.txt and sitemap.xml.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL, when set in the Vercel project (or .env.local).
 *  2. VERCEL_PROJECT_PRODUCTION_URL, which Vercel sets on every build. It is
 *     the *.vercel.app hostname today and switches to the custom domain by
 *     itself once one is attached to the project, so canonicals follow the
 *     domain without a code change. Preview builds also get the production
 *     URL here, so previews canonicalise to production rather than to
 *     themselves.
 *  3. localhost for `next dev` / local builds.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
