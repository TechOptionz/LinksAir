'use client';

import Link from 'next/link';
import { sx } from '@/lib/sx';
import { useLeadSubmit } from './QuoteContext';

const SERVICE_OPTIONS = [
  'Split system air conditioning',
  'Ducted air conditioning',
  'Air conditioning service or repair',
  'Electrical work',
  'Switchboard upgrade',
  'EV charger',
  'Security cameras / CCTV',
  'New build / construction',
  'Something else',
];

/* Home hero form */
export function HeroQuoteForm() {
  const submit = useLeadSubmit();
  return (
    <form onSubmit={submit} style={sx('background:#fff;color:#14263A;border-radius:18px;padding:26px;box-shadow:0 24px 60px rgba(8,30,55,.28);display:flex;flex-direction:column;gap:12px')} className="lae-hero-form">
      <div>
        <h2 style={sx('font-size:24px;font-weight:700')}>Request a free quote</h2>
        <p style={sx('color:#5B6E82;font-size:14.5px')}>We reply within one business hour, 7 days.</p>
      </div>
      <div style={sx('display:grid;grid-template-columns:1fr 1fr;gap:10px')}>
        <input name="name" required placeholder="Your name" aria-label="Your name" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;min-width:0')} />
        <input name="phone" required type="tel" placeholder="Phone" aria-label="Phone" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;min-width:0')} />
      </div>
      <input name="suburb" placeholder="Suburb" aria-label="Suburb" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <select name="service" aria-label="Service" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;background:#fff;color:#14263A')}>
        {SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
      </select>
      <textarea name="message" rows={2} placeholder="Tell us about the job (optional)" aria-label="Message" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;resize:vertical')} />
      <button type="submit" className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:15px;font-family:var(--font-heading);font-weight:700;font-size:17px;cursor:pointer')}>Send my enquiry</button>
      <p style={sx('font-size:12.5px;color:#7A8A9C;text-align:center')}>No obligation. We never share your details.</p>
    </form>
  );
}

/* Content page sidebar form */
export function SidebarQuoteForm() {
  const submit = useLeadSubmit();
  return (
    <form onSubmit={submit} style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:10px;box-shadow:0 12px 32px rgba(14,42,71,.08)')}>
      <h2 style={sx('font-size:22px;font-weight:700')}>Get a free quote</h2>
      <p style={sx('color:#5B6E82;font-size:14px;margin-bottom:4px')}>Upfront pricing before we begin. No surprises.</p>
      <input name="name" required placeholder="Your name" aria-label="Your name" style={sx('padding:12px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <input name="phone" required type="tel" placeholder="Phone" aria-label="Phone" style={sx('padding:12px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <input name="suburb" placeholder="Suburb" aria-label="Suburb" style={sx('padding:12px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <textarea name="message" rows={3} placeholder="What do you need done?" aria-label="Message" style={sx('padding:12px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;resize:vertical')} />
      <button type="submit" className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:14px;font-family:var(--font-heading);font-weight:700;font-size:16.5px;cursor:pointer')}>Send enquiry</button>
    </form>
  );
}

/* Area page sidebar form */
export function AreaQuoteForm({ areaTitle }: { areaTitle: string }) {
  const submit = useLeadSubmit();
  return (
    <form onSubmit={submit} style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:10px;box-shadow:0 12px 32px rgba(14,42,71,.08)')}>
      <h2 style={sx('font-size:22px;font-weight:700')}>Get a free quote in {areaTitle}</h2>
      <input name="name" required placeholder="Your name" aria-label="Your name" style={sx('padding:12px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <input name="phone" required type="tel" placeholder="Phone" aria-label="Phone" style={sx('padding:12px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <input name="suburb" placeholder="Suburb" aria-label="Suburb" style={sx('padding:12px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <textarea name="message" rows={3} placeholder="What do you need done?" aria-label="Message" style={sx('padding:12px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;resize:vertical')} />
      <button type="submit" className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:14px;font-family:var(--font-heading);font-weight:700;font-size:16.5px;cursor:pointer')}>Send enquiry</button>
    </form>
  );
}

/* Contact page form */
export function ContactForm() {
  const submit = useLeadSubmit();
  return (
    <form onSubmit={submit} style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:18px;padding:clamp(22px,3vw,32px);display:flex;flex-direction:column;gap:12px;box-shadow:0 12px 32px rgba(14,42,71,.08)')}>
      <h2 style={sx('font-size:26px;font-weight:700')}>Request a free quote</h2>
      <p style={sx('color:#5B6E82;font-size:15px;margin-bottom:6px')}>Tell us what you need and we&apos;ll come back with an upfront price.</p>
      <div style={sx('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:10px')}>
        <input name="name" required placeholder="Your name" aria-label="Your name" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
        <input name="phone" required type="tel" placeholder="Phone" aria-label="Phone" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      </div>
      <div style={sx('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:10px')}>
        <input name="email" type="email" placeholder="Email" aria-label="Email" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
        <input name="suburb" placeholder="Suburb" aria-label="Suburb" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      </div>
      <select name="service" aria-label="Service" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;background:#fff;color:#14263A')}>
        <option>Air Conditioning Services</option><option>Electrical Services</option><option>Builder Services</option><option>Something else</option>
      </select>
      <textarea name="message" rows={4} placeholder="Tell us about the job" aria-label="Message" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;resize:vertical')} />
      <button type="submit" className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:15px;font-family:var(--font-heading);font-weight:700;font-size:17px;cursor:pointer')}>Send my enquiry</button>
      <p style={sx('font-size:12.5px;color:#7A8A9C')}>By submitting you agree to our <Link href="/privacy-policy">privacy policy</Link>.</p>
    </form>
  );
}

/* Quote slide-in drawer form */
export function DrawerQuoteForm() {
  const submit = useLeadSubmit();
  return (
    <form onSubmit={submit} style={sx('display:flex;flex-direction:column;gap:11px')}>
      <input name="name" required placeholder="Your name" aria-label="Your name" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <input name="phone" required type="tel" placeholder="Phone" aria-label="Phone" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <input name="email" type="email" placeholder="Email (optional)" aria-label="Email" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <input name="suburb" placeholder="Suburb" aria-label="Suburb" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%')} />
      <select name="service" aria-label="Service" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;background:#fff;color:#14263A')}>
        {SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
      </select>
      <textarea name="message" rows={3} placeholder="Tell us about the job" aria-label="Message" style={sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;resize:vertical')} />
      <button type="submit" className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:15px;font-family:var(--font-heading);font-weight:700;font-size:17px;cursor:pointer')}>Send my enquiry</button>
    </form>
  );
}
