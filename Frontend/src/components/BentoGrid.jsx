import { motion } from 'framer-motion';

/* ─── Base grid container ────────────────────────────────────────── */
export function BentoGrid({ className = '', children, ...motionProps }) {
  return (
    <motion.div className={`mx-auto grid max-w-6xl grid-cols-1 gap-4 md:auto-rows-[22rem] md:grid-cols-3 ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

/* ─── Individual item ────────────────────────────────────────────── */
export function BentoGridItem({ className = '', title, description, header, icon, variants }) {
  return (
    <motion.div
      variants={variants}
      className={`group/bento flex flex-col justify-between space-y-4 rounded-2xl border p-5 cursor-default overflow-hidden ${className}`}
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory)' }}
      whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(0,0,0,0.50), 0 0 0 1px rgba(197,148,58,0.30)', borderColor: 'rgba(197,148,58,0.38)' }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
    >
      {/* Visual header */}
      <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
        {header}
      </div>

      {/* Text block slides right on hover */}
      <div className="transition-transform duration-200 group-hover/bento:translate-x-2">
        <div className="flex items-center gap-2.5 mb-2">
          {icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                 style={{ background: 'var(--color-ivory-deep)' }}>
              {icon}
            </div>
          )}
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600,
                       color: 'var(--color-ink)', lineHeight: 1.2 }}>{title}</h3>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', lineHeight: 1.65,
                    color: 'var(--color-ink-muted)' }}>{description}</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   VISUAL HEADERS
═══════════════════════════════════════════════════════════════════ */

/* ── Waveform static data (module-level so Math.random runs once) ─── */
const WAVEFORM_BARS   = Array.from({ length: 40 }, (_, i) => ({
  h: 14 + Math.sin(i * 0.48) * 18 + Math.cos(i * 0.85) * 12,
  delay: i * 0.035,
}));
const WAVEFORM_SPECTRO = Array.from({ length: 16 }, (_, i) => ({
  h: 8 + Math.sin(i * 0.9 + 1.2) * 22 + (((i * 7 + 3) % 9) / 9) * 8,
  delay: i * 0.07,
  opacity: 0.25 + Math.sin(i * 0.6) * 0.15,
}));

/* ── Waveform — Voice Input  ──────────────────────────────────────── */
export function WaveformHeader() {
  const bars   = WAVEFORM_BARS;
  const spectro = WAVEFORM_SPECTRO;

  return (
    <div className="relative flex h-full items-center justify-center rounded-xl overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #140a04 0%, #0d0600 100%)', minHeight: 140 }}>

      {/* Grid overlay */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        <defs>
          <pattern id="wgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(212,100,30,1)" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wgrid)" />
      </svg>

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 55% at 50% 55%, rgba(212,100,30,0.22) 0%, transparent 70%)'
      }} />

      {/* Scanning vertical line */}
      <motion.div className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,100,30,0.6), transparent)' }}
        animate={{ x: [0, 260, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Spectrogram bg layer */}
      <div className="absolute bottom-8 flex items-end gap-1" style={{ left: '10%', right: '10%' }}>
        {spectro.map(({ h, delay, opacity }, i) => (
          <motion.div key={i}
            style={{ flex: 1, borderRadius: 2, background: `rgba(212,100,30,${opacity})` }}
            animate={{ scaleY: [1, 1.4 + Math.sin(i) * 0.4, 0.6, 1.2, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }}
            initial={{ height: h * 0.6 }}
          >
            <div style={{ height: h * 0.6, width: '100%' }} />
          </motion.div>
        ))}
      </div>

      {/* Main waveform bars */}
      <div className="relative flex items-center gap-[2.5px]" style={{ height: 70 }}>
        {bars.map(({ h, delay }, i) => (
          <motion.div key={i}
            style={{ width: 2.5, borderRadius: 4, background: i % 3 === 0 ? 'var(--color-saffron)' : 'rgba(212,100,30,0.75)', height: h }}
            animate={{ scaleY: [1, 1.7, 0.5, 1.4, 0.8, 1], opacity: [0.6, 1, 0.5, 0.95, 0.6] }}
            transition={{ duration: 2.0, repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Frequency path overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 140">
        <motion.path
          d="M0,70 C20,55 40,85 60,70 C80,55 100,40 120,70 C140,100 160,50 180,70 C200,90 220,45 240,70 C260,95 280,65 300,70"
          fill="none" stroke="rgba(212,100,30,0.25)" strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
        />
        <motion.path
          d="M0,70 C15,80 35,60 55,70 C75,80 95,55 115,70 C135,85 155,60 175,70 C195,80 215,55 235,70 C255,85 275,65 300,70"
          fill="none" stroke="rgba(197,148,58,0.15)" strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.8, ease: 'easeOut' }}
        />
      </svg>

      {/* Label */}
      <div className="absolute bottom-2.5 right-4 flex items-center gap-1.5">
        <motion.div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-saffron)' }}
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
                       letterSpacing: '0.22em', color: 'rgba(212,100,30,0.55)', textTransform: 'uppercase' }}>
          Sarvam STT · Mayura
        </span>
      </div>
    </div>
  );
}

/* ── Vector / RAG Retrieval  ──────────────────────────────────────── */
export function VectorHeader() {
  const nodes = [
    { cx: 52,  cy: 38  }, { cx: 155, cy: 22  }, { cx: 248, cy: 50  },
    { cx: 95,  cy: 82  }, { cx: 195, cy: 88  }, { cx: 275, cy: 32  },
    { cx: 135, cy: 55  }, { cx: 60,  cy: 105 },
  ];
  const edges = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[0,6],[1,6],[3,6],[6,4],[3,7],[0,7]];
  // Highlighted search path
  const queryPath = [0, 6, 1, 4];

  return (
    <div className="relative flex h-full items-center justify-center rounded-xl overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #060e0d 0%, #040a09 100%)', minHeight: 140 }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 60% at 45% 50%, rgba(197,148,58,0.11) 0%, transparent 70%)'
      }} />

      <svg viewBox="0 0 320 128" className="absolute inset-0 w-full h-full" style={{ opacity: 0.95 }}>
        {/* All edges */}
        {edges.map(([a, b], i) => {
          const isQuery = queryPath.some((n, j) => j < queryPath.length - 1 && ((n === a && queryPath[j+1] === b) || (n === b && queryPath[j+1] === a)));
          return (
            <motion.line key={i}
              x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
              stroke={isQuery ? 'rgba(197,148,58,0.65)' : 'rgba(197,148,58,0.2)'}
              strokeWidth={isQuery ? 1.2 : 0.7}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.3 + i * 0.09, ease: 'easeOut' }}
            />
          );
        })}

        {/* Traveling data packet along query path */}
        {queryPath.slice(0, -1).map((fromIdx, i) => {
          const toIdx = queryPath[i + 1];
          const from = nodes[fromIdx];
          const to = nodes[toIdx];
          return (
            <motion.circle key={`packet-${i}`} r={2.5}
              fill="var(--color-gold)"
              style={{ filter: 'drop-shadow(0 0 3px rgba(197,148,58,0.8))' }}
              animate={{
                cx: [from.cx, to.cx],
                cy: [from.cy, to.cy],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.9,
                delay: 1.8 + i * 1.0,
                repeat: Infinity,
                repeatDelay: queryPath.length * 1.0 - 0.9,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Pulse rings from query node */}
        {[1, 2, 3].map(i => (
          <motion.circle key={`pulse-${i}`}
            cx={nodes[0].cx} cy={nodes[0].cy} r={6}
            fill="none" stroke="rgba(197,148,58,0.4)" strokeWidth="0.8"
            animate={{ r: [6, 30], opacity: [0.6, 0] }}
            transition={{ duration: 2, delay: 2.5 + i * 0.65, repeat: Infinity, repeatDelay: 0.5, ease: 'easeOut' }}
          />
        ))}

        {/* Query beam (dashed, from left edge) */}
        <motion.line x1="0" y1="64" x2={nodes[0].cx} y2={nodes[0].cy}
          stroke="var(--color-saffron)" strokeWidth="1.0" strokeDasharray="3 2"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.7, delay: 1.2, ease: 'easeOut' }} />

        {/* Nodes */}
        {nodes.map(({ cx, cy }, i) => {
          const isActive = queryPath.includes(i);
          return (
            <g key={i}>
              {isActive && (
                <motion.circle cx={cx} cy={cy} r={i === 0 ? 9 : 7}
                  fill="rgba(197,148,58,0.08)" stroke="rgba(197,148,58,0.25)" strokeWidth="0.5"
                  animate={{ r: [i === 0 ? 9 : 7, i === 0 ? 12 : 9, i === 0 ? 9 : 7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                />
              )}
              <motion.circle cx={cx} cy={cy} r={i === 0 ? 5.5 : 3.5}
                fill={i === 0 ? 'var(--color-saffron)' : isActive ? 'rgba(197,148,58,0.7)' : 'rgba(197,148,58,0.3)'}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ filter: i === 0 ? 'drop-shadow(0 0 4px rgba(212,100,30,0.7))' : 'none' }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1, type: 'spring', stiffness: 400 }}
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2.5 right-4"
           style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
                    letterSpacing: '0.22em', color: 'rgba(197,148,58,0.5)', textTransform: 'uppercase' }}>
        Pinecone · ada-002
      </div>
    </div>
  );
}

/* ── Reasoning Tree — Chain-of-Thought  ──────────────────────────── */
export function ReasoningHeader() {
  // Tree structure: root → branches
  const nodes = [
    { id: 'root',  x: 160, y: 18,  label: 'Query' },
    { id: 'ret',   x: 160, y: 52,  label: 'Retrieve' },
    { id: 'r1',    x: 80,  y: 85,  label: 'Statute A' },
    { id: 'r2',    x: 160, y: 85,  label: 'Statute B' },
    { id: 'r3',    x: 240, y: 85,  label: 'Case C' },
    { id: 'ans',   x: 160, y: 118, label: 'Answer' },
  ];
  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
  ];
  const activeNodes = [0, 1, 3, 5];

  return (
    <div className="relative flex h-full items-center justify-center rounded-xl overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #0f0b08 0%, #160d06 100%)', minHeight: 140 }}>

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,100,30,0.10) 0%, transparent 70%)'
      }} />

      <svg viewBox="0 0 320 140" className="absolute inset-0 w-full h-full">
        {/* Edges */}
        {edges.map(({ from, to }, i) => {
          const f = nodes[from], t = nodes[to];
          const isActive = activeNodes.includes(from) && activeNodes.includes(to);
          return (
            <motion.line key={i}
              x1={f.x} y1={f.y} x2={t.x} y2={t.y}
              stroke={isActive ? 'rgba(212,100,30,0.5)' : 'rgba(212,203,184,0.12)'}
              strokeWidth={isActive ? 1.2 : 0.7}
              strokeDasharray={isActive ? '3 2' : '0'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.14, ease: 'easeOut' }}
            />
          );
        })}

        {/* Traveling signal on active path */}
        {[{ from: 0, to: 1 }, { from: 1, to: 3 }, { from: 3, to: 5 }].map(({ from, to }, i) => {
          const f = nodes[from], t = nodes[to];
          return (
            <motion.circle key={`sig-${i}`} r={2}
              fill="var(--color-saffron)"
              style={{ filter: 'drop-shadow(0 0 3px rgba(212,100,30,0.9))' }}
              animate={{ cx: [f.x, t.x], cy: [f.y, t.y], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 0.7, delay: 2.0 + i * 0.8,
                repeat: Infinity, repeatDelay: 3.5,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(({ x, y, label }, i) => {
          const isActive = activeNodes.includes(i);
          return (
            <g key={i}>
              {isActive && (
                <motion.circle cx={x} cy={y} r={11}
                  fill="rgba(212,100,30,0.08)" stroke="rgba(212,100,30,0.2)" strokeWidth="0.6"
                  animate={{ r: [11, 14, 11] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
                />
              )}
              <motion.circle cx={x} cy={y} r={i === 0 || i === 5 ? 7 : 5}
                fill={isActive ? (i === 0 || i === 5 ? 'var(--color-saffron)' : 'rgba(212,100,30,0.6)') : 'rgba(212,203,184,0.15)'}
                stroke={isActive ? 'rgba(212,100,30,0.4)' : 'rgba(212,203,184,0.1)'}
                strokeWidth="0.8"
                style={{ filter: isActive ? 'drop-shadow(0 0 3px rgba(212,100,30,0.5))' : 'none' }}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.3 + i * 0.12, type: 'spring', stiffness: 380 }}
              />
              <motion.text x={x} y={y + 18} textAnchor="middle"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 7, fill: isActive ? 'rgba(212,100,30,0.75)' : 'rgba(212,203,184,0.2)',
                          letterSpacing: '0.05em', textTransform: 'uppercase' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.12 }}
              >
                {label}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Active indicator */}
      <div className="absolute bottom-2.5 left-4 flex items-center gap-1.5">
        <motion.div
          style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-saffron)' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem',
                       letterSpacing: '0.18em', color: 'rgba(212,100,30,0.5)', textTransform: 'uppercase' }}>
          Reasoning Active
        </span>
      </div>
    </div>
  );
}

/* ── Document Stack — Document Generation  ───────────────────────── */
export function DocumentHeader() {
  const docs = [
    { label: 'FIR Draft',          rotate: -6,  y: 12, bg: 'rgba(212,100,30,0.07)' },
    { label: 'Legal Notice',       rotate: 2.5, y: 6,  bg: 'rgba(197,148,58,0.07)' },
    { label: 'Consumer Complaint', rotate: 0,   y: 0,  bg: 'rgba(244,239,230,0.05)' },
  ];
  const lines = [
    [75, 55, 80, 42, 68, 85, 50],
    [72, 60, 45, 80, 65, 40, 78],
    [80, 55, 70, 45, 82, 52, 65],
  ];

  return (
    <div className="relative flex h-full items-center justify-center rounded-xl overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #100c09 0%, #0d0a07 100%)', minHeight: 140 }}>

      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.03 }}>
        <defs>
          <pattern id="dgrid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(212,203,184,1)" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dgrid)" />
      </svg>

      <div className="relative" style={{ width: 170, height: 120 }}>
        {docs.map(({ label, rotate, y, bg }, i) => (
          <motion.div key={label}
            className="absolute inset-0 rounded-xl border px-4 py-3"
            style={{ rotate, y, background: bg, borderColor: 'rgba(212,203,184,0.1)',
                     zIndex: i + 1, top: i * 5, left: i * 3 }}
            initial={{ opacity: 0, y: 24 + i * 6, rotate: rotate - 5 }}
            animate={{ opacity: 1, y: i * 5, rotate }}
            transition={{ delay: 0.2 + i * 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                          color: 'rgba(197,148,58,0.7)', letterSpacing: '0.14em',
                          textTransform: 'uppercase', marginBottom: 7 }}>
              {label}
            </div>
            {lines[i].map((w, j) => (
              <motion.div key={j} className="mb-1.5 rounded-sm"
                style={{ height: 2.5, background: 'rgba(212,203,184,0.10)' }}
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{ delay: 0.5 + i * 0.15 + j * 0.04, duration: 0.4, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        ))}

        {/* OCR scan line over the top doc */}
        <motion.div
          className="absolute pointer-events-none rounded-sm"
          style={{ zIndex: 10, left: 0, right: 0, height: 2,
                   background: 'linear-gradient(to right, transparent, rgba(212,100,30,0.5), rgba(212,100,30,0.7), rgba(212,100,30,0.5), transparent)' }}
          animate={{ top: [5, 115, 5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </div>

      {/* Download arrow — bouncing */}
      <motion.div className="absolute bottom-3.5 right-5"
        animate={{ y: [0, 5, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="var(--color-saffron)" strokeWidth="1.6" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </motion.div>

      {/* PDF/Word badge */}
      <div className="absolute bottom-3 left-4 flex gap-1.5">
        {['PDF', 'DOCX'].map(ext => (
          <span key={ext} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                                   letterSpacing: '0.12em', color: 'rgba(197,148,58,0.55)',
                                   border: '1px solid rgba(197,148,58,0.2)', borderRadius: 4,
                                   padding: '1px 5px' }}>{ext}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Speedometer — End-to-End Speed  ─────────────────────────────── */
export function SpeedHeader() {
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const angle = -210 + i * 26; // -210° to 120°
    const rad = (angle * Math.PI) / 180;
    const r1 = 32, r2 = i % 3 === 0 ? 27 : 29;
    return {
      x1: 40 + r1 * Math.cos(rad),
      y1: 44 + r1 * Math.sin(rad),
      x2: 40 + r2 * Math.cos(rad),
      y2: 44 + r2 * Math.sin(rad),
      major: i % 3 === 0,
    };
  });

  return (
    <div className="relative flex h-full flex-col items-center justify-center rounded-xl overflow-hidden gap-1"
         style={{ background: 'linear-gradient(135deg, #080d08 0%, #0c0a07 100%)', minHeight: 140 }}>

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 55% at 50% 60%, rgba(197,148,58,0.12) 0%, transparent 70%)'
      }} />

      {/* Speedometer SVG */}
      <svg width="120" height="80" viewBox="0 0 80 55">
        {/* Outer track */}
        <path d="M8,50 A36,36 0 0,1 72,50" fill="none" stroke="rgba(212,203,184,0.06)" strokeWidth="5" strokeLinecap="round" />
        {/* Middle track */}
        <path d="M12,50 A32,32 0 0,1 68,50" fill="none" stroke="rgba(212,203,184,0.04)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Colored fill arc */}
        <motion.path d="M8,50 A36,36 0 0,1 72,50" fill="none" stroke="var(--color-saffron)" strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 0.82 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} />

        {/* Glow arc */}
        <motion.path d="M8,50 A36,36 0 0,1 72,50" fill="none"
          stroke="rgba(212,100,30,0.3)" strokeWidth="8" strokeLinecap="round"
          style={{ filter: 'blur(2px)' }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 0.82 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} />

        {/* Tick marks */}
        {ticks.map((t, i) => (
          <motion.line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.major ? 'rgba(212,203,184,0.35)' : 'rgba(212,203,184,0.15)'}
            strokeWidth={t.major ? 1.0 : 0.6}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          />
        ))}

        {/* Needle */}
        <motion.line
          x1={40} y1={44}
          x2={40 + 26 * Math.cos((-210 + 0.82 * 240) * Math.PI / 180)}
          y2={44 + 26 * Math.sin((-210 + 0.82 * 240) * Math.PI / 180)}
          stroke="white" strokeWidth="1.2" strokeLinecap="round"
          initial={{ rotate: -210, originX: '40px', originY: '44px' }}
          animate={{ rotate: -210 + 0.82 * 240 }}
          style={{ transformOrigin: '40px 44px' }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Center dot */}
        <circle cx="40" cy="44" r="3" fill="var(--color-saffron)" />
        <circle cx="40" cy="44" r="1.5" fill="white" />
      </svg>

      {/* Number */}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 700,
                    color: 'var(--color-saffron)', lineHeight: 1, marginTop: -4,
                    filter: 'drop-shadow(0 0 8px rgba(212,100,30,0.4))' }}>
        5s
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                    letterSpacing: '0.22em', color: 'rgba(212,203,184,0.35)',
                    textTransform: 'uppercase' }}>
        End-to-End
      </div>

      {/* Step labels */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {['STT', 'RAG', 'LLM', 'TTS'].map((s, i) => (
          <motion.span key={s}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.08em',
                     color: 'rgba(197,148,58,0.5)', border: '1px solid rgba(197,148,58,0.2)',
                     borderRadius: 4, padding: '1px 4px' }}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.1 }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ── AI Models — Neural Mesh  ─────────────────────────────────────── */
export function AIModelsHeader() {
  const models = [
    { name: 'Claude', sub: 'Anthropic', color: '#d4641e', glow: 'rgba(212,100,30,0.55)', x: 80 },
    { name: 'GPT-4',  sub: 'OpenAI',    color: '#10b481', glow: 'rgba(16,180,120,0.55)', x: 240 },
  ];
  // Synaptic connections between the two models
  const synapses = [
    { y1: 35, y2: 30 }, { y1: 45, y2: 45 }, { y1: 55, y2: 60 },
    { y1: 65, y2: 50 }, { y1: 40, y2: 70 }, { y1: 75, y2: 40 },
  ];

  return (
    <div className="relative flex h-full items-center justify-center rounded-xl overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #0a0f0f 0%, #080b09 100%)', minHeight: 140 }}>

      {/* Grid bg */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }}>
        <defs>
          <pattern id="agrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(212,203,184,1)" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#agrid)" />
      </svg>

      {/* Synaptic connections */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 140" style={{ opacity: 0.9 }}>
        {synapses.map(({ y1, y2 }, i) => (
          <g key={i}>
            <motion.path
              d={`M${models[0].x + 22},${y1} C${160},${(y1 + y2) / 2} ${160},${(y1 + y2) / 2} ${models[1].x - 22},${y2}`}
              fill="none"
              stroke={i % 2 === 0 ? 'rgba(212,100,30,0.2)' : 'rgba(16,180,120,0.15)'}
              strokeWidth="0.8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
            />
            {/* Traveling signal dot */}
            <motion.circle r={1.8}
              fill={i % 2 === 0 ? '#d4641e' : '#10b481'}
              style={{ filter: `drop-shadow(0 0 3px ${i % 2 === 0 ? '#d4641e' : '#10b481'})` }}
              animate={{
                offsetDistance: ['0%', '100%'],
                opacity: [0, 1, 1, 0],
              }}
              style={{
                offsetPath: `path("M${models[0].x + 22},${y1} C160,${(y1 + y2) / 2} 160,${(y1 + y2) / 2} ${models[1].x - 22},${y2}")`,
              }}
              transition={{
                duration: 1.4,
                delay: 2.0 + i * 0.5,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'linear',
              }}
            />
          </g>
        ))}
      </svg>

      {/* Model tiles */}
      {models.map(({ name, sub, color, glow }, i) => (
        <motion.div key={name}
          className="flex flex-col items-center gap-1.5 relative z-10"
          style={{ margin: '0 3rem' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.18, duration: 0.5, type: 'spring', stiffness: 360 }}
        >
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-white font-bold text-base"
            style={{ background: color, boxShadow: `0 6px 24px ${glow}` }}
            animate={{ boxShadow: [`0 6px 24px ${glow}`, `0 8px 32px ${glow}`, `0 6px 24px ${glow}`] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 1 }}
          >
            {name[0]}
          </motion.div>
          <div className="text-center">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600,
                          color: 'var(--color-ink)' }}>{name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem',
                          color: 'rgba(0,0,0,0.35)', letterSpacing: '0.08em' }}>{sub}</div>
          </div>
        </motion.div>
      ))}

      {/* Grounded badge + accuracy bars */}
      <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-1.5">
        <motion.div style={{ display: 'flex', gap: 2 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          {[92, 78, 96, 85, 100, 88, 94].map((v, i) => (
            <motion.div key={i} style={{ width: 6, background: 'rgba(16,180,120,0.25)', borderRadius: 2, overflow: 'hidden', height: 14 }}>
              <motion.div
                style={{ background: '#10b481', borderRadius: 2, width: '100%' }}
                initial={{ height: 0 }}
                animate={{ height: `${v}%` }}
                transition={{ delay: 1.4 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px',
                             borderRadius: 999, background: 'rgba(16,180,120,0.1)',
                             border: '1px solid rgba(16,180,120,0.22)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <motion.div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b481' }}
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                         color: 'rgba(16,180,120,0.8)', letterSpacing: '0.14em',
                         textTransform: 'uppercase' }}>Hallucination-Free</span>
        </motion.div>
      </div>
    </div>
  );
}
