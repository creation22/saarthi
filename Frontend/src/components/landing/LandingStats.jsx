import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, stagger } from './landingShared.jsx';

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

/* Premium SVG stat icons */
function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-saffron)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function BookStackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}
function LanguagesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
    </svg>
  );
}
function ScalesSmallIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-saffron)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/><line x1="9" y1="21" x2="15" y2="21"/>
      <line x1="3" y1="7" x2="21" y2="7"/>
      <path d="M3 7l2 5c0 1.1 1.8 2 4 2s4-.9 4-2l2-5"/>
      <path d="M13 7l2 5c0 1.1 1.8 2 4 2s4-.9 4-2l2-5"/>
    </svg>
  );
}

const STATS = [
  { n: 50000, s: '+', label: 'Legal Queries Answered',  Icon: ChatIcon      },
  { n: 22,    s: '',  label: 'Indian Acts & Statutes',   Icon: BookStackIcon },
  { n: 11,    s: '',  label: 'Indian Languages',         Icon: LanguagesIcon },
  { n: 45,    s: '+', label: 'Legal Aid Centres Listed', Icon: ScalesSmallIcon },
];

function StatCard({ n, s, label, Icon }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref} variants={fadeUp}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '28px 16px',
        background: 'rgba(255,255,255,0.55)',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: 20,
        position: 'relative', overflow: 'hidden',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
      whileHover={{
        borderColor: 'rgba(212,175,55,0.28)',
        background: 'rgba(255,255,255,0.8)',
        y: -3,
        boxShadow: '0 8px 28px rgba(0,0,0,0.08)',
      }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.07), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ marginBottom: 10 }}><Icon /></div>

      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '3.2rem', fontWeight: 700,
        color: 'var(--color-saffron)', lineHeight: 1,
        filter: 'drop-shadow(0 0 12px rgba(230,92,0,0.15))',
      }}>
        <Counter to={n} suffix={s} />
      </div>

      <p style={{
        marginTop: 8, fontSize: '0.78rem', lineHeight: 1.4,
        color: 'rgba(0,0,0,0.48)',
        fontFamily: 'var(--font-sans)', textAlign: 'center',
      }}>{label}</p>
    </motion.div>
  );
}

export default function LandingStats() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="relative px-6 py-24 md:px-12 overflow-hidden"
             style={{ background: 'var(--color-hero)' }}>

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(230,92,0,0.05) 0%, transparent 65%)',
      }} />

      <div className="mx-auto max-w-4xl relative">
        {/* Heading */}
        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'}
          variants={stagger(0)} className="text-center mb-12"
        >
          <motion.p variants={fadeUp}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.24em',
                     textTransform: 'uppercase', color: 'var(--color-gold)',
                     opacity: 0.75, marginBottom: 14 }}>
            By the numbers
          </motion.p>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                     fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.15 }}>
            Trusted by Indians across the country.
          </motion.h2>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'}
          variants={stagger(0.1)}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {STATS.map(stat => <StatCard key={stat.label} {...stat} />)}
        </motion.div>
      </div>
    </section>
  );
}
