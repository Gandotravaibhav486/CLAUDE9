import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase.js'

const AuthContext = createContext(null)

async function ensureProfile(user) {
  if (!user) return null
  await supabase.from('profiles').upsert(
    { id: user.id, email: user.email },
    { onConflict: 'id', ignoreDuplicates: false }
  )
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return
      setUser(session?.user ?? null)
      if (session?.user) setProfile(await ensureProfile(session.user))
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setProfile(await ensureProfile(session.user))
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      active = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const signUp = (email, password) => supabase.auth.signUp({ email, password })
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signInWithGoogle = () => supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/dashboard` },
  })
  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
