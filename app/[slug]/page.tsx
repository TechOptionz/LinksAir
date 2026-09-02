import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AREAS, areaModel, contentModel, contentSlugs } from '@/lib/content';
import ContentArticle from '@/components/ContentArticle';
import AreaArticle from '@/components/AreaArticle';

export const dynamicParams = false;

export function generateStaticParams() {
  return contentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = AREAS.includes(slug) ? areaModel(slug).title : contentModel(slug).title;
  return { title };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!contentSlugs().includes(slug)) notFound();
  if (AREAS.includes(slug)) {
    const m = areaModel(slug);
    return <AreaArticle title={m.title} areaGroups={m.areaGroups} areaParas={m.areaParas} />;
  }
  return <ContentArticle page={contentModel(slug)} />;
}
