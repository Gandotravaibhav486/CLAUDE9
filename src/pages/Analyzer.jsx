import { useState } from 'react'
import Header      from '../components/Header.jsx'
import UploadZone  from '../components/UploadZone.jsx'
import RiskScore   from '../components/RiskScore.jsx'
import BiasBar     from '../components/BiasBar.jsx'
import FinancialRisk  from '../components/FinancialRisk.jsx'
import ClauseCard  from '../components/ClauseCard.jsx'
import FixSuggestion  from '../components/FixSuggestion.jsx'
import ChatBot     from '../components/ChatBot.jsx'
import { compress } from '../utils/compress.js'

const SEPARATOR = (
  <div style={{
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, #c8a96e44 30%, #c8a96e88 50%, #c8a96e44 70%, transparent 100%)',
    margin: '0',
  }} />
)

function SectionLabel({ children }) {
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
      marginBottom: '20px',
    }}>{children}</span>
  )
}

function GlowButton({ children, onClick, disabled }) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '2px',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
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
        padding: '14px 36px',
        fontSize: '13px',
        letterSpacing: '0.18em',
        fontWeight: 500,
        zIndex: 1,
        userSelect: 'none',
      }}>{children}</div>
    </div>
  )
}

export default function Analyzer() {
  const [file,      setFile]      = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results,   setResults]   = useState(null)
  const [error,     setError]     = useState(null)
  const [rawText,   setRawText]   = useState('')

  const readFile = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(f)
  })

  const runAnalysis = async () => {
    if (!file) return
    setAnalyzing(true)
    setError(null)
    setResults(null)
    try {
      const text = compress(await readFile(file))
      setRawText(text)
      const res  = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText: text }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Analysis failed')
      setResults(await res.json())
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <Header />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 32px 80px' }}>

        {/* ── UPLOAD ─────────────────────────────────────────── */}
        <div style={{ marginBottom: '40px', animation: 'fadeIn 0.5s ease both' }}>
          <SectionLabel>✦ UPLOAD CONTRACT</SectionLabel>
          <h1 style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 'clamp(20px, 3vw, 28px)',
            color: '#f0ede8',
            fontWeight: 600,
            marginBottom: '8px',
            letterSpacing: '-0.01em',
          }}>Analyse your rental agreement</h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: '#6b6154',
            marginBottom: '28px',
          }}>Upload a TXT file for best results. PDF/DOC support requires text extraction on the server.</p>

          <UploadZone onFileSelect={setFile} analyzing={analyzing} />

          {file && !analyzing && (
            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <GlowButton onClick={runAnalysis}>
                RUN ANALYSIS →
              </GlowButton>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '20px',
              padding: '16px 20px',
              background: '#ff44440a',
              border: '1px solid #ff444433',
              borderRadius: '8px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              color: '#ff4444',
              letterSpacing: '0.05em',
            }}>⚠ {error}</div>
          )}
        </div>

        {/* ── RESULTS ────────────────────────────────────────── */}
        {results && (
          <div style={{ animation: 'fadeInUp 0.6s ease both' }}>

            {SEPARATOR}

            {/* Summary */}
            {results.summary && (
              <div style={{
                padding: '32px 0',
                borderBottom: '1px solid #1a1a1a',
              }}>
                <SectionLabel>✦ SUMMARY</SectionLabel>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '15px',
                  color: '#6b6154',
                  lineHeight: '1.75',
                }}>{results.summary}</p>
              </div>
            )}

            {SEPARATOR}

            {/* Risk Score + Bias Bar */}
            <div style={{ padding: '40px 0' }}>
              <SectionLabel>✦ OVERVIEW</SectionLabel>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '16px',
                alignItems: 'stretch',
              }}>
                <RiskScore score={results.riskScore ?? 0} />
                <BiasBar
                  tenantBias={results.tenantBias ?? 50}
                  ownerBias={results.ownerBias  ?? 50}
                />
              </div>
            </div>

            {SEPARATOR}

            {/* Financial Risks */}
            {results.financialRisks?.length > 0 && (
              <div style={{ padding: '40px 0' }}>
                <SectionLabel>✦ FINANCIAL RISKS</SectionLabel>
                <FinancialRisk risks={results.financialRisks} />
              </div>
            )}

            {SEPARATOR}

            {/* Clauses */}
            {results.clauses?.length > 0 && (
              <div style={{ padding: '40px 0' }}>
                <SectionLabel>✦ CLAUSE ANALYSIS</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {results.clauses.map(clause => (
                    <ClauseCard key={clause.id} clause={clause} />
                  ))}
                </div>
              </div>
            )}

            {SEPARATOR}

            {/* Fix Suggestions */}
            {results.fixes?.length > 0 && (
              <div style={{ padding: '40px 0' }}>
                <SectionLabel>✦ SUGGESTED FIXES</SectionLabel>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  color: '#6b6154',
                  marginBottom: '20px',
                }}>Copy these and request changes before signing.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {results.fixes.map((fix, i) => (
                    <FixSuggestion key={i} fix={fix} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {results && <ChatBot contractText={rawText} results={results} />}
    </div>
  )
}
