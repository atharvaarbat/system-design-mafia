'use client';

import { gsap, useGSAP, ScrollSmoother } from '@/lib/gsap';

/**
 * ScrollSmoother needs a wrapper/content pair; fixed elements (navbar, HUD)
 * must live outside this component. Smoothing + data-speed parallax only run
 * for fine pointers without reduced-motion — everyone else gets native scroll,
 * and section-level ScrollTriggers keep working either way.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.1,
        effects: true,
        ignoreMobileResize: true,
      });
      return () => smoother.kill();
    });
  });

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
