'use client';

import { motion } from 'motion/react';
import { Section, SectionHeader, fadeUp } from '@/components/landing/diagram-sections/section-shell';
import Link from 'next/link';

export default function DiagramPageCreator() {
  return (
    <Section>
      <SectionHeader label="A Word" title="From the Creator" />
      <motion.div
        variants={fadeUp}
        className="border border-foreground/5 bg-foreground/1 p-8 text-foreground/80 text-sm leading-relaxed space-y-4"
      >
        <p>
          Every great system starts as a sketch on a whiteboard. The ability to zoom out
          and see the whole picture — how services connect, where data flows, what breaks
          and why — is what separates engineers who build features from engineers who build
          systems. This diagram is more than boxes and arrows. It&apos;s a map of decisions,
          trade-offs, and intentional design.
        </p>
        <p>
          Studying architectures isn&apos;t just about passing interviews. It&apos;s about training
          your intuition. The more systems you take apart, the better you get at sensing
          where a monolith will crack, where a queue belongs, or when a cache is hiding a
          deeper problem. You start seeing patterns instead of chaos.
        </p>
        <p>
          So keep reading, keep tracing those edges, keep asking &quot;why this way and not
          that way.&quot; The engineers who truly understand large systems are the ones who
          never stop being curious about how things fit together. That curiosity is the
          only ingredient that really matters.
        </p>
        <p className="text-foreground/50 italic pt-2 flex gap-2">
          — Atharva Arbat
          <span>
            <Link href="https://x.com/arbat_atharva" className="text-blue-500 underline">
              @arbat_atharva
            </Link>
          </span>
        </p>
      </motion.div>
    </Section>
  );
}
