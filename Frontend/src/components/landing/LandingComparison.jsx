import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, stagger, Label } from './landingShared.jsx';

const CMP_ROWS = [
  { feature: 'Cost',                  sahayak: 'Free',            lawyer: '₹2,000–₹50,000+',  gpt: 'Free / Subscription' },
  { feature: 'Indian Languages',      sahayak: '11+',             lawyer: 'Limited',           gpt: 'English primarily'   },
  { feature: 'Statute-grounded',      sahayak: true,              lawyer: true,                gpt: false                 },
  { feature: 'Available 24/7',        sahayak: true,              lawyer: false,               gpt: true                  },
  { feature: 'Response time',         sahayak: '< 5 seconds',     lawyer: 'Days to weeks',     gpt: '< 10 seconds'        },
  { feature: 'Document generation',   sahayak: true,              lawyer: 'Costly',            gpt: 'Generic only'        },
  { feature: 'Contract analysis',     sahayak: true,              lawyer: true,                gpt: false                 },
  { feature: 'Voice input',           sahayak: true,              lawyer: false,               gpt: false                 },
  { feature: 'Court case tracker',    sahayak: true,              lawyer: false,               gpt: false                 },
  { feature: 'Legal aid directory',   sahayak: true,              lawyer: false,               gpt: false                 },
  { feature: 'Matter dashboard',      sahayak: true,              lawyer: 'Expensive software', gpt: false                },
  { feature: 'Hallucination risk',    sahayak: 'None (RAG)',      lawyer: 'None',              gpt: 'High'                },
];

function CmpCell({ val, highlight }) {
  const isTrue  = val === true;
  const isFalse = val === false;
  return (
    <td style={{
      padding: '0.72rem 1.1rem',
      textAlign: 'center',
      fontSize: '0.8rem',
      fontFamily: 'var(--font-sans)',
      color: highlight
        ? (isTrue ? '#34D399' : 'var(--color-text-bright)')
        : (isFalse ? 'var(--color-text-faint)' : 'var(--color-text-soft)'),
      background: highlight ? 'rgba(230,92,0,0.05)' : 'transparent',
      borderLeft: highlight ? '1px solid rgba(230,92,0,0.12)' : 'none',
      borderRight: highlight ? '1px solid rgba(230,92,0,0.12)' : 'none',
    }}>
      {isTrue  && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 20, height: 20, borderRadius: '50%',
          background: highlight ? 'rgba(52,211,153,0.15)' : 'rgba(52,211,153,0.07)',
          color: '#34D399', fontSize: '0.7rem', fontWeight: 700,
        }}>✓</span>
      )}
      {isFalse && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 20, height: 20, borderRadius: '50%',
          background: 'var(--color-glass-bg)',
          color: 'var(--color-text-faint)', fontSize: '0.78rem',
        }}>✗</span>
      )}
      {!isTrue && !isFalse && val}
    </td>
  );
}

export default function LandingComparison() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative px-6 py-24 md:px-12 overflow-hidden"
             style={{ background: 'var(--color-ivory-deep)' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 45% 50% at 65% 50%, rgba(212,175,55,0.04) 0%, transparent 65%)',
      }} />

      <div className="mx-auto max-w-5xl relative">
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger(0)}>
          <motion.div variants={fadeUp}><Label>Why LegalSahayak</Label></motion.div>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.25rem)',
                     fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.12, marginBottom: '2.5rem' }}>
            Better than every alternative.<br />
            <span style={{ color: 'var(--color-saffron)', fontStyle: 'italic' }}>And it's free.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            overflowX: 'auto',
            borderRadius: 20,
            border: '1px solid var(--color-glass-border)',
            boxShadow: '0 4px 40px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(4px)',
          }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-glass-border)' }}>
                {/* Feature col header */}
                <th style={{
                  padding: '1rem 1.1rem', textAlign: 'left',
                  fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'var(--color-text-dim)',
                  background: 'var(--color-glass-bg-2)', width: '28%',
                }}>Feature</th>

                {/* LegalSahayak — highlighted */}
                <th style={{
                  padding: '1rem 1.1rem', textAlign: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600,
                  color: 'var(--color-saffron)',
                  background: 'rgba(230,92,0,0.05)',
                  borderLeft: '1px solid rgba(230,92,0,0.12)',
                  borderRight: '1px solid rgba(230,92,0,0.12)',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, var(--color-saffron), var(--color-gold))',
                    color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                    letterSpacing: '0.16em', padding: '3px 12px',
                    borderRadius: '0 0 10px 10px', textTransform: 'uppercase',
                    boxShadow: '0 4px 14px rgba(230,92,0,0.3)',
                  }}>Recommended</span>
                  LegalSahayak
                </th>

                {/* Others */}
                {[{ label: 'Hiring a Lawyer' }, { label: 'Generic ChatGPT' }].map(({ label }) => (
                  <th key={label} style={{
                    padding: '1rem 1.1rem', textAlign: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 500,
                    color: 'var(--color-text-dim)',
                    background: 'var(--color-glass-bg-2)',
                  }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CMP_ROWS.map(({ feature, sahayak, lawyer, gpt }, i) => (
                <motion.tr key={feature}
                  style={{ borderBottom: i < CMP_ROWS.length - 1 ? '1px solid var(--color-glass-border-2)' : 'none' }}
                  initial={{ opacity: 0, x: -14 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.055, duration: 0.45 }}
                >
                  <td style={{
                    padding: '0.72rem 1.1rem',
                    fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                    color: 'var(--color-text-mid)',
                    background: 'var(--color-glass-bg-2)',
                    fontWeight: 500,
                  }}>{feature}</td>
                  <CmpCell val={sahayak} highlight />
                  <CmpCell val={lawyer}  highlight={false} />
                  <CmpCell val={gpt}     highlight={false} />
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
