'use client';

import { useCallback } from 'react';
import Heading from '@/components/landing/heading';
import SubHeading from '@/components/landing/subheading';
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
    <>
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/patterns"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-wider transition-all hover:bg-foreground/3"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to patterns
        </Link>
      </motion.div>

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 text-xs tracking-widest text-foreground/30 uppercase"
      >
        <span className="dark:text-foreground/20 text-foreground/60">~/patterns</span>
        <span className="dark:text-foreground/20 text-foreground/60">/</span>
        <span className="text-primary">
          {title.toLowerCase().replace(/\s+/g, '-')}
        </span>
        <span className="ml-auto border border-foreground/5 bg-foreground/2 px-2 py-0.5 text-[10px] text-foreground/25">
          v1.0
        </span>
      </motion.div>

      {/* Hero */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeUp} className="mb-3 max-w-3xl">
          <Heading as="h1" variant="big" className="text-foreground font-doto font-black">
            {title}
          </Heading>
        </motion.div>

        {description && (
          <motion.div variants={fadeUp} className="max-w-xl">
            <SubHeading variant="big" className="text-pretty">
              {description}
            </SubHeading>
          </motion.div>
        )}
      </motion.div>

      {/* Section index */}
      {sectionIndex.length > 0 && (
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          aria-label="Page sections"
          className="-mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-[11px] tracking-wider"
        >
          <span className="text-foreground/30">Jump to:</span>
          {sectionIndex.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => handleIndexClick(e, s.id)}
              className="text-foreground/45 transition-colors hover:text-primary capitalize"
            >
              <span className="text-primary/60">
                [{String(i + 1).padStart(2, '0')}]
              </span>{' '}
              {s.label}
            </a>
          ))}
        </motion.nav>
      )}
    </>
  );
}
