import { notFound } from 'next/navigation';
import { getDiagram, getDiagramMeta } from '@/lib/diagrams';
import DiagramPageClient from '@/components/landing/diagram-page-client';

export async function generateStaticParams() {
  const { getDiagramIndex } = await import('@/lib/diagrams');
  const index = await getDiagramIndex();
  return index.diagrams.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = await getDiagramMeta(slug);
  if (!meta) return {};
  const title = `${meta.title} — System Design Mafia`;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    openGraph: {
      title,
      description: meta.description,
      url: `/d/${slug}`,
      images: ['/logo.png'],
    },
    twitter: {
      title,
      description: meta.description,
      images: ['/logo.png'],
    },
    alternates: {
      canonical: `/d/${slug}`,
    },
  };
}

export default async function DiagramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = await getDiagram(slug);

  if (!design) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: design.title,
    description: design.description || `System design architecture diagram and guide for ${design.title}`,
    author: {
      '@type': 'Person',
      name: 'Atharva Arbat',
      url: 'https://x.com/arbat_atharva',
    },
    url: `https://sdmafia.hdtl.in/d/${slug}`,
    image: 'https://sdmafia.hdtl.in/logo.png',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <DiagramPageClient slug={slug} design={design} editable={false} />
    </>
  );
}
