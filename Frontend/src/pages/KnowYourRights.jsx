import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TOPICS = [
  {
    id: 'tenant', icon: '🏠', title: 'Tenant Rights',
    act: 'Rent Control Acts', accent: '#D4641E',
    questions: [
      'My landlord increased rent without notice. What are my rights?',
      'My landlord is refusing to return my security deposit. What can I do?',
      'Can my landlord evict me without a court order?',
      'What notice period must a landlord give before eviction?',
    ],
  },
  {
    id: 'consumer', icon: '🛒', title: 'Consumer Rights',
    act: 'Consumer Protection Act, 2019', accent: '#C5943A',
    questions: [
      'I received a defective product and the seller refuses a refund.',
      'A service provider is not completing work I already paid for.',
      'How do I file a consumer complaint against an e-commerce company?',
      'What compensation can I claim for deficiency in banking service?',
    ],
  },
  {
    id: 'workplace', icon: '💼', title: 'Workplace Rights',
    act: 'Industrial Disputes Act / Labour Code', accent: '#2C3E52',
    questions: [
      'My employer has not paid my salary for two months. What can I do?',
      'I was terminated without notice or reason. Is this legal?',
      'My employer is forcing overtime without pay. What are my rights?',
      'What is the process for filing a complaint against workplace harassment?',
    ],
  },
  {
    id: 'women', icon: '⚖️', title: "Women's Rights",
    act: 'POSH Act / DV Act, 2005', accent: '#8B4513',
    questions: [
      'I am facing domestic violence. What legal protection is available?',
      'How do I file a complaint under the POSH Act for workplace harassment?',
      'What is a protection order and how do I obtain one?',
      'Can I claim maintenance from my husband after separation?',
    ],
  },
  {
    id: 'rti', icon: '📋', title: 'Right to Information',
    act: 'RTI Act, 2005', accent: '#4A7C59',
    questions: [
      'How do I file an RTI application to a government department?',
      'What information can I request under the RTI Act?',
      'The office has not responded to my RTI in 30 days. What next?',
      'Can I file a second appeal if my RTI first appeal is rejected?',
    ],
  },
  {
    id: 'criminal', icon: '🚨', title: 'Criminal Law Basics',
    act: 'IPC / BNS / CrPC', accent: '#7B2D2D',
    questions: [
      'The police are refusing to register my FIR. What can I do?',
      'What are my rights if I am arrested?',
      'How do I apply for anticipatory bail?',
      'Someone is threatening me online. What legal action can I take?',
    ],
  },
  {
    id: 'property', icon: '🏗️', title: 'Property Rights',
    act: 'Transfer of Property Act / RERA', accent: '#5C4033',
    questions: [
      'My builder has delayed possession by 2 years. Can I claim compensation?',
      'A family member is claiming a share in my inherited property.',
      'How do I register a property sale deed?',
      'What is RERA and how does it protect homebuyers?',
    ],
  },
  {
    id: 'cyber', icon: '💻', title: 'Cyber & Digital Rights',
    act: 'IT Act, 2000', accent: '#2C3E52',
    questions: [
      'Someone is spreading false information about me on social media.',
      'I have been a victim of online financial fraud. Who should I report to?',
      'What are my rights if my personal data is leaked by a company?',
      'Someone is impersonating me online. What legal action is available?',
    ],
  },
  {
    id: 'labour', icon: '👷', title: 'Labour & Wages',
    act: 'Code on Wages, 2019 / Payment of Wages Act', accent: '#4A7C59',
    questions: [
      'What is the minimum wage applicable to my occupation and state?',
      'My employer deducted wages without explanation. Is this legal?',
      'How do I file a complaint with the Labour Commissioner?',
      'Am I entitled to gratuity? What is the calculation?',
    ],
  },
  {
    id: 'maternity', icon: '👶', title: 'Maternity & Child Rights',
    act: 'Maternity Benefit Act, 1961 / Juvenile Justice Act', accent: '#8B4513',
    questions: [
      'How many weeks of paid maternity leave am I entitled to?',
      'My employer refused to grant maternity leave. What can I do?',
      'What is the process for child adoption in India?',
      'What rights does a child have under the Juvenile Justice Act?',
    ],
  },
];

const STATES = [
  'All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

/* ── Animated topic card ── */
function TopicCard({ topic, onSelect, delay }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: open ? topic.accent : 'var(--color-border)',
               background: 'var(--color-ivory)',
               transition: 'border-color 0.2s' }}
    >
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-4 px-5 py-5 text-left"
        whileHover={{ backgroundColor: 'var(--color-ivory-deep)' }}
        transition={{ duration: 0.15 }}
      >
        <motion.span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ background: `${topic.accent}14` }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {topic.icon}
        </motion.span>
        <div className="flex-1 min-w-0">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                       fontWeight: 600, color: 'var(--color-ink)' }}>
            {topic.title}
          </h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                      color: 'var(--color-ink-muted)', marginTop: 2, letterSpacing: '0.04em' }}>
            {topic.act}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                         letterSpacing: '0.1em', color: topic.accent,
                         border: `1px solid ${topic.accent}40`, borderRadius: 999,
                         padding: '2px 8px', opacity: 0.85 }}>
            {topic.questions.length} Q&A
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="var(--color-ink-muted)" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-t px-5 pb-4 pt-3 space-y-2"
                 style={{ borderColor: 'var(--color-border)',
                          background: 'var(--color-ivory-deep)' }}>
              {topic.questions.map((q, i) => (
                <motion.button key={i} onClick={() => onSelect(q)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="group flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-[border-color,background-color,box-shadow,transform] duration-150 hover:shadow-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory)' }}
                  whileHover={{ x: 4, borderColor: topic.accent + '60',
                                transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                >
                  <motion.span style={{ color: topic.accent, opacity: 0.5, marginTop: 2, flexShrink: 0 }}
                    whileHover={{ opacity: 1 }}>→</motion.span>
                  <span className="flex-1 text-sm leading-snug"
                        style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-sans)' }}>
                    {q}
                  </span>
                  <motion.span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] text-white"
                    style={{ background: topic.accent, fontFamily: 'var(--font-mono)' }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    Ask →
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function KnowYourRights() {
  const navigate = useNavigate();
  const [search, setSearch]       = useState('');
  const [stateFilter, setStateFilter] = useState('All States');

  const filtered = TOPICS.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) ||
      t.questions.some(s => s.toLowerCase().includes(q));
    return matchSearch;
  });

  return (
    <div style={{ background: 'var(--color-ivory)', minHeight: '100vh',
                  fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b"
              style={{ borderColor: 'var(--color-border)',
                       background: 'rgba(244,239,230,0.92)',
                       backdropFilter: 'blur(12px)' }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span style={{ color: 'var(--color-gold)' }}>⚖</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem',
                           fontWeight: 600, color: 'var(--color-ink)' }}>
              Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/documents"
                  className="hidden rounded-full border px-4 py-1.5 text-xs sm:block"
                  style={{ borderColor: 'rgba(197,148,58,0.35)', color: 'var(--color-gold)',
                           fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
              Document Wizard
            </Link>
            <Link to="/chat"
                  className="rounded-full px-5 py-2 text-xs text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-saffron)', fontFamily: 'var(--font-mono)' }}>
              Open Chat →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b px-5 py-16 text-center"
           style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory-deep)' }}>
        <div className="mx-auto max-w-2xl">
          <motion.p
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', letterSpacing: '0.3em',
                     textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem' }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Know Your Rights
          </motion.p>
          <motion.h1
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,4rem)',
                     fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Your Rights,<br />
            <span style={{ color: 'var(--color-saffron)', fontStyle: 'italic' }}>Explained Simply</span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-md text-base leading-relaxed"
            style={{ color: 'var(--color-ink-muted)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Browse common legal topics. Click any question to get a statute-backed answer in your language.
          </motion.p>

          {/* Search + State filter row */}
          <motion.div
            className="mx-auto mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {/* Search */}
            <div className="flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-150 focus-within:border-saffron"
                 style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="var(--color-ink-muted)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Search topics or questions…"
                     value={search} onChange={e => setSearch(e.target.value)}
                     className="flex-1 bg-transparent text-sm focus:outline-none"
                     style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-sans)' }} />
              {search && (
                <button onClick={() => setSearch('')}
                        style={{ color: 'var(--color-ink-muted)', fontSize: '0.75rem' }}>✕</button>
              )}
            </div>

            {/* State filter */}
            <div className="relative">
              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                className="appearance-none rounded-2xl border px-4 py-3 pr-9 text-sm focus:outline-none focus:border-saffron"
                style={{ borderColor: stateFilter !== 'All States' ? 'var(--color-saffron)' : 'var(--color-border)',
                         background: stateFilter !== 'All States' ? 'rgba(212,100,30,0.05)' : 'var(--color-ivory)',
                         color: stateFilter !== 'All States' ? 'var(--color-saffron)' : 'var(--color-ink)',
                         fontFamily: 'var(--font-sans)', minWidth: 160 }}
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                   width="11" height="11" viewBox="0 0 24 24" fill="none"
                   stroke="var(--color-ink-muted)" strokeWidth="2" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </motion.div>

          {/* State hint */}
          <AnimatePresence>
            {stateFilter !== 'All States' && (
              <motion.p
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em',
                         color: 'var(--color-saffron)', marginTop: '0.75rem', opacity: 0.8 }}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 0.8, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                Showing results for {stateFilter} — state-specific laws will be highlighted in chat
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b px-5 py-4"
           style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory)' }}>
        <div className="mx-auto max-w-5xl flex flex-wrap items-center gap-4">
          {[
            { n: TOPICS.length, label: 'Legal Topics' },
            { n: TOPICS.reduce((a, t) => a + t.questions.length, 0), label: 'Sample Questions' },
            { n: 50, label: 'Acts Indexed' },
            { n: 10, label: 'Languages' },
          ].map(({ n, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700,
                             color: 'var(--color-saffron)' }}>{n}+</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
                             color: 'var(--color-ink-muted)' }}>{label}</span>
              <span style={{ color: 'var(--color-border)', marginLeft: 8 }}>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topics grid */}
      <main className="mx-auto max-w-5xl px-5 py-12">
        {filtered.length === 0 ? (
          <motion.div className="py-24 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                        color: 'var(--color-ink-muted)' }}>
              No matching topics found.
            </p>
            <button onClick={() => { setSearch(''); setStateFilter('All States'); }}
                    style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                             color: 'var(--color-saffron)' }}>
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} delay={i * 0.07}
                onSelect={q => {
                  const params = new URLSearchParams({ q });
                  if (stateFilter !== 'All States') params.set('state', stateFilter);
                  navigate(`/chat?${params.toString()}`);
                }} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="mt-14 rounded-2xl border px-8 py-10 text-center"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory-deep)' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-ink)' }}>
            Need a legal document?
          </p>
          <p style={{ marginTop: 4, fontSize: '0.84rem', color: 'var(--color-ink-muted)' }}>
            Generate FIR drafts, RTI applications, consumer complaints and more.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link to="/documents"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-saffron)', fontFamily: 'var(--font-mono)',
                           letterSpacing: '0.06em', textDecoration: 'none' }}>
              Open Document Wizard →
            </Link>
            <Link to="/chat"
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-xs transition-colors duration-150 hover:border-saffron"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)',
                           fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
              Ask a Custom Question
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="border-t px-5 py-8 text-center"
              style={{ borderColor: 'var(--color-border)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                    color: 'var(--color-ink-muted)', opacity: 0.6 }}>
          General guidance only · Not a substitute for qualified legal counsel
        </p>
      </footer>
    </div>
  );
}
