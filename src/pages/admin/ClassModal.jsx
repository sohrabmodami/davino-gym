import { useState } from 'react'

const DAYS_LIST = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
const LEVELS = ['مبتدی', 'متوسط', 'پیشرفته']
const COLORS = ['#EA443C', '#22C55E', '#3B82F6', '#F59E0B', '#A855F7', '#06B6D4', '#10B981', '#F97316']

const CSS = `
  @keyframes cmFadeIn { from{opacity:0} to{opacity:1} }
  @keyframes cmSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .cm-input { border: 1.5px solid var(--ad-card-b); border-radius: 10px; padding: 9px 13px; font-size: 13px; outline: none; font-family: 'Vazirmatn', sans-serif; transition: border-color .18s; width: 100%; box-sizing: border-box; background: var(--ad-card); color: var(--text); }
  .cm-input:focus { border-color: #EA443C; }
  .cm-input:disabled { opacity: .7; cursor: not-allowed; }
  .cm-btn-primary { background: #EA443C; color: #fff; border: none; border-radius: 10px; padding: 10px 22px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Vazirmatn', sans-serif; transition: all .15s; }
  .cm-btn-primary:hover { background: #d63830; }
  .cm-btn-ghost { background: var(--ad-card); color: var(--ad-text2); border: 1.5px solid var(--ad-card-b); border-radius: 10px; padding: 10px 18px; font-size: 14px; cursor: pointer; font-family: 'Vazirmatn', sans-serif; }
  .cm-toggle { position: relative; display: inline-block; width: 38px; height: 22px; flex-shrink: 0; }
  .cm-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
  .cm-slider { position: absolute; inset: 0; border-radius: 999px; cursor: pointer; background: var(--track); transition: background .2s; }
  .cm-slider:before { content: ''; position: absolute; width: 16px; height: 16px; border-radius: 50%; left: 3px; top: 3px; background: var(--ad-card); transition: transform .2s; box-shadow: 0 1px 4px rgba(0,0,0,.18); }
  .cm-toggle input:checked + .cm-slider { background: #EA443C; }
  .cm-toggle input:checked + .cm-slider:before { transform: translateX(16px); }
`

export function Toggle({ checked, onChange }) {
  return (
    <label className="cm-toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="cm-slider" />
    </label>
  )
}

/* مودال ساخت/ویرایش کلاس — مشترک بین «کلاس‌ها» و «مربیان».
   lockedTrainerId: اگر ست شود، مربی روی همان مربی قفل می‌شود (افزودن کلاس از داخل پروفایل مربی). */
export default function ClassModal({ cls, trainers = [], lockedTrainerId = null, onSave, onClose }) {
  const [form, setForm] = useState(cls || {
    title: '', trainerId: lockedTrainerId || '', trainerName: '', days: [], startTime: '09:00', endTime: '10:00',
    level: 'مبتدی', sessions: 8, capacity: 10, enrolled: 0, price: '', color: '#EA443C', active: true,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleDay = d => set('days', form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d])

  const pickTrainer = (id) => {
    const t = trainers.find(x => x.id === id)
    setForm(f => ({ ...f, trainerId: id, trainerName: t ? t.name : '' }))
  }

  // اگر مربی قفل است و کلاس جدید است، نام کش را هم ست کن
  const effectiveTrainerId = lockedTrainerId || form.trainerId
  const valid = form.title && effectiveTrainerId && form.days.length > 0

  const handleSave = () => {
    if (!valid) return
    const t = trainers.find(x => x.id === effectiveTrainerId)
    onSave({ ...form, trainerId: effectiveTrainerId, trainerName: t ? t.name : form.trainerName })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1600, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'cmFadeIn .2s' }} onClick={onClose}>
      <style>{CSS}</style>
      <div style={{ background: 'var(--ad-card)', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,.3)', animation: 'cmSlideUp .25s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--ad-card-b)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>{cls ? 'ویرایش کلاس' : 'کلاس جدید'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ad-text3)', display: 'flex', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: '1/-1' }}>
              <span style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700 }}>عنوان کلاس</span>
              <input className="cm-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="سنگنوردی مقدماتی" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700 }}>مربی</span>
              {lockedTrainerId ? (
                <input className="cm-input" disabled value={trainers.find(t => t.id === lockedTrainerId)?.name || ''} />
              ) : (
                <select className="cm-input" value={form.trainerId || ''} onChange={e => pickTrainer(e.target.value)}>
                  <option value="" disabled>انتخاب مربی…</option>
                  {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              )}
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700 }}>سطح</span>
              <select className="cm-input" value={form.level} onChange={e => set('level', e.target.value)}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700 }}>نوع کلاس (جلسات ماهانه)</span>
              <select className="cm-input" value={form.sessions || 8} onChange={e => set('sessions', +e.target.value)}>
                <option value={4}>۴ جلسه در ماه</option>
                <option value={8}>۸ جلسه در ماه</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700 }}>ساعت شروع</span>
              <input className="cm-input" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700 }}>ساعت پایان</span>
              <input className="cm-input" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700 }}>ظرفیت کل</span>
              <input className="cm-input" type="number" min={1} value={form.capacity} onChange={e => set('capacity', +e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700 }}>ثبت‌نام شده</span>
              <input className="cm-input" type="number" min={0} value={form.enrolled} onChange={e => set('enrolled', +e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: '1/-1' }}>
              <span style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700 }}>هزینه ماهانه (تومان)</span>
              <input className="cm-input" value={form.price} onChange={e => set('price', e.target.value)} placeholder="۲۵۰,۰۰۰" />
            </label>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700, marginBottom: 8 }}>روزهای برگزاری</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {DAYS_LIST.map(d => (
                <button key={d} type="button" onClick={() => toggleDay(d)} style={{
                  padding: '6px 13px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Vazirmatn', border: '1.5px solid',
                  borderColor: form.days.includes(d) ? '#EA443C' : 'var(--ad-card-b)',
                  background: form.days.includes(d) ? 'rgba(234,68,60,.08)' : 'var(--ad-rowh)',
                  color: form.days.includes(d) ? '#EA443C' : 'var(--ad-text3)',
                  transition: 'all .15s',
                }}>{d}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--ad-text2)', fontWeight: 700, marginBottom: 8 }}>رنگ کلاس</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('color', c)} style={{
                  width: 28, height: 28, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                  outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: 2, transition: 'all .15s',
                }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--ad-card-b)' }}>
            <Toggle checked={form.active} onChange={v => set('active', v)} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>نمایش در سایت</div>
              <div style={{ fontSize: 11, color: 'var(--ad-text3)' }}>{form.active ? 'این کلاس در صفحه کلاس‌ها نمایش داده می‌شود' : 'این کلاس مخفی است'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="cm-btn-ghost" onClick={onClose} style={{ flex: 1 }}>انصراف</button>
            <button className="cm-btn-primary" onClick={handleSave} disabled={!valid} style={{ flex: 1, opacity: valid ? 1 : .4 }}>ذخیره</button>
          </div>
        </div>
      </div>
    </div>
  )
}
