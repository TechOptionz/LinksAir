import type { Metadata } from 'next';
import Link from 'next/link';
import { sx } from '@/lib/sx';
import { CONTACT_CARDS } from '@/lib/content';
import { ContactForm } from '@/components/forms';

export const metadata: Metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <div>
      <section style={sx('background:#1279BF;color:#fff')}>
        <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
          <nav aria-label="Breadcrumb" style={sx('font-size:13.5px;color:#C9E2F5;margin-bottom:14px')}>
            <Link href="/" style={sx('color:#C9E2F5')}>Home</Link> / <span style={sx('color:#fff')}>Contact</span>
          </nav>
          <h1 style={sx('font-size:clamp(30px,4.4vw,52px);font-weight:800;margin-bottom:14px')}>Get in touch with us</h1>
          <p style={sx('font-size:clamp(16px,1.5vw,19px);color:#E3F0FA;max-width:640px')}>Call, message or send the form. We&apos;re on call 24/7 across Brisbane and the Gold Coast and reply to every enquiry.</p>
        </div>
      </section>
      <div className="lae-split" style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
        <div style={sx('display:flex;flex-direction:column;gap:14px')}>
          {CONTACT_CARDS.map((card) => {
            const inner = (
              <>
                <div style={sx('min-width:0')}>
                  <div style={sx('font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#7A8A9C')}>{card.l}</div>
                  <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:clamp(15px,4.6vw,22px);color:#14263A;overflow-wrap:anywhere;line-height:1.25')}>{card.v}</div>
                </div>
                <span style={sx('color:#1279BF;font-size:20px;flex-shrink:0')}>→</span>
              </>
            );
            const style = sx('background:#fff;border:1px solid #E1E8F0;border-radius:16px;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px;color:#14263A');
            return card.href.startsWith('/') ? (
              <Link key={card.l} href={card.href} className="hv-bo" style={style}>{inner}</Link>
            ) : (
              <a key={card.l} href={card.href} target={card.target} rel={card.target === '_blank' ? 'noopener' : undefined} className="hv-bo" style={style}>{inner}</a>
            );
          })}
          <div style={sx('border-radius:16px;border:1px dashed #B8C6D6;background:repeating-linear-gradient(135deg,#E9EFF5 0 12px,#F4F7FA 12px 24px);min-height:220px;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px')}>
            <span style={sx('font-family:ui-monospace,monospace;font-size:13px;color:#5B6E82')}>Google Map embed: service area Brisbane → Gold Coast</span>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
