'use client';

import { motion, type Variants } from 'motion/react';
import Heading from '@/components/landing/heading';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

export function Section({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className={`scroll-mt-28 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div variants={fadeUp} className="mb-8 max-w-3xl">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-foreground/45 uppercase">
        <span className="text-primary">{'//'}</span>
        <span>{label}</span>
      </div>
      <Heading
        as="h2"
        variant="medium"
        className="font-semibold tracking-tight text-foreground text-balance"
      >
        {title}
      </Heading>
      {description && (
        <p className="mt-3 max-w-[65ch] text-[15px] leading-7 text-foreground/60 text-pretty">
          {description}
        </p>
      )}
    </motion.div>
  );
}
