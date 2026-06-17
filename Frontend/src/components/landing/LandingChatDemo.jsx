import { ContainerScroll } from '../ContainerScroll.jsx';
import { Label } from './landingShared.jsx';

export default function LandingChatDemo() {
  return (
    <section style={{ background: 'var(--color-hero)' }}>
      <ContainerScroll
        titleComponent={
          <div className="text-center">
            <Label>Live Demo</Label>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.2rem)',
                         fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.15 }}>
              See it in action.
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', marginTop: '1rem',
                        color: 'rgba(0,0,0,0.5)', maxWidth: 480, margin: '1rem auto 0' }}>
              Ask any legal question. Get statute-backed guidance in your language — instantly.
            </p>
          </div>
        }
      >
        {/* Chat UI preview — light cream design */}
        <div style={{ height: '100%', background: 'var(--color-ivory)', display: 'flex',
                      flexDirection: 'column', overflow: 'hidden', position: 'relative',
                      fontFamily: 'var(--font-sans)' }}>

          {/* Subtle grid */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', inset: 0,
                          backgroundImage: 'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)',
                          backgroundSize: '52px 52px' }} />
            {/* Warm glow top-right */}
            <div style={{ position: 'absolute', width: 400, height: 400, top: -100, right: -80,
                          borderRadius: '50%', filter: 'blur(80px)',
                          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)' }} />
          </div>

          {/* Header */}
          <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between',
                        padding: '9px 18px', borderBottom: '1px solid rgba(0,0,0,0.07)',
                        background: 'rgba(249,246,240,0.9)', backdropFilter: 'blur(16px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="13" height="16" viewBox="0 0 18 22" fill="none"
                   stroke="#D4A850" strokeWidth="1.4" strokeLinecap="round">
                <line x1="9" y1="1" x2="9" y2="21"/><line x1="2" y1="6" x2="16" y2="6"/>
                <line x1="2" y1="6" x2="2" y2="13"/><line x1="16" y1="6" x2="16" y2="13"/>
                <path d="M0,13 Q2,16 4,13"/><path d="M0,13 Q2,10 4,13"/>
                <path d="M14,13 Q16,16 18,13"/><path d="M14,13 Q16,10 18,13"/>
                <line x1="6" y1="21" x2="12" y2="21"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 600, color: '#1A1A1A' }}>
                Legal<span style={{ color: '#E07848' }}>Sahayak</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {['en‑IN', 'Rights', 'Documents', 'History'].map(lbl => (
                <div key={lbl} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem',
                                        letterSpacing: '0.04em', padding: '3px 9px', borderRadius: 999,
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        color: 'rgba(0,0,0,0.42)', background: 'rgba(0,0,0,0.02)' }}>{lbl}</div>
              ))}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', padding: '3px 9px',
                            borderRadius: 999, border: '1px solid rgba(212,168,80,0.3)',
                            color: '#D4A850', background: 'rgba(212,168,80,0.06)' }}>New Chat</div>
            </div>
          </div>

          {/* Body */}
          <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* Sidebar */}
            <div style={{ width: 196, flexShrink: 0, display: 'flex', flexDirection: 'column',
                          padding: '14px 12px', borderRight: '1px solid rgba(0,0,0,0.07)',
                          borderLeft: '2px solid rgba(224,120,72,0.35)',
                          background: 'rgba(240,236,228,0.8)', overflowY: 'auto' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.47rem', letterSpacing: '0.14em',
                          textTransform: 'uppercase', color: 'rgba(0,0,0,0.32)', marginBottom: 5 }}>Session</p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.47rem', color: 'rgba(0,0,0,0.32)',
                            background: 'rgba(0,0,0,0.03)', borderRadius: 6, padding: '4px 7px',
                            border: '1px solid rgba(0,0,0,0.07)', lineHeight: 1.6 }}>sess_a8f2e3...b7d9</div>
              <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '10px 0' }} />

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.47rem', letterSpacing: '0.14em',
                          textTransform: 'uppercase', color: 'rgba(0,0,0,0.32)', marginBottom: 5 }}>Language</p>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: '#1A1A1A',
                            background: 'rgba(255,255,255,0.8)', borderRadius: 7, padding: '5px 9px',
                            border: '1px solid rgba(0,0,0,0.08)' }}>English (India)</div>
              <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '10px 0' }} />

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.47rem', letterSpacing: '0.14em',
                          textTransform: 'uppercase', color: 'rgba(0,0,0,0.32)', marginBottom: 5 }}>Jurisdiction</p>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: '#1A1A1A',
                            background: 'rgba(255,255,255,0.8)', borderRadius: 7, padding: '5px 9px',
                            border: '1px solid rgba(0,0,0,0.08)' }}>Any State</div>
              <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '10px 0' }} />

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.47rem', letterSpacing: '0.14em',
                          textTransform: 'uppercase', color: 'rgba(0,0,0,0.32)', marginBottom: 6 }}>Quick Topics</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  ['Tenant rights'],['Consumer complaint'],['Workplace harassment'],
                  ['FIR filing'],['RTI application'],
                ].map(([lbl]) => (
                  <div key={lbl} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                          padding: '5px 7px', borderRadius: 7,
                                          border: '1px solid rgba(0,0,0,0.07)',
                                          background: 'rgba(255,255,255,0.6)',
                                          fontFamily: 'var(--font-sans)', fontSize: '0.57rem',
                                          color: 'rgba(0,0,0,0.48)' }}>
                    <span>{lbl}</span>
                    <span style={{ color: '#E07848', opacity: 0.55, fontSize: '0.52rem' }}>→</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 10 }}>
                <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 8 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '5px 7px', borderRadius: 7,
                                border: '1px solid rgba(239,68,68,0.22)', background: 'rgba(239,68,68,0.04)',
                                fontFamily: 'var(--font-mono)', fontSize: '0.57rem', color: '#DC2626' }}>
                    <span>Analyze Contract</span><span style={{ opacity: 0.7 }}>→</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '5px 7px', borderRadius: 7,
                                border: '1px solid rgba(212,168,80,0.25)', background: 'rgba(212,168,80,0.05)',
                                fontFamily: 'var(--font-mono)', fontSize: '0.57rem', color: '#D4A850' }}>
                    <span>Document Wizard</span><span style={{ opacity: 0.7 }}>→</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat main */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px',
                            display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* User message */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '72%', borderRadius: '16px 16px 4px 16px',
                                padding: '10px 15px', background: '#E07848', color: '#fff',
                                fontFamily: 'var(--font-sans)', fontSize: '0.78rem', lineHeight: 1.55 }}>
                    My landlord hasn't returned my security deposit after 3 months. What are my rights?
                  </div>
                </div>
                {/* Assistant response */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ maxWidth: '88%', borderRadius: '16px 16px 16px 4px',
                                padding: '13px 17px', border: '1px solid rgba(0,0,0,0.08)',
                                background: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-sans)',
                                fontSize: '0.74rem', lineHeight: 1.65, color: 'rgba(0,0,0,0.75)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%',
                                    background: 'rgba(224,120,72,0.12)', border: '1px solid rgba(224,120,72,0.22)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.55rem', fontWeight: 700, color: '#E07848' }}>A</div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                                     letterSpacing: '0.1em', color: '#D4A850' }}>LEGAL ASSISTANT</span>
                    </div>
                    <p style={{ marginBottom: 7 }}>
                      <strong style={{ color: '#D4A850' }}>Under the Transfer of Property Act, 1882 (§ 108)</strong> and
                      applicable Rent Control Acts, your landlord is obligated to return the security deposit within a
                      reasonable time after vacating.
                    </p>
                    <p style={{ marginBottom: 7 }}>
                      Three months constitutes an unreasonable delay. You may{' '}
                      <strong style={{ color: '#1A1A1A' }}>send a legal notice</strong> demanding return within 15 days,
                      then file in the <strong style={{ color: '#1A1A1A' }}>Rent Control Tribunal</strong> or Consumer Forum.
                    </p>
                    <p style={{ marginBottom: 0, fontSize: '0.6rem', color: 'rgba(212,175,55,0.7)',
                                fontFamily: 'var(--font-mono)' }}>
                      Transfer of Property Act, 1882 · § 108 ↗  ·  Rent Control Act ↗
                    </p>
                  </div>
                </div>
              </div>
              {/* Input bar */}
              <div style={{ flexShrink: 0, padding: '10px 18px 13px',
                            borderTop: '1px solid rgba(0,0,0,0.07)',
                            background: 'var(--color-ivory)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                              background: 'rgba(255,255,255,0.8)',
                              border: '1px solid rgba(0,0,0,0.08)',
                              borderRadius: 14, padding: '9px 12px',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.73rem',
                                 color: 'rgba(0,0,0,0.28)', flex: 1 }}>
                    Ask a legal question in any Indian language…
                  </span>
                  <div style={{ display: 'flex', gap: 7 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8,
                                  background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                           stroke="rgba(0,0,0,0.38)" strokeWidth="2" strokeLinecap="round">
                        <rect x="9" y="2" width="6" height="11" rx="3"/>
                        <path d="M5 10a7 7 0 0 0 14 0"/>
                      </svg>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#E07848',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                           stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <p style={{ marginTop: 5, textAlign: 'center', fontSize: '0.5rem',
                            letterSpacing: '0.06em', fontFamily: 'var(--font-mono)',
                            color: 'rgba(0,0,0,0.25)' }}>
                  General legal information · Not a substitute for qualified legal counsel
                </p>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
