import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { Reveal } from './landingShared.jsx';
import { useLive } from './landingMotion.js';

/* ─── Example answers ───────────────────────────────────────────
   Each point pairs a plain statement with the provision it rests on.
   `mark` is the phrase that provision supports. The third question is
   in Hindi with an English answer because that is what the chat does:
   it understands 11 languages and replies in English. */
const EXAMPLES = [
  {
    id: 'consumer',
    tab: 'Faulty product',
    lang: 'en',
    q: 'The shop refuses to replace a fridge that stopped working within a month. What can I do?',
    points: [
      { text: ['You can ', { mark: 'file a complaint with the District Consumer Commission' }, ', including the one for the area where you live.'],
        section: 'Sections 34 and 35', act: 'Consumer Protection Act, 2019' },
      { text: ['The Commission can order the seller to ', { mark: 'replace the fridge or refund the price' }, ', and to pay compensation for your loss.'],
        section: 'Section 39(1)', act: 'Consumer Protection Act, 2019' },
      { text: ['File ', { mark: 'within two years' }, ' of the day the problem arose.'],
        section: 'Section 69(1)', act: 'Consumer Protection Act, 2019' },
    ],
  },
  {
    id: 'rti',
    tab: 'RTI request',
    lang: 'en',
    q: 'My ration card application has been pending for months. How do I find out why?',
    points: [
      { text: ['Send a written request, with the fee, to the Public Information Officer of the department. ', { mark: 'You do not have to give a reason' }, ' for asking.'],
        section: 'Section 6(1) and 6(2)', act: 'Right to Information Act, 2005' },
      { text: ['The officer must ', { mark: 'reply within 30 days' }, ' of receiving your request.'],
        section: 'Section 7(1)', act: 'Right to Information Act, 2005' },
      { text: ['If you get no reply, or a refusal, you can ', { mark: 'appeal to the senior officer' }, ' within 30 days.'],
        section: 'Section 19(1)', act: 'Right to Information Act, 2005' },
    ],
  },
  {
    id: 'arrest',
    tab: 'Arrest',
    lang: 'hi',
    q: 'पुलिस ने मेरे भाई को गिरफ़्तार कर लिया है। उसके क्या अधिकार हैं?',
    points: [
      { text: ['The police must ', { mark: 'tell him the reason for the arrest' }, ' as soon as possible.'],
        section: 'Article 22(1)', act: 'Constitution of India' },
      { text: ['He can ', { mark: 'consult a lawyer of his own choice' }, ' and have that lawyer defend him.'],
        section: 'Article 22(1)', act: 'Constitution of India' },
      { text: ['He must be brought ', { mark: 'before a magistrate within 24 hours' }, ', not counting the travel time to court.'],
        section: 'Article 22(2)', act: 'Constitution of India' },
    ],
  },
];

/* ─── One example ─────────────────────────────────────────────── */
function SheetPanel({ example, writeIn, started }) {
  const { q, points } = example;
  const [typed, setTyped] = useState(writeIn ? 0 : q.length);
  const [shown, setShown] = useState(writeIn ? 0 : points.length);

  // First viewing: the question is typed, then each point lands with its citation.
  useEffect(() => {
    if (!writeIn || !started) return;
    const timers = [];
    let typing;
    timers.push(setTimeout(() => {
      let n = 0;
      typing = setInterval(() => {
        n = Math.min(n + 2, q.length);
        setTyped(n);
        if (n < q.length) return;
        clearInterval(typing);
        points.forEach((_, i) => timers.push(setTimeout(() => setShown(i + 1), 260 + i * 420)));
      }, 30);
    }, 350));
    return () => { timers.forEach(clearTimeout); clearInterval(typing); };
  }, [writeIn, started, q, points]);

  return (
    <div className={writeIn ? undefined : 'lp-sheet__panel--swap'}
         role="tabpanel" id="lp-example-panel" aria-labelledby={`lp-tab-${example.id}`}>
      {/* The untyped part stays in the flow, invisible, so the sheet never changes height */}
      <p className="lp-sheet__q" lang={example.lang}>
        {q.slice(0, typed)}
        {typed < q.length && <span className="lp-caret" aria-hidden="true" />}
        <span className="lp-ghost">{q.slice(typed)}</span>
      </p>
      <ul className="lp-points">
        {points.map((point, i) => (
          <li key={point.section + i} className={`lp-point${i < shown ? ' is-in' : ''}`}>
            <p>
              {point.text.map((part, j) => (typeof part === 'string'
                ? part
                : <mark key={j} className="lp-mark">{part.mark}</mark>))}
            </p>
            <cite className="lp-cite">{point.section}<span>{point.act}</span></cite>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Example answer sheet ────────────────────────────────────── */
function AnswerSheet() {
  const reduceMotion = useReducedMotion();
  const [ref, live] = useLive(0.3);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const tabRefs = useRef([]);

  const select = (i) => { setTouched(true); setActive(i); };
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : EXAMPLES.length - 1)) % EXAMPLES.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <figure ref={ref} className="lp-sheet">
      <div className="lp-sheet__head">
        <div className="lp-tabs" role="tablist" aria-label="Example questions" onKeyDown={onKeyDown}>
          {EXAMPLES.map((ex, i) => (
            <button key={ex.id} type="button" role="tab" id={`lp-tab-${ex.id}`}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    className="lp-tab"
                    aria-selected={i === active} aria-controls="lp-example-panel"
                    tabIndex={i === active ? 0 : -1}
                    onClick={() => select(i)}>
              {ex.tab}
            </button>
          ))}
        </div>
        <figcaption className="lp-tag">Example answer</figcaption>
      </div>

      <SheetPanel key={EXAMPLES[active].id} example={EXAMPLES[active]}
                  writeIn={!touched && !reduceMotion} started={live} />

      <p className="lp-small lp-sheet__foot">
        Shown as an illustration. MySaarthi gives legal information, not legal advice.
      </p>
    </figure>
  );
}

/* ─── Dark band ───────────────────────────────────────────────── */
export default function LandingSources() {
  return (
    <section id="sources" className="lp-section lp-dark lp-sources">
      <div className="lp-wrap lp-sources__grid">
        <Reveal className="lp-sources__copy">
          <h2 className="lp-h2">Answers that show<span>their sources.</span></h2>
          <p className="lp-lead">
            Each point in an answer comes with the Act and section it rests on,
            so you can check it yourself or take it to a lawyer.
          </p>
          <Link to="/chat" className="lp-link">Ask your own question</Link>
        </Reveal>

        <div className="lp-sources__stage">
          <span className="lp-tag lp-tag--saffron lp-sources__in" aria-hidden="true">Your question · any of 11 languages</span>
          <AnswerSheet />
        </div>
      </div>
    </section>
  );
}
