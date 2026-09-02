'use client';

import Link from 'next/link';
import { sx } from '@/lib/sx';
import { FOOTER_AC, FOOTER_EL, FOOTER_CO } from '@/lib/content';

const LOGO = 'https://linksairelectrical.com.au/wp-content/uploads/2024/09/logo.png';

export default function Footer({ stickySpacer }: { stickySpacer: boolean }) {
  return (
    <footer style={sx('background:#0E2A47;color:#C9D7E6;margin-top:auto')}>
      <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(40px,5vw,64px) 20px 28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:36px')}>
        <div style={sx('grid-column:span 1')}>
          <div style={sx('background:#fff;border-radius:12px;padding:10px 14px;display:inline-block;margin-bottom:16px')}>
            <img src={LOGO} alt="Links Air & Electrical" style={sx('height:44px;display:block')} />
          </div>
          <p style={sx('font-size:15px;max-width:320px')}>Links Air & Electrical is a leading name when it comes to 360-degree air conditioning solutions at an unbeatable price. Licensed electricians and aircon installers serving Brisbane and the Gold Coast since 2014.</p>
          <div style={sx('display:flex;gap:10px;margin-top:18px')}>
            <a href="https://www.facebook.com/LinksAirAndElectrical" target="_blank" rel="noopener" className="hv-bgb" style={sx('background:rgba(255,255,255,.08);color:#fff;border-radius:10px;padding:10px 14px;font-weight:700;font-size:14px')}>Facebook</a>
            <a href="https://www.instagram.com/linksairaircons/" target="_blank" rel="noopener" className="hv-bgb" style={sx('background:rgba(255,255,255,.08);color:#fff;border-radius:10px;padding:10px 14px;font-weight:700;font-size:14px')}>Instagram</a>
            <a href="https://wa.me/61447440050" target="_blank" rel="noopener" className="hv-bgg" style={sx('background:rgba(255,255,255,.08);color:#fff;border-radius:10px;padding:10px 14px;font-weight:700;font-size:14px')}>WhatsApp</a>
          </div>
        </div>
        <div>
          <div style={sx('font-family:Barlow,sans-serif;font-weight:700;font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:#fff;margin-bottom:14px')}>Air conditioning</div>
          <div style={sx('display:flex;flex-direction:column;gap:9px;font-size:15px')}>
            {FOOTER_AC.map((l) => <Link key={l.slug} href={l.href} className="hv-w" style={sx('color:#C9D7E6')}>{l.label}</Link>)}
          </div>
        </div>
        <div>
          <div style={sx('font-family:Barlow,sans-serif;font-weight:700;font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:#fff;margin-bottom:14px')}>Electrical</div>
          <div style={sx('display:flex;flex-direction:column;gap:9px;font-size:15px')}>
            {FOOTER_EL.map((l) => <Link key={l.slug} href={l.href} className="hv-w" style={sx('color:#C9D7E6')}>{l.label}</Link>)}
          </div>
        </div>
        <div>
          <div style={sx('font-family:Barlow,sans-serif;font-weight:700;font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:#fff;margin-bottom:14px')}>Contact</div>
          <div style={sx('display:flex;flex-direction:column;gap:10px;font-size:15px')}>
            <a href="tel:1300010393" className="hv-lime" style={sx('color:#fff;font-family:Barlow,sans-serif;font-weight:800;font-size:22px;line-height:1.1')}>1300 010 393</a>
            <a href="tel:0447440050" className="hv-lime" style={sx('color:#fff;font-weight:700')}>0447 440 050</a>
            <a href="mailto:info@linksairelectrical.com.au" className="hv-w" style={sx('color:#C9D7E6')}>info@linksairelectrical.com.au</a>
            <span>Brisbane & Gold Coast · We&apos;re on call 24/7</span>
            <div style={sx('display:flex;flex-direction:column;gap:9px;margin-top:8px;padding-top:12px;border-top:1px solid rgba(255,255,255,.1)')}>
              {FOOTER_CO.map((l) => <Link key={l.slug} href={l.href} className="hv-w" style={sx('color:#C9D7E6')}>{l.label}</Link>)}
            </div>
          </div>
        </div>
      </div>
      <div style={sx('border-top:1px solid rgba(255,255,255,.1)')}>
        <div style={sx('max-width:1220px;margin:0 auto;padding:16px 20px 20px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;font-size:13px;color:#8FA3B8')}>
          <span>Copyright 2026 © All Rights Reserved by Links Air & Electrical</span>
          <span style={sx('display:flex;gap:14px')}>
            <Link href="/terms-conditions" className="hv-w" style={sx('color:#8FA3B8')}>Terms & Conditions</Link>
            <Link href="/privacy-policy" className="hv-w" style={sx('color:#8FA3B8')}>Privacy Policy</Link>
          </span>
        </div>
      </div>
      {stickySpacer ? <div className="lae-mobile" style={sx('height:76px')} /> : null}
    </footer>
  );
}
