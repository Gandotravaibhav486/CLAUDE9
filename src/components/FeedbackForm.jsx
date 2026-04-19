import { useState } from 'react'
import { supabase } from '../utils/supabase.js'

const FEATURES = [
  { id: 'clause_breakdown', label: 'Clause breakdown' },
  { id: 'risk_score',       label: 'Risk score' },
  { id: 'value_at_risk',    label: 'Value at Risk' },
  { id: 'hidden_refs',      label: 'Hidden References' },
]

const WOULD_USE = [
  { id: 'definitely', label: 'Definitely' },
  { id: 'maybe',      label: 'Maybe' },
  { id: 'no',         label: 'No' },
]

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {[1, 2, 3, 4, 5].map(star => {
        const filled = star <= (hovered || value)
        return (
          <button
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '24px', padding: '2px',
              color: filled ? '#c8a96e' : '#2a2520',
              textShadow: filled ? '0 0 8px #c8a96e66' : 'none',
              transition: 'color 0.15s, text-shadow 0.15s',
            }}
          >★</button>
        )
      })}
    </div>
  )
}

function MCQ({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map(opt => {
        const active = value === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
              letterSpacing: '0.08em', padding: '8px 16px',
              borderRadius: '999px', cursor: 'pointer', border: '1px solid',
              borderColor: active ? '#c8a96e' : '#1a1a1a',
              background: active ? '#c8a96e12' : 'transparent',
              color: active ? '#c8a96e' : '#3a3530',
              transition: 'all 0.15s',
            }}
          >{opt.label}</button>
        )
      })}
    </div>
  )
}

export default function FeedbackForm({ perspective, overallRisk, clauseCount }) {
  const [rating,   setRating]   = useState(0)
  const [feature,  setFeature]  = useState(null)
  const [wouldUse, setWouldUse] = useState(null)
  const [comment,  setComment]  = useState('')
  const [status,   setStatus]   = useState('idle') // idle | submitting | done | error

  const canSubmit = rating > 0 && feature && wouldUse && status === 'idle'

  const submit = async () => {
    if (!canSubmit) return
    setStatus('submitting')
    const { error } = await supabase.from('feedback').insert({
      accuracy_rating:      rating,
      most_useful_feature:  feature,
      would_use_again:      wouldUse,
      perspective,
      overall_risk:         overallRisk,
      clause_count:         clauseCount,
      comment:              comment.trim() || null,
    })
    setStatus(error ? 'error' : 'done')
  }

  if (status === 'done') {
    return (
      <div style={{
        marginTop: '64px', padding: '40px',
        background: '#0f0f0f', border: '1px solid #22c55e22',
        borderRadius: '12px', textAlign: 'center',
      }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: '#22c55e', letterSpacing: '0.15em', margin: '0 0 8px' }}>
          FEEDBACK SUBMITTED
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6b6154', margin: 0 }}>
          Thank you — this helps us improve the analysis.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      marginTop: '64px',
      borderTop: '1px solid #1a1a1a',
      paddingTop: '48px',
    }}>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
        color: '#3a3530', letterSpacing: '0.2em', marginBottom: '6px',
      }}>FEEDBACK</p>
      <h3 style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '16px',
        color: '#f0ede8', fontWeight: 600, marginBottom: '4px', letterSpacing: '-0.01em',
      }}>Was this analysis useful?</h3>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: '13px',
        color: '#6b6154', marginBottom: '32px',
      }}>Takes 20 seconds. Helps us get better.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '560px' }}>

        {/* Q1 — star rating */}
        <div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#f0ede8', marginBottom: '12px' }}>
            How accurate was the clause analysis?
          </p>
          <StarRating value={rating} onChange={setRating} />
        </div>

        {/* Q2 — most useful feature */}
        <div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#f0ede8', marginBottom: '12px' }}>
            Which feature helped you most?
          </p>
          <MCQ options={FEATURES} value={feature} onChange={setFeature} />
        </div>

        {/* Q3 — would use again */}
        <div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#f0ede8', marginBottom: '12px' }}>
            Would you use this before signing a contract?
          </p>
          <MCQ options={WOULD_USE} value={wouldUse} onChange={setWouldUse} />
        </div>

        {/* Optional comment */}
        <div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6b6154', marginBottom: '10px' }}>
            Anything else? (optional)
          </p>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="What could be improved..."
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#0f0f0f', border: '1px solid #1a1a1a',
              borderRadius: '8px', padding: '12px 14px',
              color: '#f0ede8', fontFamily: "'Inter', sans-serif",
              fontSize: '13px', resize: 'vertical', outline: 'none',
              lineHeight: 1.6,
            }}
          />
        </div>

        {status === 'error' && (
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#ef4444', letterSpacing: '0.08em' }}>
            ⚠ Submission failed — please try again.
          </p>
        )}

        <button
          onClick={submit}
          disabled={!canSubmit}
          style={{
            alignSelf: 'flex-start',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
            letterSpacing: '0.15em', padding: '12px 28px',
            borderRadius: '8px', cursor: canSubmit ? 'pointer' : 'not-allowed',
            border: '1px solid',
            borderColor: canSubmit ? '#c8a96e66' : '#1a1a1a',
            background: canSubmit ? '#c8a96e0f' : 'transparent',
            color: canSubmit ? '#c8a96e' : '#2a2520',
            transition: 'all 0.2s',
          }}
        >{status === 'submitting' ? 'SUBMITTING...' : 'SUBMIT FEEDBACK →'}</button>

      </div>
    </div>
  )
}
