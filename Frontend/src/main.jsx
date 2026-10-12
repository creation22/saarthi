import { ClerkProvider } from '@clerk/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CLERK_PUBLISHABLE_KEY } from './config/env.js';

const publishableKey = CLERK_PUBLISHABLE_KEY;

function MissingClerkConfig() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        background: '#f6f1e9',
        color: '#1a1410',
      }}
    >
      <div style={{ maxWidth: 480, lineHeight: 1.6 }}>
        <h1 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Clerk is not configured</h1>
        <p style={{ marginBottom: 12 }}>
          Set <code>CLERK_PUBLISHABLE_KEY</code> in <code>.env.local</code> or your host&apos;s env, then rebuild.
        </p>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>
            In <code>Frontend/</code>: <code>clerk auth login</code> then <code>clerk env pull</code>
          </li>
          <li>
            Restart <code>npm run dev</code> (or rebuild with <code>npm run build</code>)
          </li>
        </ol>
        <p style={{ marginTop: 16, fontSize: '0.9rem', opacity: 0.75 }}>
          Deployments: add the same variable in your host&apos;s build environment (Vercel, Netlify,
          etc.).
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {!publishableKey ? (
      <MissingClerkConfig />
    ) : (
      <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    )}
  </StrictMode>,
);
