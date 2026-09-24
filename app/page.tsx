import Link from 'next/link';
import Image from 'next/image';
import { sx } from '@/lib/sx';
import {
  AREAS, BRANDS, EXPECT, GALLERY, HOME_FAQ, PILLARS, SITE, TESTIMONIALS, TITLES, TRUST_STATS, USPS, WHAT_WE_DO,
} from '@/lib/content';
import { blur, img } from '@/lib/images';
import QuoteButton from '@/components/QuoteButton';
import { HeroQuoteForm } from '@/components/forms';

const areaLabel = (s: string) => TITLES[s] || s.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section style={sx('background:#1279BF;color:#fff;position:relative;overflow:hidden')}>
        <div style={sx('position:absolute;inset:0;background:radial-gradient(ellipse at 80% 10%,rgba(255,255,255,.14),transparent 55%)')} />
        <div className="lae-hero" style={sx('max-width:1220px;margin:0 auto;padding:clamp(40px,7vw,84px) 20px clamp(40px,6vw,72px)')}>
          <div>
            <div style={sx('display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:6px 14px 6px 8px;font-size:14px;font-weight:600;margin-bottom:22px')}>
              <span style={sx('color:#FFC845;letter-spacing:1px')}>★★★★★</span> 5.0 · 200+ Google reviews
            </div>
            <h1 style={sx('font-size:clamp(32px,4.6vw,56px);font-weight:800;letter-spacing:-.01em;margin-bottom:18px;text-wrap:balance')}>Air conditioning & electrical. One licensed team, Brisbane to Gold Coast.</h1>
            <p style={sx('font-size:clamp(17px,1.6vw,20px);line-height:1.55;color:#E3F0FA;max-width:560px;margin-bottom:28px')}>Supply and installation of split system and ducted air conditioners, plus every electrical job from power points to switchboards. Serving the industry since 2014 with warranties, upfront quotes and no hidden charges.</p>
            <div style={sx('display:flex;flex-wrap:wrap;gap:12px;margin-bottom:28px')}>
              <QuoteButton className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:16px 26px;font-family:var(--font-heading);font-weight:700;font-size:17px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.18)')}>Get a Free Quote</QuoteButton>
              <a href="tel:1300010393" className="hv-mint" style={sx('background:#fff;color:#0E2A47;border-radius:12px;padding:16px 24px;font-family:var(--font-heading);font-weight:700;font-size:17px;display:flex;align-items:center;gap:8px')}>☏ 1300 010 393</a>
            </div>
            <ul className="lae-checks" style={sx('list-style:none;padding:0;display:grid;gap:8px 18px;font-size:15px;color:#E3F0FA;max-width:520px')}>
              <li style={sx('display:flex;gap:8px;align-items:center')}><span style={sx('color:#9BE04A;font-weight:800')}>✓</span>Warranties & guarantees</li>
              <li style={sx('display:flex;gap:8px;align-items:center')}><span style={sx('color:#9BE04A;font-weight:800')}>✓</span>Financing available</li>
              <li style={sx('display:flex;gap:8px;align-items:center')}><span style={sx('color:#9BE04A;font-weight:800')}>✓</span>Licensed & insured</li>
              <li style={sx('display:flex;gap:8px;align-items:center')}><span style={sx('color:#9BE04A;font-weight:800')}>✓</span>On call 24/7</li>
            </ul>
          </div>
          <HeroQuoteForm />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={sx('background:#fff;border-bottom:1px solid #E1E8F0')}>
        <div className="lae-trust" style={sx('max-width:1220px;margin:0 auto;padding:18px 20px')}>
          {TRUST_STATS.map((s) => (
            <div key={s.l}>
              <div style={sx('font-family:var(--font-heading);font-weight:800;font-size:26px;color:#1279BF;line-height:1')}>{s.v}</div>
              <div style={sx('font-size:13.5px;color:#5B6E82;margin-top:4px')}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THREE PILLARS */}
      <section style={sx('max-width:1220px;margin:0 auto;padding:clamp(48px,6vw,80px) 20px 0')}>
        <div style={sx('text-align:center;max-width:680px;margin:0 auto 36px')}>
          <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#E32027;margin-bottom:10px')}>What we can offer you</div>
          <h2 style={sx('font-size:clamp(28px,3.4vw,40px);font-weight:700')}>Fast, reliable electrical and air conditioning services</h2>
        </div>
        <div className="lae-pillars">
          {PILLARS.map((p) => (
            <Link key={p.href} href={p.href} className="hv-lift" style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;color:#14263A;transition:transform .2s,box-shadow .2s')}>
              <div style={sx('aspect-ratio:16/9;background:#DCE6EF;overflow:hidden;position:relative')}>
                <Image
                  src={p.img.src}
                  alt={p.alt}
                  fill
                  {...blur(p.img)}
                  sizes="(max-width: 859px) 100vw, (max-width: 1220px) 33vw, 393px"
                  style={sx('object-fit:cover')}
                />
              </div>
              <div style={sx('padding:22px 22px 24px;display:flex;flex-direction:column;gap:8px;flex:1')}>
                <h3 style={sx('font-size:23px;font-weight:700')}>{p.title}</h3>
                <p style={sx('color:#5B6E82;font-size:15px;flex:1')}>{p.text}</p>
                <span style={sx('color:#1279BF;font-weight:700;font-size:15px;margin-top:6px')}>Explore {p.short} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHAT WE DO GRID */}
      <section style={sx('max-width:1220px;margin:0 auto;padding:clamp(48px,6vw,80px) 20px 0')}>
        <div className="lae-split">
          <div>
            <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#E32027;margin-bottom:10px')}>One team for everything</div>
            <h2 style={sx('font-size:clamp(28px,3.4vw,40px);font-weight:700;margin-bottom:16px')}>Fewer trades to manage. Excellent results on the table.</h2>
            <p style={sx('color:#3E5166;font-size:17px;margin-bottom:18px')}>Links Air Electrical is not just electricians, we are a full-service provider in both electrical and air conditioning. Whether you&apos;re building, renovating, or just need a quick fix, we&apos;ve got you covered.</p>
            <p style={sx('color:#3E5166;font-size:17px;margin-bottom:24px')}>Most homes need both at some point. Instead of calling multiple trades, we do both in one visit, saving you time and money.</p>
            <Link href="/about-us" style={sx('font-weight:700;font-size:16px')}>More about Links Air →</Link>
          </div>
          <div style={sx('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px')}>
            {WHAT_WE_DO.map((w) => (
              <Link key={w.n} href={w.href} className="hv-bord" style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:8px;color:#14263A;min-height:104px')}>
                <span style={sx('width:34px;height:34px;border-radius:9px;background:#EAF3FA;color:#1279BF;display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-weight:800;font-size:15px')}>{w.n}</span>
                <span style={sx('font-weight:700;font-size:15px;line-height:1.3')}>{w.t}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE / EXPECT */}
      <section style={sx('background:#0E2A47;color:#fff;margin-top:clamp(48px,6vw,80px)')}>
        <div className="lae-split lae-split-center" style={sx('max-width:1220px;margin:0 auto;padding:clamp(48px,6vw,80px) 20px')}>
          <div>
            <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#9BE04A;margin-bottom:10px')}>Why choose Links Air?</div>
            <h2 style={sx('font-size:clamp(28px,3.4vw,40px);font-weight:700;margin-bottom:16px')}>Honest work, fair prices, top-quality service.</h2>
            <p style={sx('color:#C9D7E6;font-size:17px;margin-bottom:26px')}>Our licensed electricians and aircon installers are dedicated to doing every job safely, cleanly, and with care. We treat your home like our own, leaving it clean and safe after every job.</p>
            <ul style={sx('list-style:none;padding:0;display:flex;flex-direction:column;gap:12px;font-size:16.5px')}>
              {EXPECT.map((e) => (
                <li key={e} style={sx('display:flex;gap:12px;align-items:flex-start')}>
                  <span style={sx('width:24px;height:24px;border-radius:50%;background:#78B72A;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;margin-top:2px')}>✓</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div style={sx('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px')}>
            {USPS.map((u) => (
              <div key={u.t} style={sx('background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px 16px')}>
                <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:18px;line-height:1.2;margin-bottom:6px')}>{u.t}</div>
                <div style={sx('color:#A9BBCF;font-size:14px')}>{u.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={sx('max-width:1220px;margin:0 auto;padding:clamp(48px,6vw,80px) 20px 0')}>
        <div style={sx('display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:28px')}>
          <div>
            <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#E32027;margin-bottom:10px')}>Testimonials</div>
            <h2 style={sx('font-size:clamp(28px,3.4vw,40px);font-weight:700')}>Trusted by over 180 reviewers on Google</h2>
          </div>
          <a href="https://www.google.com/maps/place/Links+Air+%26+Electrical/@-27.598581,153.1103469,162123m/data=!3m1!1e3!4m8!3m7!1s0x6b914711e4f75eff:0x5158d09697b56f9b!8m2!3d-27.598581!4d153.1103469!9m1!1b1!16s%2Fg%2F11kf3kd8f9" target="_blank" rel="noopener" className="hv-bord" style={sx('font-weight:700;border:1px solid #D4DEE8;background:#fff;border-radius:10px;padding:11px 16px;color:#14263A')}>View all reviews on Google →</a>
        </div>
        <div className="lae-testimonials">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} style={sx('margin:0;background:#fff;border:1px solid #E1E8F0;border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:12px')}>
              <div style={sx('color:#FFB400;letter-spacing:2px;font-size:15px')}>★★★★★</div>
              <blockquote style={sx('margin:0;font-size:16px;color:#2B3F55;flex:1')}>“{t.text}”</blockquote>
              <figcaption style={sx('display:flex;justify-content:space-between;align-items:center;font-size:14px')}>
                <strong style={sx('color:#14263A')}>{t.name}</strong>
                <span style={sx('color:#7A8A9C')}>Posted on Google</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* OFFER */}
      {SITE.showOffer ? (
        <section style={sx('max-width:1220px;margin:clamp(48px,6vw,80px) auto 0;padding:0 20px')}>
          <div style={sx('background:#E32027;color:#fff;border-radius:20px;padding:clamp(28px,4vw,44px);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px')}>
            <div style={sx('display:flex;align-items:center;gap:22px;flex-wrap:wrap')}>
              <div style={sx('font-family:var(--font-heading);font-weight:800;font-size:clamp(48px,6vw,72px);line-height:1;letter-spacing:-.02em')}>20% OFF</div>
              <div>
                <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:clamp(20px,2.4vw,26px)')}>Electrical or AC maintenance & repair</div>
                <div style={sx('color:#FFD9DB;font-size:15px')}>Mention this offer when you book. Leading cooling company serving Australia.</div>
              </div>
            </div>
            <div style={sx('display:flex;gap:10px;flex-wrap:wrap')}>
              <a href="tel:0447440050" style={sx('background:#fff;color:#E32027;border-radius:12px;padding:14px 22px;font-family:var(--font-heading);font-weight:700;font-size:17px')}>☏ 0447 440 050</a>
              <QuoteButton className="hv-navy" style={sx('background:#0E2A47;color:#fff;border:0;border-radius:12px;padding:14px 22px;font-family:var(--font-heading);font-weight:700;font-size:17px;cursor:pointer')}>Schedule an appointment</QuoteButton>
            </div>
          </div>
        </section>
      ) : null}

      {/* GALLERY */}
      <section style={sx('max-width:1220px;margin:0 auto;padding:clamp(48px,6vw,80px) 20px 0')}>
        <div style={sx('text-align:center;max-width:680px;margin:0 auto 28px')}>
          <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#E32027;margin-bottom:10px')}>Work gallery</div>
          <h2 style={sx('font-size:clamp(28px,3.4vw,40px);font-weight:700')}>Recent installations across Brisbane & the Gold Coast</h2>
        </div>
        <div className="lae-gallery">
          {GALLERY.map(([s, a]) => (
            <figure key={s} style={sx('margin:0;aspect-ratio:1;border-radius:12px;overflow:hidden;background:#DCE6EF;position:relative')}>
              <Image
                src={img(s).src}
                alt={a}
                fill
                {...blur(img(s))}
                sizes="(max-width: 599px) 50vw, (max-width: 1023px) 25vw, 190px"
                style={sx('object-fit:cover')}
              />
              <figcaption style={sx('position:absolute;left:0;right:0;bottom:0;padding:8px 10px;font-size:12px;color:#fff;background:linear-gradient(transparent,rgba(14,42,71,.8))')}>{a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* AREAS + FAQ */}
      <section className="lae-split" style={sx('max-width:1220px;margin:0 auto;padding:clamp(48px,6vw,80px) 20px 0')}>
        <div>
          <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#E32027;margin-bottom:10px')}>Areas we service</div>
          <h2 style={sx('font-size:clamp(26px,3vw,34px);font-weight:700;margin-bottom:14px')}>Local and flexible across South East Queensland</h2>
          <p style={sx('color:#3E5166;margin-bottom:20px')}>Brisbane (North, South, East & West), Gold Coast, Logan & Ipswich, Redlands, Moreton Bay and surrounding suburbs. Not sure if we service your area? Just give us a call.</p>
          <div style={sx('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px')}>
            {AREAS.map((s) => (
              <Link key={s} href={'/' + s} className="hv-bord" style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:12px;padding:16px;display:flex;justify-content:space-between;align-items:center;color:#14263A;font-weight:700')}>
                {areaLabel(s)}<span style={sx('color:#1279BF')}>→</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#E32027;margin-bottom:10px')}>FAQs</div>
          <h2 style={sx('font-size:clamp(26px,3vw,34px);font-weight:700;margin-bottom:14px')}>Common questions</h2>
          <div style={sx('display:flex;flex-direction:column;gap:8px')}>
            {HOME_FAQ.map((f) => (
              <details key={f.q} style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:12px;padding:0 18px')}>
                <summary style={sx('padding:15px 0;font-weight:700;font-size:16px;display:flex;justify-content:space-between;gap:12px;align-items:center')}>{f.q}<span className="lae-plus" style={sx('color:#1279BF;font-size:18px')}>+</span></summary>
                <p style={sx('padding:0 0 16px;color:#3E5166')}>{f.a}</p>
              </details>
            ))}
          </div>
          <Link href="/faq" style={sx('display:inline-block;margin-top:14px;font-weight:700')}>All FAQs →</Link>
        </div>
      </section>

      {/* BRANDS */}
      <section style={sx('max-width:1220px;margin:0 auto;padding:clamp(48px,6vw,72px) 20px 0')}>
        <p style={sx('text-align:center;font-family:var(--font-heading);font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#7A8A9C;margin-bottom:18px')}>We supply, install and service top brands</p>
        <div className="lae-brands">
          {BRANDS.map(([s, a]) => (
            <div key={s} style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:12px;height:72px;display:flex;align-items:center;justify-content:center;padding:12px')}>
              <Image
                {...img(s)}
                alt={a}
                loading="lazy"
                sizes="160px"
                style={sx('max-height:40px;width:auto;height:auto;max-width:100%;object-fit:contain')}
              />
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={sx('max-width:1220px;margin:clamp(48px,6vw,80px) auto 0;padding:0 20px clamp(48px,6vw,80px)')}>
        <div style={sx('background:#1279BF;color:#fff;border-radius:22px;padding:clamp(32px,5vw,56px);text-align:center;position:relative;overflow:hidden')}>
          <div style={sx('position:absolute;inset:0;background:radial-gradient(ellipse at 20% 100%,rgba(255,255,255,.12),transparent 55%)')} />
          <div style={sx('position:relative')}>
            <h2 style={sx('font-size:clamp(28px,3.6vw,42px);font-weight:800;margin-bottom:12px')}>Get started today</h2>
            <p style={sx('color:#E3F0FA;font-size:18px;max-width:600px;margin:0 auto 26px')}>Need reliable electrical and air conditioning services in Brisbane or the Gold Coast? From air conditioning installation to complete electrical upgrades, we&apos;ll get the job done quickly and professionally.</p>
            <div style={sx('display:flex;flex-wrap:wrap;gap:12px;justify-content:center')}>
              <a href="tel:1300010393" style={sx('background:#fff;color:#0E2A47;border-radius:12px;padding:16px 26px;font-family:var(--font-heading);font-weight:700;font-size:17px')}>Call Links Air Electrical</a>
              <QuoteButton className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:16px 26px;font-family:var(--font-heading);font-weight:700;font-size:17px;cursor:pointer')}>Request a Free Quote</QuoteButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
