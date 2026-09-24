import type { Metadata } from 'next';
import Link from 'next/link';
import { sx } from '@/lib/sx';

export const metadata: Metadata = { title: 'Thank You' };

export default function ThankYouPage() {
  return (
    <div style={sx('max-width:720px;margin:0 auto;padding:clamp(56px,10vw,120px) 20px;text-align:center')}>
      <div style={sx('width:72px;height:72px;border-radius:50%;background:#EAF7DC;color:#4E8A12;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;margin:0 auto 20px')}>✓</div>
      <h1 style={sx('font-size:clamp(30px,4.4vw,48px);font-weight:800;margin-bottom:12px')}>Thank you for contacting us</h1>
      <p style={sx('font-size:18px;color:#3E5166;margin-bottom:28px')}>We will get back to you soon. For anything urgent, call us now on <a href="tel:0447440050" style={sx('font-weight:700')}>0447 440 050</a>.</p>
      <Link href="/" style={sx('display:inline-block;background:#1279BF;color:#fff;border-radius:12px;padding:15px 26px;font-family:var(--font-heading);font-weight:700;font-size:17px')}>Back to home</Link>
    </div>
  );
}
