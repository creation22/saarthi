import { MicIcon, Reveal } from './landingShared.jsx';

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

export default function LandingLanguages() {
  return (
    <section id="languages" className="lp-section lp-languages">
      <div className="lp-wrap">
        <Reveal className="lp-section__head">
          <h2 className="lp-h2">Ask in the language<span>you think in.</span></h2>
          <p className="lp-lead">
            Type or speak your question in any of these eleven. MySaarthi understands
            it and answers in plain English.
          </p>
        </Reveal>
      </div>

      <div className="lp-rails">
        <ul className="lp-wrap lp-langs">
          {LANGUAGES.map(({ code, native, name }, i) => (
            <li key={code} style={{ '--i': i }}>
              <span className="lp-lang__native" lang={code}>{native}</span>
              <span className="lp-tag">{name}</span>
            </li>
          ))}
          <li className="lp-langs__voice">
            <span className="lp-lang__mic"><MicIcon size={22} /></span>
            <span className="lp-tag lp-tag--saffron">Type or speak</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
