import type { CSSProperties } from 'react';

// Parses a plain CSS declaration string (exactly as written in the original
// template) into a React style object, so the source styles stay verbatim.
const cache = new Map<string, CSSProperties>();

export function sx(css: string): CSSProperties {
  const hit = cache.get(css);
  if (hit) return hit;
  const o: Record<string, string> = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const k = decl.slice(0, i).trim();
    const v = decl.slice(i + 1).trim();
    if (!k || !v) continue;
    o[k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = v;
  }
  cache.set(css, o);
  return o;
}
