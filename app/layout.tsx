import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Chrome from '@/components/Chrome';

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700;800&family=Nunito+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      </head>
      <body>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
