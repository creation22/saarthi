import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchLawyers, getLawyerStates, getLawyerDistricts } from '../services/api.js';

const TYPE_META = {
  DLSA:   { label: 'DLSA · Free Legal Aid', bg: 'rgba(212,175,55,0.10)',  color: 'var(--color-gold)', badge: 'FREE' },
  NGO:    { label: 'NGO / Legal Aid Org',   bg: 'rgba(196,122,48,0.10)',  color: '#C47A30',           badge: 'NGO'  },
  lawyer: { label: 'Practising Advocate',   bg: 'rgba(139,105,20,0.10)',  color: '#8B6914',           badge: '₹'   },
};

function LawyerCard({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const type = TYPE_META[entry.type] || TYPE_META.NGO;

  return (
    <motion.div layout whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400 }}
      style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.08)',
               borderRadius: 16, overflow: 'hidden',
               backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em',
                             padding: '2px 8px', borderRadius: 999,
                             background: type.bg, color: type.color, textTransform: 'uppercase' }}>
                {type.badge}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                             color: 'var(--color-text-dim)' }}>
                {entry.state} · {entry.district}
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600,
                         color: 'var(--color-ink)', lineHeight: 1.3, marginBottom: 6 }}>{entry.name}</h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {(entry.services || entry.specialization || []).slice(0, 5).map(s => (
            <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                                   letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 999,
                                   background: 'rgba(0,0,0,0.04)',
                                   color: 'var(--color-text-soft)', textTransform: 'uppercase' }}>{s}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {entry.phone && (
            <a href={`tel:${entry.phone.replace(/\s/g, '')}`}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                       borderRadius: 8, background: 'rgba(212,175,55,0.08)',
                       border: '1px solid rgba(212,175,55,0.22)',
                       color: 'var(--color-gold)', textDecoration: 'none',
                       fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                       letterSpacing: '0.04em' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.43 2 2 0 0 1 3.88 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {entry.phone}
            </a>
          )}
          {entry.website && entry.website !== 'https://nalsa.gov.in' && (
            <a href={entry.website} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                       borderRadius: 8, background: 'rgba(139,105,20,0.08)',
                       border: '1px solid rgba(139,105,20,0.18)',
                       color: '#8B6914', textDecoration: 'none',
                       fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Website
            </a>
          )}
          <button onClick={() => setExpanded(e => !e)}
            style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.04)',
                     border: '1px solid rgba(0,0,0,0.09)', color: 'var(--color-text-soft)',
                     fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer' }}>
            {expanded ? 'Less ▲' : 'More ▼'}
          </button>
        </div>

        {expanded && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
            {entry.eligibility && (
              <div style={{ marginBottom: 10 }}>
                <div style={metaLabel}>Eligibility for Free Aid</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mid)', lineHeight: 1.5 }}>
                  {entry.eligibility}
                </div>
              </div>
            )}
            {entry.consultation && (
              <div style={{ marginBottom: 10 }}>
                <div style={metaLabel}>Consultation</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mid)' }}>{entry.consultation}</div>
              </div>
            )}
            {entry.languages?.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={metaLabel}>Languages</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mid)' }}>
                  {entry.languages.join(' · ')}
                </div>
              </div>
            )}
            {entry.address && (
              <div>
                <div style={metaLabel}>Address</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mid)' }}>{entry.address}</div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

const metaLabel = {
  fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: 4,
};

const selectStyle = {
  background: '#fff', border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: 10, padding: '9px 12px', color: 'var(--color-ink)', fontSize: '0.85rem',
  fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer', minWidth: 0,
  width: '100%',
};

export default function LawyerDirectory() {
  const [results,   setResults]   = useState([]);
  const [states,    setStates]    = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading,   setLoading]   = useState(false);

  const [state,    setState]    = useState('');
  const [district, setDistrict] = useState('');
  const [type,     setType]     = useState('');
  const [query,    setQuery]    = useState('');

  useEffect(() => {
    getLawyerStates().then(({ data }) => setStates(data.states));
    doSearch({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state) {
      getLawyerDistricts(state).then(({ data }) => setDistricts(data.districts));
    } else {
      setDistricts([]);
    }
    setDistrict('');
  }, [state]);

  const doSearch = (overrides = {}) => {
    const params = { state, district, type, q: query, ...overrides };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    setLoading(true);
    searchLawyers(params)
      .then(({ data }) => setResults(data.results))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => { e.preventDefault(); doSearch(); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)', fontFamily: 'var(--font-sans)',
                  color: 'var(--color-ink)' }}>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                    background: 'radial-gradient(ellipse 55% 50% at 20% 60%, rgba(212,175,55,0.05) 0%, transparent 60%)' }} />

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
          <Link to="/chat"      style={navPill}>Chat</Link>
          <Link to="/dashboard" style={navPill}>Dashboard</Link>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 8 }}>
            Free · Nationwide
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.4rem)',
                       fontWeight: 700, marginBottom: 8 }}>Find Legal Help Near You</h1>
          <p style={{ color: 'var(--color-text-soft)', fontSize: '0.88rem' }}>
            Free District Legal Services Authorities (DLSA) and legal aid NGOs across India.
            DLSA services are <strong style={{ color: 'var(--color-gold)' }}>completely free</strong> for eligible citizens.
          </p>
        </div>

        {/* NALSA helpline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                      background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.22)',
                      borderRadius: 12, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)"
                 strokeWidth="1.8" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.43 2 2 0 0 1 3.88 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600,
                          color: 'var(--color-gold)', fontSize: '1rem' }}>
              15100 — NALSA National Helpline
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-soft)', marginTop: 2 }}>
              Free legal aid, 24/7, from anywhere in India. Available in all Indian languages.
            </div>
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10,
                   marginBottom: 14, alignItems: 'end' }}>
          <div>
            <label style={formLabel}>State</label>
            <select value={state} onChange={e => setState(e.target.value)} style={selectStyle}>
              <option value="">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={formLabel}>District</label>
            <select value={district} onChange={e => setDistrict(e.target.value)}
              disabled={!districts.length}
              style={{ ...selectStyle, opacity: districts.length ? 1 : 0.5 }}>
              <option value="">All Districts</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={formLabel}>Type</label>
            <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
              <option value="">All</option>
              <option value="DLSA">DLSA (Free)</option>
              <option value="NGO">NGO / Legal Aid</option>
            </select>
          </div>
          <motion.button type="submit" whileTap={{ scale: 0.97 }}
            style={{ background: 'var(--color-saffron)', border: 'none', borderRadius: 10,
                     padding: '9px 20px', color: '#fff', fontSize: '0.85rem',
                     fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                     alignSelf: 'flex-end', boxShadow: '0 4px 14px rgba(230,92,0,0.25)' }}>
            Search
          </motion.button>
        </form>

        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
          placeholder="Search by name, service, or specialization…"
          style={{ width: '100%', background: '#fff', border: '1px solid rgba(0,0,0,0.12)',
                   borderRadius: 10, padding: '10px 14px', color: 'var(--color-ink)',
                   fontSize: '0.88rem', fontFamily: 'var(--font-sans)', outline: 'none',
                   boxSizing: 'border-box', marginBottom: 24, transition: 'border-color 0.15s' }}
          onFocus={e => e.target.style.borderColor = 'var(--color-saffron)'}
          onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'} />

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--color-text-soft)' }}>
            Searching…
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round"
                 style={{ margin: '0 auto 14px', display: 'block', opacity: 0.4 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p style={{ color: 'var(--color-text-soft)', fontSize: '0.88rem', marginBottom: 8 }}>
              No results found for your filters.
            </p>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.78rem' }}>
              Try calling the NALSA helpline: <strong style={{ color: 'var(--color-gold)' }}>15100</strong>
            </p>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
                          color: 'var(--color-text-faint)', marginBottom: 14 }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            <motion.div initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map(entry => (
                <motion.div key={entry.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                  <LawyerCard entry={entry} />
                </motion.div>
              ))}
            </motion.div>
          </>
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

const formLabel = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'var(--color-text-dim)', marginBottom: 5,
};
