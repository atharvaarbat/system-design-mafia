import { motion, type Variants } from 'motion/react';
import Container from './container';
import Heading from './heading';
import { PremiumComponent, ThemingComponent, OpenSourceComponent, ProductionReadyComponent } from './feature-visual';
import { cn } from "@/lib/utils";
import { CodeIcon, LayoutDashboardIcon, PaletteIcon, PuzzleIcon } from 'lucide-react';

function FeatureCard({
  title,
  description,
  descriptionClassName,
  icon: Icon,
  variants,
  className,
  children,
}: {
  title: string;
  description: React.ReactNode;
  descriptionClassName?: string;
  icon: React.ElementType;
  variants: Variants;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div variants={variants} className={cn("h-full w-full", className)}>
      <div className="group relative h-full w-full border border-foreground/10 bg-foreground/[0.02] transition-colors duration-500 ease-out hover:border-primary/30 hover:bg-primary/[0.03]">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-primary/20 group-hover:border-primary/50 transition-colors duration-500" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-foreground/20 group-hover:border-primary/50 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-foreground/20 group-hover:border-primary/50 transition-colors duration-500" />
        <div className="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-foreground/20 group-hover:border-primary/50 transition-colors duration-500" />

        <div className="relative z-10 flex h-full w-full flex-col items-start justify-center overflow-hidden p-8">
          <div className="mb-6 transition-transform duration-500 ease-out group-hover:scale-110">
            <Icon className="text-primary h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-3 text-xl font-bold tracking-widest uppercase">
            {title}
          </h3>
          <p className={cn("text-sm leading-relaxed tracking-wider text-foreground/60", descriptionClassName)}>
            {description}
          </p>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0, 0, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden py-24 font-mono md:py-32">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]" />
      <div className="absolute top-24 right-0 left-0 hidden h-px bg-foreground/5 lg:block" />
      <div className="absolute right-0 bottom-24 left-0 hidden h-px bg-foreground/5 lg:block" />
      <div className="absolute top-0 bottom-0 left-8 hidden w-px bg-foreground/5 md:left-16 lg:block" />
      <div className="absolute top-0 right-8 bottom-0 hidden w-px bg-foreground/5 md:right-16 lg:block" />

      {/* Crosshair top-left */}
      <div className="absolute top-24 left-8 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:left-16 lg:block">
        <div className="bg-primary/50 absolute top-1/2 right-0 left-0 h-px" />
        <div className="bg-primary/50 absolute top-0 bottom-0 left-1/2 w-px" />
      </div>

      <Container className="relative z-10 mx-auto">
        <motion.div
          className="mb-16 flex flex-col items-start text-left md:items-center md:text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={itemVariants}
            className="text-primary mb-8 inline-flex items-center text-xs font-bold tracking-widest uppercase"
          >
            <span className="mr-3 opacity-70">{'//'}</span>
            Platform Features
          </motion.div>
          <motion.div variants={itemVariants}>
            <Heading
              as="h2"
              variant="big"
              className="text-foreground font-sans text-balance"
            >
              Why this <span className="text-primary">matters</span>
            </Heading>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid auto-rows-[320px] grid-cols-1 gap-6 lg:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Top Left: Interactive Diagrams */}
          <FeatureCard
            variants={itemVariants}
            className="lg:col-span-2"
            icon={CodeIcon}
            title="Interactive Diagrams"
            description="Explore every architecture visually. Drag, zoom, resize groups, trace edges — the canvas is yours to manipulate."
            descriptionClassName="max-w-sm text-pretty"
          >
            <OpenSourceComponent />
          </FeatureCard>

          {/* Top Right: Curated Architectures */}
          <FeatureCard
            variants={itemVariants}
            className="lg:col-span-3"
            icon={PuzzleIcon}
            title="Curated Architectures"
            description="Production-grade system designs — from microservices to video streaming — each one battle-tested and explained end-to-end."
            descriptionClassName="max-w-md text-pretty"
          >
            <PremiumComponent />
          </FeatureCard>

          {/* Bottom Left: Rich Explanations */}
          <FeatureCard
            variants={itemVariants}
            className="lg:col-span-3"
            icon={PaletteIcon}
            title="Deep Dive Breakdowns"
            description={
              <>
                Every diagram ships with a rich-text architecture breakdown — trade-offs, data flow, scaling decisions, and rationale.
              </>
            }
            descriptionClassName="max-w-lg text-balance"
          >
            <ThemingComponent />
          </FeatureCard>

          {/* Bottom Right: Learn by Doing */}
          <FeatureCard
            variants={itemVariants}
            className="lg:col-span-2"
            icon={LayoutDashboardIcon}
            title="Learn by Doing"
            description="Reading is step one. Editing groups, following edge paths, and inspecting nodes is how architecture truly sticks."
            descriptionClassName="max-w-xs text-pretty"
          >
            <ProductionReadyComponent />
          </FeatureCard>
        </motion.div>
      </Container>
    </section>
  );
}
