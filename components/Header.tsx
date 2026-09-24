'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { sx } from '@/lib/sx';
import { NAV, NAV_SHORT } from '@/lib/site';
import type { Img } from '@/lib/images';
import { useQuote } from './QuoteContext';

export default function Header({
  logo,
  menuOpen,
  setMenuOpen,
}: {
  logo: Img;
  menuOpen: boolean;
  setMenuOpen: (v: boolean | ((s: boolean) => boolean)) => void;
}) {
  const { open: openQuote } = useQuote();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState<Record<number, boolean>>({});
  const pathname = usePathname();
  const dropRef = useRef<HTMLDivElement>(null);
  const [dropShift, setDropShift] = useState(0);

  useEffect(() => {
    setOpenMenu(null);
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  // Nudge an open dropdown back inside the viewport (the Electrical menu is
  // ~750px wide and would otherwise run off the right edge at 1024-1300px).
  useLayoutEffect(() => {
    const el = dropRef.current;
    if (openMenu === null || !el) { setDropShift(0); return; }
    const r = el.getBoundingClientRect();
    const pad = 16;
    const left = r.left - dropShift;
    const right = r.right - dropShift;
    let s = 0;
    if (right > window.innerWidth - pad) s = window.innerWidth - pad - right;
    if (left + s < pad) s = pad - left;
    setDropShift(Math.round(s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMenu]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header style={sx('background:#fff;position:sticky;top:0;z-index:50;box-shadow:0 1px 0 #E1E8F0')} onMouseLeave={() => setOpenMenu(null)}>
      <div style={sx('max-width:1220px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;height:72px')}>
        <Link href="/" aria-label="Links Air & Electrical home" style={sx('display:flex;align-items:center;flex-shrink:0')}>
          <Image {...logo} alt="Links Air & Electrical" priority style={sx('height:46px;width:auto;display:block')} />
        </Link>

        {/* desktop nav */}
        <nav aria-label="Primary" className="lae-desktop" style={sx('display:flex;align-items:center;gap:2px;height:100%')}>
          {NAV.map((item, i) => (
            <div key={item.label} style={sx('position:relative;height:72px;display:flex;align-items:center')} onMouseEnter={() => setOpenMenu(item.groups ? i : null)}>
              <Link href={item.href} className="hv-bb" style={sx('font-family:var(--font-heading);font-weight:600;font-size:15px;letter-spacing:.01em;color:#14263A;padding:10px 10px;border-radius:8px;display:flex;align-items:center;gap:4px;white-space:nowrap')}>
                {NAV_SHORT[item.label] || item.label}
                {item.groups ? <span style={sx('font-size:9px;opacity:.55')}>▼</span> : null}
              </Link>
              {openMenu === i && item.groups ? (
                <div ref={dropRef} className="lae-dropdown" style={{ ...sx('position:absolute;top:66px;left:0;background:#fff;border:1px solid #E1E8F0;border-radius:14px;box-shadow:0 18px 40px rgba(14,42,71,.14);padding:18px;display:flex;gap:26px;animation:lae-fade .18s ease;z-index:60;min-width:260px'), transform: dropShift ? `translateX(${dropShift}px)` : undefined }}>
                  {item.groups.map((g) => (
                    <div key={g.label} style={sx('min-width:220px')}>
                      {g.href ? (
                        <Link href={g.href} className="hv-bd" style={sx('display:block;font-family:var(--font-heading);font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:#1279BF;padding:4px 8px 8px;border-bottom:2px solid #E8F1F8;margin-bottom:6px')}>{g.label}</Link>
                      ) : (
                        <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:#5B6E82;padding:4px 8px 8px;border-bottom:2px solid #E8F1F8;margin-bottom:6px')}>{g.label}</div>
                      )}
                      {g.children.map((ch) => (
                        <Link key={ch.slug} href={ch.href} className="hv-bb" style={sx('display:block;padding:7px 8px;border-radius:7px;font-size:14.5px;color:#2B3F55')}>{ch.label}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="lae-desktop" style={sx('display:flex;align-items:center;gap:8px;flex-shrink:0')}>
          <a href="tel:1300010393" aria-label="Call 1300 010 393" className="hv-bb" style={sx('display:flex;align-items:center;gap:8px;font-family:var(--font-heading);font-weight:700;font-size:16px;color:#0E2A47;padding:6px 8px;border-radius:10px;white-space:nowrap')}>
            <span style={sx('width:36px;height:36px;border-radius:50%;background:#EAF7DC;color:#4E8A12;display:flex;align-items:center;justify-content:center;font-size:16px')}>☏</span>
            <span className="lae-wide">1300 010 393</span>
          </a>
          <button type="button" onClick={openQuote} className="hv-redd" style={sx('background:#E32027;color:#fff;border:0;border-radius:10px;padding:12px 18px;font-family:var(--font-heading);font-weight:700;font-size:15px;cursor:pointer;white-space:nowrap')}>Free Quote</button>
        </div>

        {/* mobile controls */}
        <div className="lae-mobile" style={sx('display:flex;align-items:center;gap:8px')}>
          <a href="tel:1300010393" aria-label="Call 1300 010 393" style={sx('width:44px;height:44px;border-radius:12px;background:#EAF7DC;color:#4E8A12;display:flex;align-items:center;justify-content:center;font-size:20px')}>☏</a>
          <button type="button" onClick={() => setMenuOpen((s) => !s)} aria-label="Menu" aria-expanded={menuOpen} style={sx('width:44px;height:44px;border-radius:12px;border:1px solid #E1E8F0;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer')}>
            <span style={sx('width:20px;height:2px;background:#14263A;display:block')} />
            <span style={sx('width:20px;height:2px;background:#14263A;display:block')} />
            <span style={sx('width:20px;height:2px;background:#14263A;display:block')} />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {menuOpen ? (
        <div className="lae-mobile" style={sx('position:fixed;inset:72px 0 0 0;background:#fff;z-index:49;overflow-y:auto;padding:12px 20px 120px;animation:lae-fade .2s ease')}>
          {NAV.map((item, i) => (
            <div key={item.label} style={sx('border-bottom:1px solid #EDF1F5')}>
              <div style={sx('display:flex;align-items:center;justify-content:space-between')}>
                <Link href={item.href} onClick={closeMenu} style={sx('display:block;padding:15px 0;font-family:var(--font-heading);font-weight:700;font-size:19px;color:#14263A;flex:1')}>{item.label}</Link>
                {item.groups ? (
                  <button type="button" onClick={() => setMobileOpen((s) => ({ ...s, [i]: !s[i] }))} aria-label="Expand" style={sx('width:44px;height:44px;border:0;background:#F0F6FB;border-radius:10px;color:#1279BF;font-size:14px;cursor:pointer')}>
                    {mobileOpen[i] ? '▲' : '▼'}
                  </button>
                ) : null}
              </div>
              {mobileOpen[i] && item.groups ? (
                <div style={sx('padding:0 0 14px 4px;display:flex;flex-direction:column;gap:14px')}>
                  {item.groups.map((g) => (
                    <div key={g.label}>
                      {g.href ? (
                        <Link href={g.href} onClick={closeMenu} style={sx('display:block;font-family:var(--font-heading);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#1279BF;padding:6px 0')}>{g.label}</Link>
                      ) : (
                        <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#5B6E82;padding:6px 0')}>{g.label}</div>
                      )}
                      {g.children.map((ch) => (
                        <Link key={ch.slug} href={ch.href} onClick={closeMenu} style={sx('display:block;padding:10px 0;color:#2B3F55;font-size:16px;border-top:1px solid #F3F6F9')}>{ch.label}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <div style={sx('display:flex;flex-direction:column;gap:10px;margin-top:20px')}>
            <button type="button" onClick={() => { openQuote(); setMenuOpen(false); }} style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:16px;font-family:var(--font-heading);font-weight:700;font-size:17px;cursor:pointer')}>Get a Free Quote</button>
            <a href="tel:1300010393" style={sx('background:#0E2A47;color:#fff;border-radius:12px;padding:16px;text-align:center;font-family:var(--font-heading);font-weight:700;font-size:17px')}>Call 1300 010 393</a>
            <a href="https://wa.me/61447440050" target="_blank" rel="noopener" style={sx('background:#EAF7DC;color:#3D7A0B;border-radius:12px;padding:16px;text-align:center;font-family:var(--font-heading);font-weight:700;font-size:17px')}>WhatsApp 0447 440 050</a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
