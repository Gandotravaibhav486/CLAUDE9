import { createContext, useContext, useEffect, useState } from 'react'

const PALETTES = {
  dark: {
    bg: '#080808',
    panel: '#0f0f0f',
    border: '#1a1a1a',
    text: '#f0ede8',
    subtext: '#6b6154',
    faint: '#3a3530',
    accent: '#c8a96e',
  },
  light: {
    bg: '#f7f5f1',
    panel: '#ffffff',
    border: '#e4ded3',
    text: '#1a1712',
    subtext: '#6b6154',
    faint: '#a39a8c',
    accent: '#a8823f',
  },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('claude9-theme') || 'dark')

  useEffect(() => {
    localStorage.setItem('claude9-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: PALETTES[theme] }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
