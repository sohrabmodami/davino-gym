import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const CSS = `
  @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .settings-input { border: 1.5px solid #e8e3dc; border-radius: 10px; padding: 10px 14px; font-size: 14px; outline: none; font-family: 'Vazirmatn', sans-serif; transition: border-color .18s, box-shadow .18s; width: 100%; box-sizing: border-box; color: #222; background: #fff; }
  .settings-input:focus { border-color: #EA443C; box-shadow: 0 0 0 3px rgba(234,68,60,.08); }
  .settings-section { background: #fff; border-radius: 16px; border: 1px solid #ede8e0; padding: 28px; margin-bottom: 20px; }
  .settings-input:disabled { background: #f5f0ea; color: #bbb; border-color: #e8e3dc; }

  /* Toggle switch */
  .toggle-wrap { position: relative; display: inline-block; width: 38px; height: 22px; flex-shrink: 0; }
  .toggle-wrap input { opacity: 0; width: 0; height: 0; position: absolute; }
  .toggle-slider { position: absolute; inset: 0; border-radius: 999px; cursor: pointer; background: #e0dbd3; transition: background .2s; }
  .toggle-slider:before { content: ''; position: absolute; width: 16px; height: 16px; border-radius: 50%; left: 3px; top: 3px; background: #fff; transition: transform .2s; box-shadow: 0 1px 4px rgba(0,0,0,.18); }
  .toggle-wrap input:checked + .toggle-slider { background: #EA443C; }
  .toggle-wrap input:checked + .toggle-slider:before { transform: translateX(16px); }
`

const gymFields = [
  { key: 'gymName', label: 'نام باشگاه', placeholder: 'داوینو کلایمینگ' },
  { key: 'address', label: 'آدرس', placeholder: 'تهران، خیابان ولیعصر' },
  { key: 'phone', label: 'تلفن ثابت', placeholder: '۰۲۱-۸۸۸۸-۰۰۰۰' },
  { key: 'mobile', label: 'تلفن همراه', placeholder: '۰۹۱۲-۰۰۰-۰۰۰۰' },
  { key: 'hours', label: 'ساعات کار', placeholder: 'شنبه تا پنجشنبه ۸–۲۲' },
]

const socialFields = [
  { key: 'instagram', visKey: 'instagramVisible', label: 'اینستاگرام', placeholder: 'https://instagram.com/davino...' },
  { key: 'telegram',  visKey: 'telegramVisible',  label: 'تلگرام',     placeholder: 'https://t.me/davino...' },
  { key: 'whatsapp',  visKey: 'whatsappVisible',  label: 'واتساپ',     placeholder: '09xxxxxxxxx' },
  { key: 'youtube',   visKey: 'youtubeVisible',   label: 'یوتیوب',     placeholder: 'https://youtube.com/@davino...' },
]

/* ─── Hero Crop Modal — crop-box-on-image style, 16:10 ratio ─── */
function HeroCropModal({ src, onCrop, onClose }) {
  const CW = 460; const CH = 300
  const ASPECT_W = 16; const ASPECT_H = 10

  const imgRef = useRef(null)
  const metaRef = useRef(null)
  const dragRef = useRef(null)
  const [meta, setMeta] = useState(null)
  const [box, setBox] = useState(null)

  const clampBox = (b, m) => {
    const h = b.w * (ASPECT_H / ASPECT_W)
    return {
      w: b.w,
      x: Math.max(m.offsetX, Math.min(m.offsetX + m.dispW - b.w, b.x)),
      y: Math.max(m.offsetY, Math.min(m.offsetY + m.dispH - h, b.y)),
    }
  }

  const handleLoad = () => {
    const img = imgRef.current; if (!img) return
    const natW = img.naturalWidth, natH = img.naturalHeight
    const scale = Math.min(CW / natW, CH / natH)
    const dispW = natW * scale, dispH = natH * scale
    const offsetX = (CW - dispW) / 2, offsetY = (CH - dispH) / 2
    const m = { offsetX, offsetY, dispW, dispH, scale, natW, natH }
    metaRef.current = m
    setMeta(m)
    const w = Math.min(dispW, dispH * (ASPECT_W / ASPECT_H)) * 0.9
    const h = w * (ASPECT_H / ASPECT_W)
    setBox({ x: offsetX + (dispW - w) / 2, y: offsetY + (dispH - h) / 2, w })
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current) return
      const { startX, startY, boxX, boxY } = dragRef.current
      const m = metaRef.current; if (!m) return
      const dx = e.clientX - startX, dy = e.clientY - startY
      setBox(b => clampBox({ ...b, x: boxX + dx, y: boxY + dy }, m))
    }
    const onUp = () => { dragRef.current = null }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  }, [])

  const handleSize = (newW) => {
    const m = metaRef.current; if (!m || !box) return
    setBox(b => clampBox({ ...b, w: newW }, m))
  }

  const handleCrop = () => {
    if (!meta || !box) return
    const h = box.w * (ASPECT_H / ASPECT_W)
    const srcX = (box.x - meta.offsetX) / meta.scale
    const srcY = (box.y - meta.offsetY) / meta.scale
    const srcW = box.w / meta.scale
    const srcH = h / meta.scale
    const canvas = document.createElement('canvas')
    canvas.width = 1200; canvas.height = 750
    canvas.getContext('2d').drawImage(imgRef.current, srcX, srcY, srcW, srcH, 0, 0, 1200, 750)
    onCrop(canvas.toDataURL('image/jpeg', 0.92))
  }

  const maxW = meta ? Math.min(meta.dispW, meta.dispH * (ASPECT_W / ASPECT_H)) : 300
  const boxH = box ? box.w * (ASPECT_H / ASPECT_W) : 0

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div style={{ background: '#fff', borderRadius: 22, padding: '24px 24px 22px', maxWidth: 520, width: '100%', animation: 'slideUp .25s ease', boxShadow: '0 32px 80px rgba(0,0,0,.35)' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#111', marginBottom: 3 }}>برش تصویر هیرو</h3>
        <p style={{ fontSize: 12, color: '#aaa', marginBottom: 16 }}>قاب قرمز را بکش — نسبت ۱۶:۱۰ افقی</p>

        <div style={{ position: 'relative', width: CW, height: CH, background: '#111', borderRadius: 14, overflow: 'hidden', margin: '0 auto 18px', userSelect: 'none' }}>
          <img ref={imgRef} src={src} onLoad={handleLoad} draggable={false} alt=""
            style={{ position: 'absolute', left: meta?.offsetX, top: meta?.offsetY, width: meta?.dispW, height: meta?.dispH, display: 'block', pointerEvents: 'none' }}
          />
          {box && (
            <div
              style={{
                position: 'absolute', left: box.x, top: box.y, width: box.w, height: boxH,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                border: '2px solid #EA443C',
                borderRadius: 4,
                cursor: 'move',
                zIndex: 2,
                boxSizing: 'border-box',
              }}
              onMouseDown={e => {
                e.preventDefault()
                dragRef.current = { startX: e.clientX, startY: e.clientY, boxX: box.x, boxY: box.y }
              }}
            >
              {[33, 66].map(p => <div key={`v${p}`} style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />)}
              {[33, 66].map(p => <div key={`h${p}`} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />)}
              {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
                <div key={`${v}${h}`} style={{ position: 'absolute', [v]: -2, [h]: -2, width: 14, height: 14, borderStyle: 'solid', borderColor: '#EA443C', borderWidth: `${v === 'top' ? 3 : 0}px ${h === 'right' ? 3 : 0}px ${v === 'bottom' ? 3 : 0}px ${h === 'left' ? 3 : 0}px`, pointerEvents: 'none' }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#999' }}>اندازه قاب کراپ</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#EA443C' }}>{box ? Math.round(box.w / maxW * 100) : 90}٪</span>
          </div>
          <input type="range" min={Math.max(80, maxW * 0.3)} max={maxW} step={1}
            value={box?.w ?? maxW * 0.9}
            onChange={e => handleSize(+e.target.value)}
            style={{ width: '100%', accentColor: '#EA443C', cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: '#fff', color: '#555', border: '1.5px solid #e8e3dc', borderRadius: 10, padding: '10px', fontFamily: 'Vazirmatn', fontSize: 14, cursor: 'pointer' }}>انصراف</button>
          <button onClick={handleCrop} style={{ flex: 1, background: '#EA443C', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontFamily: 'Vazirmatn', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>برش و ذخیره</button>
        </div>
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-wrap">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  )
}

export default function AdminSettings() {
  const { settings, updateSettings } = useAdmin()
  const [form, setForm] = useState({ ...settings })
  const [toast, setToast] = useState(false)
  const [dirty, setDirty] = useState(false)

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setDirty(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateSettings(form)
    setDirty(false)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const handleReset = () => {
    setForm({ ...settings })
    setDirty(false)
  }

  const heroFileRef = useRef(null)
  const [heroCropSrc, setHeroCropSrc] = useState(null)

  const handleHeroUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setHeroCropSrc(ev.target.result) }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleHeroCropped = (dataUrl) => {
    setField('heroImage', dataUrl)
    setHeroCropSrc(null)
  }

  const gymIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  const socialIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  const imageIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>

  return (
    <div style={{ padding: '36px 40px', maxWidth: 760 }}>
      <style>{CSS}</style>

      {heroCropSrc && <HeroCropModal src={heroCropSrc} onCrop={handleHeroCropped} onClose={() => setHeroCropSrc(null)} />}

      {toast && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#18181b', color: '#fff', borderRadius: 12,
          padding: '12px 20px', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,.25)', zIndex: 9999,
          animation: 'slideUp .25s ease', whiteSpace: 'nowrap',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          تنظیمات با موفقیت ذخیره شد
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>تنظیمات</h1>
        <p style={{ fontSize: 13, color: '#999' }}>اطلاعات عمومی و شبکه‌های اجتماعی باشگاه</p>
      </div>

      <form onSubmit={handleSave}>

        {/* Gym info */}
        <div className="settings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid #f0ebe3' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(234,68,60,.08)', border: '1px solid rgba(234,68,60,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA443C' }}>{gymIcon}</div>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>اطلاعات باشگاه</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {gymFields.map(({ key, label, placeholder }) => (
              <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>{label}</span>
                <input className="settings-input" value={form[key] || ''} onChange={e => setField(key, e.target.value)} placeholder={placeholder} />
              </label>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="settings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid #f0ebe3' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(234,68,60,.08)', border: '1px solid rgba(234,68,60,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA443C' }}>{socialIcon}</div>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>شبکه‌های اجتماعی</h2>
          </div>
          <p style={{ fontSize: 12, color: '#aaa', marginBottom: 18, marginTop: -10, lineHeight: 1.7 }}>
            با تاگل کنار هر شبکه، نمایش آن را در فوتر سایت روشن یا خاموش کنید.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {socialFields.map(({ key, visKey, label, placeholder }) => {
              const isOn = form[visKey] !== false
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: isOn ? '#fafaf9' : '#f5f0ea',
                  border: `1.5px solid ${isOn ? '#e8e3dc' : '#e0dbd3'}`,
                  borderRadius: 12, padding: '12px 16px',
                  transition: 'all .2s',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: isOn ? '#888' : '#bbb', fontWeight: 700, marginBottom: 6 }}>{label}</div>
                    <input
                      className="settings-input"
                      value={form[key] || ''}
                      onChange={e => setField(key, e.target.value)}
                      placeholder={placeholder}
                      disabled={!isOn}
                      style={{ background: isOn ? '#fff' : '#ede8e0' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <Toggle checked={isOn} onChange={v => setField(visKey, v)} />
                    <span style={{ fontSize: 10, color: isOn ? '#EA443C' : '#bbb', fontWeight: 700 }}>{isOn ? 'نمایش' : 'مخفی'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Hero content */}
        <div className="settings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid #f0ebe3' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(234,68,60,.08)', border: '1px solid rgba(234,68,60,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA443C' }}>{imageIcon}</div>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>محتوای هیرو</h2>
          </div>

          {/* Text fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>بج (نشان کوچک بالای عنوان)</span>
              <input className="settings-input" value={form.heroBadge || ''} onChange={e => setField('heroBadge', e.target.value)} placeholder="باشگاه سنگنوردی حرفه‌ای تهران" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>عنوان اصلی (برای شکستن خط از Enter استفاده کن)</span>
              <textarea className="settings-input" value={form.heroTitle || ''} onChange={e => setField('heroTitle', e.target.value)} rows={3} style={{ resize: 'vertical', lineHeight: 1.7 }} placeholder={'به قله برس،\nداوینو همراهته'} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>توضیحات زیر عنوان</span>
              <textarea className="settings-input" value={form.heroSubtitle || ''} onChange={e => setField('heroSubtitle', e.target.value)} rows={2} style={{ resize: 'vertical', lineHeight: 1.7 }} placeholder="از مبتدی تا حرفه‌ای — با مربیان مجرب..." />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, paddingTop: 4 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>ارتفاع دیواره (بج شناور)</span>
                <input className="settings-input" value={form.heroWallHeight || ''} onChange={e => setField('heroWallHeight', e.target.value)} placeholder="۱۵ متر" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>امتیاز کاربران (بج شناور)</span>
                <input className="settings-input" value={form.heroRating || ''} onChange={e => setField('heroRating', e.target.value)} placeholder="۴.۹ ★" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>عنوان روی کارت تصویر</span>
                <input className="settings-input" value={form.heroCardTitle || ''} onChange={e => setField('heroCardTitle', e.target.value)} placeholder="دیواره‌های حرفه‌ای" />
              </label>
            </div>
          </div>

          {/* Hero image */}
          <div style={{ paddingTop: 16, borderTop: '1px solid #f0ebe3' }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginBottom: 12 }}>تصویر هیرو</div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{
                width: 240, height: 152, borderRadius: 14, overflow: 'hidden', flexShrink: 0,
                border: '2px dashed #e8e3dc', background: '#f5f0ea',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              }}>
                {form.heroImage
                  ? <img src={form.heroImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ textAlign: 'center', color: '#ccc' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 8 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>بدون تصویر</div>
                    </div>
                }
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 12, lineHeight: 1.7 }}>
                  پس‌زمینه بخش هیرو سایت.<br/>
                  <span style={{ fontSize: 12, color: '#aaa' }}>پیشنهاد: افقی، حداقل ۱۲۰۰×۶۰۰</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => heroFileRef.current?.click()} style={{
                    background: '#EA443C', color: '#fff', border: 'none', borderRadius: 10,
                    padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Vazirmatn', display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    بارگذاری و کراپ
                  </button>
                  {form.heroImage && (
                    <button type="button" onClick={() => setField('heroImage', '')} style={{
                      background: '#fff5f5', color: '#ef4444', border: '1.5px solid #fecaca',
                      borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'Vazirmatn',
                    }}>حذف</button>
                  )}
                </div>
                <input ref={heroFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHeroUpload} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4 }}>
          {dirty && (
            <button
              type="button"
              onClick={handleReset}
              style={{ background: '#fff', color: '#666', border: '1.5px solid #e8e3dc', borderRadius: 12, padding: '11px 24px', fontFamily: 'Vazirmatn', fontSize: 14, cursor: 'pointer', transition: 'all .15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#bbb'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e3dc'}
            >
              بازگشت به قبل
            </button>
          )}
          <button
            type="submit"
            style={{
              background: dirty ? '#EA443C' : '#e8e3dc',
              color: dirty ? '#fff' : '#aaa',
              border: 'none', borderRadius: 12, padding: '11px 32px',
              fontFamily: 'Vazirmatn', fontSize: 14, fontWeight: 700,
              cursor: dirty ? 'pointer' : 'default',
              boxShadow: dirty ? '0 4px 16px rgba(234,68,60,.3)' : 'none',
              transition: 'all .2s',
            }}
          >
            ذخیره تنظیمات
          </button>
        </div>
      </form>
    </div>
  )
}
