import { motion } from 'framer-motion';

/* ─ Animation helpers ──────────────────────────────────────────── */

/** Draw once on mount */
const draw = (delay = 0, dur = 2.2, opacity = 0.10) => ({
  initial:    { pathLength: 0, opacity: 0 },
  animate:    { pathLength: 1, opacity },
  transition: { duration: dur, delay, ease: [0.22, 1, 0.36, 1] },
});

/** Infinite draw → hold → erase cycle */
const cycle = (delay = 0, dur = 5, opacity = 0.09, pause = 5) => ({
  initial:    { pathLength: 0, opacity: 0 },
  animate:    { pathLength: [0, 1, 1, 0], opacity: [0, opacity, opacity, 0] },
  transition: {
    duration: dur, delay,
    times: [0, 0.42, 0.86, 1],
    repeat: Infinity, repeatDelay: pause,
    ease: 'easeInOut',
  },
});

/* ─ Scales of Justice ──────────────────────────────────────────── */
function ScalesIcon({ style }) {
  return (
    <svg viewBox="0 0 200 290" fill="none" style={style}
         stroke="rgba(212,175,55,1)" strokeLinecap="round" strokeLinejoin="round">
      {/* Pole */}
      <motion.line x1="100" y1="8" x2="100" y2="272" strokeWidth="1.8" {...draw(0, 2.6, 0.13)} />
      {/* Top ornament */}
      <motion.circle cx="100" cy="8" r="5.5" strokeWidth="1.3" {...draw(0.08, 0.9, 0.11)} />
      <motion.circle cx="100" cy="8" r="2.5" strokeWidth="0.8" {...draw(0.18, 0.7, 0.08)} />
      {/* Beam */}
      <motion.line x1="18" y1="62" x2="182" y2="62" strokeWidth="1.9" {...draw(0.3, 1.4, 0.13)} />
      {/* Pivot diamond */}
      <motion.path d="M100,52 L110,62 L100,72 L90,62 Z" strokeWidth="1.2" {...draw(0.42, 0.9, 0.10)} />
      {/* Beam tick marks */}
      {[40,60,80,100,120,140,160].map((x, i) => (
        <motion.line key={x} x1={x} y1="56" x2={x} y2="68" strokeWidth="0.8"
          {...draw(0.38 + i * 0.022, 0.45, 0.06)} />
      ))}
      {/* Left chain */}
      <motion.line x1="18" y1="62" x2="18" y2="170" strokeWidth="1.3" {...draw(0.62, 1.1, 0.10)} />
      {/* Left pan — gentle oscillation via motion.g */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 4.5, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.path d="M-4,170 Q18,153 40,170" strokeWidth="1.4" {...draw(0.80, 0.8, 0.11)} />
        <motion.path d="M-4,170 Q18,190 40,170" strokeWidth="1.4" {...draw(0.84, 0.8, 0.11)} />
        <motion.path d="M4,170 Q18,162 32,170" strokeWidth="0.7" {...draw(0.90, 0.5, 0.06)} />
      </motion.g>
      {/* Right chain (longer = heavier) */}
      <motion.line x1="182" y1="62" x2="182" y2="186" strokeWidth="1.3" {...draw(0.62, 1.2, 0.10)} />
      {/* Right pan — opposite oscillation phase */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [2, -2, 2] }}
        transition={{ duration: 4.5, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.path d="M158,186 Q180,169 202,186" strokeWidth="1.4" {...draw(0.80, 0.8, 0.11)} />
        <motion.path d="M158,186 Q180,206 202,186" strokeWidth="1.4" {...draw(0.84, 0.8, 0.11)} />
        <motion.path d="M166,186 Q180,177 194,186" strokeWidth="0.7" {...draw(0.90, 0.5, 0.06)} />
      </motion.g>
      {/* Pole graduation marks */}
      {[110,150,190,230,265].map((y, i) => (
        <motion.line key={y} x1="94" y1={y} x2="106" y2={y} strokeWidth="0.8"
          {...draw(0.65 + i * 0.035, 0.5, 0.06)} />
      ))}
      {/* Base */}
      <motion.path d="M88,272 Q100,264 112,272" strokeWidth="1.3" {...draw(0.96, 0.7, 0.10)} />
      <motion.line x1="68" y1="280" x2="132" y2="280" strokeWidth="1.9" {...draw(1.02, 0.7, 0.13)} />
      <motion.line x1="52" y1="287" x2="148" y2="287" strokeWidth="1.4" {...draw(1.08, 0.6, 0.11)} />
    </svg>
  );
}

/* ─ Gavel ──────────────────────────────────────────────────────── */
function GavelIcon({ style }) {
  return (
    <svg viewBox="0 0 140 120" fill="none" style={style}
         stroke="rgba(255,255,255,1)" strokeLinecap="round" strokeLinejoin="round">
      {/* Head block */}
      <motion.path d="M56,12 L98,30 L84,58 L42,40 Z" strokeWidth="1.8" {...draw(0, 1.8, 0.10)} />
      {/* Head divider */}
      <motion.line x1="62" y1="16" x2="90" y2="54" strokeWidth="0.8" {...draw(0.45, 0.9, 0.06)} />
      {/* Handle */}
      <motion.line x1="8" y1="108" x2="60" y2="35" strokeWidth="5" strokeLinecap="round"
        {...draw(0.2, 1.6, 0.09)} />
      {/* Grip rings */}
      {[[20,98],[32,85],[44,72]].map(([x,y], i) => (
        <motion.line key={i} x1={x-6} y1={y+6} x2={x+6} y2={y-6}
          strokeWidth="0.9" {...draw(0.55 + i * 0.08, 0.5, 0.05)} />
      ))}
      {/* Impact circle — cycling */}
      <motion.circle cx="68" cy="38" r="6" strokeWidth="0.9" {...cycle(0.7, 3.5, 0.10, 6)} />
      <motion.circle cx="68" cy="38" r="11" strokeWidth="0.5" {...cycle(0.9, 3.5, 0.06, 6)} />
      {/* Sound block */}
      <motion.rect x="78" y="80" width="52" height="17" rx="3" strokeWidth="1.5"
        {...draw(0.65, 1.0, 0.09)} />
      {/* Sound block lines */}
      {[84,92,100,108,116,124].map((x, i) => (
        <motion.line key={x} x1={x} y1="83" x2={x} y2="94" strokeWidth="0.7"
          {...draw(0.75 + i * 0.03, 0.4, 0.05)} />
      ))}
    </svg>
  );
}

/* ─ Open Book ──────────────────────────────────────────────────── */
function BookIcon({ style }) {
  const lines = [32, 47, 62, 77, 92, 107, 120];
  return (
    <svg viewBox="0 0 200 145" fill="none" style={style}
         stroke="rgba(212,175,55,1)" strokeLinecap="round" strokeLinejoin="round">
      {/* Left cover */}
      <motion.path d="M6,10 Q2,72 6,135 L88,135 L88,10 Z" strokeWidth="1.6" {...draw(0, 2.0, 0.10)} />
      {/* Right cover */}
      <motion.path d="M194,10 Q198,72 194,135 L112,135 L112,10 Z" strokeWidth="1.6" {...draw(0, 2.0, 0.10)} />
      {/* Spine creases */}
      <motion.path d="M88,10 Q83,72 88,135" strokeWidth="1.0" {...draw(0.28, 1.6, 0.07)} />
      <motion.path d="M112,10 Q117,72 112,135" strokeWidth="1.0" {...draw(0.28, 1.6, 0.07)} />
      {/* Center binding */}
      <motion.line x1="100" y1="8" x2="100" y2="138" strokeWidth="1.8" {...draw(0.14, 2.0, 0.12)} />
      {/* Left text lines */}
      {lines.map((y, i) => (
        <motion.line key={`l${y}`} x1="18" y1={y}
          x2={i === lines.length - 1 ? 62 : 78} y2={y}
          strokeWidth="0.85" {...draw(0.42 + i * 0.055, 0.65, 0.06)} />
      ))}
      {/* Right text lines */}
      {lines.map((y, i) => (
        <motion.line key={`r${y}`} x1="122" y1={y}
          x2={i === lines.length - 1 ? 158 : 182} y2={y}
          strokeWidth="0.85" {...draw(0.46 + i * 0.055, 0.65, 0.06)} />
      ))}
      {/* Chapter mark */}
      <motion.circle cx="152" cy="20" r="7" strokeWidth="0.8" {...draw(0.85, 0.8, 0.06)} />
      <motion.line x1="152" y1="15" x2="152" y2="25" strokeWidth="0.7" {...draw(0.9, 0.5, 0.05)} />
      {/* Page corner curl */}
      <motion.path d="M68,10 Q80,20 88,10" strokeWidth="0.8" {...draw(1.05, 0.7, 0.06)} />
    </svg>
  );
}

/* ─ Fingerprint ────────────────────────────────────────────────── */
function FingerprintIcon({ style }) {
  // 8 concentric arcs: 320° sweep, gap at ~0° (right side)
  // center (80,80), cos20°=0.9397, sin20°=0.3420
  const CX = 80, CY = 80;
  const c = 0.9397, s = 0.3420;
  const radii = [7, 14, 21, 28, 35, 43, 51, 60];
  const rings = radii.map(r => ({
    r,
    sx: +( CX + r * c ).toFixed(2),
    sy: +( CY - r * s ).toFixed(2),
    ex: +( CX + r * c ).toFixed(2),
    ey: +( CY + r * s ).toFixed(2),
  }));

  return (
    <svg viewBox="0 0 160 160" fill="none" style={style}
         stroke="rgba(230,92,0,1)" strokeLinecap="round">
      {/* Central dot */}
      <motion.circle cx="80" cy="80" r="3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.20 }}
        transition={{ delay: 0, duration: 0.5, type: 'spring', stiffness: 280 }}
      />
      {/* Rings — draw in staggered sequence then pulse */}
      {rings.map(({ r, sx, sy, ex, ey }, i) => (
        <motion.path
          key={r}
          d={`M ${sx},${sy} A ${r},${r} 0 1 1 ${ex},${ey}`}
          strokeWidth={Math.max(0.6, 1.5 - i * 0.1)}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0, 0.10 + i * 0.008, 0.06 + i * 0.007, 0.10 + i * 0.008],
          }}
          transition={{
            pathLength: { duration: 1.8 + i * 0.18, delay: 0.04 + i * 0.13, ease: [0.22, 1, 0.36, 1] },
            opacity:    { duration: 1.8 + i * 0.18 + 4, delay: 0.04 + i * 0.13,
                          times: [0, 0.3, 0.65, 1], repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}
    </svg>
  );
}

/* ─ Court Columns ──────────────────────────────────────────────── */
function ColumnsIcon({ style }) {
  const cols = [35, 110, 185];
  return (
    <svg viewBox="0 0 220 200" fill="none" style={style}
         stroke="rgba(255,255,255,1)" strokeLinecap="round" strokeLinejoin="round">
      {/* Steps */}
      <motion.rect x="0"  y="178" width="220" height="12" rx="1" strokeWidth="1.5" {...draw(0,   1.0, 0.09)} />
      <motion.rect x="8"  y="166" width="204" height="12" rx="1" strokeWidth="1.4" {...draw(0.1, 0.9, 0.08)} />
      <motion.rect x="16" y="154" width="188" height="12" rx="1" strokeWidth="1.4" {...draw(0.2, 0.9, 0.08)} />
      {/* Columns */}
      {cols.map((x, i) => (
        <g key={x}>
          <motion.line x1={x} y1="154" x2={x} y2="84" strokeWidth="3.5"
            {...draw(0.28 + i * 0.09, 1.5, 0.10)} />
          {/* Capital */}
          <motion.rect x={x-13} y="72" width="26" height="12" rx="1" strokeWidth="1.2"
            {...draw(0.52 + i * 0.09, 0.7, 0.08)} />
          <motion.path d={`M${x-11},84 Q${x},78 ${x+11},84`} strokeWidth="0.9"
            {...draw(0.58 + i * 0.09, 0.5, 0.06)} />
          {/* Base */}
          <motion.rect x={x-14} y="148" width="28" height="6" rx="1" strokeWidth="1.1"
            {...draw(0.22 + i * 0.08, 0.7, 0.08)} />
          {/* Fluting */}
          {[-5,0,5].map((dx, j) => (
            <motion.line key={j} x1={x+dx} y1="150" x2={x+dx} y2="86" strokeWidth="0.45"
              {...draw(0.38 + i * 0.09 + j * 0.03, 1.2, 0.035)} />
          ))}
        </g>
      ))}
      {/* Entablature */}
      <motion.rect x="22" y="58" width="176" height="14" rx="1" strokeWidth="1.4"
        {...draw(0.64, 0.9, 0.09)} />
      {/* Pediment */}
      <motion.path d="M18,58 L110,10 L202,58" strokeWidth="1.6" {...draw(0.76, 1.4, 0.11)} />
      {/* Pediment inner lines */}
      <motion.line x1="90" y1="38" x2="110" y2="14" strokeWidth="0.7" {...draw(0.92, 0.6, 0.05)} />
      <motion.line x1="110" y1="14" x2="130" y2="38" strokeWidth="0.7" {...draw(0.92, 0.6, 0.05)} />
      {/* Acroterion */}
      <motion.path d="M104,10 Q110,2 116,10" strokeWidth="0.9" {...draw(1.0, 0.6, 0.07)} />
      <motion.circle cx="110" cy="5" r="3" strokeWidth="0.8" {...draw(1.06, 0.5, 0.06)} />
    </svg>
  );
}

/* ─ Circuit Traces ─────────────────────────────────────────────── */
function CircuitIcon({ style }) {
  const nodes = [[40,30],[80,60],[80,20],[120,20],[120,80],
                 [30,90],[70,50],[100,80],[100,40],[140,60]];
  return (
    <svg viewBox="0 0 160 120" fill="none" style={style}
         stroke="rgba(255,255,255,1)" strokeLinecap="round" strokeLinejoin="round">
      {/* Main traces */}
      <motion.path d="M0,30 L40,30 L40,60 L80,60 L80,20 L120,20 L120,80 L160,80"
        strokeWidth="1.2" {...draw(0, 2.2, 0.08)} />
      <motion.path d="M0,90 L30,90 L30,50 L70,50 L70,80 L100,80 L100,40 L160,40"
        strokeWidth="1.2" {...draw(0.25, 2.2, 0.06)} />
      <motion.path d="M20,0 L20,30 M140,120 L140,60 L160,60"
        strokeWidth="1.0" {...draw(0.55, 1.6, 0.05)} />
      {/* Cycling highlight trace */}
      <motion.path d="M0,30 L40,30 L40,20 L80,20 L80,60"
        strokeWidth="2.0" stroke="rgba(212,175,55,1)"
        {...cycle(2.0, 3.5, 0.16, 7)} />
      {/* Node dots */}
      {nodes.map(([cx,cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r="3.5"
          fill="rgba(255,255,255,0.05)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.13 }}
          transition={{ delay: 0.9 + i * 0.05, duration: 0.3, type: 'spring', stiffness: 420 }}
        />
      ))}
      {/* Component boxes */}
      <motion.rect x="56" y="14" width="20" height="12" rx="2" strokeWidth="1.0"
        {...draw(1.1, 0.6, 0.07)} />
      <motion.rect x="84" y="54" width="20" height="12" rx="2" strokeWidth="1.0"
        {...draw(1.2, 0.6, 0.07)} />
    </svg>
  );
}

/* ─ Legal Scroll ───────────────────────────────────────────────── */
function ScrollIcon({ style }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" style={style}
         stroke="rgba(212,175,55,1)" strokeLinecap="round" strokeLinejoin="round">
      {/* Body */}
      <motion.rect x="15" y="20" width="90" height="120" rx="4" strokeWidth="1.6"
        {...draw(0, 1.8, 0.10)} />
      {/* Top roll */}
      <motion.path d="M15,20 Q5,20 5,32 Q5,44 15,44 Q25,44 25,32 Q25,20 15,20"
        strokeWidth="1.3" {...draw(0.3, 1.4, 0.09)} />
      {/* Bottom roll */}
      <motion.path d="M105,140 Q115,140 115,128 Q115,116 105,116 Q95,116 95,128 Q95,140 105,140"
        strokeWidth="1.3" {...draw(0.35, 1.4, 0.09)} />
      {/* Text lines */}
      {[38,54,70,86,102,116].map((y, i) => (
        <motion.line key={y} x1="30" y1={y}
          x2={i === 5 ? 75 : 90} y2={y}
          strokeWidth="0.85" {...draw(0.5 + i * 0.055, 0.65, 0.06)} />
      ))}
      {/* Wax seal */}
      <motion.circle cx="75" cy="125" r="14" strokeWidth="1.2" {...draw(0.88, 0.9, 0.09)} />
      <motion.circle cx="75" cy="125" r="9"  strokeWidth="0.7" {...draw(0.96, 0.7, 0.06)} />
      {/* Checkmark in seal */}
      <motion.path d="M70,125 L73,129 L80,121" strokeWidth="1.2" {...draw(1.04, 0.6, 0.10)} />
    </svg>
  );
}

/* ─ Main export ────────────────────────────────────────────────── */
export default function HomeBgIcons() {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0,
      overflow: 'hidden', zIndex: 0, pointerEvents: 'none',
    }}>
      {/* § — giant ambient section symbol */}
      <div style={{
        position: 'absolute', left: '46%', top: '40%',
        transform: 'translate(-50%,-50%)',
        fontFamily: 'Georgia, serif',
        fontSize: '36rem', lineHeight: 1, fontWeight: 400,
        color: 'rgba(255,255,255,0.011)',
        userSelect: 'none',
      }}>§</div>

      {/* Scales — top-right */}
      <div style={{ position: 'absolute', right: 28, top: 50, width: 210 }}>
        <ScalesIcon style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Gavel — top-left */}
      <div style={{ position: 'absolute', left: 8, top: 60, width: 162 }}>
        <GavelIcon style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Book — bottom-left */}
      <div style={{ position: 'absolute', left: 16, bottom: 90, width: 190 }}>
        <BookIcon style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Columns — bottom-right */}
      <div style={{ position: 'absolute', right: 18, bottom: 50, width: 205 }}>
        <ColumnsIcon style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Fingerprint — center, slightly above middle */}
      <div style={{ position: 'absolute', left: '50%', top: '20%',
                    transform: 'translateX(-50%)', width: 172 }}>
        <FingerprintIcon style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Circuit — upper-center area */}
      <div style={{ position: 'absolute', left: '28%', top: 68, width: 168 }}>
        <CircuitIcon style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Scroll — right-center */}
      <div style={{ position: 'absolute', right: '16%', top: '44%', width: 112 }}>
        <ScrollIcon style={{ width: '100%', height: 'auto' }} />
      </div>
    </div>
  );
}
