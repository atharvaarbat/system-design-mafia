import { getDiagramIndex } from '@/lib/diagrams';

export default async function sitemap() {
  const index = await getDiagramIndex();

  const diagramEntries = index.diagrams.map((d) => ({
    url: `https://systemdesignhub.com/d/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://systemdesignhub.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: 'https://systemdesignhub.com/patterns',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...diagramEntries,
  ];
}
