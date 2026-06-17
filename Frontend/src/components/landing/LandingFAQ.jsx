import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from './landingShared.jsx';

const FAQS = [
  { q: 'Is LegalSahayak really free?',
    a: 'Yes, completely free. No signup or payment required for the chat, document generator, and contract analyzer. Creating an account (also free) unlocks the case tracker and matter dashboard.' },
  { q: 'What is the Case Tracker and how does it work?',
    a: 'Enter your CNR (Case Number Reference) — a 16-character code on any court notice — and we fetch your case status, hearing history, and next hearing date directly from the eCourts portal. Cases are refreshed automatically every 6 hours.' },
  { q: 'What is a Legal Matter?',
    a: 'A Matter is a folder for one legal situation. You can link related chat sessions, tracked cases, and generated documents under a single matter, add personal notes, and track its status (Open / Resolved / Archived). Free with any account.' },
  { q: 'How do I find free legal help near me?',
    a: 'Visit /lawyers. Every district in India has a District Legal Services Authority (DLSA) that provides completely free legal aid, Lok Adalat sessions, and mediation. Eligibility includes SC/ST, women, children, persons with disabilities, and anyone earning below ₹3 lakh per year. You can also call the NALSA national helpline at 15100 from anywhere in India, 24/7.' },
  { q: 'Can I use this in court?',
    a: 'LegalSahayak provides general legal information, not formal legal advice. For court proceedings, consult a qualified advocate or your nearest Legal Services Authority (free via DLSA).' },
  { q: 'How accurate are the answers?',
    a: 'Every response is grounded in actual statute text retrieved via semantic search across 22+ Indian Acts. We cite the specific sections used. For consequential decisions, always verify with a qualified professional.' },
  { q: 'Which languages does it support?',
    a: "Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, Punjabi, Odia, English, and Hinglish — powered by Sarvam AI's models built for Indian languages." },
  { q: 'Can I speak my question instead of typing?',
    a: 'Yes. Tap the mic icon in the chat — it records your voice, transcribes it, auto-detects the language, and processes your query.' },
  { q: 'What documents can it generate?',
    a: 'FIR drafts, consumer complaints, legal notices, RTI applications, and demand notices — downloadable as PDF or Word via the Document Wizard at /documents.' },
  { q: 'Can it analyse my contracts?',
    a: 'Yes — the Contract Analyzer at /analyze accepts PDF, DOCX, or TXT files and returns a full breakdown: red flags, green flags, risk score, missing clauses, and recommendations.' },
];

function FAQItem({ q, a, i }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06, duration: 0.5 }}
      style={{
        borderBottom: '1px solid var(--color-glass-border)',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
        style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
      >
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600,
          color: open ? 'var(--color-ink)' : 'var(--color-text-bright)',
          lineHeight: 1.3,
          transition: 'color 0.2s',
        }}>{q}</span>

        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{
            flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: open ? 'rgba(230,92,0,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${open ? 'rgba(230,92,0,0.3)' : 'var(--color-glass-border)'}`,
            transition: 'background 0.2s, border-color 0.2s',
          }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
               stroke={open ? 'var(--color-saffron)' : 'var(--color-text-mid)'}
               strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.88rem', lineHeight: 1.75,
              color: 'var(--color-text-soft)',
              paddingBottom: '1.4rem', paddingRight: '3rem',
            }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LandingFAQ() {
  return (
    <section className="px-6 py-24 md:px-12 relative overflow-hidden"
             style={{ background: 'var(--color-ivory)' }}>

      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 60% at 20% 50%, rgba(212,175,55,0.03) 0%, transparent 65%)',
      }} />

      <div className="mx-auto max-w-3xl relative">
        <Label>FAQ</Label>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3rem)',
          fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.12,
          marginBottom: '2.5rem',
        }}>
          Common Questions
        </h2>

        <div>
          {FAQS.map((faq, i) => <FAQItem key={i} {...faq} i={i} />)}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            marginTop: '2.5rem',
            padding: '18px 22px',
            borderRadius: 14,
            background: 'var(--color-glass-bg)',
            border: '1px solid var(--color-glass-border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'rgba(212,175,55,0.09)',
            border: '1px solid rgba(212,175,55,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.43 2 2 0 0 1 3.88 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem',
                          fontWeight: 600, color: 'var(--color-text-bright)' }}>
              Still need help? Call NALSA: <span style={{ color: 'var(--color-gold)' }}>15100</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
                          letterSpacing: '0.1em', color: 'var(--color-text-dim)',
                          marginTop: 2 }}>
              Free legal aid helpline · 24/7 · All India
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
