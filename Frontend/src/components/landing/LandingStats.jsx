import { CountUp } from './landingShared.jsx';
import { useLive } from './landingMotion.js';

/* Every figure here is something the app actually ships:
   LanguageSelector.jsx, the Document Wizard's five templates,
   the ten Know Your Rights topics, and Backend/src/data/dlsa.json. */
const STATS = [
  { to: 11, label: 'Languages you can ask in' },
  { to: 5,  label: 'Kinds of document it drafts' },
  { to: 10, label: 'Plain guides to your rights' },
  { to: 46, label: 'Legal aid authorities listed' },
];

export default function LandingStats() {
  const [ref, live] = useLive(0.5);

  return (
    <section className="lp-stats lp-rails" aria-label="MySaarthi in numbers">
      <ul ref={ref} className="lp-wrap lp-stats__grid">
        {STATS.map(({ to, label }) => (
          <li key={label} className="lp-stat">
            <strong><CountUp to={to} live={live} /></strong>
            <span className="lp-tag">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
