import { Reveal } from './landingShared.jsx';
import { useLive } from './landingMotion.js';

/* Three stops along one rising line. `x`/`y` place a stop on the chart
   as a percentage of its box, matching the curve drawn below. */
const STEPS = [
  { tone: 'rose',    x: 24, y: 71, label: 'You ask',
    title: 'Ask in your own words',
    body: 'Type or speak. Hindi, Tamil, Bengali, English and seven more languages are understood.' },
  { tone: 'saffron', x: 55, y: 46, label: 'It looks up the law',
    title: 'MySaarthi looks up the law',
    body: 'It searches the text of Indian law for the sections that match your situation.' },
  { tone: 'gold',    x: 82, y: 20, label: 'You get a cited answer',
    title: 'Get an answer you can check',
    body: 'Plain steps to take, each with its Act and section so you can verify it yourself.' },
];

export default function LandingHowItWorks() {
  const [ref, live] = useLive(0.3);

  return (
    <section id="how" className="lp-section lp-how">
      <div className="lp-wrap">
        <Reveal className="lp-section__head">
          <h2 className="lp-h2">From your question<span>to a cited answer.</span></h2>
        </Reveal>

        <ol className="lp-how__steps">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className={`lp-tag lp-tag--${step.tone}`}>0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Decoration: the same three stops as a climb across a dot field */}
      <div ref={ref} className={`lp-chart${live ? ' is-live' : ''}`} aria-hidden="true">
        <div className="lp-chart__field" />
        <svg className="lp-chart__line" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
          <path d="M0 86 C8 86 12 80 17 79 S21 73 24 71 S33 66 38 62 S47 50 55 46 S64 42 69 34 S77 24 82 20 S92 9 100 4" />
        </svg>
        {STEPS.map((step, i) => (
          <div key={step.label} className="lp-chart__stop" style={{ '--x': `${step.x}%`, '--y': `${step.y}%`, '--i': i }}>
            <span className={`lp-tag lp-tag--${step.tone}`}>0{i + 1} · Step</span>
            <strong>{step.label}</strong>
            <i />
          </div>
        ))}
      </div>
    </section>
  );
}
