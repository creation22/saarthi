import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeContractFile } from '../services/api.js';
import toast from 'react-hot-toast';

/* ─── Helpers ─────────────────────────────────────────────────── */
const ACCEPTED = '.pdf,.docx,.doc,.txt';
const MAX_MB   = 10;

const RISK_CONFIG = {
  LOW:      { color: '#8B6914', bg: 'rgba(139,105,20,0.10)', label: 'Low Risk',      range: '1–3'  },
  MEDIUM:   { color: '#C47A30', bg: 'rgba(196,122,48,0.12)', label: 'Medium Risk',   range: '4–5'  },
  HIGH:     { color: '#C44B28', bg: 'rgba(196,75,40,0.12)',  label: 'High Risk',     range: '6–7'  },
  CRITICAL: { color: '#8B2500', bg: 'rgba(139,37,0,0.10)',   label: 'Critical Risk', range: '8–10' },
};

const SEV_STYLE = {
  HIGH:   { color: '#C44B28', bg: 'rgba(196,75,40,0.12)',   label: 'HIGH'   },
  MEDIUM: { color: '#C47A30', bg: 'rgba(196,122,48,0.12)',  label: 'MEDIUM' },
  LOW:    { color: '#8B6914', bg: 'rgba(139,105,20,0.10)',  label: 'LOW'    },
};

function fmt(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ─── Risk gauge (SVG arc) ────────────────────────────────────── */
function RiskGauge({ score, level }) {
  const cfg   = RISK_CONFIG[level] ?? RISK_CONFIG.MEDIUM;
  const r     = 52;
  const cx    = 64;
  const cy    = 64;
  const circ  = 2 * Math.PI * r;
  const pct   = score / 10;
  const dash  = circ * pct;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="rgba(0,0,0,0.07)" strokeWidth="10" />
        {/* Fill */}
        <motion.circle cx={cx} cy={cy} r={r} fill="none"
          stroke={cfg.color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '64px 64px', transform: 'rotate(-90deg)' }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle"
          style={{ fill: cfg.color, fontSize: 28, fontWeight: 700,
                   fontFamily: 'var(--font-display)' }}>
          {score}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle"
          style={{ fill: 'var(--color-text-soft)', fontSize: 10,
                   fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
          /10
        </text>
      </svg>

      <div>
        <div style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: 999,
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40`,
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
          letterSpacing: '0.1em', marginBottom: 6,
        }}>
          {cfg.label.toUpperCase()}
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    color: 'var(--color-text-soft)', lineHeight: 1.5 }}>
          Risk score {score}/10<br/>
          Range: {cfg.range}
        </p>
      </div>
    </div>
  );
}

/* ─── Red flag card ───────────────────────────────────────────── */
function RedFlagCard({ flag, index }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEV_STYLE[flag.severity] ?? SEV_STYLE.MEDIUM;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      style={{
        borderRadius: 14, background: 'rgba(196,75,40,0.04)',
        border: '1px solid rgba(196,75,40,0.12)',
        borderLeft: '3px solid #C44B28',
        marginBottom: 10, overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', textAlign: 'left', padding: '14px 16px',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}
      >
        <span style={{ fontSize: '1rem', marginTop: 1 }}>🚩</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.83rem',
              fontWeight: 600, color: '#B84040',
            }}>
              {flag.title}
            </span>
            <span style={{
              padding: '2px 8px', borderRadius: 999,
              background: sev.bg, color: sev.color,
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.08em',
            }}>
              {sev.label}
            </span>
          </div>
          <p style={{
            marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--color-text-soft)', overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: expanded ? 'none' : 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {flag.clause}
          </p>
        </div>
        <span style={{ color: 'var(--color-text-dim)', fontSize: '0.7rem', marginTop: 2 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 16px 16px 40px',
              borderTop: '1px solid rgba(196,75,40,0.1)',
              paddingTop: 12,
            }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: 10,
                background: 'rgba(0,0,0,0.04)', borderRadius: 8, padding: '8px 10px',
                borderLeft: '2px solid rgba(196,75,40,0.3)',
              }}>
                "{flag.clause}"
              </p>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
                color: 'var(--color-text-mid)', lineHeight: 1.65, marginBottom: 8,
              }}>
                <strong style={{ color: '#B84040' }}>Concern: </strong>{flag.concern}
              </p>
              {flag.recommendation && (
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
                  color: 'var(--color-text-mid)', lineHeight: 1.65,
                  padding: '8px 10px', borderRadius: 8,
                  background: 'rgba(196,122,48,0.06)',
                  border: '1px solid rgba(196,122,48,0.12)',
                }}>
                  <strong style={{ color: '#8B6914' }}>Fix: </strong>{flag.recommendation}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Green flag card ─────────────────────────────────────────── */
function GreenFlagCard({ flag, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      style={{
        borderRadius: 14, background: 'rgba(196,122,48,0.04)',
        border: '1px solid rgba(196,122,48,0.12)',
        borderLeft: '3px solid #C47A30',
        padding: '14px 16px', marginBottom: 10,
        display: 'flex', gap: 10,
      }}
    >
      <span style={{ fontSize: '1rem', marginTop: 1 }}>✅</span>
      <div>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.83rem',
          fontWeight: 600, color: '#8B6914', marginBottom: 4,
        }}>
          {flag.title}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--color-text-soft)', lineHeight: 1.6, marginBottom: 6,
        }}>
          "{flag.clause}"
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
          color: 'var(--color-text-mid)', lineHeight: 1.6,
        }}>
          {flag.protection}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Upload zone ─────────────────────────────────────────────── */
function UploadZone({ file, onFile }) {
  const inputRef  = useRef(null);
  const [drag, setDrag] = useState(false);

  const handle = useCallback((f) => {
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${MAX_MB} MB.`);
      return;
    }
    onFile(f);
  }, [onFile]);

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handle(e.dataTransfer.files[0]);
  };

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      animate={{
        borderColor: drag
          ? 'rgba(224,120,72,0.6)'
          : file
            ? 'rgba(212,175,55,0.5)'
            : 'rgba(0,0,0,0.09)',
        background: drag
          ? 'rgba(224,120,72,0.06)'
          : file
            ? 'rgba(212,175,55,0.05)'
            : 'rgba(255,255,255,0.6)',
      }}
      transition={{ duration: 0.18 }}
      style={{
        border: '2px dashed',
        borderRadius: 20, padding: '48px 32px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16, cursor: 'pointer',
        textAlign: 'center',
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef} type="file" accept={ACCEPTED}
        style={{ display: 'none' }}
        onChange={e => handle(e.target.files[0])}
      />

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div key="file"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(196,122,48,0.12)',
              border: '1px solid rgba(212,175,55,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem',
            }}>
              📄
            </div>
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 600,
              fontSize: '0.9rem', color: '#8B6914',
            }}>
              {file.name}
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'var(--color-text-dim)',
            }}>
              {fmt(file.size)} · Click to change
            </p>
          </motion.div>
        ) : (
          <motion.div key="empty"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(0,0,0,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem',
            }}>
              📂
            </div>
            <div>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600,
                color: 'var(--color-text-bright)',
              }}>
                Drop your contract here
              </p>
              <p style={{
                marginTop: 4,
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                color: 'var(--color-text-dim)',
              }}>
                PDF · DOCX · TXT &nbsp;·&nbsp; Max {MAX_MB} MB
              </p>
            </div>
            <div style={{
              marginTop: 4, padding: '8px 20px', borderRadius: 999,
              border: '1px solid rgba(0,0,0,0.10)',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              color: 'var(--color-text-soft)',
            }}>
              Browse files
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Analysing spinner ───────────────────────────────────────── */
function AnalysingState({ filename }) {
  const steps = [
    'Extracting document text…',
    'Identifying clause types…',
    'Scanning for red flags…',
    'Evaluating protective clauses…',
    'Calculating risk score…',
    'Generating recommendations…',
  ];
  const [step, setStep] = useState(0);

  useState(() => {
    const id = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 2800);
    return () => clearInterval(id);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 24, padding: '64px 32px', textAlign: 'center',
      }}
    >
      {/* Spinning scales icon */}
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            border: '2px solid transparent',
            borderTopColor: 'var(--color-saffron)',
            borderRightColor: 'var(--color-gold)',
            borderRadius: '50%',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 8,
            border: '2px solid transparent',
            borderTopColor: '#8B6914',
            borderRadius: '50%',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem',
        }}>
          ⚖
        </div>
      </div>

      <div>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600,
          color: 'var(--color-ink)',
        }}>
          Analysing Contract
        </p>
        <p style={{
          marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          color: 'var(--color-text-dim)',
        }}>
          {filename}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
            color: 'var(--color-saffron)',
          }}
        >
          {steps[step]}
        </motion.p>
      </AnimatePresence>

      <div style={{
        display: 'flex', gap: 4, marginTop: -8,
      }}>
        {steps.map((_, i) => (
          <motion.div
            key={i}
            animate={{ background: i <= step ? 'var(--color-saffron)' : 'rgba(0,0,0,0.09)' }}
            style={{ width: i === step ? 24 : 6, height: 6, borderRadius: 3 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Results view ────────────────────────────────────────────── */
function AnalysisResults({ result, onReset }) {
  const { filename, analysis: a } = result;
  const risk = RISK_CONFIG[a.riskLevel] ?? RISK_CONFIG.MEDIUM;

  const cardStyle = {
    borderRadius: 16,
    background: 'rgba(255,255,255,0.75)',
    border: '1px solid rgba(0,0,0,0.07)',
    padding: '20px 22px',
    marginBottom: 16,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Result header ──────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 20,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              padding: '3px 12px', borderRadius: 999,
              background: 'rgba(212,168,80,0.12)',
              border: '1px solid rgba(212,168,80,0.25)',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'var(--color-gold)', letterSpacing: '0.08em',
            }}>
              {a.documentType}
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.35rem',
            fontWeight: 600, color: 'var(--color-ink)',
          }}>
            {filename}
          </h2>
          <p style={{
            marginTop: 2, fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            color: 'var(--color-text-dim)',
          }}>
            {result.charCount.toLocaleString()} characters analysed
          </p>
        </div>

        <button
          onClick={onReset}
          style={{
            padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
            border: '1px solid rgba(0,0,0,0.09)',
            background: 'rgba(255,255,255,0.75)',
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'var(--color-text-soft)',
          }}
        >
          ↩ Analyse New Document
        </button>
      </div>

      {/* ── Risk + Summary ─────────────────────────────────── */}
      <div style={{
        ...cardStyle,
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start',
        borderLeft: `3px solid ${risk.color}`,
      }}>
        <RiskGauge score={a.riskScore} level={a.riskLevel} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--color-text-dim)', marginBottom: 8,
          }}>
            Executive Summary
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
            color: 'var(--color-text-bright)', lineHeight: 1.7,
          }}>
            {a.summary}
          </p>
        </div>
      </div>

      {/* ── Flags grid ─────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16, marginBottom: 16,
      }}>
        {/* Red flags */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          }}>
            <span style={{ fontSize: '1.1rem' }}>🚩</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.08em', color: '#B84040',
            }}>
              RED FLAGS ({a.redFlags?.length ?? 0})
            </span>
          </div>
          {a.redFlags?.length > 0
            ? a.redFlags.map((f, i) => <RedFlagCard key={i} flag={f} index={i} />)
            : (
              <div style={{
                borderRadius: 14, padding: '20px', textAlign: 'center',
                background: 'rgba(196,122,48,0.04)',
                border: '1px dashed rgba(212,175,55,0.20)',
                color: '#8B6914', fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              }}>
                ✅ No red flags detected
              </div>
            )
          }
        </div>

        {/* Green flags */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          }}>
            <span style={{ fontSize: '1.1rem' }}>✅</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.08em', color: '#8B6914',
            }}>
              GREEN FLAGS ({a.greenFlags?.length ?? 0})
            </span>
          </div>
          {a.greenFlags?.length > 0
            ? a.greenFlags.map((f, i) => <GreenFlagCard key={i} flag={f} index={i} />)
            : (
              <div style={{
                borderRadius: 14, padding: '20px', textAlign: 'center',
                background: 'rgba(196,75,40,0.04)',
                border: '1px dashed rgba(196,75,40,0.2)',
                color: '#B84040', fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              }}>
                ⚠ No protective clauses found
              </div>
            )
          }
        </div>
      </div>

      {/* ── Missing clauses ─────────────────────────────────── */}
      {a.missingClauses?.length > 0 && (
        <div style={{ ...cardStyle, borderLeft: '3px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span>⚠️</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.08em', color: '#C47A30',
            }}>
              MISSING CLAUSES ({a.missingClauses.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {a.missingClauses.map((c, i) => (
              <span key={i} style={{
                padding: '6px 12px', borderRadius: 999,
                background: 'rgba(196,122,48,0.08)',
                border: '1px solid rgba(196,122,48,0.2)',
                fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
                color: 'var(--color-text-mid)',
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Key terms ───────────────────────────────────────── */}
      {a.keyTerms?.length > 0 && (
        <div style={{ ...cardStyle }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--color-text-dim)', marginBottom: 14,
          }}>
            Key Defined Terms
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 10,
          }}>
            {a.keyTerms.map((t, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(0,0,0,0.07)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  fontWeight: 700, color: 'var(--color-gold)', marginBottom: 4,
                }}>
                  {t.term}
                </p>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
                  color: 'var(--color-text-soft)', lineHeight: 1.5,
                }}>
                  {t.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recommendations ─────────────────────────────────── */}
      {a.recommendations?.length > 0 && (
        <div style={{ ...cardStyle, borderLeft: '3px solid #E07848' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span>💡</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.08em', color: 'var(--color-saffron)',
            }}>
              RECOMMENDATIONS
            </span>
          </div>
          <ol style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {a.recommendations.map((r, i) => (
              <li key={i} style={{
                display: 'flex', gap: 12, marginBottom: 10,
              }}>
                <span style={{
                  flexShrink: 0, width: 22, height: 22,
                  borderRadius: '50%',
                  background: 'rgba(224,120,72,0.15)',
                  border: '1px solid rgba(224,120,72,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  fontWeight: 700, color: 'var(--color-saffron)', marginTop: 2,
                }}>
                  {i + 1}
                </span>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '0.83rem',
                  color: 'var(--color-text-mid)', lineHeight: 1.65,
                }}>
                  {r}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function ContractAnalyzer() {
  const [file,     setFile]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);

  const handleAnalyze = async () => {
    if (!file || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await analyzeContractFile(file);
      setResult(data);
    } catch (err) {
      const msg = err?.response?.data?.error ?? 'Analysis failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-ivory)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
    }}>
      {/* Aurora bg */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 600, height: 600,
          top: -150, right: -100, borderRadius: '50%',
          filter: 'blur(90px)',
          background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)',
          animation: 'none; // 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 700, height: 500,
          bottom: -100, left: -150, borderRadius: '50%',
          filter: 'blur(90px)',
          background: 'radial-gradient(circle, rgba(196,122,48,0.05) 0%, transparent 70%)',
          animation: 'none; // 24s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '52px 52px',
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 28px',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(249,246,240,0.92)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
          }}>
            <svg width="16" height="20" viewBox="0 0 18 22" fill="none"
                 stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round">
              <line x1="9" y1="1" x2="9" y2="21" />
              <line x1="2" y1="6" x2="16" y2="6" />
              <line x1="2" y1="6" x2="2" y2="13" />
              <line x1="16" y1="6" x2="16" y2="13" />
              <path d="M0,13 Q2,16 4,13" /><path d="M0,13 Q2,10 4,13" />
              <path d="M14,13 Q16,16 18,13" /><path d="M14,13 Q16,10 18,13" />
              <line x1="6" y1="21" x2="12" y2="21" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '1rem',
              fontWeight: 600, color: 'var(--color-ink)',
            }}>
              Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/chat" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              color: 'var(--color-text-soft)', textDecoration: 'none',
              padding: '5px 14px', borderRadius: 999,
              border: '1px solid rgba(0,0,0,0.09)',
            }}>
              ← Back to Chat
            </Link>
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

          {/* Page title */}
          {!loading && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', marginBottom: 40 }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 16px', borderRadius: 999,
                background: 'rgba(224,120,72,0.1)',
                border: '1px solid rgba(224,120,72,0.25)',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.12em', color: 'var(--color-saffron)',
                marginBottom: 16,
              }}>
                🔍 AI CONTRACT REVIEW
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: '2.4rem',
                fontWeight: 700, color: 'var(--color-ink)',
                lineHeight: 1.2, marginBottom: 12,
              }}>
                Contract Analyzer
              </h1>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '1rem',
                color: 'var(--color-text-soft)', lineHeight: 1.7,
                maxWidth: 520, margin: '0 auto',
              }}>
                Upload any legal contract or document. Our AI will identify red flags,
                protective clauses, missing terms, and give you a full risk assessment
                under Indian law.
              </p>

              {/* Stats bar */}
              <div style={{
                display: 'flex', justifyContent: 'center', gap: 32, marginTop: 28,
                flexWrap: 'wrap',
              }}>
                {[
                  ['🚩', 'Red Flags', 'Risky clauses'],
                  ['✅', 'Green Flags', 'Protective terms'],
                  ['⚖', 'Risk Score', 'Out of 10'],
                  ['💡', 'Recommendations', 'Action items'],
                ].map(([icon, label, sub]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{icon}</div>
                    <div style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
                      fontWeight: 600, color: 'var(--color-text-mid)',
                    }}>{label}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                      color: 'var(--color-text-dim)',
                    }}>{sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Upload + Analyze */}
          {!loading && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <UploadZone file={file} onFile={setFile} />

              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <motion.button
                  whileHover={file ? { scale: 1.03 } : {}}
                  whileTap={file ? { scale: 0.97 } : {}}
                  onClick={handleAnalyze}
                  disabled={!file}
                  style={{
                    padding: '13px 36px', borderRadius: 999, cursor: file ? 'pointer' : 'not-allowed',
                    background: file
                      ? 'linear-gradient(135deg, #E07848, #D4641E)'
                      : 'rgba(0,0,0,0.04)',
                    border: file
                      ? '1px solid rgba(224,120,72,0.4)'
                      : '1px solid rgba(0,0,0,0.09)',
                    color: file ? '#fff' : 'var(--color-text-faint)',
                    fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
                    fontWeight: 600, letterSpacing: '0.02em',
                    boxShadow: file ? '0 8px 32px rgba(224,120,72,0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {file ? '🔍 Analyze Contract →' : 'Select a document first'}
                </motion.button>

                <p style={{
                  marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                  color: 'var(--color-text-faint)',
                }}>
                  Analysis typically takes 15–30 seconds · PDF, DOCX, TXT supported
                </p>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {loading && <AnalysingState filename={file?.name ?? ''} />}

          {/* Results */}
          {result && !loading && (
            <AnalysisResults result={result} onReset={handleReset} />
          )}
        </main>
      </div>
    </div>
  );
}
