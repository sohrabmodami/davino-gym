import { useState, useRef, useCallback } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const CATEGORIES = ['دیواره', 'بولدرینگ', 'رویداد', 'تمرین', 'سایر']

const CSS = `
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .gallery-item { border-radius: 14px; overflow: hidden; position: relative; transition: transform .2s, box-shadow .2s; }
  .gallery-item:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,.2); }
  .gallery-del-btn { position: absolute; top: 10px; left: 10px; width: 28px; height: 28px; border-radius: 7px; background: rgba(239,68,68,.85); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; opacity: 0; transition: opacity .15s; }
  .gallery-item:hover .gallery-del-btn { opacity: 1; }
  .admin-modal-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .2s; }
  .admin-input { border: 1.5px solid #e8e3dc; border-radius: 10px; padding: 9px 13px; font-size: 13px; outline: none; font-family: 'Vazirmatn', sans-serif; transition: border-color .18s; width: 100%; box-sizing: border-box; }
  .admin-input:focus { border-color: #EA443C; }
  .admin-btn-primary { background: #EA443C; color: #fff; border: none; border-radius: 10px; padding: 10px 22px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Vazirmatn', sans-serif; transition: all .15s; }
  .admin-btn-primary:hover { background: #d63830; }
  .admin-btn-primary:disabled { opacity: .45; cursor: not-allowed; }
  .admin-btn-ghost { background: #fff; color: #555; border: 1.5px solid #e8e3dc; border-radius: 10px; padding: 10px 18px; font-size: 14px; cursor: pointer; font-family: 'Vazirmatn', sans-serif; transition: all .15s; }
  .upload-zone { border: 2px dashed #e8e3dc; border-radius: 14px; padding: 32px 20px; text-align: center; cursor: pointer; transition: border-color .18s, background .18s; }
  .upload-zone:hover { border-color: #EA443C; background: rgba(234,68,60,.03); }
`

/* detect if image is landscape for auto span */
function getImageSpan(src) {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve(img.naturalWidth > img.naturalHeight * 1.4 ? 'wide' : 'normal')
    img.onerror = () => resolve('normal')
    img.src = src
  })
}

function AddModal({ onSave, onClose }) {
  const [form, setForm] = useState({ title: '', category: 'دیواره', span: 'normal', photo: '' })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const src = ev.target.result
      const autoSpan = await getImageSpan(src)
      set('photo', src)
      set('span', autoSpan)
      setPreview(src)
      setLoading(false)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const fakeEv = { target: { files: [file] }, dataTransfer: null }
    // simulate
    const reader = new FileReader()
    setLoading(true)
    reader.onload = async (ev) => {
      const src = ev.target.result
      const autoSpan = await getImageSpan(src)
      set('photo', src)
      set('span', autoSpan)
      setPreview(src)
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,.2)', animation: 'slideUp .25s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '22px 26px', borderBottom: '1px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#111' }}>آیتم جدید گالری</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Upload zone */}
          <div>
            <span style={{ fontSize: 11, color: '#999', fontWeight: 700, display: 'block', marginBottom: 8 }}>تصویر</span>
            {preview ? (
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 180 }}>
                <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 6 }}>
                  <button onClick={() => fileRef.current?.click()} style={{ background: 'rgba(0,0,0,.6)', border: 'none', borderRadius: 7, color: '#fff', cursor: 'pointer', padding: '4px 10px', fontSize: 12, fontWeight: 700, fontFamily: 'Vazirmatn' }}>تغییر</button>
                  <button onClick={() => { set('photo', ''); setPreview(null) }} style={{ background: 'rgba(239,68,68,.8)', border: 'none', borderRadius: 7, color: '#fff', cursor: 'pointer', padding: '4px 10px', fontSize: 12, fontWeight: 700, fontFamily: 'Vazirmatn' }}>حذف</button>
                </div>
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, fontFamily: 'Vazirmatn' }}>
                  {form.span === 'wide' ? 'عریض (landscape)' : 'عادی (portrait)'}
                </div>
              </div>
            ) : (
              <div
                className="upload-zone"
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                {loading ? (
                  <div style={{ color: '#EA443C', fontSize: 13, fontWeight: 700 }}>در حال پردازش...</div>
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EA443C" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 8, opacity: .5 }}>
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#888', marginBottom: 3 }}>کلیک کن یا عکس رو اینجا بکش</div>
                    <div style={{ fontSize: 11, color: '#bbb' }}>JPG, PNG, WebP — چیدمان خودکار</div>
                  </>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>عنوان</span>
            <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="مثال: دیوار Lead" />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>دسته‌بندی</span>
            <select className="admin-input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          {/* Manual span override */}
          <div>
            <span style={{ fontSize: 11, color: '#999', fontWeight: 700, display: 'block', marginBottom: 8 }}>چیدمان</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['normal', 'عادی (1×1)'], ['wide', 'عریض (2×1)']].map(([val, lbl]) => (
                <button key={val} onClick={() => set('span', val)} style={{
                  flex: 1, padding: '9px', borderRadius: 9, cursor: 'pointer',
                  fontFamily: 'Vazirmatn', fontSize: 13, fontWeight: 700, border: '1.5px solid',
                  borderColor: form.span === val ? '#EA443C' : '#e8e3dc',
                  background: form.span === val ? 'rgba(234,68,60,.06)' : '#fafaf9',
                  color: form.span === val ? '#EA443C' : '#aaa',
                  transition: 'all .15s',
                }}>{lbl}</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#bbb', marginTop: 6 }}>بر اساس نسبت تصویر خودکار انتخاب شده — می‌تونی تغییر بدی</p>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="admin-btn-ghost" onClick={onClose} style={{ flex: 1 }}>انصراف</button>
            <button className="admin-btn-primary" onClick={() => onSave(form)} disabled={!form.title || !form.photo} style={{ flex: 1 }}>افزودن</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminGallery() {
  const { gallery, deleteGalleryItem, addGalleryItem } = useAdmin()
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div style={{ padding: '36px 40px' }}>
      <style>{CSS}</style>
      {showAdd && <AddModal onSave={(item) => { addGalleryItem(item); setShowAdd(false) }} onClose={() => setShowAdd(false)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>گالری</h1>
          <p style={{ fontSize: 13, color: '#999' }}>{gallery.length} آیتم — چیدمان خودکار بر اساس نسبت تصویر</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#EA443C', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Vazirmatn', boxShadow: '0 4px 16px rgba(234,68,60,.3)', transition: 'all .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d63830'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#EA443C'; e.currentTarget.style.transform = 'none' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          آیتم جدید
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
        {gallery.map(item => (
          <div
            key={item.id}
            className="gallery-item"
            style={{
              background: item.photo ? 'transparent' : (item.color || '#1a1a2e'),
              aspectRatio: item.span === 'wide' ? '2/1' : '4/3',
              gridColumn: item.span === 'wide' ? 'span 2' : 'span 1',
            }}
          >
            {item.photo && (
              <img src={item.photo} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.65))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="gallery-del-btn" onClick={() => deleteGalleryItem(item.id)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 5 }}>{item.title}</div>
                <span style={{ fontSize: 11, background: 'rgba(255,255,255,.18)', color: '#fff', padding: '2px 9px', borderRadius: 999, fontWeight: 600 }}>{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gallery.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#ccc' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#aaa', marginBottom: 4 }}>گالری خالی است</p>
          <p style={{ fontSize: 13, color: '#bbb' }}>اولین آیتم را اضافه کنید</p>
        </div>
      )}
    </div>
  )
}
