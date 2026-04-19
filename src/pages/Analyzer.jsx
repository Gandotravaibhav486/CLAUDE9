import { useState } from 'react'
import Header     from '../components/Header.jsx'
import UploadZone from '../components/UploadZone.jsx'
import ClauseCard, { RISK_COLOR, RISK_LABEL } from '../components/ClauseCard.jsx'
import HiddenRefs from '../components/HiddenRefs.jsx'
import ChatBot    from '../components/ChatBot.jsx'
import { analyzeContract } from '../utils/analyzeContract.js'
import FeedbackForm from '../components/FeedbackForm.jsx'

const FILTERS = [
  { id: 'all',    label: 'All' },
  { id: 'unfair', label: 'Unfair' },
  { id: 'high',   label: 'High Risk' },
  { id: 'medium', label: 'Medium Risk' },
  { id: 'low',    label: 'Low Risk' },
  { id: 'key',    label: 'Key Clause' },
]

function computeValueAtRisk(clauses) {
  if (!clauses?.length) return 0
  return clauses.reduce((sum, c) => sum + (Number(c.valueAtRisk?.computed) || 0), 0)
}

function formatINR(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(2)} L`
  if (amount >= 1000)     return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount.toLocaleString('en-IN')}`
}

function ValueAtRisk({ amount, perspective }) {
  if (!amount) return null
  const subtext = perspective === 'owner'
    ? 'unprotected exposure in this contract'
    : 'above fair market / legal norms'
  return (
    <div style={{
      background: '#0f0f0f',
      border: '1px solid #ef444433',
      borderRadius: '12px',
      padding: '20px 28px',
      textAlign: 'right',
      minWidth: '200px',
      flexShrink: 0,
    }}>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
        color: '#3a3530', letterSpacing: '0.2em', margin: '0 0 8px',
      }}>TOTAL VALUE AT RISK</p>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 'clamp(24px, 4vw, 36px)',
        color: '#ef4444', fontWeight: 700,
        letterSpacing: '-0.03em', margin: 0,
        textShadow: '0 0 24px #ef444455',
      }}>{formatINR(amount)}</p>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: '11px',
        color: '#3a3530', margin: '6px 0 0',
      }}>{subtext}</p>
    </div>
  )
}

function computeRiskScore(clauses) {
  if (!clauses?.length) return 0
  const weights = { unfair: 10, high: 8, medium: 6, low: 4, info: 0 }
  const raw = clauses.reduce((sum, c) => sum + (weights[c.risk] ?? 0), 0)
  const maxPossible = clauses.length * 10
  return Math.min(100, Math.round((raw / maxPossible) * 100))
}

function SectionLabel({ children }) {
  return (
    <span style={{
      display: 'inline-block', fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px', color: '#c8a96e', letterSpacing: '0.2em',
      padding: '4px 14px', border: '1px solid #c8a96e33',
      borderRadius: '999px', background: '#c8a96e0a', marginBottom: '20px',
    }}>{children}</span>
  )
}

function GlowButton({ children, onClick }) {
  return (
    <div onClick={onClick} style={{ position: 'relative', display: 'inline-block', padding: '2px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{
        position: 'absolute', width: '200%', height: '200%', top: '-50%', left: '-50%',
        background: 'conic-gradient(from 0deg, transparent 0deg, #c8a96e 90deg, transparent 180deg)',
        animation: 'rotateBorder 3s linear infinite',
      }} />
      <div style={{
        position: 'relative', background: '#0d0d0d', color: '#c8a96e',
        fontFamily: "'IBM Plex Mono', monospace", borderRadius: '8px',
        padding: '14px 36px', fontSize: '13px', letterSpacing: '0.18em',
        fontWeight: 500, zIndex: 1, userSelect: 'none',
      }}>{children}</div>
    </div>
  )
}

function RiskMeter({ overallRisk, riskSummary, score }) {
  const color = RISK_COLOR[overallRisk] ?? '#6b6154'
  const pct   = score

  return (
    <div style={{
      background: '#0f0f0f', border: '1px solid #1a1a1a',
      borderRadius: '10px', padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#3a3530', letterSpacing: '0.2em', margin: 0 }}>OVERALL RISK</p>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px', color, fontWeight: 600, letterSpacing: '-0.02em' }}>{pct}%</span>
      </div>

      {/* Gradient meter */}
      <div style={{ position: 'relative', height: '8px', borderRadius: '999px', background: 'linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 85%, #a855f7 100%)', marginBottom: '8px' }}>
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: '14px', height: '14px', borderRadius: '50%',
          background: color, border: '2px solid #080808',
          boxShadow: `0 0 8px ${color}88`,
          transition: 'left 0.6s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        {['LOW', 'MED', 'HIGH'].map(l => (
          <span key={l} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: '#2a2520', letterSpacing: '0.1em' }}>{l}</span>
        ))}
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: `${color}0d`, border: `1px solid ${color}33`,
        borderRadius: '6px', padding: '6px 12px', marginBottom: '12px',
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color, letterSpacing: '0.1em' }}>
          {overallRisk?.toUpperCase()} RISK
        </span>
      </div>

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#6b6154', lineHeight: '1.6', margin: 0 }}>
        {riskSummary}
      </p>
    </div>
  )
}

function ClauseBreakdown({ clauses }) {
  const counts = ['unfair', 'high', 'medium', 'low', 'info'].map(r => ({
    risk: r,
    count: clauses.filter(c => c.risk === r).length,
    color: RISK_COLOR[r],
    label: RISK_LABEL[r],
  })).filter(x => x.count > 0)

  const total = clauses.length

  return (
    <div style={{
      background: '#0f0f0f', border: '1px solid #1a1a1a',
      borderRadius: '10px', padding: '20px', marginTop: '12px',
    }}>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
        color: '#3a3530', letterSpacing: '0.2em', marginBottom: '14px',
      }}>CLAUSE BREAKDOWN</p>

      {counts.map(({ risk, count, color, label }) => (
        <div key={risk} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color, letterSpacing: '0.08em' }}>
              {label}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#3a3530' }}>{count}</span>
          </div>
          <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '999px' }}>
            <div style={{
              height: '100%', borderRadius: '999px',
              background: color, width: `${(count / total) * 100}%`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      ))}

      <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#3a3530', letterSpacing: '0.1em' }}>TOTAL CLAUSES</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#c8a96e' }}>{total}</span>
      </div>
    </div>
  )
}

function FilterTabs({ active, onChange, clauses }) {
  const counts = {
    all:    clauses.length,
    unfair: clauses.filter(c => c.risk === 'unfair').length,
    high:   clauses.filter(c => c.risk === 'high').length,
    medium: clauses.filter(c => c.risk === 'medium').length,
    low:    clauses.filter(c => c.risk === 'low').length,
    key:    clauses.filter(c => c.isKeyClause).length,
  }

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
      {FILTERS.filter(f => counts[f.id] > 0 || f.id === 'all').map(f => {
        const isActive = active === f.id
        const color = f.id === 'unfair' ? RISK_COLOR.unfair
                    : f.id === 'high'   ? RISK_COLOR.high
                    : f.id === 'medium' ? RISK_COLOR.medium
                    : f.id === 'low'    ? RISK_COLOR.low
                    : '#c8a96e'
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
              letterSpacing: '0.1em', padding: '6px 14px',
              borderRadius: '999px', cursor: 'pointer', border: '1px solid',
              borderColor: isActive ? color : '#1a1a1a',
              background: isActive ? `${color}12` : 'transparent',
              color: isActive ? color : '#3a3530',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
            {counts[f.id] > 0 && (
              <span style={{ marginLeft: '6px', opacity: 0.6 }}>{counts[f.id]}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function Analyzer() {
  const [upload,      setUpload]      = useState(null)
  const [analyzing,   setAnalyzing]   = useState(false)
  const [results,     setResults]     = useState(null)
  const [error,       setError]       = useState(null)
  const [filter,      setFilter]      = useState('all')
  const [mainTab,     setMainTab]     = useState('clauses')
  const [chatSeed,    setChatSeed]    = useState(null)
  const [perspective, setPerspective] = useState('tenant')

  const runAnalysis = async () => {
    if (!upload) return
    setAnalyzing(true)
    setError(null)
    setResults(null)
    setFilter('all')
    setMainTab('clauses')
    try {
      const data = await analyzeContract({ files: upload.files, mode: upload.mode, perspective })
      setResults(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleAskAssistant = (clause) => {
    setChatSeed(`Tell me more about the "${clause.title}" clause and what I should do about it.`)
  }

  const filteredClauses = results?.clauses ? (
    filter === 'all'    ? results.clauses :
    filter === 'key'    ? results.clauses.filter(c => c.isKeyClause) :
    results.clauses.filter(c => c.risk === filter)
  ) : []

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <Header />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 32px 80px' }}>

        {/* UPLOAD */}
        <div style={{ maxWidth: '700px', marginBottom: '48px', animation: 'fadeIn 0.5s ease both' }}>
          <SectionLabel>✦ UPLOAD CONTRACT</SectionLabel>
          <h1 style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 'clamp(20px, 3vw, 28px)', color: '#f0ede8',
            fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.01em',
          }}>Analyse your rental agreement</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6b6154', marginBottom: '24px' }}>
            Upload images or a PDF — all clauses extracted, hidden legal references flagged.
          </p>

          {/* Perspective toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '28px', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '6px 8px' }}>
            {[
              { id: 'tenant', label: 'TENANT', color: '#22c55e', desc: 'Deposit risk · Hidden costs · Eviction' },
              { id: 'owner',  label: 'OWNER',  color: '#3b82f6', desc: 'Rent default · Damage · Enforceability' },
            ].map(opt => {
              const active = perspective === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setPerspective(opt.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    gap: '3px', padding: '10px 18px', borderRadius: '7px',
                    border: active ? `1px solid ${opt.color}44` : '1px solid transparent',
                    background: active ? `${opt.color}0f` : 'transparent',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: active ? opt.color : '#2a2520',
                      boxShadow: active ? `0 0 8px ${opt.color}88` : 'none',
                      transition: 'all 0.2s',
                    }} />
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                      color: active ? opt.color : '#3a3530',
                      letterSpacing: '0.14em', transition: 'color 0.2s',
                    }}>{opt.label}</span>
                  </div>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: '10px',
                    color: active ? `${opt.color}99` : '#2a2520',
                    letterSpacing: '0.01em', paddingLeft: '15px',
                    transition: 'color 0.2s',
                  }}>{opt.desc}</span>
                </button>
              )
            })}
          </div>

          <UploadZone onFileSelect={setUpload} analyzing={analyzing} />

          {upload && !analyzing && (
            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <GlowButton onClick={runAnalysis}>RUN ANALYSIS →</GlowButton>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '20px', padding: '16px 20px',
              background: '#ef44440a', border: '1px solid #ef444433',
              borderRadius: '8px', fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px', color: '#ef4444', letterSpacing: '0.05em',
            }}>⚠ {error}</div>
          )}
        </div>

        {/* RESULTS */}
        {results && (
          <div style={{ animation: 'fadeInUp 0.6s ease both' }}>

            {/* Title + Summary + Value at Risk */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                {results.title && (
                  <h2 style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px',
                    color: '#f0ede8', fontWeight: 600, marginBottom: '10px', letterSpacing: '-0.01em',
                  }}>{results.title}</h2>
                )}
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#6b6154', lineHeight: '1.75', maxWidth: '700px' }}>
                  {results.summary}
                </p>
              </div>
              <ValueAtRisk amount={computeValueAtRisk(results.clauses)} perspective={perspective} />
            </div>

            {/* Two-column layout: sidebar + clauses */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }}>

              {/* SIDEBAR */}
              <div style={{ position: 'sticky', top: '76px' }}>
                {results.overallRisk && (
                  <RiskMeter
                    overallRisk={results.overallRisk}
                    riskSummary={results.riskSummary}
                    score={computeRiskScore(results.clauses)}
                  />
                )}
                {results.clauses?.length > 0 && (
                  <ClauseBreakdown clauses={results.clauses} />
                )}

                {/* Hidden refs count pill in sidebar */}
                {results.hiddenReferences?.length > 0 && (
                  <button
                    onClick={() => setMainTab('refs')}
                    style={{
                      width: '100%', marginTop: '12px',
                      background: '#0f0f0f', border: '1px solid #1a1a1a',
                      borderRadius: '10px', padding: '14px 16px',
                      cursor: 'pointer', textAlign: 'left',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#c8a96e33'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
                  >
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#3a3530', letterSpacing: '0.2em' }}>
                      HIDDEN REFERENCES
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#c8a96e' }}>
                      {results.hiddenReferences.length} →
                    </span>
                  </button>
                )}
              </div>

              {/* MAIN: tab switcher + content */}
              <div>
                {/* Main tab bar */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #1a1a1a', paddingBottom: '0' }}>
                  {[
                    { id: 'clauses', label: 'Clauses', count: results.clauses?.length ?? 0 },
                    { id: 'refs',    label: 'Hidden References', count: results.hiddenReferences?.length ?? 0 },
                  ].map(tab => {
                    const active = mainTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setMainTab(tab.id)}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                          letterSpacing: '0.1em', padding: '10px 16px',
                          cursor: 'pointer', background: 'transparent',
                          border: 'none', borderBottom: `2px solid ${active ? '#c8a96e' : 'transparent'}`,
                          color: active ? '#c8a96e' : '#3a3530',
                          marginBottom: '-1px', transition: 'color 0.15s, border-color 0.15s',
                        }}
                      >
                        {tab.label}
                        {tab.count > 0 && (
                          <span style={{ marginLeft: '6px', opacity: 0.5, fontSize: '10px' }}>{tab.count}</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Clauses tab */}
                {mainTab === 'clauses' && results.clauses?.length > 0 && (
                  <>
                    <FilterTabs active={filter} onChange={setFilter} clauses={results.clauses} />
                    {filteredClauses.length === 0 ? (
                      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#2a2520', letterSpacing: '0.1em', padding: '24px 0' }}>
                        NO CLAUSES IN THIS CATEGORY
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {filteredClauses.map((clause, i) => (
                          <ClauseCard
                            key={clause.id}
                            clause={clause}
                            index={i}
                            animationDelay={i * 0.04}
                            onAskAssistant={handleAskAssistant}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Hidden References tab */}
                {mainTab === 'refs' && (
                  <HiddenRefs refs={results.hiddenReferences ?? []} />
                )}
              </div>
            </div>

            <FeedbackForm
              perspective={perspective}
              overallRisk={results.overallRisk}
              clauseCount={results.clauses?.length ?? 0}
            />

          </div>
        )}
      </div>

      {results && (
        <ChatBot
          contractText=""
          results={results}
          seedMessage={chatSeed}
        />
      )}
    </div>
  )
}
