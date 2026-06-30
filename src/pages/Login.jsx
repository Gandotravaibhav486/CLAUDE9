import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Login() {
  const { user, signIn, signUp, signInWithGoogle } = useAuth()
  const { colors } = useTheme()
  const navigate = useNavigate()

  const [mode, setMode]       = useState('signin') // signin | signup
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState(null)
  const [status, setStatus]   = useState('idle') // idle | submitting | sent

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setStatus('submitting')
    const { error } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password)

    if (error) {
      setError(error.message)
      setStatus('idle')
      return
    }

    if (mode === 'signup') {
      setStatus('sent')
      return
    }

    navigate('/dashboard')
  }

  const inputStyle = {
    width: '100%',
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '12px 14px',
    color: colors.text,
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }}>
      <Header />

      <div style={{
        maxWidth: '380px', margin: '0 auto', padding: '140px 24px 80px',
        display: 'flex', flexDirection: 'column', gap: '20px',
      }}>
        <div>
          <span style={{
            display: 'inline-block', fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px', color: colors.accent, letterSpacing: '0.2em',
            padding: '4px 14px', border: `1px solid ${colors.accent}33`,
            borderRadius: '999px', background: `${colors.accent}0a`, marginBottom: '20px',
          }}>{mode === 'signin' ? '✦ SIGN IN' : '✦ CREATE ACCOUNT'}</span>
          <h1 style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '24px',
            color: colors.text, fontWeight: 600, margin: 0, letterSpacing: '-0.01em',
          }}>{mode === 'signin' ? 'Welcome back' : 'Get started'}</h1>
        </div>

        {status === 'sent' ? (
          <div style={{
            background: colors.panel, border: `1px solid #22c55e33`,
            borderRadius: '10px', padding: '24px',
          }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#22c55e', letterSpacing: '0.1em', margin: '0 0 8px' }}>
              CHECK YOUR EMAIL
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: colors.subtext, margin: 0 }}>
              We sent a confirmation link to {email}. Confirm it, then sign in.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                style={inputStyle}
              />

              {error && (
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#ef4444', margin: 0 }}>⚠ {error}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
                  letterSpacing: '0.15em', padding: '14px', borderRadius: '8px',
                  border: 'none', background: colors.accent, color: '#0d0d0d',
                  fontWeight: 600, cursor: 'pointer', opacity: status === 'submitting' ? 0.6 : 1,
                }}
              >
                {status === 'submitting' ? 'PLEASE WAIT…' : mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: colors.faint, fontSize: '10px', fontFamily: "'IBM Plex Mono', monospace" }}>
              <div style={{ flex: 1, height: '1px', background: colors.border }} />
              OR
              <div style={{ flex: 1, height: '1px', background: colors.border }} />
            </div>

            <button
              onClick={signInWithGoogle}
              style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
                letterSpacing: '0.1em', padding: '13px', borderRadius: '8px',
                border: `1px solid ${colors.border}`, background: colors.panel,
                color: colors.text, cursor: 'pointer',
              }}
            >
              CONTINUE WITH GOOGLE
            </button>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: colors.subtext, textAlign: 'center', margin: 0 }}>
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <span
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
                style={{ color: colors.accent, cursor: 'pointer' }}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
