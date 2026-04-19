import { useState } from 'react'

export const RISK_COLOR = {
  unfair: '#a855f7',
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#22c55e',
  info:   '#3b82f6',
}

export const RISK_LABEL = {
  unfair: 'UNFAIR',
  high:   'HIGH RISK',
  medium: 'MEDIUM RISK',
  low:    'LOW RISK',
  info:   'INFO',
}

export default function ClauseCard({ clause, index, onAskAssistant, animationDelay = 0 }) {
  const [expanded, setExpanded] = useState(false)
  const color = RISK_COLOR[clause.risk] ?? '#6b6154'
  const num   = String(index + 1).padStart(2, '0')

  return (
    <div style={{
      background: '#0c0c0c',
      border: '1px solid #1a1a1a',
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      overflow: 'hidden',
      animation: 'fadeInUp 0.4s ease both',
      animationDelay: `${animationDelay}s`,
    }}>
      {/* Header — always visible, clickable */}
      <div
        onClick={() => setExpanded(x => !x)}
        onMouseEnter={e => e.currentTarget.style.background = '#111'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 20px', cursor: 'pointer', transition: 'background 0.15s',
        }}
      >
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
          color: '#3a3530', letterSpacing: '0.05em', flexShrink: 0,
        }}>§{num}</span>

        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: '14px',
          color: '#f0ede8', fontWeight: 500, flex: 1, lineHeight: 1.3,
        }}>{clause.title}</span>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
          {clause.isKeyClause && (
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
              color: '#c8a96e', background: '#c8a96e0d',
              border: '1px solid #c8a96e33', borderRadius: '999px',
              padding: '2px 8px', letterSpacing: '0.12em',
            }}>KEY</span>
          )}
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color,
            background: `${color}0d`, border: `1px solid ${color}33`,
            borderRadius: '999px', padding: '3px 10px', letterSpacing: '0.1em',
          }}>{RISK_LABEL[clause.risk] ?? clause.risk.toUpperCase()}</span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px',
            color: '#3a3530', marginLeft: '4px', userSelect: 'none',
          }}>{expanded ? '−' : '+'}</span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid #1a1a1a', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Original language */}
          <div style={{
            background: '#080808', borderRadius: '6px',
            padding: '14px 16px', borderLeft: `2px solid ${color}44`,
          }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
              color: '#3a3530', letterSpacing: '0.15em', marginBottom: '8px',
            }}>ORIGINAL LANGUAGE</p>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '13px',
              color: '#6b6154', lineHeight: '1.65', margin: 0, fontStyle: 'italic',
            }}>"{clause.originalText}"</p>
          </div>

          {/* Why It Matters + What To Do */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              background: '#080808', borderRadius: '6px', padding: '14px 16px',
            }}>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                color: '#3a3530', letterSpacing: '0.15em', marginBottom: '8px',
              }}>WHY IT MATTERS</p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: '13px',
                color: '#f0ede8', lineHeight: '1.6', margin: 0,
              }}>{clause.riskReason}</p>
            </div>
            <div style={{
              background: `${color}06`, border: `1px solid ${color}1a`,
              borderRadius: '6px', padding: '14px 16px',
            }}>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                color, letterSpacing: '0.15em', marginBottom: '8px',
              }}>WHAT TO DO</p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: '13px',
                color: '#f0ede8', lineHeight: '1.6', margin: 0,
              }}>{clause.recommendation}</p>
            </div>
          </div>

          {/* Legal refs */}
          {clause.relatedRefs?.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {clause.relatedRefs.map((ref, i) => (
                <span key={i} style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                  color: '#c8a96e', background: '#c8a96e0a',
                  border: '1px solid #c8a96e22', padding: '3px 10px',
                  borderRadius: '999px', letterSpacing: '0.05em',
                }}>⚖ {ref}</span>
              ))}
            </div>
          )}

          {/* Value at Risk breakdown */}
          {clause.valueAtRisk?.computed > 0 && (
            <div style={{
              background: '#ef44440a', border: '1px solid #ef444422',
              borderRadius: '6px', padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#ef4444', letterSpacing: '0.15em', margin: 0 }}>VALUE AT RISK</p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#6b6154' }}>
                  Contract: <span style={{ color: '#f0ede8' }}>₹{clause.valueAtRisk.contractAmount?.toLocaleString('en-IN')}</span>
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#6b6154' }}>
                  Fair norm: <span style={{ color: '#f0ede8' }}>₹{clause.valueAtRisk.fairAmount?.toLocaleString('en-IN')}</span>
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>
                  Excess: ₹{clause.valueAtRisk.computed?.toLocaleString('en-IN')}
                </span>
              </div>
              {clause.valueAtRisk.basis && (
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#6b6154', margin: 0, lineHeight: 1.5 }}>{clause.valueAtRisk.basis}</p>
              )}
            </div>
          )}

          {/* Ask assistant */}
          <button
            onClick={e => { e.stopPropagation(); onAskAssistant?.(clause) }}
            style={{
              alignSelf: 'flex-start',
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
              color: '#c8a96e', background: 'transparent',
              border: '1px solid #c8a96e33', borderRadius: '6px',
              padding: '8px 16px', cursor: 'pointer', letterSpacing: '0.1em',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c8a96e88'; e.currentTarget.style.background = '#c8a96e0a' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#c8a96e33'; e.currentTarget.style.background = 'transparent' }}
          >⚖ Ask assistant about this clause</button>
        </div>
      )}
    </div>
  )
}
