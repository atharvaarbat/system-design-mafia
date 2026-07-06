import { motion } from 'motion/react';
import { easePremium } from './shared';

export default function UrlShorteningDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="url-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#url-bg)" />

      <motion.rect
        x="40" y="110" width="120" height="28" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.03}
        variants={{
          hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, ease: easePremium } },
        }}
      />

      <motion.rect
        x="240" y="118" width="80" height="20" rx="4"
        stroke="var(--color-primary)" strokeOpacity={0.22} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.04}
        variants={{
          hover: { strokeOpacity: 0.65, fillOpacity: 0.09, transition: { duration: 0.4, delay: 0.08, ease: easePremium } },
        }}
      />

      <motion.path
        d="M 165 124 C 190 80, 225 128, 240 128"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1.5" fill="none"
        variants={{
          hover: { strokeOpacity: 0.55, transition: { duration: 0.5, delay: 0.15, ease: easePremium } },
        }}
      />
      <motion.path
        d="M 232 122 L 240 128 L 232 134"
        stroke="var(--color-primary)" strokeOpacity={0.18} strokeWidth="1.5" fill="none"
        variants={{
          hover: { strokeOpacity: 0.55, transition: { duration: 0.5, delay: 0.15, ease: easePremium } },
        }}
      />

      <motion.text x="60" y="102" fontSize="8"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, ease: easePremium } } }}>
        long_url
      </motion.text>
      <motion.text x="250" y="112" fontSize="8"
        fill="var(--color-primary)" fillOpacity={0.18} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.45, transition: { duration: 0.3, delay: 0.1, ease: easePremium } } }}>
        short_url
      </motion.text>
    </svg>
  );
}
