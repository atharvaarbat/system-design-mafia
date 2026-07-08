import { motion } from 'motion/react';
import { easePremium } from './shared';

// Semantic palette for the streaming pipeline
const c = {
  brand: '#E50914', // Netflix red — play motif
  ingest: '#F59E0B', // amber — upload / transcode pipeline
  storage: '#10B981', // emerald — origin storage
  cdn: '#38BDF8', // sky — edge / CDN
  stream: '#22D3EE', // cyan — streaming delivery
  client: '#A78BFA', // violet — client devices
};

export default function NetflixDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="nf-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.brand} stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#nf-bg)" />

      {/* Primary: platform / transcode pipeline */}
      <motion.rect
        x={120} y={110} width={72} height={28} rx="4"
        stroke={c.ingest} strokeOpacity={0.4} strokeWidth="1"
        fill={c.ingest} fillOpacity={0.12}
        variants={{
          hover: { strokeOpacity: 0.7, fillOpacity: 0.3, transition: { duration: 0.4, ease: easePremium } },
        }}
      />
      <motion.rect
        x={120} y={150} width={72} height={28} rx="4"
        stroke={c.ingest} strokeOpacity={0.4} strokeWidth="1"
        fill={c.ingest} fillOpacity={0.12}
        variants={{
          hover: { strokeOpacity: 0.7, fillOpacity: 0.3, transition: { duration: 0.4, delay: 0.06, ease: easePremium } },
        }}
      />

      {/* Pipeline connection */}
      <motion.path
        d="M 156 138 L 156 150"
        stroke={c.ingest} strokeOpacity={0.4} strokeWidth="1"
        variants={{
          hover: { strokeOpacity: 0.7, transition: { duration: 0.4, delay: 0.08, ease: easePremium } },
        }}
      />

      {/* Ambient: play button motif */}
      <motion.path
        d="M 100 152 L 100 136 L 112 144 Z"
        fill={c.brand} fillOpacity={0.35}
        variants={{
          hover: { fillOpacity: 0.75, transition: { duration: 0.4, delay: 0.08, ease: easePremium } },
        }}
      />

      {/* Storage node */}
      <motion.rect
        x={210} y={132} width={36} height={24} rx="3"
        stroke={c.storage} strokeOpacity={0.4} strokeWidth="1"
        fill={c.storage} fillOpacity={0.12}
        variants={{
          hover: { strokeOpacity: 0.65, fillOpacity: 0.3, transition: { duration: 0.4, delay: 0.1, ease: easePremium } },
        }}
      />

      {/* CDN node */}
      <motion.circle
        cx="270" cy="70" r={18}
        stroke={c.cdn} strokeOpacity={0.5} strokeWidth="1"
        fill={c.cdn} fillOpacity={0.12}
        variants={{
          hover: { r: 21, strokeOpacity: 0.7, fillOpacity: 0.3, transition: { duration: 0.45, delay: 0.12, ease: easePremium } },
        }}
      />
      <motion.text x="270" y="74" fontSize="7" textAnchor="middle"
        fill={c.cdn} fillOpacity={0.7} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.9, transition: { duration: 0.3, delay: 0.12, ease: easePremium } } }}>
        CDN
      </motion.text>

      {/* Secondary: upload arrow (left → platform) */}
      <motion.path
        d="M 10 144 L 120 144"
        stroke={c.ingest} strokeOpacity={0.45} strokeWidth="1.5"
        variants={{
          hover: { strokeOpacity: 0.8, transition: { duration: 0.5, delay: 0.02, ease: easePremium } },
        }}
      />
      <motion.path
        d="M 108 138 L 120 144 L 108 150"
        stroke={c.ingest} strokeOpacity={0.45} strokeWidth="1.5" fill="none"
        variants={{
          hover: { strokeOpacity: 0.8, transition: { duration: 0.5, delay: 0.02, ease: easePremium } },
        }}
      />

      {/* Pipeline → storage */}
      <motion.path
        d="M 192 144 L 210 144"
        stroke={c.storage} strokeOpacity={0.4} strokeWidth="1"
        variants={{
          hover: { strokeOpacity: 0.7, transition: { duration: 0.4, delay: 0.1, ease: easePremium } },
        }}
      />

      {/* Storage → CDN */}
      <motion.path
        d="M 228 132 Q 250 100 270 88"
        stroke={c.cdn} strokeOpacity={0.35} strokeWidth="0.75" strokeDasharray="3 3" fill="none"
        variants={{
          hover: { strokeOpacity: 0.7, transition: { duration: 0.5, delay: 0.14, ease: easePremium } },
        }}
      />

      {/* Primary: client devices (right, stacked) */}
      {[[320, 130], [320, 190], [320, 250]].map(([x, y], i) => (
        <g key={`client-${i}`}>
          <motion.circle
            cx={x} cy={y} r={11}
            stroke={c.client} strokeOpacity={0.4} strokeWidth="1"
            fill={c.client} fillOpacity={0.12}
            variants={{
              hover: { r: 13, strokeOpacity: 0.65, fillOpacity: 0.3, transition: { duration: 0.4, delay: 0.16 + i * 0.06, ease: easePremium } },
            }}
          />
          <motion.circle
            cx={x} cy={y} r={2.5}
            fill={c.client} fillOpacity={0.6}
            variants={{
              hover: { r: 5, fillOpacity: 0.9, transition: { duration: 0.35, delay: 0.16 + i * 0.06, ease: easePremium } },
            }}
          />
        </g>
      ))}

      {/* Secondary: streaming paths (CDN → devices) */}
      {[[320, 130], [320, 190], [320, 250]].map(([x, y], i) => (
        <motion.path
          key={`stream-${i}`}
          d={`M 288 70 Q ${x - 20} ${y - 10 + i * 5} ${x - 11} ${y}`}
          stroke={c.stream} strokeOpacity={0.35} strokeWidth="0.75"
          fill="none" strokeDasharray="3 4"
          variants={{
            hover: { strokeOpacity: 0.7, transition: { duration: 0.5, delay: 0.2 + i * 0.06, ease: easePremium } },
          }}
        />
      ))}
    </svg>
  );
}
