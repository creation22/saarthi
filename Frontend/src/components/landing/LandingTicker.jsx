import { motion } from 'framer-motion';

const TICKER_ACTS = [
  'Indian Penal Code · IPC 1860', 'RTI Act · 2005',
  'Consumer Protection Act · 2019', 'Industrial Disputes Act · 1947',
  'Payment of Wages Act · 1936', 'POSH Act · 2013',
  'Transfer of Property Act · 1882', 'IT Act · 2000',
  'Domestic Violence Act · 2005', 'RERA · 2016',
  'Bharatiya Nyaya Sanhita · BNS 2023', 'Labour Codes · 2020',
  'Code on Wages · 2019', 'Maternity Benefit Act · 1961',
  'Legal Services Authorities Act · 1987', 'Arbitration Act · 1996',
];

export default function LandingTicker() {
  const doubled = [...TICKER_ACTS, ...TICKER_ACTS];
  return (
    <div style={{ background: 'var(--color-hero)', borderTop: '1px solid rgba(255,255,255,0.06)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
                  padding: '12px 0', userSelect: 'none' }}>
      <motion.div style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}>
        {doubled.map((act, i) => (
          <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                                  letterSpacing: '0.22em', textTransform: 'uppercase',
                                  color: 'rgba(197,148,58,0.45)', padding: '0 28px' }}>
            {act}
            <span style={{ color: 'rgba(197,148,58,0.2)', marginLeft: 28 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
