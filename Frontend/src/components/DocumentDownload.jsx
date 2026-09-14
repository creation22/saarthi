import { useState } from 'react';
import { generateDocument } from '../services/api.js';
import toast from 'react-hot-toast';

const DOC_TYPES = [
  { value: 'fir',      label: 'FIR Draft' },
  { value: 'consumer', label: 'Consumer Complaint' },
  { value: 'notice',   label: 'Legal Notice' },
];

const SELECT_STYLE = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.75rem',
  color: 'var(--color-ink)',
  background: 'var(--color-ivory)',
  border: '1px solid var(--color-border)',
  borderRadius: '0.75rem',
  padding: '0.45rem 0.75rem',
  outline: 'none',
  cursor: 'pointer',
};

export default function DocumentDownload({ query }) {
  const [docType, setDocType] = useState('fir');
  const [format, setFormat]   = useState('pdf');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!query || !query.trim()) {
      toast.error('Ask a legal question first so the document has context.');
      return;
    }
    setLoading(true);
    try {
      const res = await generateDocument(query, docType, format);
      const mime = format === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/pdf';
      const url = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const a = document.createElement('a');
      a.href = url; a.download = `${docType}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Document downloaded!');
    } catch {
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border p-4"
         style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory-deep)' }}>
      <p className="mb-3 font-mono-dm text-[10px] tracking-widest uppercase"
         style={{ color: 'var(--color-ink-muted)' }}>
        Generate Legal Document
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <select value={docType} onChange={e => setDocType(e.target.value)} style={SELECT_STYLE}>
          {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        <select value={format} onChange={e => setFormat(e.target.value)} style={SELECT_STYLE}>
          <option value="pdf">PDF</option>
          <option value="docx">Word (.docx)</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--color-saffron)', fontFamily: 'var(--font-sans)' }}
        >
          {loading ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating…
            </>
          ) : (
            <>↓ Download</>
          )}
        </button>
      </div>
    </div>
  );
}
