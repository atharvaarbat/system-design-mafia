import { motion } from 'motion/react';
import { easePremium } from './shared';

const cx = 200, cy = 150, r = 70;
const points = Array.from({ length: 6 }, (_, i) => {
  const a = Math.PI / 6 + (Math.PI / 3) * i - Math.PI / 2;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
});
const hexPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';

const core = '#F59E0B'; // amber — application core
const portColors = ['#38BDF8', '#22D3EE', '#10B981', '#A78BFA', '#F43F5E', '#EC4899']; // adapters

export default function HexagonalDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="hex-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={core} stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#hex-bg)" />

      <motion.path
        d={hexPath}
        stroke={core} strokeOpacity={0.5} strokeWidth="1.5"
        fill={core} fillOpacity={0.1}
        variants={{
          hover: { strokeOpacity: 0.7, fillOpacity: 0.25, transition: { duration: 0.55, ease: easePremium } },
        }}
      />

      <motion.circle
        cx={cx} cy={cy} r={8}
        fill={core} fillOpacity={0.35}
        variants={{
          hover: { r: 11, fillOpacity: 0.7, transition: { duration: 0.5, ease: easePremium } },
        }}
      />

      {points.map(([px, py], i) => {
        const [nx, ny] = points[(i + 1) % 6];
        const midX = (px + nx) / 2;
        const midY = (py + ny) / 2;
        const dx = midX - cx;
        const dy = midY - cy;
        const len = Math.sqrt(dx * dx + dy * dy);
        const portX = midX + (dx / len) * 16;
        const portY = midY + (dy / len) * 16;
        const extX = midX + (dx / len) * 48;
        const extY = midY + (dy / len) * 48;
        const color = portColors[i];

        return (
          <g key={`port-${i}`}>
            <motion.line
              x1={portX} y1={portY} x2={extX} y2={extY}
              stroke={color} strokeOpacity={0.4} strokeWidth="0.75"
              variants={{
                hover: { strokeOpacity: 0.7, transition: { duration: 0.4, delay: i * 0.04, ease: easePremium } },
              }}
            />
            <motion.rect
              x={portX - 8} y={portY - 4} width={16} height={8} rx="2"
              stroke={color} strokeOpacity={0.4} strokeWidth="0.75"
              fill={color} fillOpacity={0.12}
              variants={{
                hover: { strokeOpacity: 0.7, fillOpacity: 0.3, transition: { duration: 0.4, delay: i * 0.04, ease: easePremium } },
              }}
            />
            <motion.circle
              cx={extX} cy={extY} r={2}
              fill={color} fillOpacity={0.5}
              variants={{
                hover: { r: 5, fillOpacity: 0.9, transition: { duration: 0.35, delay: i * 0.04, ease: easePremium } },
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
