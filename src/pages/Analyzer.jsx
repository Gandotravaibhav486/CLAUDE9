import { useState } from 'react'
import Header     from '../components/Header.jsx'
import UploadZone from '../components/UploadZone.jsx'
import ClauseCard, { RISK_COLOR, RISK_LABEL } from '../components/ClauseCard.jsx'
import HiddenRefs from '../components/HiddenRefs.jsx'
import ChatBot    from '../components/ChatBot.jsx'
import { analyzeContract } from '../utils/analyzeContract.js'

const FILTERS = [
  { id: 'all',    label: 'All' },
  { id: 'unfair', label: 'Unfair' },
  { id: 'high',   label: 'High Risk' },
  { id: 'medium', label: 'Medium Risk' },
  { id: 'low',    label: 'Low Risk' },
  { id: 'key',    label: 'Key Clause' },
]

const METER_POS = { low: 15, medium: 50, high: 82 }

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

function RiskMeter({ overallRisk, riskSummary }) {
  const color = RISK_COLOR[overallRisk] ?? '#6b6154'
  const pct   = METER_POS[overallRisk] ?? 50

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

  const runAnalysis = async () => {
    if (!upload) return
    setAnalyzing(true)
    setError(null)
    setResults(null)
    setFilter('all')
    setMainTab('clauses')
    try {
      const data = await analyzeContract({ files: upload.files, mode: upload.mode })
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
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6b6154', marginBottom: '28px' }}>
            Upload images or a PDF — all clauses extracted, hidden legal references flagged.
          </p>

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

            {/* Title + Summary */}
            <div style={{ marginBottom: '32px' }}>
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

            {/* Two-column layout: sidebar + clauses */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }}>

              {/* SIDEBAR */}
              <div style={{ position: 'sticky', top: '76px' }}>
                {results.overallRisk && (
                  <RiskMeter overallRisk={results.overallRisk} riskSummary={results.riskSummary} />
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
