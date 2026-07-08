'use client';

import { motion } from 'motion/react';

export default function DiagramPageBackground() {
  return (
    <>
      {/* Ambient Glow */}
      <motion.div
        className="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(163,255,18,0.06) 0%, rgba(163,255,18,0.02) 40%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />

      {/* Decorative Technical Borders */}
      <div className="absolute top-24 right-0 left-0 hidden h-px bg-foreground/5 lg:block" />
      <div className="absolute right-0 bottom-24 left-0 hidden h-px bg-foreground/5 lg:block" />
      <div className="absolute top-0 bottom-0 left-8 hidden w-px bg-foreground/5 md:left-16 lg:block" />
      <div className="absolute top-0 right-8 bottom-0 hidden w-px bg-foreground/5 md:right-16 lg:block" />

      {/* Crosshairs — corner targets */}
      <motion.div
        className="absolute top-24 left-8 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:left-16 lg:block"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="bg-primary/50 absolute top-1/2 right-0 left-0 h-px" />
        <div className="bg-primary/50 absolute top-0 bottom-0 left-1/2 w-px" />
      </motion.div>
      <motion.div
        className="absolute top-24 right-8 hidden h-4 w-4 translate-x-1/2 -translate-y-1/2 md:right-16 lg:block"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
      >
        <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
      </motion.div>
      <motion.div
        className="absolute bottom-24 left-8 hidden h-4 w-4 -translate-x-1/2 translate-y-1/2 md:left-16 lg:block"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 1 }}
      >
        <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
      </motion.div>
      <motion.div
        className="absolute right-8 bottom-24 hidden h-4 w-4 translate-x-1/2 translate-y-1/2 md:right-16 lg:block"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 1.5 }}
      >
        <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
      </motion.div>

      {/* Crosshairs — mid-edge */}
      <motion.div
        className="absolute top-1/2 left-8 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:left-16 lg:block"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 2 }}
      >
        <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/10" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-8 hidden h-4 w-4 translate-x-1/2 -translate-y-1/2 md:right-16 lg:block"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 2.5 }}
      >
        <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/10" />
      </motion.div>

      {/* Abstract Background Concentric Circles — breathing */}
      <div className="pointer-events-none absolute top-1/2 left-0 flex h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <motion.div
          className="flex h-[800px] w-[800px] items-center justify-center rounded-full border border-foreground/5"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="flex h-[600px] w-[600px] items-center justify-center rounded-full border border-dashed border-foreground/20"
            animate={{ scale: [1, 0.96, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 1 }}
          >
            <motion.div
              className="flex h-[400px] w-[400px] items-center justify-center rounded-full border border-foreground/20"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 2 }}
            >
              <motion.div
                className="h-[200px] w-[200px] rounded-full border border-dashed border-foreground/10"
                animate={{ scale: [1, 0.95, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 3 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating terminal dots */}
      {[
        { top: '15%', left: '5%', delay: 0 },
        { top: '35%', right: '6%', delay: 0.8 },
        { top: '65%', left: '4%', delay: 1.6 },
        { top: '80%', right: '5%', delay: 2.4 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute hidden h-1 w-1 rounded-full lg:block"
          style={{
            backgroundColor: 'rgba(163,255,18,0.4)',
            top: dot.top,
            left: dot.left,
            right: dot.right,
          }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: dot.delay }}
        />
      ))}
    </>
  );
}
