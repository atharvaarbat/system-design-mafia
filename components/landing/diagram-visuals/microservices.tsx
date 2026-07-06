import { motion } from 'motion/react';
import { easePremium } from './shared';

const nodes = [
  [80, 80],
  [320, 80],
  [100, 230],
  [300, 230],
];

export default function MicroservicesDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="ms-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ms-bg)" />

      {nodes.map(([x, y], i) => (
        <motion.line
          key={`line-${i}`}
          x1="200" y1="150" x2={x} y2={y}
          stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1"
          variants={{
            hover: { strokeOpacity: 0.45, transition: { duration: 0.5, delay: i * 0.06, ease: easePremium } },
          }}
        />
      ))}

      <motion.circle
        cx="200" cy="150" r={14}
        stroke="var(--color-primary)" strokeOpacity={0.2} strokeWidth="1.5"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{
          hover: { r: 16, strokeOpacity: 0.7, fillOpacity: 0.1, transition: { duration: 0.5, ease: easePremium } },
        }}
      />

      {nodes.map(([x, y], i) => (
        <g key={`node-${i}`}>
          <motion.circle
            cx={x} cy={y} r={9}
            stroke="var(--color-primary)" strokeOpacity={0.15} strokeWidth="1"
            fill="var(--color-primary)" fillOpacity={0.02}
            variants={{
              hover: { r: 12, strokeOpacity: 0.6, fillOpacity: 0.07, transition: { duration: 0.45, delay: i * 0.06, ease: easePremium } },
            }}
          />
          <motion.circle
            cx={x} cy={y} r={2}
            fill="var(--color-primary)" fillOpacity={0.2}
            variants={{
              hover: { r: 4, fillOpacity: 0.7, transition: { duration: 0.4, delay: i * 0.06, ease: easePremium } },
            }}
          />
        </g>
      ))}
    </svg>
  );
}
