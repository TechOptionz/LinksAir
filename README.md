# Links Air & Electrical — Next.js site

Next.js (App Router, TypeScript) port of the Links Air & Electrical site. A 1:1
reproduction of the original template (`Links Air Electrical.dc.html`) with the
complete content from `site-content.json` (49 pages + 37 blog posts) — same
design, colors, fonts (Barlow / Nunito Sans), layouts and interactive behavior.

## Commands

```bash
npm install     # once
npm run dev     # development server on http://localhost:3000
npm run build   # production build (pre-renders all 90 pages statically)
npm start       # serve the production build
npm run images  # re-fetch & re-optimise source images into public/img (rarely needed)
npm run images:blur  # (re)build blur placeholders from the files already in public/img
```

`next dev` and `next build` share `.next`, so a build started while the dev server is
running gets corrupted (missing chunk / `.nft.json` errors). To verify a build alongside
the dev server: `NEXT_DIST_DIR=.next-build npm run build`.

## Structure

- `data/site-content.json` — all page & blog content, shipped verbatim
- `lib/site.ts` — client-safe constants: feature flags, nav tree, footer links (the only
  content-ish module the header/footer/chrome client components may import)
- `lib/content.ts` — data layer: page/area/blog models (exact port of the original template logic);
  re-exports `lib/site.ts`
- `lib/sx.ts` — converts the original inline CSS strings into React style objects
- `app/` — routes:
  - `/` home, `/[slug]` all service/content/area pages (incl. `privacy-policy`, `reviews`, `terms-conditions`), `/blog/[slug]` posts,
    plus `contact-us`, `faq`, `our-blog`, `service-area`, `thank-you`, 404
- `components/` — header w/ dropdown + mobile drawer nav, footer, quote slide-in drawer,
  mobile sticky call bar, chatbot assistant, lead forms
- `app/globals.css` — base styles copied verbatim, hover styles (from the template's
  `style-hover` attributes) and responsive rules (desktop ≥1024px, wide ≥1200px)

## Notes

- Routing uses real URLs (`/about-us`) instead of the original's hash routes (`#/about-us`); all internal links updated accordingly.
- Images are served locally from `public/img/` through `next/image` — they are **not** hot-linked
  from the old WordPress host any more (that host added ~0.8s TTFB to every image and served
  full-size camera originals). `scripts/fetch-images.mjs` (`npm run images`) downloads each source
  once, resizes it to the size it is actually displayed at, de-animates the animated-WebP brand
  logos and re-encodes everything to WebP. `lib/images.generated.json` records each local filename
  and its intrinsic dimensions; `lib/images.ts` resolves an original uploads path to that asset.
  Content still refers to images by their original path (e.g. `2024/09/Cooktop.png`), so adding an
  image means adding it to `ASSETS` in the script and re-running `npm run images`. An unknown
  path makes `img()` throw, which fails the build rather than silently shipping a placeholder.
- Output filenames are content-hashed (`cooktop.97ed9612.webp`) and `/img/*` is served
  `max-age=31536000, immutable` via `headers()` in `next.config.mjs`. This matters: files under
  `public/` default to `max-age=0, must-revalidate`, and the image optimizer derives each
  derivative's `Cache-Control` from its source — without the header rule every optimized image
  was revalidated by the browser on every single page view.
- Every photo entry in the manifests also carries `blur`, a 16px-wide inline WebP (~180 bytes)
  that `img()` returns as `blurDataURL` and `blur(img)` spreads onto `<Image>` as
  `placeholder="blur"`, so heroes and lazy gallery tiles paint a preview instantly instead of a
  grey box. `scripts/lib/blur.mjs` builds them inside both image scripts; `npm run images:blur`
  back-fills them for files already on disk. Logos (< 480px wide) are skipped on purpose.
- Fonts (Barlow, Nunito Sans) are self-hosted via `next/font/google` in `app/layout.tsx`: files
  are fetched at build time, served immutable from `/_next/static`, preloaded, and paired with a
  size-adjusted fallback (no layout shift). Styles reference them as `var(--font-heading)` /
  `var(--font-body)`, never by family name.
- Header, Footer, Chrome and Chatbot are client components: whatever they import ships in every
  page's JavaScript. They must only import from `lib/site.ts` (and `lib/sx.ts`), never
  `lib/content.ts`, which would drag the 1.4MB content JSON into the layout chunk.
- Form submissions currently log to the console and redirect to `/thank-you`
  (identical to the original template). Wire them to an email/CRM endpoint before go-live.
- SEO plumbing: `app/robots.ts` and `app/sitemap.ts` serve `/robots.txt` and `/sitemap.xml`
  (every content page and blog post; `/thank-you` is excluded and disallowed). `app/layout.tsx`
  sets `metadataBase`, a self-referencing canonical on every page, Open Graph / Twitter card tags
  and a default share image. Absolute URLs come from `lib/url.ts`: `NEXT_PUBLIC_SITE_URL` if set,
  otherwise Vercel's production URL (which becomes the custom domain automatically once one is
  attached to the project), otherwise `http://localhost:3000`. The share image is built by
  `node scripts/og-image.mjs` (1200x630 JPEG from a branded service photo, content-hashed into
  `public/img/`, recorded in `lib/og-image.json`).
- `@vercel/speed-insights` is mounted next to `@vercel/analytics` in the root layout; enable
  Speed Insights on the Vercel project for real-user Core Web Vitals.

## Service-page copy from the Word documents

The long-form service pages (35 existing slugs + `security-and-ev`) come from
the client's Word documents, not the old WordPress site. To re-import after the
documents change:

```bash
python scripts/import-docx.py <docx_dir> --out-png <tmp_dir>   # docx -> blocks in data/site-content.json
node   scripts/import-images.mjs <tmp_dir>                      # PNGs -> public/img + lib/images.docs.json
```

`import-docx.py` maps each file name to a slug (see `MAP`), turns the bold
headings / "Q:" lines / bullet and numbered prefixes / Word tables into the
block model (`p`, `h`, `ul`, `ol`, `faq`, `table`, `img`) and strips the writer's
working notes (internal-linking tables, CTA labels, image prompts). Each page
gets `hero` (the first image, keyed `docs/<slug>-1.png`), an in-article `img`
block for the second image, and `intro` when the document has a short
strap-line. `--dry-run --outline` prints the detected structure without writing.
