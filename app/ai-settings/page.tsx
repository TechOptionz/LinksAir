import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { sx } from '@/lib/sx';
import { AiSettingsEditor } from '@/components/AiSettingsEditor';

// Private page for the business owner: the knowledge base (prices, services, terms) and the reply rules
// the AI email assistant follows. Reached only through a link that carries the access key (?key=...).
export const metadata: Metadata = {
  title: 'AI reply assistant',
  robots: { index: false, follow: false },
};

export default function AiSettingsPage() {
  return (
    <div>
      <section style={sx('background:#1279BF;color:#fff')}>
        <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
          <nav aria-label="Breadcrumb" style={sx('font-size:13.5px;color:#fff;margin-bottom:14px')}>
            <Link href="/" style={sx('color:#fff')}>Home</Link> / <span style={sx('color:#fff')}>Owner tools</span>
          </nav>
          <h1 style={sx('font-size:clamp(30px,4.4vw,52px);font-weight:800;margin-bottom:14px')}>AI reply assistant</h1>
          <p style={sx('font-size:clamp(16px,1.5vw,19px);color:#fff;max-width:720px')}>
            Every enquiry email gets a draft reply built from the sections below. Edit a section, save it, and the next email uses it. Nothing is sent without someone checking the draft.
          </p>
        </div>
      </section>
      <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
        <Suspense fallback={<p style={sx('color:#5F7187')}>Loading…</p>}>
          <AiSettingsEditor />
        </Suspense>
      </div>
    </div>
  );
}
