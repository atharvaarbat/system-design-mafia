import { motion } from 'motion/react';
import { easePremium } from './shared';

export default function NetflixDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="nf-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#nf-bg)" />

      {/* Primary: platform / processing pipeline */}
      <motion.rect
        x="120" y="110" width="72" height="28" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{
          hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, ease: easePremium } },
        }}
      />
      <motion.rect
        x="120" y="150" width="72" height="28" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{
          hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.06, ease: easePremium } },
        }}
      />

      {/* Pipeline connection */}
      <motion.path
        d="M 156 138 L 156 150"
        stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="1"
        variants={{
          hover: { strokeOpacity: 0.35, transition: { duration: 0.4, delay: 0.08, ease: easePremium } },
        }}
      />

      {/* Ambient: play button motif */}
      <motion.path
        d="M 100 152 L 100 136 L 112 144 Z"
        fill="var(--color-primary)" fillOpacity={0.06}
        variants={{
          hover: { fillOpacity: 0.2, scale: 1.15, transition: { duration: 0.4, delay: 0.08, ease: easePremium } },
        }}
      />

      {/* Storage node */}
      <motion.rect
        x="210" y="132" width="36" height="24" rx="3"
        stroke="var(--color-primary)" strokeOpacity={0.15} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.5, fillOpacity: 0.06, transition: { duration: 0.4, delay: 0.1, ease: easePremium } },
        }}
      />

      {/* CDN node */}
      <motion.circle
        cx="270" cy="70" r="18"
        stroke="var(--color-primary)" strokeOpacity={0.16} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{
          hover: { scale: 1.15, strokeOpacity: 0.55, fillOpacity: 0.08, transition: { duration: 0.45, delay: 0.12, ease: easePremium } },
        }}
      />
      <motion.text x="270" y="74" fontSize="7" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.2} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.5, transition: { duration: 0.3, delay: 0.12, ease: easePremium } } }}>
        CDN
      </motion.text>

      {/* Secondary: upload arrow (left → platform) */}
      <motion.path
        d="M 10 144 L 120 144"
        stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1.5"
        variants={{
          hover: { strokeOpacity: 0.45, transition: { duration: 0.5, delay: 0.02, ease: easePremium } },
        }}
      />
      <motion.path
        d="M 108 138 L 120 144 L 108 150"
        stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="1.5" fill="none"
        variants={{
          hover: { strokeOpacity: 0.45, transition: { duration: 0.5, delay: 0.02, ease: easePremium } },
        }}
      />

      {/* Pipeline → storage */}
      <motion.path
        d="M 192 144 L 210 144"
        stroke="var(--color-primary)" strokeOpacity={0.09} strokeWidth="1"
        variants={{
          hover: { strokeOpacity: 0.32, transition: { duration: 0.4, delay: 0.1, ease: easePremium } },
        }}
      />

      {/* Storage → CDN */}
      <motion.path
        d="M 228 132 Q 250 100 270 88"
        stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="0.75" strokeDasharray="3 3" fill="none"
        variants={{
          hover: { strokeOpacity: 0.3, transition: { duration: 0.5, delay: 0.14, ease: easePremium } },
        }}
      />

      {/* Primary: client devices (right, stacked) */}
      {[[320, 130], [320, 190], [320, 250]].map(([x, y], i) => (
        <motion.g key={`client-${i}`}>
          <motion.circle
            cx={x} cy={y} r="11"
            stroke="var(--color-primary)" strokeOpacity={0.14} strokeWidth="1"
            fill="var(--color-primary)" fillOpacity={0.02}
            variants={{
              hover: { scale: 1.2, strokeOpacity: 0.5, fillOpacity: 0.06, transition: { duration: 0.4, delay: 0.16 + i * 0.06, ease: easePremium } },
            }}
          />
          <motion.circle
            cx={x} cy={y} r="2.5"
            fill="var(--color-primary)" fillOpacity={0.15}
            variants={{
              hover: { scale: 2, fillOpacity: 0.6, transition: { duration: 0.35, delay: 0.16 + i * 0.06, ease: easePremium } },
            }}
          />
        </motion.g>
      ))}

      {/* Secondary: streaming paths (CDN → devices) */}
      {[[320, 130], [320, 190], [320, 250]].map(([x, y], i) => (
        <motion.path
          key={`stream-${i}`}
          d={`M 288 70 Q ${x - 20} ${y - 10 + i * 5} ${x - 11} ${y}`}
          stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="0.75"
          fill="none" strokeDasharray="3 4"
          variants={{
            hover: { strokeOpacity: 0.3, transition: { duration: 0.5, delay: 0.2 + i * 0.06, ease: easePremium } },
          }}
        />
      ))}
    </svg>
  );
}
