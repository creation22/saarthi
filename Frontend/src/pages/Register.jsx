import { Link, useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/react';
import { motion } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-ivory)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            marginBottom: 24,
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-ink)',
            }}
          >
            Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
          </span>
        </Link>

        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: { width: '100%' },
              card: {
                borderRadius: '24px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
              },
            },
          }}
        />

        <p
          style={{
            marginTop: 20,
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--color-text-dim)',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            ← Back to home
          </button>
        </p>
      </motion.div>
    </div>
  );
}
