import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../hooks/useSession.js';
import ChatWindow from '../components/ChatWindow.jsx';
import QueryInput from '../components/QueryInput.jsx';
import LanguageSelector from '../components/LanguageSelector.jsx';
import DocumentDownload from '../components/DocumentDownload.jsx';
import HomeBgIcons from '../components/HomeBgIcons.jsx';
import { sendTextQuery, sendVoiceQuery } from '../services/api.js';
import toast from 'react-hot-toast';
import {
  HouseIcon, ShoppingBagIcon, GavelIcon, ClipboardIcon, ScrollIcon,
  SearchIcon, FolderIcon, DocumentIcon, CaseIcon,
  ArrowRightIcon, ChevronUpIcon, ChevronDownIcon, PlusIcon, LocationPinIcon,
} from '../components/ui/icons.jsx';

/* ─── Data ──────────────────────────────────────────────────────── */
const INDIAN_STATES = [
  'Any State',
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Chandigarh','Jammu & Kashmir','Ladakh',
  'Puducherry','Andaman & Nicobar','Lakshadweep',
];

const QUICK_TOPICS = [
  { label: 'Tenant rights',        Icon: HouseIcon        },
  { label: 'Consumer complaint',   Icon: ShoppingBagIcon  },
  { label: 'Workplace harassment', Icon: GavelIcon        },
  { label: 'FIR filing',           Icon: ClipboardIcon    },
  { label: 'RTI application',      Icon: ScrollIcon       },
];

/* ─── Nav pill ──────────────────────────────────────────────────── */
function NavPill({ to, href, children, accent }) {
  const style = {
    fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.04em',
    padding: '5px 14px', borderRadius: 999, textDecoration: 'none',
    border: `1px solid ${accent ? 'rgba(212,168,80,0.35)' : 'var(--color-glass-border)'}`,
    color: accent ? 'var(--color-gold)' : 'var(--color-text-soft)',
    background: accent ? 'rgba(212,168,80,0.07)' : 'transparent',
    transition: 'border-color 0.15s, color 0.15s, background 0.15s',
    display: 'inline-block',
  };
  if (to) return <Link to={to} style={style} className="hidden sm:inline-block hover:opacity-100">{children}</Link>;
  return <a href={href} style={style} className="hidden sm:inline-block">{children}</a>;
}

/* ─── Sidebar section label ─────────────────────────────────────── */
function SLabel({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--color-text-faint)', marginBottom: 8,
    }}>{children}</p>
  );
}

/* ─── Thin divider ──────────────────────────────────────────────── */
function SDivider() {
  return <div style={{ height: 1, background: 'var(--color-glass-border-2)', margin: '16px 0' }} />;
}

/* ─── Sidebar link button ───────────────────────────────────────── */
function SidebarLink({ to, children, variant = 'default' }) {
  const variants = {
    default: {
      border: '1px solid var(--color-glass-border)',
      background: 'var(--color-glass-bg)',
      color: 'var(--color-text-soft)',
    },
    gold: {
      border: '1px solid rgba(212,168,80,0.28)',
      background: 'rgba(212,168,80,0.05)',
      color: 'var(--color-gold)',
    },
    danger: {
      border: '1px solid rgba(239,68,68,0.25)',
      background: 'rgba(239,68,68,0.04)',
      color: '#F87171',
    },
  };
  return (
    <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
      <Link to={to}
        className="flex items-center justify-between px-2.5 py-2 rounded-xl text-[11px] font-mono-dm no-underline transition-colors mb-1.5"
        style={variants[variant]}
      >
        {children}
        <ArrowRightIcon size={9} color="currentColor" style={{ opacity: 0.5 }} />
      </Link>
    </motion.div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
export default function Home() {
  const { sessionId, resetSession } = useSession();
  const { isLoggedIn, user } = useAuth();
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [language, setLanguage]   = useState('en-IN');
  const [state, setState]         = useState('Any State');
  const [lastQuery, setLastQuery] = useState('');
  const [docOpen, setDocOpen]     = useState(false);
  const [searchParams]            = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !messages.length) handleTextSubmit(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextSubmit = async (text) => {
    setLoading(true);
    setLastQuery(text);
    setMessages(prev => [...prev, { role: 'user', content: text, language }]);
    try {
      const stateParam = state === 'Any State' ? '' : state;
      const { data } = await sendTextQuery(text, sessionId, language, false, stateParam);
      setMessages(prev => [...prev, { role: 'assistant', content: data.guidance, citations: data.citations ?? [] }]);
    } catch {
      toast.error('Something went wrong. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSubmit = async (blob) => {
    setLoading(true);
    toast('Processing voice input…');
    try {
      const { data } = await sendVoiceQuery(blob, sessionId);
      setLastQuery(data.originalText);
      setMessages(prev => [
        ...prev,
        { role: 'user',      content: data.transcript,  language: data.detectedLanguage },
        { role: 'assistant', content: data.guidance,    citations: data.citations ?? []  },
      ]);
    } catch {
      toast.error('Voice processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetSession();
    setMessages([]);
    setLastQuery('');
    setDocOpen(false);
    toast.success('New session started');
  };

  return (
    <div style={{
      position: 'relative', height: '100vh', overflow: 'hidden',
      background: 'var(--color-ivory)', fontFamily: 'var(--font-sans)',
    }}>

      {/* ── Subtle background layer ──────────────────────────────── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>

        {/* Warm tinted blobs — very subtle, theme-adaptive via opacity */}
        <div style={{
          position: 'absolute', width: 600, height: 600,
          top: -180, right: -100, borderRadius: '50%',
          filter: 'blur(100px)',
          background: 'radial-gradient(circle, rgba(212,168,80,0.07) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', width: 700, height: 600,
          bottom: -200, left: -180, borderRadius: '50%',
          filter: 'blur(100px)',
          background: 'radial-gradient(circle, rgba(224,120,72,0.06) 0%, transparent 65%)',
        }} />

        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(var(--color-glass-border-2) 1px, transparent 1px)',
            'linear-gradient(90deg, var(--color-glass-border-2) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '52px 52px',
          opacity: 0.6,
        }} />

        {/* Premium SVG background icons with path-length animations */}
        <HomeBgIcons />
      </div>

      {/* ── Foreground layout ────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 24px', flexShrink: 0,
          borderBottom: '1px solid var(--color-glass-border)',
          backdropFilter: 'blur(24px)',
          background: 'var(--color-ivory)',
          opacity: 0.97,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <svg width="17" height="21" viewBox="0 0 18 22" fill="none"
                 stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round">
              <line x1="9" y1="1" x2="9" y2="21" />
              <line x1="2" y1="6" x2="16" y2="6" />
              <line x1="2" y1="6" x2="2" y2="13" />
              <line x1="16" y1="6" x2="16" y2="13" />
              <path d="M0,13 Q2,16 4,13" /><path d="M0,13 Q2,10 4,13" />
              <path d="M14,13 Q16,16 18,13" /><path d="M14,13 Q16,10 18,13" />
              <line x1="6" y1="21" x2="12" y2="21" />
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.12rem', fontWeight: 600, color: 'var(--color-ink)' }}>
              Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
            </span>
          </Link>

          {/* Right side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LanguageSelector value={language} onChange={setLanguage} />
            <NavPill to="/rights">Know Your Rights</NavPill>
            <NavPill to="/lawyers">Find a Lawyer</NavPill>
            <NavPill to="/documents" accent>Documents</NavPill>
            <NavPill to="/analyze" accent>Analyze</NavPill>
            <NavPill to="/history">History</NavPill>
            {isLoggedIn
              ? <NavPill to="/dashboard" accent>{user?.name?.split(' ')[0]} ▾</NavPill>
              : <NavPill to="/login">Sign In</NavPill>
            }
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="inline-flex items-center gap-1.5"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.04em',
                padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
                border: '1px solid var(--color-glass-border)',
                color: 'var(--color-text-soft)', background: 'transparent',
              }}
            >
              <PlusIcon size={11} color="currentColor" />
              New Chat
            </motion.button>
          </div>
        </header>

        {/* ── Body ────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <aside className="hidden lg:flex dark-scroll" style={{
            width: 260, flexShrink: 0, flexDirection: 'column',
            justifyContent: 'space-between', overflowY: 'auto',
            padding: '20px 16px',
            borderRight: '1px solid var(--color-glass-border)',
            borderLeft: '2px solid rgba(224,120,72,0.3)',
            background: 'var(--color-ivory-deep)',
          }}>
            <div>
              {/* Session */}
              <SLabel>Session</SLabel>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                color: 'var(--color-text-faint)', wordBreak: 'break-all', lineHeight: 1.6,
                background: 'var(--color-glass-bg)', borderRadius: 8, padding: '6px 8px',
                border: '1px solid var(--color-glass-border-2)',
              }}>
                {sessionId}
              </p>

              <SDivider />

              {/* Language */}
              <SLabel>Language</SLabel>
              <LanguageSelector value={language} onChange={setLanguage} fullWidth />

              <SDivider />

              {/* State / Jurisdiction */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <SLabel>Jurisdiction</SLabel>
                <AnimatePresence>
                  {state !== 'Any State' && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setState('Any State')}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                        color: 'var(--color-saffron)', background: 'none', border: 'none', cursor: 'pointer',
                        padding: 0, marginBottom: 8,
                      }}
                    >
                      Clear ✕
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <div style={{ position: 'relative' }}>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full appearance-none"
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.72rem',
                    color: state !== 'Any State' ? 'var(--color-gold)' : 'var(--color-text-bright)',
                    background: state !== 'Any State' ? 'rgba(212,168,80,0.07)' : 'var(--color-glass-bg)',
                    border: `1px solid ${state !== 'Any State' ? 'rgba(212,168,80,0.3)' : 'var(--color-glass-border)'}`,
                    borderRadius: 10, padding: '7px 28px 7px 10px',
                    outline: 'none', width: '100%', cursor: 'pointer',
                  }}
                >
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDownIcon size={10} color="var(--color-text-faint)"
                  style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
              </div>
              {state !== 'Any State' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-1.5 mt-2"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-text-faint)', lineHeight: 1.55 }}
                >
                  <LocationPinIcon size={9} color="var(--color-gold)" />
                  {state}-specific laws applied where available.
                </motion.div>
              )}

              <SDivider />

              {/* Quick topics */}
              <SLabel>Quick Topics</SLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {QUICK_TOPICS.map(({ label, Icon }) => (
                  <motion.button
                    key={label}
                    whileHover={{ x: 3, background: 'rgba(224,120,72,0.07)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTextSubmit(`What are my rights regarding ${label.toLowerCase()}?`)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 10px', borderRadius: 10, cursor: 'pointer',
                      border: '1px solid var(--color-glass-border)',
                      background: 'var(--color-glass-bg)',
                      textAlign: 'left', gap: 8,
                      fontFamily: 'var(--font-sans)', fontSize: '0.71rem',
                      color: 'var(--color-text-soft)',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={13} color="var(--color-saffron)" style={{ opacity: 0.7, flexShrink: 0 }} />
                      {label}
                    </span>
                    <ArrowRightIcon size={9} color="var(--color-saffron)" style={{ opacity: 0.5, flexShrink: 0 }} />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bottom links */}
            <div>
              <SDivider />

              <SidebarLink to="/analyze" variant="danger">
                <span className="flex items-center gap-2">
                  <SearchIcon size={12} color="currentColor" />
                  Analyze Contract
                </span>
              </SidebarLink>

              <SidebarLink to="/documents" variant="gold">
                <span className="flex items-center gap-2">
                  <DocumentIcon size={12} color="currentColor" />
                  Document Wizard
                </span>
              </SidebarLink>

              <SidebarLink to="/tracker" variant="gold">
                <span className="flex items-center gap-2">
                  <CaseIcon size={12} color="currentColor" />
                  Case Tracker
                </span>
              </SidebarLink>

              {isLoggedIn && (
                <SidebarLink to="/dashboard" variant="default">
                  <span className="flex items-center gap-2">
                    <FolderIcon size={12} color="currentColor" />
                    My Matters
                  </span>
                </SidebarLink>
              )}

              {/* Quick Generate toggle */}
              <motion.button
                whileHover={{ background: 'var(--color-glass-bg-2)' }}
                onClick={() => setDocOpen(o => !o)}
                className="flex w-full items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer font-mono-dm text-[11px] transition-colors"
                style={{
                  border: '1px solid var(--color-glass-border)',
                  background: 'var(--color-glass-bg)',
                  color: 'var(--color-text-soft)',
                }}
              >
                <span>Quick Generate</span>
                <motion.span animate={{ rotate: docOpen ? 0 : 180 }} transition={{ duration: 0.2 }}>
                  <ChevronUpIcon size={10} color="currentColor" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {docOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: 8 }}>
                      <DocumentDownload query={lastQuery} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* ── Chat main ──────────────────────────────────────── */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Jurisdiction badge */}
            <AnimatePresence>
              {state !== 'Any State' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 20px',
                    borderBottom: '1px solid var(--color-glass-border)',
                    background: 'rgba(212,168,80,0.04)',
                  }}
                >
                  <LocationPinIcon size={11} color="var(--color-gold)" />
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    letterSpacing: '0.1em', color: 'var(--color-gold)', opacity: 0.85,
                  }}>
                    Jurisdiction: {state}
                  </span>
                  <button
                    onClick={() => setState('Any State')}
                    style={{
                      marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                      color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto' }}>
              <ChatWindow messages={messages} loading={loading} language={language} />
            </div>

            {/* Mobile doc button */}
            <AnimatePresence>
              {lastQuery && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="lg:hidden"
                  style={{
                    borderTop: '1px solid var(--color-glass-border)',
                    padding: '8px 16px',
                    background: 'var(--color-ivory-deep)',
                  }}
                >
                  <motion.button
                    onClick={() => setDocOpen(o => !o)}
                    className="flex items-center gap-1.5"
                    style={{ color: 'var(--color-saffron)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <motion.span animate={{ rotate: docOpen ? 0 : 180 }} transition={{ duration: 0.2 }}>
                      <ChevronUpIcon size={10} color="currentColor" />
                    </motion.span>
                    {docOpen ? 'Hide' : 'Generate Document'}
                  </motion.button>
                  {docOpen && <div style={{ marginTop: 8 }}><DocumentDownload query={lastQuery} /></div>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input bar */}
            <div style={{
              flexShrink: 0, padding: '12px 20px 16px',
              borderTop: '1px solid var(--color-glass-border)',
              background: 'var(--color-ivory)',
            }}>
              <QueryInput
                onSubmitText={handleTextSubmit}
                onSubmitVoice={handleVoiceSubmit}
                loading={loading}
              />
              <p style={{
                marginTop: 7, textAlign: 'center', fontSize: '0.6rem',
                letterSpacing: '0.06em', fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-faint)',
              }}>
                General legal information · Not a substitute for qualified legal counsel
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
