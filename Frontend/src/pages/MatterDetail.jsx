import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getMatter, updateMatter, linkSessionToMatter, linkCaseToMatter } from '../services/api.js';

const TABS = ['Overview', 'Chat Sessions', 'Case Tracker', 'Documents', 'Notes'];

const STATUS_OPTIONS = [
  { value: 'open',     label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'archived', label: 'Archived' },
];

const metaLabel = {
  fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: 6,
};

export default function MatterDetail() {
  const { id }  = useParams();
  const [matter,  setMatter]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('Overview');
  const [notes,   setNotes]   = useState('');
  const [notesSaving, setNotesSaving] = useState(false);
  const [sessionInput, setSessionInput] = useState('');
  const [cnrInput,     setCnrInput]     = useState('');

  useEffect(() => {
    getMatter(id)
      .then(({ data }) => { setMatter(data.matter); setNotes(data.matter.notes || ''); })
      .catch(() => toast.error('Failed to load matter'))
      .finally(() => setLoading(false));
  }, [id]);

  // Debounced notes save — skipped until the user actually edits
  const notesDirtyRef = useRef(false);
  useEffect(() => {
    if (!matter || !notesDirtyRef.current) return;
    let cancelled = false;
    setNotesSaving(true);
    const t = setTimeout(async () => {
      try {
        await updateMatter(id, { notes });
      } catch {
        toast.error('Failed to save notes');
      } finally {
        if (!cancelled) setNotesSaving(false);
      }
    }, 600);
    return () => { cancelled = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  const handleStatusChange = async (status) => {
    try {
      const { data } = await updateMatter(id, { status });
      setMatter(data.matter);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleLinkSession = async (e) => {
    e.preventDefault();
    if (!sessionInput.trim()) return;
    try {
      const { data } = await linkSessionToMatter(id, sessionInput.trim());
      setMatter(data.matter);
      setSessionInput('');
      toast.success('Session linked');
    } catch {
      toast.error('Failed to link session');
    }
  };

  const handleLinkCase = async (e) => {
    e.preventDefault();
    if (!cnrInput.trim()) return;
    try {
      const { data } = await linkCaseToMatter(id, cnrInput.trim().toUpperCase());
      setMatter(data.matter);
      setCnrInput('');
      toast.success('Case linked');
    } catch {
      toast.error('Failed to link case');
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', background: 'var(--color-ivory)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-dim)' }}>
        Loading…
      </div>
    );
  }

  if (!matter) {
    return (
      <div style={{ height: '100vh', background: 'var(--color-ivory)', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-soft)' }}>
        Matter not found.
        <Link to="/dashboard" style={{ color: 'var(--color-gold)', marginTop: 12, textDecoration: 'none',
                                        fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>← Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)', fontFamily: 'var(--font-sans)',
                  color: 'var(--color-ink)' }}>

      <div style={{ position: 'fixed', width: 600, height: 600, top: -250, right: -150,
                    borderRadius: '50%', filter: 'blur(110px)', pointerEvents: 'none', zIndex: 0,
                    background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center',
                       justifyContent: 'space-between', padding: '14px 28px',
                       borderBottom: '1px solid rgba(0,0,0,0.08)',
                       background: 'rgba(249,246,240,0.92)', backdropFilter: 'blur(24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', fontFamily: 'var(--font-mono)',
                                          fontSize: '0.65rem', color: 'var(--color-text-soft)',
                                          letterSpacing: '0.06em' }}>← Dashboard</Link>
          <span style={{ color: 'rgba(0,0,0,0.09)' }}>|</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600,
                       color: 'var(--color-ink)', margin: 0 }}>{matter.title}</h1>
        </div>
        <select value={matter.status} onChange={e => handleStatusChange(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(0,0,0,0.09)',
                   borderRadius: 8, padding: '5px 10px', color: 'var(--color-ink)', fontSize: '0.78rem',
                   fontFamily: 'var(--font-mono)', cursor: 'pointer', outline: 'none' }}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </header>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto', padding: '28px 24px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid rgba(0,0,0,0.08)',
                      paddingBottom: 1 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background: 'none', border: 'none', borderBottom: tab === t
                         ? '2px solid var(--color-gold)' : '2px solid transparent',
                       color: tab === t ? 'var(--color-gold)' : 'var(--color-text-soft)',
                       fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em',
                       padding: '8px 12px', cursor: 'pointer', textTransform: 'uppercase',
                       transition: 'color 0.15s', marginBottom: -1 }}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'Overview' && (
          <div>
            {matter.description && (
              <div style={{ marginBottom: 20 }}>
                <div style={metaLabel}>Description</div>
                <p style={{ color: 'var(--color-text-mid)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {matter.description}
                </p>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Chat Sessions', value: matter.sessions?.length || 0, link: () => setTab('Chat Sessions') },
                { label: 'Tracked Cases', value: matter.trackedCases?.length || 0, link: () => setTab('Case Tracker') },
                { label: 'Documents',     value: matter.documents?.length || 0,  link: () => setTab('Documents') },
              ].map(({ label, value, link }) => (
                <motion.div key={label} whileHover={{ y: -2 }} onClick={link}
                  style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(0,0,0,0.08)',
                           borderRadius: 12, padding: '16px', cursor: 'pointer' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem',
                                fontWeight: 700, color: 'var(--color-gold)' }}>{value}</div>
                  <div style={{ ...metaLabel, marginBottom: 0 }}>{label}</div>
                </motion.div>
              ))}
            </div>
            <div style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                          color: 'var(--color-text-faint)', letterSpacing: '0.08em' }}>
              Created {new Date(matter.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        )}

        {/* Chat Sessions tab */}
        {tab === 'Chat Sessions' && (
          <div>
            <form onSubmit={handleLinkSession} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <input value={sessionInput} onChange={e => setSessionInput(e.target.value)}
                placeholder="Paste a session ID to link…"
                style={{ flex: 1, background: 'rgba(255,255,255,0.75)',
                         border: '1px solid rgba(0,0,0,0.09)', borderRadius: 10,
                         padding: '9px 12px', color: 'var(--color-ink)', fontSize: '0.82rem',
                         fontFamily: 'var(--font-mono)', outline: 'none' }} />
              <button type="submit"
                style={{ background: 'rgba(212,168,80,0.1)', border: '1px solid rgba(212,168,80,0.25)',
                         borderRadius: 10, padding: '9px 16px', color: 'var(--color-gold)',
                         fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer' }}>
                Link
              </button>
            </form>
            {matter.sessions?.length === 0 ? (
              <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>No sessions linked yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matter.sessions.map(sid => (
                  <div key={sid} style={{ display: 'flex', justifyContent: 'space-between',
                                          alignItems: 'center', padding: '10px 14px',
                                          background: 'rgba(255,255,255,0.75)',
                                          border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                                   color: 'var(--color-text-soft)' }}>{sid}</span>
                    <Link to={`/history?session=${sid}`}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                               color: 'var(--color-gold)', textDecoration: 'none', letterSpacing: '0.06em' }}>
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Case Tracker tab */}
        {tab === 'Case Tracker' && (
          <div>
            <form onSubmit={handleLinkCase} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <input value={cnrInput} onChange={e => setCnrInput(e.target.value.toUpperCase())}
                placeholder="Enter CNR number (e.g. MHPU010012342024)"
                maxLength={16}
                style={{ flex: 1, background: 'rgba(255,255,255,0.75)',
                         border: '1px solid rgba(0,0,0,0.09)', borderRadius: 10,
                         padding: '9px 12px', color: 'var(--color-ink)', fontSize: '0.82rem',
                         fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', outline: 'none' }} />
              <button type="submit"
                style={{ background: 'rgba(212,168,80,0.1)', border: '1px solid rgba(212,168,80,0.25)',
                         borderRadius: 10, padding: '9px 16px', color: 'var(--color-gold)',
                         fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer' }}>
                Link
              </button>
            </form>
            <Link to="/tracker" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                                          color: 'var(--color-text-dim)', textDecoration: 'none',
                                          display: 'block', marginBottom: 16 }}>
              → View all tracked cases in Case Tracker
            </Link>
            {matter.trackedCases?.length === 0 ? (
              <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>No cases linked yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matter.trackedCases.map(c => (
                  <div key={c._id || c} style={{ padding: '10px 14px',
                                                  background: 'rgba(255,255,255,0.75)',
                                                  border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                                  color: 'var(--color-gold)' }}>{c.cnrNumber || c}</div>
                    {c.caseTitle && <div style={{ fontSize: '0.82rem', color: 'var(--color-text-mid)',
                                                  marginTop: 2 }}>{c.caseTitle}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Documents tab */}
        {tab === 'Documents' && (
          <div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-soft)', marginBottom: 16 }}>
              Documents generated from this matter. Click Download to regenerate.
            </p>
            {matter.documents?.length === 0 ? (
              <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>No documents yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matter.documents.map(doc => (
                  <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between',
                                               alignItems: 'center', padding: '12px 16px',
                                               background: 'rgba(255,255,255,0.75)',
                                               border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-ink)', marginBottom: 2 }}>{doc.filename}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                                    color: 'var(--color-text-dim)' }}>
                        {doc.docType?.toUpperCase()} · {doc.format?.toUpperCase()} ·{' '}
                        {new Date(doc.generatedAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <Link to="/documents"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                               color: 'var(--color-gold)', textDecoration: 'none', letterSpacing: '0.06em' }}>
                      Regenerate →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes tab */}
        {tab === 'Notes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          marginBottom: 10 }}>
              <div style={metaLabel}>Personal notes (auto-saved)</div>
              {notesSaving && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                               color: 'var(--color-text-dim)' }}>Saving…</span>
              )}
            </div>
            <textarea value={notes} onChange={e => { notesDirtyRef.current = true; setNotes(e.target.value); }}
              placeholder="Add notes, reminders, key facts…"
              rows={14}
              style={{ width: '100%', background: 'rgba(255,255,255,0.75)',
                       border: '1px solid rgba(0,0,0,0.09)', borderRadius: 12,
                       padding: '14px', color: 'var(--color-ink)', fontSize: '0.88rem',
                       fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical',
                       lineHeight: 1.6, boxSizing: 'border-box' }} />
          </div>
        )}

      </main>
    </div>
  );
}
