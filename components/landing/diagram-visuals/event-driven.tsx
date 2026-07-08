import { motion } from 'motion/react';
import { easePremium } from './shared';

const producers = [[100, 85], [100, 150], [100, 215]];
const consumers = [[300, 85], [300, 150], [300, 215]];

const c = {
  producer: '#10B981', // emerald — event producers
  broker: '#F59E0B', // amber — message broker
  consumer: '#38BDF8', // sky — event consumers
};

export default function EventDrivenDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="ed-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.broker} stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ed-bg)" />

      {[42, 62, 82].map((r, i) => (
        <motion.circle
          key={`ring-${i}`}
          cx="200" cy="150" r={r}
          stroke={c.broker} strokeOpacity={0.3} strokeWidth="0.5" fill="none"
          variants={{
            hover: { scale: 1.12, strokeOpacity: 0.5, transition: { duration: 0.6, delay: i * 0.08, ease: easePremium } },
          }}
        />
      ))}

      {producers.map(([x, y], i) => (
        <motion.line
          key={`pconn-${i}`}
          x1={x + 10} y1={y} x2="190" y2="150"
          stroke={c.producer} strokeOpacity={0.4} strokeWidth="1" strokeDasharray="4 4"
          variants={{
            hover: { strokeOpacity: 0.7, transition: { duration: 0.5, delay: 0.08 + i * 0.08, ease: easePremium } },
          }}
        />
      ))}
      {consumers.map(([x, y], i) => (
        <motion.line
          key={`cconn-${i}`}
          x1="210" y1="150" x2={x - 10} y2={y}
          stroke={c.consumer} strokeOpacity={0.4} strokeWidth="1" strokeDasharray="4 4"
          variants={{
            hover: { strokeOpacity: 0.7, transition: { duration: 0.5, delay: 0.16 + i * 0.08, ease: easePremium } },
          }}
        />
      ))}

      <motion.circle
        cx="200" cy="150" r="24"
        stroke={c.broker} strokeOpacity={0.5} strokeWidth="1.5"
        fill={c.broker} fillOpacity={0.14}
        variants={{
          hover: { scale: 1.12, strokeOpacity: 0.75, fillOpacity: 0.35, transition: { duration: 0.5, ease: easePremium } },
        }}
      />
      <motion.text x="200" y="154" fontSize="9" textAnchor="middle"
        fill={c.broker} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.4, ease: easePremium } } }}>
        broker
      </motion.text>

      {producers.map(([x, y], i) => (
        <motion.g key={`prod-${i}`}>
          <motion.circle
            cx={x} cy={y} r="10"
            stroke={c.producer} strokeOpacity={0.4} strokeWidth="1"
            fill={c.producer} fillOpacity={0.12}
            variants={{
              hover: { scale: 1.2, strokeOpacity: 0.7, fillOpacity: 0.3, transition: { duration: 0.4, delay: i * 0.06, ease: easePremium } },
            }}
          />
          <motion.circle
            cx={x} cy={y} r="2"
            fill={c.producer} fillOpacity={0.6}
            variants={{
              hover: { scale: 2, fillOpacity: 0.9, transition: { duration: 0.35, delay: i * 0.06, ease: easePremium } },
            }}
          />
        </motion.g>
      ))}

      {consumers.map(([x, y], i) => (
        <motion.g key={`cons-${i}`}>
          <motion.rect
            x={x - 10} y={y - 10} width="20" height="20" rx="3"
            stroke={c.consumer} strokeOpacity={0.4} strokeWidth="1"
            fill={c.consumer} fillOpacity={0.12}
            variants={{
              hover: { scale: 1.2, strokeOpacity: 0.7, fillOpacity: 0.3, transition: { duration: 0.4, delay: i * 0.06, ease: easePremium } },
            }}
          />
          <motion.rect
            x={x - 3} y={y - 3} width="6" height="6" rx="1"
            fill={c.consumer} fillOpacity={0.6}
            variants={{
              hover: { scale: 1.5, fillOpacity: 0.9, transition: { duration: 0.35, delay: i * 0.06, ease: easePremium } },
            }}
          />
        </motion.g>
      ))}
    </svg>
  );
}
