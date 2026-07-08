import { motion } from 'motion/react';
import { easePremium } from './shared';

const c = {
  input: '#38BDF8', // sky — original long URL
  output: '#10B981', // emerald — generated short URL
  transform: '#F59E0B', // amber — hash / encode step
};

export default function UrlShorteningDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="url-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.input} stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#url-bg)" />

      <motion.rect
        x="40" y="110" width="120" height="28" rx="4"
        stroke={c.input} strokeOpacity={0.28} strokeWidth="1"
        fill={c.input} fillOpacity={0.2}
        variants={{
          hover: { strokeOpacity: 7, fillOpacity: 0.52, transition: { duration: 0.4, ease: easePremium } },
        }}
      />

      <motion.rect
        x="240" y="118" width="80" height="20" rx="4"
        stroke={c.output} strokeOpacity={0.62} strokeWidth="1"
        fill={c.output} fillOpacity={0.2}
        variants={{
          hover: { strokeOpacity: 0.75, fillOpacity: 0.14, transition: { duration: 0.4, delay: 0.08, ease: easePremium } },
        }}
      />

      <motion.path
        d="M 165 124 C 190 80, 225 128, 240 128"
        stroke={c.transform} strokeOpacity={0.68} strokeWidth="1.5" fill="none"
        variants={{
          hover: { strokeOpacity: 0.7, transition: { duration: 0.5, delay: 0.15, ease: easePremium } },
        }}
      />
      <motion.path
        d="M 232 122 L 240 128 L 232 134"
        stroke={c.transform} strokeOpacity={0.68} strokeWidth="1.5" fill="none"
        variants={{
          hover: { strokeOpacity: 0.7, transition: { duration: 0.5, delay: 0.15, ease: easePremium } },
        }}
      />

      <motion.text x="60" y="102" fontSize="8"
        fill={c.input} fillOpacity={0.8} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.8, transition: { duration: 0.3, ease: easePremium } } }}>
        long_url
      </motion.text>
      <motion.text x="250" y="112" fontSize="8"
        fill={c.output} fillOpacity={0.8} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.8, transition: { duration: 0.3, delay: 0.1, ease: easePremium } } }}>
        short_url
      </motion.text>
    </svg>
  );
}
