import { CountUp } from './landingShared.jsx';
import { useLive } from './landingMotion.js';

/* Every figure here is something the app actually ships:
   LanguageSelector.jsx, the Document Wizard's five templates,
   the ten Know Your Rights topics, and Backend/src/data/dlsa.json. */
const STATS = [
  { to: 11, label: 'languages you can ask in' },
  { to: 5,  label: 'kinds of document it drafts' },
  { to: 10, label: 'plain guides to your rights' },
  { to: 46, label: 'legal aid authorities listed' },
];

export default function LandingStats() {
  const [ref, live] = useLive(0.5);

  return (
    <section className="lp-stats" aria-label="MySaarthi in numbers">
      <ul ref={ref} className={`lp-wrap lp-stats__grid${live ? ' is-live' : ''}`}>
        {STATS.map(({ to, label }, i) => (
          <li key={label} className="lp-stat" style={{ '--i': i }}>
            <strong><CountUp to={to} live={live} /></strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
