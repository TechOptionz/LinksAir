'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { sx } from '@/lib/sx';
import { AI_SETTINGS_API } from '@/lib/site';
import { MarkdownEditor } from './MarkdownEditor';

type DocKey = 'kb' | 'rules';
type Doc = { content: string; updated_at: string; updated_by: string };
type Docs = Record<DocKey, Doc>;
type Part = { id: string; title: string; heading: string; body: string };
type Split = { preamble: string; parts: Part[] };
type Version = { content: string; updated_at: string; updated_by: string; replaced_at: string };
type LogRow = { at: string; mailbox: string; from: string; subject: string; status: string; reply: string };
type TestResult = { status: string; why?: string; service?: string; missing_info?: string; reply_subject?: string; reply_body?: string };

// The knowledge base is one markdown document split on "## N. Title" headings; the reply rules on their
// capital-letter headings. Each part is edited on its own, then the whole document is put back together in
// the same order and saved, so the assistant's workflow keeps reading one document per kind.
const KB_SPLIT = /^(?=## \d+\.)/m;
const RULES_SPLIT = /^(?=[A-Z][A-Z0-9 &'():/,.-]{6,}$)/m;
const NEEDS_ANSWER = /\b(CONFIRM|TBC)\b/g;

const KB_USED_BY_AI = ['1', '2', '3', '5'];
const KB_HINTS: Record<string, string> = {
  '1': 'Phone numbers, licences, service areas and hours the assistant may mention.',
  '2': 'What you offer and what you do not. The assistant only quotes for work listed here.',
  '3': 'The only prices the assistant will ever give. Keep this current.',
  '4': 'Reference for your team. Not read by the assistant.',
  '5': 'What the assistant asks a customer for before it can price a job.',
  '6': 'For your team. Not read by the assistant.',
  '7': 'For your team. The assistant follows the rules under "How replies are written".',
  '8': 'For your team. Not read by the assistant.',
  '9': 'Questions still to settle. When a price is decided, write it into the price list and delete the question.',
};
const TITLES: Record<DocKey, string> = { kb: 'Business facts & prices', rules: 'How replies are written' };
const INTROS: Record<DocKey, string> = {
  kb: 'Facts about the business. Sections marked "read by the assistant" are what it quotes from.',
  rules: 'The instructions the assistant follows for every reply: what counts as an enquiry, the writing style, price rules and example replies.',
};

const CARD = sx('background:#fff;border:1px solid #E1E8F0;border-radius:16px;padding:22px;box-shadow:0 8px 24px rgba(8,30,55,.06)');
const INPUT = sx('padding:11px 13px;border:1px solid #D4DEE8;border-radius:10px;width:100%;background:#fff;color:#14263A');
const TA = sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;background:#fff;color:#14263A;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13.5px;line-height:1.55;resize:vertical;min-height:160px');
const BTN = sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:12px 20px;font-family:var(--font-heading);font-weight:700;font-size:15px;cursor:pointer');
const BTN_BLUE = sx('background:#1279BF;color:#fff;border:0;border-radius:12px;padding:12px 20px;font-family:var(--font-heading);font-weight:700;font-size:15px;cursor:pointer');
const BTN_OFF = sx('background:#E1E8F0;color:#5F7187;border:0;border-radius:12px;padding:12px 20px;font-family:var(--font-heading);font-weight:700;font-size:15px;cursor:default');
const LINK_BTN = sx('background:none;border:0;padding:0;color:#5F7187;font-size:13px;cursor:pointer;text-decoration:underline');
const LABEL = sx('font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5F7187');

function splitDoc(text: string, re: RegExp, prefix: string): Split {
  const chunks = text.split(re);
  const preamble = chunks.length && !re.test(chunks[0]) ? chunks[0] : '';
  const body = preamble ? chunks.slice(1) : chunks;
  const parts = body
    .filter((c) => c.trim())
    .map((c, i) => {
      const nl = c.indexOf('\n');
      const heading = nl < 0 ? c : c.slice(0, nl);
      return { id: `${prefix}-${i}`, title: heading.replace(/^#+\s*/, '').trim(), heading, body: nl < 0 ? '' : c.slice(nl + 1).replace(/^\n+/, '') };
    });
  return { preamble, parts };
}
function joinDoc(preamble: string, parts: Part[]): string {
  return [preamble.replace(/\s+$/, ''), ...parts.map((p) => (p.heading + '\n\n' + p.body).replace(/\s+$/, ''))].filter(Boolean).join('\n\n') + '\n';
}
const clean = (t: string) => t.replace(/^\d+\.\s*/, '');
const needsAnswer = (text: string) => (text.match(NEEDS_ANSWER) || []).length;
// price list check: a table cell in a column headed "price" or "$" should contain a number
function emptyPriceCells(body: string): number {
  let count = 0;
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*\|/.test(lines[i]) || !/^\s*\|?\s*:?-{2,}/.test(lines[i + 1] || '')) continue;
    const cols = lines[i].split('|').map((c) => c.trim());
    const priceCols = cols.map((c, k) => (/price|\$|cost|install/i.test(c) ? k : -1)).filter((k) => k >= 0);
    if (!priceCols.length) continue;
    for (let r = i + 2; r < lines.length && /^\s*\|/.test(lines[r]); r++) {
      const cells = lines[r].split('|').map((c) => c.trim());
      for (const k of priceCols) if (cells[k] !== undefined && !/\d|n\/a|tbc|confirm|from|ask|quote|poa/i.test(cells[k])) count++;
    }
  }
  return count;
}

export function AiSettingsEditor() {
  const key = useSearchParams().get('key') ?? '';
  const url = key ? `${AI_SETTINGS_API.replace(/\/$/, '')}/linksair-ai-${key}` : '';
  const draftsKey = `linksair-ai-drafts-${key.slice(0, 8)}`;
  const [docs, setDocs] = useState<Docs | null>(null);
  const [kb, setKb] = useState<Split>({ preamble: '', parts: [] });
  const [rules, setRules] = useState<Split>({ preamble: '', parts: [] });
  const [name, setName] = useState('');
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [asText, setAsText] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<{ doc: DocKey; part: Part; versions: Version[] } | null>(null);
  const [test, setTest] = useState<{ text: string; result: TestResult | null; busy: boolean }>({ text: '', result: null, busy: false });
  const [log, setLog] = useState<LogRow[] | null>(null);
  const [restoredDrafts, setRestoredDrafts] = useState(0);

  const fetchDocs = useCallback(async (): Promise<Docs> => {
    const r = await fetch(`${url}?format=json`, { cache: 'no-store' });
    if (!r.ok) throw new Error(`${r.status}`);
    return (await r.json()) as Docs;
  }, [url]);

  // first load: server text, then any unsaved edits kept in this browser from a previous visit
  useEffect(() => {
    if (!url) return;
    let active = true;
    fetchDocs()
      .then((d) => {
        if (!active) return;
        setDocs(d);
        let k = splitDoc(d.kb.content, KB_SPLIT, 'kb');
        let r = splitDoc(d.rules.content, RULES_SPLIT, 'rules');
        try {
          const saved = JSON.parse(localStorage.getItem(draftsKey) || '{}') as Record<string, string>;
          const ids = new Set<string>();
          const apply = (s: Split) => ({ ...s, parts: s.parts.map((p) => (saved[p.id] !== undefined && saved[p.id] !== p.body ? (ids.add(p.id), { ...p, body: saved[p.id] }) : p)) });
          k = apply(k);
          r = apply(r);
          if (ids.size) {
            setTouched(ids);
            setRestoredDrafts(ids.size);
            setOpen(new Set(ids));
          }
        } catch {}
        setKb(k);
        setRules(r);
        setName(localStorage.getItem('linksair-ai-name') || '');
        if (window.innerWidth >= 1024 && !open.size) setOpen((o) => (o.size ? o : new Set(['kb-0', 'kb-2', 'rules-1'])));
      })
      .catch(() => {
        if (active) setStatus({ text: 'Could not load the settings. Check the link is the one you were given.', ok: false });
      });
    fetch(`${url}?format=log`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: LogRow[]) => {
        if (active) setLog(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (active) setLog([]);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, fetchDocs]);

  // unsaved edits survive a refresh or a dropped connection; leaving the page warns
  useEffect(() => {
    try {
      const drafts: Record<string, string> = {};
      for (const p of [...kb.parts, ...rules.parts]) if (touched.has(p.id)) drafts[p.id] = p.body;
      if (Object.keys(drafts).length) localStorage.setItem(draftsKey, JSON.stringify(drafts));
      else localStorage.removeItem(draftsKey);
    } catch {}
  }, [kb, rules, touched, draftsKey]);
  useEffect(() => {
    if (!touched.size) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [touched]);
  useEffect(() => {
    try {
      localStorage.setItem('linksair-ai-name', name);
    } catch {}
  }, [name]);

  const isDirty = (part: Part) => touched.has(part.id);
  const partsOf = (doc: DocKey) => (doc === 'kb' ? kb : rules);

  const saveDoc = async (doc: DocKey, label: string, override?: Split) => {
    if (!url || !docs) return false;
    const s = override ?? partsOf(doc);
    const whole = joinDoc(s.preamble, s.parts);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, doc, content: whole, updated_by: name.trim() || 'owner', expected_updated_at: docs[doc].updated_at }),
    });
    const d = (await r.json()) as { ok?: boolean; error?: string; updated_at?: string; updated_by?: string };
    if (!r.ok || !d.ok) {
      if (d.error === 'changed') {
        throw new Error(`${d.updated_by || 'Someone'} saved "${TITLES[doc]}" at ${d.updated_at} after you opened this page. Reload to see their version, then make your change again.`);
      }
      throw new Error(d.error ?? `${r.status}`);
    }
    setTouched((t) => {
      const n = new Set(t);
      for (const p of s.parts) n.delete(p.id);
      return n;
    });
    setStatus({ text: `${label} saved. The next email the assistant answers will use it.`, ok: true });
    const fresh = await fetchDocs();
    setDocs(fresh);
    return true;
  };

  const save = async (doc: DocKey, part: Part) => {
    if (doc === 'kb' && /^3\./.test(part.title)) {
      const n = emptyPriceCells(part.body);
      if (n && !window.confirm(`${n} price cell${n > 1 ? 's look' : ' looks'} empty or has no number. Save anyway?`)) return;
    }
    setBusy(part.id);
    setStatus(null);
    try {
      await saveDoc(doc, `"${clean(part.title)}"`);
    } catch (e) {
      setStatus({ text: `Not saved: ${e instanceof Error ? e.message : 'unknown error'}`, ok: false });
    } finally {
      setBusy(null);
    }
  };
  const saveAll = async () => {
    setBusy('all');
    setStatus(null);
    try {
      for (const doc of ['kb', 'rules'] as DocKey[]) if (partsOf(doc).parts.some(isDirty)) await saveDoc(doc, TITLES[doc]);
    } catch (e) {
      setStatus({ text: `Not saved: ${e instanceof Error ? e.message : 'unknown error'}`, ok: false });
    } finally {
      setBusy(null);
    }
  };

  const update = (doc: DocKey, id: string, body: string) => {
    const setter = doc === 'kb' ? setKb : setRules;
    setter((s) => ({ ...s, parts: s.parts.map((p) => (p.id === id ? { ...p, body } : p)) }));
    setTouched((t) => (t.has(id) ? t : new Set(t).add(id)));
  };
  const toggleIn = (set: Set<string>, id: string) => {
    const n = new Set(set);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  };

  const openHistory = async (doc: DocKey, part: Part) => {
    try {
      const r = await fetch(`${url}?format=history&doc=${doc}`, { cache: 'no-store' });
      const versions = (await r.json()) as Version[];
      setHistory({ doc, part, versions: Array.isArray(versions) ? versions : [] });
    } catch {
      setStatus({ text: 'Could not load the history.', ok: false });
    }
  };
  const restore = async (v: Version) => {
    if (!history) return;
    const { doc, part } = history;
    const old = splitDoc(v.content, doc === 'kb' ? KB_SPLIT : RULES_SPLIT, doc).parts.find((p) => p.title === part.title);
    if (!old) {
      setStatus({ text: 'That version does not have this section.', ok: false });
      return;
    }
    if (!window.confirm(`Put back "${clean(part.title)}" as it was before ${v.replaced_at} (saved by ${v.updated_by || 'unknown'})?`)) return;
    const s = partsOf(doc);
    const next = { ...s, parts: s.parts.map((p) => (p.id === part.id ? { ...p, body: old.body } : p)) };
    (doc === 'kb' ? setKb : setRules)(next);
    setHistory(null);
    setBusy(part.id);
    try {
      await saveDoc(doc, `"${clean(part.title)}" restored and`, next);
    } catch (e) {
      setStatus({ text: `Not saved: ${e instanceof Error ? e.message : 'unknown error'}`, ok: false });
    } finally {
      setBusy(null);
    }
  };

  const runTest = async () => {
    if (!test.text.trim()) return;
    setTest((t) => ({ ...t, busy: true, result: null }));
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, action: 'test', email_text: test.text, subject: 'Enquiry' }) });
      const d = (await r.json()) as TestResult & { error?: string };
      setTest((t) => ({ ...t, busy: false, result: d.error ? { status: 'failed', why: d.error } : d }));
    } catch (e) {
      setTest((t) => ({ ...t, busy: false, result: { status: 'failed', why: e instanceof Error ? e.message : 'unknown error' } }));
    }
  };

  const q = query.trim().toLowerCase();
  const matches = (p: Part) => !q || p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q);
  const countIn = (p: Part) => (q ? (p.body.toLowerCase().split(q).length - 1) + (p.title.toLowerCase().includes(q) ? 1 : 0) : 0);

  if (!url) return <p style={sx('color:#C4161C')}>This page needs the private link you were given (it ends with ?key=…).</p>;
  if (!docs) return <p style={sx(status && !status.ok ? 'color:#C4161C' : 'color:#5F7187')}>{status?.text ?? 'Loading…'}</p>;

  const groups = (['kb', 'rules'] as DocKey[]).map((doc) => ({ doc, title: TITLES[doc], intro: INTROS[doc], parts: partsOf(doc).parts, meta: docs[doc] }));
  const unsaved = [...kb.parts, ...rules.parts].filter(isDirty);
  const openQuestions = kb.parts.reduce((n, p) => n + needsAnswer(p.body), 0);

  const card = (doc: DocKey, part: Part, index: number) => {
    const num = doc === 'kb' ? (part.title.match(/^(\d+)\./)?.[1] ?? '') : '';
    const usedByAi = doc === 'rules' || KB_USED_BY_AI.includes(num);
    const hint = doc === 'kb' ? KB_HINTS[num] : undefined;
    const dirty = isDirty(part);
    const text = asText.has(part.id);
    const isOpen = open.has(part.id) || !!q;
    const answers = needsAnswer(part.body);
    const rows = Math.min(40, Math.max(8, part.body.split('\n').length + 1));
    return (
      <article id={part.id} key={part.id} style={{ ...CARD, scrollMarginTop: 20, display: matches(part) ? undefined : 'none' }}>
        <div role="button" tabIndex={0} aria-expanded={isOpen} onClick={() => setOpen((o) => toggleIn(o, part.id))} onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => toggleIn(o, part.id))}
          style={sx('display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;cursor:pointer')}>
          <span style={sx(`width:34px;height:34px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-weight:700;font-size:14px;flex-shrink:0;background:${usedByAi ? '#1279BF' : '#EEF3F8'};color:${usedByAi ? '#fff' : '#5F7187'}`)}>
            {num || index + 1}
          </span>
          <div style={sx('flex:1;min-width:200px')}>
            <h3 style={sx('font-size:19px;font-weight:700;color:#14263A')}>{clean(part.title)}</h3>
            {hint ? <p style={sx('font-size:14px;color:#5B6E82;margin-top:3px')}>{hint}</p> : null}
          </div>
          <div style={sx('display:flex;gap:6px;flex-wrap:wrap;align-items:center')}>
            {answers ? <span style={sx('font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:6px 10px;border-radius:999px;background:#FFF1D6;color:#8A5A00;font-weight:700')}>{answers} need{answers === 1 ? 's' : ''} your answer</span> : null}
            {q && countIn(part) ? <span style={sx('font-size:11px;padding:6px 10px;border-radius:999px;background:#EAF7DC;color:#386A0A;font-weight:700')}>{countIn(part)} match{countIn(part) === 1 ? '' : 'es'}</span> : null}
            {dirty ? <span style={sx('font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:6px 10px;border-radius:999px;background:#FDE8E8;color:#C4161C;font-weight:700')}>Unsaved</span> : null}
            <span style={sx(`font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:6px 10px;border-radius:999px;white-space:nowrap;background:${usedByAi ? '#EAF7DC' : '#EEF3F8'};color:${usedByAi ? '#386A0A' : '#5F7187'}`)}>
              {usedByAi ? 'Read by the assistant' : 'For your team'}
            </span>
            <span aria-hidden style={sx(`color:#5F7187;font-size:18px;transition:transform .2s;transform:rotate(${isOpen ? 90 : 0}deg)`)}>›</span>
          </div>
        </div>
        {isOpen ? (
          <div style={sx('margin-top:14px')}>
            {text ? (
              <textarea style={TA} rows={rows} spellCheck={false} value={part.body} onChange={(e) => update(doc, part.id, e.target.value)} aria-label={clean(part.title)} />
            ) : (
              <MarkdownEditor value={part.body} onChange={(md) => update(doc, part.id, md)} label={clean(part.title)} />
            )}
            <div style={sx('display:flex;align-items:center;gap:14px;margin-top:12px;flex-wrap:wrap')}>
              <button type="button" className={dirty ? 'hv-redd' : undefined} style={dirty && busy === null ? BTN : BTN_OFF} disabled={busy !== null || !dirty} onClick={() => void save(doc, part)}>
                {busy === part.id ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
              </button>
              <button type="button" onClick={() => void openHistory(doc, part)} style={LINK_BTN}>History</button>
              <button type="button" onClick={() => setAsText((t) => toggleIn(t, part.id))} style={{ ...LINK_BTN, marginLeft: 'auto' }}>
                {text ? 'Back to the editor' : 'Edit as text'}
              </button>
            </div>
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <div>
      {/* how it works */}
      <div style={sx('display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:28px')}>
        {[
          ['1', 'An enquiry email arrives', 'In the info@ mailbox, from the website form or a customer.'],
          ['2', 'The assistant drafts a reply', 'Using the facts, prices and writing rules on this page. Nothing is sent.'],
          ['3', 'You check and send', 'The draft sits in your Drafts folder. Edit it or send it as is.'],
        ].map(([n, t, d]) => (
          <div key={n} style={{ ...CARD, padding: '16px 18px', display: 'flex', gap: 12 }}>
            <span style={sx('width:30px;height:30px;border-radius:50%;background:#1279BF;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0')}>{n}</span>
            <div>
              <div style={sx('font-family:var(--font-heading);font-weight:700;font-size:16px')}>{t}</div>
              <div style={sx('font-size:13.5px;color:#5B6E82;margin-top:2px')}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="lae-ai-grid">
        <aside style={sx('position:sticky;top:20px;display:flex;flex-direction:column;gap:16px')}>
          <label style={{ ...CARD, display: 'grid', gap: 6 }}>
            <span style={LABEL}>Your name</span>
            <input style={INPUT} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Zam" />
            <small style={sx('font-size:12.5px;color:#5F7187')}>Shown as who last changed a section</small>
          </label>
          <label style={{ ...CARD, display: 'grid', gap: 6 }}>
            <span style={LABEL}>Find</span>
            <input style={INPUT} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. 2.5kW, bracket, Logan" />
            {q ? <small style={sx('font-size:12.5px;color:#5F7187')}>{[...kb.parts, ...rules.parts].filter(matches).length} section(s) mention it</small> : null}
          </label>
          {openQuestions ? (
            <a href="#kb-8" style={{ ...CARD, padding: '14px 16px', background: '#FFF8EA', borderColor: '#F3D9A4', color: '#8A5A00', fontWeight: 700, fontSize: 14 }}>
              {openQuestions} item{openQuestions === 1 ? '' : 's'} marked CONFIRM / TBC need your answer →
            </a>
          ) : null}
          {groups.map((g) => (
            <nav key={g.doc} aria-label={g.title} style={{ ...CARD, padding: '16px 14px 12px', display: 'grid', gap: 2 }}>
              <span style={{ ...LABEL, marginBottom: 6 }}>{g.title}</span>
              {g.parts.map((p) => (
                <a key={p.id} href={`#${p.id}`} className="hv-bb" onClick={() => setOpen((o) => new Set(o).add(p.id))} style={sx('display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;font-size:14px;color:#14263A')}>
                  <span style={sx('flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{clean(p.title)}</span>
                  {needsAnswer(p.body) ? <i style={sx('width:7px;height:7px;border-radius:50%;background:#FFB020;flex-shrink:0')} title="Needs your answer" /> : null}
                  {isDirty(p) ? <i style={sx('width:7px;height:7px;border-radius:50%;background:#E32027;flex-shrink:0')} title="Unsaved" /> : null}
                </a>
              ))}
              <small style={sx('font-size:12.5px;color:#5F7187;margin-top:8px')}>
                Last changed {g.meta.updated_at || '—'}
                {g.meta.updated_by ? ` by ${g.meta.updated_by}` : ''}
              </small>
            </nav>
          ))}
        </aside>

        <div style={sx('display:flex;flex-direction:column;gap:36px;min-width:0')}>
          {restoredDrafts ? (
            <p style={sx('padding:12px 16px;border-radius:12px;background:#FFF8EA;border:1px solid #F3D9A4;color:#8A5A00;font-size:14.5px')}>
              {restoredDrafts} unsaved change{restoredDrafts === 1 ? '' : 's'} from your last visit {restoredDrafts === 1 ? 'was' : 'were'} brought back. Save or discard {restoredDrafts === 1 ? 'it' : 'them'} below.
            </p>
          ) : null}
          {status ? (
            <p role="status" style={sx(`padding:12px 16px;border-radius:12px;background:#fff;border:1px solid ${status.ok ? '#78B72A' : '#E32027'};color:${status.ok ? '#386A0A' : '#C4161C'};font-size:14.5px`)}>
              {status.text}
            </p>
          ) : null}

          {/* try it */}
          <section style={{ ...CARD, borderColor: '#BFE0F5', background: '#F7FBFE' }}>
            <h2 style={sx('font-size:clamp(20px,2.6vw,26px);font-weight:800;color:#14263A')}>Try it</h2>
            <p style={sx('color:#5B6E82;margin:6px 0 12px;max-width:720px')}>Paste a customer email and see the reply the assistant would draft with the facts and rules as they are right now. Nothing is sent or saved.</p>
            <textarea style={{ ...TA, fontFamily: 'inherit', minHeight: 110 }} rows={4} value={test.text} onChange={(e) => setTest((t) => ({ ...t, text: e.target.value }))} placeholder="e.g. Hi, how much to supply and install a 2.5kW split system in a low set house in Logan? Thanks, Sam" aria-label="Sample enquiry" />
            <div style={sx('display:flex;gap:12px;align-items:center;margin-top:10px;flex-wrap:wrap')}>
              <button type="button" className="hv-navy" style={test.busy || !test.text.trim() ? BTN_OFF : BTN_BLUE} disabled={test.busy || !test.text.trim()} onClick={() => void runTest()}>
                {test.busy ? 'Writing the reply… (about 20 seconds)' : 'See the reply'}
              </button>
              {unsaved.length ? <small style={sx('color:#8A5A00;font-size:13px')}>Uses saved text only: save your {unsaved.length} change{unsaved.length === 1 ? '' : 's'} first to test them.</small> : null}
            </div>
            {test.result ? (
              <div style={sx('margin-top:14px;background:#fff;border:1px solid #D4DEE8;border-radius:12px;padding:16px')}>
                {test.result.status === 'enquiry' ? (
                  <>
                    <div style={sx('font-size:13px;color:#5F7187;margin-bottom:8px')}>
                      Subject: <b style={sx('color:#14263A')}>{test.result.reply_subject}</b>
                      {test.result.service ? ` · ${test.result.service}` : ''}
                      {test.result.missing_info ? ` · would ask for: ${test.result.missing_info}` : ''}
                    </div>
                    <pre style={sx('white-space:pre-wrap;font-family:inherit;font-size:15px;line-height:1.55;margin:0;color:#14263A')}>{test.result.reply_body}</pre>
                  </>
                ) : test.result.status === 'not_enquiry' ? (
                  <p style={sx('color:#14263A')}>The assistant would <b>not</b> reply to this: it does not look like a customer enquiry ({test.result.why}).</p>
                ) : (
                  <p style={sx('color:#C4161C')}>The test did not work: {test.result.why}</p>
                )}
              </div>
            ) : null}
          </section>

          {groups.map((g) => (
            <section key={g.doc} style={sx('display:flex;flex-direction:column;gap:16px')}>
              <div style={sx('display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap')}>
                <div style={sx('flex:1;min-width:240px')}>
                  <h2 style={sx('font-size:clamp(22px,3vw,30px);font-weight:800;color:#14263A')}>{g.title}</h2>
                  <p style={sx('color:#5B6E82;margin-top:6px;max-width:720px')}>{g.intro}</p>
                </div>
                <button type="button" style={LINK_BTN} onClick={() => setOpen((o) => { const n = new Set(o); const all = g.parts.every((p) => n.has(p.id)); for (const p of g.parts) all ? n.delete(p.id) : n.add(p.id); return n; })}>
                  {g.parts.every((p) => open.has(p.id)) ? 'Collapse all' : 'Expand all'}
                </button>
              </div>
              {g.parts.map((p, i) => card(g.doc, p, i))}
            </section>
          ))}

          {/* recent replies */}
          <section style={sx('display:flex;flex-direction:column;gap:12px')}>
            <div>
              <h2 style={sx('font-size:clamp(22px,3vw,30px);font-weight:800;color:#14263A')}>Recent replies the assistant drafted</h2>
              <p style={sx('color:#5B6E82;margin-top:6px;max-width:720px')}>The last drafts it wrote, newest first. Each one was saved to the mailbox&apos;s Drafts folder for a person to check.</p>
            </div>
            {log === null ? (
              <p style={sx('color:#5F7187')}>Loading…</p>
            ) : log.length === 0 ? (
              <p style={{ ...CARD, color: '#5F7187' }}>No drafts yet. They appear here from the next enquiry email on.</p>
            ) : (
              log.map((r, i) => (
                <details key={i} style={CARD}>
                  <summary style={sx('display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:14.5px')}>
                    <span style={sx(`font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:5px 9px;border-radius:999px;font-weight:700;background:${r.status === 'draft' ? '#EAF7DC' : '#FDE8E8'};color:${r.status === 'draft' ? '#386A0A' : '#C4161C'}`)}>{r.status === 'draft' ? 'Draft written' : 'Needs a person'}</span>
                    <b style={sx('color:#14263A')}>{r.subject || '(no subject)'}</b>
                    <span style={sx('color:#5F7187')}>{r.from}</span>
                    <span style={sx('color:#5F7187;margin-left:auto')}>{r.at}</span>
                  </summary>
                  <pre style={sx('white-space:pre-wrap;font-family:inherit;font-size:14.5px;line-height:1.55;margin:12px 0 0;color:#14263A')}>{r.reply}</pre>
                </details>
              ))
            )}
          </section>
        </div>
      </div>

      {/* mobile / global save bar */}
      {unsaved.length ? (
        <div style={sx('position:sticky;bottom:12px;margin-top:24px;display:flex;justify-content:center;pointer-events:none')}>
          <div style={sx('pointer-events:auto;background:#14263A;color:#fff;border-radius:14px;padding:10px 12px 10px 16px;display:flex;gap:12px;align-items:center;box-shadow:0 16px 40px rgba(8,30,55,.3);font-size:14px')}>
            {unsaved.length} unsaved change{unsaved.length === 1 ? '' : 's'}
            <button type="button" className="hv-redd" style={{ ...BTN, padding: '9px 16px', fontSize: 14 }} disabled={busy !== null} onClick={() => void saveAll()}>
              {busy === 'all' ? 'Saving…' : 'Save all'}
            </button>
          </div>
        </div>
      ) : null}

      {/* history */}
      {history ? (
        <div role="dialog" aria-modal="true" aria-label="History" onClick={() => setHistory(null)} style={sx('position:fixed;inset:0;background:rgba(8,30,55,.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px')}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...CARD, width: '100%', maxWidth: 680, maxHeight: '85vh', overflow: 'auto' }}>
            <div style={sx('display:flex;align-items:center;gap:12px;margin-bottom:12px')}>
              <h3 style={sx('font-size:18px;font-weight:700;flex:1')}>History of &quot;{clean(history.part.title)}&quot;</h3>
              <button type="button" onClick={() => setHistory(null)} style={LINK_BTN}>Close</button>
            </div>
            {history.versions.length === 0 ? (
              <p style={sx('color:#5F7187')}>No earlier versions yet. A version is kept every time a save happens.</p>
            ) : (
              history.versions.map((v, i) => {
                const old = splitDoc(v.content, history.doc === 'kb' ? KB_SPLIT : RULES_SPLIT, history.doc).parts.find((p) => p.title === history.part.title);
                const same = old?.body.trim() === history.part.body.trim();
                return (
                  <div key={i} style={sx('border:1px solid #E1E8F0;border-radius:12px;padding:12px 14px;margin-bottom:10px')}>
                    <div style={sx('display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:13.5px;color:#5F7187')}>
                      <span>Replaced {v.replaced_at}</span>
                      <span>· was saved by {v.updated_by || 'unknown'} on {v.updated_at || '—'}</span>
                      <span style={sx('margin-left:auto')}>{same ? 'Same as now' : old ? `${old.body.length.toLocaleString()} characters` : 'Section not in this version'}</span>
                      {old && !same ? <button type="button" className="hv-navy" style={{ ...BTN_BLUE, padding: '7px 12px', fontSize: 13 }} onClick={() => void restore(v)}>Restore this section</button> : null}
                    </div>
                    {old && !same ? <pre style={sx('white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;font-size:12.5px;line-height:1.5;margin:10px 0 0;max-height:180px;overflow:auto;color:#14263A;background:#F8FAFC;padding:10px;border-radius:8px')}>{old.body.slice(0, 3000)}</pre> : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
