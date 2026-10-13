import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, Reveal } from './landingShared.jsx';
import { AskDemo, ContractDemo, DraftDemo, MatterDemo, RightsDemo, TrackDemo } from './LandingDemos.jsx';

const TOOLS = [
  {
    id: 'ask', tone: 'saffron', to: '/chat', open: 'Open the chat', demo: <AskDemo />,
    title: 'Ask a question',
    body: 'Type it, or tap the mic and say it. The answer cites the Act and section.',
  },
  {
    id: 'draft', tone: 'gold', to: '/documents', open: 'Start a draft', demo: <DraftDemo />,
    title: 'Draft a document',
    body: 'FIR draft, consumer complaint, legal notice, RTI application or demand notice, as PDF or Word.',
  },
  {
    id: 'check', tone: 'rose', to: '/analyze', open: 'Upload a contract', demo: <ContractDemo />,
    title: 'Check a contract',
    body: 'Red flags, missing clauses and a risk score for a rent agreement or offer letter.',
  },
  {
    id: 'track', tone: 'saffron', to: '/tracker', open: 'Track a case', demo: <TrackDemo />,
    title: 'Track a court case',
    body: 'Status, past hearings and next date from your CNR number. Needs a free account.',
  },
  {
    id: 'rights', tone: 'green', to: '/rights', open: 'Read the guides', demo: <RightsDemo />,
    title: 'Read up on your rights',
    body: 'Ten short guides, from tenancy and wages to RTI and cyber crime.',
  },
  {
    id: 'matter', tone: 'gold', to: '/dashboard', open: 'Open your dashboard', demo: <MatterDemo />,
    title: 'Keep one dispute together',
    body: 'Chats, documents and cases for one matter in a single folder. Needs a free account.',
  },
];

export default function LandingTools() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const tool = TOOLS[active];

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowDown' ? 1 : TOOLS.length - 1)) % TOOLS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="tools" className="lp-section lp-features">
      <div className="lp-wrap">
        <Reveal className="lp-section__head">
          <h2 className="lp-h2">Six tools, built for<span>the problem in front of you.</span></h2>
        </Reveal>
      </div>

      {/* The timer bar under the active row drives the rotation: when its animation ends the
          next tool shows. Hovering or focusing anywhere in the block pauses the bar, and with
          it the rotation; with reduced motion the bar never runs, so nothing moves by itself. */}
      <div className="lp-rails">
        <div className={`lp-wrap lp-ft lp-ft--${tool.tone}`}>
          <div className="lp-ft__list" role="tablist" aria-orientation="vertical"
               aria-label="What you can do" onKeyDown={onKeyDown}>
            {TOOLS.map((t, i) => (
              <button key={t.id} type="button" role="tab" id={`lp-ft-${t.id}`}
                      ref={(el) => { tabRefs.current[i] = el; }}
                      className="lp-ft__tab" aria-selected={i === active} aria-controls="lp-ft-panel"
                      tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}>
                <span className="lp-ft__title">{t.title}</span>
                {i === active && (
                  <>
                    <span className="lp-ft__body">{t.body}</span>
                    <span className="lp-ft__timer" onAnimationEnd={() => setActive((active + 1) % TOOLS.length)} />
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="lp-ft__panel" role="tabpanel" id="lp-ft-panel" aria-labelledby={`lp-ft-${tool.id}`}>
            <div key={tool.id} className="lp-ft__stage">{tool.demo}</div>
            <Link to={tool.to} className="lp-btn lp-btn--primary lp-btn--arrow lp-ft__open">
              <Arrow size={18} />{tool.open}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
