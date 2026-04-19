import { useState, useRef } from 'react'

export default function UploadZone({ onFileSelect, analyzing }) {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile]         = useState(null)
  const inputRef                = useRef()

  const handleFile = (f) => {
    setFile(f)
    onFileSelect(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  return (
    <div
      onClick={() => !file && !analyzing && inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      style={{
        border: `2px dashed ${dragOver ? '#c8a96e' : file ? '#22c55e44' : '#1a1a1a'}`,
        borderRadius: '10px',
        padding: '64px 40px',
        textAlign: 'center',
        cursor: file || analyzing ? 'default' : 'pointer',
        background: dragOver ? '#c8a96e08' : '#0f0f0f',
        transition: 'all 0.2s',
        boxShadow: dragOver ? '0 0 0 1px #c8a96e22' : 'none',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
      />

      {analyzing ? (
        <div>
          <div style={{
            width: '40px', height: '40px',
            border: '2px solid #1a1a1a',
            borderTopColor: '#c8a96e',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '14px',
            color: '#c8a96e',
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}>ANALYSING CONTRACT...</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6b6154' }}>
            This will take under a minute
          </p>
        </div>
      ) : file ? (
        <div>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '28px',
            color: '#22c55e',
            marginBottom: '12px',
          }}>✓</p>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '14px',
            color: '#22c55e',
            marginBottom: '4px',
          }}>{file.name}</p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            color: '#6b6154',
            marginBottom: '20px',
          }}>{(file.size / 1024).toFixed(1)} KB</p>
          <button
            onClick={e => { e.stopPropagation(); setFile(null); onFileSelect(null) }}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#6b6154',
              background: 'transparent',
              border: '1px solid #1a1a1a',
              borderRadius: '6px',
              padding: '7px 16px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
            }}
          >CHANGE FILE</button>
        </div>
      ) : (
        <div>
          <p style={{
            fontSize: '36px',
            color: '#3a3530',
            marginBottom: '16px',
          }}>↑</p>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '14px',
            color: '#f0ede8',
            marginBottom: '8px',
            letterSpacing: '0.05em',
          }}>Drop your rental agreement here</p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: '#6b6154',
            marginBottom: '24px',
          }}>TXT, PDF, DOC or DOCX — up to 10 MB</p>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#c8a96e',
            border: '1px solid #c8a96e33',
            borderRadius: '999px',
            padding: '7px 20px',
            letterSpacing: '0.12em',
          }}>BROWSE FILES</span>
        </div>
      )}
    </div>
  )
}
