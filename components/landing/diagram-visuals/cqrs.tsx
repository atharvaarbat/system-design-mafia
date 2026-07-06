import { motion } from 'motion/react';
import { easePremium } from './shared';

export default function CqrsDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="cqrs-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#cqrs-bg)" />

      <motion.line
        x1="200" y1="40" x2="200" y2="260"
        stroke="var(--color-primary)" strokeOpacity={0.07} strokeWidth="1" strokeDasharray="2 4"
        variants={{ hover: { strokeOpacity: 0.2, transition: { duration: 0.4, ease: easePremium } } }}
      />

      <motion.text x="100" y="60" fontSize="9" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, ease: easePremium } } }}>
        COMMAND
      </motion.text>
      <motion.text x="300" y="60" fontSize="9" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, delay: 0.06, ease: easePremium } } }}>
        QUERY
      </motion.text>

      <motion.rect x="60" y="80" width="80" height="32" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{ hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, ease: easePremium } } }} />
      <motion.text x="100" y="99" fontSize="8" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, ease: easePremium } } }}>
        write
      </motion.text>

      <motion.rect x="60" y="140" width="80" height="32" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{ hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.06, ease: easePremium } } }} />
      <motion.text x="100" y="159" fontSize="8" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, delay: 0.06, ease: easePremium } } }}>
        model
      </motion.text>

      <motion.rect x="60" y="200" width="80" height="32" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{ hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.12, ease: easePremium } } }} />
      <motion.text x="100" y="219" fontSize="8" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, delay: 0.12, ease: easePremium } } }}>
        db
      </motion.text>

      <motion.path d="M 100 112 L 100 140" stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1.5"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.08, ease: easePremium } } }} />
      <motion.path d="M 94 126 L 100 134 L 106 126" stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1" fill="none"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.08, ease: easePremium } } }} />
      <motion.path d="M 100 172 L 100 200" stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1.5"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.14, ease: easePremium } } }} />
      <motion.path d="M 94 186 L 100 194 L 106 186" stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1" fill="none"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.14, ease: easePremium } } }} />

      <motion.rect x="260" y="80" width="80" height="32" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{ hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.04, ease: easePremium } } }} />
      <motion.text x="300" y="99" fontSize="8" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, delay: 0.04, ease: easePremium } } }}>
        read
      </motion.text>

      <motion.rect x="220" y="160" width="160" height="32" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{ hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.1, ease: easePremium } } }} />
      <motion.text x="300" y="179" fontSize="8" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, delay: 0.1, ease: easePremium } } }}>
        read model
      </motion.text>

      <motion.rect x="220" y="210" width="160" height="32" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{ hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.16, ease: easePremium } } }} />
      <motion.text x="300" y="229" fontSize="8" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, delay: 0.16, ease: easePremium } } }}>
        cache
      </motion.text>

      <motion.path d="M 300 112 L 300 160" stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1.5"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.12, ease: easePremium } } }} />
      <motion.path d="M 294 136 L 300 144 L 306 136" stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1" fill="none"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.12, ease: easePremium } } }} />
      <motion.path d="M 260 192 L 260 210 M 340 192 L 340 210" stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1.5"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.18, ease: easePremium } } }} />

      <motion.path
        d="M 140 156 Q 170 130 260 156"
        stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="0.75"
        strokeDasharray="3 3" fill="none"
        variants={{ hover: { strokeOpacity: 0.3, transition: { duration: 0.5, delay: 0.25, ease: easePremium } } }} />
    </svg>
  );
}
