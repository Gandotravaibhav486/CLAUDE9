import { useNavigate } from 'react-router-dom'

export default function AuthPromptModal({ onClose }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#000000aa', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0f0f0f', border: '1px solid #1a1a1a',
          borderRadius: '14px', padding: '32px', maxWidth: '360px',
          width: '100%', textAlign: 'center',
        }}
      >
        <span style={{
          display: 'inline-block', fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px', color: '#c8a96e', letterSpacing: '0.2em',
          padding: '4px 14px', border: '1px solid #c8a96e33',
          borderRadius: '999px', background: '#c8a96e0a', marginBottom: '18px',
        }}>✦ SIGN IN REQUIRED</span>

        <h2 style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '16px',
          color: '#f0ede8', fontWeight: 600, margin: '0 0 10px',
        }}>Sign in to analyse a contract</h2>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '13px',
          color: '#6b6154', lineHeight: '1.6', margin: '0 0 24px',
        }}>
          Create a free account to upload contracts and keep track of every analysis you run.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
              letterSpacing: '0.1em', padding: '11px 18px', borderRadius: '8px',
              border: '1px solid #1a1a1a', background: 'transparent',
              color: '#6b6154', cursor: 'pointer',
            }}
          >CANCEL</button>
          <button
            onClick={() => navigate('/login')}
            style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
              letterSpacing: '0.1em', padding: '11px 22px', borderRadius: '8px',
              border: 'none', background: '#c8a96e', color: '#0d0d0d',
              fontWeight: 600, cursor: 'pointer',
            }}
          >SIGN IN →</button>
        </div>
      </div>
    </div>
  )
}
