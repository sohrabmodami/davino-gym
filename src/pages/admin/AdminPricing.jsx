import { useState } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

export default function AdminPricing() {
  const { pricing, updatePlan } = useAdmin()
  const [editing, setEditing] = useState(null)
  const [saved, setSaved] = useState(false)

  const save = (id, data) => {
    updatePlan(id, data)
    setEditing(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: 40 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>قیمت‌گذاری</h1>
        <p style={{ fontSize: 13, color: '#888' }}>ویرایش پلن‌های عضویت باشگاه</p>
      </div>

      {saved && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: '#166534', fontWeight: 600 }}>
          ✓ تغییرات ذخیره شد
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {pricing.map(plan => (
          <PlanCard key={plan.id} plan={plan}
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

function PlanCard({ plan, isEditing, onEdit, onSave, onCancel }) {
  const [form, setForm] = useState({ ...plan, features: plan.features.join('\n') })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    onSave({ ...form, features: form.features.split('\n').map(s => s.trim()).filter(Boolean) })
  }

  if (isEditing) {
    return (
      <div style={{ background: '#fff', borderRadius: 16, border: `2px solid ${plan.color}`, padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: '#111' }}>ویرایش پلن {plan.name}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[['name','نام پلن'], ['price','قیمت'], ['period','دوره'], ['cta','متن دکمه']].map(([k, label]) => (
            <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{label}</span>
              <input value={form[k] || ''} onChange={e => set(k, e.target.value)}
                style={{ border: '1.5px solid #e8e3dc', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'Vazirmatn, sans-serif' }} />
            </label>
          ))}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>ویژگی‌ها (هر خط یک ویژگی)</span>
            <textarea value={form.features} onChange={e => set('features', e.target.value)} rows={5}
              style={{ border: '1.5px solid #e8e3dc', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'Vazirmatn, sans-serif', resize: 'vertical' }} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.popular} onChange={e => set('popular', e.target.checked)} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>پلن پرطرفدار</span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '9px', border: '1.5px solid #e8e3dc', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 13 }}>انصراف</button>
          <button onClick={handleSave} style={{ flex: 1, padding: '9px', border: 'none', borderRadius: 8, background: '#EA443C', color: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 13, fontWeight: 700 }}>ذخیره</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: plan.popular ? `2px solid ${plan.color}` : '1.5px solid #e8e3dc', padding: 24, position: 'relative' }}>
      {plan.popular && (
        <span style={{ position: 'absolute', top: 16, left: 16, background: plan.color, color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>پرطرفدار</span>
      )}
      <h3 style={{ fontSize: 16, fontWeight: 900, color: '#111', marginBottom: 4 }}>{plan.name}</h3>
      <div style={{ fontSize: 22, fontWeight: 900, color: plan.color, marginBottom: 16 }}>
        {plan.price} <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>تومان/{plan.period}</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: 20 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#555', marginBottom: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {f}
          </li>
        ))}
      </ul>
      <button onClick={onEdit} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #e8e3dc', background: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        ویرایش پلن
      </button>
    </div>
  )
}
