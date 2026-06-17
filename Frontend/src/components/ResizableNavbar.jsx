import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';

/* ─── Resizable / Floating Navbar ──────────────────────────────── */
export function ResizableNavbar({ navItems, ctaLabel = 'Get Started', ctaTo = '/chat' }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoggedIn, userDisplay } = useAuth();

  const navBg     = scrolled ? 'rgba(251,248,242,0.96)' : 'rgba(251,248,242,0.88)';
  const navShadow = scrolled ? '0 0 0 1px rgba(0,0,0,0.08), 0 8px 40px rgba(0,0,0,0.10)' : 'none';

  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 80));

  const initial = userDisplay?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex items-start justify-center">

        {/* ── Desktop ─────────────────────────────────────────────── */}
        <motion.div
          animate={{
            width:         scrolled ? '62%'   : '100%',
            borderRadius:  scrolled ? '999px' : '0px',
            marginTop:     scrolled ? '12px'  : '0px',
            paddingLeft:   scrolled ? '22px'  : '24px',
            paddingRight:  scrolled ? '22px'  : '24px',
            paddingTop:    scrolled ? '10px'  : '16px',
            paddingBottom: scrolled ? '10px'  : '16px',
            backdropFilter:'blur(20px)',
            background:    navBg,
            boxShadow:     navShadow,
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 40 }}
          className="hidden lg:flex items-center justify-between"
          style={{ minWidth: scrolled ? 740 : 'unset' }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <ScalesLogo />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem',
                           fontWeight: 600, color: '#0A0A0A', letterSpacing: '0.01em' }}>
              Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
            </span>
          </Link>

          {/* Nav links — absolute center */}
          <NavLinks items={navItems} />

          {/* Right controls */}
          <div className="flex items-center gap-2.5 shrink-0"
               style={{ position: 'relative', zIndex: 10 }}>
            {isLoggedIn ? (
              <UserMenu
                initial={initial}
                name={userDisplay?.name}
                email={userDisplay?.email}
                photo={userDisplay?.photo}
                open={userMenuOpen}
                onToggle={() => setUserMenuOpen(o => !o)}
                onClose={() => setUserMenuOpen(false)}
              />
            ) : (
              <>
                <button
                  onClick={() => setAuthOpen(true)}
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '0.83rem',
                           color: 'rgba(40,30,10,0.60)', background: 'none', border: 'none',
                           cursor: 'pointer', padding: '6px 10px' }}>
                  Sign In
                </button>
                <motion.button
                  onClick={() => setAuthOpen(true)}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="rounded-full px-5 py-2 text-sm font-semibold text-white"
                  style={{ background: 'var(--color-saffron)', fontFamily: 'var(--font-sans)',
                           boxShadow: '0 4px 14px rgba(230,92,0,0.3)', border: 'none', cursor: 'pointer' }}>
                  Sign Up
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* ── Mobile ──────────────────────────────────────────────── */}
        <motion.div
          animate={{
            width:         scrolled ? '92%'  : '100%',
            borderRadius:  scrolled ? '16px' : '0px',
            marginTop:     scrolled ? '10px' : '0px',
            paddingLeft:   '16px', paddingRight: '16px',
            paddingTop: '13px', paddingBottom: '13px',
            backdropFilter: 'blur(20px)',
            background:    scrolled ? 'rgba(251,248,242,0.97)' : 'rgba(251,248,242,0.90)',
            boxShadow:     scrolled ? '0 0 0 1px rgba(0,0,0,0.08), 0 8px 40px rgba(0,0,0,0.10)' : 'none',
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 40 }}
          className="flex lg:hidden flex-col"
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <ScalesLogo size={14} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                             fontWeight: 600, color: '#0A0A0A' }}>
                Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  style={{ width: 30, height: 30, borderRadius: '50%',
                           background: 'var(--color-saffron)', border: 'none', cursor: 'pointer',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700,
                           color: '#fff' }}>
                  {userDisplay?.photo
                    ? <img src={userDisplay.photo} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
                    : initial}
                </button>
              ) : (
                <button onClick={() => setAuthOpen(true)}
                  className="rounded-full px-4 py-1.5 text-xs font-semibold text-white"
                  style={{ background: 'var(--color-saffron)', border: 'none', cursor: 'pointer',
                           fontFamily: 'var(--font-sans)' }}>
                  Sign In
                </button>
              )}
              <button type="button" onClick={() => setMobileOpen(o => !o)}
                      style={{ color: '#0A0A0A', opacity: 0.75, background: 'none', border: 'none',
                               cursor: 'pointer', padding: 2 }}>
                <HamburgerIcon open={mobileOpen} />
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: 16, paddingBottom: 8,
                              borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: 12 }}>
                  {navItems.map(item => (
                    <a key={item.href} href={item.href}
                       onClick={() => setMobileOpen(false)}
                       style={{ display: 'block', fontFamily: 'var(--font-sans)',
                                fontSize: '0.9rem', color: 'rgba(40,30,10,0.50)',
                                padding: '0.55rem 0.25rem', textDecoration: 'none' }}>
                      {item.label}
                    </a>
                  ))}
                  {isLoggedIn ? (
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                          className="block mt-3 rounded-full px-5 py-2.5 text-sm font-semibold text-center"
                          style={{ background: 'var(--color-glass-bg)', border: '1px solid var(--color-glass-border)',
                                   color: 'var(--color-ink)', fontFamily: 'var(--font-sans)', textDecoration: 'none' }}>
                      Dashboard
                    </Link>
                  ) : (
                    <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                          className="block w-full mt-3 rounded-full px-5 py-2.5 text-sm font-semibold text-white text-center"
                          style={{ background: 'var(--color-saffron)', fontFamily: 'var(--font-sans)',
                                   border: 'none', cursor: 'pointer' }}>
                      Sign In / Sign Up
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Auth Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ─── User avatar + dropdown ────────────────────────────────────── */
function UserMenu({ initial, name, email, photo, open, onToggle, onClose }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={onToggle}
        style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid var(--color-glass-border)',
                 background: photo ? 'none' : 'var(--color-saffron)', cursor: 'pointer', overflow: 'hidden',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
        {photo
          ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initial}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              minWidth: 210,
              background: 'rgba(253,251,247,0.98)',
              border: '1px solid rgba(0,0,0,0.09)',
              borderRadius: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
              backdropFilter: 'blur(16px)',
              overflow: 'hidden',
            }}>
            {/* Profile info */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem',
                            fontWeight: 600, color: 'var(--color-ink)', marginBottom: 2 }}>
                {name || 'User'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                            color: 'rgba(0,0,0,0.38)', letterSpacing: '0.02em' }}>
                {email}
              </div>
            </div>

            {/* Links */}
            {[
              { label: 'Dashboard',    to: '/dashboard' },
              { label: 'Case Tracker', to: '/tracker' },
            ].map(({ label, to }) => (
              <Link key={to} to={to} onClick={onClose}
                style={{ display: 'block', padding: '10px 16px',
                         fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                         color: 'rgba(0,0,0,0.65)', textDecoration: 'none',
                         transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {label}
              </Link>
            ))}

            {/* Sign out */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <button onClick={async () => { await logout(); onClose(); navigate('/'); }}
                style={{ display: 'block', width: '100%', textAlign: 'left',
                         padding: '10px 16px', background: 'none', border: 'none',
                         fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                         color: 'rgba(230,92,0,0.8)', cursor: 'pointer',
                         transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(230,92,0,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Auth Modal ────────────────────────────────────────────────── */
function AuthModal({ onClose }) {
  const [tab, setTab]       = useState('signin'); // 'signin' | 'signup'
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === 'signup' && pass.length < 8) {
      toast.error('Password must be at least 8 characters'); return;
    }
    setLoading(true);
    try {
      if (tab === 'signin') {
        await login(email, pass);
        toast.success('Welcome back!');
      } else {
        await register(name, email, pass);
        toast.success('Account created!');
      }
      onClose();
      navigate('/dashboard');
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'     ? 'No account with that email.'
                : err.code === 'auth/wrong-password'     ? 'Incorrect password.'
                : err.code === 'auth/email-already-in-use' ? 'Email already registered.'
                : err.code === 'auth/invalid-email'       ? 'Invalid email address.'
                : err.code === 'auth/weak-password'       ? 'Password too weak.'
                : err.message || 'Something went wrong.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google!');
      onClose();
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               zIndex: 200, padding: 24, backdropFilter: 'blur(4px)' }}
      onClick={onClose}>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420,
          background: '#FAF8F4',
          border: '1px solid rgba(0,0,0,0.09)',
          borderRadius: 24, padding: '36px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
          position: 'relative',
        }}>

        {/* Close */}
        <button onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none',
                   cursor: 'pointer', color: 'rgba(0,0,0,0.3)', fontSize: '1.1rem', lineHeight: 1 }}>
          ✕
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <ScalesLogo size={15} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>
            Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
          </span>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: 10,
                      padding: 3, marginBottom: 24 }}>
          {[['signin', 'Sign In'], ['signup', 'Sign Up']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                       fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: tab === t ? 600 : 400,
                       background: tab === t ? '#fff' : 'transparent',
                       color: tab === t ? '#0A0A0A' : 'rgba(0,0,0,0.45)',
                       boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                       transition: 'all 0.15s' }}>
              {l}
            </button>
          ))}
        </div>

        {/* Google button */}
        <button onClick={handleGoogle} disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   gap: 10, padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                   background: '#fff', border: '1px solid rgba(0,0,0,0.12)',
                   fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 500,
                   color: '#0A0A0A', marginBottom: 16,
                   boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.09)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                         letterSpacing: '0.1em', color: 'rgba(0,0,0,0.32)' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.09)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {tab === 'signup' && (
            <AuthField label="Full Name" type="text" value={name}
              onChange={e => setName(e.target.value)} placeholder="Your name" />
          )}
          <AuthField label="Email" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <AuthField label="Password" type="password" value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder={tab === 'signup' ? '8+ characters' : '••••••••'} />

          <motion.button type="submit" disabled={loading}
            whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }}
            style={{ width: '100%', background: 'var(--color-saffron)', border: 'none',
                     borderRadius: 10, padding: '11px', color: '#fff', fontSize: '0.9rem',
                     fontWeight: 600, fontFamily: 'var(--font-sans)',
                     cursor: loading ? 'not-allowed' : 'pointer',
                     opacity: loading ? 0.7 : 1, marginTop: 4,
                     boxShadow: '0 4px 14px rgba(230,92,0,0.25)' }}>
            {loading ? 'Please wait…'
              : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        <p style={{ marginTop: 18, textAlign: 'center', fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem', letterSpacing: '0.04em', color: 'rgba(0,0,0,0.32)' }}>
          Free · No credit card · Always will be
        </p>
      </motion.div>
    </motion.div>
  );
}

function AuthField({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'rgba(0,0,0,0.38)', marginBottom: 5 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} required placeholder={placeholder}
        style={{ width: '100%', background: '#fff', border: '1px solid rgba(0,0,0,0.12)',
                 borderRadius: 8, padding: '9px 12px', color: '#0A0A0A', fontSize: '0.88rem',
                 fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
                 transition: 'border-color 0.15s' }}
        onFocus={e => e.target.style.borderColor = 'var(--color-saffron)'}
        onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'} />
    </div>
  );
}

/* ─── Nav links ─────────────────────────────────────────────────── */
function NavLinks({ items }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-0.5"
         style={{ pointerEvents: 'none' }}>
      {items.map((item, i) => (
        <a key={item.href} href={item.href}
           onMouseEnter={() => setHovered(i)}
           onMouseLeave={() => setHovered(null)}
           className="relative px-4 py-2 rounded-full"
           style={{
             fontFamily: 'var(--font-sans)', fontSize: '0.83rem',
             color: hovered === i ? '#0A0A0A' : 'rgba(40,30,10,0.50)',
             transition: 'color 0.15s', textDecoration: 'none',
             zIndex: 1, pointerEvents: 'auto',
           }}>
          {hovered === i && (
            <motion.div layoutId="nav-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(0,0,0,0.06)' }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
          )}
          <span style={{ position: 'relative', zIndex: 2 }}>{item.label}</span>
        </a>
      ))}
    </div>
  );
}

/* ─── Scales logo SVG ───────────────────────────────────────────── */
function ScalesLogo({ size = 18 }) {
  const h = Math.round(size * 22 / 18);
  return (
    <svg width={size} height={h} viewBox="0 0 18 22" fill="none"
         stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round">
      <line x1="9" y1="1"  x2="9"  y2="21" />
      <line x1="2" y1="6"  x2="16" y2="6"  />
      <line x1="2" y1="6"  x2="2"  y2="13" />
      <line x1="16" y1="6" x2="16" y2="13" />
      <path d="M0,13 Q2,16 4,13" /><path d="M0,13 Q2,10 4,13" />
      <path d="M14,13 Q16,16 18,13"/><path d="M14,13 Q16,10 18,13"/>
      <line x1="6" y1="21" x2="12" y2="21" />
    </svg>
  );
}

/* ─── Google icon ───────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

/* ─── Hamburger / close icon ────────────────────────────────────── */
function HamburgerIcon({ open }) {
  return open
    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6"  x2="6"  y2="18" />
        <line x1="6"  y1="6"  x2="18" y2="18" />
      </svg>
    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3"  y1="6"  x2="21" y2="6"  />
        <line x1="3"  y1="12" x2="21" y2="12" />
        <line x1="3"  y1="18" x2="21" y2="18" />
      </svg>;
}
