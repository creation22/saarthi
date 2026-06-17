import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, stagger, Label, ICONS } from './landingShared.jsx';

const STEPS = [
  {
    num:    '01',
    iconKey: 'mic',
    label:  'Ask by Voice or Text',
    sub:    'Speak or type in Hindi, Tamil, Bengali, English, or 7 more Indian languages. Sarvam Saarika transcribes speech in real time.',
    accent: '#E07848',
    tag:    'Sarvam Saarika STT',
  },
  {
    num:    '02',
    iconKey: 'eye',
    label:  'Statutes Retrieved Instantly',
    sub:    'Pinecone semantic search scans 22+ Indian Acts to surface the exact Sections and Clauses most relevant to your query.',
    accent: '#D4AF37',
    tag:    'Pinecone Vector DB',
  },
  {
    num:    '03',
    iconKey: 'bolt',
    label:  'AI Reasons Through the Law',
    sub:    'Claude Opus 4.6 builds a transparent chain-of-thought, connecting your situation to cited statutes before forming a response.',
    accent: '#C47A30',
    tag:    'Claude Opus 4.6',
  },
  {
    num:    '04',
    iconKey: 'file',
    label:  'Plain-Language Guidance',
    sub:    'A cited, plain-English answer with recommended next steps — and one click to generate a ready-to-file legal document.',
    accent: '#8B6914',
    tag:    'PDF / DOCX export',
  },
];

const LINE_GRADIENT = 'linear-gradient(to bottom, #E07848 0%, #D4AF37 40%, #C47A30 70%, #8B6914 100%)';

export default function LandingHowItWorks() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how" ref={ref} className="relative px-6 py-24 md:px-12 overflow-hidden"
             style={{ background: 'var(--color-hero)' }}>

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" style={{
        background:
          'radial-gradient(ellipse 50% 60% at 10% 30%, rgba(224,120,72,0.07) 0%, transparent 60%),' +
          'radial-gradient(ellipse 40% 50% at 90% 70%, rgba(91,141,239,0.06) 0%, transparent 60%)',
      }} />

      <div className="mx-auto max-w-3xl relative">

        {/* Heading */}
        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'}
          variants={stagger(0)} style={{ marginBottom: '3.5rem' }}
        >
          <motion.div variants={fadeUp}><Label>How It Works</Label></motion.div>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3rem)',
                     fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.12,
                     maxWidth: 480, marginBottom: 12 }}>
            Four steps to legal clarity.
          </motion.h2>
          <motion.p variants={fadeUp}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', lineHeight: 1.7,
                     color: 'rgba(0,0,0,0.48)', maxWidth: 420 }}>
            From your question to a statute-backed answer — in under 5 seconds.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>

          {/* Vertical track */}
          <div style={{
            position: 'absolute', left: 13, top: 14, bottom: 14, width: 2,
            background: 'rgba(0,0,0,0.08)', borderRadius: 999,
          }}>
            <motion.div
              style={{ width: '100%', borderRadius: 999, background: LINE_GRADIENT, transformOrigin: 'top' }}
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Steps */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger(0.14)}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num} variants={fadeUp}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 16 }}
              >
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.35, type: 'spring', stiffness: 420 }}
                  style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: '50%', zIndex: 2,
                    background: `${step.accent}15`, border: `2px solid ${step.accent}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 700,
                    color: step.accent, boxShadow: `0 0 14px ${step.accent}30`,
                  }}
                >
                  {i + 1}
                </motion.div>

                {/* Card */}
                <motion.div
                  whileHover={{
                    x: 6,
                    background: 'rgba(255,255,255,0.75)',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px ${step.accent}18`,
                  }}
                  transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(0,0,0,0.07)',
                    borderLeft: `3px solid ${step.accent}55`,
                    borderRadius: 18, padding: '20px 22px', cursor: 'default',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    {/* Icon box */}
                    <div style={{
                      flexShrink: 0, width: 46, height: 46, borderRadius: 13,
                      background: `${step.accent}10`, border: `1.5px solid ${step.accent}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                           stroke={step.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        {(ICONS[step.iconKey] || []).map((d, j) => <path key={j} d={d} />)}
                      </svg>
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 8, marginBottom: 7,
                      }}>
                        <h3 style={{
                          fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700,
                          color: 'var(--color-ink)', lineHeight: 1.25, margin: 0,
                        }}>
                          {step.label}
                        </h3>
                        <span style={{
                          padding: '3px 11px', borderRadius: 999, flexShrink: 0,
                          background: `${step.accent}10`, border: `1px solid ${step.accent}20`,
                          fontFamily: 'var(--font-mono)', fontSize: '0.57rem',
                          letterSpacing: '0.14em', textTransform: 'uppercase', color: step.accent,
                        }}>
                          {step.tag}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '0.82rem', lineHeight: 1.7,
                        color: 'rgba(0,0,0,0.48)', margin: 0,
                      }}>
                        {step.sub}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom metric */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{ marginTop: 12, paddingLeft: 52, display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--color-gold)',
            boxShadow: '0 0 8px rgba(212,175,55,0.6)',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.67rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.32)',
          }}>
            Average response time · under 5 seconds
          </span>
        </motion.div>

      </div>
    </section>
  );
}
