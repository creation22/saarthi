import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ReasoningTrace({ guidance }) {
  const [open, setOpen] = useState(false);
  if (!guidance) return null;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border transition-colors duration-150"
         style={{ borderColor: open ? 'var(--color-gold)' : 'var(--color-border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors"
        style={{
          background: open ? 'var(--color-gold-pale)' : 'var(--color-ivory-deep)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
        }}
      >
        <span>View AI Reasoning Trace</span>
        <span style={{ fontSize: '0.65rem' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t px-4 pb-4 pt-3"
             style={{ borderColor: 'var(--color-border)', background: 'var(--color-gold-pale)' }}>
          <div className="chat-prose prose prose-sm max-w-none text-sm"
               style={{ color: 'var(--color-ink-soft)' }}>
            <ReactMarkdown>{guidance}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
