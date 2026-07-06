'use client';

import Container from './container';
import Heading from './heading';
import SubHeading from './subheading';
import { motion, type Variants } from 'motion/react';
import Link from 'next/link';
import DiagramVisual from './diagram-visuals';
import diagrams from '@/data/diagrams/index.json';

const easePremium = [0.4, 0, 0.2, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  hover: {
    y: -4,
    transition: { duration: 0.5, ease: easePremium },
  },
};

export default function DiagramCards() {
  return (
    <section id="diagram-cards" className="relative flex w-full flex-col py-32 font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="absolute top-24 right-0 left-0 hidden h-px bg-foreground/5 lg:block" />
      <div className="absolute right-0 bottom-24 left-0 hidden h-px bg-foreground/5 lg:block" />
      <div className="absolute top-0 bottom-0 left-8 hidden w-px bg-foreground/5 md:left-16 lg:block" />
      <div className="absolute top-0 right-8 bottom-0 hidden w-px bg-foreground/5 md:right-16 lg:block" />

      <div className="absolute top-24 left-8 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:left-16 lg:block">
        <div className="bg-primary/50 absolute top-1/2 right-0 left-0 h-px" />
        <div className="bg-primary/50 absolute top-0 bottom-0 left-1/2 w-px" />
      </div>
      <div className="absolute top-24 right-8 hidden h-4 w-4 translate-x-1/2 -translate-y-1/2 md:right-16 lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
      </div>
      <div className="absolute bottom-24 left-8 hidden h-4 w-4 -translate-x-1/2 translate-y-1/2 md:left-16 lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
      </div>
      <div className="absolute right-8 bottom-24 hidden h-4 w-4 translate-x-1/2 translate-y-1/2 md:right-16 lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
        >
          <div className="mb-16 text-center">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <Heading as="h2" variant="medium" className="mb-4 text-foreground">
                Architecture Patterns
              </Heading>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <SubHeading variant="big" className="mx-auto max-w-xl text-pretty">
                Proven architectural patterns for building scalable, maintainable
                distributed systems.
              </SubHeading>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {diagrams.diagrams.map((diagram) => (
              <Link key={diagram.slug} href={`/d/${diagram.slug}`} className="block">
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="group relative flex flex-col border border-foreground/10 bg-foreground/[0.02] transition-colors duration-500 ease-out hover:border-primary/30 hover:bg-primary/[0.03]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden diagram-card-visual">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
                    <DiagramVisual slug={diagram.slug} />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="text-foreground text-sm font-bold tracking-wide uppercase">
                      {diagram.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {diagram.description}
                    </p>
                  </div>

                  <motion.div
                    className="absolute right-0 top-0 m-3 h-2 w-2 rounded-full border border-foreground/10 bg-foreground/5"
                    variants={{
                      hover: {
                        scale: 1.6,
                        borderColor: 'var(--color-primary)',
                        backgroundColor: 'var(--color-primary)',
                        transition: { duration: 0.4, ease: easePremium },
                      },
                    }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
