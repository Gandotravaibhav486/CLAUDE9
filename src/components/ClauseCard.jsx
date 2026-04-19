import { useState } from 'react'

const TYPE_COLOR = {
  illegal: '#ff4444',
  unfair:  '#f5a623',
  risky:   '#c8a96e',
  neutral: '#6b6154',
}

export default function ClauseCard({ clause }) {
  const [expanded, setExpanded] = useState(false)
  const color = TYPE_COLOR[clause.type] ?? '#6b6154'

  return (
    <div
      onClick={() => setExpanded(x => !x)}
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
        borderLeft: `3px solid ${color}`,
        borderRadius: '10px',
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color,
            padding: '3px 10px',
            border: `1px solid ${color}33`,
            borderRadius: '999px',
            background: `${color}0d`,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>{clause.type}</span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#3a3530',
            letterSpacing: '0.1em',
          }}>{clause.severity} severity</span>
        </div>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '14px',
          color: '#3a3530',
          userSelect: 'none',
        }}>{expanded ? '−' : '+'}</span>
      </div>

      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        color: '#f0ede8',
        lineHeight: '1.6',
        margin: '12px 0 0',
        display: '-webkit-box',
        WebkitLineClamp: expanded ? 'unset' : 2,
        WebkitBoxOrient: 'vertical',
        overflow: expanded ? 'visible' : 'hidden',
      }}>{clause.originalText}</p>

      {expanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1a1a1a' }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: '#6b6154',
            lineHeight: '1.6',
            margin: '0 0 12px',
          }}>{clause.explanation}</p>
          {clause.legalRef && (
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#c8a96e',
              background: '#c8a96e0a',
              border: '1px solid #c8a96e22',
              padding: '4px 10px',
              borderRadius: '999px',
              letterSpacing: '0.05em',
            }}>⚖ {clause.legalRef}</span>
          )}
        </div>
      )}
    </div>
  )
}
