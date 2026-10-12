/**
 * Small animated previews for the tool cards. Each one is decoration
 * (aria-hidden): the card's title and text carry the meaning.
 *
 * A demo root gets .is-live the first time it is on screen and the
 * stylesheet plays the sequence from there, ordered by --i.
 */
import {
  BagIcon, CaseIcon, ChatIcon, CountUp, DocIcon, DownIcon, GavelIcon, HomeIcon, MicIcon,
} from './landingShared.jsx';
import { useLive } from './landingMotion.js';

function Demo({ name, children }) {
  const [ref, live] = useLive();
  return (
    <div ref={ref} className={`lp-demo lp-demo--${name}${live ? ' is-live' : ''}`} aria-hidden="true">
      {typeof children === 'function' ? children(live) : children}
    </div>
  );
}

const line = (w, i, mod = '') => (
  <span className={`lp-d-line${mod ? ` lp-d-line--${mod}` : ''}`} style={{ '--w': `${w}%`, '--i': i }} />
);

/* ─── Ask: a spoken question, a cited answer ──────────────────── */
// Heights of the sound bars, as a fraction of the row
const WAVE = [0.4, 0.75, 1, 0.6, 0.85, 0.45, 0.7, 0.95, 0.5, 0.8, 0.4, 0.65, 0.9, 0.55, 0.75, 0.35,
              0.6, 1, 0.7, 0.45, 0.85, 0.5, 0.95, 0.6, 0.4, 0.8, 0.55, 0.7, 0.35, 0.6];
const PICKER = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'en', label: 'English' },
];

export function AskDemo() {
  return (
    <Demo name="ask">
      <div className="lp-d-chat">
        <p className="lp-d-bubble lp-d-bubble--user" lang="hi" style={{ '--i': 0 }}>
          मेरे मकान मालिक ने किराया बढ़ा दिया, क्या यह सही है?
        </p>
        <div className="lp-d-bubble lp-d-bubble--bot" style={{ '--i': 3 }}>
          {line(94, 5)}
          {line(80, 6, 'mark')}
          {line(58, 7)}
          <span className="lp-d-cited" style={{ '--i': 9 }}><DocIcon size={13} /> 2 sections cited</span>
        </div>
        <div className="lp-d-input" style={{ '--i': 1 }}>
          <span className="lp-d-mic"><MicIcon size={15} /></span>
          <span className="lp-wave lp-wave--wide">
            {WAVE.map((h, i) => <i key={i} style={{ '--h': h, '--i': i }} />)}
          </span>
        </div>
      </div>

      <ul className="lp-d-picker">
        {PICKER.map(({ code, label }, i) => (
          <li key={code} lang={code} style={{ '--i': i }}>{label}</li>
        ))}
      </ul>
    </Demo>
  );
}

/* ─── Draft: a notice writes itself and gets signed ───────────── */
export function DraftDemo() {
  return (
    <Demo name="draft">
      <div className="lp-d-page">
        <span className="lp-d-page__title">Legal notice</span>
        {line(38, 1)}
        {line(56, 2)}
        <span className="lp-d-gap" />
        {line(96, 3)}
        {line(90, 4)}
        {line(94, 5)}
        {line(62, 6)}
        <svg className="lp-d-sign" viewBox="0 0 96 30" fill="none">
          <path className="lp-draw" pathLength="1" style={{ '--i': 9 }}
                d="M4 22c7-16 11-17 13-6s5 9 9-2 8-9 10 1 8 6 14-5 11 1 16-2 11-2 26 4" />
        </svg>
      </div>
      <div className="lp-d-formats">
        <span className="lp-d-format" style={{ '--i': 11 }}><DownIcon size={13} /> PDF</span>
        <span className="lp-d-format" style={{ '--i': 12 }}><DownIcon size={13} /> Word</span>
      </div>
    </Demo>
  );
}

/* ─── Check: a contract is scanned, flags and a score appear ──── */
export function ContractDemo() {
  return (
    <Demo name="contract">
      {(live) => (
        <>
          <div className="lp-d-page">
            {line(84, 0)}
            {line(94, 1, 'red')}
            {line(70, 2)}
            {line(88, 3)}
            {line(60, 4, 'red')}
            {line(80, 5)}
            {line(74, 6, 'green')}
            <span className="lp-d-scan" />
          </div>
          <div className="lp-d-result">
            <div className="lp-d-gauge">
              <svg viewBox="0 0 100 58" fill="none">
                <path className="lp-d-gauge__track" d="M10 52a40 40 0 0 1 80 0" />
                <path className="lp-d-gauge__fill" pathLength="1" d="M10 52a40 40 0 0 1 80 0" />
              </svg>
              <strong><CountUp to={7} live={live} delay={1.8} />/10</strong>
              <span>risk score</span>
            </div>
            <span className="lp-d-tag lp-d-tag--red" style={{ '--i': 10 }}>2 red flags</span>
            <span className="lp-d-tag lp-d-tag--gold" style={{ '--i': 11 }}>1 missing clause</span>
          </div>
        </>
      )}
    </Demo>
  );
}

/* ─── Track: a CNR number, hearings on a line ─────────────────── */
const HEARINGS = [
  { date: '14 Aug', what: 'Arguments heard' },
  { date: '09 Sep', what: 'Evidence filed' },
  { date: '22 Oct', what: 'Next hearing', next: true },
];

export function TrackDemo() {
  return (
    <Demo name="track">
      <div className="lp-d-cnr" style={{ '--i': 0 }}>
        <span className="lp-d-cnr__code">MHPU010012342024</span>
        <span className="lp-d-status">Pending</span>
      </div>
      <ol className="lp-d-timeline">
        {HEARINGS.map(({ date, what, next }, i) => (
          <li key={date} className={next ? 'is-next' : undefined} style={{ '--i': 2 + i * 2 }}>
            <time>{date}</time>
            <span>{what}</span>
          </li>
        ))}
      </ol>
    </Demo>
  );
}

/* ─── Rights: guide cards fan out ─────────────────────────────── */
export function RightsDemo() {
  return (
    <Demo name="rights">
      <div className="lp-d-fan">
        <span className="lp-d-card" style={{ '--x': '-74%', '--r': '-9deg', '--i': 0 }}><HomeIcon size={20} />Tenants</span>
        <span className="lp-d-card" style={{ '--x': '74%', '--r': '9deg', '--i': 0 }}><CaseIcon size={20} />Workplace</span>
        <span className="lp-d-card lp-d-card--top" style={{ '--x': '0%', '--r': '0deg', '--i': 0 }}><BagIcon size={20} />Consumers</span>
      </div>
      <span className="lp-d-more" style={{ '--i': 5 }}>and 7 more guides</span>
    </Demo>
  );
}

/* ─── Matter: one folder for a dispute ────────────────────────── */
export function MatterDemo() {
  return (
    <Demo name="matter">
      <div className="lp-d-folder">
        <span className="lp-d-folder__tab">Matter</span>
        <div className="lp-d-folder__body">
          <div className="lp-d-folder__head">
            <strong>Deposit dispute with landlord</strong>
            <span className="lp-d-status lp-d-status--open">Open</span>
          </div>
          <ul>
            <li style={{ '--i': 2 }}><ChatIcon size={15} /> 3 chats</li>
            <li style={{ '--i': 3 }}><DocIcon size={15} /> 2 documents</li>
            <li style={{ '--i': 4 }}><GavelIcon size={15} /> 1 court case</li>
          </ul>
          <div className="lp-d-note" style={{ '--i': 6 }}>
            <span>Your notes</span>
            {line(88, 7)}
            {line(52, 8)}
          </div>
        </div>
      </div>
    </Demo>
  );
}
