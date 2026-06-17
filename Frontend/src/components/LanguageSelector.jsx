const LANGUAGES = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी — Hindi' },
  { code: 'ta-IN', label: 'தமிழ் — Tamil' },
  { code: 'te-IN', label: 'తెలుగు — Telugu' },
  { code: 'bn-IN', label: 'বাংলা — Bengali' },
  { code: 'mr-IN', label: 'मराठी — Marathi' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ — Kannada' },
  { code: 'ml-IN', label: 'മലയാളം — Malayalam' },
  { code: 'gu-IN', label: 'ગુજરાતી — Gujarati' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ — Punjabi' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ — Odia' },
];

export default function LanguageSelector({ value, onChange, fullWidth = false }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={fullWidth ? 'w-full' : ''}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.75rem',
        color: 'var(--color-ink)',
        background: 'var(--color-ivory)',
        border: '1px solid var(--color-border)',
        borderRadius: '999px',
        padding: '0.375rem 0.875rem',
        outline: 'none',
        cursor: 'pointer',
        width: fullWidth ? '100%' : undefined,
      }}
    >
      {LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>{lang.label}</option>
      ))}
    </select>
  );
}
