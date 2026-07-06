import { motion } from 'motion/react';
import { easePremium } from './shared';

const layers = [
  { y: 60, width: 280, label: 'presentation', h: 28 },
  { y: 108, width: 240, label: 'application', h: 28 },
  { y: 156, width: 200, label: 'domain', h: 28 },
  { y: 204, width: 160, label: 'persistence', h: 28 },
];

export default function LayeredDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="lay-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#lay-bg)" />

      {[0.3, 0.5, 0.7].map((t, i) => (
        <motion.line
          key={`conn-${i}`}
          x1={400 * t} y1={88} x2={400 * t} y2={232}
          stroke="var(--color-primary)" strokeOpacity={0.05} strokeWidth="0.5" strokeDasharray="2 4"
          variants={{
            hover: { strokeOpacity: 0.2, transition: { duration: 0.5, delay: 0.3 + i * 0.04, ease: easePremium } },
          }}
        />
      ))}

      {layers.map((layer, i) => {
        const x = (400 - layer.width) / 2;
        return (
          <motion.g key={`layer-${i}`}>
            <motion.rect
              x={x} y={layer.y} width={layer.width} height={layer.h} rx="3"
              stroke="var(--color-primary)" strokeOpacity={0.14} strokeWidth="1"
              fill="var(--color-primary)" fillOpacity={0.02}
              variants={{
                hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: i * 0.07, ease: easePremium } },
              }}
            />
            <motion.text x={200} y={layer.y + layer.h / 2 + 3} fontSize="8" textAnchor="middle"
              fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
              variants={{
                hover: { fillOpacity: 0.45, transition: { duration: 0.3, delay: i * 0.07, ease: easePremium } },
              }}>
              {layer.label}
            </motion.text>
          </motion.g>
        );
      })}
    </svg>
  );
}
