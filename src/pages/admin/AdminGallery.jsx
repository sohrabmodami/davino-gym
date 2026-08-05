import { useState, useRef } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const CSS = `
  .gallery-item { border-radius: 14px; overflow: hidden; position: relative; transition: transform .2s, box-shadow .2s; cursor: grab; }
  .gallery-item:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,.2); }
  .gallery-item.dragging { opacity: .4; }
  .gallery-del-btn { position: absolute; top: 10px; left: 10px; width: 28px; height: 28px; border-radius: 7px; background: rgba(239,68,68,.85); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; opacity: 0; transition: opacity .15s; }
  .gallery-item:hover .gallery-del-btn { opacity: 1; }
  .gallery-order-badge { position: absolute; top: 10px; right: 10px; min-width: 22px; height: 22px; padding: 0 5px; border-radius: 6px; background: rgba(0,0,0,.55); color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
  .upload-zone { border: 2px dashed var(--ad-card-b); border-radius: 14px; padding: 32px 20px; text-align: center; cursor: pointer; transition: border-color .18s, background .18s; }
  .upload-zone:hover { border-color: #EA443C; background: rgba(234,68,60,.03); }
`

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = ev => resolve(ev.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminGallery() {
  const { gallery, deleteGalleryItem, addGalleryItems, reorderGallery } = useAdmin()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const fileRef = useRef(null)
  const dragIndex = useRef(null)

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'))
    if (!files.length) return
    setUploading(true)
    setProgress({ done: 0, total: files.length })
    const token = sessionStorage.getItem('davino_admin_token')
    const items = []
    for (const file of files) {
      try {
        const dataUrl = await readAsDataURL(file)
        const r = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ data: dataUrl }),
        })
        const d = await r.json()
        if (d.ok && d.url) {
          items.push({ photo: d.url })
        } else {
          items.push({ photo: dataUrl })
        }
      } catch { /* skip failed file */ }
      setProgress(p => ({ ...p, done: p.done + 1 }))
    }
    if (items.length) addGalleryItems(items)
    setUploading(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const onDragStartItem = (index) => (e) => {
    dragIndex.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOverItem = (index) => (e) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return
    const next = [...gallery]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(index, 0, moved)
    dragIndex.current = index
    reorderGallery(next)
  }

  const onDragEndItem = () => { dragIndex.current = null }

  return (
    <div style={{ padding: '36px 40px' }}>
      <style>{CSS}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>گالری</h1>
          <p style={{ fontSize: 13, color: 'var(--ad-text2)' }}>{gallery.length} تصویر — برای تغییر ترتیب، تصاویر را جابه‌جا بکش</p>
        </div>
      </div>

      <div
        className="upload-zone"
        onClick={() => fileRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        style={{ marginBottom: 24 }}
      >
        {uploading ? (
          <div style={{ color: '#EA443C', fontSize: 13, fontWeight: 700 }}>
            در حال آپلود… {progress.done} از {progress.total}
          </div>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EA443C" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 8, opacity: .5 }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ad-text2)', marginBottom: 3 }}>کلیک کن یا تصاویر رو اینجا بکش</div>
            <div style={{ fontSize: 11, color: 'var(--ad-text3)' }}>می‌تونی چند تصویر رو همزمان انتخاب کنی — JPG, PNG, WebP</div>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => { handleFiles(e.target.files); e.target.value = '' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {gallery.map((item, index) => (
          <div
            key={item.id}
            className="gallery-item"
            draggable
            onDragStart={onDragStartItem(index)}
            onDragOver={onDragOverItem(index)}
            onDragEnd={onDragEndItem}
            style={{ background: '#1a1a2e', aspectRatio: '1/1' }}
          >
            <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} draggable={false} />
            <div className="gallery-order-badge">{index + 1}</div>
            <button className="gallery-del-btn" onClick={() => deleteGalleryItem(item.id)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
      </div>

      {gallery.length === 0 && !uploading && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--ad-text3)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ad-text3)', marginBottom: 4 }}>گالری خالی است</p>
          <p style={{ fontSize: 13, color: 'var(--ad-text3)' }}>اولین تصاویر را اضافه کنید</p>
        </div>
      )}
    </div>
  )
}
