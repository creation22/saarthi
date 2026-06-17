import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import { getMatters, createMatter, deleteMatter } from '../services/api.js';

const CATEGORY_META = {
  tenant:    { label: 'Tenant',    color: 'var(--color-gold)' },
  consumer:  { label: 'Consumer',  color: '#C47A30' },
  workplace: { label: 'Workplace', color: 'var(--color-saffron)' },
  family:    { label: 'Family',    color: '#8B6914' },
  criminal:  { label: 'Criminal',  color: '#C44B28' },
  property:  { label: 'Property',  color: 'var(--color-gold)' },
  rti:       { label: 'RTI',       color: '#C47A30' },
  contract:  { label: 'Contract',  color: 'var(--color-gold)' },
  other:     { label: 'Other',     color: 'rgba(0,0,0,0.35)' },
};

const STATUS_META = {
  open:     { label: 'Open',     bg: 'rgba(212,175,55,0.12)',  color: 'var(--color-gold)' },
  resolved: { label: 'Resolved', bg: 'rgba(196,122,48,0.12)', color: '#C47A30' },
  archived: { label: 'Archived', bg: 'rgba(0,0,0,0.05)',      color: 'rgba(0,0,0,0.35)' },
};

function NewMatterModal({ onClose, onCreate }) {
  const [title,    setTitle]    = useState('');
  const [desc,     setDesc]     = useState('');
  const [category, setCategory] = useState('other');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createMatter({ title, description: desc, category });
      onCreate(data.matter);
      onClose();
      toast.success('Matter created');
    } catch {
      toast.error('Failed to create matter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               zIndex: 50, padding: 24, backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 16 }}
        style={{ background: '#FAF8F4', border: '1px solid rgba(0,0,0,0.09)',
                 borderRadius: 20, padding: '32px 28px', width: '100%', maxWidth: 440,
                 boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700,
                     color: 'var(--color-ink)', marginBottom: 24 }}>New Legal Matter</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="e.g. Landlord deposit dispute" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              {Object.entries(CATEGORY_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Description (optional)</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Brief summary of the situation…" rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.09)',
                       borderRadius: 10, padding: '10px', color: 'rgba(0,0,0,0.55)',
                       fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Cancel
            </button>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              style={{ flex: 2, background: 'var(--color-saffron)', border: 'none', borderRadius: 10,
                       padding: '10px', color: '#fff', fontSize: '0.88rem', fontWeight: 600,
                       cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                       fontFamily: 'var(--font-sans)',
                       boxShadow: '0 4px 14px rgba(230,92,0,0.25)' }}>
              {loading ? 'Creating…' : 'Create Matter'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

const labelStyle = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
  letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'var(--color-text-dim)', marginBottom: 6,
};
const inputStyle = {
  width: '100%', background: '#fff',
  border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8,
  padding: '9px 12px', color: 'var(--color-ink)', fontSize: '0.88rem',
  fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
};

function MatterCard({ matter, onDelete }) {
  const cat    = CATEGORY_META[matter.category] || CATEGORY_META.other;
  const status = STATUS_META[matter.status]     || STATUS_META.open;
  const navigate = useNavigate();

  return (
    <motion.div whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(0,0,0,0.09)' }}
      transition={{ type: 'spring', stiffness: 400 }}
      onClick={() => navigate(`/matters/${matter._id}`)}
      style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.08)',
               borderRadius: 16, padding: '20px 22px', cursor: 'pointer', position: 'relative',
               backdropFilter: 'blur(8px)',
               boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em',
                         padding: '2px 8px', borderRadius: 999, background: `rgba(0,0,0,0.05)`,
                         color: cat.color, textTransform: 'uppercase', border: `1px solid ${cat.color}25` }}>
            {cat.label}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em',
                       padding: '2px 8px', borderRadius: 999,
                       background: status.bg, color: status.color }}>{status.label}</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600,
                   color: 'var(--color-ink)', marginBottom: 6, lineHeight: 1.3 }}>{matter.title}</h3>
      {matter.description && (
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-soft)', lineHeight: 1.5,
                    marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {matter.description}
        </p>
      )}
      <div style={{ display: 'flex', gap: 16, fontSize: '0.72rem',
                    color: 'var(--color-text-faint)', fontFamily: 'var(--font-mono)' }}>
        <span>{matter.sessions?.length || 0} chats</span>
        <span>{matter.trackedCases?.length || 0} cases</span>
        <span>{matter.documents?.length || 0} docs</span>
      </div>
      <button onClick={e => { e.stopPropagation(); onDelete(matter._id); }}
        style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none',
                 cursor: 'pointer', opacity: 0.25, color: 'var(--color-ink)', fontSize: '0.75rem',
                 padding: '2px 6px', borderRadius: 6 }}
        title="Delete matter">✕</button>
    </motion.div>
  );
}

export default function Dashboard() {
  const { userDisplay, logout } = useAuth();
  const navigate         = useNavigate();
  const [matters, setMatters]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getMatters()
      .then(({ data }) => setMatters(data.matters))
      .catch(() => toast.error('Failed to load matters'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this matter? This cannot be undone.')) return;
    try {
      await deleteMatter(id);
      setMatters(m => m.filter(x => x._id !== id));
      toast.success('Matter deleted');
    } catch {
      toast.error('Failed to delete matter');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)', fontFamily: 'var(--font-sans)',
                  color: 'var(--color-ink)', position: 'relative' }}>

      {/* Ambient background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                    background: 'radial-gradient(ellipse 55% 50% at 80% 10%, rgba(212,175,55,0.05) 0%, transparent 60%)' }} />

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/tracker" style={navPillStyle}>Case Tracker</Link>
          <Link to="/lawyers" style={navPillStyle}>Find a Lawyer</Link>
          <Link to="/chat"    style={navPillStyle}>New Chat</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-saffron)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
              {userDisplay?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <button onClick={() => { logout(); navigate('/'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                       fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
                       color: 'var(--color-text-dim)', padding: '4px 8px' }}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto',
                     padding: '36px 24px' }}>
        {/* Page title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 6 }}>Dashboard</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.4rem)',
                         fontWeight: 700, color: 'var(--color-ink)' }}>
              Your Legal Matters
            </h1>
          </div>
          <motion.button onClick={() => setShowModal(true)} whileTap={{ scale: 0.97 }}
            style={{ background: 'var(--color-saffron)', border: 'none', borderRadius: 12,
                     padding: '10px 20px', color: '#fff', fontSize: '0.85rem', fontWeight: 600,
                     cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
                     boxShadow: '0 4px 14px rgba(230,92,0,0.25)' }}>
            + New Matter
          </motion.button>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total Matters', value: matters.length },
            { label: 'Open',          value: matters.filter(m => m.status === 'open').length },
            { label: 'Documents',     value: matters.reduce((s, m) => s + (m.documents?.length || 0), 0) },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.7)',
                                      border: '1px solid rgba(0,0,0,0.07)',
                                      borderRadius: 12, padding: '16px 20px',
                                      backdropFilter: 'blur(8px)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem',
                            fontWeight: 700, color: 'var(--color-gold)' }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--color-text-dim)',
                            marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Matters grid */}
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--color-text-soft)' }}>
            Loading…
          </div>
        ) : matters.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                 stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round"
                 style={{ margin: '0 auto 16px', display: 'block', opacity: 0.5 }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <p style={{ color: 'var(--color-text-soft)', fontSize: '0.9rem', marginBottom: 20 }}>
              No legal matters yet. Create one to organise your queries, cases, and documents.
            </p>
            <motion.button onClick={() => setShowModal(true)} whileTap={{ scale: 0.97 }}
              style={{ background: 'var(--color-saffron)', border: 'none', borderRadius: 12,
                       padding: '10px 24px', color: '#fff', fontSize: '0.88rem', fontWeight: 600,
                       cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Create your first matter
            </motion.button>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {matters.map(m => (
              <motion.div key={m._id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                <MatterCard matter={m} onDelete={handleDelete} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <NewMatterModal
            onClose={() => setShowModal(false)}
            onCreate={m => setMatters(prev => [m, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const navPillStyle = {
  fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.06em',
  padding: '5px 12px', borderRadius: 999, textDecoration: 'none',
  border: '1px solid rgba(0,0,0,0.09)', color: 'var(--color-text-soft)',
  background: 'transparent',
};
