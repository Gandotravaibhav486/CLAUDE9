import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

const SEPARATOR = (
  <div style={{
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, #c8a96e44 30%, #c8a96e88 50%, #c8a96e44 70%, transparent 100%)',
  }} />
)

function Pill({ children }) {
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px',
      color: '#c8a96e',
      letterSpacing: '0.2em',
      padding: '4px 14px',
      border: '1px solid #c8a96e33',
      borderRadius: '999px',
      background: '#c8a96e0a',
      marginBottom: '24px',
    }}>{children}</span>
  )
}

function GlowButton({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '2px',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <div style={{
        position: 'absolute',
        width: '200%', height: '200%',
        top: '-50%', left: '-50%',
        background: 'conic-gradient(from 0deg, transparent 0deg, #c8a96e 90deg, transparent 180deg)',
        animation: 'rotateBorder 3s linear infinite',
      }} />
      <div style={{
        position: 'relative',
        background: '#0d0d0d',
        color: '#c8a96e',
        fontFamily: "'IBM Plex Mono', monospace",
        borderRadius: '8px',
        padding: '16px 40px',
        fontSize: '13px',
        letterSpacing: '0.18em',
        fontWeight: 500,
        zIndex: 1,
        userSelect: 'none',
      }}>{children}</div>
    </div>
  )
}

const SCROLL_ITEMS = [
  '4/5 INDIANS SIGN WITHOUT READING',
  '1 IN 3 TENANTS LOSE THEIR DEPOSIT',
  'AVG ₹80,000 DEPOSIT AT RISK',
  '67% OF CONTRACTS HAVE HIDDEN CHARGES',
  'ANALYSIS IN UNDER 60 SECONDS',
  'RISK SCORE  0 — 100',
  '₹ IMPACT QUANTIFIED PER CLAUSE',
  'CLAUSE-BY-CLAUSE BREAKDOWN',
  'EXACT FIX SUGGESTIONS INCLUDED',
  'TENANT VS OWNER BIAS DETECTED',
]

function ScrollStrip() {
  const items = [...SCROLL_ITEMS, ...SCROLL_ITEMS]
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '14px 0' }}>
      <div style={{
        display: 'flex',
        gap: '48px',
        width: 'max-content',
        animation: 'scrollLeft 28s linear infinite',
      }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', whiteSpace: 'nowrap' }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#6b6154',
              letterSpacing: '0.15em',
            }}>{item}</span>
            <span style={{ color: '#c8a96e44', fontSize: '16px' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const STEPS = [
  {
    num: '01',
    title: 'UPLOAD',
    desc: 'Drop your rental agreement — PDF, DOC, or TXT. We read every line.',
  },
  {
    num: '02',
    title: 'ANALYSE',
    desc: 'AI scans every clause for risk, bias, and illegality. Done in under 60 seconds.',
  },
  {
    num: '03',
    title: 'PROTECT',
    desc: 'See your risk score, financial impact in ₹, and get exact clause rewrites to demand.',
  },
]

const FEATURES = [
  { icon: '◎', label: 'Risk Score', desc: 'Instant 0–100 score for the entire agreement' },
  { icon: '⟷', label: 'Bias Analysis', desc: 'Tenant vs Owner bias quantified as a percentage' },
  { icon: '₹',  label: 'Financial Impact', desc: 'Every risk tied to an estimated ₹ loss amount' },
  { icon: '⚑', label: 'Clause Detection', desc: 'Illegal, unfair, and risky clauses highlighted' },
  { icon: '✎', label: 'Fix Suggestions', desc: 'Exact safer rewrites ready to paste in' },
  { icon: '⚖', label: 'Chat Assistant', desc: 'Ask questions about your specific contract' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '100px',
        textAlign: 'center',
        maxWidth: '760px',
        margin: '0 auto',
        padding: '160px 32px 100px',
        animation: 'fadeInUp 0.7s ease both',
      }}>
        <Pill>✦ INTRODUCING CLAUDE9</Pill>

        <h1 style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 600,
          color: '#f0ede8',
          lineHeight: 1.15,
          marginBottom: '16px',
          letterSpacing: '-0.02em',
        }}>
          Your rental agreement<br />
          <span style={{ color: '#c8a96e' }}>might be costing you money.</span>
        </h1>

        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '18px',
          color: '#3a3530',
          marginBottom: '20px',
          letterSpacing: '0.05em',
        }}>Find out in 60 seconds.</p>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          color: '#6b6154',
          lineHeight: '1.7',
          maxWidth: '520px',
          margin: '0 auto 48px',
        }}>
          AI-powered legal analyser that identifies unfair clauses, calculates your
          financial risk in ₹, and tells you exactly what to fix — before you sign.
        </p>

        <GlowButton onClick={() => navigate('/analyze')}>
          ANALYSE YOUR CONTRACT →
        </GlowButton>

        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          color: '#3a3530',
          marginTop: '20px',
          letterSpacing: '0.1em',
        }}>FREE · NO ACCOUNT REQUIRED · RESULTS IN &lt;60s</p>
      </section>

      {/* ── SCROLL STRIP ─────────────────────────────────────── */}
      <ScrollStrip />

      {SEPARATOR}

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ padding: '96px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Pill>✦ HOW IT WORKS</Pill>
          <h2 style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 'clamp(22px, 3vw, 32px)',
            color: '#f0ede8',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}>Three steps. Under a minute.</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {STEPS.map(step => (
            <div
              key={step.num}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#c8a96e44'
                e.currentTarget.style.boxShadow  = '0 0 24px #c8a96e11'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1a1a1a'
                e.currentTarget.style.boxShadow  = 'none'
              }}
              style={{
                background: '#0f0f0f',
                border: '1px solid #1a1a1a',
                borderRadius: '10px',
                padding: '32px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            >
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#c8a96e',
                letterSpacing: '0.2em',
                display: 'block',
                marginBottom: '16px',
              }}>{step.num}</span>
              <h3 style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '18px',
                color: '#f0ede8',
                fontWeight: 600,
                marginBottom: '12px',
                letterSpacing: '0.05em',
              }}>{step.title}</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                color: '#6b6154',
                lineHeight: '1.65',
              }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {SEPARATOR}

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section style={{ padding: '96px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Pill>✦ WHAT YOU GET</Pill>
          <h2 style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 'clamp(22px, 3vw, 32px)',
            color: '#f0ede8',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}>Everything you need to sign safely.</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
        }}>
          {FEATURES.map(f => (
            <div
              key={f.label}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#c8a96e44'
                e.currentTarget.style.boxShadow  = '0 0 24px #c8a96e11'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1a1a1a'
                e.currentTarget.style.boxShadow  = 'none'
              }}
              style={{
                background: '#0f0f0f',
                border: '1px solid #1a1a1a',
                borderRadius: '10px',
                padding: '28px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
              }}
            >
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '22px',
                color: '#c8a96e',
                lineHeight: 1,
                paddingTop: '2px',
                minWidth: '28px',
              }}>{f.icon}</span>
              <div>
                <h4 style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '13px',
                  color: '#f0ede8',
                  fontWeight: 600,
                  marginBottom: '6px',
                  letterSpacing: '0.05em',
                }}>{f.label}</h4>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  color: '#6b6154',
                  lineHeight: '1.55',
                  margin: 0,
                }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {SEPARATOR}

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section style={{
        padding: '72px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1px',
        background: '#1a1a1a',
        maxWidth: '100%',
      }}>
        {[
          { stat: '4/5', label: 'Indians sign without reading' },
          { stat: '1/3', label: 'Tenants face deposit disputes' },
          { stat: '₹80K', label: 'Average deposit at risk' },
          { stat: '<60s', label: 'Time to full analysis' },
        ].map(({ stat, label }) => (
          <div key={stat} style={{
            background: '#080808',
            padding: '40px 32px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 'clamp(28px, 4vw, 40px)',
              color: '#c8a96e',
              fontWeight: 600,
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}>{stat}</p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: '#6b6154',
            }}>{label}</p>
          </div>
        ))}
      </section>

      {SEPARATOR}

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section style={{ padding: '112px 32px', textAlign: 'center' }}>
        <Pill>✦ GET STARTED</Pill>
        <h2 style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 'clamp(24px, 4vw, 40px)',
          color: '#f0ede8',
          fontWeight: 600,
          marginBottom: '16px',
          letterSpacing: '-0.01em',
        }}>Read what you're signing.</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          color: '#6b6154',
          marginBottom: '48px',
          maxWidth: '440px',
          margin: '0 auto 48px',
          lineHeight: '1.65',
        }}>Upload your agreement now. Know your risks before it's too late.</p>
        <GlowButton onClick={() => navigate('/analyze')}>
          START ANALYSIS — FREE →
        </GlowButton>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #1a1a1a',
        padding: '28px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          color: '#3a3530',
          letterSpacing: '0.1em',
        }}>CLAUDE9</span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          color: '#3a3530',
        }}>Not legal advice. For informational use only.</span>
      </footer>
    </div>
  )
}
