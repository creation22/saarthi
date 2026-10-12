/**
 * One-time helper: map VITE_* / legacy keys → API_URL, CLERK_* in .env files.
 * Usage: node scripts/migrate-env-keys.js
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';

function parse(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const merged = { ...parse('.env'), ...parse('.env.local') };
const apiUrl = merged.API_URL || merged.VITE_API_URL || 'http://localhost:5000/api';
const publishable =
  merged.CLERK_PUBLISHABLE_KEY || merged.VITE_CLERK_PUBLISHABLE_KEY || '';
const secret = merged.CLERK_SECRET_KEY || '';

const envContent = `# =============================================================================
# Legal Sahayak — Frontend (local, gitignored)
# =============================================================================

# --- Backend API ---
API_URL=${apiUrl}

# --- Clerk (https://dashboard.clerk.com) ---
CLERK_PUBLISHABLE_KEY=${publishable}
CLERK_SECRET_KEY=${secret}
`;

writeFileSync('.env', envContent);

const localContent = `# Clerk CLI / local overrides (gitignored). Prefer CLERK_* names on Vercel.

API_URL=${apiUrl}
CLERK_PUBLISHABLE_KEY=${publishable}
CLERK_SECRET_KEY=${secret}
`;

writeFileSync('.env.local', localContent);
console.log('Wrote .env and .env.local with API_URL + CLERK_* keys.');
