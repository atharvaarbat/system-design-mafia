import { motion } from 'motion/react';
import { easePremium } from './shared';

const nodes: [number, number, string][] = [
  [80, 80, '#38BDF8'], // sky
  [320, 80, '#10B981'], // emerald
  [100, 230, '#A78BFA'], // violet
  [300, 230, '#F43F5E'], // rose
];

const hub = '#F59E0B'; // amber — API gateway / hub

export default function MicroservicesDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="ms-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={hub} stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ms-bg)" />

      {nodes.map(([x, y, color], i) => (
        <motion.line
          key={`line-${i}`}
          x1="200" y1="150" x2={x} y2={y}
          stroke={color} strokeOpacity={0.45} strokeWidth="1"
          variants={{
            hover: { strokeOpacity: 0.55, transition: { duration: 0.5, delay: i * 0.06, ease: easePremium } },
          }}
        />
      ))}

      <motion.circle
        cx="200" cy="150" r={14}
        stroke={hub} strokeOpacity={0.5} strokeWidth="1.5"
        fill={hub} fillOpacity={0.15}
        variants={{
          hover: { r: 16, strokeOpacity: 0.8, fillOpacity: 0.35, transition: { duration: 0.5, ease: easePremium } },
        }}
      />

      {nodes.map(([x, y, color], i) => (
        <g key={`node-${i}`}>
          <motion.circle
            cx={x} cy={y} r={9}
            stroke={color} strokeOpacity={0.45} strokeWidth="1"
            fill={color} fillOpacity={0.12}
            variants={{
              hover: { r: 12, strokeOpacity: 0.7, fillOpacity: 0.3, transition: { duration: 0.45, delay: i * 0.06, ease: easePremium } },
            }}
          />
          <motion.circle
            cx={x} cy={y} r={2}
            fill={color} fillOpacity={0.6}
            variants={{
              hover: { r: 4, fillOpacity: 0.85, transition: { duration: 0.4, delay: i * 0.06, ease: easePremium } },
            }}
          />
        </g>
      ))}
    </svg>
  );
}
