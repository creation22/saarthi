import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// Load both data files once at module startup
const dlsaData    = JSON.parse(readFileSync(join(__dir, '../data/dlsa.json'), 'utf-8'));
const lawyersData = JSON.parse(readFileSync(join(__dir, '../data/lawyers_curated.json'), 'utf-8'));
const ALL_ENTRIES = [...dlsaData, ...lawyersData];

const MAX_RESULTS = 100;
const MAX_QUERY_LENGTH = 120;

function safeLower(v) {
  return typeof v === 'string' ? v.toLowerCase() : '';
}

export function searchLawyers(req, res) {
  const { state, district, type, q } = req.query ?? {};

  let results = ALL_ENTRIES;

  if (typeof state === 'string' && state && state !== 'All India') {
    const s = state.toLowerCase();
    results = results.filter(e => safeLower(e.state) === s
                                || e.state === 'All India');
  }

  if (typeof district === 'string' && district) {
    const d = district.toLowerCase();
    results = results.filter(e =>
      safeLower(e.district).includes(d) ||
      e.district === 'All India'
    );
  }

  if (typeof type === 'string' && type) {
    const t = type.toLowerCase();
    results = results.filter(e => safeLower(e.type) === t);
  }

  if (typeof q === 'string' && q) {
    const ql = q.slice(0, MAX_QUERY_LENGTH).toLowerCase();
    results = results.filter(e =>
      safeLower(e.name).includes(ql) ||
      (Array.isArray(e.services) ? e.services : []).some(s => safeLower(s).includes(ql)) ||
      (Array.isArray(e.specialization) ? e.specialization : []).some(s => safeLower(s).includes(ql)) ||
      safeLower(e.state).includes(ql) ||
      safeLower(e.district).includes(ql)
    );
  }

  // Always include the NALSA helpline in results
  const hasHelpline = results.some(e => e?.id === 'nalsa_helpline');
  if (!hasHelpline && !type && !q) {
    const helpline = ALL_ENTRIES.find(e => e?.id === 'nalsa_helpline');
    if (helpline) results = [...results, helpline];
  }

  const capped = results.slice(0, MAX_RESULTS);
  res.json({ results: capped, total: results.length });
}

export function getStates(req, res) {
  const states = [...new Set(ALL_ENTRIES.map(e => e?.state).filter(s => typeof s === 'string'))]
    .filter(s => s !== 'All India')
    .sort();
  res.json({ states: ['All India', ...states] });
}

export function getDistricts(req, res) {
  const { state } = req.query ?? {};
  let entries = typeof state === 'string' && state && state !== 'All India'
    ? ALL_ENTRIES.filter(e => safeLower(e.state) === state.toLowerCase())
    : ALL_ENTRIES;

  const districts = [...new Set(entries.map(e => e?.district).filter(d => typeof d === 'string'))]
    .filter(d => d !== 'All India')
    .sort();
  res.json({ districts });
}
