import { Reveal } from './landingShared.jsx';

/* Same eleven as the chat's language selector (components/LanguageSelector.jsx) */
const LANGUAGES = [
  { code: 'hi', native: 'हिन्दी',   name: 'Hindi'     },
  { code: 'bn', native: 'বাংলা',    name: 'Bengali'   },
  { code: 'ta', native: 'தமிழ்',    name: 'Tamil'     },
  { code: 'te', native: 'తెలుగు',   name: 'Telugu'    },
  { code: 'mr', native: 'मराठी',    name: 'Marathi'   },
  { code: 'gu', native: 'ગુજરાતી',  name: 'Gujarati'  },
  { code: 'kn', native: 'ಕನ್ನಡ',    name: 'Kannada'   },
  { code: 'ml', native: 'മലയാളം',   name: 'Malayalam' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ',   name: 'Punjabi'   },
  { code: 'or', native: 'ଓଡ଼ିଆ',    name: 'Odia'      },
  { code: 'en', native: 'English',  name: 'English'   },
];

/* One moving row. The list is laid out four times and the track slides by one
   copy, so the loop has no seam even on a very wide screen. The copies are
   hidden from screen readers. */
function Row({ items, reverse }) {
  return (
    <div className={`lp-marquee${reverse ? ' lp-marquee--reverse' : ''}`}>
      <div className="lp-marquee__track">
        {[0, 1, 2, 3].map((copy) => (
          <ul key={copy} aria-hidden={copy > 0 || undefined}>
            {items.map(({ code, native, name }) => (
              <li key={code}>
                <span className="lp-lang__native" lang={code}>{native}</span>
                {code !== 'en' && <span className="lp-small lp-lang__name">{name}</span>}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function LandingLanguages() {
  return (
    <section id="languages" className="lp-section lp-languages">
      <div className="lp-wrap">
        <Reveal className="lp-section__head">
          <h2 className="lp-h2">Ask in the language you think in.</h2>
          <p className="lp-lead">
            Type or speak your question in any of these eleven. MySaarthi understands
            it and answers in plain English.
          </p>
        </Reveal>
      </div>

      <Row items={LANGUAGES.slice(0, 6)} />
      <Row items={LANGUAGES.slice(6)} reverse />
    </section>
  );
}
