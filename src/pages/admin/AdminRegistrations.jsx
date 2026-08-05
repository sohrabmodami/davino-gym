import { useCallback, useEffect, useState } from 'react'

const TOKEN_KEY = 'davino_admin_token'

const STATUSES = {
  pending: { label: 'پیگیری‌نشده', color: '#F59E0B' },
  contacted: { label: 'پیگیری‌شده', color: '#3B82F6' },
  completed: { label: 'ثبت‌نام تکمیل‌شده', color: '#22C55E' },
  cancelled: { label: 'لغوشده', color: '#EF4444' },
}

const CSS = `
  @keyframes regUp { from { transform: translateY(10px); } to { transform: translateY(0); } }
  .reg-card { background: var(--ad-card); border: 1px solid var(--ad-card-b); border-radius: 16px; padding: 20px; animation: regUp .22s ease; }
  .reg-detail-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px 22px; }
  .reg-filter { border: none; padding: 7px 14px; border-radius: 999px; background: transparent; color: var(--ad-text2); font: 700 12px 'Vazirmatn'; white-space: nowrap; }
  .reg-filter.active { background: #275EAA; color: #fff; }
  .reg-select { min-width: 175px; background: var(--ad-rowh); color: var(--text); border: 1.5px solid var(--ad-card-b); border-radius: 10px; padding: 9px 12px; outline: none; font: 700 12px 'Vazirmatn'; }
  .reg-select:focus { border-color: #275EAA; }
  @media (max-width: 760px) { .reg-detail-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 520px) { .reg-detail-grid { grid-template-columns: 1fr; } .reg-card { padding: 16px; } }
`

const faDate = (iso) => {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
  } catch { return iso }
}

function Detail({ label, value, ltr = false, full = false }) {
  return (
    <div style={{ minWidth: 0, gridColumn: full ? '1 / -1' : undefined }}>
      <div style={{ fontSize: 10.5, color: 'var(--ad-text3)', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div dir={ltr ? 'ltr' : 'rtl'} style={{ fontSize: 13, color: 'var(--ad-text2)', fontWeight: 600, lineHeight: 1.75, wordBreak: 'break-word', textAlign: ltr ? 'right' : undefined }}>{value || '—'}</div>
    </div>
  )
}

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const token = sessionStorage.getItem(TOKEN_KEY) || ''

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/registrations', { headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) throw new Error('failed')
      const data = await response.json()
      setRegistrations(Array.isArray(data.registrations) ? data.registrations : [])
    } catch {
      setError('بارگذاری درخواست‌های ثبت‌نام ناموفق بود.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    const previous = registrations
    const next = registrations.map(item => item.id === id ? { ...item, status, statusUpdatedAt: new Date().toISOString() } : item)
    setRegistrations(next)
    setSavingId(id)
    setError('')
    try {
      const response = await fetch('/api/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ registrations: next }),
      })
      if (!response.ok) throw new Error('failed')
    } catch {
      setRegistrations(previous)
      setError('ذخیره وضعیت ناموفق بود؛ تغییر انجام نشد.')
    } finally {
      setSavingId('')
    }
  }

  const counts = Object.keys(STATUSES).reduce((result, status) => {
    result[status] = registrations.filter(item => item.status === status).length
    return result
  }, {})
  const shown = filter === 'all' ? registrations : registrations.filter(item => item.status === filter)

  return (
    <div style={{ padding: '36px clamp(18px, 4vw, 40px)', maxWidth: 1080 }}>
      <style>{CSS}</style>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>درخواست‌های ثبت‌نام</h1>
          <p style={{ fontSize: 13, color: 'var(--ad-text2)' }}>{counts.pending || 0} درخواست هنوز پیگیری نشده است</p>
        </div>
        <button onClick={load} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid var(--ad-card-b)', background: 'var(--ad-card)', color: 'var(--ad-text2)', font: "700 12px 'Vazirmatn'" }}>تازه‌سازی</button>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: 3, marginBottom: 22, width: 'fit-content', maxWidth: '100%', overflowX: 'auto', background: 'var(--ad-card)', border: '1px solid var(--ad-card-b)', borderRadius: 999 }}>
        <button className={`reg-filter${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>همه ({registrations.length})</button>
        {Object.entries(STATUSES).map(([key, status]) => (
          <button key={key} className={`reg-filter${filter === key ? ' active' : ''}`} onClick={() => setFilter(key)}>{status.label} ({counts[key] || 0})</button>
        ))}
      </div>

      {error && <div role="alert" style={{ color: '#EF4444', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 11, padding: '11px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}
      {loading ? (
        <div style={{ color: 'var(--ad-text3)', fontSize: 14 }}>در حال بارگذاری…</div>
      ) : shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--ad-text3)', background: 'var(--ad-card)', border: '1px dashed var(--ad-card-b)', borderRadius: 16 }}>درخواستی برای نمایش وجود ندارد.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {shown.map(item => {
            const status = STATUSES[item.status] || STATUSES.pending
            return (
              <article key={item.id} className="reg-card" style={{ borderRight: `3px solid ${status.color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--ad-card-b)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 5 }}>
                      <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>{item.fullName}</h2>
                      <span style={{ fontSize: 10.5, color: status.color, background: `${status.color}16`, border: `1px solid ${status.color}38`, borderRadius: 999, padding: '3px 9px', fontWeight: 800 }}>{status.label}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ad-text3)' }}>ثبت درخواست: {faDate(item.date)}</div>
                  </div>
                  <select className="reg-select" value={item.status} disabled={savingId === item.id} onChange={event => updateStatus(item.id, event.target.value)} style={{ opacity: savingId === item.id ? .6 : 1 }}>
                    {Object.entries(STATUSES).map(([key, option]) => <option key={key} value={key}>{option.label}</option>)}
                  </select>
                </div>

                <div className="reg-detail-grid">
                  <Detail label="شماره تماس" value={item.phone} ltr />
                  <Detail label="کد ملی" value={item.nationalId} ltr />
                  <Detail label="تاریخ تولد" value={item.birthDate} />
                  <Detail label="اعتبار بیمه ورزشی" value={item.insuranceExpiry} />
                  <Detail label="پکیج انتخابی" value={item.planName} />
                  <Detail label="مبلغ پکیج" value={item.planPrice ? `${item.planPrice} تومان` : '—'} />
                  <Detail label="آدرس" value={item.address} full />
                </div>

                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <a href={`tel:${item.phone}`} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: 9, background: 'rgba(39,94,170,.1)', border: '1px solid rgba(39,94,170,.25)', color: '#275EAA', fontSize: 12, fontWeight: 800 }}>تماس با متقاضی</a>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
