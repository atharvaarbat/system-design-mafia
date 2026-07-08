'use client';

import { motion } from 'motion/react';
import DiagramCard, { type DiagramMeta } from '@/components/landing/diagram-card';
import { Section, SectionHeader, fadeUp } from '@/components/landing/diagram-sections/section-shell';

interface DiagramPageSuggestionsProps {
  suggested: DiagramMeta[];
}

export default function DiagramPageSuggestions({ suggested }: DiagramPageSuggestionsProps) {
  return (
    <Section className="">
      <SectionHeader label="Explore" title="More Patterns" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {suggested.map((diagram) => (
          <motion.article
            key={diagram.slug}
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
          >
            <DiagramCard diagram={diagram} />
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
