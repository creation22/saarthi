import { Link } from 'react-router-dom';
import { Arrow, Reveal } from './landingShared.jsx';
import { AskDemo, ContractDemo, DraftDemo, MatterDemo, RightsDemo, TrackDemo } from './LandingDemos.jsx';

const TOOLS = [
  {
    to: '/chat', size: 'wide', demo: <AskDemo />,
    title: 'Ask a question',
    body: 'Type it, or tap the mic and say it in your own language. The answer comes in plain words with the Act and section beside each point.',
  },
  {
    to: '/documents', demo: <DraftDemo />,
    title: 'Draft a document',
    body: 'Answer a few questions and download an FIR draft, consumer complaint, legal notice, RTI application or demand notice.',
  },
  {
    to: '/analyze', demo: <ContractDemo />,
    title: 'Check a contract',
    body: 'Upload a rent agreement or offer letter. You get the red flags, the missing clauses and a risk score.',
  },
  {
    to: '/tracker', demo: <TrackDemo />,
    title: 'Track a court case',
    body: 'Enter the CNR number from your court notice to see the status, past hearings and next date.',
    note: 'Needs a free account',
  },
  {
    to: '/rights', demo: <RightsDemo />,
    title: 'Read up on your rights',
    body: 'Ten short guides, from tenancy and consumer rights to wages, RTI and cyber crime.',
  },
  {
    to: '/dashboard', size: 'row', demo: <MatterDemo />,
    title: 'Keep one dispute together',
    body: 'Put the chats, documents and cases for a single matter in one folder, with your own notes and a status you control.',
    note: 'Needs a free account',
  },
];

export default function LandingTools() {
  return (
    <section id="tools" className="lp-section">
      <div className="lp-wrap">
        <Reveal className="lp-section__head">
          <h2 className="lp-h2">Six things you can do here.</h2>
          <p className="lp-lead">All of them are free. Four work without an account.</p>
        </Reveal>

        <ul className="lp-bento">
          {TOOLS.map(({ to, size, demo, title, body, note }, i) => (
            <Reveal as="li" key={to} delay={(i % 3) * 0.07}
                    className={`lp-bento__cell${size ? ` lp-bento__cell--${size}` : ''}`}>
              <Link to={to} className="lp-card">
                <div className="lp-card__stage">{demo}</div>
                <div className="lp-card__text">
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <span className="lp-card__foot">
                    {note && <span className="lp-small">{note}</span>}
                    <Arrow className="lp-card__arrow" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
