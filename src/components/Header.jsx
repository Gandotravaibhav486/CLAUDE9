import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()

  const navLink = (to, label) => ({
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '11px',
    color: pathname === to ? '#c8a96e' : '#6b6154',
    textDecoration: 'none',
    letterSpacing: '0.15em',
    transition: 'color 0.2s',
  })

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '60px',
      background: 'rgba(8,8,8,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '15px',
          color: '#c8a96e',
          letterSpacing: '0.15em',
          fontWeight: 600,
        }}>CLAUDE9</span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          color: '#3a3530',
          letterSpacing: '0.1em',
          paddingTop: '2px',
        }}>LEGAL ANALYSER</span>
      </Link>

      <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <Link to="/" style={navLink('/', 'HOME')}>HOME</Link>
        <Link to="/analyze" style={navLink('/analyze', 'ANALYSE')}>ANALYSE</Link>
      </nav>
    </header>
  )
}
