import { Link } from 'react-router-dom';
import { ArrowOut, Reveal } from './landingShared.jsx';

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
      { label: 'Find legal aid', to: '/lawyers'   },
    ],
  },
];

/* Closing call and footer in one band, ending on the name set as large as the page allows */
export default function LandingCTA() {
  return (
    <footer className="lp-footer">
      <div className="lp-wrap">
        <div className="lp-footer__top">
          <Reveal className="lp-footer__cta">
            <h2 className="lp-h2">Start with<span>your question.</span></h2>
            <Link to="/chat" className="lp-btn lp-btn--primary lp-btn--arrow"><ArrowOut size={18} />Ask a question</Link>
          </Reveal>

          {FOOTER_LINKS.map(({ heading, links }) => (
            <nav key={heading} aria-label={heading} className="lp-footer__col">
              <h3 className="lp-tag">{heading}</h3>
              <ul>
                {links.map(({ label, to }) => (
                  <li key={label}><Link to={to}>{label}<ArrowOut size={18} /></Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="lp-footer__mark" aria-hidden="true">My<span>Saarthi</span></p>

        <div className="lp-footer__legal">
          <p>© {new Date().getFullYear()} MySaarthi. General legal information only. It is not a substitute for advice from a qualified lawyer.</p>
          <a href="tel:15100">NALSA legal aid helpline: 15100</a>
        </div>
      </div>
    </footer>
  );
}
