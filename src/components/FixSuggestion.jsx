import { useState } from 'react'

export default function FixSuggestion({ fix }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(fix.suggestedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      background: '#0f0f0f',
      border: '1px solid #1a1a1a',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 0 0 1px #c8a96e22',
    }}>
      <div style={{ marginBottom: '14px' }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: '#ff444477',
          letterSpacing: '0.15em',
          display: 'block',
          marginBottom: '8px',
        }}>— ORIGINAL</span>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          color: '#6b6154',
          lineHeight: '1.6',
          background: '#ff44440a',
          border: '1px solid #ff444422',
          borderRadius: '6px',
          padding: '12px',
          margin: 0,
          textDecoration: 'line-through',
        }}>{fix.originalText}</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: '#22c55e77',
          letterSpacing: '0.15em',
          display: 'block',
          marginBottom: '8px',
        }}>+ SUGGESTED FIX</span>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          color: '#f0ede8',
          lineHeight: '1.6',
          background: '#22c55e0a',
          border: '1px solid #22c55e22',
          borderRadius: '6px',
          padding: '12px',
          margin: 0,
        }}>{fix.suggestedText}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: '#6b6154',
          margin: 0,
          flex: 1,
        }}>{fix.reason}</p>
        <button
          onClick={copy}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: copied ? '#22c55e' : '#c8a96e',
            background: 'transparent',
            border: `1px solid ${copied ? '#22c55e44' : '#c8a96e44'}`,
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >{copied ? 'COPIED ✓' : 'COPY FIX'}</button>
      </div>
    </div>
  )
}
