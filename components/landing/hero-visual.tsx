'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/* Schematic layout — viewBox 0 0 520 560, tiered top to bottom. */

const CLIENTS = [
  { id: 'c1', x: 150, y: 42 },
  { id: 'c2', x: 300, y: 42 },
  { id: 'c3', x: 450, y: 42 },
];

const NODES = [
  { id: 'cdn', label: 'CDN', x: 150, y: 132, w: 76 },
  { id: 'gw', label: 'API GATEWAY', x: 330, y: 132, w: 112 },
  { id: 'lb', label: 'LOAD BALANCER', x: 330, y: 214, w: 130 },
  { id: 'auth', label: 'SVC.AUTH', x: 150, y: 306, w: 88 },
  { id: 'api', label: 'SVC.API', x: 330, y: 306, w: 88 },
  { id: 'media', label: 'SVC.MEDIA', x: 460, y: 306, w: 88 },
  { id: 'cache', label: 'CACHE', x: 150, y: 398, w: 88 },
  { id: 'queue', label: 'QUEUE', x: 330, y: 398, w: 88 },
  { id: 'worker', label: 'WORKER', x: 460, y: 398, w: 88 },
  { id: 'db1', label: 'DB.PRIMARY', x: 240, y: 498, w: 110 },
  { id: 'db2', label: 'DB.REPLICA', x: 420, y: 498, w: 110 },
];

const NODE_H = 26;

/** Solid request/response edges. */
const EDGES = [
  'M150,55 L150,119', // c1 → cdn
  'M300,55 L330,119', // c2 → gw
  'M450,55 L330,119', // c3 → gw
  'M330,145 L330,201', // gw → lb
  'M330,227 L150,293', // lb → auth
  'M330,227 L330,293', // lb → api
  'M330,227 L460,293', // lb → media
  'M150,319 L150,385', // auth → cache
  'M330,319 L330,385', // api → queue
  'M330,319 L240,485', // api → db1
  'M374,398 L416,398', // queue → worker
  'M460,411 L420,485', // worker → db2
];

/** Dashed infra edges — these get the marching-ants treatment. */
const DASHED_EDGES = [
  'M188,132 L274,132', // cdn ↔ gw
  'M295,498 L365,498', // db1 → db2 replication
];

const TIERS = [
  { label: 'CLIENTS', y: 42 },
  { label: 'EDGE', y: 173 },
  { label: 'COMPUTE', y: 306 },
  { label: 'ASYNC', y: 398 },
  { label: 'DATA', y: 498 },
];

const TIER_LINES = [88, 260, 352, 444];

/** Packet routes: id of an invisible path + timing. Follows drawn edges. */
const ROUTES = [
  { id: 'route-read', d: 'M300,55 L330,132 L330,214 L330,306 L240,498', node: 'db1', duration: 3.4, delay: 0 },
  { id: 'route-auth', d: 'M450,55 L330,132 L330,214 L150,306 L150,398', node: 'cache', duration: 3.2, delay: 1.3 },
  { id: 'route-write', d: 'M300,55 L330,132 L330,214 L330,306 L330,398 L460,398 L420,498', node: 'db2', duration: 4.2, delay: 2.4 },
  { id: 'route-cdn', d: 'M150,55 L150,132', node: 'cdn', duration: 1.1, delay: 0.7 },
];

/**
 * Live system monitor panel: a tiered architecture schematic with request
 * packets riding the edges on repeat, arrival pulses, replication ants, and
 * a ticking traffic readout. Tilts in 3D toward the pointer.
 */
export default function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // -- Boot sequence -------------------------------------------------
        const boot = gsap.timeline({ delay: 0.7, defaults: { ease: 'power3.out' } });
        boot
          .from('.hv-tier', { autoAlpha: 0, duration: 0.5, stagger: 0.05 })
          .from(
            '.hv-node',
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
          .from('.hv-edge', { drawSVG: '0%', duration: 0.7, ease: 'power2.inOut', stagger: 0.05 }, 0.5)
          .from('.hv-dashed', { autoAlpha: 0, duration: 0.6 }, 1.2);

        // -- Packets riding the routes --------------------------------------
        ROUTES.forEach((route) => {
          const packet = `.hv-packet-${route.id}`;
          const tl = gsap.timeline({ repeat: -1, delay: 2 + route.delay, repeatDelay: 1.5 });
          tl.to(packet, { autoAlpha: 1, duration: 0.15 }, 0)
            .to(
              packet,
              {
                motionPath: {
                  path: `#${route.id}`,
                  align: `#${route.id}`,
                  alignOrigin: [0.5, 0.5],
                },
                duration: route.duration,
                ease: 'power1.inOut',
              },
              0,
            )
            .to(packet, { autoAlpha: 0, duration: 0.2 }, route.duration - 0.2)
            // Destination node blips when the packet lands
            .to(
              `.hv-node-${route.node}`,
              {
                scale: 1.06,
                transformOrigin: '50% 50%',
                duration: 0.16,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out',
              },
              route.duration - 0.25,
            );
        });

        // -- Marching ants on dashed infra edges ---------------------------
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

        // -- REQ/S readout random-walks -------------------------------------
        const tick = gsap.timeline({ repeat: -1 });
        tick
          .call(() => {
            if (reqRef.current) {
              reqRef.current.textContent = String(Math.round(gsap.utils.random(180, 940)));
            }
          })
          .to({}, { duration: 0.85 });
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
            <span className="text-[10px] font-bold tracking-[0.25em] text-foreground/50 uppercase">
              SYS.MONITOR — Live Traffic
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 border border-foreground/25" />
            <span className="h-1.5 w-1.5 border border-foreground/25" />
            <span className="h-1.5 w-1.5 bg-foreground/25" />
          </div>
        </div>

        {/* The schematic */}
        <svg viewBox="0 0 520 560" fill="none" className="block w-full">
          {/* Tier separators + labels */}
          {TIER_LINES.map((y) => (
            <line
              key={y}
              x1="14"
              y1={y}
              x2="506"
              y2={y}
              className="hv-tier"
              stroke="var(--color-foreground)"
              strokeOpacity="0.06"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
          ))}
          {TIERS.map((tier) => (
            <text
              key={tier.label}
              x="14"
              y={tier.y + 3}
              className="hv-tier"
              fontSize="7"
              letterSpacing="2.5"
              fontFamily="monospace"
              fill="var(--color-foreground)"
              fillOpacity="0.28"
            >
              {tier.label}
            </text>
          ))}

          {/* Solid edges */}
          {EDGES.map((d) => (
            <path
              key={d}
              d={d}
              className="hv-edge"
              stroke="var(--color-foreground)"
              strokeOpacity="0.16"
              strokeWidth="1"
            />
          ))}

          {/* Dashed infra edges (ants) */}
          {DASHED_EDGES.map((d) => (
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

          {/* Invisible packet routes */}
          {ROUTES.map((route) => (
            <path key={route.id} id={route.id} d={route.d} stroke="none" fill="none" />
          ))}

          {/* Packets — hidden until GSAP drives them */}
          {ROUTES.map((route) => (
            <circle
              key={`packet-${route.id}`}
              className={`hv-packet-${route.id} opacity-0`}
              r="3"
              fill="var(--color-primary)"
              style={{ filter: 'drop-shadow(0 0 4px var(--color-primary))' }}
            />
          ))}

          {/* Client dots */}
          {CLIENTS.map((c) => (
            <g key={c.id} className={`hv-node hv-node-${c.id}`}>
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

          {/* Infra node boxes */}
          {NODES.map((node) => (
            <g key={node.id} className={`hv-node hv-node-${node.id}`}>
              <rect
                x={node.x - node.w / 2}
                y={node.y - NODE_H / 2}
                width={node.w}
                height={NODE_H}
                stroke="var(--color-primary)"
                strokeOpacity="0.3"
                strokeWidth="1"
                fill="var(--color-primary)"
                fillOpacity="0.04"
              />
              <circle
                className="hv-led"
                cx={node.x - node.w / 2 + 9}
                cy={node.y}
                r="1.8"
                fill="var(--color-primary)"
                fillOpacity="0.8"
              />
              <text
                x={node.x + 4}
                y={node.y + 2.8}
                textAnchor="middle"
                fontSize="8"
                letterSpacing="1.5"
                fontFamily="monospace"
                fill="var(--color-foreground)"
                fillOpacity="0.55"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Panel chrome: footer readout */}
        <div className="flex items-center justify-between border-t border-foreground/10 px-4 py-2.5 text-[9px] font-bold tracking-[0.2em] text-foreground/40 uppercase">
          <span>
            REQ/S <span ref={reqRef} className="text-primary">412</span>
          </span>
          <span>
            CACHE.HIT <span className="text-primary">94%</span>
          </span>
          <span>
            P99 <span className="text-primary">118MS</span>
          </span>
        </div>
      </div>
    </div>
  );
}
