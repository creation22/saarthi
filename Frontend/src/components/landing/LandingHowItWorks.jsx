import { Reveal } from './landingShared.jsx';
import { useLive } from './landingMotion.js';

/* ─── Step drawings ───────────────────────────────────────────────
   Line art on a 160×104 grid. Strokes marked .lp-draw trace themselves
   when the row comes into view; --i orders them. */
function SpeakArt() {
  return (
    <svg viewBox="0 0 160 104" fill="none">
      <path className="lp-draw lp-art__ink" pathLength="1" style={{ '--i': 0 }}
            d="M22 14h92a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10H62L44 86V70H22a10 10 0 0 1-10-10V24a10 10 0 0 1 10-10z" />
      <text className="lp-art__glyph" x="34" y="51" style={{ '--i': 4 }}>क</text>
      <text className="lp-art__glyph lp-art__glyph--latin" x="60" y="51" style={{ '--i': 5 }}>A</text>
      <text className="lp-art__glyph" x="84" y="51" style={{ '--i': 6 }}>த</text>
      <g className="lp-art__accent">
        <path className="lp-draw" pathLength="1" style={{ '--i': 8 }}  d="M134 32a14 14 0 0 1 0 20" />
        <path className="lp-draw" pathLength="1" style={{ '--i': 9 }}  d="M141 25a24 24 0 0 1 0 34" />
        <path className="lp-draw" pathLength="1" style={{ '--i': 10 }} d="M148 18a34 34 0 0 1 0 48" />
      </g>
    </svg>
  );
}

function SearchArt() {
  return (
    <svg viewBox="0 0 160 104" fill="none">
      <path className="lp-draw lp-art__ink" pathLength="1" style={{ '--i': 0 }}
            d="M80 22C66 14 46 12 26 16v66c20-4 40-2 54 6 14-8 34-10 54-6V16c-20-4-40-2-54 6zM80 22v66" />
      <g className="lp-art__lines">
        <path d="M36 32h32M36 44h32M36 68h26M92 32h32M92 56h32M92 68h22" />
      </g>
      <rect className="lp-art__hit" x="90" y="39" width="36" height="9" rx="2" style={{ '--i': 6 }} />
      <rect className="lp-art__hit" x="34" y="51" width="30" height="9" rx="2" style={{ '--i': 8 }} />
      <g className="lp-art__lens">
        <circle className="lp-art__accent" cx="104" cy="44" r="15" />
        <path className="lp-art__accent" d="m115 55 12 12" />
      </g>
    </svg>
  );
}

function AnswerArt() {
  return (
    <svg viewBox="0 0 160 104" fill="none">
      <rect className="lp-draw lp-art__ink" pathLength="1" style={{ '--i': 0 }} x="18" y="10" width="124" height="84" rx="6" />
      <path className="lp-art__margin" d="M104 10v84" />
      <g className="lp-art__lines">
        <path d="M50 30h44M50 52h38M50 74h44M112 30h20M112 52h16M112 74h20" />
      </g>
      {[30, 52, 74].map((y, i) => (
        <g key={y}>
          <circle className="lp-art__tick-bg" cx="34" cy={y} r="7.5" style={{ '--i': 4 + i * 2 }} />
          <path className="lp-draw lp-art__tick" pathLength="1" style={{ '--i': 5 + i * 2 }}
                d={`m30.5 ${y + 0.5} 2.5 2.5 4.5-5`} />
        </g>
      ))}
    </svg>
  );
}

const STEPS = [
  {
    art: <SpeakArt />,
    title: 'Ask in your own words',
    body: 'Type or speak. Hindi, Tamil, Bengali, English and seven more languages are understood.',
  },
  {
    art: <SearchArt />,
    title: 'MySaarthi looks up the law',
    body: 'It searches the text of Indian Acts for the sections that match your situation.',
  },
  {
    art: <AnswerArt />,
    title: 'Get an answer you can check',
    body: 'You get plain steps to take, each with its Act and section so you can verify it yourself.',
  },
];

export default function LandingHowItWorks() {
  const [ref, live] = useLive(0.3);

  return (
    <section id="how" className="lp-section lp-section--band">
      <div className="lp-wrap">
        <Reveal className="lp-section__head">
          <h2 className="lp-h2">From question to cited answer.</h2>
        </Reveal>

        <ol ref={ref} className={`lp-steps${live ? ' is-live' : ''}`}>
          {STEPS.map(({ art, title, body }, i) => (
            <li key={title} className="lp-step" style={{ '--step': i }}>
              <div className="lp-step__art" aria-hidden="true">{art}</div>
              <span className="lp-step__n" aria-hidden="true">{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
