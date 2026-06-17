import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, stagger, Label } from './landingShared.jsx';

const LANGUAGES = [
  { name: 'Hindi',     script: 'हिन्दी',  speakers: '600M+' },
  { name: 'Tamil',     script: 'தமிழ்',   speakers: '80M+'  },
  { name: 'Telugu',    script: 'తెలుగు',  speakers: '95M+'  },
  { name: 'Bengali',   script: 'বাংলা',   speakers: '230M+' },
  { name: 'Marathi',   script: 'मराठी',   speakers: '85M+'  },
  { name: 'Kannada',   script: 'ಕನ್ನಡ',   speakers: '60M+'  },
  { name: 'Malayalam', script: 'മലയാളം',  speakers: '38M+'  },
  { name: 'Gujarati',  script: 'ગુજરાતી', speakers: '55M+'  },
  { name: 'Punjabi',   script: 'ਪੰਜਾਬੀ', speakers: '50M+'  },
  { name: 'Odia',      script: 'ଓଡ଼ିଆ',   speakers: '38M+'  },
  { name: 'English',   script: 'Eng',     speakers: '125M+' },
  { name: 'Hinglish',  script: 'Hi/En',   speakers: '350M+' },
];

export default function LandingLanguages() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="languages" ref={ref} className="relative px-6 py-24 md:px-12 overflow-hidden"
             style={{ background: 'var(--color-ivory)' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 70% at 50% 30%, rgba(212,175,55,0.05) 0%, transparent 65%)',
      }} />

      <div className="mx-auto max-w-5xl relative">
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger(0)}>
          <motion.div variants={fadeUp}><Label>भाषा · Language</Label></motion.div>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.25rem)',
                     fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.12,
                     marginBottom: '0.75rem' }}>
            Your mother tongue.<br />Your legal rights.
          </motion.h2>
          <motion.p variants={fadeUp}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', lineHeight: 1.7,
                     color: 'var(--color-ink-muted)', maxWidth: 480, marginBottom: '3rem' }}>
            Powered by Sarvam AI — the only Indian LLM suite built natively for Indic languages and scripts.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'}
          variants={stagger(0.045)}
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6"
        >
          {LANGUAGES.map(({ name, script, speakers }) => (
            <motion.div key={name} variants={fadeUp}
              className="relative flex flex-col items-center gap-1.5 rounded-2xl border py-5 text-center
                         cursor-default overflow-hidden"
              style={{
                borderColor: 'var(--color-glass-border)',
                background: 'var(--color-glass-bg)',
              }}
              whileHover={{
                borderColor: 'rgba(230,92,0,0.35)',
                y: -5,
                background: 'rgba(255,255,255,0.04)',
                boxShadow: '0 12px 36px rgba(0,0,0,0.35), 0 0 0 1px rgba(230,92,0,0.2)',
                transition: { type: 'spring', stiffness: 400, damping: 22 },
              }}
            >
              {/* Hover glow overlay */}
              <motion.div className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{ background: 'radial-gradient(circle at 50% 60%, rgba(230,92,0,0.08), transparent 70%)' }}
                initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />

              {/* Script */}
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem',
                             color: 'var(--color-text-bright)', lineHeight: 1 }}>
                {script}
              </span>

              {/* Name */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                             letterSpacing: '0.12em', textTransform: 'uppercase',
                             color: 'var(--color-text-dim)' }}>
                {name}
              </span>

              {/* Speakers */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                             letterSpacing: '0.06em', color: 'rgba(212,168,80,0.45)' }}>
                {speakers}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Voice CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            marginTop: '2.5rem',
            padding: '18px 24px',
            borderRadius: 16,
            background: 'rgba(230,92,0,0.06)',
            border: '1px solid rgba(230,92,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'rgba(230,92,0,0.12)',
              border: '1px solid rgba(230,92,0,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="var(--color-saffron)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
                <path d="M4 11a8 8 0 0 0 16 0"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="9" y1="23" x2="15" y2="23"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem',
                            fontWeight: 600, color: 'var(--color-text-bright)' }}>
                Speak in your language
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                            letterSpacing: '0.08em', color: 'var(--color-text-dim)',
                            marginTop: 2 }}>
                Tap the mic · Sarvam Saarika STT detects language automatically
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--color-saffron)', opacity: 0.7,
          }}>
            Try it →
          </div>
        </motion.div>
      </div>
    </section>
  );
}
