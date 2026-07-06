import MicroservicesDiagram from './microservices';
import UrlShorteningDiagram from './url-shortening';
import EventDrivenDiagram from './event-driven';
import CqrsDiagram from './cqrs';
import HexagonalDiagram from './hexagonal';
import LayeredDiagram from './layered';
import NetflixDiagram from './netflix';
import InstagramDiagram from './instagram';

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
  const Component = visualMap[slug];
  if (!Component) return null;
  return <Component />;
}
