import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import { RISK_COLOR, RISK_LABEL } from '../components/ClauseCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { supabase } from '../utils/supabase.js'

export const ANALYSIS_LIMIT = 5

function StatPill({ label, value, color, colors }) {
  return (
    <div style={{
      background: colors.panel, border: `1px solid ${colors.border}`,
      borderRadius: '10px', padding: '14px 20px', minWidth: '140px',
    }}>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: colors.faint, letterSpacing: '0.15em', margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px', color: color ?? colors.text, fontWeight: 600, margin: 0 }}>{value}</p>
    </div>
  )
}

function DocCard({ doc, colors }) {
  const color = RISK_COLOR[doc.overall_risk] ?? colors.faint
  const label = RISK_LABEL[doc.overall_risk] ?? doc.overall_risk?.toUpperCase()
  return (
    <div style={{
      background: colors.panel, border: `1px solid ${colors.border}`,
      borderRadius: '10px', padding: '18px 20px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: colors.text,
          fontWeight: 600, margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{doc.title || 'Untitled document'}</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: colors.subtext, margin: 0 }}>
          {doc.clause_count ?? 0} clauses · {doc.perspective ?? '—'} · {new Date(doc.created_at).toLocaleDateString()}
        </p>
      </div>
      {doc.overall_risk && (
        <span style={{
          flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
          letterSpacing: '0.1em', padding: '6px 12px', borderRadius: '999px',
          border: `1px solid ${color}44`, background: `${color}12`, color,
        }}>{label}</span>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { colors } = useTheme()
  const [tab, setTab] = useState('analyzed')
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (active) {
          setDocs(data ?? [])
          setLoading(false)
        }
      })
    return () => { active = false }
  }, [user.id])

  const analyzed = docs.filter(d => d.kind === 'analyzed')
  const created  = docs.filter(d => d.kind === 'created')
  const active   = tab === 'analyzed' ? analyzed : created
  const atLimit  = analyzed.length >= ANALYSIS_LIMIT

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }}>
      <Header />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 32px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <span style={{
              display: 'inline-block', fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px', color: colors.accent, letterSpacing: '0.2em',
              padding: '4px 14px', border: `1px solid ${colors.accent}33`,
              borderRadius: '999px', background: `${colors.accent}0a`, marginBottom: '14px',
            }}>✦ YOUR DOCUMENTS</span>
            <h1 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '22px', color: colors.text, fontWeight: 600, margin: 0 }}>
              {user.email}
            </h1>
          </div>
          <button
            onClick={signOut}
            style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.1em',
              padding: '10px 18px', borderRadius: '8px', border: `1px solid ${colors.border}`,
              background: colors.panel, color: colors.subtext, cursor: 'pointer',
            }}
          >SIGN OUT</button>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <StatPill label="ANALYSES USED" value={`${analyzed.length} / ${ANALYSIS_LIMIT}`} color={atLimit ? '#ef4444' : colors.accent} colors={colors} />
          <StatPill label="DOCUMENTS CREATED" value={created.length} colors={colors} />
        </div>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: `1px solid ${colors.border}` }}>
          {[
            { id: 'analyzed', label: 'Analysed Documents', count: analyzed.length },
            { id: 'created',  label: 'Created Documents',  count: created.length },
          ].map(t => {
            const isActive = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                  letterSpacing: '0.1em', padding: '10px 16px', cursor: 'pointer',
                  background: 'transparent', border: 'none',
                  borderBottom: `2px solid ${isActive ? colors.accent : 'transparent'}`,
                  color: isActive ? colors.accent : colors.faint,
                  marginBottom: '-1px', transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {t.label}{t.count > 0 && <span style={{ marginLeft: '6px', opacity: 0.5 }}>{t.count}</span>}
              </button>
            )
          })}
        </div>

        {loading ? (
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: colors.faint }}>LOADING…</p>
        ) : active.length === 0 ? (
          <div style={{
            background: colors.panel, border: `1px solid ${colors.border}`,
            borderRadius: '10px', padding: '40px', textAlign: 'center',
          }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: colors.subtext, margin: 0 }}>
              {tab === 'analyzed'
                ? 'No documents analysed yet — upload a contract to get started.'
                : 'Document creation is coming soon — check back here once it ships.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {active.map(doc => <DocCard key={doc.id} doc={doc} colors={colors} />)}
          </div>
        )}
      </div>
    </div>
  )
}
