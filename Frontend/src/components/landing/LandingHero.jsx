import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { fadeUp, stagger } from './landingShared.jsx';
import LandingBgIcons from './LandingBgIcons.jsx';

/* ── Deterministic particle data (LCG, no hydration mismatch) ── */
function lcg(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
const _rng = lcg(42);
const PARTICLE_DATA = Array.from({ length: 22 }, (_, i) => {
  const r = _rng;
  return {
    id: i,
    x: r() * 100, y: r() * 100,
    size: 1 + r() * 1.8,
    duration: 16 + r() * 24,
    delay: r() * 10,
    driftX: (r() - 0.5) * 28,
    driftY: -14 - r() * 32,
    opacity: 0.06 + r() * 0.12,
  };
});

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLE_DATA.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: p.id % 3 === 0 ? 'var(--color-saffron)' : 'var(--color-gold)',
          }}
          animate={{ x: [0, p.driftX, 0], y: [0, p.driftY, 0], opacity: [0, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function HeroArcs() {
  const pp = (delay, opacity = 0.08) => ({
    initial:    { pathLength: 0, opacity: 0 },
    animate:    { pathLength: 1, opacity },
    transition: { duration: 3.8, delay, ease: 'easeInOut' },
  });
  return (
    <svg viewBox="0 0 1000 700" fill="none"
         className="absolute inset-0 w-full h-full pointer-events-none"
         stroke="var(--color-gold)" preserveAspectRatio="xMidYMid slice">
      <motion.path d="M-80,0 Q280,340 720,120"   strokeWidth="0.7" {...pp(0.2)} />
      <motion.path d="M1000,680 Q620,240 120,460" strokeWidth="0.55" {...pp(0.5)} />
      <motion.path d="M0,580 L1000,80"            strokeWidth="0.35" {...pp(0.9, 0.05)} />
      <motion.path d="M-80,200 Q340,400 800,180"  strokeWidth="0.4"  {...pp(1.1, 0.06)} />
      <motion.path d="M1000,400 Q600,100 100,300" strokeWidth="0.4"  {...pp(1.4, 0.05)} />
      <motion.ellipse cx="820" cy="80"  rx="110" ry="110" strokeWidth="0.4" {...pp(0.4, 0.07)} />
      <motion.ellipse cx="820" cy="80"  rx="70"  ry="70"  strokeWidth="0.25" {...pp(0.65, 0.04)} />
      <motion.circle  cx="110" cy="600" r="55"            strokeWidth="0.35" {...pp(1.0, 0.07)} />
      <motion.circle  cx="110" cy="600" r="28"            strokeWidth="0.2"  {...pp(1.25, 0.05)} />
      {[[820,80],[110,600],[240,130],[780,390],[420,490],[560,75],[880,430]].map(([cx,cy],i) => (
        <motion.circle key={i} cx={cx} cy={cy} r={2}
          fill="var(--color-gold)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25 }}
          transition={{ delay: 1.2 + i * 0.12, duration: 0.45, type: 'spring' }}
        />
      ))}
    </svg>
  );
}

function Counter({ to, suffix }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = Math.ceil(to / 55);
    const t = setInterval(() => {
      n = Math.min(n + step, to);
      setVal(n);
      if (n >= to) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const TW_QUESTIONS = [
  'What are my rights as a tenant?',
  'How do I file an RTI application?',
  "My employer hasn't paid me in 2 months — what can I do?",
  'I received a defective product, can I claim a refund?',
  'What is anticipatory bail and how do I apply?',
  'मेरे मकान मालिक ने किराया बढ़ा दिया — क्या यह सही है?',
  'ஐடி சட்டத்தின் கீழ் என் உரிமைகள் என்ன?',
];

function TypewriterLine() {
  const [idx, setIdx]         = useState(0);
  const [displayed, setDisp]  = useState('');
  const [isTyping, setTyping] = useState(true);

  useEffect(() => {
    const target = TW_QUESTIONS[idx];
    if (isTyping) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisp(target.slice(0, displayed.length + 1)), 40);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTyping(false), 2200);
      return () => clearTimeout(t);
    }
    if (displayed.length > 0) {
      const t = setTimeout(() => setDisp(d => d.slice(0, -1)), 16);
      return () => clearTimeout(t);
    }
    setTimeout(() => { setIdx(i => (i + 1) % TW_QUESTIONS.length); setTyping(true); }, 0);
  }, [displayed, isTyping, idx]);

  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
      marginTop: '1.2rem', minHeight: '1.6em', letterSpacing: '0.01em',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
      color: 'rgba(0,0,0,0.22)',
    }}>
      <span>"</span>
      <span style={{ color: 'rgba(0,0,0,0.48)' }}>{displayed}</span>
      <motion.span
        style={{ display: 'inline-block', width: 1.5, height: '0.85em',
                 background: 'var(--color-saffron)', verticalAlign: 'middle' }}
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.55, repeat: Infinity }}
      />
      <span>"</span>
    </div>
  );
}

/* ── Trusted-by strip ────────────────────────────────────────── */
const TRUST_ITEMS = [
  { label: 'NALSA', sub: 'Legal Aid' },
  { label: 'eCourts', sub: 'Case Portal' },
  { label: 'Sarvam AI', sub: 'Multilingual' },
  { label: '22+ Acts', sub: 'Indexed' },
  { label: 'Pinecone', sub: 'Vector Search' },
];

function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.8 }}
      style={{ marginTop: '2rem', display: 'flex', alignItems: 'center',
               justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
                     letterSpacing: '0.18em', textTransform: 'uppercase',
                     color: 'rgba(0,0,0,0.32)', marginRight: 18 }}>
        Powered by
      </span>
      {TRUST_ITEMS.map((t, i) => (
        <span key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '0 14px',
            borderRight: i < TRUST_ITEMS.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem',
                           fontWeight: 600, color: 'rgba(0,0,0,0.55)' }}>{t.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                           letterSpacing: '0.1em', textTransform: 'uppercase',
                           color: 'rgba(0,0,0,0.3)' }}>{t.sub}</span>
          </span>
        </span>
      ))}
    </motion.div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────── */
export default function LandingHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const arcsY       = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const arcsOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={heroRef} className="relative flex items-center justify-center overflow-hidden"
             style={{ backgroundColor: 'var(--color-hero)', minHeight: '100svh' }}>

      {/* Dot-grid background */}
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      {/* Soft vignette — warm fade at edges */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, rgba(242,237,228,0.65) 100%)',
      }} />

      {/* Central warm glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background:
          'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(230,92,0,0.07) 0%, rgba(212,175,55,0.04) 38%, transparent 65%)',
      }} />

      {/* Scrolling arcs */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ y: arcsY, opacity: arcsOpacity }}>
        <HeroArcs />
      </motion.div>

      {/* Premium SVG legal/tech icons */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ opacity: arcsOpacity }}>
        <LandingBgIcons />
      </motion.div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }}>
        <FloatingParticles />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center
                      px-6 pb-20 pt-28 md:px-12 md:pt-36">

        <motion.div variants={stagger(0)} initial="hidden" animate="visible"
                    className="flex flex-col items-center w-full">

          {/* Badge */}
          <motion.div variants={fadeUp}>
            <Link to="/tracker"
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5"
              style={{
                borderColor: 'rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(16px)',
                textDecoration: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
              <motion.span
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-gold)',
                         flexShrink: 0, boxShadow: '0 0 8px rgba(212,175,55,0.5)', display: 'inline-block' }}
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem',
                             letterSpacing: '0.15em', textTransform: 'uppercase',
                             color: 'rgba(0,0,0,0.55)' }}>
                New · eCourts Case Tracker
              </span>
              <span style={{ color: 'rgba(0,0,0,0.28)', fontSize: '0.65rem' }}>→</span>
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.h1
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.07,
                     letterSpacing: '-0.025em', color: 'var(--color-ink)',
                     fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}>
            {['Legal', 'clarity'].map((word, i) => (
              <motion.span key={word} style={{ display: 'inline-block', marginRight: '0.22em' }}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}>
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              style={{ display: 'inline-block', marginRight: '0.22em', color: 'rgba(10,10,10,0.55)' }}
              initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}>
              for every
            </motion.span>
            <motion.span className="text-shimmer" style={{ display: 'inline-block' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}>
              Indian.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp}
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                     lineHeight: 1.72, fontWeight: 300, color: 'rgba(10,10,10,0.52)',
                     maxWidth: 520, marginTop: '1.6rem', marginBottom: 0 }}>
            Ask any legal question by voice or text in 11+ Indian languages.
            Get statute-grounded answers — instantly, for free.
          </motion.p>

          {/* Typewriter */}
          <motion.div variants={fadeUp}>
            <TypewriterLine />
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp}
                      className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/chat"
              className="relative overflow-hidden rounded-full px-7 py-3 text-sm font-semibold text-white"
              style={{
                background: 'var(--color-saffron)',
                boxShadow: '0 0 0 1px rgba(230,92,0,0.3), 0 8px 28px rgba(230,92,0,0.22)',
                fontFamily: 'var(--font-sans)',
                textDecoration: 'none',
              }}>
              Ask a Legal Question →
            </Link>
            <Link to="/analyze"
              className="rounded-full border px-7 py-3 text-sm font-medium"
              style={{
                borderColor: 'rgba(0,0,0,0.12)',
                color: 'rgba(0,0,0,0.65)',
                fontFamily: 'var(--font-sans)',
                backdropFilter: 'blur(12px)',
                background: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
              Analyze a Contract
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div variants={fadeUp}>
            <TrustStrip />
          </motion.div>

        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.65 }}
          className="mt-16 w-full overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 18,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {[
              { n: 50000, s: '+', label: 'Queries Answered' },
              { n: 22,    s: '',  label: 'Acts Indexed'     },
              { n: 11,    s: '',  label: 'Languages'        },
              { n: 45,    s: '+', label: 'Legal Aid Centres'},
            ].map(({ n, s, label }, i) => (
              <div key={label} style={{
                textAlign: 'center', padding: '22px 12px',
                borderRight: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 700,
                  color: 'var(--color-gold)', lineHeight: 1,
                  filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.2))',
                }}>
                  <Counter to={n} suffix={s} />
                </div>
                <div style={{
                  marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: '0.57rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.35)',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
