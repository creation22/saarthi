import { Link } from 'react-router-dom';
import { AskForm, CheckIcon, Reveal, Wheel } from './landingShared.jsx';

const PROMISES = ['Free to use', 'No sign-up to ask', 'Sources on every answer'];

const FOOTER_LINKS = [
  {
    heading: 'Tools',
    links: [
      { label: 'Ask a question',   to: '/chat'      },
      { label: 'Know your rights', to: '/rights'    },
      { label: 'Draft a document', to: '/documents' },
      { label: 'Check a contract', to: '/analyze'   },
    ],
  },
  {
    heading: 'Your account',
    links: [
      { label: 'Sign in',        to: '/login'     },
      { label: 'Track a case',   to: '/tracker'   },
      { label: 'Your matters',   to: '/dashboard' },
      { label: 'Chat history',   to: '/history'   },
    ],
  },
  {
    heading: 'Legal aid',
    links: [
      { label: 'Find legal aid near you', to: '/lawyers' },
      { label: 'Call NALSA on 15100',     href: 'tel:15100' },
    ],
  },
];

export default function LandingCTA() {
  return (
    <>
      {/* ── Closing ───────────────────────────────────────────── */}
      <section className="lp-section lp-close">
        <Reveal className="lp-wrap">
          {/* The outer box is a moving gold edge; the panel sits 1.5px inside it */}
          <div className="lp-panel">
            <div className="lp-panel__inner">
              <Wheel className="lp-panel__wheel" />
              <h2 className="lp-h2">Start with your question.</h2>
              <AskForm id="lp-ask-close" />
              <ul className="lp-panel__promises">
                {PROMISES.map((promise) => (
                  <li key={promise}>
                    <span className="lp-chip__ok"><CheckIcon size={13} strokeWidth="2.6" /></span>
                    {promise}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer__grid">
            <div className="lp-footer__brand">
              <Link to="/" className="lp-footer__name">My<span>Saarthi</span></Link>
              <p>Legal information for people in India, with the Act and section behind every answer.</p>
            </div>

            {FOOTER_LINKS.map(({ heading, links }) => (
              <nav key={heading} aria-label={heading}>
                <h3>{heading}</h3>
                <ul>
                  {links.map(({ label, to, href }) => (
                    <li key={label}>
                      {href ? <a href={href}>{label}</a> : <Link to={to}>{label}</Link>}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <p className="lp-small lp-footer__legal">
            © {new Date().getFullYear()} MySaarthi. General legal information only. It is not a
            substitute for advice from a qualified lawyer.
          </p>
        </div>
      </footer>
    </>
  );
}
