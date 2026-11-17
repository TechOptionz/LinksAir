'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { sx } from '@/lib/sx';
import { AI_SETTINGS_API } from '@/lib/site';
import { MarkdownEditor } from './MarkdownEditor';

type DocKey = 'kb' | 'rules';
type Doc = { content: string; updated_at: string; updated_by: string };
type Docs = Record<DocKey, Doc>;
type Part = { id: string; title: string; heading: string; body: string };

// The knowledge base is one markdown document split on "## N. Title" headings; the reply rules on their
// capital-letter headings. Each part is edited on its own, then the whole document is put back together in
// the same order and saved, so the assistant's workflow keeps reading one document per kind.
const KB_SPLIT = /^(?=## \d+\.)/m;
const RULES_SPLIT = /^(?=[A-Z][A-Z0-9 &'():/,.-]{6,}$)/m;

const KB_USED_BY_AI = ['1', '2', '3', '5'];
const KB_HINTS: Record<string, string> = {
  '1': 'Phone numbers, licences, service areas and hours the assistant may mention.',
  '2': 'What you offer and what you do not. The assistant only quotes for work listed here.',
  '3': 'The only prices the assistant will ever give. Keep this current.',
  '4': 'Reference for your team. Not read by the assistant.',
  '5': 'What the assistant asks a customer for before it can price a job.',
  '6': 'For your team. Not read by the assistant.',
  '7': 'For your team. The assistant follows the Reply rules further down.',
  '8': 'For your team. Not read by the assistant.',
  '9': 'Questions still to settle. When a price is decided, write it into the price list.',
};

const CARD = sx('background:#fff;border:1px solid #E1E8F0;border-radius:16px;padding:22px;box-shadow:0 8px 24px rgba(8,30,55,.06)');
const INPUT = sx('padding:11px 13px;border:1px solid #D4DEE8;border-radius:10px;width:100%;background:#fff;color:#14263A');
const TA = sx('padding:13px 14px;border:1px solid #D4DEE8;border-radius:10px;width:100%;background:#fff;color:#14263A;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13.5px;line-height:1.55;resize:vertical;min-height:160px');
const BTN = sx('background:#E32027;color:#fff;border:0;border-radius:12px;padding:12px 20px;font-family:var(--font-heading);font-weight:700;font-size:15px;cursor:pointer');
const BTN_OFF = sx('background:#E1E8F0;color:#5F7187;border:0;border-radius:12px;padding:12px 20px;font-family:var(--font-heading);font-weight:700;font-size:15px;cursor:default');
const LABEL = sx('font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5F7187');

function splitDoc(text: string, re: RegExp, prefix: string): { preamble: string; parts: Part[] } {
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

export function AiSettingsEditor() {
  const key = useSearchParams().get('key') ?? '';
  const url = key ? `${AI_SETTINGS_API.replace(/\/$/, '')}/linksair-ai-${key}` : '';
  const [docs, setDocs] = useState<Docs | null>(null);
  const [kb, setKb] = useState<{ preamble: string; parts: Part[] }>({ preamble: '', parts: [] });
  const [rules, setRules] = useState<{ preamble: string; parts: Part[] }>({ preamble: '', parts: [] });
  const [name, setName] = useState('');
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  // sections the owner has typed in since the last save (the editor may reformat Markdown slightly, so text comparison is not used)
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [asText, setAsText] = useState<Set<string>>(new Set());

  const fetchDocs = useCallback(async (): Promise<Docs> => {
    const r = await fetch(`${url}?format=json`, { cache: 'no-store' });
    if (!r.ok) throw new Error(`${r.status}`);
    return (await r.json()) as Docs;
  }, [url]);

  useEffect(() => {
    if (!url) return;
    let active = true;
    fetchDocs()
      .then((d) => {
        if (!active) return;
        setDocs(d);
        setKb(splitDoc(d.kb.content, KB_SPLIT, 'kb'));
        setRules(splitDoc(d.rules.content, RULES_SPLIT, 'rules'));
      })
      .catch(() => {
        if (active) setStatus({ text: 'Could not load the settings. Check the link is the one you were given.', ok: false });
      });
    return () => {
      active = false;
    };
  }, [url, fetchDocs]);

  const isDirty = (_doc: DocKey, part: Part) => touched.has(part.id);

  const save = async (doc: DocKey, part: Part) => {
    if (!url) return;
    setBusy(part.id);
    setStatus(null);
    const whole = doc === 'kb' ? joinDoc(kb.preamble, kb.parts) : joinDoc(rules.preamble, rules.parts);
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, doc, content: whole, updated_by: name.trim() || 'owner' }) });
      const d = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || !d.ok) throw new Error(d.error ?? `${r.status}`);
      setStatus({ text: `"${clean(part.title)}" saved. The next email the assistant answers will use it.`, ok: true });
      setTouched((t) => {
        const n = new Set(t);
        n.delete(part.id);
        return n;
      });
      setDocs(await fetchDocs());
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
  const toggleText = (id: string) =>
    setAsText((t) => {
      const n = new Set(t);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  if (!url) return <p style={sx('color:#C4161C')}>This page needs the private link you were given (it ends with ?key=…).</p>;
  if (!docs) return <p style={sx(status && !status.ok ? 'color:#C4161C' : 'color:#5F7187')}>{status?.text ?? 'Loading…'}</p>;

  const groups: { doc: DocKey; title: string; intro: string; parts: Part[]; meta: Doc }[] = [
    { doc: 'kb', title: 'Knowledge base', intro: 'Facts about the business. Sections marked "read by the assistant" are what it quotes from.', parts: kb.parts, meta: docs.kb },
    { doc: 'rules', title: 'Reply rules', intro: 'How every reply is written. The assistant follows all of these.', parts: rules.parts, meta: docs.rules },
  ];

  const card = (doc: DocKey, part: Part, index: number) => {
    const num = doc === 'kb' ? (part.title.match(/^(\d+)\./)?.[1] ?? '') : '';
    const usedByAi = doc === 'rules' || KB_USED_BY_AI.includes(num);
    const hint = doc === 'kb' ? KB_HINTS[num] : undefined;
    const dirty = isDirty(doc, part);
    const rows = Math.min(40, Math.max(8, part.body.split('\n').length + 1));
    const text = asText.has(part.id);
    return (
      <article id={part.id} key={part.id} style={{ ...CARD, scrollMarginTop: 20 }}>
        <div style={sx('display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;margin-bottom:14px')}>
          <span style={sx(`width:34px;height:34px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-weight:700;font-size:14px;flex-shrink:0;background:${usedByAi ? '#1279BF' : '#EEF3F8'};color:${usedByAi ? '#fff' : '#5F7187'}`)}>
            {num || index + 1}
          </span>
          <div style={sx('flex:1;min-width:200px')}>
            <h3 style={sx('font-size:19px;font-weight:700;color:#14263A')}>{clean(part.title)}</h3>
            {hint ? <p style={sx('font-size:14px;color:#5B6E82;margin-top:3px')}>{hint}</p> : null}
          </div>
          <span style={sx(`font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:6px 10px;border-radius:999px;white-space:nowrap;background:${usedByAi ? '#EAF7DC' : '#EEF3F8'};color:${usedByAi ? '#386A0A' : '#5F7187'}`)}>
            {usedByAi ? 'Read by the assistant' : 'For your team'}
          </span>
        </div>
        {text ? (
          <textarea style={TA} rows={rows} spellCheck={false} value={part.body} onChange={(e) => update(doc, part.id, e.target.value)} aria-label={clean(part.title)} />
        ) : (
          <MarkdownEditor value={part.body} onChange={(md) => update(doc, part.id, md)} label={clean(part.title)} />
        )}
        <div style={sx('display:flex;align-items:center;gap:14px;margin-top:12px;flex-wrap:wrap')}>
          <button type="button" className={dirty ? 'hv-redd' : undefined} style={dirty && busy === null ? BTN : BTN_OFF} disabled={busy !== null || !dirty} onClick={() => void save(doc, part)}>
            {busy === part.id ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
          </button>
          {dirty ? <span style={sx('font-size:13px;color:#C4161C;font-weight:700')}>Unsaved changes</span> : null}
          <button type="button" onClick={() => toggleText(part.id)} className="hv-bd" style={sx('margin-left:auto;background:none;border:0;padding:0;color:#5F7187;font-size:13px;cursor:pointer;text-decoration:underline')}>
            {text ? 'Back to the editor' : 'Edit as text'}
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="lae-ai-grid">
      <aside style={sx('position:sticky;top:20px;display:flex;flex-direction:column;gap:16px')}>
        <label style={{ ...CARD, display: 'grid', gap: 6 }}>
          <span style={LABEL}>Your name</span>
          <input style={INPUT} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Zam" />
          <small style={sx('font-size:12.5px;color:#5F7187')}>Shown as who last changed a section</small>
        </label>
        {groups.map((g) => (
          <nav key={g.doc} aria-label={g.title} style={{ ...CARD, padding: '16px 14px 12px', display: 'grid', gap: 2 }}>
            <span style={{ ...LABEL, marginBottom: 6 }}>{g.title}</span>
            {g.parts.map((p) => (
              <a key={p.id} href={`#${p.id}`} className="hv-bb" style={sx('display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;font-size:14px;color:#14263A')}>
                {clean(p.title)}
                {isDirty(g.doc, p) ? <i style={sx('width:7px;height:7px;border-radius:50%;background:#E32027;flex-shrink:0')} /> : null}
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
        {status ? (
          <p role="status" style={sx(`padding:12px 16px;border-radius:12px;background:#fff;border:1px solid ${status.ok ? '#78B72A' : '#E32027'};color:${status.ok ? '#386A0A' : '#C4161C'};font-size:14.5px`)}>
            {status.text}
          </p>
        ) : null}
        {groups.map((g) => (
          <section key={g.doc} style={sx('display:flex;flex-direction:column;gap:16px')}>
            <div>
              <h2 style={sx('font-size:clamp(22px,3vw,30px);font-weight:800;color:#14263A')}>{g.title}</h2>
              <p style={sx('color:#5B6E82;margin-top:6px;max-width:720px')}>{g.intro}</p>
            </div>
            {g.parts.map((p, i) => card(g.doc, p, i))}
          </section>
        ))}
      </div>
    </div>
  );
}
