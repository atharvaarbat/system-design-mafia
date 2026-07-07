import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Architecture Patterns Library',
  description: 'Browse a curated collection of system design architecture patterns. Filter by difficulty, search by name or tag. From microservices to event-driven architecture.',
  openGraph: {
    title: 'Architecture Patterns Library — System Design Mafia',
    description: 'Browse a curated collection of system design architecture patterns. Filter by difficulty, search by name or tag. From microservices to event-driven architecture.',
    url: '/patterns',
    images: ['/logo.png'],
  },
  twitter: {
    title: 'Architecture Patterns Library — System Design Mafia',
    description: 'Browse a curated collection of system design architecture patterns. Filter by difficulty, search by name or tag. From microservices to event-driven architecture.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: '/patterns',
  },
};

export default function PatternsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
