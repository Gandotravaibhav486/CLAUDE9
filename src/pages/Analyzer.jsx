import { useState } from 'react'
import Header        from '../components/Header.jsx'
import UploadZone    from '../components/UploadZone.jsx'
import ClauseCard    from '../components/ClauseCard.jsx'
import ChatBot       from '../components/ChatBot.jsx'
import { analyzeContract } from '../utils/analyzeContract.js'

const RISK_COLOR = { high: '#ff4444', medium: '#f5a623', low: '#c8a96e', info: '#6b6154' }

const SEPARATOR = (
  <div style={{
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, #c8a96e44 30%, #c8a96e88 50%, #c8a96e44 70%, transparent 100%)',
  }} />
)

function SectionLabel({ children }) {
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px', color: '#c8a96e',
      letterSpacing: '0.2em', padding: '4px 14px',
      border: '1px solid #c8a96e33', borderRadius: '999px',
      background: '#c8a96e0a', marginBottom: '20px',
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

function OverallRiskBadge({ risk, riskSummary }) {
  const color = RISK_COLOR[risk] ?? '#6b6154'
  return (
    <div style={{
      padding: '24px', background: `${color}08`,
      border: `1px solid ${color}33`, borderRadius: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color,
          padding: '4px 14px', border: `1px solid ${color}44`,
          borderRadius: '999px', letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>{risk} risk</span>
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6b6154', lineHeight: '1.7', margin: 0 }}>
        {riskSummary}
      </p>
    </div>
  )
}

function HiddenRefCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      onClick={() => setExpanded(x => !x)}
      style={{
        background: '#0f0f0f', border: '1px solid #1a1a1a',
        borderLeft: '3px solid #c8a96e44', borderRadius: '10px',
        padding: '16px 20px', cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#c8a96e44'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
          color: '#c8a96e', letterSpacing: '0.1em',
        }}>{item.ref}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '14px', color: '#3a3530' }}>
          {expanded ? '−' : '+'}
        </span>
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: '12px',
        color: '#3a3530', margin: '6px 0 0', fontStyle: 'italic',
        display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 1,
        WebkitBoxOrient: 'vertical', overflow: expanded ? 'visible' : 'hidden',
      }}>{item.context}</p>
      {expanded && (
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '13px',
          color: '#6b6154', lineHeight: '1.6', margin: '12px 0 0',
          paddingTop: '12px', borderTop: '1px solid #1a1a1a',
        }}>{item.explanation}</p>
      )}
    </div>
  )
}

export default function Analyzer() {
  const [upload,    setUpload]    = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results,   setResults]   = useState(null)
  const [error,     setError]     = useState(null)

  const runAnalysis = async () => {
    if (!upload) return
    setAnalyzing(true)
    setError(null)
    setResults(null)
    try {
      const data = await analyzeContract({ files: upload.files, mode: upload.mode })
      setResults(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const clausesByRisk = results ? {
    high:   results.clauses?.filter(c => c.risk === 'high')   ?? [],
    medium: results.clauses?.filter(c => c.risk === 'medium') ?? [],
    low:    results.clauses?.filter(c => c.risk === 'low')    ?? [],
    info:   results.clauses?.filter(c => c.risk === 'info')   ?? [],
  } : null

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <Header />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 32px 80px' }}>

        {/* UPLOAD */}
        <div style={{ marginBottom: '40px', animation: 'fadeIn 0.5s ease both' }}>
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
              background: '#ff44440a', border: '1px solid #ff444433',
              borderRadius: '8px', fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px', color: '#ff4444', letterSpacing: '0.05em',
            }}>⚠ {error}</div>
          )}
        </div>

        {/* RESULTS */}
        {results && (
          <div style={{ animation: 'fadeInUp 0.6s ease both' }}>

            {SEPARATOR}

            {/* Title + Summary */}
            <div style={{ padding: '32px 0' }}>
              <SectionLabel>✦ SUMMARY</SectionLabel>
              {results.title && (
                <h2 style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '18px',
                  color: '#f0ede8', fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.01em',
                }}>{results.title}</h2>
              )}
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#6b6154', lineHeight: '1.75', marginBottom: '20px' }}>
                {results.summary}
              </p>
              {results.overallRisk && (
                <OverallRiskBadge risk={results.overallRisk} riskSummary={results.riskSummary} />
              )}
            </div>

            {SEPARATOR}

            {/* Clauses grouped by risk */}
            {results.clauses?.length > 0 && (
              <div style={{ padding: '40px 0' }}>
                <SectionLabel>✦ CLAUSE ANALYSIS</SectionLabel>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#3a3530', marginBottom: '24px' }}>
                  {results.clauses.length} clauses extracted · click any to expand
                </p>

                {['high', 'medium', 'low', 'info'].map(risk => {
                  const group = clausesByRisk[risk]
                  if (!group.length) return null
                  const color = RISK_COLOR[risk]
                  return (
                    <div key={risk} style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <span style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color,
                          letterSpacing: '0.2em', textTransform: 'uppercase',
                        }}>{risk}</span>
                        <div style={{ flex: 1, height: '1px', background: `${color}22` }} />
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#3a3530' }}>
                          {group.length}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {group.map(clause => <ClauseCard key={clause.id} clause={clause} />)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Hidden References */}
            {results.hiddenReferences?.length > 0 && (
              <>
                {SEPARATOR}
                <div style={{ padding: '40px 0' }}>
                  <SectionLabel>✦ HIDDEN LEGAL REFERENCES</SectionLabel>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#3a3530', marginBottom: '20px' }}>
                    Laws and documents referenced but not explained in the contract.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.hiddenReferences.map((item, i) => (
                      <HiddenRefCard key={i} item={item} />
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>
        )}
      </div>

      {results && <ChatBot contractText="" results={results} />}
    </div>
  )
}
