import { motion } from 'motion/react';
import { easePremium } from './shared';

export default function InstagramDiagram() {
  return (
    <svg className="pointer-events-none h-full w-full" viewBox="0 0 400 300" fill="none">
      <defs>
        <radialGradient id="ig-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ig-bg)" />

      {/* Horizontal divider lines for 3 subsystems */}
      {[1, 2].map((i) => (
        <motion.line
          key={`div-${i}`}
          x1="20" y1={50 + i * 68} x2="380" y2={50 + i * 68}
          stroke="var(--color-primary)" strokeOpacity={0.04} strokeWidth="0.5" strokeDasharray="2 4"
          variants={{
            hover: { strokeOpacity: 0.15, transition: { duration: 0.5, delay: i * 0.08, ease: easePremium } },
          }}
        />
      ))}

      {/* Section labels */}
      {[
        { y: 42, label: 'upload' },
        { y: 110, label: 'feed' },
        { y: 178, label: 'engagement' },
      ].map((s, i) => (
        <motion.text key={`label-${i}`} x="24" y={s.y} fontSize="6" textAnchor="start"
          fill="var(--color-primary)" fillOpacity={0.15} fontFamily="monospace" letterSpacing="1"
          variants={{
            hover: { fillOpacity: 0.4, transition: { duration: 0.3, delay: i * 0.06, ease: easePremium } },
          }}>
          {s.label}
        </motion.text>
      ))}

      {/* Client icon (phone shape) — left side */}
      <motion.g
        variants={{
          hover: { scale: 1.08, transition: { duration: 0.4, ease: easePremium } },
        }}
      >
        <motion.rect x="20" y="62" width="22" height="34" rx="4"
          stroke="var(--color-primary)" strokeOpacity={0.15} strokeWidth="1"
          fill="var(--color-primary)" fillOpacity={0.02}
        />
        <motion.circle cx="31" cy="88" r="3"
          stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.5" fill="none"
        />
        <motion.line x1="24" y1="66" x2="38" y2="66"
          stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="0.5"
        />
      </motion.g>

      {/* Upload Pipeline — row 1 */}
      {/* Client → API GW */}
      <motion.line x1="42" y1="79" x2="95" y2="79"
        stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="1"
        variants={{ hover: { strokeOpacity: 0.35, transition: { duration: 0.4, delay: 0.04, ease: easePremium } } }}
      />
      <motion.polygon points="88,74 98,79 88,84"
        fill="var(--color-primary)" fillOpacity={0.1}
        variants={{ hover: { fillOpacity: 0.4, transition: { duration: 0.4, delay: 0.04, ease: easePremium } } }}
      />
      {/* API GW */}
      <motion.rect x="98" y="69" width="46" height="20" rx="3"
        stroke="var(--color-primary)" strokeOpacity={0.14} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.04, ease: easePremium } },
        }}
      />
      <motion.text x="121" y="83" fontSize="6" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.15} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.4, transition: { duration: 0.3, delay: 0.04, ease: easePremium } } }}>
        API GW
      </motion.text>

      {/* API GW → Post Service */}
      <motion.line x1="144" y1="79" x2="185" y2="79"
        stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="1"
        variants={{ hover: { strokeOpacity: 0.35, transition: { duration: 0.4, delay: 0.08, ease: easePremium } } }}
      />
      {/* Post Service */}
      <motion.rect x="188" y="69" width="50" height="20" rx="3"
        stroke="var(--color-primary)" strokeOpacity={0.14} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.08, ease: easePremium } },
        }}
      />
      <motion.text x="213" y="83" fontSize="6" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.15} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.4, transition: { duration: 0.3, delay: 0.08, ease: easePremium } } }}>
        Post
      </motion.text>

      {/* Post → S3 (upward) */}
      <motion.path d="M 207 69 L 207 52" stroke="var(--color-primary)" strokeOpacity={0.07} strokeWidth="0.75" strokeDasharray="3 3"
        variants={{ hover: { strokeOpacity: 0.3, transition: { duration: 0.4, delay: 0.12, ease: easePremium } } }}
      />
      {/* S3 */}
      <motion.rect x="193" y="40" width="28" height="18" rx="2"
        stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="0.75"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.45, fillOpacity: 0.06, transition: { duration: 0.4, delay: 0.12, ease: easePremium } },
        }}
      />
      <motion.text x="207" y="52" fontSize="5" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.12} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.35, transition: { duration: 0.3, delay: 0.12, ease: easePremium } } }}>
        S3
      </motion.text>

      {/* Post → Kafka (right) */}
      <motion.line x1="238" y1="79" x2="278" y2="79"
        stroke="var(--color-primary)" strokeOpacity={0.07} strokeWidth="0.75"
        variants={{ hover: { strokeOpacity: 0.3, transition: { duration: 0.4, delay: 0.14, ease: easePremium } } }}
      />
      {/* Kafka icon (stacked circles) */}
      {[0, 1, 2].map((i) => (
        <motion.ellipse key={`kafka-${i}`} cx="290" cy={75 + i * 4} rx="12" ry="3"
          stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.75" fill="none"
          variants={{
            hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.16 + i * 0.04, ease: easePremium } },
          }}
        />
      ))}

      {/* Post → Metadata DB (down-right) */}
      <motion.path d="M 238 82 Q 280 95 300 100" stroke="var(--color-primary)" strokeOpacity={0.06} strokeWidth="0.75" strokeDasharray="3 3" fill="none"
        variants={{ hover: { strokeOpacity: 0.25, transition: { duration: 0.5, delay: 0.18, ease: easePremium } } }}
      />
      {/* PostgreSQL (cylinder) */}
      <motion.ellipse cx="310" cy="100" rx="10" ry="3"
        stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.75" fill="none"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.2, ease: easePremium } } }}
      />
      <motion.line x1="300" y1="100" x2="300" y2="110"
        stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.75"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.2, ease: easePremium } } }}
      />
      <motion.line x1="320" y1="100" x2="320" y2="110"
        stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.75"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.2, ease: easePremium } } }}
      />
      <motion.ellipse cx="310" cy="110" rx="10" ry="3"
        stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.75" fill="none"
        variants={{ hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.2, ease: easePremium } } }}
      />

      {/* Feed Pipeline — row 2 */}
      {/* Client → Feed API GW */}
      <motion.line x1="42" y1="135" x2="95" y2="135"
        stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="1"
        variants={{ hover: { strokeOpacity: 0.35, transition: { duration: 0.4, delay: 0.06, ease: easePremium } } }}
      />
      <motion.polygon points="88,130 98,135 88,140"
        fill="var(--color-primary)" fillOpacity={0.1}
        variants={{ hover: { fillOpacity: 0.4, transition: { duration: 0.4, delay: 0.06, ease: easePremium } } }}
      />
      {/* Feed API GW */}
      <motion.rect x="98" y="125" width="46" height="20" rx="3"
        stroke="var(--color-primary)" strokeOpacity={0.14} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.06, ease: easePremium } },
        }}
      />
      <motion.text x="121" y="139" fontSize="6" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.15} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.4, transition: { duration: 0.3, delay: 0.06, ease: easePremium } } }}>
        API GW
      </motion.text>

      {/* Feed API GW → Feed Service */}
      <motion.line x1="144" y1="135" x2="185" y2="135"
        stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="1"
        variants={{ hover: { strokeOpacity: 0.35, transition: { duration: 0.4, delay: 0.1, ease: easePremium } } }}
      />
      <motion.rect x="188" y="125" width="50" height="20" rx="3"
        stroke="var(--color-primary)" strokeOpacity={0.14} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.1, ease: easePremium } },
        }}
      />
      <motion.text x="213" y="139" fontSize="6" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.15} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.4, transition: { duration: 0.3, delay: 0.1, ease: easePremium } } }}>
        Feed
      </motion.text>

      {/* Feed Service → Redis (down) */}
      <motion.line x1="213" y1="145" x2="213" y2="158"
        stroke="var(--color-primary)" strokeOpacity={0.07} strokeWidth="0.75"
        variants={{ hover: { strokeOpacity: 0.3, transition: { duration: 0.4, delay: 0.14, ease: easePremium } } }}
      />
      {/* Redis */}
      <motion.rect x="199" y="160" width="28" height="18" rx="9"
        stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.75"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.45, fillOpacity: 0.06, transition: { duration: 0.4, delay: 0.14, ease: easePremium } },
        }}
      />
      <motion.text x="213" y="172" fontSize="5" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.12} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.35, transition: { duration: 0.3, delay: 0.14, ease: easePremium } } }}>
        Redis
      </motion.text>

      {/* Engagement & Search — row 3 */}
      {/* Client → Eng API GW */}
      <motion.line x1="42" y1="195" x2="95" y2="195"
        stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="1"
        variants={{ hover: { strokeOpacity: 0.35, transition: { duration: 0.4, delay: 0.08, ease: easePremium } } }}
      />
      <motion.polygon points="88,190 98,195 88,200"
        fill="var(--color-primary)" fillOpacity={0.1}
        variants={{ hover: { fillOpacity: 0.4, transition: { duration: 0.4, delay: 0.08, ease: easePremium } } }}
      />
      {/* Eng API GW */}
      <motion.rect x="98" y="185" width="46" height="20" rx="3"
        stroke="var(--color-primary)" strokeOpacity={0.14} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.08, ease: easePremium } },
        }}
      />
      <motion.text x="121" y="199" fontSize="6" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.15} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.4, transition: { duration: 0.3, delay: 0.08, ease: easePremium } } }}>
        API GW
      </motion.text>

      {/* Eng API GW → Eng Service */}
      <motion.line x1="144" y1="195" x2="185" y2="195"
        stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth="1"
        variants={{ hover: { strokeOpacity: 0.35, transition: { duration: 0.4, delay: 0.12, ease: easePremium } } }}
      />
      <motion.rect x="188" y="185" width="60" height="20" rx="3"
        stroke="var(--color-primary)" strokeOpacity={0.14} strokeWidth="1"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.55, fillOpacity: 0.07, transition: { duration: 0.4, delay: 0.12, ease: easePremium } },
        }}
      />
      <motion.text x="218" y="199" fontSize="6" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.15} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.4, transition: { duration: 0.3, delay: 0.12, ease: easePremium } } }}>
        Engagement
      </motion.text>

      {/* Eng Service → Kafka */}
      <motion.line x1="248" y1="195" x2="278" y2="195"
        stroke="var(--color-primary)" strokeOpacity={0.07} strokeWidth="0.75"
        variants={{ hover: { strokeOpacity: 0.3, transition: { duration: 0.4, delay: 0.16, ease: easePremium } } }}
      />
      {[0, 1, 2].map((i) => (
        <motion.ellipse key={`eng-kafka-${i}`} cx="290" cy={191 + i * 4} rx="12" ry="3"
          stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.75" fill="none"
          variants={{
            hover: { strokeOpacity: 0.4, transition: { duration: 0.4, delay: 0.18 + i * 0.04, ease: easePremium } },
          }}
        />
      ))}

      {/* Eng Service → Redis (down) */}
      <motion.line x1="218" y1="205" x2="218" y2="218"
        stroke="var(--color-primary)" strokeOpacity={0.06} strokeWidth="0.75"
        variants={{ hover: { strokeOpacity: 0.25, transition: { duration: 0.4, delay: 0.2, ease: easePremium } } }}
      />
      <motion.rect x="204" y="220" width="28" height="18" rx="9"
        stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.75"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.45, fillOpacity: 0.06, transition: { duration: 0.4, delay: 0.2, ease: easePremium } },
        }}
      />
      <motion.text x="218" y="232" fontSize="5" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.12} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.35, transition: { duration: 0.3, delay: 0.2, ease: easePremium } } }}>
        Redis
      </motion.text>

      {/* API GW → Search Service (down-right branch) */}
      <motion.path d="M 144 205 Q 160 230 220 250" stroke="var(--color-primary)" strokeOpacity={0.06} strokeWidth="0.75" strokeDasharray="3 3" fill="none"
        variants={{ hover: { strokeOpacity: 0.25, transition: { duration: 0.5, delay: 0.22, ease: easePremium } } }}
      />
      <motion.rect x="220" y="242" width="46" height="18" rx="3"
        stroke="var(--color-primary)" strokeOpacity={0.12} strokeWidth="0.75"
        fill="var(--color-primary)" fillOpacity={0.02}
        variants={{
          hover: { strokeOpacity: 0.45, fillOpacity: 0.06, transition: { duration: 0.4, delay: 0.24, ease: easePremium } },
        }}
      />
      <motion.text x="243" y="254" fontSize="5" textAnchor="middle"
        fill="var(--color-primary)" fillOpacity={0.12} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.35, transition: { duration: 0.3, delay: 0.24, ease: easePremium } } }}>
        Search
      </motion.text>

      {/* Search → Elasticsearch (right) */}
      <motion.line x1="266" y1="251" x2="295" y2="251"
        stroke="var(--color-primary)" strokeOpacity={0.06} strokeWidth="0.75"
        variants={{ hover: { strokeOpacity: 0.25, transition: { duration: 0.4, delay: 0.28, ease: easePremium } } }}
      />
      {/* Elasticsearch (stacked bars) */}
      {[0, 1, 2].map((i) => (
        <motion.rect key={`es-${i}`} x="296" y={244 + i * 6} width="6" height="4" rx="0.5"
          stroke="var(--color-primary)" strokeOpacity={0.1} strokeWidth="0.5"
          fill="var(--color-primary)" fillOpacity={0.02}
          variants={{
            hover: { fillOpacity: 0.08, strokeOpacity: 0.35, transition: { duration: 0.4, delay: 0.3 + i * 0.04, ease: easePremium } },
          }}
        />
      ))}
      <motion.text x="310" y="251" fontSize="4" textAnchor="start"
        fill="var(--color-primary)" fillOpacity={0.1} fontFamily="monospace"
        variants={{ hover: { fillOpacity: 0.35, transition: { duration: 0.3, delay: 0.32, ease: easePremium } } }}>
        ES
      </motion.text>
    </svg>
  );
}
