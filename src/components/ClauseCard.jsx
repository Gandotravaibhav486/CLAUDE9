import { useState } from 'react'

const RISK_COLOR = {
  high:   '#ff4444',
  medium: '#f5a623',
  low:    '#c8a96e',
  info:   '#6b6154',
}

export default function ClauseCard({ clause }) {
  const [expanded, setExpanded] = useState(false)
  const color = RISK_COLOR[clause.risk] ?? '#6b6154'

  return (
    <div
      onClick={() => setExpanded(x => !x)}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#c8a96e44'
        e.currentTarget.style.boxShadow   = '0 0 24px #c8a96e11'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1a1a1a'
        e.currentTarget.style.boxShadow   = 'none'
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px', color,
            padding: '3px 10px',
            border: `1px solid ${color}33`,
            borderRadius: '999px',
            background: `${color}0d`,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>{clause.risk}</span>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: '#f0ede8',
            fontWeight: 500,
          }}>{clause.title}</span>
        </div>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '14px',
          color: '#3a3530',
          userSelect: 'none',
          flexShrink: 0,
        }}>{expanded ? '−' : '+'}</span>
      </div>

      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '12px',
        color: '#6b6154',
        lineHeight: '1.6',
        margin: '10px 0 0',
        display: '-webkit-box',
        WebkitLineClamp: expanded ? 'unset' : 2,
        WebkitBoxOrient: 'vertical',
        overflow: expanded ? 'visible' : 'hidden',
        fontStyle: 'italic',
      }}>{clause.originalText}</p>

      {expanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '9px', color: '#3a3530',
              letterSpacing: '0.15em', marginBottom: '6px',
            }}>PLAIN ENGLISH</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#f0ede8', lineHeight: '1.6', margin: 0 }}>
              {clause.plainEnglish}
            </p>
          </div>

          {clause.riskReason && (
            <div>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px', color: '#3a3530',
                letterSpacing: '0.15em', marginBottom: '6px',
              }}>WHY THIS RISK LEVEL</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6b6154', lineHeight: '1.6', margin: 0 }}>
                {clause.riskReason}
              </p>
            </div>
          )}

          {clause.recommendation && (
            <div style={{
              background: `${color}08`,
              border: `1px solid ${color}22`,
              borderRadius: '6px',
              padding: '10px 14px',
            }}>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px', color,
                letterSpacing: '0.15em', marginBottom: '4px',
              }}>RECOMMENDATION</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#f0ede8', lineHeight: '1.5', margin: 0 }}>
                {clause.recommendation}
              </p>
            </div>
          )}

          {clause.relatedRefs?.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {clause.relatedRefs.map((ref, i) => (
                <span key={i} style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px', color: '#c8a96e',
                  background: '#c8a96e0a',
                  border: '1px solid #c8a96e22',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.05em',
                }}>⚖ {ref}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
