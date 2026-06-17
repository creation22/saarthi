import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BentoGrid, BentoGridItem,
  WaveformHeader, VectorHeader, ReasoningHeader,
  DocumentHeader, SpeedHeader, AIModelsHeader,
} from '../BentoGrid.jsx';
import { fadeUp, stagger, Label } from './landingShared.jsx';

/* ── Shared row animation variant ───────────────────────────────── */
const rowIn = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Inline header: Case Tracker ─────────────────────────────── */
function CaseTrackerHeader() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const cases  = [
    { cnr: 'DLPH012345672024', title: 'Gupta vs Union of India',  status: 'Pending',  color: '#C47A30' },
    { cnr: 'MHPU010012342024', title: 'Sharma vs State of MH',    status: 'Disposed', color: 'var(--color-gold)' },
    { cnr: 'TNCH009876542025', title: 'Iyer vs Municipal Corp.',   status: 'Pending',  color: '#C47A30' },
  ];

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', background: 'var(--color-ivory-deep)',
                             borderRadius: 12, display: 'flex', flexDirection: 'column',
                             overflow: 'hidden', padding: 14 }}>
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}
      >
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.05)', borderRadius: 6,
                      padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                      letterSpacing: '0.06em', color: 'rgba(212,168,80,0.6)' }}>
          MHPU010012342024
        </div>
        <div style={{ background: '#E07848', borderRadius: 6, padding: '6px 10px',
                      fontSize: '0.58rem', color: '#fff', fontWeight: 600 }}>Track</div>
      </motion.div>

      {/* Case rows */}
      {cases.map((c, i) => (
        <motion.div key={c.cnr}
          custom={i}
          variants={rowIn}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.07)',
                   borderRadius: 8, padding: '8px 10px', marginBottom: 6 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                            color: '#D4A850', marginBottom: 2 }}>{c.cnr}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.68rem',
                            fontWeight: 600, color: 'var(--color-ink)' }}>{c.title}</div>
            </div>
            <motion.div
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.08em',
                       padding: '2px 7px', borderRadius: 999,
                       background: `${c.color}20`, color: c.color }}
            >
              {c.status}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Inline header: Dashboard ────────────────────────────────── */
function DashboardHeader() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const stats  = [['3','Matters','#D4A850'],['2','Cases','var(--color-gold)'],['5','Docs','var(--color-saffron)']];
  const matters = [
    { icon: null, title: 'Landlord Dispute',    tag: 'TENANT',   color: 'var(--color-gold)' },
    { icon: null, title: 'Consumer Complaint',  tag: 'CONSUMER', color: 'var(--color-saffron)' },
    { icon: null, title: 'RTI Application',      tag: 'RTI',      color: 'var(--color-gold)' },
  ];

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', background: 'var(--color-ivory-deep)', borderRadius: 12,
                             padding: 12, display: 'flex', flexDirection: 'column', gap: 6,
                             overflow: 'hidden' }}>
      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.05 }}
        style={{ display: 'flex', gap: 6 }}
      >
        {stats.map(([n, l, c]) => (
          <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7,
                                padding: '7px 8px', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + stats.indexOf([n,l,c]) * 0.08, type: 'spring', stiffness: 400 }}
              style={{ fontFamily: 'var(--font-display)', fontSize: '1rem',
                       fontWeight: 700, color: c }}
            >{n}</motion.div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem',
                          color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase',
                          letterSpacing: '0.08em' }}>{l}</div>
          </div>
        ))}
      </motion.div>

      {/* Matter cards */}
      {matters.map((m, i) => (
        <motion.div key={m.title}
          custom={i}
          variants={rowIn}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)',
                   borderRadius: 7, padding: '7px 9px',
                   display: 'flex', alignItems: 'center', gap: 7 }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                          fontWeight: 600, color: 'var(--color-ink)', marginBottom: 2 }}>{m.title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.08em',
                          padding: '1px 5px', borderRadius: 999, display: 'inline-block',
                          background: `${m.color}18`, color: m.color }}>{m.tag}</div>
          </div>
          <motion.div
            animate={inView ? { opacity: [0, 1, 0.6, 1], scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-gold)',
                     boxShadow: '0 0 5px rgba(212,175,55,0.6)' }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ── Inline header: Lawyer Directory ─────────────────────────── */
function LawyerDirectoryHeader() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const entries = [
    { name: 'DLSA Mumbai City',      type: 'FREE', color: 'var(--color-gold)' },
    { name: 'Majlis Legal Centre',   type: 'NGO',  color: 'var(--color-text-soft)' },
    { name: 'HRLN Delhi',            type: 'NGO',  color: 'var(--color-text-soft)' },
  ];

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', background: 'var(--color-ivory-deep)', borderRadius: 12,
                             padding: 12, overflow: 'hidden' }}>
      {/* NALSA callout */}
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: 8, padding: '8px 10px', marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 7 }}
      >
        <span style={{ fontSize: '0.9rem' }}>📞</span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem',
                        fontWeight: 700, color: 'var(--color-gold)' }}>15100 — NALSA</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem',
                        color: 'rgba(0,0,0,0.45)' }}>Free · 24/7 · All India</div>
        </div>
      </motion.div>

      {/* Directory rows */}
      {entries.map((e, i) => (
        <motion.div key={e.name}
          custom={i}
          variants={rowIn}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)',
                   borderRadius: 7, padding: '7px 9px', marginBottom: 5,
                   display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                        fontWeight: 600, color: 'var(--color-ink)' }}>{e.name}</div>
          <motion.div
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.09 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.08em',
                     padding: '1px 6px', borderRadius: 999,
                     background: `${e.color}15`, color: e.color }}
          >{e.type}</motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Icon helpers ─────────────────────────────────────────────── */
const ICONS = {
  mic:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M4 11a8 8 0 0 0 16 0"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="9" y1="23" x2="15" y2="23"/></svg>,
  book: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  eye:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  bolt: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  cpu:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/></svg>,
  grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  team: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  clk:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

/* ── Grid items definition ────────────────────────────────────── */
// Layout: 3-col grid, 4 rows (no gaps)
// Row 1: Voice(2) + RAG(1)
// Row 2: Reasoning(1) + Docs(2)
// Row 3: CaseTracker(2) + Speed(1)
// Row 4: MultiModel(1) + Dashboard(1) + Lawyers(1)
const ITEMS = [
  {
    span: 'md:col-span-2',
    title: 'Voice & Text Legal Queries',
    description: 'Ask in Hindi, Tamil, Bengali, or 8 more languages. Type or speak — Sarvam AI handles both with automatic language detection.',
    header: <WaveformHeader />,
    icon: ICONS.mic,
  },
  {
    span: '',
    title: 'RAG-Grounded Citations',
    description: 'Every answer cites the exact Act and Section from 22+ Indian statutes via Pinecone semantic search — no hallucinations.',
    header: <VectorHeader />,
    icon: ICONS.book,
  },
  {
    span: '',
    title: 'Chain-of-Thought Reasoning',
    description: 'See how the AI connects your question to the law — step-by-step reasoning trace surfaced with every response.',
    header: <ReasoningHeader />,
    icon: ICONS.eye,
  },
  {
    span: 'md:col-span-2',
    title: 'Legal Document Generator',
    description: 'Draft FIRs, consumer complaints, legal notices, RTI applications, and demand letters. Download as PDF or Word.',
    header: <DocumentHeader />,
    icon: ICONS.file,
  },
  {
    span: 'md:col-span-2',
    title: 'eCourts Case Tracker',
    description: 'Track court cases in real time using the CNR number. Hearing history, next dates, and status synced from the eCourts portal automatically.',
    header: <CaseTrackerHeader />,
    icon: ICONS.clk,
  },
  {
    span: '',
    title: 'Lightning Fast',
    description: 'Statute retrieval + AI reasoning in under 5 seconds. Available 24/7 on any device — no appointments, no queues.',
    header: <SpeedHeader />,
    icon: ICONS.bolt,
  },
  {
    span: '',
    title: 'Multi-Model AI',
    description: 'Powered by Claude Opus 4.6 for reasoning, Sarvam Saarika for voice transcription, and Bulbul for multilingual TTS.',
    header: <AIModelsHeader />,
    icon: ICONS.cpu,
  },
  {
    span: '',
    title: 'Legal Matter Dashboard',
    description: 'Organise queries, case files, and documents under a single matter. Notes auto-save. Download history tracked.',
    header: <DashboardHeader />,
    icon: ICONS.grid,
  },
  {
    span: '',
    title: 'Lawyer & Legal Aid Directory',
    description: 'Find free DLSAs and legal aid NGOs near you filtered by state, district, and specialization. NALSA helpline 15100 always available.',
    header: <LawyerDirectoryHeader />,
    icon: ICONS.team,
  },
];

export default function LandingFeatures() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" ref={ref} className="relative px-6 py-24 md:px-12 overflow-hidden"
             style={{ background: 'var(--color-ivory)' }}>
      <div className="pointer-events-none absolute inset-0" style={{
        background:
          'radial-gradient(ellipse 60% 50% at 15% 70%, rgba(230,92,0,0.04) 0%, transparent 70%),' +
          'radial-gradient(ellipse 50% 60% at 85% 20%, rgba(212,175,55,0.03) 0%, transparent 70%)',
      }} />

      <div className="mx-auto max-w-6xl relative">
        {/* Heading */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger(0)}
          style={{ marginBottom: '3rem' }}
        >
          <motion.div variants={fadeUp}><Label>Capabilities</Label></motion.div>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.25rem)',
                     fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.12, maxWidth: 620 }}>
            Everything you need to understand<br />and manage the law.
          </motion.h2>
        </motion.div>

        {/* Grid — stagger children (the BentoGridItems) */}
        <BentoGrid
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger(0.07)}
        >
          {ITEMS.map((item) => (
            <BentoGridItem
              key={item.title}
              className={item.span}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              variants={fadeUp}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
