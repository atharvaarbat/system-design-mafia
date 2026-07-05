import Container from './container';
import Heading from './heading';
import SubHeading from './subheading';
import BgFrame from './bg-frame';
import { motion, type Variants } from 'motion/react';
import Link from 'next/link';

const DIAGRAMS = [
  {
    slug: 'e-commerce-microservices',
    title: 'E-Commerce Microservices',
    description:
      'Cloud-native e-commerce platform on AWS with service decomposition, API gateway, and dedicated data stores.',
    image: '/diagrams/microservices.avif',
  },
  {
    slug: 'event-driven-architecture',
    title: 'Event-Driven Architecture',
    description:
      'Asynchronous event producers and consumers connected through a message broker for decoupled communication.',
    image: '/diagrams/event-driven.avif',
  },
  {
    slug: 'cqrs-pattern',
    title: 'CQRS Pattern',
    description:
      'Separates read and write operations into distinct models, optimizing for query vs command workloads.',
    image: '/diagrams/cqrs.avif',
  },
  {
    slug: 'hexagonal-architecture',
    title: 'Hexagonal Architecture',
    description:
      'Core business logic isolated behind ports and adapters, making it framework- and infrastructure-agnostic.',
    image: '/diagrams/hexagonal.avif',
  },
  {
    slug: 'layered-architecture',
    title: 'Layered Architecture',
    description:
      'Organizes code into horizontal layers — presentation, business logic, persistence — each with a single responsibility.',
    image: '/diagrams/layered.avif',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function DiagramCards() {
  return (
    <section id="diagram-cards" className="relative flex w-full flex-col py-32 font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Decorative Technical Borders */}
      <div className="absolute top-24 right-0 left-0 hidden h-px bg-white/5 lg:block" />
      <div className="absolute right-0 bottom-24 left-0 hidden h-px bg-white/5 lg:block" />
      <div className="absolute top-0 bottom-0 left-8 hidden w-px bg-white/5 md:left-16 lg:block" />
      <div className="absolute top-0 right-8 bottom-0 hidden w-px bg-white/5 md:right-16 lg:block" />

      {/* Crosshairs at intersections */}
      <div className="absolute top-24 left-8 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:left-16 lg:block">
        <div className="bg-primary/50 absolute top-1/2 right-0 left-0 h-px" />
        <div className="bg-primary/50 absolute top-0 bottom-0 left-1/2 w-px" />
      </div>
      <div className="absolute top-24 right-8 hidden h-4 w-4 translate-x-1/2 -translate-y-1/2 md:right-16 lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-px bg-white/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
      </div>
      <div className="absolute bottom-24 left-8 hidden h-4 w-4 -translate-x-1/2 translate-y-1/2 md:left-16 lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-px bg-white/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
      </div>
      <div className="absolute right-8 bottom-24 hidden h-4 w-4 translate-x-1/2 translate-y-1/2 md:right-16 lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-px bg-white/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
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
              <Heading
                as="h2"
                variant="medium"
                className="text-foreground mb-4"
              >
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
            {DIAGRAMS.map((diagram) => (
              <Link
                key={diagram.slug}
                href={`/d/${diagram.slug}`}
                className="block"
              >
                <motion.div
                  variants={cardVariants}
                  className="group relative flex flex-col border border-white/10 bg-white/[0.02] transition-all hover:border-white/20 hover:bg-white/[0.04]"
                >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <BgFrame
                    imageUrl={diagram.image}
                    alt={diagram.title}
                    className="h-full w-full border-0"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-foreground text-sm font-bold tracking-wide uppercase">
                    {diagram.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {diagram.description}
                  </p>
                </div>

                <div className="absolute top-0 right-0 m-3 h-2 w-2 rounded-full border border-white/10 bg-white/5" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
