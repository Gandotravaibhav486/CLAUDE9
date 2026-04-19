import { useState } from 'react'

const TYPE_ICON = {
  article:    '⚖',
  section:    '§',
  schedule:   '#',
  act:        '⚖',
  clause:     '§',
  rule:       '§',
  regulation: '§',
}

const IMPORTANCE_COLOR = {
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#22c55e',
}

const IMPORTANCE_LABEL = {
  high:   'High Importance',
  medium: 'Medium Importance',
  low:    'Low Importance',
}

function getIcon(type) {
  if (!type) {
    return '§'
  }
  return TYPE_ICON[type.toLowerCase()] ?? '§'
}

function RefCard({ item, index }) {
  const [expanded, setExpanded] = useState(false)
  const icon  = getIcon(item.type)
  const color = IMPORTANCE_COLOR[item.importance] ?? '#6b6154'
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.ref + ' India law tenant rights rental')}`

  return (
    <div style={{
      background: '#0c0c0c',
      border: '1px solid #1a1a1a',
      borderLeft: `3px solid ${color}44`,
      borderRadius: '10px',
      overflow: 'hidden',
      animation: 'fadeInUp 0.4s ease both',
      animationDelay: `${index * 0.04}s`,
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(x => !x)}
        onMouseEnter={e => e.currentTarget.style.background = '#111'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 18px', cursor: 'pointer', transition: 'background 0.15s',
        }}
      >
        {/* Type icon */}
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '15px',
          color: '#3a3530', flexShrink: 0, width: '20px', textAlign: 'center',
        }}>{icon}</span>

        {/* Importance dot */}
        <div style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: color, flexShrink: 0,
          boxShadow: `0 0 6px ${color}66`,
        }} />

        {/* Ref name */}
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
          color: '#f0ede8', letterSpacing: '0.04em', flex: 1,
        }}>{item.ref}</span>

        {/* Type badge */}
        {item.type && (
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px',
            color: '#2a2520', letterSpacing: '0.12em', textTransform: 'uppercase',
            flexShrink: 0,
          }}>{item.type}</span>
        )}

        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px',
          color: '#3a3530', userSelect: 'none', flexShrink: 0,
        }}>{expanded ? '−' : '+'}</span>
      </div>

      {/* Context preview (collapsed) */}
      {!expanded && item.context && (
        <div style={{ padding: '0 18px 12px 50px' }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '12px',
            color: '#2a2520', margin: 0, fontStyle: 'italic',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>"{item.context}"</p>
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid #1a1a1a', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Importance badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
              color, letterSpacing: '0.12em',
            }}>{IMPORTANCE_LABEL[item.importance] ?? 'REFERENCE'}</span>
          </div>

          {/* Context */}
          {item.context && (
            <div style={{ background: '#080808', borderRadius: '6px', padding: '12px 14px' }}>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                color: '#3a3530', letterSpacing: '0.15em', marginBottom: '8px',
              }}>FOUND IN CONTRACT</p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: '12px',
                color: '#6b6154', lineHeight: '1.65', margin: 0, fontStyle: 'italic',
              }}>"{item.context}"</p>
            </div>
          )}

          {/* Plain English */}
          {item.explanation && (
            <div>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                color: '#3a3530', letterSpacing: '0.15em', marginBottom: '8px',
              }}>WHAT IT MEANS</p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: '13px',
                color: '#f0ede8', lineHeight: '1.65', margin: 0,
              }}>{item.explanation}</p>
            </div>
          )}

          {/* Deep search button */}
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              alignSelf: 'flex-start',
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
              color: '#c8a96e', background: 'transparent',
              border: '1px solid #c8a96e33', borderRadius: '6px',
              padding: '8px 16px', cursor: 'pointer', letterSpacing: '0.1em',
              textDecoration: 'none', display: 'inline-block',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c8a96e88'; e.currentTarget.style.background = '#c8a96e0a' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#c8a96e33'; e.currentTarget.style.background = 'transparent' }}
          >🔍 DEEP SEARCH →</a>
        </div>
      )}
    </div>
  )
}

export default function HiddenRefs({ refs }) {
  const byImportance = {
    high:   refs.filter(r => r.importance === 'high'),
    medium: refs.filter(r => r.importance === 'medium'),
    low:    refs.filter(r => r.importance === 'low'),
    other:  refs.filter(r => !r.importance || !['high','medium','low'].includes(r.importance)),
  }

  if (!refs.length) {
    return (
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
        color: '#2a2520', letterSpacing: '0.1em', padding: '24px 0',
      }}>NO HIDDEN REFERENCES DETECTED</p>
    )
  }

  let globalIndex = 0
  return (
    <div>
      {[
        { key: 'high',   label: 'High Importance',   color: IMPORTANCE_COLOR.high },
        { key: 'medium', label: 'Medium Importance',  color: IMPORTANCE_COLOR.medium },
        { key: 'low',    label: 'Low Importance',     color: IMPORTANCE_COLOR.low },
        { key: 'other',  label: 'Other References',   color: '#3a3530' },
      ].map(({ key, label, color }) => {
        const group = byImportance[key]
        if (!group.length) return null
        return (
          <div key={key} style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                color, letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>{label}</span>
              <div style={{ flex: 1, height: '1px', background: `${color}22` }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#3a3530' }}>
                {group.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {group.map(item => {
                const idx = globalIndex++
                return <RefCard key={item.ref + idx} item={item} index={idx} />
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
