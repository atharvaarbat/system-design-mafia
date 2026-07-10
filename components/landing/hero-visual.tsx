'use client';

import { useRef } from 'react';
import { gsap, useGSAP, SCRAMBLE_CHARS } from '@/lib/gsap';

/* Blueprint stage — viewBox 0 0 520 560, rows at y 42/132/224/316/420/500.
   A single pool of node boxes is shared by every system: each morph flies
   slot i to its next position while the outgoing system's edge layer
   retracts and the incoming one draws in. Slot roles stay roughly stable
   (0 = entry tier, 1-2 = services, 5-8 = data) so most flights are short. */

type Slot = { label: string; x: number; y: number; w: number; off?: boolean };
type Route = { d: string; node: number; dur: number; delay: number };
type System = {
  key: string;
  title: string;
  ticker: string;
  slots: Slot[];
  edges: string[];
  dashed: string[];
  routes: Route[];
  tiers: { label: string; y: number }[];
  metrics: { k: string; v: string }[];
};

export const SYSTEMS: System[] = [
  {
    key: 'shortener',
    title: 'BLUEPRINT // URL-SHORTENER',
    ticker: 'url shorteners',
    slots: [
      { label: 'LOAD BALANCER', x: 330, y: 132, w: 132 },
      { label: 'SVC.SHORTEN', x: 170, y: 224, w: 112 },
      { label: 'SVC.REDIRECT', x: 430, y: 224, w: 112 },
      { label: 'KEYGEN', x: 110, y: 316, w: 84 },
      { label: 'CACHE.HOT', x: 300, y: 316, w: 100 },
      { label: 'QUEUE.CLICKS', x: 450, y: 316, w: 104 },
      { label: 'DB.URLS', x: 170, y: 420, w: 100 },
      { label: 'WORKER.AGG', x: 450, y: 420, w: 104 },
      { label: 'DB.ANALYTICS', x: 446, y: 500, w: 116 },
      { label: '', x: 330, y: 224, w: 88, off: true },
    ],
    edges: [
      'M150,55 L330,119',
      'M300,55 L330,119',
      'M450,55 L330,119',
      'M330,145 L170,211',
      'M330,145 L430,211',
      'M170,237 L110,303',
      'M170,237 L170,407',
      'M430,237 L300,303',
      'M430,237 L450,303',
      'M450,329 L450,407',
      'M450,433 L446,487',
    ],
    dashed: ['M300,329 L182,409'],
    routes: [
      { d: 'M300,55 L330,132 L430,224 L300,316', node: 4, dur: 2.8, delay: 0 },
      { d: 'M150,55 L330,132 L170,224 L170,420', node: 6, dur: 3.4, delay: 1.2 },
      { d: 'M450,55 L330,132 L430,224 L450,316 L450,420 L446,500', node: 8, dur: 4.2, delay: 2.2 },
    ],
    tiers: [
      { label: 'EDGE', y: 132 },
      { label: 'SERVICES', y: 224 },
      { label: 'LOOKUP', y: 316 },
      { label: 'STORAGE', y: 420 },
      { label: 'ANALYTICS', y: 500 },
    ],
    metrics: [
      { k: 'REDIR/S', v: '8.4K' },
      { k: 'CACHE.HIT', v: '97%' },
      { k: 'P99', v: '11MS' },
    ],
  },
  {
    key: 'video',
    title: 'BLUEPRINT // VIDEO-STREAM',
    ticker: 'video streaming',
    slots: [
      { label: 'UPLOAD.GW', x: 150, y: 132, w: 104 },
      { label: 'SVC.INGEST', x: 150, y: 224, w: 104 },
      { label: 'SVC.PLAYBACK', x: 430, y: 224, w: 116 },
      { label: 'QUEUE.JOBS', x: 150, y: 316, w: 104 },
      { label: 'TRANSCODE.X4', x: 310, y: 316, w: 104 },
      { label: 'CACHE.MANIFEST', x: 440, y: 316, w: 112 },
      { label: 'DB.METADATA', x: 150, y: 420, w: 112 },
      { label: 'STORE.OBJECTS', x: 330, y: 500, w: 116 },
      { label: 'CDN.EDGE', x: 430, y: 132, w: 104 },
      { label: '', x: 330, y: 224, w: 88, off: true },
    ],
    edges: [
      'M150,55 L150,119',
      'M300,55 L430,119',
      'M450,55 L430,119',
      'M150,145 L150,211',
      'M150,237 L150,303',
      'M430,145 L430,211',
      'M430,237 L440,303',
      'M298,329 L162,407',
      'M316,329 L330,487',
      'M440,329 L346,489',
    ],
    dashed: ['M202,316 L258,316'],
    routes: [
      { d: 'M150,55 L150,132 L150,224 L150,316', node: 3, dur: 2.4, delay: 0 },
      { d: 'M450,55 L430,132 L430,224 L440,316', node: 5, dur: 2.4, delay: 1.1 },
      { d: 'M150,316 L310,316 L330,500', node: 7, dur: 2.8, delay: 2.4 },
    ],
    tiers: [
      { label: 'INGEST', y: 132 },
      { label: 'SERVICES', y: 224 },
      { label: 'PIPELINE', y: 316 },
      { label: 'DATA', y: 420 },
      { label: 'STORAGE', y: 500 },
    ],
    metrics: [
      { k: 'EGRESS', v: '9.2GB/S' },
      { k: 'TRANSCODE', v: '4X' },
      { k: 'REBUFFER', v: '0.4%' },
    ],
  },
  {
    key: 'events',
    title: 'BLUEPRINT // EVENT-PIPELINE',
    ticker: 'event-driven systems',
    slots: [
      { label: 'API GATEWAY', x: 330, y: 132, w: 120 },
      { label: 'SVC.ORDERS', x: 140, y: 224, w: 104 },
      { label: 'SVC.PAYMENTS', x: 330, y: 224, w: 116 },
      { label: 'SVC.STOCK', x: 458, y: 224, w: 92 },
      { label: 'BUS.EVENTS', x: 330, y: 316, w: 132 },
      { label: 'CONSUMER.EMAIL', x: 140, y: 420, w: 116 },
      { label: 'CONSUMER.SEARCH', x: 330, y: 420, w: 120 },
      { label: 'CONSUMER.FRAUD', x: 458, y: 420, w: 96 },
      { label: 'DB.SEARCH-IDX', x: 330, y: 500, w: 120 },
      { label: 'DLQ', x: 140, y: 500, w: 72 },
    ],
    edges: [
      'M150,55 L330,119',
      'M300,55 L330,119',
      'M450,55 L330,119',
      'M330,145 L140,211',
      'M330,145 L330,211',
      'M330,145 L458,211',
      'M140,237 L300,303',
      'M330,237 L330,303',
      'M458,237 L360,303',
      'M330,433 L330,487',
    ],
    dashed: [
      'M300,329 L140,407',
      'M330,329 L330,407',
      'M360,329 L458,407',
      'M290,329 L160,487',
    ],
    routes: [
      { d: 'M300,55 L330,132 L330,224 L330,316 L330,420 L330,500', node: 8, dur: 4.0, delay: 0 },
      { d: 'M150,55 L330,132 L140,224 L300,316', node: 4, dur: 2.8, delay: 1.4 },
      { d: 'M450,55 L330,132 L458,224 L360,316 L458,420', node: 7, dur: 3.4, delay: 2.5 },
    ],
    tiers: [
      { label: 'EDGE', y: 132 },
      { label: 'PRODUCERS', y: 224 },
      { label: 'BROKER', y: 316 },
      { label: 'CONSUMERS', y: 420 },
      { label: 'SINKS', y: 500 },
    ],
    metrics: [
      { k: 'EVENTS/S', v: '42K' },
      { k: 'LAG', v: '12MS' },
      { k: 'DLQ', v: '0.01%' },
    ],
  },
  {
    key: 'cqrs',
    title: 'BLUEPRINT // CQRS-SHARDED',
    ticker: 'cqrs + sharding',
    slots: [
      { label: 'API GATEWAY', x: 330, y: 132, w: 120 },
      { label: 'CMD.WRITE-API', x: 170, y: 224, w: 120 },
      { label: 'QRY.READ-API', x: 450, y: 224, w: 112 },
      { label: 'SHARD.ROUTER', x: 170, y: 316, w: 116 },
      { label: 'CACHE.READ', x: 450, y: 316, w: 104 },
      { label: 'SHARD.00', x: 100, y: 420, w: 72 },
      { label: 'SHARD.01', x: 190, y: 420, w: 72 },
      { label: 'SHARD.02', x: 280, y: 420, w: 72 },
      { label: 'DB.READ-VIEW', x: 450, y: 420, w: 112 },
      { label: 'PROJECTOR', x: 330, y: 500, w: 104 },
    ],
    edges: [
      'M150,55 L330,119',
      'M300,55 L330,119',
      'M450,55 L330,119',
      'M330,145 L170,211',
      'M330,145 L450,211',
      'M170,237 L170,303',
      'M170,329 L100,407',
      'M170,329 L190,407',
      'M170,329 L280,407',
      'M450,237 L450,303',
      'M450,329 L450,407',
      'M382,496 L446,437',
    ],
    dashed: [
      'M100,433 L302,489',
      'M190,433 L316,487',
      'M280,433 L324,487',
    ],
    routes: [
      { d: 'M150,55 L330,132 L170,224 L170,316 L190,420', node: 6, dur: 3.2, delay: 0 },
      { d: 'M450,55 L330,132 L450,224 L450,316', node: 4, dur: 2.4, delay: 1.5 },
      { d: 'M280,433 L330,496 L446,437', node: 8, dur: 2.4, delay: 2.8 },
    ],
    tiers: [
      { label: 'EDGE', y: 132 },
      { label: 'APIS', y: 224 },
      { label: 'ROUTING', y: 316 },
      { label: 'SHARDS', y: 420 },
      { label: 'PROJECTION', y: 500 },
    ],
    metrics: [
      { k: 'WRITES/S', v: '3.1K' },
      { k: 'READS/S', v: '58K' },
      { k: 'REPL.LAG', v: '45MS' },
    ],
  },
];

const CLIENTS = [
  { id: 'c1', x: 150, y: 42 },
  { id: 'c2', x: 300, y: 42 },
  { id: 'c3', x: 450, y: 42 },
];

const TIER_LINES = [88, 178, 270, 368, 460];
const NODE_H = 26;

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Morphing blueprint: one pool of nodes reassembles into the real architecture
 * of each topic the hero is "exploring". The master timeline here also drives
 * the terminal ticker in the hero copy (via tickerRef) so text and diagram
 * always rebuild together. Tilts in 3D toward the pointer.
 */
export default function HeroVisual({
  tickerRef,
}: {
  tickerRef?: React.RefObject<HTMLSpanElement | null>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const idxRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = rootRef.current!;
        const tickerEl = tickerRef?.current;

        // Non-active edge layers start retracted so morphs can draw them in.
        for (let i = 1; i < SYSTEMS.length; i++) {
          gsap.set(`.hv-g-${i} .hv-edge`, { drawSVG: '0%' });
          gsap.set(`.hv-g-${i} .hv-dashed, .hv-g-${i} .hv-tierlab`, { autoAlpha: 0 });
          gsap.set(`.hv-g-${i}`, { opacity: 1 });
        }

        // -- Boot sequence: system 0 assembles ------------------------------
        const boot = gsap.timeline({ delay: 0.7, defaults: { ease: 'power3.out' } });
        boot
          .from('.hv-tiersep', { autoAlpha: 0, duration: 0.5, stagger: 0.05 })
          .from('.hv-g-0 .hv-tierlab', { autoAlpha: 0, duration: 0.5, stagger: 0.04 }, 0.1)
          .from(
            '.hv-bootnode',
            {
              autoAlpha: 0,
              scale: 0.7,
              transformOrigin: '50% 50%',
              duration: 0.55,
              ease: 'back.out(1.8)',
              stagger: 0.05,
            },
            0.15,
          )
          .from('.hv-g-0 .hv-edge', { drawSVG: '0%', duration: 0.7, ease: 'power2.inOut', stagger: 0.05 }, 0.5)
          .from('.hv-g-0 .hv-dashed', { autoAlpha: 0, duration: 0.6 }, 1.2);

        // -- Dwell: packets ride the active system's routes ------------------
        const buildDwell = (sysIdx: number) => {
          const sys = SYSTEMS[sysIdx];
          const tl = gsap.timeline();
          sys.routes.forEach((r, j) => {
            const pk = `.hv-pk-${j}`;
            const route = `#hvr-${sysIdx}-${j}`;
            tl.to(pk, { autoAlpha: 1, duration: 0.15 }, r.delay)
              .to(
                pk,
                {
                  motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5] },
                  duration: r.dur,
                  ease: 'power1.inOut',
                },
                r.delay,
              )
              .to(pk, { autoAlpha: 0, duration: 0.2 }, r.delay + r.dur - 0.2)
              // Destination node blips when the packet lands
              .to(
                `.hv-pn-${r.node}`,
                {
                  scale: 1.05,
                  transformOrigin: '50% 50%',
                  duration: 0.16,
                  yoyo: true,
                  repeat: 1,
                  ease: 'power2.out',
                },
                r.delay + r.dur - 0.22,
              );
          });
          tl.to({}, { duration: 0.5 });
          return tl;
        };

        // -- Morph: tear down system `from`, reassemble as system `to` ------
        const buildMorph = (fromIdx: number, toIdx: number) => {
          const next = SYSTEMS[toIdx];
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          tl.set('.hv-pk', { autoAlpha: 0 }, 0)
            .to(`.hv-g-${fromIdx} .hv-edge`, { drawSVG: '0%', duration: 0.4, ease: 'power2.in', stagger: 0.015 }, 0)
            .to(`.hv-g-${fromIdx} .hv-dashed`, { autoAlpha: 0, duration: 0.35 }, 0)
            .to(`.hv-g-${fromIdx} .hv-tierlab`, { autoAlpha: 0, duration: 0.3 }, 0)
            .to('.hv-pn-txt', { autoAlpha: 0, duration: 0.22 }, 0.05)
            .to(
              titleRef.current,
              { duration: 1.0, scrambleText: { text: next.title, chars: SCRAMBLE_CHARS, speed: 0.4 } },
              0.2,
            )
            .to(
              idxRef.current,
              {
                duration: 0.7,
                scrambleText: { text: `${pad(toIdx + 1)}/${pad(SYSTEMS.length)}`, chars: '0123456789/', speed: 0.4 },
              },
              0.25,
            );

          if (tickerEl) {
            tl.to(
              tickerEl,
              { duration: 0.9, scrambleText: { text: next.ticker, chars: SCRAMBLE_CHARS, speed: 0.35 } },
              0.2,
            );
          }

          next.metrics.forEach((m, j) => {
            tl.to(
              `.hv-ml-${j}`,
              { duration: 0.7, scrambleText: { text: m.k, chars: SCRAMBLE_CHARS, speed: 0.4 } },
              0.25 + j * 0.06,
            ).to(
              `.hv-mv-${j}`,
              { duration: 0.7, scrambleText: { text: m.v, chars: SCRAMBLE_CHARS, speed: 0.4 } },
              0.3 + j * 0.06,
            );
          });

          // Relabel while labels are invisible, mid-flight
          tl.call(
            () => {
              next.slots.forEach((slot, i) => {
                const el = root.querySelector(`.hv-pn-${i} .hv-pn-txt`);
                if (el) el.textContent = slot.label;
              });
            },
            [],
            0.3,
          );

          // Node flights
          next.slots.forEach((slot, i) => {
            const at = 0.35 + i * 0.035;
            const flight = { duration: 1.05, ease: 'expo.inOut' };
            tl.to(
              `.hv-pn-${i}`,
              {
                x: slot.x,
                y: slot.y,
                autoAlpha: slot.off ? 0 : 1,
                scale: slot.off ? 0.6 : 1,
                transformOrigin: '50% 50%',
                ...flight,
              },
              at,
            )
              .to(`.hv-pn-${i} .hv-pn-rect`, { attr: { x: -slot.w / 2, width: slot.w }, ...flight }, at)
              .to(`.hv-pn-${i} .hv-pn-led`, { attr: { cx: -slot.w / 2 + 9 }, ...flight }, at);
          });

          tl.to('.hv-pn-txt', { autoAlpha: 1, duration: 0.35 }, 1.15)
            .to(`.hv-g-${toIdx} .hv-edge`, { drawSVG: '0% 100%', duration: 0.6, ease: 'power2.out', stagger: 0.02 }, 1.2)
            .to(`.hv-g-${toIdx} .hv-tierlab`, { autoAlpha: 1, duration: 0.4 }, 1.35)
            .to(`.hv-g-${toIdx} .hv-dashed`, { autoAlpha: 1, duration: 0.5 }, 1.5);

          return tl;
        };

        // -- Master loop: dwell on each system, morph to the next -----------
        const master = gsap.timeline({ repeat: -1, delay: 3.2 });
        SYSTEMS.forEach((_, i) => {
          master.add(buildDwell(i));
          master.add(buildMorph(i, (i + 1) % SYSTEMS.length));
        });

        // -- Marching ants on async/replication edges -----------------------
        gsap.to('.hv-dashed', {
          strokeDashoffset: -16,
          duration: 1.2,
          repeat: -1,
          ease: 'none',
        });

        // -- Status LEDs blink out of phase ---------------------------------
        gsap.to('.hv-led', {
          autoAlpha: 0.15,
          duration: 0.7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: { each: 0.35, from: 'random' },
        });
      });

      // -- 3D tilt toward the pointer ---------------------------------------
      mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
        const panel = panelRef.current!;
        gsap.set(panel, { transformPerspective: 1100 });
        const rx = gsap.quickTo(panel, 'rotationX', { duration: 0.9, ease: 'power3.out' });
        const ry = gsap.quickTo(panel, 'rotationY', { duration: 0.9, ease: 'power3.out' });
        const px = gsap.quickTo(panel, 'x', { duration: 1.1, ease: 'power3.out' });
        const py = gsap.quickTo(panel, 'y', { duration: 1.1, ease: 'power3.out' });

        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ry(nx * 7);
          rx(ny * -5);
          px(nx * 18);
          py(ny * 12);
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden>
      <div
        ref={panelRef}
        className="border border-foreground/10 bg-background/50 backdrop-blur-sm will-change-transform"
      >
        {/* Panel chrome: header */}
        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="hv-led h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
            <span
              ref={titleRef}
              className="text-[10px] font-bold tracking-[0.25em] text-foreground/50 uppercase"
            >
              {SYSTEMS[0].title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span ref={idxRef} className="text-[9px] font-bold tracking-[0.2em] text-primary/70">
              01/{pad(SYSTEMS.length)}
            </span>
            <span className="h-1.5 w-1.5 border border-foreground/25" />
            <span className="h-1.5 w-1.5 bg-foreground/25" />
          </div>
        </div>

        {/* The blueprint stage */}
        <svg viewBox="0 0 520 560" fill="none" className="block w-full">
          {/* Static tier separators */}
          {TIER_LINES.map((y) => (
            <line
              key={y}
              x1="14"
              y1={y}
              x2="506"
              y2={y}
              className="hv-tiersep"
              stroke="var(--color-foreground)"
              strokeOpacity="0.06"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
          ))}

          {/* Per-system layers: tier labels, edges, packet routes */}
          {SYSTEMS.map((sys, s) => (
            <g key={sys.key} className={`hv-g-${s}`} style={s > 0 ? { opacity: 0 } : undefined}>
              {sys.tiers.map((tier) => (
                <text
                  key={tier.label}
                  x="14"
                  y={tier.y + 3}
                  className="hv-tierlab"
                  fontSize="7"
                  letterSpacing="2.5"
                  fontFamily="monospace"
                  fill="var(--color-foreground)"
                  fillOpacity="0.28"
                >
                  {tier.label}
                </text>
              ))}
              {sys.edges.map((d) => (
                <path
                  key={d}
                  d={d}
                  className="hv-edge"
                  stroke="var(--color-foreground)"
                  strokeOpacity="0.16"
                  strokeWidth="1"
                />
              ))}
              {sys.dashed.map((d) => (
                <path
                  key={d}
                  d={d}
                  className="hv-dashed"
                  stroke="var(--color-primary)"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
              ))}
              {sys.routes.map((r, j) => (
                <path key={r.d} id={`hvr-${s}-${j}`} d={r.d} stroke="none" fill="none" />
              ))}
            </g>
          ))}

          {/* Packets — hidden until GSAP drives them */}
          {[0, 1, 2].map((j) => (
            <circle
              key={j}
              className={`hv-pk hv-pk-${j} opacity-0`}
              r="3"
              fill="var(--color-primary)"
              style={{ filter: 'drop-shadow(0 0 4px var(--color-primary))' }}
            />
          ))}

          {/* Client dots — every architecture starts at the user */}
          {CLIENTS.map((c) => (
            <g key={c.id} className="hv-bootnode">
              <circle
                cx={c.x}
                cy={c.y}
                r="13"
                stroke="var(--color-primary)"
                strokeOpacity="0.3"
                strokeWidth="1"
                fill="var(--color-primary)"
                fillOpacity="0.04"
              />
              <circle cx={c.x} cy={c.y} r="2.5" fill="var(--color-primary)" fillOpacity="0.45" />
            </g>
          ))}

          {/* Shared node pool — positioned for system 0, morphed by GSAP */}
          {SYSTEMS[0].slots.map((slot, i) => (
            <g
              key={i}
              className={`hv-pn hv-pn-${i} hv-bootnode`}
              transform={`translate(${slot.x},${slot.y})`}
              style={slot.off ? { opacity: 0 } : undefined}
            >
              <rect
                className="hv-pn-rect"
                x={-slot.w / 2}
                y={-NODE_H / 2}
                width={slot.w}
                height={NODE_H}
                stroke="var(--color-primary)"
                strokeOpacity="0.3"
                strokeWidth="1"
                fill="var(--color-primary)"
                fillOpacity="0.04"
              />
              <circle
                className="hv-led hv-pn-led"
                cx={-slot.w / 2 + 9}
                cy={0}
                r="1.8"
                fill="var(--color-primary)"
                fillOpacity="0.8"
              />
              <text
                className="hv-pn-txt"
                x={3}
                y={2.8}
                textAnchor="middle"
                fontSize="8"
                letterSpacing="1.5"
                fontFamily="monospace"
                fill="var(--color-foreground)"
                fillOpacity="0.55"
              >
                {slot.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Panel chrome: footer readout — re-scrambles per system */}
        <div className="flex items-center justify-between border-t border-foreground/10 px-4 py-2.5 text-[9px] font-bold tracking-[0.2em] text-foreground/40 uppercase">
          {SYSTEMS[0].metrics.map((m, j) => (
            <span key={j}>
              <span className={`hv-ml-${j}`}>{m.k}</span>{' '}
              <span className={`hv-mv-${j} text-primary`}>{m.v}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
