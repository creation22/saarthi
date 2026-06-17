import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'Email already registered.'
                : err.code === 'auth/invalid-email'        ? 'Invalid email address.'
                : err.code === 'auth/weak-password'        ? 'Password too weak.'
                : 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-sans)', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 65%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
                    backgroundSize: '28px 28px' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, margin: '0 24px',
                 background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.09)',
                 borderRadius: 24, padding: '40px 36px',
                 backdropFilter: 'blur(24px)',
                 boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8,
                               textDecoration: 'none', marginBottom: 32 }}>
          <svg width="16" height="20" viewBox="0 0 18 22" fill="none"
               stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round">
            <line x1="9" y1="1" x2="9" y2="21"/><line x1="2" y1="6" x2="16" y2="6"/>
            <line x1="2" y1="6" x2="2" y2="13"/><line x1="16" y1="6" x2="16" y2="13"/>
            <path d="M0,13 Q2,16 4,13"/><path d="M0,13 Q2,10 4,13"/>
            <path d="M14,13 Q16,16 18,13"/><path d="M14,13 Q16,10 18,13"/>
            <line x1="6" y1="21" x2="12" y2="21"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem',
                         fontWeight: 600, color: 'var(--color-ink)' }}>
            Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
          </span>
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700,
                     color: 'var(--color-ink)', marginBottom: 6 }}>Create your account</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-soft)', marginBottom: 28 }}>
          Free — saves your cases, documents, and legal matters
        </p>

        <button onClick={handleGoogle} disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   gap: 10, padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                   background: '#fff', border: '1px solid rgba(0,0,0,0.12)',
                   fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 500,
                   color: '#0A0A0A', marginBottom: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <GoogleIcon /> Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.09)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                         letterSpacing: '0.1em', color: 'rgba(0,0,0,0.32)' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.09)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Full Name"  type="text"     value={name}     onChange={e => setName(e.target.value)}     placeholder="Your name" />
          <Field label="Email"      type="email"    value={email}    onChange={e => setEmail(e.target.value)}    placeholder="you@example.com" />
          <Field label="Password"   type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8+ characters" />

          <motion.button type="submit" disabled={loading}
            whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }}
            style={{ width: '100%', background: 'var(--color-saffron)', border: 'none', borderRadius: 12,
                     padding: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 600,
                     fontFamily: 'var(--font-sans)', cursor: loading ? 'not-allowed' : 'pointer',
                     opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(230,92,0,0.25)' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </motion.button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: '0.82rem',
                    color: 'var(--color-text-dim)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'var(--color-text-dim)', marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} required placeholder={placeholder}
        style={{ width: '100%', background: '#fff', border: '1px solid rgba(0,0,0,0.12)',
                 borderRadius: 10, padding: '10px 14px', color: 'var(--color-ink)',
                 fontSize: '0.9rem', fontFamily: 'var(--font-sans)', outline: 'none',
                 boxSizing: 'border-box', transition: 'border-color 0.15s' }}
        onFocus={e => e.target.style.borderColor = 'var(--color-saffron)'}
        onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'} />
    </div>
  );
}

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
