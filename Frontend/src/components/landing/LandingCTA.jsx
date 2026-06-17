import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedBorderCard } from './landingShared.jsx';

const FOOTER_LINKS = {
  'Product': [
    { l: 'Chat',           to: '/chat'      },
    { l: 'Analyze',        to: '/analyze'   },
    { l: 'Documents',      to: '/documents' },
    { l: 'Case Tracker',   to: '/tracker'   },
    { l: 'Dashboard',      to: '/dashboard' },
  ],
  'Legal Rights': [
    { l: 'Know Your Rights', to: '/rights'   },
    { l: 'Tenant Rights',    to: '/chat'     },
    { l: 'Consumer Rights',  to: '/chat'     },
    { l: 'Labour Rights',    to: '/chat'     },
    { l: 'RTI Guide',        to: '/chat'     },
  ],
  'Legal Aid': [
    { l: 'Find a Lawyer',    to: '/lawyers'  },
    { l: 'DLSA Directory',   to: '/lawyers'  },
    { l: 'NGO Support',      to: '/lawyers'  },
    { l: 'NALSA: 15100',     to: '/lawyers'  },
  ],
};

export default function LandingCTA() {
  return (
    <>
      {/* ── Final CTA Section ─────────────────────────────────── */}
      <section className="px-6 py-24 md:px-12 relative overflow-hidden"
               style={{ background: 'var(--color-hero)' }}>

        {/* Glow */}
        <div className="pointer-events-none absolute inset-0" style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(230,92,0,0.08) 0%, rgba(212,175,55,0.04) 45%, transparent 70%)',
        }} />
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="mx-auto max-w-3xl relative z-10">
          <AnimatedBorderCard>
            <div className="rounded-3xl px-8 py-16 text-center"
                 style={{
                   background: 'rgba(255,255,255,0.55)',
                   backdropFilter: 'blur(16px)',
                   boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
                 }}>

              <motion.p
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6 }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                         letterSpacing: '0.24em', textTransform: 'uppercase',
                         color: 'var(--color-gold)', marginBottom: 18, opacity: 0.8 }}>
                Free · No Sign-up · Always Available
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.08 }}
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,5vw,3.5rem)',
                         fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.1,
                         marginBottom: '1.2rem' }}>
                Your rights.<br />
                <span style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>Yours to know.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.72,
                         color: 'rgba(0,0,0,0.5)', maxWidth: 440, margin: '0 auto 2.5rem' }}>
                Free legal guidance for every Indian, in every Indian language.
                No lawyer fees. No appointments.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.22 }}
                className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/chat"
                  className="rounded-full px-8 py-3.5 text-sm font-semibold text-white"
                  style={{ background: 'var(--color-saffron)',
                           boxShadow: '0 0 0 1px rgba(230,92,0,0.3), 0 8px 28px rgba(230,92,0,0.22)',
                           fontFamily: 'var(--font-sans)', textDecoration: 'none' }}>
                  Ask a Legal Question →
                </Link>
                <Link to="/analyze"
                  className="rounded-full border px-8 py-3.5 text-sm font-medium"
                  style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.65)',
                           fontFamily: 'var(--font-sans)', background: 'rgba(255,255,255,0.6)',
                           textDecoration: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  Analyze a Contract
                </Link>
              </motion.div>

              {/* Trust strip inside CTA */}
              <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
                style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center',
                         justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                {['No credit card','No account required','No ads','Always free'].map((t) => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%',
                                   background: 'var(--color-gold)', display: 'inline-block',
                                   boxShadow: '0 0 6px var(--color-gold)55' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                                   letterSpacing: '0.08em', color: 'rgba(0,0,0,0.42)' }}>
                      {t}
                    </span>
                  </span>
                ))}
              </motion.div>
            </div>
          </AnimatedBorderCard>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--color-ivory-dark)',
        borderTop: '1px solid rgba(0,0,0,0.07)',
      }}>
        {/* Main footer grid */}
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-12">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.8fr) repeat(3, minmax(0,1fr))',
            gap: '3rem',
          }}
          className="footer-grid">

            {/* Brand column */}
            <div>
              <Link to="/" className="flex items-center gap-2.5"
                    style={{ textDecoration: 'none', marginBottom: '1rem', display: 'inline-flex' }}>
                <svg width="16" height="20" viewBox="0 0 18 22" fill="none"
                     stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round">
                  <line x1="9" y1="1" x2="9" y2="21"/>
                  <line x1="2" y1="6" x2="16" y2="6"/>
                  <line x1="2" y1="6" x2="2" y2="13"/>
                  <line x1="16" y1="6" x2="16" y2="13"/>
                  <path d="M0,13 Q2,16 4,13"/>
                  <path d="M0,13 Q2,10 4,13"/>
                  <path d="M14,13 Q16,16 18,13"/>
                  <path d="M14,13 Q16,10 18,13"/>
                  <line x1="6" y1="21" x2="12" y2="21"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                               fontWeight: 600, color: 'var(--color-ink)' }}>
                  Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
                </span>
              </Link>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', lineHeight: 1.7,
                          color: 'rgba(0,0,0,0.45)', maxWidth: 240, marginBottom: '1.25rem' }}>
                Free statute-grounded legal guidance for every Indian, in every Indian language.
              </p>
              {/* NALSA callout */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(212,175,55,0.07)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: 10, padding: '8px 12px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.43 2 2 0 0 1 3.88 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem',
                                fontWeight: 700, color: 'var(--color-gold)' }}>NALSA · 15100</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.46rem',
                                letterSpacing: '0.08em', color: 'rgba(0,0,0,0.38)',
                                textTransform: 'uppercase' }}>Free · 24/7 · All India</div>
                </div>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                             letterSpacing: '0.2em', textTransform: 'uppercase',
                             color: 'rgba(0,0,0,0.38)', marginBottom: '1rem' }}>
                  {heading}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {links.map(({ l, to }) => (
                    <Link key={l} to={to} style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                      color: 'rgba(0,0,0,0.5)',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.target.style.color = 'rgba(0,0,0,0.85)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(0,0,0,0.5)'}>
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="mx-auto max-w-6xl px-6 py-5 md:px-12"
               style={{ display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                        color: 'rgba(0,0,0,0.32)', letterSpacing: '0.06em' }}>
              © {new Date().getFullYear()} LegalSahayak · General information only · Not a substitute for legal advice
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {[{ l: 'Privacy', to: '/' }, { l: 'Terms', to: '/' }, { l: 'Disclaimer', to: '/' }].map(({ l, to }) => (
                <Link key={l} to={to} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                  letterSpacing: '0.06em', color: 'rgba(0,0,0,0.38)',
                  textDecoration: 'none',
                }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
