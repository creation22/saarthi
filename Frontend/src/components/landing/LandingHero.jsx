import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

/* ─── Counter ─────────────────────────────────────────────────── */
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      n = Math.min(n + step, to);
      setVal(n);
      if (n >= to) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Typewriter ──────────────────────────────────────────────── */
const QUERIES = [
  'What are my rights as a tenant?',
  'How do I file an RTI application?',
  "My employer hasn't paid me — what can I do?",
  'ஐடி சட்டத்தின் கீழ் என் உரிமைகள் என்ன?',
  'मेरे मकान मालिक ने किराया बढ़ा दिया, क्या यह सही है?',
  'How do I challenge wrongful termination?',
];

function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = QUERIES[idx];
    if (typing) {
      if (text.length < target.length) {
        const t = setTimeout(() => setText(target.slice(0, text.length + 1)), 38);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTyping(false), 2400);
      return () => clearTimeout(t);
    }
    if (text.length > 0) {
      const t = setTimeout(() => setText(s => s.slice(0, -1)), 14);
      return () => clearTimeout(t);
    }
    setIdx(i => (i + 1) % QUERIES.length);
    setTyping(true);
  }, [text, typing, idx]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
      letterSpacing: '0.02em', color: 'rgba(30,20,10,0.35)',
      minHeight: '1.4em',
    }}>
      <span style={{ color: 'rgba(180,130,10,0.55)' }}>"</span>
      <span style={{ color: 'rgba(30,20,10,0.65)' }}>{text}</span>
      <motion.span
        style={{ display: 'inline-block', width: 1.5, height: '0.8em',
                 background: 'rgba(160,110,10,0.7)', verticalAlign: 'middle', flexShrink: 0 }}
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <span style={{ color: 'rgba(212,175,55,0.5)' }}>"</span>
    </div>
  );
}

/* ─── Floating Annotation Card ────────────────────────────────── */
function AnnotationCard({ children, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        background: 'rgba(246,241,233,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(160,110,10,0.15)',
        borderRadius: 12,
        padding: '12px 16px',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Noise Grain Overlay ─────────────────────────────────────── */
function Grain() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
      opacity: 0.035,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundSize: '256px',
    }} />
  );
}

/* ─── Grid Lines ─────────────────────────────────────────────── */
function GridLines() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
         preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      {/* Vertical lines */}
      {[0, 25, 50, 75, 100].map(x => (
        <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%"
              stroke="rgba(30,20,10,0.05)" strokeWidth="1" />
      ))}
      {/* Horizontal lines */}
      {[0, 33, 66, 100].map(y => (
        <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
              stroke="rgba(30,20,10,0.05)" strokeWidth="1" />
      ))}
      {/* Diagonal accent */}
      <motion.line x1="0%" y1="100%" x2="55%" y2="0%"
            stroke="rgba(160,110,10,0.15)" strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: 'easeInOut' }}
      />
    </svg>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────── */
export default function LandingHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y        = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const opacity  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: '#F6F1E9',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grain />
      <GridLines />

      {/* Warm amber radial glow — lower left */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 65% 55% at -5% 110%, rgba(180,130,20,0.08) 0%, transparent 70%)',
      }} />
      {/* Gold glow — upper right */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 55% 55% at 105% 0%, rgba(180,130,20,0.1) 0%, transparent 60%)',
      }} />
      {/* Central warm luminance */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 80% 60% at 40% 50%, rgba(246,241,233,0.9) 0%, transparent 70%)',
      }} />

      {/* ── Main content ──────────────────────────────────────────── */}
      <motion.div style={{ y, opacity, flex: 1, position: 'relative', zIndex: 10 }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: 'clamp(6rem, 14vw, 10rem) clamp(1.5rem, 6vw, 5rem) clamp(4rem, 8vw, 6rem)',
          display: 'grid',
          gridTemplateColumns: '1fr max-content',
          alignItems: 'end',
          gap: '3rem',
          minHeight: '100svh',
          boxSizing: 'border-box',
        }}>

          {/* ── Left column ─────────────────────────────────────── */}
          <div>

            {/* Eyebrow label */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2.5rem' }}
            >
              <div style={{
                width: 28, height: 1,
                background: 'linear-gradient(90deg, rgba(180,130,20,0.7), rgba(180,130,20,0.1))',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(160,110,10,0.75)',
              }}>
                Free · Statute-grounded · 11+ Languages
              </span>
            </motion.div>

            {/* Headline */}
            <div style={{ marginBottom: '2rem' }}>
              {['Every Indian', 'deserves a', 'lawyer.'].map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, y: 48 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.08 + i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden', lineHeight: 1 }}
                >
                  <span style={{
                    display: 'block',
                    fontFamily: '"Lora", "Playfair Display", Georgia, serif',
                    fontWeight: 700,
                    fontSize: 'clamp(3.4rem, 8.5vw, 7.5rem)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.03em',
                    color: i === 2 ? 'transparent' : '#1A1410',
                    ...(i === 2 ? {
                      WebkitTextStroke: '1.5px rgba(160,110,10,0.85)',
                    } : {}),
                    fontStyle: i === 1 ? 'italic' : 'normal',
                  }}>
                    {line}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Sub copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                lineHeight: 1.75,
                fontWeight: 400,
                color: 'rgba(30,20,10,0.52)',
                maxWidth: 420,
                marginBottom: '1.4rem',
              }}
            >
              Ask legal questions by voice or text. Get answers grounded in actual
              statute text — every response cites the exact Act and Section.
            </motion.p>

            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              style={{ marginBottom: '2.8rem' }}
            >
              <Typewriter />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
            >
              <Link to="/chat" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                textDecoration: 'none',
                background: '#E65C00',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 600,
                letterSpacing: '0.01em',
                padding: '14px 28px',
                borderRadius: 6,
                boxShadow: '0 0 0 1px rgba(230,92,0,0.5), 0 8px 32px rgba(230,92,0,0.3)',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#cc5200';
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(230,92,0,0.7), 0 12px 40px rgba(230,92,0,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#E65C00';
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(230,92,0,0.5), 0 8px 32px rgba(230,92,0,0.3)';
              }}>
                Ask a Legal Question
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>

              <Link to="/analyze" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                textDecoration: 'none',
                color: 'rgba(30,20,10,0.55)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 400,
                padding: '14px 22px',
                borderRadius: 6,
                border: '1px solid rgba(30,20,10,0.15)',
                background: 'rgba(30,20,10,0.03)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(160,110,10,0.4)';
                e.currentTarget.style.color = 'rgba(30,20,10,0.85)';
                e.currentTarget.style.background = 'rgba(212,175,55,0.07)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(30,20,10,0.15)';
                e.currentTarget.style.color = 'rgba(30,20,10,0.55)';
                e.currentTarget.style.background = 'rgba(30,20,10,0.03)';
              }}>
                Analyze a Contract
              </Link>
            </motion.div>

          </div>

          {/* ── Right column — vertical stat stack ──────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              alignSelf: 'center',
              paddingBottom: '2rem',
            }}
            className="hidden lg:flex"
          >
            {[
              { n: 22, suffix: '+', label: 'Acts Indexed' },
              { n: 11, suffix: '', label: 'Languages' },
              { n: 50000, suffix: '+', label: 'Queries' },
            ].map(({ n, suffix, label }, i) => (
              <div key={label} style={{
                textAlign: 'right',
                padding: '20px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{
                  fontFamily: '"Lora", Georgia, serif',
                  fontSize: 'clamp(2.2rem, 3.2vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: '#8B6914',
                  marginBottom: 4,
                }}>
                  <Counter to={n} suffix={suffix} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(30,20,10,0.38)',
                }}>
                  {label}
                </div>
              </div>
            ))}

            {/* Vertical label */}
            <div style={{
              marginTop: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(30,20,10,0.2)',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}>
                Powered by Claude · Sarvam AI · Pinecone
              </span>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          zIndex: 10,
          borderTop: '1px solid rgba(30,20,10,0.08)',
          background: 'rgba(246,241,233,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
        }}
      >
        {[
          { icon: '⚖', text: 'IPC · CrPC · BNSS 2023' },
          { icon: '🔒', text: 'No sign-up required' },
          { icon: '🌐', text: 'Hindi · Tamil · Telugu · Bengali + 7 more' },
          { icon: '📄', text: 'Generate FIRs, RTI, Legal Notices' },
        ].map((item, i) => (
          <div key={i} style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 20px',
            borderRight: i < 3 ? '1px solid rgba(30,20,10,0.07)' : 'none',
          }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.55 }}>{item.icon}</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.06em',
              color: 'rgba(30,20,10,0.4)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── Floating annotation cards (desktop only) ──────────────── */}
      <div className="hidden xl:block">

        {/* Top-right: statute citation card */}
        <AnnotationCard
          delay={1.2}
          style={{ top: '18%', right: '3%', maxWidth: 230 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(160,110,10,0.7)', marginBottom: 6,
          }}>
            Statute Citation
          </div>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
            fontWeight: 500, color: 'rgba(30,20,10,0.8)',
            lineHeight: 1.5, marginBottom: 8,
          }}>
            Consumer Protection Act, 2019
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'rgba(30,20,10,0.4)',
          }}>
            Section 35(1)(a) — Defect in goods
          </div>
          <div style={{
            marginTop: 8, height: 2,
            background: 'linear-gradient(90deg, rgba(160,110,10,0.45), transparent)',
            borderRadius: 2,
          }} />
        </AnnotationCard>

        {/* Mid-right: confidence badge */}
        <AnnotationCard
          delay={1.5}
          style={{ top: '42%', right: '5%', maxWidth: 180 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px rgba(16,185,129,0.5)',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(30,20,10,0.4)',
            }}>
              AI Confidence
            </span>
          </div>
          <div style={{
            fontFamily: '"Lora", Georgia, serif', fontSize: '1.8rem',
            fontWeight: 700, color: '#1A1410', letterSpacing: '-0.03em', lineHeight: 1,
          }}>
            97%
          </div>
          <div style={{
            marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            color: 'rgba(30,20,10,0.3)',
          }}>
            Statute match score
          </div>
        </AnnotationCard>

      </div>

    </section>
  );
}
