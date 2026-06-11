import { useState } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const DAYS_LIST = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
const LEVELS = ['مبتدی', 'متوسط', 'پیشرفته']
const COLORS = ['#EA443C', '#22C55E', '#3B82F6', '#F59E0B', '#A855F7', '#06B6D4', '#10B981', '#F97316']

const CSS = `
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .cls-row { display: grid; grid-template-columns: 28px 1fr 1fr 1fr 1fr auto; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 12px; border: 1px solid #ede8e0; background: #fff; transition: box-shadow .15s; }
  .cls-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,.07); }
  .admin-input { border: 1.5px solid #e8e3dc; border-radius: 10px; padding: 9px 13px; font-size: 13px; outline: none; font-family: 'Vazirmatn', sans-serif; transition: border-color .18s; width: 100%; box-sizing: border-box; }
  .admin-input:focus { border-color: #EA443C; }
  .admin-btn-primary { background: #EA443C; color: #fff; border: none; border-radius: 10px; padding: 10px 22px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Vazirmatn', sans-serif; transition: all .15s; }
  .admin-btn-primary:hover { background: #d63830; }
  .admin-btn-ghost { background: #fff; color: #555; border: 1.5px solid #e8e3dc; border-radius: 10px; padding: 10px 18px; font-size: 14px; cursor: pointer; font-family: 'Vazirmatn', sans-serif; }
  .admin-modal-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .2s; }
  .day-tag { padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 700; background: rgba(0,0,0,.06); color: #555; display: inline-block; font-family: 'Vazirmatn'; margin: 2px; }

  /* Toggle */
  .toggle-wrap { position: relative; display: inline-block; width: 38px; height: 22px; flex-shrink: 0; }
  .toggle-wrap input { opacity: 0; width: 0; height: 0; position: absolute; }
  .toggle-slider { position: absolute; inset: 0; border-radius: 999px; cursor: pointer; background: #e0dbd3; transition: background .2s; }
  .toggle-slider:before { content: ''; position: absolute; width: 16px; height: 16px; border-radius: 50%; left: 3px; top: 3px; background: #fff; transition: transform .2s; box-shadow: 0 1px 4px rgba(0,0,0,.18); }
  .toggle-wrap input:checked + .toggle-slider { background: #EA443C; }
  .toggle-wrap input:checked + .toggle-slider:before { transform: translateX(16px); }
`

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-wrap">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  )
}

function ClassModal({ cls, onSave, onClose }) {
  const [form, setForm] = useState(cls || {
    title: '', trainerName: '', days: [], startTime: '09:00', endTime: '10:00',
    level: 'مبتدی', sessions: 8, capacity: 10, enrolled: 0, price: '', color: '#EA443C', active: true,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleDay = d => set('days', form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d])

  const valid = form.title && form.trainerName && form.days.length > 0

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,.2)', animation: 'slideUp .25s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '22px 26px', borderBottom: '1px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#111' }}>{cls ? 'ویرایش کلاس' : 'کلاس جدید'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: '1/-1' }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>عنوان کلاس</span>
              <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="سنگنوردی مقدماتی" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>نام مربی</span>
              <input className="admin-input" value={form.trainerName} onChange={e => set('trainerName', e.target.value)} placeholder="علی محمدی" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>سطح</span>
              <select className="admin-input" value={form.level} onChange={e => set('level', e.target.value)}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>تعداد جلسات ماهانه</span>
              <select className="admin-input" value={form.sessions || 8} onChange={e => set('sessions', +e.target.value)}>
                <option value={4}>۴ جلسه در ماه</option>
                <option value={8}>۸ جلسه در ماه</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>ساعت شروع</span>
              <input className="admin-input" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>ساعت پایان</span>
              <input className="admin-input" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>ظرفیت کل</span>
              <input className="admin-input" type="number" min={1} value={form.capacity} onChange={e => set('capacity', +e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>ثبت‌نام شده</span>
              <input className="admin-input" type="number" min={0} value={form.enrolled} onChange={e => set('enrolled', +e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: '1/-1' }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>هزینه ماهانه (تومان)</span>
              <input className="admin-input" value={form.price} onChange={e => set('price', e.target.value)} placeholder="۲۵۰,۰۰۰" />
            </label>
          </div>

          {/* Days */}
          <div>
            <div style={{ fontSize: 11, color: '#999', fontWeight: 700, marginBottom: 8 }}>روزهای برگزاری</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {DAYS_LIST.map(d => (
                <button key={d} type="button" onClick={() => toggleDay(d)} style={{
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

          {/* Color */}
          <div>
            <div style={{ fontSize: 11, color: '#999', fontWeight: 700, marginBottom: 8 }}>رنگ کلاس</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('color', c)} style={{
                  width: 28, height: 28, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                  outline: form.color === c ? `3px solid ${c}` : 'none',
                  outlineOffset: 2, transition: 'all .15s',
                }} />
              ))}
            </div>
          </div>

          {/* Active toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #f0ebe3' }}>
            <Toggle checked={form.active} onChange={v => set('active', v)} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>نمایش در سایت</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>{form.active ? 'این کلاس در صفحه کلاس‌ها نمایش داده می‌شود' : 'این کلاس مخفی است'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="admin-btn-ghost" onClick={onClose} style={{ flex: 1 }}>انصراف</button>
            <button className="admin-btn-primary" onClick={() => valid && onSave(form)} disabled={!valid} style={{ flex: 1, opacity: valid ? 1 : .4 }}>ذخیره</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminClasses() {
  const { classes = [], addClass, updateClass, deleteClass } = useAdmin()
  const [modal, setModal] = useState(null) // null | 'add' | classObj
  const [toast, setToast] = useState(false)

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500) }

  const handleSave = (data) => {
    if (modal === 'add') addClass(data)
    else updateClass(data.id, data)
    setModal(null)
    showToast()
  }

  const active = classes.filter(c => c.active).length

  return (
    <div style={{ padding: '36px 40px' }}>
      <style>{CSS}</style>

      {toast && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: '#18181b', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(0,0,0,.25)', zIndex: 9999, animation: 'slideUp .25s ease' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          تغییرات ذخیره شد
        </div>
      )}

      {modal && (
        <ClassModal
          cls={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>کلاس‌ها</h1>
          <p style={{ fontSize: 13, color: '#999' }}>{classes.length} کلاس — {active} فعال</p>
        </div>
        <button
          onClick={() => setModal('add')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#EA443C', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Vazirmatn', boxShadow: '0 4px 16px rgba(234,68,60,.3)', transition: 'all .15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#d63830'}
          onMouseLeave={e => e.currentTarget.style.background = '#EA443C'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          کلاس جدید
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {classes.map(cls => (
          <div key={cls.id} className="cls-row">
            {/* Color dot */}
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: cls.color, flexShrink: 0, margin: '0 auto' }} />

            {/* Title + days */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: cls.active ? '#111' : '#bbb', marginBottom: 4 }}>{cls.title}</div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {cls.days.map(d => <span key={d} className="day-tag">{d}</span>)}
              </div>
            </div>

            {/* Trainer */}
            <div style={{ fontSize: 13, color: '#666' }}>{cls.trainerName}</div>

            {/* Time + sessions */}
            <div>
              <div style={{ fontSize: 13, color: '#555', fontWeight: 700 }}>{cls.startTime} — {cls.endTime}</div>
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>{cls.sessions || 8} جلسه/ماه</div>
            </div>

            {/* Capacity */}
            <div style={{ fontSize: 13, color: '#555' }}>
              <span style={{ fontWeight: 700 }}>{cls.enrolled}</span>
              <span style={{ color: '#bbb' }}>/{cls.capacity}</span>
              <div style={{ height: 4, background: '#f0ebe3', borderRadius: 999, marginTop: 4, width: 60, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round(cls.enrolled/cls.capacity*100)}%`, background: cls.color, borderRadius: 999 }} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle checked={cls.active} onChange={v => updateClass(cls.id, { active: v })} />
              <button onClick={() => setModal(cls)} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #e8e3dc', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#EA443C'; e.currentTarget.style.color = '#EA443C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e3dc'; e.currentTarget.style.color = '#888' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button onClick={() => deleteClass(cls.id)} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #fecaca', background: '#fff5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#ef4444' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#ccc' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#aaa', marginBottom: 4 }}>هنوز کلاسی اضافه نشده</p>
          <p style={{ fontSize: 13, color: '#bbb' }}>با دکمه «کلاس جدید» شروع کن</p>
        </div>
      )}
    </div>
  )
}
