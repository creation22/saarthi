/**
 * LandingBgIcons — premium stroke-SVG legal/tech icons with path-length
 * animations, designed to live in the landing hero background layer.
 *
 * Every path uses Framer Motion's pathLength (0 → 1) so the "drawing" effect
 * is automatic — no manual stroke-dasharray maths needed.
 */
import { motion } from 'framer-motion';

/* ─── Animation helpers ─────────────────────────────────────────── */

/** Draw once on mount */
const ink = (delay = 0, dur = 2.4, op = 0.10) => ({
  initial:    { pathLength: 0, opacity: 0 },
  animate:    { pathLength: 1, opacity: op },
  transition: { duration: dur, delay, ease: [0.22, 1, 0.36, 1] },
});

/** Draw → hold → erase → repeat */
const loop = (delay = 0, dur = 5, op = 0.09, pause = 5) => ({
  initial:    { pathLength: 0, opacity: 0 },
  animate:    { pathLength: [0, 1, 1, 0], opacity: [0, op, op, 0] },
  transition: {
    duration: dur, delay,
    times:    [0, 0.42, 0.86, 1],
    repeat: Infinity, repeatDelay: pause,
    ease: 'easeInOut',
  },
});

/** Draw once, then breathe (opacity oscillates) */
const breathe = (delay = 0, dur = 2.2, lo = 0.06, hi = 0.13) => ({
  initial:    { pathLength: 0, opacity: 0 },
  animate:    { pathLength: 1, opacity: [0, hi, lo, hi, lo] },
  transition: {
    pathLength: { duration: dur, delay, ease: [0.22, 1, 0.36, 1] },
    opacity:    {
      duration: dur + 5, delay,
      times:    [0, 0.18, 0.55, 0.75, 1],
      repeat: Infinity, ease: 'easeInOut',
    },
  },
});

/* ─── Scales of Justice ─────────────────────────────────────────── */
function Scales({ style }) {
  return (
    <svg viewBox="0 0 200 290" fill="none" style={style}
         stroke="rgba(212,175,55,1)" strokeLinecap="round" strokeLinejoin="round">
      {/* Pole */}
      <motion.line x1="100" y1="8" x2="100" y2="270" strokeWidth="1.7" {...ink(0, 2.8, 0.13)} />
      {/* Top ornament */}
      <motion.circle cx="100" cy="8" r="6"   strokeWidth="1.3" {...ink(0.1, 0.9, 0.11)} />
      <motion.circle cx="100" cy="8" r="2.8" strokeWidth="0.8" {...ink(0.2, 0.6, 0.08)} />
      {/* Beam */}
      <motion.line x1="18" y1="62" x2="182" y2="62" strokeWidth="1.8" {...ink(0.32, 1.4, 0.12)} />
      {/* Pivot diamond */}
      <motion.path d="M100,52 L111,62 L100,72 L89,62 Z" strokeWidth="1.1" {...ink(0.44, 0.9, 0.10)} />
      {/* Tick marks on beam */}
      {[38,58,78,100,122,142,162].map((x, i) => (
        <motion.line key={x} x1={x} y1="55" x2={x} y2="69" strokeWidth="0.7"
          {...ink(0.38 + i * 0.022, 0.5, 0.06)} />
      ))}
      {/* Graduation marks on pole */}
      {[108,148,188,228,262].map((y, i) => (
        <motion.line key={y} x1="93" y1={y} x2="107" y2={y} strokeWidth="0.7"
          {...ink(0.64 + i * 0.036, 0.45, 0.06)} />
      ))}
      {/* ── Left chain + pan (oscillates gently) ── */}
      <motion.line x1="18" y1="62" x2="18" y2="168" strokeWidth="1.2" {...ink(0.62, 1.1, 0.10)} />
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 4.8, delay: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.path d="M-5,168 Q18,150 41,168"  strokeWidth="1.4" {...breathe(0.80, 0.8, 0.10, 0.15)} />
        <motion.path d="M-5,168 Q18,190 41,168"  strokeWidth="1.4" {...breathe(0.84, 0.8, 0.10, 0.15)} />
        <motion.path d="M3,168 Q18,160 33,168"   strokeWidth="0.65" {...ink(0.90, 0.5, 0.06)} />
        {/* Tiny item in pan */}
        <motion.rect x="8" y="158" width="20" height="6" rx="1.5" strokeWidth="0.7"
          {...ink(0.96, 0.5, 0.05)} />
      </motion.g>
      {/* ── Right chain + pan (opposite phase) ── */}
      <motion.line x1="182" y1="62" x2="182" y2="184" strokeWidth="1.2" {...ink(0.62, 1.2, 0.10)} />
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [2.5, -2.5, 2.5] }}
        transition={{ duration: 4.8, delay: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.path d="M157,184 Q180,166 203,184" strokeWidth="1.4" {...breathe(0.80, 0.8, 0.10, 0.15)} />
        <motion.path d="M157,184 Q180,206 203,184" strokeWidth="1.4" {...breathe(0.84, 0.8, 0.10, 0.15)} />
        <motion.path d="M165,184 Q180,175 195,184" strokeWidth="0.65" {...ink(0.90, 0.5, 0.06)} />
      </motion.g>
      {/* Base */}
      <motion.path d="M87,270 Q100,262 113,270" strokeWidth="1.2" {...ink(0.96, 0.7, 0.10)} />
      <motion.line x1="66" y1="278" x2="134" y2="278" strokeWidth="1.8" {...ink(1.02, 0.7, 0.12)} />
      <motion.line x1="50" y1="285" x2="150" y2="285" strokeWidth="1.3" {...ink(1.08, 0.6, 0.10)} />
    </svg>
  );
}

/* ─── Gavel ─────────────────────────────────────────────────────── */
function Gavel({ style }) {
  return (
    <svg viewBox="0 0 150 130" fill="none" style={style}
         stroke="rgba(160,130,60,0.5)" strokeLinecap="round" strokeLinejoin="round">
      {/* Head block */}
      <motion.path d="M60,12 L105,32 L90,62 L45,42 Z" strokeWidth="1.7" {...ink(0, 1.9, 0.09)} />
      {/* Head divider / striking face */}
      <motion.line x1="68" y1="16" x2="95" y2="58" strokeWidth="0.8" {...ink(0.46, 0.9, 0.055)} />
      {/* Head top bevel lines */}
      {[[60,12,67,10],[68,16,76,14],[76,20,83,18]].map(([x1,y1,x2,y2],i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.6"
          {...ink(0.52 + i*0.04, 0.4, 0.045)} />
      ))}
      {/* Handle */}
      <motion.line x1="8" y1="118" x2="64" y2="38" strokeWidth="5.5" strokeLinecap="round"
        {...ink(0.22, 1.7, 0.09)} />
      {/* Grip texture rings */}
      {[[18,108],[30,93],[42,78]].map(([x,y],i) => (
        <motion.line key={i} x1={x-7} y1={y+7} x2={x+7} y2={y-7}
          strokeWidth="0.85" {...ink(0.56+i*0.08, 0.5, 0.05)} />
      ))}
      {/* Impact ripple circles — cycling */}
      <motion.circle cx="72" cy="40" r="7"  strokeWidth="0.9" {...loop(0.8, 3.8, 0.10, 6)} />
      <motion.circle cx="72" cy="40" r="14" strokeWidth="0.55" {...loop(1.0, 3.8, 0.06, 6)} />
      <motion.circle cx="72" cy="40" r="21" strokeWidth="0.35" {...loop(1.2, 3.8, 0.04, 6)} />
      {/* Sound block */}
      <motion.rect x="90" y="88" width="52" height="18" rx="3" strokeWidth="1.5"
        {...ink(0.68, 1.0, 0.09)} />
      {[96,104,112,120,128,134].map((x, i) => (
        <motion.line key={x} x1={x} y1="91" x2={x} y2="103" strokeWidth="0.65"
          {...ink(0.78 + i*0.028, 0.4, 0.05)} />
      ))}
    </svg>
  );
}

/* ─── Open Book ─────────────────────────────────────────────────── */
function Book({ style }) {
  const lines = [34, 50, 66, 82, 98, 112, 125];
  return (
    <svg viewBox="0 0 220 155" fill="none" style={style}
         stroke="rgba(212,175,55,1)" strokeLinecap="round" strokeLinejoin="round">
      {/* Covers */}
      <motion.path d="M6,10 Q2,77 6,144 L98,144 L98,10 Z"  strokeWidth="1.6" {...ink(0, 2.0, 0.10)} />
      <motion.path d="M214,10 Q218,77 214,144 L122,144 L122,10 Z" strokeWidth="1.6" {...ink(0, 2.0, 0.10)} />
      {/* Spine creases */}
      <motion.path d="M98,10 Q92,77 98,144"  strokeWidth="1.0" {...ink(0.28, 1.6, 0.07)} />
      <motion.path d="M122,10 Q128,77 122,144" strokeWidth="1.0" {...ink(0.28, 1.6, 0.07)} />
      {/* Center binding */}
      <motion.line x1="110" y1="7" x2="110" y2="147" strokeWidth="1.9" {...ink(0.14, 2.1, 0.12)} />
      {/* Left text lines */}
      {lines.map((y,i) => (
        <motion.line key={`l${y}`} x1="20" y1={y}
          x2={i===lines.length-1 ? 68 : 86} y2={y}
          strokeWidth="0.85" {...ink(0.42+i*0.054, 0.65, 0.065)} />
      ))}
      {/* Right text lines */}
      {lines.map((y,i) => (
        <motion.line key={`r${y}`} x1="134" y1={y}
          x2={i===lines.length-1 ? 172 : 198} y2={y}
          strokeWidth="0.85" {...ink(0.46+i*0.054, 0.65, 0.065)} />
      ))}
      {/* Chapter circle + cross */}
      <motion.circle cx="168" cy="22" r="8" strokeWidth="0.8" {...ink(0.86, 0.8, 0.06)} />
      <motion.line x1="168" y1="16" x2="168" y2="28" strokeWidth="0.7" {...ink(0.91, 0.5, 0.05)} />
      <motion.line x1="162" y1="22" x2="174" y2="22" strokeWidth="0.7" {...ink(0.93, 0.4, 0.05)} />
      {/* Corner curl */}
      <motion.path d="M75,10 Q87,22 98,10" strokeWidth="0.85" {...ink(1.06, 0.7, 0.06)} />
      {/* Section symbol on right page */}
      <motion.path
        d="M152,58 Q162,50 170,58 Q178,66 168,74 Q158,82 166,90 Q174,98 164,106"
        strokeWidth="1.1" fill="none" {...loop(1.5, 4, 0.07, 8)} />
    </svg>
  );
}

/* ─── Fingerprint ───────────────────────────────────────────────── */
function Fingerprint({ style }) {
  // 9 arcs, 320° sweep (40° gap at 0°), center (90,90)
  // cos20°=0.9397, sin20°=0.3420
  const CX = 90, CY = 90, c = 0.9397, s = 0.3420;
  const radii = [6, 13, 21, 30, 39, 49, 59, 70, 81];
  const rings = radii.map(r => ({
    r,
    sx: +(CX + r*c).toFixed(2), sy: +(CY - r*s).toFixed(2),
    ex: +(CX + r*c).toFixed(2), ey: +(CY + r*s).toFixed(2),
  }));

  return (
    <svg viewBox="0 0 180 180" fill="none" style={style}
         stroke="rgba(230,92,0,1)" strokeLinecap="round">
      {/* Center dot */}
      <motion.circle cx="90" cy="90" r="3.5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.22 }}
        transition={{ delay: 0, duration: 0.55, type: 'spring', stiffness: 260 }}
      />
      {/* Rings */}
      {rings.map(({ r, sx, sy, ex, ey }, i) => (
        <motion.path key={r}
          d={`M ${sx},${sy} A ${r},${r} 0 1 1 ${ex},${ey}`}
          strokeWidth={Math.max(0.55, 1.55 - i * 0.11)}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0, 0.11 + i * 0.007, 0.07 + i * 0.006, 0.11 + i * 0.007],
          }}
          transition={{
            pathLength: { duration: 1.9 + i * 0.18, delay: 0.04 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
            opacity:    { duration: 1.9 + i * 0.18 + 4.5, delay: 0.04 + i * 0.12,
                          times: [0, 0.28, 0.62, 1], repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}
    </svg>
  );
}

/* ─── Court Columns ─────────────────────────────────────────────── */
function Columns({ style }) {
  const cols = [38, 120, 202];
  return (
    <svg viewBox="0 0 240 210" fill="none" style={style}
         stroke="rgba(160,130,60,0.5)" strokeLinecap="round" strokeLinejoin="round">
      {/* Steps */}
      <motion.rect x="0"   y="186" width="240" height="13" rx="1" strokeWidth="1.5" {...ink(0,   1.1, 0.09)} />
      <motion.rect x="8"   y="173" width="224" height="13" rx="1" strokeWidth="1.4" {...ink(0.1, 1.0, 0.08)} />
      <motion.rect x="16"  y="160" width="208" height="13" rx="1" strokeWidth="1.4" {...ink(0.2, 1.0, 0.08)} />
      {/* Columns */}
      {cols.map((x, i) => (
        <g key={x}>
          <motion.line x1={x} y1="160" x2={x} y2="88" strokeWidth="3.8"
            {...ink(0.28 + i*0.09, 1.6, 0.10)} />
          {/* Capital abacus */}
          <motion.rect x={x-14} y="75" width="28" height="13" rx="1" strokeWidth="1.3"
            {...ink(0.52 + i*0.09, 0.7, 0.09)} />
          {/* Echinus curve */}
          <motion.path d={`M${x-12},88 Q${x},81 ${x+12},88`} strokeWidth="1.0"
            {...ink(0.58 + i*0.09, 0.5, 0.06)} />
          {/* Base */}
          <motion.rect x={x-15} y="154" width="30" height="6" rx="1" strokeWidth="1.2"
            {...ink(0.22 + i*0.08, 0.7, 0.09)} />
          {/* Fluting — 5 vertical lines per column */}
          {[-6,-3,0,3,6].map((dx, j) => (
            <motion.line key={j} x1={x+dx} y1="156" x2={x+dx} y2="90" strokeWidth="0.4"
              {...ink(0.38 + i*0.09 + j*0.025, 1.3, 0.032)} />
          ))}
        </g>
      ))}
      {/* Entablature */}
      <motion.rect x="24" y="62" width="192" height="13" rx="1" strokeWidth="1.4"
        {...ink(0.65, 0.9, 0.09)} />
      {/* Pediment */}
      <motion.path d="M20,62 L120,8 L220,62" strokeWidth="1.7" {...ink(0.78, 1.5, 0.11)} />
      {/* Pediment tympanum details */}
      <motion.line x1="95" y1="40" x2="120" y2="12" strokeWidth="0.7" {...ink(0.94, 0.6, 0.05)} />
      <motion.line x1="120" y1="12" x2="145" y2="40" strokeWidth="0.7" {...ink(0.94, 0.6, 0.05)} />
      <motion.circle cx="120" cy="35" r="8" strokeWidth="0.7" {...ink(0.98, 0.7, 0.05)} />
      {/* Acroterion */}
      <motion.path d="M114,8 Q120,0 126,8" strokeWidth="0.9" {...ink(1.05, 0.6, 0.07)} />
      <motion.circle cx="120" cy="4" r="3.5" strokeWidth="0.8" {...ink(1.10, 0.5, 0.06)} />
    </svg>
  );
}

/* ─── Circuit / Neural Traces ───────────────────────────────────── */
function Circuit({ style }) {
  const nodes = [
    [40,30],[80,60],[80,20],[120,20],[120,80],
    [30,90],[70,50],[100,80],[100,40],[140,60],[160,30],[160,90],
  ];
  return (
    <svg viewBox="0 0 180 120" fill="none" style={style}
         stroke="rgba(160,130,60,0.5)" strokeLinecap="round" strokeLinejoin="round">
      {/* Trace layer A */}
      <motion.path d="M0,30 L40,30 L40,60 L80,60 L80,20 L120,20 L120,80 L160,80 L160,90 L180,90"
        strokeWidth="1.2" {...ink(0, 2.4, 0.08)} />
      {/* Trace layer B */}
      <motion.path d="M0,90 L30,90 L30,50 L70,50 L70,80 L100,80 L100,40 L160,40 L160,30 L180,30"
        strokeWidth="1.2" {...ink(0.25, 2.4, 0.06)} />
      {/* Vertical spur */}
      <motion.path d="M20,0 L20,30 M140,120 L140,80"
        strokeWidth="1.0" {...ink(0.55, 1.6, 0.05)} />
      {/* Cycling gold highlight — signal pulse */}
      <motion.path d="M0,30 L40,30 L40,20 L80,20 L80,60 L120,60"
        strokeWidth="2.2" stroke="rgba(212,175,55,1)"
        {...loop(2.2, 3.5, 0.18, 7)} />
      {/* Second pulse on B layer */}
      <motion.path d="M180,90 L160,90 L160,80 L120,80 L120,40"
        strokeWidth="2.2" stroke="rgba(230,92,0,1)"
        {...loop(5.0, 3.2, 0.14, 9)} />
      {/* Node dots */}
      {nodes.map(([cx,cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r="3.5"
          fill="rgba(160,130,60,0.04)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.14 }}
          transition={{ delay: 0.85 + i*0.05, duration: 0.3, type: 'spring', stiffness: 420 }}
        />
      ))}
      {/* Components */}
      <motion.rect x="55" y="14" width="22" height="12" rx="2" strokeWidth="1.0"
        {...ink(1.1, 0.6, 0.07)} />
      <motion.rect x="84" y="54" width="22" height="12" rx="2" strokeWidth="1.0"
        {...ink(1.2, 0.6, 0.07)} />
      <motion.rect x="124" y="34" width="22" height="12" rx="2" strokeWidth="1.0"
        {...ink(1.3, 0.6, 0.06)} />
    </svg>
  );
}

/* ─── Legal Scroll ──────────────────────────────────────────────── */
function Scroll({ style }) {
  return (
    <svg viewBox="0 0 120 165" fill="none" style={style}
         stroke="rgba(212,175,55,1)" strokeLinecap="round" strokeLinejoin="round">
      {/* Body */}
      <motion.rect x="14" y="22" width="92" height="122" rx="4" strokeWidth="1.6"
        {...ink(0, 1.9, 0.10)} />
      {/* Top roll */}
      <motion.path d="M14,22 Q3,22 3,34 Q3,46 14,46 Q25,46 25,34 Q25,22 14,22"
        strokeWidth="1.3" {...ink(0.3, 1.4, 0.09)} />
      {/* Bottom roll */}
      <motion.path d="M106,144 Q117,144 117,132 Q117,120 106,120 Q95,120 95,132 Q95,144 106,144"
        strokeWidth="1.3" {...ink(0.35, 1.4, 0.09)} />
      {/* Text lines */}
      {[42,58,74,90,106,120].map((y,i) => (
        <motion.line key={y} x1="28" y1={y}
          x2={i===5 ? 74 : 92} y2={y}
          strokeWidth="0.85" {...ink(0.5 + i*0.056, 0.65, 0.065)} />
      ))}
      {/* Wax seal */}
      <motion.circle cx="74" cy="128" r="15" strokeWidth="1.2" {...ink(0.88, 0.9, 0.09)} />
      <motion.circle cx="74" cy="128" r="9.5" strokeWidth="0.7" {...ink(0.96, 0.7, 0.06)} />
      {/* Checkmark */}
      <motion.path d="M69,128 L72,132 L79,122" strokeWidth="1.3" {...ink(1.04, 0.6, 0.11)} />
      {/* Ribbon lines on seal */}
      {[0,60,120,180,240,300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.line key={angle}
            x1={+(74 + 9.5 * Math.cos(rad)).toFixed(1)}
            y1={+(128 + 9.5 * Math.sin(rad)).toFixed(1)}
            x2={+(74 + 15 * Math.cos(rad)).toFixed(1)}
            y2={+(128 + 15 * Math.sin(rad)).toFixed(1)}
            strokeWidth="0.55"
            {...ink(1.0 + i * 0.04, 0.4, 0.07)}
          />
        );
      })}
    </svg>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
export default function LandingBgIcons() {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0,
      overflow: 'hidden', pointerEvents: 'none',
    }}>

      {/* § — huge ambient section glyph, near-invisible */}
      <div style={{
        position: 'absolute', left: '44%', top: '38%',
        transform: 'translate(-50%,-50%)',
        fontFamily: 'Georgia, serif',
        fontSize: '42rem', lineHeight: 1, fontWeight: 400,
        color: 'rgba(0,0,0,0.04)',
        userSelect: 'none',
      }}>§</div>

      {/* ── Scales — right side, large, vertically centered ── */}
      <div style={{ position: 'absolute', right: '-2%', top: '8%', width: 'min(240px, 18vw)' }}>
        <Scales style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* ── Gavel — top-left ── */}
      <div style={{ position: 'absolute', left: '-1%', top: '9%', width: 'min(200px, 16vw)' }}>
        <Gavel style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* ── Book — bottom-left ── */}
      <div style={{ position: 'absolute', left: '-1%', bottom: '8%', width: 'min(240px, 18vw)' }}>
        <Book style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* ── Columns — bottom-right ── */}
      <div style={{ position: 'absolute', right: '-1%', bottom: '5%', width: 'min(250px, 19vw)' }}>
        <Columns style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* ── Fingerprint — upper-left of center, large, very subtle ── */}
      <div style={{ position: 'absolute', left: '3%', top: '22%', width: 'min(210px, 16vw)' }}>
        <Fingerprint style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* ── Circuit — upper-right area ── */}
      <div style={{ position: 'absolute', right: '2%', top: '60%', width: 'min(220px, 17vw)' }}>
        <Circuit style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* ── Scroll — mid-left ── */}
      <div style={{ position: 'absolute', left: '2%', top: '52%', width: 'min(130px, 10vw)' }}>
        <Scroll style={{ width: '100%', height: 'auto' }} />
      </div>

    </div>
  );
}
