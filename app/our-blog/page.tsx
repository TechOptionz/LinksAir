import type { Metadata } from 'next';
import Link from 'next/link';
import { sx } from '@/lib/sx';
import { postCards } from '@/lib/content';

export const metadata: Metadata = { title: 'Blog' };

export default function BlogIndex() {
  const cards = postCards();
  return (
    <div>
      <section style={sx('background:#1279BF;color:#fff')}>
        <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
          <nav aria-label="Breadcrumb" style={sx('font-size:13.5px;color:#C9E2F5;margin-bottom:14px')}>
            <Link href="/" style={sx('color:#C9E2F5')}>Home</Link> / <span style={sx('color:#fff')}>Blog</span>
          </nav>
          <h1 style={sx('font-size:clamp(30px,4.4vw,52px);font-weight:800;margin-bottom:14px')}>Guides & advice</h1>
          <p style={sx('font-size:clamp(16px,1.5vw,19px);color:#E3F0FA;max-width:640px')}>Cost guides, buying advice and safety tips from our air conditioning and electrical team.</p>
        </div>
      </section>
      <div style={sx('max-width:1220px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:18px')}>
        {cards.map((p) => (
          <Link key={p.href} href={p.href} className="hv-card" style={sx('background:#fff;border:1px solid #E1E8F0;border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:10px;color:#14263A')}>
            <span style={sx('font-size:13px;color:#7A8A9C;font-weight:600')}>{p.date} · {p.tag}</span>
            <h2 style={sx('font-size:20px;font-weight:700;line-height:1.25')}>{p.title}</h2>
            <p style={sx('color:#5B6E82;font-size:15px;flex:1')}>{p.excerpt}</p>
            <span style={sx('color:#1279BF;font-weight:700;font-size:15px')}>Read article →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
