'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';

const ITEMS = [
  'Microservices',
  'Event-Driven',
  'CQRS',
  'Hexagonal',
  'Layered',
  'Sharding',
  'Caching',
  'Load Balancing',
  'Message Queues',
  'CDN',
  'Replication',
  'Rate Limiting',
];

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-doto text-2xl font-black tracking-wide whitespace-nowrap text-foreground/60 uppercase md:text-4xl">
            {item}
          </span>
          <span className="text-sm text-primary/60">✦</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Infinite ticker that reacts to scroll velocity: scrolling fast winds the
 * belt up and shears it; it eases back to cruise speed when you stop.
 */
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const belt = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 45,
        repeat: -1,
        ease: 'none',
      });

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const boost = gsap.utils.clamp(-5, 5, velocity / 250);
          const shear = gsap.utils.clamp(-10, 10, velocity / -180);

          gsap
            .timeline({ overwrite: true })
            .to(belt, { timeScale: 1 + boost, duration: 0.2 }, 0)
            .to(belt, { timeScale: 1, duration: 1, ease: 'power2.out' }, 0.25)
            .to(trackRef.current, { skewX: shear, duration: 0.2 }, 0)
            .to(trackRef.current, { skewX: 0, duration: 0.8, ease: 'power2.out' }, 0.25);
        },
      });

      return () => {
        belt.kill();
        st.kill();
      };
    });
  });

  return (
    <section
      aria-label="Topics covered"
      className="relative overflow-hidden border-y border-foreground/10 bg-background/40 py-5 backdrop-blur-sm"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  );
}
