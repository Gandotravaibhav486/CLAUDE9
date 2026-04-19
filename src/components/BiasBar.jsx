export default function BiasBar({ tenantBias, ownerBias }) {
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
        marginBottom: '24px',
      }}>BIAS ANALYSIS</span>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>
          TENANT {tenantBias}%
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: '#f5a623', fontWeight: 600 }}>
          OWNER {ownerBias}%
        </span>
      </div>

      <div style={{ height: '8px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
        <div style={{
          width: `${tenantBias}%`,
          background: 'linear-gradient(90deg, #22c55e, #16a34a)',
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        }} />
        <div style={{
          width: `${ownerBias}%`,
          background: 'linear-gradient(90deg, #f5a623, #d97706)',
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>

      <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#6b6154' }}>Tenant favoured</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f5a623' }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#6b6154' }}>Owner favoured</span>
        </div>
      </div>
    </div>
  )
}
