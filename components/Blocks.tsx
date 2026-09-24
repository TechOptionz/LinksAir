import Image from 'next/image';
import { sx } from '@/lib/sx';
import type { Shaped } from '@/lib/content';
import { blur } from '@/lib/images';

/** Renders shaped content blocks — 'content' variant matches the service/about
 *  page layout, 'post' matches the blog post layout (both ported verbatim). */
export default function Blocks({ blocks, variant }: { blocks: Shaped[]; variant: 'content' | 'post' }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.isH2) return <h2 key={i} style={sx('font-size:clamp(24px,2.6vw,30px);font-weight:700;color:#14263A;margin-top:14px')}>{b.text}</h2>;
        if (b.isH3) return <h3 key={i} style={sx('font-size:21px;font-weight:700;color:#14263A;margin-top:8px')}>{b.text}</h3>;
        if (b.isP) return <p key={i} style={sx('text-wrap:pretty')}>{b.text}</p>;
        if (b.isImg && b.img) {
          return (
            <figure key={i} style={sx('margin:6px 0;border-radius:18px;overflow:hidden;border:1px solid #E1E8F0;background:#fff;box-shadow:0 12px 32px rgba(8,30,55,.08)')}>
              <Image
                src={b.img.src}
                alt={b.alt || ''}
                width={b.img.width}
                height={b.img.height}
                {...blur(b.img)}
                sizes="(max-width: 900px) 100vw, 820px"
                style={sx('width:100%;height:auto;display:block')}
              />
            </figure>
          );
        }
        if (b.isTable) {
          return (
            <div key={i} style={sx('overflow-x:auto;max-width:100%;border:1px solid #E1E8F0;border-radius:12px;background:#fff;-webkit-overflow-scrolling:touch')}>
              <table style={sx('width:100%;border-collapse:collapse;font-size:15.5px;min-width:520px')}>
                {b.head ? (
                  <thead>
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} style={sx('text-align:left;padding:12px 16px;font-family:var(--font-heading);font-weight:700;font-size:14px;letter-spacing:.02em;color:#14263A;background:#F4F7FA;border-bottom:1px solid #E1E8F0')}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {(b.rows || []).map((r, j) => (
                    <tr key={j}>
                      {r.map((c, k) => (
                        <td key={k} style={sx('padding:12px 16px;border-top:1px solid #EDF1F5;vertical-align:top;line-height:1.5' + (k === 0 ? ';font-weight:700;color:#14263A' : ''))}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (b.isUl) {
          if (variant === 'post') {
            return (
              <ul key={i} style={sx('display:flex;flex-direction:column;gap:6px')}>
                {(b.items || []).map((it: string, j: number) => <li key={j}>{it}</li>)}
              </ul>
            );
          }
          return (
            <ul key={i} style={sx('list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:8px 18px')}>
              {(b.items || []).map((it: string, j: number) => (
                <li key={j} style={sx('display:flex;gap:10px;align-items:flex-start')}>
                  <span style={sx('color:#78B72A;font-weight:800;flex-shrink:0;margin-top:1px')}>✓</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.isOl) {
          if (variant === 'post') {
            return (
              <ol key={i} style={sx('display:flex;flex-direction:column;gap:6px')}>
                {(b.steps || []).map((st) => <li key={st.n}>{st.text}</li>)}
              </ol>
            );
          }
          return (
            <ol key={i} style={sx('display:flex;flex-direction:column;gap:10px;padding-left:0;list-style:none')}>
              {(b.steps || []).map((st) => (
                <li key={st.n} style={sx('display:flex;gap:14px;align-items:flex-start;background:#fff;border:1px solid #E1E8F0;border-radius:12px;padding:14px 16px')}>
                  <span style={sx('width:30px;height:30px;border-radius:50%;background:#1279BF;color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-weight:700;flex-shrink:0')}>{st.n}</span>
                  <span>{st.text}</span>
                </li>
              ))}
            </ol>
          );
        }
        if (b.isKv) {
          return (
            <div key={i} style={sx('border:1px solid #E1E8F0;border-radius:12px;overflow:hidden;background:#fff')}>
              {(b.kvRows || []).map((r, j) => (
                <div key={j} style={sx('display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px;border-top:1px solid #EDF1F5;font-size:15.5px')}>
                  <span style={sx('font-weight:700;color:#14263A')}>{r.k}</span>
                  <span>{r.v}</span>
                </div>
              ))}
            </div>
          );
        }
        if (b.isFaq) {
          return (
            <div key={i} style={sx('display:flex;flex-direction:column;gap:8px')}>
              {((b.items || []) as { q: string; a: string }[]).map((f, j) => (
                <details key={j} style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:12px;padding:0 18px')}>
                  {variant === 'post' ? (
                    <summary style={sx('padding:14px 0;font-weight:700;font-size:16.5px;color:#14263A;display:flex;justify-content:space-between;gap:12px')}>{f.q}<span className="lae-plus" style={sx('color:#1279BF')}>+</span></summary>
                  ) : (
                    <summary style={sx('padding:14px 0;font-weight:700;font-size:16.5px;color:#14263A;display:flex;justify-content:space-between;gap:12px;align-items:center')}>{f.q}<span className="lae-plus" style={sx('color:#1279BF;font-size:18px')}>+</span></summary>
                  )}
                  <p style={sx('padding:0 0 16px;font-size:16px')}>{f.a}</p>
                </details>
              ))}
            </div>
          );
        }
        return null;
      })}
    </>
  );
}
