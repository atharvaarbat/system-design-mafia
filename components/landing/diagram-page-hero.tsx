'use client';

import { useCallback } from 'react';
import Heading from '@/components/landing/heading';
import { fadeUp, staggerContainer } from '@/components/landing/diagram-sections/section-shell';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

interface SectionIndexItem {
  id: string;
  label: string;
}

interface DiagramPageHeroProps {
  title: string;
  description?: string;
  sectionIndex: SectionIndexItem[];
}

export default function DiagramPageHero({ title, description, sectionIndex }: DiagramPageHeroProps) {
  const handleIndexClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [],
  );

  return (
    <div>
      {/* Back link + breadcrumb: the mono metadata layer */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 font-mono"
      >
        <Link
          href="/patterns"
          className="text-muted-foreground hover:text-foreground -ml-1 inline-flex items-center gap-1.5 px-1 py-1.5 text-xs tracking-wider transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to patterns
        </Link>
        <div className="mt-4 flex items-center gap-2 text-xs tracking-widest uppercase">
          <span className="text-foreground/45">~/patterns</span>
          <span className="text-foreground/45">/</span>
          <span className="text-primary">
            {title.toLowerCase().replace(/\s+/g, '-')}
          </span>
        </div>
      </motion.div>

      {/* Title + description: the reading layer */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeUp} className="max-w-4xl">
          <Heading as="h1" variant="big" className="text-foreground font-doto font-black text-balance">
            {title}
          </Heading>
        </motion.div>

        {description && (
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-[60ch] font-sans text-base leading-relaxed text-foreground/70 text-pretty md:text-lg md:leading-8"
          >
            {description}
          </motion.p>
        )}
      </motion.div>

      {/* Section index */}
      {sectionIndex.length > 0 && (
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          aria-label="Page sections"
          className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2.5 font-mono text-xs tracking-wider"
        >
          <span className="text-foreground/45 uppercase text-[11px] tracking-[0.18em]">On this page</span>
          {sectionIndex.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => handleIndexClick(e, s.id)}
              className="text-foreground/60 underline decoration-foreground/20 decoration-dotted underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/50"
            >
              {s.label}
            </a>
          ))}
        </motion.nav>
      )}
    </div>
  );
}
