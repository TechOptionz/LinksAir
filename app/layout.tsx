import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Barlow, Nunito_Sans } from 'next/font/google';
import Chrome from '@/components/Chrome';
import { img } from '@/lib/images';
import { Analytics } from '@vercel/analytics/next';

/*
 * Fonts are self-hosted through next/font: the files are downloaded at build
 * time, served from /_next/static (immutable), preloaded, and given a
 * size-adjusted fallback so text doesn't reflow when they arrive. This
 * replaces the render-blocking Google Fonts stylesheet (two extra origins on
 * the critical path). Only the weights the templates use are included.
 */
const heading = Barlow({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-heading',
});
const body = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: {
    default: 'Links Air & Electrical | Air Conditioning & Electricians Brisbane & Gold Coast',
    template: '%s | Links Air & Electrical',
  },
  description:
    'Licensed air conditioning installers and electricians serving Brisbane, Gold Coast, Logan and Ipswich. Split systems, ducted air, switchboards, EV chargers. 200+ five-star Google reviews. Call 1300 010 393.',
};

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'HVACBusiness',
  name: 'Links Air & Electrical',
  url: 'https://linksairelectrical.com.au/',
  telephone: '+611300010393',
  email: 'info@linksairelectrical.com.au',
  foundingDate: '2014',
  areaServed: ['Brisbane', 'Gold Coast', 'Logan', 'Ipswich', 'Redlands', 'Moreton Bay'],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '200' },
  openingHours: 'Mo-Su 00:00-24:00',
};

// Resolved here (server) so the client bundle doesn't carry the image manifests.
const LOGO = img('2024/09/logo.png');

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      </head>
      <body>
        <Chrome logo={LOGO}>{children}</Chrome>
        <Analytics />
      </body>
    </html>
  );
}
