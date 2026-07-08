import { promises as fs } from 'fs';
import path from 'path';
import type { SystemDesign } from '@/types/diagram';

const DIAGRAMS_DIR = path.join(process.cwd(), 'data', 'diagrams');

export interface DiagramMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  nodeCount: number;
  edgeCount: number;
  image?: string;
}

export interface DiagramIndex {
  diagrams: DiagramMeta[];
}

export async function getDiagramIndex(): Promise<DiagramIndex> {
  const content = await fs.readFile(
    path.join(DIAGRAMS_DIR, 'index.json'),
    'utf-8',
  );
  return JSON.parse(content) as DiagramIndex;
}

export async function getDiagram(slug: string): Promise<SystemDesign | null> {
  try {
    const content = await fs.readFile(
      path.join(DIAGRAMS_DIR, `${slug}.json`),
      'utf-8',
    );
    return JSON.parse(content) as SystemDesign;
  } catch {
    return null;
  }
}

export async function getDiagramMeta(slug: string): Promise<DiagramMeta | null> {
  const index = await getDiagramIndex();
  return index.diagrams.find((d) => d.slug === slug) ?? null;
}
