import Link from 'next/link';
import { sx } from '@/lib/sx';
import { POPULAR_SERVICES } from '@/lib/content';
import QuoteButton from './QuoteButton';
import { AreaQuoteForm } from './forms';

export default function AreaArticle({ title, areaGroups, areaParas }: { title: string; areaGroups: { label: string; items: string[] }[]; areaParas: string[] }) {
  return (
    <article>
      <section style={sx('background:#1279BF;color:#fff')}>
        <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
          <nav aria-label="Breadcrumb" style={sx('font-size:13.5px;color:#C9E2F5;margin-bottom:14px')}>
            <Link href="/" style={sx('color:#C9E2F5')}>Home</Link> / <Link href="/service-area" style={sx('color:#C9E2F5')}>Service areas</Link> / <span style={sx('color:#fff')}>{title}</span>
          </nav>
          <h1 style={sx('font-size:clamp(30px,4.4vw,52px);font-weight:800;margin-bottom:14px')}>Air conditioning & electricians in {title}</h1>
          <p style={sx('font-size:clamp(16px,1.5vw,19px);color:#E3F0FA;max-width:640px;margin-bottom:24px')}>Licensed installers and electricians servicing every {title} suburb. Split systems, ducted air, switchboards, lighting, EV chargers and more, with upfront quotes.</p>
          <div style={sx('display:flex;flex-wrap:wrap;gap:12px')}>
            <QuoteButton className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:15px 24px;font-family:var(--font-heading);font-weight:700;font-size:16.5px;cursor:pointer')}>Get a Free Quote</QuoteButton>
            <a href="tel:1300010393" style={sx('background:#fff;color:#0E2A47;border-radius:12px;padding:15px 22px;font-family:var(--font-heading);font-weight:700;font-size:16.5px')}>☏ 1300 010 393</a>
          </div>
        </div>
      </section>
      <div className="lae-content-grid" style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
        <div style={sx('min-width:0;display:flex;flex-direction:column;gap:22px')}>
          {areaGroups.map((g, i) => (
            <div key={i}>
              <h2 style={sx('font-size:22px;font-weight:700;margin-bottom:12px')}>{g.label}</h2>
              <div style={sx('display:flex;flex-wrap:wrap;gap:8px')}>
                {g.items.map((s) => (
                  <span key={s} style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:999px;padding:7px 14px;font-size:14.5px;color:#2B3F55')}>{s}</span>
                ))}
              </div>
            </div>
          ))}
          {areaParas.map((p, i) => (
            <p key={i} style={sx('font-size:17px;color:#2B3F55')}>{p}</p>
          ))}
          <div style={sx('padding-top:24px;border-top:1px solid #E1E8F0')}>
            <h2 style={sx('font-size:22px;font-weight:700;margin-bottom:14px')}>Popular services in {title}</h2>
            <div style={sx('display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:10px')}>
              {POPULAR_SERVICES.map((r) => (
                <Link key={r.slug} href={r.href} className="hv-bord" style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:12px;padding:14px 16px;font-weight:700;font-size:15px;color:#14263A;display:flex;justify-content:space-between;gap:8px')}>
                  {r.label}<span style={sx('color:#1279BF')}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <aside style={sx('display:flex;flex-direction:column;gap:16px;position:sticky;top:88px')}>
          <AreaQuoteForm areaTitle={title} />
          <div style={sx('background:#0E2A47;color:#fff;border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:12px')}>
            <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:18px')}>On call 24/7</div>
            <a href="tel:1300010393" className="hv-lime" style={sx('color:#fff;font-family:var(--font-heading);font-weight:800;font-size:26px;line-height:1')}>1300 010 393</a>
            <a href="https://wa.me/61447440050" target="_blank" rel="noopener" className="hv-gd" style={sx('background:#78B72A;color:#fff;border-radius:10px;padding:12px;text-align:center;font-weight:700')}>Message on WhatsApp</a>
          </div>
        </aside>
      </div>
    </article>
  );
}
