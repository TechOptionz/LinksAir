import Link from 'next/link';
import { sx } from '@/lib/sx';

export default function NotFound() {
  return (
    <div style={sx('max-width:720px;margin:0 auto;padding:clamp(56px,10vw,120px) 20px;text-align:center')}>
      <h1 style={sx('font-size:clamp(30px,4.4vw,48px);font-weight:800;margin-bottom:12px')}>Page not found</h1>
      <p style={sx('font-size:18px;color:#3E5166;margin-bottom:28px')}>That page doesn&apos;t exist. Try the menu, or call us on 1300 010 393.</p>
      <Link href="/" style={sx('display:inline-block;background:#1279BF;color:#fff;border-radius:12px;padding:15px 26px;font-family:var(--font-heading);font-weight:700;font-size:17px')}>Back to home</Link>
    </div>
  );
}
