'use client';

import { sx } from '@/lib/sx';
import { useQuote } from './QuoteContext';
import { DrawerQuoteForm } from './forms';

export default function QuoteDrawer() {
  const { close } = useQuote();
  return (
    <div style={sx('position:fixed;inset:0;z-index:90;display:flex;justify-content:flex-end')}>
      <div onClick={close} style={sx('position:absolute;inset:0;background:rgba(14,42,71,.55);animation:lae-fade .2s ease')} />
      <div role="dialog" aria-modal="true" aria-label="Request a free quote" style={sx('position:relative;width:min(100%,460px);height:100%;background:#fff;overflow-y:auto;padding:24px 24px 40px;display:flex;flex-direction:column;gap:14px;box-shadow:-20px 0 60px rgba(8,30,55,.3);animation:lae-fade .25s ease')}>
        <div style={sx('display:flex;justify-content:space-between;align-items:flex-start;gap:12px')}>
          <div>
            <h2 style={sx('font-size:26px;font-weight:700')}>Request a free quote</h2>
            <p style={sx('color:#5B6E82;font-size:14.5px')}>Upfront quotes before we begin. No surprises.</p>
          </div>
          <button type="button" onClick={close} aria-label="Close" style={sx('width:44px;height:44px;border-radius:12px;border:1px solid #E1E8F0;background:#fff;font-size:20px;cursor:pointer;flex-shrink:0')}>×</button>
        </div>
        <DrawerQuoteForm />
        <div style={sx('display:flex;align-items:center;gap:10px;color:#7A8A9C;font-size:13px')}>
          <span style={sx('flex:1;height:1px;background:#E1E8F0')} />
          or call now
          <span style={sx('flex:1;height:1px;background:#E1E8F0')} />
        </div>
        <a href="tel:1300010393" style={sx('background:#0E2A47;color:#fff;border-radius:12px;padding:14px;text-align:center;font-family:Barlow,sans-serif;font-weight:700;font-size:17px')}>☏ 1300 010 393</a>
        <a href="https://wa.me/61447440050" target="_blank" rel="noopener" style={sx('background:#EAF7DC;color:#3D7A0B;border-radius:12px;padding:14px;text-align:center;font-family:Barlow,sans-serif;font-weight:700;font-size:16px')}>WhatsApp 0447 440 050</a>
      </div>
    </div>
  );
}
