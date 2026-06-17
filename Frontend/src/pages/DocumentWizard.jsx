import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDocument } from '../services/api.js';
import toast from 'react-hot-toast';

/* ═══════════════════════════════════════════════════════════════
   DOCUMENT TYPE DEFINITIONS
═══════════════════════════════════════════════════════════════ */
const DOC_TYPES = {
  fir: {
    label: 'FIR Draft',
    icon: '🚨',
    color: '#D4641E',
    description: 'First Information Report — file a criminal complaint at your police station',
    act: 'Code of Criminal Procedure / BNS 2023',
    fields: [
      { key: 'complainantName',    label: 'Your Full Name',                     type: 'text',     required: true },
      { key: 'complainantAge',     label: 'Your Age',                           type: 'number',   required: true },
      { key: 'complainantAddress', label: 'Your Address',                       type: 'textarea', required: true },
      { key: 'policeStation',      label: 'Police Station Name',                type: 'text',     required: true },
      { key: 'incidentDate',       label: 'Date of Incident',                   type: 'date',     required: true },
      { key: 'incidentTime',       label: 'Time of Incident (approximate)',     type: 'time',     required: false },
      { key: 'incidentLocation',   label: 'Location / Place of Incident',       type: 'text',     required: true },
      { key: 'incidentDescription',label: 'Describe the Incident in Detail',    type: 'textarea', required: true, rows: 5 },
      { key: 'accusedName',        label: 'Accused Name (if known)',            type: 'text',     required: false },
      { key: 'accusedDescription', label: 'Description / Identification of Accused', type: 'text', required: false },
      { key: 'witnesses',          label: 'Witness Names (if any)',             type: 'text',     required: false },
      { key: 'propertyLost',       label: 'Property Lost / Stolen (if applicable)', type: 'text', required: false },
    ],
  },
  consumer: {
    label: 'Consumer Complaint',
    icon: '🛒',
    color: '#C5943A',
    description: 'Complaint to Consumer Forum against a defective product or deficient service',
    act: 'Consumer Protection Act, 2019',
    fields: [
      { key: 'complainantName',    label: 'Your Full Name',               type: 'text',     required: true },
      { key: 'complainantAddress', label: 'Your Address',                 type: 'textarea', required: true },
      { key: 'complainantPhone',   label: 'Phone / Email',               type: 'text',     required: true },
      { key: 'oppositeParty',      label: 'Company / Seller Name',       type: 'text',     required: true },
      { key: 'oppositeAddress',    label: 'Company / Seller Address',    type: 'textarea', required: false },
      { key: 'productService',     label: 'Product / Service Purchased', type: 'text',     required: true },
      { key: 'purchaseDate',       label: 'Date of Purchase',            type: 'date',     required: true },
      { key: 'purchaseAmount',     label: 'Amount Paid (₹)',             type: 'number',   required: true },
      { key: 'issueDescription',   label: 'Describe the Defect / Issue', type: 'textarea', required: true, rows: 4 },
      { key: 'previousAction',     label: 'Steps Taken to Resolve (emails, calls, etc.)', type: 'textarea', required: false, rows: 2 },
      { key: 'resolutionSought',   label: 'Relief / Resolution Sought',  type: 'textarea', required: true, rows: 3 },
      { key: 'claimAmount',        label: 'Total Claim Amount Including Compensation (₹)', type: 'number', required: false },
    ],
  },
  notice: {
    label: 'Legal Notice',
    icon: '📜',
    color: '#2C3E52',
    description: 'Formal legal notice demanding action or payment before legal proceedings',
    act: 'General / CPC / Specific Acts',
    fields: [
      { key: 'senderName',           label: 'Your Full Name',                      type: 'text',     required: true },
      { key: 'senderAddress',        label: 'Your Address',                        type: 'textarea', required: true },
      { key: 'senderAdvocate',       label: 'Advocate Name (leave blank if self)', type: 'text',     required: false },
      { key: 'recipientName',        label: "Recipient's Full Name",               type: 'text',     required: true },
      { key: 'recipientAddress',     label: "Recipient's Address",                 type: 'textarea', required: true },
      { key: 'subjectMatter',        label: 'Subject of the Notice (brief)',       type: 'text',     required: true },
      { key: 'grievanceDescription', label: 'Describe Your Grievance in Detail',   type: 'textarea', required: true, rows: 5 },
      { key: 'demandedAction',       label: 'Action Demanded from Recipient',      type: 'textarea', required: true, rows: 3 },
      { key: 'complianceDeadline',   label: 'Compliance Deadline (days)',          type: 'number',   required: true },
      { key: 'consequence',          label: 'Consequence if Ignored (optional)',   type: 'text',     required: false },
    ],
  },
  rti: {
    label: 'RTI Application',
    icon: '📋',
    color: '#4A7C59',
    description: 'Right to Information request to any public authority or government department',
    act: 'RTI Act, 2005',
    fields: [
      { key: 'applicantName',      label: 'Your Full Name',              type: 'text',     required: true },
      { key: 'applicantAddress',   label: 'Your Address',                type: 'textarea', required: true },
      { key: 'applicantPhone',     label: 'Phone / Email',               type: 'text',     required: true },
      { key: 'publicAuthority',    label: 'Name of Public Authority',    type: 'text',     required: true },
      { key: 'department',         label: 'Department / Office (if known)', type: 'text',  required: false },
      { key: 'informationSought',  label: 'Information Requested\n(Number each question on a new line)', type: 'textarea', required: true, rows: 6 },
      { key: 'periodConcerned',    label: 'Period Concerned (e.g., "Jan 2020 to Dec 2023")', type: 'text', required: false },
      { key: 'preferredFormat',    label: 'Preferred Format',            type: 'select',   required: true,
        options: ['Printed copies', 'Soft copy (CD/email)', 'Inspection of records'] },
      { key: 'bplCard',            label: 'I am a BPL card holder (exempt from ₹10 fee)', type: 'checkbox', required: false },
    ],
  },
  demand: {
    label: 'Demand Notice (Wages)',
    icon: '💼',
    color: '#7B2D2D',
    description: 'Formal demand notice to employer for recovery of unpaid wages or dues',
    act: 'Payment of Wages Act, 1936 / Code on Wages, 2019',
    fields: [
      { key: 'employeeName',     label: 'Your Full Name',                  type: 'text',     required: true },
      { key: 'employeeAddress',  label: 'Your Address',                    type: 'textarea', required: true },
      { key: 'designation',      label: 'Your Designation / Role',         type: 'text',     required: true },
      { key: 'employerName',     label: "Employer's / Company Name",       type: 'text',     required: true },
      { key: 'employerAddress',  label: "Employer's / Company Address",    type: 'textarea', required: true },
      { key: 'unpaidAmount',     label: 'Total Unpaid Amount (₹)',         type: 'number',   required: true },
      { key: 'periodFrom',       label: 'Unpaid Wages From (date)',        type: 'date',     required: true },
      { key: 'periodTo',         label: 'Unpaid Wages To (date)',          type: 'date',     required: true },
      { key: 'previousAttempts', label: 'Previous Attempts to Recover (verbal/written requests)', type: 'textarea', required: false, rows: 3 },
      { key: 'deadline',         label: 'Payment Deadline (days from notice)', type: 'number', required: true },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

function buildQuery(docType, formData) {
  const dt = DOC_TYPES[docType];
  const lines = [`Document Type: ${dt.label}`, `Under: ${dt.act}`, ''];
  dt.fields.forEach(f => {
    const val = formData[f.key];
    if (val && val !== false && val !== '') {
      lines.push(`${f.label}: ${val === true ? 'Yes' : val}`);
    }
  });
  return lines.join('\n');
}

/* ═══════════════════════════════════════════════════════════════
   STEP 1 — Choose document type
═══════════════════════════════════════════════════════════════ */
function StepChoose({ onChoose }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.p variants={fadeUp}
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.26em',
                 textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
        Step 1 of 3
      </motion.p>
      <motion.h2 variants={fadeUp}
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                 fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
        What document do you need?
      </motion.h2>
      <motion.p variants={fadeUp}
        style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginBottom: '2.5rem' }}>
        Choose a template and we'll walk you through filling in the details.
      </motion.p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(DOC_TYPES).map(([key, dt]) => (
          <motion.button key={key} variants={fadeUp}
            onClick={() => onChoose(key)}
            className="group relative flex flex-col items-start gap-3 rounded-2xl border p-6 text-left transition-all"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory)' }}
            whileHover={{ y: -4, borderColor: dt.color + '60',
                          boxShadow: `0 16px 40px rgba(22,15,8,0.09)`,
                          transition: { type: 'spring', stiffness: 340, damping: 22 } }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Color accent bar */}
            <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
                 style={{ background: dt.color, opacity: 0.6 }} />

            <span className="text-3xl">{dt.icon}</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600,
                           color: 'var(--color-ink)', marginBottom: 4 }}>{dt.label}</h3>
              <p style={{ fontSize: '0.75rem', lineHeight: 1.5, color: 'var(--color-ink-muted)',
                          fontFamily: 'var(--font-sans)' }}>{dt.description}</p>
            </div>
            <div style={{ marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                          letterSpacing: '0.12em', color: dt.color, opacity: 0.75 }}>
              {dt.act}
            </div>
            <motion.div
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.15 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke={dt.color} strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 2 — Fill form fields
═══════════════════════════════════════════════════════════════ */
function FieldInput({ field, value, onChange, error }) {
  const base = {
    width: '100%', fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
    color: 'var(--color-ink)', background: 'var(--color-ivory)',
    border: `1px solid ${error ? '#C0392B' : 'var(--color-border)'}`,
    borderRadius: 12, padding: '0.6rem 0.85rem', outline: 'none',
    transition: 'border-color 0.15s',
  };

  if (field.type === 'textarea') return (
    <textarea value={value || ''} onChange={e => onChange(e.target.value)}
      rows={field.rows || 3} placeholder={field.required ? 'Required' : 'Optional'}
      style={{ ...base, resize: 'vertical', minHeight: 70 }}
      onFocus={e => e.target.style.borderColor = 'var(--color-saffron)'}
      onBlur={e => e.target.style.borderColor = error ? '#C0392B' : 'var(--color-border)'}
    />
  );

  if (field.type === 'select') return (
    <div className="relative">
      <select value={value || ''} onChange={e => onChange(e.target.value)}
        style={{ ...base, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}
        onFocus={e => e.target.style.borderColor = 'var(--color-saffron)'}
        onBlur={e => e.target.style.borderColor = error ? '#C0392B' : 'var(--color-border)'}
      >
        <option value="">Select…</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
           width="11" height="11" viewBox="0 0 24 24" fill="none"
           stroke="var(--color-ink-muted)" strokeWidth="2" strokeLinecap="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );

  if (field.type === 'checkbox') return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: 'var(--color-saffron)', cursor: 'pointer' }} />
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                     color: 'var(--color-ink-soft)' }}>Yes</span>
    </label>
  );

  return (
    <input type={field.type} value={value || ''} onChange={e => onChange(e.target.value)}
      placeholder={field.required ? 'Required' : 'Optional'}
      style={base}
      onFocus={e => e.target.style.borderColor = 'var(--color-saffron)'}
      onBlur={e => e.target.style.borderColor = error ? '#C0392B' : 'var(--color-border)'}
    />
  );
}

function StepForm({ docType, formData, onChange, onBack, onNext }) {
  const dt = DOC_TYPES[docType];
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    dt.fields.forEach(f => {
      if (f.required && !formData[f.key]) errs[f.key] = 'Required';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

      {/* Header */}
      <div className="mb-7 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
             style={{ background: dt.color + '14' }}>
          {dt.icon}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.26em',
                      textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 4 }}>
            Step 2 of 3
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.4rem)',
                       fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.1 }}>
            {dt.label}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', marginTop: 4 }}>
            {dt.description}
          </p>
        </div>
      </div>

      {/* Form grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {dt.fields.map((field, i) => {
          const isWide = field.type === 'textarea' || field.type === 'checkbox' || field.rows > 2;
          return (
            <motion.div key={field.key}
              className={isWide ? 'sm:col-span-2' : ''}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
                              fontWeight: 500, color: 'var(--color-ink)', marginBottom: 6 }}>
                {field.label}
                {field.required && (
                  <span style={{ color: dt.color, marginLeft: 4 }}>*</span>
                )}
              </label>
              <FieldInput field={field} value={formData[field.key]}
                onChange={val => onChange(field.key, val)}
                error={errors[field.key]} />
              {errors[field.key] && (
                <p style={{ fontSize: '0.72rem', color: '#C0392B', marginTop: 4,
                            fontFamily: 'var(--font-mono)' }}>
                  {errors[field.key]}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex items-center gap-3">
        <button onClick={onBack}
          className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm transition-colors hover:border-saffron"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)',
                   fontFamily: 'var(--font-sans)' }}>
          ← Back
        </button>
        <motion.button onClick={() => { if (validate()) onNext(); }}
          className="flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium text-white"
          style={{ background: dt.color, fontFamily: 'var(--font-sans)' }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          Preview & Download →
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 3 — Preview & Download
═══════════════════════════════════════════════════════════════ */
function StepDownload({ docType, formData, onBack }) {
  const dt        = DOC_TYPES[docType];
  const [format, setFormat]   = useState('pdf');
  const [loading, setLoading] = useState(false);

  const filledFields = dt.fields.filter(f => {
    const v = formData[f.key];
    return v !== undefined && v !== '' && v !== false;
  });

  const handleDownload = async () => {
    setLoading(true);
    try {
      const query = buildQuery(docType, formData);
      const res   = await generateDocument(query, docType, format);
      const url   = URL.createObjectURL(new Blob([res.data]));
      const a     = document.createElement('a');
      a.href = url;
      a.download = `${dt.label.replace(/\s+/g, '_')}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${dt.label} downloaded as ${format.toUpperCase()}!`);
    } catch {
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.26em',
                  textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 6 }}>
        Step 3 of 3
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.4rem)',
                   fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.1, marginBottom: '0.4rem' }}>
        Preview & Download
      </h2>
      <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-muted)', marginBottom: '2rem' }}>
        Review the details below, then generate your {dt.label}.
      </p>

      {/* Preview card */}
      <div className="rounded-2xl border mb-7"
           style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory)',
                    overflow: 'hidden' }}>
        {/* Card header */}
        <div className="flex items-center gap-3 border-b px-6 py-4"
             style={{ borderColor: 'var(--color-border)',
                      background: dt.color + '0A' }}>
          <span className="text-xl">{dt.icon}</span>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600,
                         color: 'var(--color-ink)' }}>{dt.label}</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
                        color: 'var(--color-ink-muted)' }}>{dt.act}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2D6A4F' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                           color: '#2D6A4F', letterSpacing: '0.1em' }}>
              {filledFields.length} fields filled
            </span>
          </div>
        </div>

        {/* Field list */}
        <div className="p-6 grid gap-3 sm:grid-cols-2">
          {filledFields.map(({ key, label, type }) => {
            const val = formData[key];
            return (
              <motion.div key={key}
                className={type === 'textarea' ? 'sm:col-span-2' : ''}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em',
                             textTransform: 'uppercase', color: 'var(--color-ink-muted)',
                             marginBottom: 3 }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem',
                            color: 'var(--color-ink)', lineHeight: 1.5,
                            wordBreak: 'break-word' }}>
                  {val === true ? '✓ Yes' : val}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Format selector + Download */}
      <div className="flex flex-wrap items-center gap-4">
        <button onClick={onBack}
          className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm transition-colors hover:border-saffron"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)',
                   fontFamily: 'var(--font-sans)' }}>
          ← Edit Details
        </button>

        <div className="flex items-center gap-2 rounded-2xl border px-3 py-2"
             style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory-deep)' }}>
          {['pdf', 'docx'].map(f => (
            <button key={f} onClick={() => setFormat(f)}
              className="rounded-xl px-4 py-1.5 text-xs font-medium transition-all"
              style={{
                background: format === f ? dt.color : 'transparent',
                color: format === f ? '#fff' : 'var(--color-ink-muted)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
              }}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <motion.button onClick={handleDownload} disabled={loading}
          className="flex items-center gap-2.5 rounded-full px-8 py-3 text-sm font-medium text-white disabled:opacity-60"
          style={{ background: dt.color, fontFamily: 'var(--font-sans)',
                   boxShadow: `0 4px 20px ${dt.color}40` }}
          whileHover={{ scale: loading ? 1 : 1.04 }} whileTap={{ scale: 0.97 }}>
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download {format.toUpperCase()}
            </>
          )}
        </motion.button>
      </div>

      {/* Disclaimer */}
      <p style={{ marginTop: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                  letterSpacing: '0.06em', color: 'var(--color-ink-muted)', opacity: 0.55,
                  lineHeight: 1.6 }}>
        This document is AI-generated as a template and may require review by a qualified advocate before use in formal proceedings.
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROGRESS BAR
═══════════════════════════════════════════════════════════════ */
function ProgressBar({ step, docType }) {
  const steps = ['Choose Type', 'Fill Details', 'Download'];
  const color = docType ? DOC_TYPES[docType].color : 'var(--color-saffron)';
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                animate={{
                  background: i < step ? color : i === step ? color : 'var(--color-border)',
                  color: i <= step ? '#fff' : 'var(--color-ink-muted)',
                  scale: i === step ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {i < step ? '✓' : i + 1}
              </motion.div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                             letterSpacing: '0.12em', textTransform: 'uppercase',
                             color: i <= step ? color : 'var(--color-ink-muted)',
                             opacity: i <= step ? 0.9 : 0.5, whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <motion.div className="h-px flex-1 mb-4"
                style={{ minWidth: 24, background: 'var(--color-border)' }}
                animate={{ background: i < step ? color : 'var(--color-border)' }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function DocumentWizard() {
  const [step, setStep]       = useState(0);
  const [docType, setDocType] = useState(null);
  const [formData, setFormData] = useState({});

  const handleChoose = (type) => {
    setDocType(type);
    setFormData({});
    setStep(1);
  };

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div style={{ background: 'var(--color-ivory)', minHeight: '100vh',
                  fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b"
              style={{ borderColor: 'var(--color-border)',
                       background: 'rgba(244,239,230,0.92)',
                       backdropFilter: 'blur(12px)' }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span style={{ color: 'var(--color-gold)' }}>⚖</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem',
                           fontWeight: 600, color: 'var(--color-ink)' }}>
              Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/rights"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                           color: 'var(--color-ink-muted)', padding: '6px 14px',
                           border: '1px solid var(--color-border)', borderRadius: 999,
                           textDecoration: 'none' }}>
              Know Your Rights
            </Link>
            <Link to="/chat"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                           color: '#fff', background: 'var(--color-saffron)',
                           padding: '6px 16px', borderRadius: 999, textDecoration: 'none' }}>
              Open Chat →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <div className="border-b px-5 py-12 text-center"
           style={{ borderColor: 'var(--color-border)',
                    background: 'var(--color-ivory-deep)' }}>
        <div className="mx-auto max-w-xl">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', letterSpacing: '0.3em',
                      textTransform: 'uppercase', color: 'var(--color-gold)',
                      marginBottom: '0.75rem' }}>Document Wizard</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.2rem)',
                       fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.1,
                       marginBottom: '0.75rem' }}>
            Generate Legal Documents<br />
            <span style={{ color: 'var(--color-saffron)', fontStyle: 'italic' }}>in Minutes.</span>
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', lineHeight: 1.65 }}>
            Fill in the details, we'll format the document. Download as PDF or Word instantly.
          </p>

          {/* Doc type pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {Object.values(DOC_TYPES).map(dt => (
              <span key={dt.label}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
                         color: dt.color, border: `1px solid ${dt.color}40`,
                         borderRadius: 999, padding: '3px 10px', opacity: 0.9 }}>
                {dt.icon} {dt.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Wizard body */}
      <main className="mx-auto max-w-5xl px-5 py-12">
        <ProgressBar step={step} docType={docType} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="choose" exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}>
              <StepChoose onChoose={handleChoose} />
            </motion.div>
          )}
          {step === 1 && docType && (
            <motion.div key="form" exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}>
              <StepForm
                docType={docType}
                formData={formData}
                onChange={handleChange}
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
              />
            </motion.div>
          )}
          {step === 2 && docType && (
            <motion.div key="download" exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}>
              <StepDownload
                docType={docType}
                formData={formData}
                onBack={() => setStep(1)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t px-5 py-8 text-center"
              style={{ borderColor: 'var(--color-border)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    color: 'var(--color-ink-muted)', opacity: 0.55 }}>
          Document templates are for guidance only · Review with a qualified advocate before formal use
        </p>
      </footer>
    </div>
  );
}
