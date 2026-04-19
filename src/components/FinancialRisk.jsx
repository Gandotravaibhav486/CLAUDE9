const SEV = { high: '#ff4444', medium: '#f5a623', low: '#22c55e' }

export default function FinancialRisk({ risks }) {
  return (
    <div style={{
      background: '#0f0f0f',
      border: '1px solid #1a1a1a',
      borderRadius: '10px',
      padding: '28px',
      boxShadow: '0 0 0 1px #c8a96e22',
    }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        color: '#6b6154',
        letterSpacing: '0.2em',
        display: 'block',
        marginBottom: '20px',
      }}>FINANCIAL RISKS</span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {risks.map((risk, i) => (
          <div key={i} style={{
            background: '#141414',
            border: '1px solid #1a1a1a',
            borderLeft: `3px solid ${SEV[risk.severity]}`,
            borderRadius: '8px',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px',
                color: '#f0ede8',
                fontWeight: 500,
              }}>{risk.title}</span>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '13px',
                color: SEV[risk.severity],
                fontWeight: 600,
                whiteSpace: 'nowrap',
                marginLeft: '16px',
              }}>{risk.estimatedImpact}</span>
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: '#6b6154',
              lineHeight: '1.5',
              margin: 0,
            }}>{risk.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
