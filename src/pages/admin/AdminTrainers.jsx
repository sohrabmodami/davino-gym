import { useState } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

function TrainerModal({ trainer, onSave, onClose }) {
  const [form, setForm] = useState(trainer ? { ...trainer, specialties: trainer.specialties.join('، '), achievements: trainer.achievements.join('، '), days: [...trainer.days] } : {
    id: 'trainer-' + Date.now(), name: '', role: '', initial: '', tag: '', exp: '', sessions: '',
    level: '', cert: '', bio: '', gradFrom: '#1C2B3A', gradTo: '#0D1820',
    specialties: '', achievements: '', days: [],
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleDay = (d) => set('days', form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d])

  const save = () => {
    const out = { ...form, specialties: form.specialties.split('،').map(s => s.trim()).filter(Boolean), achievements: form.achievements.split('،').map(s => s.trim()).filter(Boolean) }
    onSave(out)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', padding: 32 }}
        onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24, color: '#111' }}>{trainer ? 'ویرایش مربی' : 'مربی جدید'}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[['name','نام'], ['role','تخصص'], ['initial','حرف اول'], ['tag','برچسب'], ['exp','تجربه'], ['sessions','جلسات'], ['level','سطح'], ['cert','گواهینامه']].map(([k, label]) => (
            <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{label}</span>
              <input value={form[k] || ''} onChange={e => set(k, e.target.value)}
                style={{ border: '1.5px solid #e8e3dc', borderRadius: 10, padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Vazirmatn, sans-serif' }} />
            </label>
          ))}
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 14 }}>
          <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>بیوگرافی</span>
          <textarea value={form.bio || ''} onChange={e => set('bio', e.target.value)} rows={3}
            style={{ border: '1.5px solid #e8e3dc', borderRadius: 10, padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Vazirmatn, sans-serif', resize: 'vertical' }} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 14 }}>
          <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>تخصص‌ها (با ویرگول جدا کن)</span>
          <input value={form.specialties} onChange={e => set('specialties', e.target.value)}
            style={{ border: '1.5px solid #e8e3dc', borderRadius: 10, padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Vazirmatn, sans-serif' }} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 14 }}>
          <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>افتخارات (با ویرگول جدا کن)</span>
          <input value={form.achievements} onChange={e => set('achievements', e.target.value)}
            style={{ border: '1.5px solid #e8e3dc', borderRadius: 10, padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Vazirmatn, sans-serif' }} />
        </label>

        <div style={{ marginTop: 14 }}>
          <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>روزهای حضور</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {days.map(d => (
              <button key={d} onClick={() => toggleDay(d)} style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Vazirmatn, sans-serif', border: '1.5px solid',
                borderColor: form.days.includes(d) ? '#EA443C' : '#e8e3dc',
                background: form.days.includes(d) ? 'rgba(234,68,60,.08)' : '#fff',
                color: form.days.includes(d) ? '#EA443C' : '#888',
              }}>{d}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: 10, border: '1.5px solid #e8e3dc', background: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 14 }}>انصراف</button>
          <button onClick={save} style={{ padding: '10px 28px', borderRadius: 10, border: 'none', background: '#EA443C', color: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 14, fontWeight: 700 }}>ذخیره</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminTrainers() {
  const { trainers, updateTrainer, deleteTrainer, addTrainer } = useAdmin()
  const [modal, setModal] = useState(null) // null | 'add' | trainer object
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleSave = (data) => {
    if (modal === 'add') addTrainer(data)
    else updateTrainer(data.id, data)
    setModal(null)
  }

  return (
    <div style={{ padding: '40px' }}>
      {modal && <TrainerModal trainer={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>حذف مربی؟</h3>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>این عمل قابل بازگشت نیست.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '9px 24px', border: '1.5px solid #e8e3dc', borderRadius: 10, background: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>انصراف</button>
              <button onClick={() => { deleteTrainer(deleteConfirm); setDeleteConfirm(null) }} style={{ padding: '9px 24px', border: 'none', borderRadius: 10, background: '#ef4444', color: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontWeight: 700 }}>حذف</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>مربیان</h1>
          <p style={{ fontSize: 13, color: '#888' }}>{trainers.length} مربی فعال</p>
        </div>
        <button onClick={() => setModal('add')} style={{
          background: '#EA443C', color: '#fff', border: 'none', borderRadius: 12,
          padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Vazirmatn, sans-serif', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          مربی جدید
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {trainers.map(t => (
          <div key={t.id} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8e3dc', padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${t.gradFrom}, ${t.gradTo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: 'rgba(255,255,255,.5)', flexShrink: 0 }}>{t.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#EA443C', fontWeight: 700, marginBottom: 8 }}>{t.role}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, background: '#f5f0ea', color: '#888', padding: '3px 10px', borderRadius: 999 }}>{t.exp}</span>
                <span style={{ fontSize: 11, background: '#f5f0ea', color: '#888', padding: '3px 10px', borderRadius: 999 }}>{t.sessions}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => setModal(t)} style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #e8e3dc', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button onClick={() => setDeleteConfirm(t.id)} style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #fecaca', background: '#fff5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
