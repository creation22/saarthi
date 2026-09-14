import { ResizableNavbar } from '../components/ResizableNavbar.jsx';
import LandingHero        from '../components/landing/LandingHero.jsx';
import LandingTicker      from '../components/landing/LandingTicker.jsx';
import LandingFeatures    from '../components/landing/LandingFeatures.jsx';
import LandingChatDemo    from '../components/landing/LandingChatDemo.jsx';
import LandingHowItWorks  from '../components/landing/LandingHowItWorks.jsx';
import LandingNewFeatures from '../components/landing/LandingNewFeatures.jsx';
import LandingLanguages   from '../components/landing/LandingLanguages.jsx';
import LandingStats       from '../components/landing/LandingStats.jsx';
import LandingComparison  from '../components/landing/LandingComparison.jsx';
import LandingFAQ         from '../components/landing/LandingFAQ.jsx';
import LandingCTA         from '../components/landing/LandingCTA.jsx';

export default function Landing() {
  return (
    <div style={{ background: '#F6F1E9',
                  fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>

      <ResizableNavbar
        navItems={[
          { label: 'Features',      href: '#features'  },
          { label: 'How It Works',  href: '#how'       },
          { label: 'What\'s New',   href: '#new'       },
          { label: 'Find a Lawyer', href: '/lawyers'   },
        ]}
        ctaLabel="Get Started"
        ctaTo="/chat"
      />

      <LandingHero />
      <LandingChatDemo />
      <LandingTicker />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingNewFeatures />
      <LandingLanguages />
      <LandingStats />
      <LandingComparison />
      <LandingFAQ />
      <LandingCTA />

    </div>
  );
}
