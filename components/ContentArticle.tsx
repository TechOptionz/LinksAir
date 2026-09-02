import Link from 'next/link';
import { sx } from '@/lib/sx';
import { EXPECT, type ContentModel } from '@/lib/content';
import QuoteButton from './QuoteButton';
import { SidebarQuoteForm } from './forms';
import Blocks from './Blocks';

/* Sidebar shared by content + area pages */
export function SidebarCallCard({ heading }: { heading: string }) {
  return (
    <div style={sx('background:#0E2A47;color:#fff;border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:12px')}>
      <div style={sx('font-family:Barlow,sans-serif;font-weight:700;font-size:18px')}>{heading}</div>
      <a href="tel:1300010393" className="hv-lime" style={sx('color:#fff;font-family:Barlow,sans-serif;font-weight:800;font-size:26px;line-height:1')}>1300 010 393</a>
      {heading === 'Prefer to talk?' ? (
        <a href="tel:0447440050" className="hv-w" style={sx('color:#C9D7E6;font-weight:700')}>Mobile 0447 440 050</a>
      ) : null}
      <a href="https://wa.me/61447440050" target="_blank" rel="noopener" className="hv-gd" style={sx('background:#78B72A;color:#fff;border-radius:10px;padding:12px;text-align:center;font-weight:700')}>Message on WhatsApp</a>
      {heading === 'Prefer to talk?' ? (
        <p style={sx('font-size:13.5px;color:#A9BBCF')}>Licensed & insured · Warranties & guarantees · Financing available</p>
      ) : null}
    </div>
  );
}

export default function ContentArticle({ page }: { page: ContentModel }) {
  return (
    <article>
      <section style={sx('background:#1279BF;color:#fff;position:relative;overflow:hidden')}>
        <div style={sx('position:absolute;inset:0;background:radial-gradient(ellipse at 85% 0%,rgba(255,255,255,.14),transparent 55%)')} />
        <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px;position:relative;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:32px;align-items:center')}>
          <div>
            <nav aria-label="Breadcrumb" style={sx('font-size:13.5px;color:#C9E2F5;margin-bottom:14px;display:flex;flex-wrap:wrap;gap:6px')}>
              <Link href="/" style={sx('color:#C9E2F5')}>Home</Link><span>/</span>
              {page.hasParent ? (<><Link href={page.parentHref} style={sx('color:#C9E2F5')}>{page.parentLabel}</Link><span>/</span></>) : null}
              <span style={sx('color:#fff')}>{page.title}</span>
            </nav>
            <h1 style={sx('font-size:clamp(30px,4.4vw,52px);font-weight:800;letter-spacing:-.01em;margin-bottom:14px')}>{page.title}</h1>
            <p style={sx('font-size:clamp(16px,1.5vw,19px);color:#E3F0FA;max-width:620px;margin-bottom:24px')}>{page.intro}</p>
            <div style={sx('display:flex;flex-wrap:wrap;gap:12px')}>
              <QuoteButton className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:15px 24px;font-family:Barlow,sans-serif;font-weight:700;font-size:16.5px;cursor:pointer')}>Get a Free Quote</QuoteButton>
              <a href="tel:1300010393" style={sx('background:#fff;color:#0E2A47;border-radius:12px;padding:15px 22px;font-family:Barlow,sans-serif;font-weight:700;font-size:16.5px')}>☏ 1300 010 393</a>
            </div>
          </div>
          {page.hasImg ? (
            <div style={sx('aspect-ratio:4/3;border-radius:18px;overflow:hidden;background:#0E5F97;box-shadow:0 24px 60px rgba(8,30,55,.3);max-height:380px')}>
              <img src={page.img} alt={page.imgAlt} style={sx('width:100%;height:100%;object-fit:cover;display:block')} />
            </div>
          ) : (
            <div style={sx('aspect-ratio:4/3;max-height:380px;border-radius:18px;border:1px dashed rgba(255,255,255,.5);background:repeating-linear-gradient(135deg,rgba(255,255,255,.08) 0 12px,transparent 12px 24px);display:flex;align-items:center;justify-content:center;text-align:center;padding:20px')}>
              <span style={sx('font-family:ui-monospace,monospace;font-size:13px;color:#E3F0FA')}>photo: {page.imgAlt}</span>
            </div>
          )}
        </div>
      </section>

      <div className="lae-content-grid" style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
        <div style={sx('min-width:0;display:flex;flex-direction:column;gap:18px;font-size:17px;color:#2B3F55')}>
          <Blocks blocks={page.blocks} variant="content" />

          {page.isThin ? (
            <>
              <h2 style={sx('font-size:clamp(24px,2.6vw,30px);font-weight:700;color:#14263A;margin-top:14px')}>What you can expect</h2>
              <ul style={sx('list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:8px 18px')}>
                {EXPECT.map((e) => (
                  <li key={e} style={sx('display:flex;gap:10px;align-items:flex-start')}>
                    <span style={sx('color:#78B72A;font-weight:800')}>✓</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {page.hasRelated ? (
            <div style={sx('margin-top:20px;padding-top:28px;border-top:1px solid #E1E8F0')}>
              <h2 style={sx('font-size:22px;font-weight:700;color:#14263A;margin-bottom:14px')}>Related services</h2>
              <div style={sx('display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:10px')}>
                {page.related.map((r) => (
                  <Link key={r.slug} href={r.href} className="hv-bord" style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:12px;padding:14px 16px;font-weight:700;font-size:15px;color:#14263A;display:flex;justify-content:space-between;gap:8px')}>
                    {r.label}<span style={sx('color:#1279BF')}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside style={sx('display:flex;flex-direction:column;gap:16px;position:sticky;top:88px')}>
          <SidebarQuoteForm />
          <SidebarCallCard heading="Prefer to talk?" />
          {page.hasSiblings ? (
            <nav aria-label="In this section" style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:18px;padding:18px 20px')}>
              <div style={sx('font-family:Barlow,sans-serif;font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#7A8A9C;margin-bottom:8px')}>{page.sectionLabel}</div>
              {page.siblings.map((s) => (
                <Link key={s.slug} href={s.href} className="hv-b" style={{ ...sx('display:block;padding:9px 0;border-top:1px solid #EDF1F5;font-size:15px'), color: s.color, fontWeight: s.weight as any }}>{s.label}</Link>
              ))}
            </nav>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
