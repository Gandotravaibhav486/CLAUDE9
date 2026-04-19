import { useState, useRef, useEffect } from 'react'

export default function ChatBot({ contractText, results }) {
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'I've analysed your contract. Ask me about any clause, your financial risks, or what to negotiate before signing.',
  }])
  const bottomRef = useRef()

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setMessages(m => [...m, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, contractText, results, history: messages }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Connection error — please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(x => !x)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '52px', height: '52px',
          borderRadius: '50%',
          background: '#c8a96e',
          border: 'none',
          cursor: 'pointer',
          fontSize: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200,
          boxShadow: '0 0 0 1px #c8a96e44, 0 4px 24px #c8a96e33',
          transition: 'transform 0.2s',
        }}
        title="Contract Assistant"
      >{open ? '✕' : '⚖'}</button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '88px', right: '24px',
          width: '360px', height: '480px',
          background: '#0f0f0f',
          border: '1px solid #1a1a1a',
          borderRadius: '10px',
          boxShadow: '0 0 0 1px #c8a96e22, 0 24px 64px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
          zIndex: 199,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1a1a1a',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px', color: '#c8a96e', letterSpacing: '0.12em',
            }}>CONTRACT ASSISTANT</span>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#22c55e',
              animation: 'pulse 2s infinite',
            }} />
          </div>

          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  background: msg.role === 'user' ? '#c8a96e1a' : '#141414',
                  border: `1px solid ${msg.role === 'user' ? '#c8a96e33' : '#1a1a1a'}`,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px', color: '#f0ede8', lineHeight: '1.5',
                }}>{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '5px', padding: '4px 0' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#c8a96e',
                    animation: `pulse 1.2s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #1a1a1a',
            display: 'flex', gap: '8px',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about your contract..."
              style={{
                flex: 1,
                background: '#141414',
                border: '1px solid #1a1a1a',
                borderRadius: '6px',
                padding: '10px 14px',
                color: '#f0ede8',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={send}
              style={{
                background: '#c8a96e',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                cursor: 'pointer',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '14px',
                color: '#080808',
                fontWeight: 600,
              }}
            >→</button>
          </div>
        </div>
      )}
    </>
  )
}
