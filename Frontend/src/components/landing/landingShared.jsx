/**
 * Shared animation variants, utilities, and micro-components
 * used across multiple landing section components.
 */
import { motion } from 'framer-motion';

/* ── Animation variants ─────────────────────────────────────── */
export const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
};
export const stagger = (delay = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: delay } },
});

/* ── SVG icon paths ─────────────────────────────────────────── */
export const ICONS = {
  mic:  ['M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z','M4 11a8 8 0 0 0 16 0','M12 19v4','M9 23h6'],
  book: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z','M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
  eye:  ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M12 18v-6','M9 15l3 3 3-3'],
  bolt: ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'],
};

/* ── Section label ──────────────────────────────────────────── */
export function Label({ children }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <motion.div className="h-px w-6"
        style={{ background: 'var(--color-gold)', opacity: 0.5 }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
      />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', letterSpacing: '0.28em',
                  textTransform: 'uppercase', color: 'var(--color-gold)' }}>
        {children}
      </p>
    </div>
  );
}

/* ── Animated border card (CTA wrapper) ─────────────────────── */
export function AnimatedBorderCard({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
          rx="23" fill="none" stroke="rgba(197,148,58,0.5)" strokeWidth="1.5"
          strokeDasharray="8 200"
          initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -800 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
          rx="23" fill="none" stroke="rgba(197,148,58,0.15)" strokeWidth="1"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.2 }}
        />
      </svg>
      {children}
    </div>
  );
}
