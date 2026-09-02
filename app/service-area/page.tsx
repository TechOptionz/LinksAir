import type { Metadata } from 'next';
import Link from 'next/link';
import { sx } from '@/lib/sx';
import { areaCards } from '@/lib/content';

export const metadata: Metadata = { title: 'Service Areas' };

export default function ServiceAreaHub() {
  const cards = areaCards();
  return (
    <div>
      <section style={sx('background:#1279BF;color:#fff')}>
        <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
          <nav aria-label="Breadcrumb" style={sx('font-size:13.5px;color:#C9E2F5;margin-bottom:14px')}>
            <Link href="/" style={sx('color:#C9E2F5')}>Home</Link> / <span style={sx('color:#fff')}>Service areas</span>
          </nav>
          <h1 style={sx('font-size:clamp(30px,4.4vw,52px);font-weight:800;margin-bottom:14px')}>Service areas</h1>
          <p style={sx('font-size:clamp(16px,1.5vw,19px);color:#E3F0FA;max-width:640px')}>Expert electrical and air conditioning services across Brisbane, Gold Coast, Logan, Ipswich, Redlands and Moreton Bay. Local and flexible, with technicians on call 24/7.</p>
        </div>
      </section>
      <section style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px')}>
        {cards.map((a) => (
          <Link key={a.href} href={a.href} className="hv-card" style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:18px;padding:24px;color:#14263A;display:flex;flex-direction:column;gap:8px')}>
            <h2 style={sx('font-size:26px;font-weight:700')}>{a.label}</h2>
            <p style={sx('color:#5B6E82;font-size:15px;flex:1')}>{a.count} suburbs covered</p>
            <span style={sx('color:#1279BF;font-weight:700')}>View suburbs →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
