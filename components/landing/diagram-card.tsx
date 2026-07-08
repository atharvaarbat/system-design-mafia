import Link from 'next/link';
import DiagramVisual from './diagram-visuals';

interface DiagramMeta {
  slug: string;
  title: string;
  description: string;
  difficulty?: string;
  nodeCount?: number;
  edgeCount?: number;
}

interface DiagramCardProps {
  diagram: DiagramMeta;
  index?: number;
  showDetails?: boolean;
}

export default function DiagramCard({ diagram, index, showDetails = false }: DiagramCardProps) {
  return (
    <Link
      href={`/d/${diagram.slug}`}
      className="block h-full"
      aria-label={`View ${diagram.title} architecture diagram`}
    >
      <div className="group relative flex h-full flex-col border border-foreground/10 bg-background/60 backdrop-blur-[2px] transition-colors duration-500 ease-out hover:border-primary/30 hover:bg-primary/[0.03]">
        <figure className="diagram-card-visual relative aspect-[4/3] overflow-hidden border-b border-foreground/5">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
          <DiagramVisual slug={diagram.slug} />
          {index !== undefined && (
            <span className="absolute top-3 left-3 z-10 font-doto text-2xl font-black text-foreground/15 transition-colors duration-500 group-hover:text-primary/40">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </figure>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold tracking-wide text-foreground uppercase line-clamp-1">
              {diagram.title}
            </h3>
            {showDetails && diagram.difficulty && (
              <span className="mt-0.5 shrink-0 text-[9px] font-bold tracking-[0.2em] text-primary/70 uppercase">
                [{diagram.difficulty}]
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {diagram.description}
          </p>
          {showDetails && (
            <p className="mt-auto pt-3 text-[10px] tracking-[0.2em] text-foreground/30 uppercase">
              {diagram.nodeCount} nodes · {diagram.edgeCount} edges
            </p>
          )}
        </div>

        <div className="absolute right-0 top-0 m-3 h-2 w-2 rounded-full border border-foreground/10 bg-foreground/5 transition-all duration-400 group-hover:scale-150 group-hover:border-primary group-hover:bg-primary" />
      </div>
    </Link>
  );
}
