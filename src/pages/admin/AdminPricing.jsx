import { useState } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const CSS = `
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .plan-card { background: #fff; border-radius: 18px; border: 1.5px solid #ede8e0; padding: 24px; transition: box-shadow .2s, transform .2s; position: relative; }
  .plan-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.08); transform: translateY(-2px); }
  .admin-input { border: 1.5px solid #e8e3dc; border-radius: 10px; padding: 9px 13px; font-size: 13px; outline: none; font-family: 'Vazirmatn', sans-serif; transition: border-color .18s; width: 100%; box-sizing: border-box; }
  .admin-input:focus { border-color: #EA443C; }
  .admin-btn-primary { background: #EA443C; color: #fff; border: none; border-radius: 10px; padding: 10px 22px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Vazirmatn', sans-serif; transition: all .15s; }
  .admin-btn-primary:hover { background: #d63830; }
  .admin-btn-ghost { background: #fff; color: #555; border: 1.5px solid #e8e3dc; border-radius: 10px; padding: 10px 18px; font-size: 14px; cursor: pointer; font-family: 'Vazirmatn', sans-serif; transition: all .15s; }
  .admin-btn-ghost:hover { border-color: #ccc; }
  .edit-toggle { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e8e3dc; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #888; transition: all .15s; }
  .edit-toggle:hover { border-color: #EA443C; color: #EA443C; background: rgba(234,68,60,.05); }
  .custom-checkbox { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #e8e3dc; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; flex-shrink: 0; }
  .custom-checkbox.checked { border-color: #EA443C; background: #EA443C; }
`

function PlanCard({ plan, isEditing, onEdit, onSave, onCancel }) {
  const [form, setForm] = useState({ ...plan, features: plan.features.join('\n') })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    onSave({ ...form, features: form.features.split('\n').map(s => s.trim()).filter(Boolean) })
  }

  if (isEditing) {
    return (
      <div className="plan-card" style={{ borderColor: plan.color + '50' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, color: '#111' }}>ویرایش: {plan.name}</h3>
          <button className="edit-toggle" onClick={onCancel}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[['name','نام پلن'], ['price','قیمت'], ['period','دوره'], ['cta','متن دکمه']].map(([k, label]) => (
            <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>{label}</span>
              <input className="admin-input" value={form[k] || ''} onChange={e => set(k, e.target.value)} />
            </label>
          ))}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>ویژگی‌ها (هر خط یک ویژگی)</span>
            <textarea className="admin-input" value={form.features} onChange={e => set('features', e.target.value)} rows={5} style={{ resize: 'vertical' }} />
          </label>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '2px 0' }}
            onClick={() => set('popular', !form.popular)}
          >
            <div className={`custom-checkbox${form.popular ? ' checked' : ''}`}>
              {form.popular && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>پلن پرطرفدار</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button className="admin-btn-ghost" onClick={onCancel} style={{ flex: 1 }}>انصراف</button>
          <button className="admin-btn-primary" onClick={handleSave} style={{ flex: 1 }}>ذخیره</button>
        </div>
      </div>
    )
  }

  return (
    <div className="plan-card" style={{ borderColor: plan.popular ? plan.color + '40' : '#ede8e0' }}>
      {plan.popular && (
        <span style={{
          position: 'absolute', top: -1, right: 24,
          background: plan.color, color: '#fff', fontSize: 10, fontWeight: 800,
          padding: '3px 12px', borderRadius: '0 0 10px 10px',
        }}>پرطرفدار</span>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#111' }}>{plan.name}</h3>
        <button className="edit-toggle" onClick={onEdit}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color: plan.color, marginBottom: 16, lineHeight: 1 }}>
        {plan.price}
        <span style={{ fontSize: 12, color: '#aaa', fontWeight: 400, marginRight: 6 }}>تومان / {plan.period}</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#555', marginBottom: 8, lineHeight: 1.5 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" style={{ marginTop: 1, flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AdminPricing() {
  const { pricing, updatePlan } = useAdmin()
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(false)

  const save = (id, data) => {
    updatePlan(id, data)
    setEditing(null)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <div style={{ padding: '36px 40px' }}>
      <style>{CSS}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#18181b', color: '#fff', borderRadius: 12,
          padding: '12px 20px', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,.25)', zIndex: 9999,
          animation: 'slideUp .25s ease',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          تغییرات ذخیره شد
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>قیمت‌گذاری</h1>
        <p style={{ fontSize: 13, color: '#999' }}>ویرایش پلن‌های عضویت باشگاه</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
        {pricing.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isEditing={editing === plan.id}
            onEdit={() => setEditing(plan.id)}
            onSave={(data) => save(plan.id, data)}
            onCancel={() => setEditing(null)}
          />
        ))}
      </div>
    </div>
  )
}
