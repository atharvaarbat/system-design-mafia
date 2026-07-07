'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
);

/** Charset used by every scramble effect so the whole page decodes the same way. */
export const SCRAMBLE_CHARS = '01<>/#_$:;';

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText };
