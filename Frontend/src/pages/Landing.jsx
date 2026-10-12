import { MotionConfig } from 'framer-motion';
import { ResizableNavbar } from '../components/ResizableNavbar.jsx';
import LandingHero        from '../components/landing/LandingHero.jsx';
import LandingStats       from '../components/landing/LandingStats.jsx';
import LandingTools       from '../components/landing/LandingTools.jsx';
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

        <ResizableNavbar
          navItems={[
            { label: 'What you can do', href: '#tools' },
            { label: 'How it works',    href: '#how'   },
            { label: 'Free legal aid',  href: '#aid'   },
            { label: 'Questions',       href: '#faq'   },
          ]}
          ctaLabel="Ask a question"
          ctaTo="/chat"
        />

        <main id="main">
          <LandingHero />
          <LandingStats />
          <LandingTools />
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
