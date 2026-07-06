import { getDiagramIndex } from '@/lib/diagrams';

export default async function sitemap() {
  const index = await getDiagramIndex();

  const diagramEntries = index.diagrams.map((d) => ({
    url: `https://sdmafia.hdtl.in/d/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://sdmafia.hdtl.in',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: 'https://sdmafia.hdtl.in/patterns',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...diagramEntries,
  ];
}
