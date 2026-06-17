import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// Load both data files once at module startup
const dlsaData    = JSON.parse(readFileSync(join(__dir, '../data/dlsa.json'), 'utf-8'));
const lawyersData = JSON.parse(readFileSync(join(__dir, '../data/lawyers_curated.json'), 'utf-8'));
const ALL_ENTRIES = [...dlsaData, ...lawyersData];

export function searchLawyers(req, res) {
  const { state, district, type, q } = req.query;

  let results = ALL_ENTRIES;

  if (state && state !== 'All India') {
    results = results.filter(e => e.state.toLowerCase() === state.toLowerCase()
                                || e.state === 'All India');
  }

  if (district) {
    results = results.filter(e =>
      e.district.toLowerCase().includes(district.toLowerCase()) ||
      e.district === 'All India'
    );
  }

  if (type) {
    results = results.filter(e => e.type.toLowerCase() === type.toLowerCase());
  }

  if (q) {
    const ql = q.toLowerCase();
    results = results.filter(e =>
      e.name.toLowerCase().includes(ql) ||
      (e.services || []).some(s => s.toLowerCase().includes(ql)) ||
      (e.specialization || []).some(s => s.toLowerCase().includes(ql)) ||
      e.state.toLowerCase().includes(ql) ||
      e.district.toLowerCase().includes(ql)
    );
  }

  // Always include the NALSA helpline in results
  const hasHelpline = results.some(e => e.id === 'nalsa_helpline');
  if (!hasHelpline && !type && !q) {
    const helpline = ALL_ENTRIES.find(e => e.id === 'nalsa_helpline');
    if (helpline) results = [...results, helpline];
  }

  res.json({ results, total: results.length });
}

export function getStates(req, res) {
  const states = [...new Set(ALL_ENTRIES.map(e => e.state))]
    .filter(s => s !== 'All India')
    .sort();
  res.json({ states: ['All India', ...states] });
}

export function getDistricts(req, res) {
  const { state } = req.query;
  let entries = state && state !== 'All India'
    ? ALL_ENTRIES.filter(e => e.state.toLowerCase() === state.toLowerCase())
    : ALL_ENTRIES;

  const districts = [...new Set(entries.map(e => e.district))]
    .filter(d => d !== 'All India')
    .sort();
  res.json({ districts });
}
