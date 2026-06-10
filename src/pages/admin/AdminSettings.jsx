import { useState } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const fields = [
  { section: 'اطلاعات باشگاه', items: [
    { key: 'gymName', label: 'نام باشگاه' },
    { key: 'address', label: 'آدرس' },
    { key: 'phone', label: 'شماره تماس' },
    { key: 'hours', label: 'ساعات کار' },
  ]},
  { section: 'شبکه‌های اجتماعی', items: [
    { key: 'instagram', label: 'اینستاگرام (لینک)' },
    { key: 'telegram', label: 'تلگرام (لینک)' },
    { key: 'whatsapp', label: 'واتساپ (شماره)' },
    { key: 'youtube', label: 'یوتیوب (لینک)' },
  ]},
]

export default function AdminSettings() {
  const { settings, updateSettings } = useAdmin()
  const [form, setForm] = useState({ ...settings })
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ padding: 40, maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>تنظیمات</h1>
        <p style={{ fontSize: 13, color: '#888' }}>اطلاعات عمومی و شبکه‌های اجتماعی باشگاه</p>
      </div>

      {saved && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          تغییرات با موفقیت ذخیره شد
        </div>
      )}

      <form onSubmit={handleSave}>
        {fields.map(section => (
          <div key={section.section} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8e3dc', padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#111', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f0ebe3' }}>{section.section}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {section.items.map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{label}</span>
                  <input
                    value={form[key] || ''}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ border: '1.5px solid #e8e3dc', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: 'Vazirmatn, sans-serif', transition: 'border-color .2s' }}
                    onFocus={e => e.target.style.borderColor = '#EA443C'}
                    onBlur={e => e.target.style.borderColor = '#e8e3dc'}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" onClick={() => setForm({ ...settings })} style={{ padding: '11px 28px', border: '1.5px solid #e8e3dc', borderRadius: 12, background: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 14 }}>
            بازگشت به قبل
          </button>
          <button type="submit" style={{ padding: '11px 32px', border: 'none', borderRadius: 12, background: '#EA443C', color: '#fff', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 16px rgba(234,68,60,.3)' }}>
            ذخیره تنظیمات
          </button>
        </div>
      </form>
    </div>
  )
}
