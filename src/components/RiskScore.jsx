export default function RiskScore({ score }) {
  const color   = score >= 70 ? '#ff4444' : score >= 40 ? '#f5a623' : '#22c55e'
  const label   = score >= 70 ? 'HIGH RISK' : score >= 40 ? 'MODERATE RISK' : 'LOW RISK'
  const radius  = 54
  const circ    = 2 * Math.PI * radius
  const offset  = circ - (score / 100) * circ

  return (
    <div style={{
      background: '#0f0f0f',
      border: '1px solid #1a1a1a',
      borderRadius: '10px',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 0 0 1px #c8a96e22',
    }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        color: '#6b6154',
        letterSpacing: '0.2em',
      }}>RISK SCORE</span>

      <div style={{ position: 'relative', width: '128px', height: '128px' }}>
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="8" />
          <circle
            cx="64" cy="64" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 64 64)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '34px',
            fontWeight: 600,
            color,
            lineHeight: 1,
          }}>{score}</span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#3a3530',
          }}>/100</span>
        </div>
      </div>

      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        color,
        letterSpacing: '0.15em',
        padding: '4px 14px',
        border: `1px solid ${color}44`,
        borderRadius: '999px',
        background: `${color}0d`,
      }}>{label}</span>
    </div>
  )
}
