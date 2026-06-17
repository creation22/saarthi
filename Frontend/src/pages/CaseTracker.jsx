import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getTrackedCases, trackCase, refreshCase, untrackCase } from '../services/api.js';

const STATUS_META = {
  pending:  { label: 'Pending',  bg: 'rgba(196,122,48,0.12)', color: '#C47A30' },
  disposed: { label: 'Disposed', bg: 'rgba(212,175,55,0.12)', color: 'var(--color-gold)' },
  unknown:  { label: 'Unknown',  bg: 'rgba(0,0,0,0.05)',      color: 'rgba(0,0,0,0.38)' },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.unknown;
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em',
                   padding: '2px 10px', borderRadius: 999, background: m.bg, color: m.color,
                   textTransform: 'uppercase' }}>{m.label}</span>
  );
}

function HearingTimeline({ hearings }) {
  if (!hearings?.length) {
    return <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', padding: '12px 0' }}>
      No hearing history available.
    </p>;
  }
  const sorted = [...hearings].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div style={{ position: 'relative', paddingLeft: 20 }}>
      <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8,
                    width: 1, background: 'rgba(212,175,55,0.25)' }} />
      {sorted.map((h, i) => {
        const d = h.date ? new Date(h.date) : null;
        const isNext = i === 0 && d && d > new Date();
        return (
          <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
            <div style={{ position: 'absolute', left: -16, top: 4, width: 8, height: 8,
                          borderRadius: '50%',
                          background: isNext ? 'var(--color-gold)' : 'rgba(212,175,55,0.3)',
                          border: isNext ? '2px solid rgba(212,175,55,0.5)' : 'none' }} />
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
                          color: isNext ? 'var(--color-gold)' : 'var(--color-text-dim)', marginBottom: 2 }}>
              {d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date unknown'}
              {isNext && ' (Next Hearing)'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-ink)' }}>{h.purpose || 'Hearing'}</div>
            {h.judge && <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
              Before: {h.judge}
            </div>}
          </div>
        );
      })}
    </div>
  );
}

function CaseCard({ c, onRefresh, onDelete }) {
  const [expanded,   setExpanded]   = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const nextHearing = c.hearings
    ?.filter(h => h.date && new Date(h.date) > new Date())
    ?.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const handleRefresh = async (e) => {
    e.stopPropagation();
    setRefreshing(true);
    try {
      const { data } = await refreshCase(c.cnrNumber);
      onRefresh(data.case);
      toast.success('Case data refreshed');
    } catch {
      toast.error('Could not refresh — eCourts may be unavailable');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <motion.div layout style={{ background: 'rgba(255,255,255,0.8)',
                                border: '1px solid rgba(0,0,0,0.08)',
                                borderRadius: 16, overflow: 'hidden',
                                backdropFilter: 'blur(8px)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ padding: '18px 20px', cursor: 'pointer' }}
           onClick={() => setExpanded(e => !e)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em',
                          color: 'var(--color-gold)', marginBottom: 4 }}>{c.cnrNumber}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600,
                         color: 'var(--color-ink)', lineHeight: 1.3 }}>
              {c.caseTitle || 'Case details pending'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <StatusBadge status={c.status} />
            <span style={{ color: 'var(--color-text-faint)', fontSize: '0.8rem' }}>
              {expanded ? '▲' : '▼'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
                      color: 'var(--color-text-faint)' }}>
          {c.courtName  && <span>{c.courtName}</span>}
          {c.caseType   && <span>{c.caseType}</span>}
          {nextHearing  && <span style={{ color: 'var(--color-gold)' }}>
            Next: {new Date(nextHearing.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>}
        </div>

        {c.fetchError && (
          <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8,
                        background: 'rgba(196,122,48,0.08)', border: '1px solid rgba(196,122,48,0.2)',
                        fontSize: '0.72rem', color: '#C47A30', fontFamily: 'var(--font-mono)' }}>
            eCourts unavailable — showing last known data
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
            exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
              {(c.parties?.petitioner || c.parties?.respondent) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 0',
                              borderBottom: '1px solid rgba(0,0,0,0.07)', marginBottom: 16 }}>
                  {c.parties.petitioner && (
                    <div>
                      <div style={metaLabel}>Petitioner</div>
                      <div style={metaValue}>{c.parties.petitioner}</div>
                    </div>
                  )}
                  {c.parties.respondent && (
                    <div>
                      <div style={metaLabel}>Respondent</div>
                      <div style={metaValue}>{c.parties.respondent}</div>
                    </div>
                  )}
                </div>
              )}

              <div style={metaLabel}>Hearing History</div>
              <HearingTimeline hearings={c.hearings} />

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <motion.button onClick={handleRefresh} disabled={refreshing} whileTap={{ scale: 0.97 }}
                  style={{ flex: 1, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.22)',
                           borderRadius: 8, padding: '8px', color: 'var(--color-gold)',
                           fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                           letterSpacing: '0.08em', cursor: refreshing ? 'not-allowed' : 'pointer',
                           opacity: refreshing ? 0.6 : 1 }}>
                  {refreshing ? 'Refreshing…' : '↻ Refresh from eCourts'}
                </motion.button>
                <button onClick={() => onDelete(c.cnrNumber)}
                  style={{ background: 'rgba(196,68,40,0.07)', border: '1px solid rgba(196,68,40,0.18)',
                           borderRadius: 8, padding: '8px 14px', color: '#C44828',
                           fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer' }}>
                  Untrack
                </button>
              </div>

              {c.lastFetched && (
                <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                              color: 'var(--color-text-faint)' }}>
                  Last synced: {new Date(c.lastFetched).toLocaleString('en-IN')}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const metaLabel = {
  fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: 4,
};
const metaValue = { fontSize: '0.82rem', color: 'var(--color-ink)' };

export default function CaseTracker() {
  const [cases,   setCases]   = useState([]);
  const [cnr,     setCnr]     = useState('');
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);

  useEffect(() => {
    getTrackedCases()
      .then(({ data }) => setCases(data.cases))
      .catch(() => toast.error('Failed to load tracked cases'))
      .finally(() => setLoading(false));
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!cnr.trim()) return;
    setAdding(true);
    try {
      const { data } = await trackCase(cnr.trim().toUpperCase());
      setCases(prev => [data.case, ...prev]);
      setCnr('');
      toast.success(data.case.fetchError ? 'Case saved — eCourts data unavailable right now' : 'Case added!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add case');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (cnrNumber) => {
    if (!window.confirm('Stop tracking this case?')) return;
    try {
      await untrackCase(cnrNumber);
      setCases(prev => prev.filter(c => c.cnrNumber !== cnrNumber));
      toast.success('Case removed');
    } catch {
      toast.error('Failed to remove case');
    }
  };

  const handleRefresh = (updated) => {
    setCases(prev => prev.map(c => c.cnrNumber === updated.cnrNumber ? updated : c));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)', fontFamily: 'var(--font-sans)',
                  color: 'var(--color-ink)' }}>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                    background: 'radial-gradient(ellipse 55% 50% at 20% 20%, rgba(212,175,55,0.05) 0%, transparent 60%)' }} />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center',
                       justifyContent: 'space-between', padding: '14px 28px',
                       borderBottom: '1px solid rgba(0,0,0,0.07)',
                       background: 'rgba(249,246,240,0.92)', backdropFilter: 'blur(20px)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="14" height="18" viewBox="0 0 18 22" fill="none"
               stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round">
            <line x1="9" y1="1" x2="9" y2="21"/><line x1="2" y1="6" x2="16" y2="6"/>
            <line x1="2" y1="6" x2="2" y2="13"/><line x1="16" y1="6" x2="16" y2="13"/>
            <path d="M0,13 Q2,16 4,13"/><path d="M0,13 Q2,10 4,13"/>
            <path d="M14,13 Q16,16 18,13"/><path d="M14,13 Q16,10 18,13"/>
            <line x1="6" y1="21" x2="12" y2="21"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600,
                         color: 'var(--color-ink)', fontSize: '0.95rem' }}>
            Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/dashboard" style={navPill}>Dashboard</Link>
          <Link to="/chat"      style={navPill}>Chat</Link>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '36px 24px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 8 }}>eCourts</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.4rem)',
                     fontWeight: 700, marginBottom: 8 }}>Case Tracker</h1>
        <p style={{ color: 'var(--color-text-soft)', fontSize: '0.85rem', marginBottom: 32 }}>
          Track your court cases using their CNR (Case Number Reference). Data synced from eCourts portal.
        </p>

        {/* CNR input */}
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          <input value={cnr} onChange={e => setCnr(e.target.value.toUpperCase())}
            placeholder="e.g. MHPU010012342024"
            maxLength={16}
            style={{ flex: 1, background: '#fff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 12,
                     padding: '11px 16px', color: 'var(--color-ink)', fontSize: '0.9rem',
                     fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', outline: 'none',
                     transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = 'var(--color-saffron)'}
            onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'} />
          <motion.button type="submit" disabled={adding} whileTap={{ scale: 0.97 }}
            style={{ background: 'var(--color-saffron)', border: 'none', borderRadius: 12,
                     padding: '11px 22px', color: '#fff', fontSize: '0.88rem',
                     fontWeight: 600, cursor: adding ? 'not-allowed' : 'pointer',
                     opacity: adding ? 0.7 : 1, fontFamily: 'var(--font-sans)',
                     whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(230,92,0,0.25)' }}>
            {adding ? 'Tracking…' : 'Track Case'}
          </motion.button>
        </form>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em',
                      color: 'var(--color-text-faint)', marginBottom: 32 }}>
          FORMAT: 4 letters + 12 digits (state code + court code + number + year)
        </div>

        {/* Cases list */}
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--color-text-soft)' }}>Loading…</div>
        ) : cases.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                 stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round"
                 style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }}>
              <line x1="12" y1="3" x2="12" y2="21"/>
              <line x1="3" y1="7" x2="21" y2="7"/>
              <path d="M3 7l2 5c0 1.1 1.8 2 4 2s4-.9 4-2l2-5"/>
            </svg>
            <p style={{ color: 'var(--color-text-soft)', fontSize: '0.88rem' }}>
              No cases tracked yet. Enter a CNR number above to get started.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cases.map(c => (
              <CaseCard key={c.cnrNumber} c={c} onRefresh={handleRefresh} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const navPill = {
  fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.06em',
  padding: '5px 12px', borderRadius: 999, textDecoration: 'none',
  border: '1px solid rgba(0,0,0,0.09)', color: 'var(--color-text-soft)',
};
