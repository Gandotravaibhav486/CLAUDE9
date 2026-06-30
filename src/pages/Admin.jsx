import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import { RISK_COLOR, RISK_LABEL } from '../components/ClauseCard.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { supabase } from '../utils/supabase.js'

function StatPill({ label, value, colors }) {
  return (
    <div style={{
      background: colors.panel, border: `1px solid ${colors.border}`,
      borderRadius: '10px', padding: '14px 20px', minWidth: '140px',
    }}>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: colors.faint, letterSpacing: '0.15em', margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px', color: colors.accent, fontWeight: 600, margin: 0 }}>{value}</p>
    </div>
  )
}

function SectionTitle({ children, colors }) {
  return (
    <p style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: colors.faint,
      letterSpacing: '0.2em', margin: '36px 0 14px',
    }}>{children}</p>
  )
}

function Table({ columns, rows, colors }) {
  if (rows.length === 0) {
    return (
      <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: colors.subtext, margin: 0 }}>No rows yet.</p>
      </div>
    )
  }
  return (
    <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: '10px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{
                textAlign: 'left', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                color: colors.faint, letterSpacing: '0.1em', padding: '12px 16px',
                borderBottom: `1px solid ${colors.border}`,
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map(c => (
                <td key={c.key} style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '12px', color: colors.text,
                  padding: '12px 16px', borderBottom: i < rows.length - 1 ? `1px solid ${colors.border}` : 'none',
                }}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RiskBadge({ risk }) {
  if (!risk) return '—'
  const color = RISK_COLOR[risk] ?? '#6b6154'
  return (
    <span style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.08em',
      padding: '4px 10px', borderRadius: '999px', border: `1px solid ${color}44`,
      background: `${color}12`, color,
    }}>{RISK_LABEL[risk] ?? risk.toUpperCase()}</span>
  )
}

export default function Admin() {
  const { colors } = useTheme()
  const [users, setUsers]       = useState([])
  const [documents, setDocuments] = useState([])
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('documents').select('*').order('created_at', { ascending: false }),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
    ]).then(([profilesRes, documentsRes, feedbackRes]) => {
      if (!active) return
      setUsers(profilesRes.data ?? [])
      setDocuments(documentsRes.data ?? [])
      setFeedback(feedbackRes.data ?? [])
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  const emailByUserId = Object.fromEntries(users.map(u => [u.id, u.email]))
  const docCountByUserId = documents.reduce((acc, d) => {
    acc[d.user_id] = (acc[d.user_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }}>
      <Header />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 32px 80px' }}>
        <span style={{
          display: 'inline-block', fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px', color: colors.accent, letterSpacing: '0.2em',
          padding: '4px 14px', border: `1px solid ${colors.accent}33`,
          borderRadius: '999px', background: `${colors.accent}0a`, marginBottom: '14px',
        }}>✦ ADMIN</span>
        <h1 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '22px', color: colors.text, fontWeight: 600, margin: '0 0 28px' }}>
          Overview
        </h1>

        {loading ? (
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: colors.faint }}>LOADING…</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <StatPill label="TOTAL USERS" value={users.length} colors={colors} />
              <StatPill label="TOTAL DOCUMENTS" value={documents.length} colors={colors} />
              <StatPill label="ANALYSED" value={documents.filter(d => d.kind === 'analyzed').length} colors={colors} />
              <StatPill label="CREATED" value={documents.filter(d => d.kind === 'created').length} colors={colors} />
              <StatPill label="FEEDBACK" value={feedback.length} colors={colors} />
            </div>

            <SectionTitle colors={colors}>USERS</SectionTitle>
            <Table
              colors={colors}
              columns={[
                { key: 'email', label: 'EMAIL' },
                { key: 'created_at', label: 'JOINED', render: r => new Date(r.created_at).toLocaleDateString() },
                { key: 'doc_count', label: 'DOC COUNT', render: r => docCountByUserId[r.id] ?? 0 },
                { key: 'is_admin', label: 'ADMIN', render: r => r.is_admin ? 'Yes' : 'No' },
              ]}
              rows={users}
            />

            <SectionTitle colors={colors}>DOCUMENTS</SectionTitle>
            <Table
              colors={colors}
              columns={[
                { key: 'title', label: 'TITLE', render: r => r.title || 'Untitled document' },
                { key: 'kind', label: 'TYPE' },
                { key: 'overall_risk', label: 'RISK', render: r => <RiskBadge risk={r.overall_risk} /> },
                { key: 'user_id', label: 'USER EMAIL', render: r => emailByUserId[r.user_id] ?? '—' },
                { key: 'created_at', label: 'CREATED', render: r => new Date(r.created_at).toLocaleDateString() },
              ]}
              rows={documents}
            />

            <SectionTitle colors={colors}>FEEDBACK</SectionTitle>
            <Table
              colors={colors}
              columns={[
                { key: 'accuracy_rating', label: 'RATING', render: r => `${r.accuracy_rating}/5` },
                { key: 'most_useful_feature', label: 'MOST USEFUL' },
                { key: 'would_use_again', label: 'WOULD USE AGAIN' },
                { key: 'overall_risk', label: 'RISK', render: r => <RiskBadge risk={r.overall_risk} /> },
                { key: 'comment', label: 'COMMENT', render: r => r.comment || '—' },
                { key: 'created_at', label: 'SUBMITTED', render: r => r.created_at ? new Date(r.created_at).toLocaleDateString() : '—' },
              ]}
              rows={feedback}
            />
          </>
        )}
      </div>
    </div>
  )
}
