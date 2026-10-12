import { Link } from 'react-router-dom';
import { PhoneIcon, Reveal, Wheel } from './landingShared.jsx';

/* Directory figures come from Backend/src/data/dlsa.json and lawyers_curated.json.
   Update them here if those files grow. */
export default function LandingLegalAid() {
  return (
    <section id="aid" className="lp-section lp-aid">
      <Wheel className="lp-aid__wheel" />

      <div className="lp-wrap lp-aid__grid">
        <Reveal className="lp-aid__copy">
          <h2 className="lp-h2">Free legal aid is your right.</h2>
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
          <Link to="/lawyers" className="lp-btn lp-btn--line">Find legal aid near you</Link>
        </Reveal>

        <Reveal className="lp-aid__call" delay={0.1}>
          <span className="lp-ring" aria-hidden="true">
            <i /><i /><i />
            <span className="lp-ring__phone"><PhoneIcon size={24} /></span>
          </span>
          <a href="tel:15100" className="lp-aid__number" aria-label="Call 15100, the NALSA legal aid helpline">15100</a>
          <p className="lp-aid__call-label">NALSA legal aid helpline</p>
          <p className="lp-small">Toll-free from anywhere in India. Run by the National Legal Services Authority.</p>
        </Reveal>
      </div>
    </section>
  );
}
