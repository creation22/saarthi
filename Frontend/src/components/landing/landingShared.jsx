/**
 * Pieces used by more than one landing section.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { EASE } from './landingMotion.js';

/* ── Question box ───────────────────────────────────────────────
   /chat sends whatever arrives in ?q= as the first message, so a
   question typed here is answered on arrival. */
export function AskForm({ id }) {
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = question.trim();
    navigate(q ? `/chat?q=${encodeURIComponent(q)}` : '/chat');
  };

  return (
    <form className="lp-ask" onSubmit={submit}>
      <label htmlFor={id} className="sr-only">Your legal question</label>
      <input
        id={id}
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your legal question"
        autoComplete="off"
        enterKeyHint="send"
        maxLength={1000}
      />
      <button type="submit" className="lp-btn lp-btn--primary">Ask</button>
    </form>
  );
}

/* ── Scroll reveal ──────────────────────────────────────────────
   One entrance per block: it fades and rises once, with its content
   already in place. Under reduced motion only the fade remains
   (MotionConfig in Landing.jsx). */
export function Reveal({ as = 'div', delay = 0, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── Counting number ────────────────────────────────────────────
   Writes straight to the text node, so nothing re-renders per frame. */
export function CountUp({ to, live, delay = 0 }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!live || reduceMotion) return;
    const show = (v) => { if (ref.current) ref.current.textContent = Math.round(v); };
    show(0);
    const controls = animate(0, to, { duration: 1.2, delay, ease: EASE, onUpdate: show });
    return () => controls.stop();
  }, [live, reduceMotion, to, delay]);

  // Rendered at its final value, so it is right with motion off or before it scrolls in
  return <span ref={ref}>{to}</span>;
}

/* ── Icons (24px grid, stroke follows text colour) ──────────── */
function Icon({ size = 18, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}
export const Arrow     = (p) => <Icon size={24} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
export const ArrowOut  = (p) => <Icon {...p}><path d="M7 17 17 7M8.5 7H17v8.5" /></Icon>;
export const MicIcon   = (p) => <Icon {...p}><rect x="9" y="2.5" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5" /></Icon>;
export const DocIcon   = (p) => <Icon {...p}><path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z" /><path d="M14 2.5v5h5M9 13h6M9 17h4" /></Icon>;
export const ChatIcon  = (p) => <Icon {...p}><path d="M20.5 14.5a2 2 0 0 1-2 2H9l-5 4v-15a2 2 0 0 1 2-2h12.5a2 2 0 0 1 2 2z" /></Icon>;
export const GavelIcon = (p) => <Icon {...p}><path d="m13.5 4 6.5 6.5M11 6.5l6.5 6.5M9.5 8 16 14.5M12.5 11 4 19.5M13 21h8" /></Icon>;
export const HomeIcon  = (p) => <Icon {...p}><path d="M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" /></Icon>;
export const BagIcon   = (p) => <Icon {...p}><path d="M5 8h14l-1 12.5H6zM9 8V6.5a3 3 0 0 1 6 0V8" /></Icon>;
export const CaseIcon  = (p) => <Icon {...p}><rect x="3" y="7.5" width="18" height="12.5" rx="2" /><path d="M9 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5v2M3 13h18" /></Icon>;
export const PhoneIcon = (p) => <Icon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></Icon>;
export const DownIcon  = (p) => <Icon {...p}><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" /></Icon>;
