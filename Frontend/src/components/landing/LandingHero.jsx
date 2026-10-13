import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { AskForm, DocIcon, GavelIcon, PhoneIcon } from './landingShared.jsx';
import LandingHeroField from './LandingHeroField.jsx';

/* Tiles on the field. The left set is what comes in (a question, in any
   script); the right set is what the answer leads to. The fourth of each
   is dropped on narrow screens, where they sit in rows above and below. */
const TILES_IN = [
  { label: 'हि', lang: 'hi', tone: 'saffron' },
  { label: 'த',  lang: 'ta' },
  { label: 'বা', lang: 'bn', tone: 'ink' },
  { label: 'తె', lang: 'te' },
];
const TILES_OUT = [
  { label: '§', tone: 'gold' },
  { icon: <DocIcon size={20} /> },
  { icon: <GavelIcon size={20} />, tone: 'ink' },
  { icon: <PhoneIcon size={19} /> },
];

export default function LandingHero() {
  const cardRef = useRef(null);

  return (
    <section className="lp-hero">
      <LandingHeroField cardRef={cardRef} />

      {[['in', TILES_IN], ['out', TILES_OUT]].map(([side, tiles]) => tiles.map((tile, i) => (
        <span key={side + i} aria-hidden="true" lang={tile.lang}
              className={`lp-tile lp-tile--${side}${i + 1}${tile.tone ? ` lp-tile--${tile.tone}` : ''}`}>
          {tile.icon ?? tile.label}
        </span>
      )))}

      <div ref={cardRef} className="lp-hero__card">
        <p className="lp-hero__kicker anim-fade-in">
          <span className="lp-tag lp-tag--gold">Free</span> No sign-up needed to ask
        </p>
        <h1 className="lp-h1 anim-fade-up">
          Know where you stand.
          <span>Ask in your own language.</span>
        </h1>
        <p className="lp-hero__lead anim-fade-up d-100">
          MySaarthi answers legal questions in plain words and shows the Act
          and section behind every point.
        </p>
        <div className="anim-fade-up d-200">
          <AskForm id="lp-ask-hero" />
        </div>
        <p className="lp-small lp-hero__also anim-fade-up d-300">
          Or start with paperwork:{' '}
          <Link to="/documents" className="lp-link">draft a notice</Link> or{' '}
          <Link to="/analyze" className="lp-link">check a contract</Link>.
        </p>
      </div>
    </section>
  );
}
