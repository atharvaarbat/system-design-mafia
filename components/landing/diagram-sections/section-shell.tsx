'use client';

import { motion, type Variants } from 'motion/react';
import Heading from '@/components/landing/heading';
import { Scales } from '@/components/ui/scales';

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
  className = 'pb-8',
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
  index,
}: {
  label: string;
  title: string;
  index?: string;
}) {
  return (
    <motion.div variants={fadeUp} className="mb-8">
      <div className="mb-1 flex items-center gap-3 text-xs tracking-widest text-foreground/30 uppercase px-2">
        <span className="text-primary">{'//'}</span>
        <span>{label}</span>
        {index && <span className="text-foreground/20">{index}</span>}
      </div>
      <Heading as="h2" variant="medium" className="text-foreground relative px-2">
        {title}
       
        <div className="absolute inset-x-0 -top-7 h-17 w-[100%] mask-r-from-40% mask-l-from-100%">
          <Scales size={8} className="" />
        </div>
      </Heading>
    </motion.div>
  );
}
