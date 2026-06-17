import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { fadeUp, stagger, Label } from './landingShared.jsx';

/* ── Mock UI: Case Tracker card ─────────────────────────────── */
function TrackerMock() {
  return (
    <div style={{ background: 'var(--color-ivory-deep)', borderRadius: 14, overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.07)', fontSize: '0' }}>
      {/* Input row */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.09)', borderRadius: 8,
                      padding: '7px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                      letterSpacing: '0.08em', color: 'rgba(212,168,80,0.7)' }}>
          MHPU010012342024
        </div>
        <div style={{ background: '#E07848', borderRadius: 7, padding: '7px 12px',
                      fontFamily: 'var(--font-sans)', fontSize: '0.65rem',
                      fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
          Track Case
        </div>
      </div>

      {/* Case card */}
      <div style={{ padding: '14px' }}>
        <div style={{ background: 'rgba(0,0,0,0.03)',
                      border: '1px solid rgba(0,0,0,0.07)', borderRadius: 10, padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em',
                            color: '#D4A850', marginBottom: 3 }}>MHPU010012342024</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600,
                            color: 'var(--color-ink)' }}>Sharma vs State of Maharashtra</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                            color: 'rgba(0,0,0,0.4)', marginTop: 2 }}>Bombay HC · Civil Revision</div>
            </div>
            <div style={{ background: 'rgba(251,191,36,0.12)', borderRadius: 999,
                          padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                          letterSpacing: '0.08em', color: '#FCD34D', textTransform: 'uppercase' }}>
              Pending
            </div>
          </div>
          {/* Hearing timeline */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 10,
                        display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { date: '14 Aug 2024', label: 'Arguments', past: true },
              { date: '22 Oct 2024', label: 'Next Hearing', past: false },
            ].map(({ date, label, past }) => (
              <div key={date} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                              background: past ? 'rgba(212,168,80,0.3)' : '#D4A850',
                              boxShadow: past ? 'none' : '0 0 6px rgba(212,168,80,0.5)' }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                              color: past ? 'rgba(0,0,0,0.38)' : '#D4A850' }}>{date}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem',
                              color: past ? 'rgba(0,0,0,0.45)' : 'var(--color-ink)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mock UI: Dashboard ─────────────────────────────────────── */
function DashboardMock() {
  const matters = [
    { icon: '🏠', title: 'Landlord Deposit Dispute', tag: 'Tenant', color: '#5B8DEF', status: 'Open', sessions: 3, docs: 2 },
    { icon: '🛒', title: 'Consumer Complaint — Sony', tag: 'Consumer', color: '#10B981', status: 'Open', sessions: 1, docs: 1 },
    { icon: '⚖️', title: 'Workplace Harassment Case', tag: 'Workplace', color: '#E07848', status: 'Resolved', sessions: 5, docs: 3 },
  ];
  return (
    <div style={{ background: 'var(--color-ivory-deep)', borderRadius: 14, overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.07)' }}>
      {/* Mini header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em',
                       textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' }}>Your Legal Matters</span>
        <div style={{ background: '#E07848', borderRadius: 6, padding: '4px 10px',
                      fontFamily: 'var(--font-sans)', fontSize: '0.58rem', fontWeight: 600, color: '#fff' }}>
          + New Matter
        </div>
      </div>
      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0,
                    borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        {[['3','Total'],['2','Open'],['6','Docs']].map(([n,l],i) => (
          <div key={l} style={{ padding: '8px 10px', textAlign: 'center',
                                borderRight: i < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                          fontWeight: 700, color: '#D4A850' }}>{n}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                          letterSpacing: '0.1em', color: 'rgba(0,0,0,0.38)',
                          textTransform: 'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Matter cards */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {matters.map(m => (
          <div key={m.title} style={{ background: 'rgba(0,0,0,0.03)',
                                       border: '1px solid rgba(0,0,0,0.06)',
                                       borderRadius: 8, padding: '9px 11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.8rem' }}>{m.icon}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em',
                               padding: '1px 6px', borderRadius: 999,
                               background: `${m.color}18`, color: m.color, textTransform: 'uppercase' }}>
                  {m.tag}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                             color: m.status === 'Open' ? '#34D399' : '#60A5FA', letterSpacing: '0.06em' }}>
                {m.status}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem',
                          fontWeight: 600, color: 'var(--color-ink)', marginBottom: 3 }}>{m.title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                          color: 'rgba(0,0,0,0.3)' }}>
              {m.sessions} chats · {m.docs} docs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Mock UI: Lawyer Directory ──────────────────────────────── */
function LawyerMock() {
  return (
    <div style={{ background: 'var(--color-ivory-deep)', borderRadius: 14, overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.07)' }}>
      {/* Filters */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex', gap: 6 }}>
        {['Maharashtra', 'Mumbai', 'All Types'].map(f => (
          <div key={f} style={{ background: 'rgba(0,0,0,0.04)',
                                border: '1px solid rgba(0,0,0,0.07)', borderRadius: 6,
                                padding: '4px 9px', fontFamily: 'var(--font-sans)', fontSize: '0.58rem',
                                color: 'rgba(0,0,0,0.48)' }}>{f}</div>
        ))}
        <div style={{ marginLeft: 'auto', background: '#E07848', borderRadius: 6, padding: '4px 10px',
                      fontFamily: 'var(--font-sans)', fontSize: '0.58rem', fontWeight: 600, color: '#fff' }}>
          Search
        </div>
      </div>

      {/* NALSA helpline */}
      <div style={{ margin: '10px', background: 'rgba(52,211,153,0.07)',
                    border: '1px solid rgba(52,211,153,0.2)', borderRadius: 9, padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1rem' }}>📞</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem',
                          fontWeight: 700, color: '#34D399' }}>15100 — NALSA Helpline</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                          color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>Free legal aid · 24/7 · All India</div>
          </div>
        </div>
      </div>

      {/* Result cards */}
      <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { name: 'DLSA Mumbai City', type: 'DLSA · FREE', phone: '022-22622960', services: ['Free Legal Aid','Lok Adalat','Mediation'], color: '#34D399' },
          { name: 'Majlis Legal Centre', type: 'NGO', phone: '022-26605027', services: ["Women's Rights",'DV Act','Family'], color: '#60A5FA' },
        ].map(e => (
          <div key={e.name} style={{ background: 'rgba(0,0,0,0.03)',
                                      border: '1px solid rgba(0,0,0,0.06)',
                                      borderRadius: 8, padding: '10px 11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.74rem',
                              fontWeight: 600, color: 'var(--color-ink)', marginBottom: 2 }}>{e.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em',
                              padding: '1px 7px', borderRadius: 999, display: 'inline-block',
                              background: `${e.color}15`, color: e.color, textTransform: 'uppercase' }}>
                  {e.type}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                            color: '#34D399', letterSpacing: '0.04em' }}>{e.phone}</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {e.services.map(s => (
                <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.47rem',
                                       letterSpacing: '0.06em', padding: '1px 6px', borderRadius: 999,
                                       background: 'rgba(0,0,0,0.05)',
                                       color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase' }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Feature card ────────────────────────────────────────────── */
const FEATURES = [
  {
    badge:    'New · eCourts',
    accent:   '#D4A850',
    accentBg: 'rgba(212,168,80,0.08)',
    title:    'Court Case Tracker',
    desc:     'Enter any CNR number and track your case in real time. Hearing history, next dates, court name, and status — synced directly from the eCourts portal.',
    cta:      'Track a Case',
    to:       '/tracker',
    mock:     <TrackerMock />,
  },
  {
    badge:    'New · Accounts',
    accent:   '#E07848',
    accentBg: 'rgba(224,120,72,0.08)',
    title:    'Legal Matter Dashboard',
    desc:     'Create an account and organise everything in one place. Group related chats, cases, and documents under a legal matter. Auto-saved notes, download history, and status tracking.',
    cta:      'Create Free Account',
    to:       '/register',
    mock:     <DashboardMock />,
  },
  {
    badge:    'New · Directory',
    accent:   '#34D399',
    accentBg: 'rgba(52,211,153,0.08)',
    title:    'Lawyer & Legal Aid Directory',
    desc:     'Find free District Legal Services Authorities (DLSA) and legal aid NGOs near you. Filter by state, district, and specialization. Free aid for SC/ST, women, disabled, and low-income citizens.',
    cta:      'Find Legal Help',
    to:       '/lawyers',
    mock:     <LawyerMock />,
  },
];

export default function LandingNewFeatures() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="new" ref={ref} className="relative px-6 py-24 md:px-12 overflow-hidden"
             style={{ background: 'var(--color-ivory-deep)' }}>
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 50% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 65%)',
      }} />

      <div className="mx-auto max-w-6xl relative">
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger(0)}>
          <motion.div variants={fadeUp}>
            <Label>What's New</Label>
          </motion.div>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.25rem)',
                     fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.12,
                     marginBottom: '1rem' }}>
            Three new tools.<br />
            <span style={{ color: 'var(--color-saffron)', fontStyle: 'italic' }}>All still free.</span>
          </motion.h2>
          <motion.p variants={fadeUp}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.7,
                     color: 'var(--color-ink-muted)', maxWidth: 540, marginBottom: '3.5rem' }}>
            LegalSahayak now lets you track court cases live, manage your legal matters in a personal dashboard,
            and find free legal aid anywhere in India.
          </motion.p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          {FEATURES.map((f, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem',
                         alignItems: 'center' }}
                className="flex-col md:grid">

                {/* Text side */}
                <div style={{ order: isEven ? 0 : 1 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: f.accentBg,
                                border: `1px solid ${f.accent}30`,
                                borderRadius: 999, padding: '4px 12px', marginBottom: 18 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%',
                                  background: f.accent, boxShadow: `0 0 6px ${f.accent}` }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                                   letterSpacing: '0.14em', textTransform: 'uppercase',
                                   color: f.accent }}>{f.badge}</span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.25rem)',
                               fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.15,
                               marginBottom: '1rem' }}>{f.title}</h3>

                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', lineHeight: 1.75,
                              color: 'var(--color-ink-muted)', marginBottom: '1.75rem' }}>{f.desc}</p>

                  <Link to={f.to}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                             background: f.accent, borderRadius: 999, padding: '11px 24px',
                             fontFamily: 'var(--font-sans)', fontSize: '0.88rem',
                             fontWeight: 600, color: '#fff', textDecoration: 'none',
                             boxShadow: `0 6px 24px ${f.accent}35` }}>
                    {f.cta} →
                  </Link>
                </div>

                {/* Mock UI side */}
                <motion.div style={{ order: isEven ? 1 : 0 }}
                  whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <div style={{ borderRadius: 20, overflow: 'hidden',
                                boxShadow: `0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px ${f.accent}18`,
                                border: `1px solid ${f.accent}20` }}>
                    {f.mock}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Responsive override: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .flex-col.md\\:grid { display: flex !important; flex-direction: column !important; gap: 2rem !important; }
          .flex-col.md\\:grid > * { order: unset !important; }
        }
      `}</style>
    </section>
  );
}
