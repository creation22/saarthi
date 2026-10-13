import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Arrow } from './landingShared.jsx';

const FAQS = [
  { q: 'Is MySaarthi really free?',
    a: 'Yes, completely free. No signup or payment required for the chat, document generator, and contract analyzer. Creating an account (also free) unlocks the case tracker and matter dashboard.' },
  { q: 'Can I use this in court?',
    a: 'MySaarthi provides general legal information, not formal legal advice. For court proceedings, consult a qualified advocate or your nearest Legal Services Authority (free via DLSA).' },
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
  { q: 'What is the Case Tracker and how does it work?',
    a: 'Enter your CNR (Case Number Reference) — a 16-character code on any court notice — and we fetch your case status, hearing history, and next hearing date directly from the eCourts portal. Cases are refreshed automatically every 6 hours.' },
  { q: 'What is a Legal Matter?',
    a: 'A Matter is a folder for one legal situation. You can link related chat sessions, tracked cases, and generated documents under a single matter, add personal notes, and track its status (Open / Resolved / Archived). Free with any account.' },
  { q: 'How do I find free legal help near me?',
    a: 'Visit /lawyers. Every district in India has a District Legal Services Authority (DLSA) that provides completely free legal aid, Lok Adalat sessions, and mediation. Eligibility includes SC/ST, women, children, persons with disabilities, and anyone earning below ₹3 lakh per year. You can also call the NALSA national helpline at 15100 from anywhere in India, 24/7.' },
];

function FAQItem({ q, a, id, open, onToggle }) {
  return (
    <div className="lp-faq__item">
      <h3>
        <button type="button" className="lp-faq__q" onClick={onToggle}
                aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`}>
          {q}
          {/* The upright bar of the plus folds away, leaving a minus */}
          <svg className="lp-faq__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
            <path className="lp-faq__bar" d="M12 5v14" /><path d="M5 12h14" />
          </svg>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="lp-faq__a" id={`${id}-a`} role="region" aria-labelledby={`${id}-q`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="lp-section">
      <div className="lp-wrap lp-faq__grid">
        <div className="lp-faq__head">
          <h2 className="lp-h2">Questions people<span>ask first.</span></h2>
          <div className="lp-faq__help">
            <h3>Need a person, not an app?</h3>
            <p>
              MySaarthi explains what the law says. It does not replace a lawyer.
              Free legal aid is listed by state and district.
            </p>
            <Link to="/lawyers" className="lp-btn lp-btn--primary lp-btn--arrow"><Arrow size={18} />Find legal aid</Link>
          </div>
        </div>

        <div className="lp-faq__list">
          {FAQS.map((item, i) => (
            <FAQItem key={item.q} id={`lp-faq-${i}`} q={item.q} a={item.a}
                     open={openIndex === i}
                     onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
