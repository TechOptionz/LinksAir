import type { Metadata } from 'next';
import Link from 'next/link';
import { sx } from '@/lib/sx';
import { faqGroups } from '@/lib/content';
import QuoteButton from '@/components/QuoteButton';

export const metadata: Metadata = { title: 'FAQ' };

export default function FaqPage() {
  const groups = faqGroups();
  return (
    <div>
      <section style={sx('background:#1279BF;color:#fff')}>
        <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
          <nav aria-label="Breadcrumb" style={sx('font-size:13.5px;color:#C9E2F5;margin-bottom:14px')}>
            <Link href="/" style={sx('color:#C9E2F5')}>Home</Link> / <span style={sx('color:#fff')}>FAQ</span>
          </nav>
          <h1 style={sx('font-size:clamp(30px,4.4vw,52px);font-weight:800;margin-bottom:14px')}>Frequently asked questions</h1>
          <p style={sx('font-size:clamp(16px,1.5vw,19px);color:#E3F0FA;max-width:640px')}>Answers about ducted and split system air conditioning, electrical work, pricing and emergency call-outs.</p>
        </div>
      </section>
      <div style={sx('max-width:860px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px;display:flex;flex-direction:column;gap:10px')}>
        {groups.map((g, gi) => (
          <section key={gi} style={sx('display:flex;flex-direction:column;gap:10px' + (gi ? ';margin-top:22px' : ''))}>
            <h2 style={sx('font-size:clamp(22px,2.4vw,28px);font-weight:700;color:#14263A;margin-bottom:4px')}>{g.label}</h2>
            {g.intro.map((t, ti) => (
              <p key={ti} style={sx('color:#3E5166;font-size:16.5px;text-wrap:pretty;margin-bottom:4px')}>{t}</p>
            ))}
            {g.items.map((f, i) => (
              <details key={i} style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:12px;padding:0 20px')}>
                <summary style={sx('padding:16px 0;font-weight:700;font-size:17px;display:flex;justify-content:space-between;gap:12px;align-items:center')}>{f.q}<span className="lae-plus" style={sx('color:#1279BF;font-size:20px')}>+</span></summary>
                <p style={sx('padding:0 0 18px;color:#3E5166;font-size:16.5px')}>{f.a}</p>
              </details>
            ))}
          </section>
        ))}
        <div style={sx('margin-top:20px;background:#0E2A47;color:#fff;border-radius:18px;padding:26px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px')}>
          <div>
            <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:22px')}>Still have a question?</div>
            <div style={sx('color:#C9D7E6')}>Call us or send a message, we&apos;ll get back to you promptly.</div>
          </div>
          <div style={sx('display:flex;gap:10px;flex-wrap:wrap')}>
            <a href="tel:0447440050" style={sx('background:#fff;color:#0E2A47;border-radius:10px;padding:12px 18px;font-weight:700')}>☏ 0447 440 050</a>
            <QuoteButton style={sx('background:#E32027;color:#fff;border:0;border-radius:10px;padding:12px 18px;font-weight:700;cursor:pointer')}>Ask a question</QuoteButton>
          </div>
        </div>
      </div>
    </div>
  );
}
