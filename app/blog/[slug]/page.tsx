import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sx } from '@/lib/sx';
import { getPost, postDate, posts, shape } from '@/lib/content';
import QuoteButton from '@/components/QuoteButton';
import Blocks from '@/components/Blocks';

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? post.title : 'Blog' };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const date = postDate(post);
  return (
    <article>
      <section style={sx('background:#1279BF;color:#fff')}>
        <div style={sx('max-width:860px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px')}>
          <nav aria-label="Breadcrumb" style={sx('font-size:13.5px;color:#C9E2F5;margin-bottom:14px')}>
            <Link href="/" style={sx('color:#C9E2F5')}>Home</Link> / <Link href="/our-blog" style={sx('color:#C9E2F5')}>Blog</Link>
          </nav>
          <h1 style={sx('font-size:clamp(28px,4vw,46px);font-weight:800;margin-bottom:12px')}>{post.title}</h1>
          <p style={sx('color:#C9E2F5;font-size:15px')}>{date} · Links Air & Electrical</p>
        </div>
      </section>
      <div style={sx('max-width:860px;margin:0 auto;padding:clamp(32px,5vw,64px) 20px;display:flex;flex-direction:column;gap:18px;font-size:17.5px;color:#2B3F55')}>
        <Blocks blocks={shape(post.blocks)} variant="post" />
        <div style={sx('margin-top:20px;background:#1279BF;color:#fff;border-radius:18px;padding:26px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px')}>
          <div>
            <div style={sx('font-family:Barlow,sans-serif;font-weight:700;font-size:22px')}>Need a hand with this?</div>
            <div style={sx('color:#E3F0FA')}>Licensed technicians across Brisbane and the Gold Coast.</div>
          </div>
          <div style={sx('display:flex;gap:10px;flex-wrap:wrap')}>
            <a href="tel:1300010393" style={sx('background:#fff;color:#0E2A47;border-radius:10px;padding:12px 18px;font-weight:700')}>☏ 1300 010 393</a>
            <QuoteButton style={sx('background:#E32027;color:#fff;border:0;border-radius:10px;padding:12px 18px;font-weight:700;cursor:pointer')}>Get a Free Quote</QuoteButton>
          </div>
        </div>
      </div>
    </article>
  );
}
