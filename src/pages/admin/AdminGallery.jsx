import { useState } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const CATEGORIES = ['دیواره', 'بولدرینگ', 'رویداد', 'تمرین', 'سایر']
const COLORS = ['#1a1a2e','#16213e','#0f3460','#2c1810','#0d2137','#1a2e1a','#2e1a2e','#533483']

function AddModal({ onSave, onClose }) {
  const [form, setForm] = useState({ title: '', category: 'دیواره', span: 'normal', color: '#1a1a2e', accent: '#EA443C' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440, padding: 32 }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 16, fontWeight: 900, marginBottom: 20 }}>آیتم جدید گالری</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>عنوان</span>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              style={{ border: '1.5px solid #e8e3dc', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Vazirmatn, sans-serif' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>دسته‌بندی</span>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              style={{ border: '1.5px solid #e8e3dc', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Vazirmatn, sans-serif' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['normal','wide'].map(s => (
              <button key={s} onClick={() => set('span', s)} style={{ flex: 1, padding: '9px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 13, fontWeight: 700, border: '1.5px solid', borderColor: form.span === s ? '#EA443C' : '#e8e3dc', background: form.span === s ? 'rgba(234,68,60,.08)' : '#fff', color: form.span === s ? '#EA443C' : '#888' }}>
                {s === 'normal' ? 'عادی' : 'عریض'}
              </button>
            ))}
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>رنگ پس‌زمینه</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => set('color', c)} style={{ width: 32, height: 32, borderRadius: 8, background: c, border: form.color === c ? '3px solid #EA443C' : '2px solid rgba(0,0,0,.1)', cursor: 'pointer' }} />
              ))}
            </div>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', border: '1.5px solid #e8e3dc', borderRadius: 10, background: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 13 }}>انصراف</button>
          <button onClick={() => onSave(form)} disabled={!form.title} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 10, background: '#EA443C', color: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 13, fontWeight: 700, opacity: form.title ? 1 : 0.5 }}>افزودن</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminGallery() {
  const { gallery, deleteGalleryItem, addGalleryItem } = useAdmin()
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div style={{ padding: 40 }}>
      {showAdd && <AddModal onSave={(item) => { addGalleryItem(item); setShowAdd(false) }} onClose={() => setShowAdd(false)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>گالری</h1>
          <p style={{ fontSize: 13, color: '#888' }}>{gallery.length} آیتم</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background: '#EA443C', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          آیتم جدید
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {gallery.map(item => (
          <div key={item.id} style={{ borderRadius: 14, overflow: 'hidden', background: item.color, aspectRatio: item.span === 'wide' ? '2/1' : '4/3', position: 'relative', gridColumn: item.span === 'wide' ? 'span 2' : 'span 1' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.6))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => deleteGalleryItem(item.id)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(239,68,68,.85)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{item.title}</div>
                <span style={{ fontSize: 10, background: 'rgba(255,255,255,.2)', color: '#fff', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
