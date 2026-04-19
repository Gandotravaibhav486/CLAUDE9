import { useState, useRef } from 'react'

const MAX_IMAGES = 10

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function RemoveBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute', top: '6px', right: '6px',
        width: '22px', height: '22px',
        background: '#080808cc', border: '1px solid #3a3530',
        borderRadius: '50%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
        color: '#c8a96e', lineHeight: 1, padding: 0,
        backdropFilter: 'blur(4px)',
      }}
    >×</button>
  )
}

function ImageTile({ item, onRemove }) {
  return (
    <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#111' }}>
      <img
        src={item.preview}
        alt={item.file.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, #00000099)',
        padding: '24px 8px 6px',
      }}>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
          color: '#c8a96e88', letterSpacing: '0.05em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          margin: 0,
        }}>{fmt(item.file.size)}</p>
      </div>
      <RemoveBtn onClick={e => { e.stopPropagation(); onRemove() }} />
    </div>
  )
}

function AddMoreTile({ onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        aspectRatio: '1', borderRadius: '8px', cursor: 'pointer',
        border: `1px dashed ${hover ? '#c8a96e' : '#2a2520'}`,
        background: hover ? '#c8a96e08' : 'transparent',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '6px',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: '22px', color: hover ? '#c8a96e' : '#3a3530' }}>+</span>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
        color: hover ? '#c8a96e' : '#3a3530', letterSpacing: '0.12em',
      }}>ADD MORE</span>
    </div>
  )
}

export default function UploadZone({ onFileSelect, analyzing }) {
  const [dragOver, setDragOver]   = useState(false)
  const [images, setImages]       = useState([])
  const [pdf, setPdf]             = useState(null)
  const imageInputRef             = useRef()
  const pdfInputRef               = useRef()

  const mode = pdf ? 'pdf' : images.length > 0 ? 'images' : null

  const notify = (nextImages, nextPdf) => {
    if (nextPdf) return onFileSelect({ mode: 'pdf', files: [nextPdf] })
    if (nextImages.length) return onFileSelect({ mode: 'images', files: nextImages.map(i => i.file) })
    onFileSelect(null)
  }

  const addImages = (fileList) => {
    const valid = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    const slots = MAX_IMAGES - images.length
    const entries = valid.slice(0, slots).map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    const next = [...images, ...entries]
    setImages(next)
    notify(next, null)
  }

  const addPdf = (f) => {
    setPdf(f)
    setImages([])
    notify([], f)
  }

  const removeImage = (idx) => {
    URL.revokeObjectURL(images[idx].preview)
    const next = images.filter((_, i) => i !== idx)
    setImages(next)
    notify(next, null)
  }

  const removePdf = () => {
    setPdf(null)
    notify([], null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (!files.length) return
    const pdfFile = files.find(f => f.type === 'application/pdf')
    const imgFiles = files.filter(f => f.type.startsWith('image/'))
    if (mode === 'pdf' || (mode === null && pdfFile && !imgFiles.length)) {
      if (pdfFile) addPdf(pdfFile)
    } else {
      addImages(imgFiles.length ? imgFiles : files)
    }
  }

  const handleInputChange = (e, type) => {
    if (!e.target.files?.length) return
    if (type === 'pdf') addPdf(e.target.files[0])
    else addImages(e.target.files)
    e.target.value = ''
  }

  if (analyzing) {
    return (
      <div style={{
        border: '1px dashed #1a1a1a', borderRadius: '10px',
        padding: '64px 40px', textAlign: 'center', background: '#0f0f0f',
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '2px solid #1a1a1a', borderTopColor: '#c8a96e',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px',
        }} />
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '14px', color: '#c8a96e', letterSpacing: '0.1em', marginBottom: '8px' }}>
          ANALYSING CONTRACT...
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6b6154' }}>This may take a few mins</p>
      </div>
    )
  }

  if (mode === 'images') {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        style={{
          border: `1px dashed ${dragOver ? '#c8a96e' : '#1a1a1a'}`,
          borderRadius: '10px', padding: '20px',
          background: dragOver ? '#c8a96e06' : '#0f0f0f',
          transition: 'all 0.2s',
        }}
      >
        <input ref={imageInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
          onChange={e => handleInputChange(e, 'images')} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '10px',
        }}>
          {images.map((item, i) => (
            <ImageTile key={item.preview} item={item} onRemove={() => removeImage(i)} />
          ))}
          {images.length < MAX_IMAGES && (
            <AddMoreTile onClick={() => imageInputRef.current.click()} />
          )}
        </div>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
          color: '#3a3530', letterSpacing: '0.1em', textAlign: 'right',
          marginTop: '12px', marginBottom: 0,
        }}>{images.length}/{MAX_IMAGES} IMAGES</p>
      </div>
    )
  }

  if (mode === 'pdf') {
    return (
      <div style={{
        border: '1px solid #22c55e22', borderRadius: '10px',
        padding: '32px 40px', textAlign: 'center', background: '#0f0f0f',
      }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '24px', color: '#22c55e', marginBottom: '12px' }}>✓</p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: '#22c55e', marginBottom: '4px' }}>{pdf.name}</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#6b6154', marginBottom: '20px' }}>{fmt(pdf.size)}</p>
        <button
          onClick={removePdf}
          style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#6b6154',
            background: 'transparent', border: '1px solid #1a1a1a', borderRadius: '6px',
            padding: '7px 16px', cursor: 'pointer', letterSpacing: '0.1em',
          }}
        >CHANGE FILE</button>
      </div>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      style={{
        border: `2px dashed ${dragOver ? '#c8a96e' : '#1a1a1a'}`,
        borderRadius: '10px', padding: '64px 40px', textAlign: 'center',
        background: dragOver ? '#c8a96e08' : '#0f0f0f',
        transition: 'all 0.2s', boxShadow: dragOver ? '0 0 0 1px #c8a96e22' : 'none',
      }}
    >
      <input ref={imageInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => handleInputChange(e, 'images')} />
      <input ref={pdfInputRef} type="file" accept=".pdf" style={{ display: 'none' }}
        onChange={e => handleInputChange(e, 'pdf')} />

      <p style={{ fontSize: '36px', color: '#3a3530', marginBottom: '16px' }}>↑</p>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '14px',
        color: '#f0ede8', marginBottom: '8px', letterSpacing: '0.05em',
      }}>Drop your rental agreement here</p>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6b6154', marginBottom: '28px' }}>
        Up to 10 images <span style={{ color: '#3a3530' }}>·</span> or 1 PDF
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => imageInputRef.current.click()}
          style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#c8a96e',
            background: 'transparent', border: '1px solid #c8a96e33', borderRadius: '999px',
            padding: '8px 20px', cursor: 'pointer', letterSpacing: '0.12em',
            transition: 'border-color 0.15s',
          }}
        >UPLOAD IMAGES</button>
        <button
          onClick={() => pdfInputRef.current.click()}
          style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#6b6154',
            background: 'transparent', border: '1px solid #2a2520', borderRadius: '999px',
            padding: '8px 20px', cursor: 'pointer', letterSpacing: '0.12em',
            transition: 'border-color 0.15s',
          }}
        >UPLOAD PDF</button>
      </div>
    </div>
  )
}
