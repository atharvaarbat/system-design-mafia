import { motion } from 'motion/react';
import MicroservicesDiagram from './microservices';
import UrlShorteningDiagram from './url-shortening';
import EventDrivenDiagram from './event-driven';
import CqrsDiagram from './cqrs';
import HexagonalDiagram from './hexagonal';
import LayeredDiagram from './layered';
import NetflixDiagram from './netflix';
import InstagramDiagram from './instagram';
import diagrams from '@/data/diagrams/index.json';

const visualMap: Record<string, () => React.ReactNode> = {
  'e-commerce-microservices': MicroservicesDiagram,
  'URL-shortening-service-like-tinyURL': UrlShorteningDiagram,
  'event-driven-architecture': EventDrivenDiagram,
  'cqrs-pattern': CqrsDiagram,
  'hexagonal-architecture': HexagonalDiagram,
  'layered-architecture': LayeredDiagram,
  'design-youtube-or-netflix': NetflixDiagram,
  'design-instagram': InstagramDiagram,
};

export default function DiagramVisual({ slug }: { slug: string }) {
  const meta = diagrams.diagrams.find((d) => d.slug === slug);

  if (meta?.image) {
    return (
      <img
        src={meta.image}
        alt={meta.title}
        className="h-full w-full object-cover"
      />
    );
  }

  const Component = visualMap[slug];
  if (!Component) return null;
  return (
    <motion.div
      className='h-full w-full backdrop-contrast-[1.3] contrast-[1.3] flex items-center justify-center'
      whileHover="hover"
    >
      <Component />
    </motion.div>
  );
}
