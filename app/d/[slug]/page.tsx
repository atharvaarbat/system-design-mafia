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
  return {
    title: `${meta.title} — System Design`,
    description: meta.description,
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

  return <DiagramPageClient design={design} editable={false} />;
}
