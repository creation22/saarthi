import { Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import LandingNav         from '../components/landing/LandingNav.jsx';
import LandingHero        from '../components/landing/LandingHero.jsx';
import LandingStats       from '../components/landing/LandingStats.jsx';
import LandingTools       from '../components/landing/LandingTools.jsx';
import LandingSources     from '../components/landing/LandingSources.jsx';
import LandingHowItWorks  from '../components/landing/LandingHowItWorks.jsx';
import LandingLanguages   from '../components/landing/LandingLanguages.jsx';
import LandingLegalAid    from '../components/landing/LandingLegalAid.jsx';
import LandingFAQ         from '../components/landing/LandingFAQ.jsx';
import LandingCTA         from '../components/landing/LandingCTA.jsx';
import '../components/landing/landing.css';

export default function Landing() {
  return (
    // reducedMotion="user": people who ask for less motion get fades, with nothing sliding
    <MotionConfig reducedMotion="user">
      <div className="lp">
        <a href="#main" className="lp-skip">Skip to content</a>

        <p className="lp-announce">
          <span className="lp-tag lp-tag--gold">Free</span>
          Legal answers that cite the Act and section.
          <Link to="/chat">Ask now</Link>
        </p>

        <LandingNav
          navItems={[
            { label: 'Tools',        href: '#tools' },
            { label: 'Sources',      href: '#sources' },
            { label: 'How it works', href: '#how'   },
            { label: 'Legal aid',    href: '#aid'   },
            { label: 'Questions',    href: '#faq'   },
          ]}
        />

        <main id="main">
          <LandingHero />
          <LandingStats />
          <LandingTools />
          <LandingSources />
          <LandingHowItWorks />
          <LandingLanguages />
          <LandingLegalAid />
          <LandingFAQ />
        </main>

        <LandingCTA />
      </div>
    </MotionConfig>
  );
}
