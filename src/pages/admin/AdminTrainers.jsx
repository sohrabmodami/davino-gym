import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

const CSS = `
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .trainer-card { background: #fff; border-radius: 16px; border: 1px solid #ede8e0; padding: 20px; display: flex; gap: 14px; align-items: flex-start; transition: box-shadow .2s, transform .2s; }
  .trainer-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.07); transform: translateY(-1px); }
  .admin-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .2s; }
  .admin-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow: auto; box-shadow: 0 32px 80px rgba(0,0,0,.2); animation: slideUp .25s ease; }
  .admin-field label { display: flex; flex-direction: column; gap: 5px; }
  .admin-field span { font-size: 11px; color: #999; font-weight: 700; }
  .admin-input { border: 1.5px solid #e8e3dc; border-radius: 10px; padding: 9px 13px; font-size: 13px; outline: none; font-family: 'Vazirmatn', sans-serif; transition: border-color .18s; width: 100%; box-sizing: border-box; }
  .admin-input:focus { border-color: #EA443C; }
  .admin-btn-primary { background: #EA443C; color: #fff; border: none; border-radius: 10px; padding: 10px 24px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Vazirmatn', sans-serif; transition: all .15s; }
  .admin-btn-primary:hover { background: #d63830; }
  .admin-btn-ghost { background: #fff; color: #555; border: 1.5px solid #e8e3dc; border-radius: 10px; padding: 10px 20px; font-size: 14px; cursor: pointer; font-family: 'Vazirmatn', sans-serif; transition: all .15s; }
  .admin-btn-ghost:hover { border-color: #ccc; }
  .icon-btn { width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; flex-shrink: 0; }
  .icon-btn.edit { border-color: #e8e3dc; background: #fff; color: #666; }
  .icon-btn.edit:hover { border-color: #EA443C; color: #EA443C; background: rgba(234,68,60,.05); }
  .icon-btn.del { border-color: #fecaca; background: #fff5f5; color: #ef4444; }
  .icon-btn.del:hover { background: #ef4444; color: #fff; }
  .crop-frame { border-radius: 12px; border: 2.5px solid #EA443C; overflow: hidden; cursor: grab; user-select: none; position: relative; }
  .crop-frame:active { cursor: grabbing; }
  .upload-btn { background: rgba(234,68,60,.08); border: 1.5px dashed rgba(234,68,60,.3); border-radius: 12px; padding: 14px; width: 100%; cursor: pointer; font-family: Vazirmatn; font-size: 13px; font-weight: 700; color: #EA443C; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all .15s; }
  .upload-btn:hover { background: rgba(234,68,60,.12); border-color: #EA443C; }
`

/* ─── Crop Modal — crop-box-on-image style ─── */
function ImageCropModal({ src, onCrop, onClose }) {
  const CW = 360; const CH = 320 // container display size
  const ASPECT = 1               // 1:1 square crop for trainer photos

  const imgRef = useRef(null)
  const metaRef = useRef(null)   // { offsetX, offsetY, dispW, dispH, scale, natW, natH }
  const dragRef = useRef(null)
  const [meta, setMeta] = useState(null)
  const [box, setBox] = useState(null) // { x, y, size }

  const clampBox = (b, m) => {
    const h = b.size / ASPECT
    return {
      size: b.size,
      x: Math.max(m.offsetX, Math.min(m.offsetX + m.dispW - b.size, b.x)),
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
    const size = Math.min(dispW, dispH / ASPECT) * 0.88
    const h = size / ASPECT
    setBox({ x: offsetX + (dispW - size) / 2, y: offsetY + (dispH - h) / 2, size })
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

  const handleSize = (newSize) => {
    const m = metaRef.current; if (!m || !box) return
    setBox(b => clampBox({ ...b, size: newSize }, m))
  }

  const handleCrop = () => {
    if (!meta || !box) return
    const h = box.size / ASPECT
    const srcX = (box.x - meta.offsetX) / meta.scale
    const srcY = (box.y - meta.offsetY) / meta.scale
    const srcW = box.size / meta.scale
    const srcH = h / meta.scale
    const canvas = document.createElement('canvas')
    canvas.width = 800; canvas.height = 800
    canvas.getContext('2d').drawImage(imgRef.current, srcX, srcY, srcW, srcH, 0, 0, 800, 800)
    onCrop(canvas.toDataURL('image/jpeg', 0.92))
  }

  const maxSize = meta ? Math.min(meta.dispW, meta.dispH / ASPECT) : 200
  const boxH = box ? box.size / ASPECT : 0

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div style={{ background: '#fff', borderRadius: 22, padding: '24px 24px 22px', maxWidth: 420, width: '100%', animation: 'slideUp .25s ease', boxShadow: '0 32px 80px rgba(0,0,0,.35)' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#111', marginBottom: 3 }}>برش عکس مربی</h3>
        <p style={{ fontSize: 12, color: '#aaa', marginBottom: 16 }}>قاب قرمز را بکش تا ناحیه دلخواه را انتخاب کنی</p>

        {/* Image + crop overlay */}
        <div style={{ position: 'relative', width: CW, height: CH, background: '#111', borderRadius: 14, overflow: 'hidden', margin: '0 auto 18px', userSelect: 'none' }}>
          <img ref={imgRef} src={src} onLoad={handleLoad} draggable={false} alt=""
            style={{ position: 'absolute', left: meta?.offsetX, top: meta?.offsetY, width: meta?.dispW, height: meta?.dispH, display: 'block', pointerEvents: 'none' }}
          />
          {box && (
            <div
              style={{
                position: 'absolute', left: box.x, top: box.y, width: box.size, height: boxH,
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
              {/* Rule-of-thirds */}
              {[33, 66].map(p => <div key={`v${p}`} style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />)}
              {[33, 66].map(p => <div key={`h${p}`} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />)}
              {/* Corner marks */}
              {[['top:0;left:0', 'top', 'left'], ['top:0;right:0', 'top', 'right'], ['bottom:0;left:0', 'bottom', 'left'], ['bottom:0;right:0', 'bottom', 'right']].map(([, v, h]) => (
                <div key={`${v}${h}`} style={{ position: 'absolute', [v]: -2, [h]: -2, width: 12, height: 12, borderStyle: 'solid', borderColor: '#EA443C', borderWidth: `${v === 'top' ? 3 : 0}px ${h === 'right' ? 3 : 0}px ${v === 'bottom' ? 3 : 0}px ${h === 'left' ? 3 : 0}px`, pointerEvents: 'none' }} />
              ))}
            </div>
          )}
        </div>

        {/* Size slider */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#999' }}>اندازه قاب کراپ</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#EA443C' }}>{box ? Math.round(box.size / maxSize * 100) : 88}٪</span>
          </div>
          <input type="range" min={Math.max(60, maxSize * 0.25)} max={maxSize} step={1}
            value={box?.size ?? maxSize * 0.88}
            onChange={e => handleSize(+e.target.value)}
            style={{ width: '100%', accentColor: '#EA443C', cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="admin-btn-ghost" onClick={onClose} style={{ flex: 1 }}>انصراف</button>
          <button className="admin-btn-primary" onClick={handleCrop} style={{ flex: 1 }}>برش و ذخیره</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Trainer Modal ─── */
function TrainerModal({ trainer, cropSrc, onRequestCrop, onSave, onClose }) {
  const [form, setForm] = useState(trainer ? {
    ...trainer,
    specialties: Array.isArray(trainer.specialties) ? trainer.specialties.join('، ') : trainer.specialties || '',
    achievements: Array.isArray(trainer.achievements) ? trainer.achievements.join('، ') : trainer.achievements || '',
    days: [...(trainer.days || [])],
  } : {
    id: 'trainer-' + Date.now(), name: '', role: '', initial: '', tag: '', exp: '', sessions: '',
    level: '', cert: '', bio: '', gradFrom: '#1C2B3A', gradTo: '#0D1820',
    specialties: '', achievements: '', days: [], photo: '',
  })

  const fileRef = useRef(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleDay = (d) => set('days', form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d])

  // When crop is done externally, apply photo
  const prevCropSrc = useRef(cropSrc)
  if (prevCropSrc.current !== null && cropSrc === null && form.photo === (trainer?.photo || '')) {
    // crop was cancelled, nothing to do
  }
  prevCropSrc.current = cropSrc

  const save = () => {
    onSave({
      ...form,
      specialties: form.specialties.split('،').map(s => s.trim()).filter(Boolean),
      achievements: form.achievements.split('،').map(s => s.trim()).filter(Boolean),
    })
  }

  const handleFileClick = () => fileRef.current?.click()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onRequestCrop(ev.target.result, (dataUrl) => set('photo', dataUrl))
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const fields = [
    ['name','نام کامل'], ['role','تخصص'], ['initial','حرف اول'], ['tag','برچسب'],
    ['exp','سابقه'], ['sessions','جلسات'], ['level','سطح'], ['cert','مدرک'],
  ]

  return (
    <div className="admin-modal-overlay" style={{ zIndex: 1000 }} onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0ebe3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: '#111' }}>{trainer ? 'ویرایش مربی' : 'مربی جدید'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: 4, display: 'flex' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Photo */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 14, overflow: 'hidden', flexShrink: 0,
              background: form.photo ? 'transparent' : `linear-gradient(135deg, ${form.gradFrom || '#1C2B3A'}, ${form.gradTo || '#0D1820'})`,
              border: '2px solid #e8e3dc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {form.photo
                ? <img src={form.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 26, fontWeight: 900, color: 'rgba(255,255,255,.3)' }}>{form.initial || '؟'}</span>
              }
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 6 }}>عکس مربی</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={handleFileClick} className="admin-btn-primary" style={{ padding: '7px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  بارگذاری
                </button>
                {form.photo && (
                  <button type="button" onClick={() => set('photo', '')} style={{ background: '#fff5f5', color: '#ef4444', border: '1.5px solid #fecaca', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Vazirmatn' }}>
                    حذف
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {fields.map(([k, label]) => (
              <div key={k} className="admin-field">
                <label>
                  <span>{label}</span>
                  <input className="admin-input" value={form[k] || ''} onChange={e => set(k, e.target.value)} />
                </label>
              </div>
            ))}
          </div>

          <div className="admin-field" style={{ marginBottom: 14 }}>
            <label>
              <span>بیوگرافی</span>
              <textarea className="admin-input" value={form.bio || ''} onChange={e => set('bio', e.target.value)} rows={3} style={{ resize: 'vertical' }} />
            </label>
          </div>

          <div className="admin-field" style={{ marginBottom: 14 }}>
            <label>
              <span>تخصص‌ها (با ویرگول فارسی جدا کن)</span>
              <input className="admin-input" value={form.specialties} onChange={e => set('specialties', e.target.value)} />
            </label>
          </div>

          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label>
              <span>افتخارات (با ویرگول فارسی جدا کن)</span>
              <input className="admin-input" value={form.achievements} onChange={e => set('achievements', e.target.value)} />
            </label>
          </div>

          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>روزهای حضور</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {days.map(d => (
                <button key={d} onClick={() => toggleDay(d)} style={{
                  padding: '6px 13px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Vazirmatn', border: '1.5px solid',
                  borderColor: form.days.includes(d) ? '#EA443C' : '#e8e3dc',
                  background: form.days.includes(d) ? 'rgba(234,68,60,.08)' : '#fafaf9',
                  color: form.days.includes(d) ? '#EA443C' : '#aaa',
                  transition: 'all .15s',
                }}>{d}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="admin-btn-ghost" onClick={onClose}>انصراف</button>
            <button className="admin-btn-primary" onClick={save}>ذخیره مربی</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeleteModal({ name, onConfirm, onClose }) {
  return (
    <div className="admin-modal-overlay" style={{ zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 360, width: '100%', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,.2)', animation: 'slideUp .25s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff5f5', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#ef4444' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#111', marginBottom: 8 }}>حذف مربی؟</h3>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24, lineHeight: 1.7 }}>
          آیا از حذف <strong style={{ color: '#111' }}>{name}</strong> مطمئنی؟<br/>این عمل قابل بازگشت نیست.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="admin-btn-ghost" onClick={onClose}>انصراف</button>
          <button onClick={onConfirm} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontFamily: 'Vazirmatn', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>حذف کن</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminTrainers() {
  const { trainers, updateTrainer, deleteTrainer, addTrainer } = useAdmin()
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  // Crop state lives at top level so it renders outside any other modal
  const [cropState, setCropState] = useState(null) // { src, onDone }

  const handleSave = (data) => {
    if (modal === 'add') addTrainer(data)
    else updateTrainer(data.id, data)
    setModal(null)
  }

  const handleRequestCrop = (src, onDone) => {
    setCropState({ src, onDone })
  }

  const handleCropped = (dataUrl) => {
    cropState?.onDone(dataUrl)
    setCropState(null)
  }

  return (
    <div style={{ padding: '36px 40px' }}>
      <style>{CSS}</style>

      {/* Crop modal at top level — z-index 2000, above everything */}
      {cropState && (
        <ImageCropModal
          src={cropState.src}
          onCrop={handleCropped}
          onClose={() => setCropState(null)}
        />
      )}

      {modal && (
        <TrainerModal
          trainer={modal === 'add' ? null : modal}
          cropSrc={cropState?.src || null}
          onRequestCrop={handleRequestCrop}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={() => { deleteTrainer(deleteTarget.id); setDeleteTarget(null) }}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>مربیان</h1>
          <p style={{ fontSize: 13, color: '#999' }}>{trainers.length} مربی فعال در باشگاه</p>
        </div>
        <button onClick={() => setModal('add')} className="admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          مربی جدید
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>
        {trainers.map(t => (
          <div key={t.id} className="trainer-card">
            <div style={{
              width: 50, height: 50, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
              background: t.photo ? 'transparent' : `linear-gradient(135deg, ${t.gradFrom}, ${t.gradTo})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900, color: 'rgba(255,255,255,.65)',
              border: '2px solid #f0ebe3',
            }}>
              {t.photo ? <img src={t.photo} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : t.initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#EA443C', fontWeight: 700, marginBottom: 10 }}>{t.role}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, background: '#f5f0ea', color: '#777', padding: '3px 9px', borderRadius: 999, fontWeight: 600 }}>{t.exp}</span>
                <span style={{ fontSize: 11, background: '#f5f0ea', color: '#777', padding: '3px 9px', borderRadius: 999, fontWeight: 600 }}>{t.sessions}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button className="icon-btn edit" onClick={() => setModal(t)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button className="icon-btn del" onClick={() => setDeleteTarget(t)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {trainers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#bbb' }}>
          <p style={{ fontSize: 14, fontWeight: 600 }}>هیچ مربی‌ای ثبت نشده</p>
        </div>
      )}
    </div>
  )
}
