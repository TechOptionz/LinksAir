'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { sx } from '@/lib/sx';
import { SITE } from '@/lib/content';
import { QuoteCtx } from './QuoteContext';
import Header from './Header';
import Footer from './Footer';
import QuoteDrawer from './QuoteDrawer';
import Chatbot from './Chatbot';

function TopBar() {
  return (
    <div className="lae-desktop" style={sx('background:#0E2A47;color:#C9D7E6;font-size:13.5px')}>
      <div style={sx('max-width:1220px;margin:0 auto;padding:7px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px')}>
        <div style={sx('display:flex;gap:22px;align-items:center')}>
          <span style={sx('display:flex;align-items:center;gap:7px')}>
            <span style={sx('width:8px;height:8px;border-radius:50%;background:#78B72A;display:inline-block')} />
            On call 24/7 · Brisbane, Gold Coast, Logan & Ipswich
          </span>
          <a href="mailto:info@linksairelectrical.com.au" className="hv-w" style={sx('color:#C9D7E6')}>info@linksairelectrical.com.au</a>
        </div>
        <div style={sx('display:flex;gap:18px;align-items:center')}>
          <a href="tel:1300010393" className="hv-g" style={sx('color:#fff;font-weight:700')}>1300 010 393</a>
          <a href="tel:0447440050" className="hv-g" style={sx('color:#fff;font-weight:700')}>0447 440 050</a>
          <a href="https://wa.me/61447440050" target="_blank" rel="noopener" className="hv-w" style={sx('color:#C9D7E6')}>WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

function StickyBar({ openQuote }: { openQuote: () => void }) {
  return (
    <div className="lae-mobile" style={sx('position:fixed;left:0;right:0;bottom:0;z-index:70;background:#fff;border-top:1px solid #E1E8F0;padding:10px 12px calc(10px + env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr 1fr;gap:10px;box-shadow:0 -8px 24px rgba(14,42,71,.1)')}>
      <a href="tel:1300010393" style={sx('background:#0E2A47;color:#fff;border-radius:12px;min-height:48px;display:flex;align-items:center;justify-content:center;gap:8px;font-family:Barlow,sans-serif;font-weight:700;font-size:16px')}>☏ Call now</a>
      <button type="button" onClick={openQuote} style={sx('background:#E32027;color:#fff;border:0;border-radius:12px;min-height:48px;font-family:Barlow,sans-serif;font-weight:700;font-size:16px;cursor:pointer')}>Get a Free Quote</button>
    </div>
  );
}

export default function Chrome({ children }: { children: ReactNode }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setQuoteOpen(false);
  }, [pathname]);

  const ctx = useMemo(
    () => ({ open: () => setQuoteOpen(true), close: () => setQuoteOpen(false), isOpen: quoteOpen }),
    [quoteOpen],
  );

  const stickyVisible = SITE.stickyBar && !menuOpen;

  return (
    <QuoteCtx.Provider value={ctx}>
      <div style={sx('min-height:100vh;display:flex;flex-direction:column')}>
        <TopBar />
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main style={sx('flex:1')}>{children}</main>
        <Footer stickySpacer={stickyVisible} />
      </div>
      {stickyVisible ? <StickyBar openQuote={() => setQuoteOpen(true)} /> : null}
      {quoteOpen ? <QuoteDrawer /> : null}
      {SITE.chatbot ? <Chatbot /> : null}
    </QuoteCtx.Provider>
  );
}
