import { motion } from 'motion/react';
import { easePremium } from './shared';

const c = {
  command: '#F43F5E', // rose — write / command side
  query: '#38BDF8', // sky — read / query side
  divider: '#94A3B8', // slate — CQRS split
  sync: '#F59E0B', // amber — async projection command → query
};

export default function CqrsDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="cqrs-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.divider} stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#cqrs-bg)" />

      <motion.line
        x1="200" y1="40" x2="200" y2="260"
        stroke={c.divider} strokeOpacity={0.25} strokeWidth="1" strokeDasharray="2 4"
        variants={{ hover: { strokeOpacity: 0.5, transition: { duration: 0.4, ease: easePremium } } }}
      />

      <motion.text x="100" y="60" fontSize="9" textAnchor="middle"
        fill={c.command} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.3, ease: easePremium } } }}>
        COMMAND
      </motion.text>
      <motion.text x="300" y="60" fontSize="9" textAnchor="middle"
        fill={c.query} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.3, delay: 0.06, ease: easePremium } } }}>
        QUERY
      </motion.text>

      {/* Command (write) side */}
      <motion.rect x="60" y="80" width="80" height="32" rx="4"
        stroke={c.command} strokeOpacity={0.4} strokeWidth="1"
        fill={c.command} fillOpacity={0.12}
        variants={{ hover: { strokeOpacity: 0.7, fillOpacity: 0.12, transition: { duration: 0.4, ease: easePremium } } }} />
      <motion.text x="100" y="99" fontSize="8" textAnchor="middle"
        fill={c.command} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.3, ease: easePremium } } }}>
        write
      </motion.text>

      <motion.rect x="60" y="140" width="80" height="32" rx="4"
        stroke={c.command} strokeOpacity={0.4} strokeWidth="1"
        fill={c.command} fillOpacity={0.12}
        variants={{ hover: { strokeOpacity: 0.7, fillOpacity: 0.12, transition: { duration: 0.4, delay: 0.06, ease: easePremium } } }} />
      <motion.text x="100" y="159" fontSize="8" textAnchor="middle"
        fill={c.command} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.3, ease: easePremium } } }}>
        model
      </motion.text>

      <motion.rect x="60" y="200" width="80" height="32" rx="4"
        stroke={c.command} strokeOpacity={0.4} strokeWidth="1"
        fill={c.command} fillOpacity={0.12}
        variants={{ hover: { strokeOpacity: 0.7, fillOpacity: 0.12, transition: { duration: 0.4, delay: 0.12, ease: easePremium } } }} />
      <motion.text x="100" y="219" fontSize="8" textAnchor="middle"
        fill={c.command} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.3, delay: 0.12, ease: easePremium } } }}>
        db
      </motion.text>

      <motion.path d="M 100 112 L 100 140"         stroke={c.command} strokeOpacity={0.45} strokeWidth="1.5"
        variants={{ hover: { strokeOpacity: 0.75, transition: { duration: 0.4, delay: 0.08, ease: easePremium } } }} />
      <motion.path d="M 94 126 L 100 134 L 106 126" stroke={c.command} strokeOpacity={0.45} strokeWidth="1" fill="none"
        variants={{ hover: { strokeOpacity: 0.75, transition: { duration: 0.4, delay: 0.08, ease: easePremium } } }} />
      <motion.path d="M 100 172 L 100 200" stroke={c.command} strokeOpacity={0.45} strokeWidth="1.5"
        variants={{ hover: { strokeOpacity: 0.75, transition: { duration: 0.4, delay: 0.14, ease: easePremium } } }} />
      <motion.path d="M 94 186 L 100 194 L 106 186" stroke={c.command} strokeOpacity={0.45} strokeWidth="1" fill="none"
        variants={{ hover: { strokeOpacity: 0.75, transition: { duration: 0.4, delay: 0.14, ease: easePremium } } }} />

      {/* Query (read) side */}
      <motion.rect x="260" y="80" width="80" height="32" rx="4"
        stroke={c.query} strokeOpacity={0.4} strokeWidth="1"
        fill={c.query} fillOpacity={0.12}
        variants={{ hover: { strokeOpacity: 0.7, fillOpacity: 0.12, transition: { duration: 0.4, delay: 0.04, ease: easePremium } } }} />
      <motion.text x="300" y="99" fontSize="8" textAnchor="middle"
        fill={c.query} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.3, delay: 0.04, ease: easePremium } } }}>
        read
      </motion.text>

      <motion.rect x="220" y="160" width="160" height="32" rx="4"
        stroke={c.query} strokeOpacity={0.4} strokeWidth="1"
        fill={c.query} fillOpacity={0.12}
        variants={{ hover: { strokeOpacity: 0.7, fillOpacity: 0.12, transition: { duration: 0.4, delay: 0.1, ease: easePremium } } }} />
      <motion.text x="300" y="179" fontSize="8" textAnchor="middle"
        fill={c.query} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.3, delay: 0.1, ease: easePremium } } }}>
        read model
      </motion.text>

      <motion.rect x="220" y="210" width="160" height="32" rx="4"
        stroke={c.query} strokeOpacity={0.4} strokeWidth="1"
        fill={c.query} fillOpacity={0.12}
        variants={{ hover: { strokeOpacity: 0.7, fillOpacity: 0.12, transition: { duration: 0.4, delay: 0.16, ease: easePremium } } }} />
      <motion.text x="300" y="229" fontSize="8" textAnchor="middle"
        fill={c.query} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.3, delay: 0.16, ease: easePremium } } }}>
        cache
      </motion.text>

      <motion.path d="M 300 112 L 300 160"         stroke={c.query} strokeOpacity={0.45} strokeWidth="1.5"
        variants={{ hover: { strokeOpacity: 0.75, transition: { duration: 0.4, delay: 0.12, ease: easePremium } } }} />
      <motion.path d="M 294 136 L 300 144 L 306 136" stroke={c.query} strokeOpacity={0.45} strokeWidth="1" fill="none"
        variants={{ hover: { strokeOpacity: 0.75, transition: { duration: 0.4, delay: 0.12, ease: easePremium } } }} />
      <motion.path d="M 260 192 L 260 210 M 340 192 L 340 210" stroke={c.query} strokeOpacity={0.45} strokeWidth="1.5"
        variants={{ hover: { strokeOpacity: 0.75, transition: { duration: 0.4, delay: 0.18, ease: easePremium } } }} />

      {/* Async projection: command → query */}
      <motion.path
        d="M 140 156 Q 170 130 260 156"
        stroke={c.sync} strokeOpacity={0.35} strokeWidth="0.75"
        strokeDasharray="3 3" fill="none"
        variants={{ hover: { strokeOpacity: 0.7, transition: { duration: 0.5, delay: 0.25, ease: easePremium } } }} />
    </svg>
  );
}
