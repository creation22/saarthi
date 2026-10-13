import { Link } from 'react-router-dom';
import { PhoneIcon, Reveal } from './landingShared.jsx';

/* Thin arcs that sweep in from one corner of the panel */
function Arcs({ className }) {
  return (
    <svg className={className} viewBox="0 0 300 220" fill="none" aria-hidden="true" preserveAspectRatio="none">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M0 ${30 + i * 26} C 110 ${30 + i * 26}, 170 ${120 + i * 16}, 300 ${150 + i * 14}`} />
      ))}
    </svg>
  );
}

/* Directory figures come from Backend/src/data/dlsa.json and lawyers_curated.json.
   Update them here if those files grow. */
export default function LandingLegalAid() {
  return (
    <section id="aid" className="lp-section lp-aid">
      <div className="lp-wrap">
        <Reveal className="lp-dark lp-aid__panel">
          <Arcs className="lp-aid__arcs" />
          <Arcs className="lp-aid__arcs lp-aid__arcs--flip" />

          <div className="lp-aid__copy">
            <h2 className="lp-h2">Free legal aid<span>is your right.</span></h2>
            <p className="lp-lead">
              Every district has a Legal Services Authority that gives eligible people
              a lawyer at no cost. That includes women, children, members of Scheduled
              Castes and Tribes, persons with disabilities, people in custody and
              anyone on a low income.
            </p>
            <p>
              MySaarthi lists 46 District Legal Services Authorities across 32 states
              and union territories, along with 17 legal aid organisations.
            </p>
          </div>

          <div className="lp-aid__call">
            <span className="lp-tag lp-tag--gold">NALSA helpline · toll-free</span>
            <a href="tel:15100" className="lp-aid__number" aria-label="Call 15100, the NALSA legal aid helpline">15100</a>
            <p className="lp-small">From anywhere in India. Run by the National Legal Services Authority.</p>
            <div className="lp-aid__actions">
              <a href="tel:15100" className="lp-btn lp-btn--primary lp-btn--arrow"><PhoneIcon size={17} />Call 15100</a>
              <Link to="/lawyers" className="lp-link">Find legal aid near you</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
