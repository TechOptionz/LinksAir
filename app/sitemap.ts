import type { MetadataRoute } from 'next';
import { contentSlugs, posts } from '@/lib/content';
import { SITE_URL } from '@/lib/url';

/** Routes with their own page.tsx. /thank-you is a post-submit page and is left out. */
const STATIC_ROUTES = ['', '/contact-us', '/faq', '/our-blog', '/service-area'];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;

  const fixed = STATIC_ROUTES.map((path) => ({ url: url(path), priority: path === '' ? 1 : 0.7 }));
  const content = contentSlugs().map((slug) => ({ url: url(`/${slug}`), priority: 0.8 }));
  const blog = posts.map((p) => ({
    url: url(`/blog/${p.slug}`),
    ...(p.date && !Number.isNaN(Date.parse(p.date)) ? { lastModified: new Date(p.date) } : {}),
    priority: 0.5,
  }));

  return [...fixed, ...content, ...blog];
}
