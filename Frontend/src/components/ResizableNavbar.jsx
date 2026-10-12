import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { SignInButton } from '@clerk/react';
import { useAuth } from '../hooks/useAuth.js';

/* ─── Resizable / Floating Navbar ──────────────────────────────── */
export function ResizableNavbar({ navItems, ctaLabel = 'Get Started', ctaTo = '/chat' }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, userDisplay } = useAuth();

  const navBg     = scrolled ? 'rgba(246,241,233,0.96)' : 'transparent';
  const navShadow = scrolled ? '0 0 0 1px rgba(0,0,0,0.07), 0 8px 40px rgba(0,0,0,0.09)' : 'none';

  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 80));

  const initial = userDisplay?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  // A scroll started while the menu is collapsing gets cancelled (the address changes,
  // the page stays put), so remember the target and go once the menu has finished closing.
  const pendingSection = useRef(null);
  const goToSection = (e, href) => {
    setMobileOpen(false);
    if (!href.startsWith('#')) return;
    e.preventDefault();
    window.history.pushState(null, '', href);
    pendingSection.current = href;
  };
  const scrollToPendingSection = () => {
    if (!pendingSection.current) return;
    document.querySelector(pendingSection.current)?.scrollIntoView();
    pendingSection.current = null;
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex items-start justify-center">

        {/* ── Desktop ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:grid items-center"
          style={{
            // Three tracks keep the links centred and in the flow, so they can
            // never slide under the buttons the way an absolute overlay did.
            gridTemplateColumns: '1fr auto 1fr',
            columnGap: 16,
            width: scrolled ? 'min(calc(100% - 32px), 1040px)' : '100%',
            borderRadius: scrolled ? 999 : 0,
            marginTop: scrolled ? 12 : 0,
            padding: scrolled ? '10px 22px' : '16px 24px',
            backdropFilter: 'blur(20px)',
            background: navBg,
            boxShadow: navShadow,
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" style={{ justifySelf: 'start' }}>
            <ScalesLogo dark={false} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem',
                           fontWeight: 600, color: '#1A1410', letterSpacing: '0.01em' }}>
              My<span style={{ color: '#8B6914' }}>Saarthi</span>
            </span>
          </Link>

          {/* Nav links — centre track */}
          <NavLinks items={navItems} />

          {/* Right controls */}
          <div className="flex items-center gap-2.5 shrink-0"
               style={{ justifySelf: 'end' }}>
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
                <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
                  <button
                    type="button"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      color: 'rgba(26,20,16,0.7)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '10px 12px',
                    }}
                  >
                    Sign in
                  </button>
                </SignInButton>
              </>
            )}
            {/* The page's main action needs no account, so it leads; sign-up lives on the sign-in page */}
            <Link to={ctaTo}
                  className="rounded-full px-5 text-sm font-semibold text-white"
                  style={{
                    display: 'inline-flex', alignItems: 'center', height: 40,
                    background: '#C94E00',
                    fontFamily: 'var(--font-sans)',
                    textDecoration: 'none',
                  }}>
              {ctaLabel}
            </Link>
          </div>
        </motion.div>

        {/* ── Mobile ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex lg:hidden flex-col"
          style={{
            width: scrolled ? '92%' : '100%',
            borderRadius: scrolled ? 16 : 0,
            marginTop: scrolled ? 10 : 0,
            padding: '13px 16px',
            backdropFilter: 'blur(20px)',
            // Solid while the menu is open so the page underneath doesn't show through the links
            background: scrolled || mobileOpen ? 'rgba(246,241,233,0.97)' : 'rgba(246,241,233,0.8)',
            boxShadow: scrolled || mobileOpen ? '0 0 0 1px rgba(0,0,0,0.07), 0 8px 40px rgba(0,0,0,0.09)' : 'none',
          }}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <ScalesLogo size={14} dark={false} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                             fontWeight: 600, color: '#1A1410' }}>
                My<span style={{ color: '#8B6914' }}>Saarthi</span>
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
                <Link to={ctaTo}
                      className="rounded-full px-4 text-sm font-semibold text-white"
                      style={{
                        display: 'inline-flex', alignItems: 'center', height: 40,
                        background: '#C94E00',
                        fontFamily: 'var(--font-sans)',
                        textDecoration: 'none',
                      }}>
                  Ask
                </Link>
              )}
              <button type="button" onClick={() => setMobileOpen(o => !o)}
                      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                      aria-expanded={mobileOpen}
                      style={{ color: '#1A1410', background: 'none', border: 'none', cursor: 'pointer',
                               width: 44, height: 44, marginRight: -10,
                               display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HamburgerIcon open={mobileOpen} />
              </button>
            </div>
          </div>

          <AnimatePresence initial={false} onExitComplete={scrollToPendingSection}>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: 8, paddingBottom: 8,
                              borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: 8 }}>
                  {navItems.map(item => (
                    <a key={item.href} href={item.href}
                       onClick={e => goToSection(e, item.href)}
                       style={{ display: 'flex', alignItems: 'center', minHeight: 48,
                                fontFamily: 'var(--font-sans)',
                                fontSize: '1.05rem', color: '#1A1410',
                                padding: '0 0.25rem', textDecoration: 'none' }}>
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
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        navigate('/login');
                      }}
                      className="block w-full mt-3 rounded-full px-5 text-sm font-semibold text-center"
                      style={{
                        height: 46,
                        background: 'transparent',
                        color: '#1A1410',
                        fontFamily: 'var(--font-sans)',
                        border: '1.5px solid rgba(26,20,16,0.3)',
                        cursor: 'pointer',
                      }}
                    >
                      Sign in or create an account
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

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

/* ─── Nav links ─────────────────────────────────────────────────── */
function NavLinks({ items }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="hidden lg:flex items-center justify-center gap-0.5">
      {items.map((item, i) => (
        <a key={item.href} href={item.href}
           onMouseEnter={() => setHovered(i)}
           onMouseLeave={() => setHovered(null)}
           className="relative px-4 py-2 rounded-full"
           style={{
             fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
             color: hovered === i ? '#1A1410' : 'rgba(26,20,16,0.7)',
             transition: 'color 0.15s', textDecoration: 'none',
             whiteSpace: 'nowrap',
           }}>
          {hovered === i && (
            <motion.div layoutId="nav-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(30,20,10,0.06)' }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
          )}
          <span style={{ position: 'relative', zIndex: 2 }}>{item.label}</span>
        </a>
      ))}
    </div>
  );
}

/* ─── Scales logo SVG ───────────────────────────────────────────── */
function ScalesLogo({ size = 18, dark = false }) {
  const h = Math.round(size * 22 / 18);
  return (
    <svg width={size} height={h} viewBox="0 0 18 22" fill="none"
         stroke={dark ? 'rgba(212,175,55,0.85)' : 'var(--color-gold)'} strokeWidth="1.4" strokeLinecap="round">
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
