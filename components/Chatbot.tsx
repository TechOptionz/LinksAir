'use client';

import { useRef, useState } from 'react';
import { sx } from '@/lib/sx';
import { SITE } from '@/lib/content';

type Msg = { from: 'bot' | 'user'; text: string };
type Step = 'start' | 'name' | 'phone' | 'suburb' | 'question' | 'done';

export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState<Msg[]>([{ from: 'bot', text: 'Hi! I’m the Links Air assistant. How can we help today?' }]);
  const [chatStep, setChatStep] = useState<Step>('start');
  const lead = useRef<Record<string, string>>({});

  const bot = (text: string, step?: Step) => {
    setChat((s) => [...s, { from: 'bot', text }]);
    if (step) setChatStep(step);
  };

  const userSays = (text: string) => {
    setChat((s) => [...s, { from: 'user', text }]);
    setChatInput('');
    const step = chatStep;
    setTimeout(() => {
      if (step === 'name') { lead.current = { ...lead.current, name: text }; bot(`Thanks ${text.split(' ')[0]}. What's the best phone number to reach you on?`, 'phone'); }
      else if (step === 'phone') { lead.current = { ...lead.current, phone: text }; bot('Got it. Which suburb is the job in?', 'suburb'); }
      else if (step === 'suburb') { lead.current = { ...lead.current, suburb: text }; console.log('Chat lead', { ...lead.current }); bot('Perfect, that’s all we need. One of the team will call you shortly with a quote. Anything else I can help with?', 'done'); }
      else if (step === 'question') { bot('Thanks for the question. Our team will answer it when they call. Can I grab your name so we can follow up?', 'name'); }
      else { bot('I can help you get a quote or put you through to the team. Pick an option below, or call 1300 010 393.', 'start'); }
    }, 450);
  };

  const chips =
    chatStep === 'start' || chatStep === 'done'
      ? [
          { label: 'Air conditioning quote', click: () => { setChat((s) => [...s, { from: 'user' as const, text: 'Air conditioning quote' }]); lead.current = { ...lead.current, service: 'Air conditioning' }; setTimeout(() => bot('Great, we supply and install split and ducted systems. What’s your name?', 'name'), 400); } },
          { label: 'Electrical quote', click: () => { setChat((s) => [...s, { from: 'user' as const, text: 'Electrical quote' }]); lead.current = { ...lead.current, service: 'Electrical' }; setTimeout(() => bot('No problem, from power points to switchboards. What’s your name?', 'name'), 400); } },
          { label: 'Ask a question', click: () => { setChat((s) => [...s, { from: 'user' as const, text: 'I have a question' }]); setTimeout(() => bot('Sure, type your question below.', 'question'), 400); } },
          { label: 'Call now', click: () => { window.location.href = 'tel:1300010393'; } },
        ]
      : [];

  return (
    <div className={'lae-chat-dock' + (SITE.stickyBar ? '' : ' no-sticky')}>
      {chatOpen ? (
        <div role="dialog" aria-label="Chat with Links Air" style={sx('width:min(360px,calc(100vw - 32px));height:min(520px,calc(100vh - 180px));background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(8,30,55,.3);display:flex;flex-direction:column;overflow:hidden;animation:lae-fade .2s ease')}>
          <div style={sx('background:#1279BF;color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center')}>
            <div style={sx('display:flex;align-items:center;gap:10px')}>
              <span style={sx('width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-family:Barlow,sans-serif;font-weight:800;color:#1279BF')}>L</span>
              <div>
                <div style={sx('font-family:Barlow,sans-serif;font-weight:700;font-size:16px;line-height:1.1')}>Links Air assistant</div>
                <div style={sx('font-size:12px;color:#C9E2F5;display:flex;align-items:center;gap:5px')}>
                  <span style={sx('width:7px;height:7px;border-radius:50%;background:#9BE04A;display:inline-block')} />
                  Typically replies instantly
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setChatOpen((s) => !s)} aria-label="Close chat" style={sx('width:36px;height:36px;border-radius:10px;border:0;background:rgba(255,255,255,.15);color:#fff;font-size:18px;cursor:pointer')}>×</button>
          </div>
          <div style={sx('flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#F4F7FA')}>
            {chat.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ ...sx('max-width:82%;padding:10px 13px;border-radius:14px;font-size:14.5px;line-height:1.45;white-space:pre-line'), background: m.from === 'user' ? '#1279BF' : '#fff', color: m.from === 'user' ? '#fff' : '#14263A' }}>{m.text}</div>
              </div>
            ))}
            {chips.length > 0 ? (
              <div style={sx('display:flex;flex-wrap:wrap;gap:6px;margin-top:4px')}>
                {chips.map((cItem) => (
                  <button key={cItem.label} type="button" onClick={cItem.click} className="hv-inv" style={sx('background:#fff;border:1px solid #1279BF;color:#1279BF;border-radius:999px;padding:8px 13px;font-size:13.5px;font-weight:600;cursor:pointer')}>{cItem.label}</button>
                ))}
              </div>
            ) : null}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); const t = chatInput.trim(); if (!t) return; userSays(t); }}
            style={sx('display:flex;gap:8px;padding:10px;border-top:1px solid #E1E8F0;background:#fff')}
          >
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message…" aria-label="Message" style={sx('flex:1;padding:12px 14px;border:1px solid #D4DEE8;border-radius:10px;min-width:0')} />
            <button type="submit" aria-label="Send" style={sx('background:#1279BF;color:#fff;border:0;border-radius:10px;width:46px;cursor:pointer;font-weight:800')}>↑</button>
          </form>
        </div>
      ) : null}
      <button type="button" onClick={() => setChatOpen((s) => !s)} aria-label="Chat with us" className="hv-gd" style={sx('height:56px;padding:0 20px 0 16px;border-radius:999px;border:0;background:#78B72A;color:#fff;font-family:Barlow,sans-serif;font-weight:700;font-size:16px;display:flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 12px 30px rgba(14,42,71,.25);animation:lae-pulse 2.4s ease-out infinite')}>
      <span style={sx('width:28px;height:28px;border-radius:50%;background:#fff;color:#78B72A;display:flex;align-items:center;justify-content:center;font-size:15px')}>💬</span>
        {chatOpen ? 'Close chat' : 'Chat with us'}
      </button>
    </div>
  );
}
