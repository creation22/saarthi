import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SignInButton } from '@clerk/react';
import { useAuth } from '../../hooks/useAuth.js';
import { EASE } from './landingMotion.js';

function Scales() {
  return (
    <svg width="16" height="20" viewBox="0 0 18 22" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M9 1v20M2 6h14M2 6v7M16 6v7M6 21h6" />
      <path d="M0 13q2 3 4 0M0 13q2-3 4 0M14 13q2 3 4 0M14 13q2-3 4 0" />
    </svg>
  );
}

/* ─── Signed-in menu ──────────────────────────────────────────── */
function UserMenu() {
  const { user, userDisplay, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const initial = userDisplay?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="lp-nav__user">
      <button type="button" className="lp-nav__avatar" onClick={() => setOpen((o) => !o)}
              aria-label="Your account" aria-expanded={open}>
        {userDisplay?.photo ? <img src={userDisplay.photo} alt="" /> : initial}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="lp-nav__dropdown"
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
            transition={{ duration: 0.16, ease: EASE }}>
            <p>{userDisplay?.name || 'Your account'}</p>
            <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
            <Link to="/tracker" onClick={() => setOpen(false)}>Case tracker</Link>
            <button type="button" onClick={async () => { await logout(); setOpen(false); navigate('/'); }}>
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Top bar ─────────────────────────────────────────────────── */
export default function LandingNav({ navItems, ctaLabel = 'Ask a question', ctaTo = '/chat' }) {
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // A scroll started while the menu is collapsing gets cancelled (the address changes,
  // the page stays put), so remember the target and go once the menu has finished closing.
  const pendingSection = useRef(null);
  const goToSection = (e, href) => {
    setOpen(false);
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
    <header className="lp-nav">
      <div className="lp-wrap lp-nav__row">
        <Link to="/" className="lp-nav__brand"><Scales /><span>My<b>Saarthi</b></span></Link>

        <nav className="lp-nav__links" aria-label="On this page">
          {navItems.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
        </nav>

        <div className="lp-nav__actions">
          {isLoggedIn ? <UserMenu /> : (
            <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
              <button type="button" className="lp-nav__signin">Sign in</button>
            </SignInButton>
          )}
          {/* The full label would crowd the bar on a small phone, so it shortens to its first word */}
          <Link to={ctaTo} className="lp-btn lp-btn--primary lp-btn--sm" aria-label={ctaLabel}>
            <span className="lp-nav__cta-short">{ctaLabel.split(' ')[0]}</span>
            <span className="lp-nav__cta-long">{ctaLabel}</span>
          </Link>
          <button type="button" className="lp-nav__burger" onClick={() => setOpen((o) => !o)}
                  aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            <span /><span />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false} onExitComplete={scrollToPendingSection}>
        {open && (
          <motion.div className="lp-nav__menu"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: EASE }}>
            <div className="lp-wrap">
              {navItems.map(({ label, href }) => (
                <a key={href} href={href} onClick={(e) => goToSection(e, href)}>{label}</a>
              ))}
              <button type="button" className="lp-btn lp-btn--outline"
                      onClick={() => { setOpen(false); navigate(isLoggedIn ? '/dashboard' : '/login'); }}>
                {isLoggedIn ? 'Open your dashboard' : 'Sign in or create an account'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
