import { useCallback, useEffect, useState } from 'react'

const TOKEN_KEY = 'davino_admin_token'

const STATUSES = {
  pending: { label: 'پیگیری‌نشده', color: '#F59E0B' },
  contacted: { label: 'پیگیری‌شده', color: '#3B82F6' },
  completed: { label: 'ثبت‌نام تکمیل‌شده', color: '#22C55E' },
  cancelled: { label: 'لغوشده', color: '#EF4444' },
}

const CSS = `
  @keyframes nkUp { from { transform: translateY(10px); } to { transform: translateY(0); } }
  .nk-admin-card { background: var(--ad-card); border: 1px solid var(--ad-card-b); border-radius: 16px; padding: 20px; animation: nkUp .22s ease; }
  .nk-admin-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px 22px; }
  .nk-admin-filter { border: none; padding: 7px 14px; border-radius: 999px; background: transparent; color: var(--ad-text2); font: 700 12px 'Vazirmatn'; white-space: nowrap; }
  .nk-admin-filter.active { background: #275EAA; color: #fff; }
  .nk-admin-select { min-width: 175px; background: var(--ad-rowh); color: var(--text); border: 1.5px solid var(--ad-card-b); border-radius: 10px; padding: 9px 12px; outline: none; font: 700 12px 'Vazirmatn'; }
  .nk-admin-btn { padding: 8px 14px; border-radius: 9px; border: 1px solid var(--ad-card-b); background: var(--ad-card); color: var(--ad-text2); font: 700 12px 'Vazirmatn'; cursor: pointer; }
  .nk-admin-btn.primary { background: #275EAA; color: #fff; border-color: #275EAA; }
  @media (max-width: 760px) { .nk-admin-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 520px) { .nk-admin-grid { grid-template-columns: 1fr; } .nk-admin-card { padding: 16px; } }
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

function csvEscape(value) {
  const text = String(value ?? '')
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function exportCsv(registrations) {
  const headers = [
    'تاریخ', 'وضعیت', 'نام کودک', 'سن', 'جنسیت', 'عضو باشگاه',
    'نام والد', 'نسبت', 'موبایل', 'داروها / شرایط پزشکی', 'توضیحات', 'منبع آشنایی', 'سایر منبع',
  ]
  const rows = registrations.map(item => [
    item.date, STATUSES[item.status]?.label || item.status,
    item.childName, item.childAge, item.childGender, item.isMember ? 'بله' : 'خیر',
    item.parentName, item.relation, item.parentPhone,
    item.medicalNotes, item.notes, item.heardFrom, item.heardOther,
  ].map(csvEscape).join(','))
  const bom = '\uFEFF'
  const blob = new Blob([bom + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `nature-kids-registrations-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function AdminNatureKids() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const token = sessionStorage.getItem(TOKEN_KEY) || ''

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/nature-kids-registrations', { headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) throw new Error('failed')
      const data = await response.json()
      setRegistrations(Array.isArray(data.registrations) ? data.registrations : [])
    } catch {
      setError('بارگذاری ثبت‌نام‌های برنامه طبیعت ناموفق بود.')
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
      const response = await fetch('/api/nature-kids-registrations', {
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
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>ثبت‌نام طبیعت کودکان</h1>
          <p style={{ fontSize: 13, color: 'var(--ad-text2)' }}>{counts.pending || 0} درخواست هنوز پیگیری نشده است</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="nk-admin-btn" onClick={load}>تازه‌سازی</button>
          <button className="nk-admin-btn primary" disabled={!registrations.length} onClick={() => exportCsv(shown.length ? shown : registrations)}>خروجی CSV</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: 3, marginBottom: 22, width: 'fit-content', maxWidth: '100%', overflowX: 'auto', background: 'var(--ad-card)', border: '1px solid var(--ad-card-b)', borderRadius: 999 }}>
        <button className={`nk-admin-filter${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>همه ({registrations.length})</button>
        {Object.entries(STATUSES).map(([key, status]) => (
          <button key={key} className={`nk-admin-filter${filter === key ? ' active' : ''}`} onClick={() => setFilter(key)}>{status.label} ({counts[key] || 0})</button>
        ))}
      </div>

      {error && <div role="alert" style={{ color: '#EF4444', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 11, padding: '11px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}
      {loading ? (
        <div style={{ color: 'var(--ad-text3)', fontSize: 14 }}>در حال بارگذاری…</div>
      ) : shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--ad-text3)', background: 'var(--ad-card)', border: '1px dashed var(--ad-card-b)', borderRadius: 16 }}>ثبت‌نامی برای نمایش وجود ندارد.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {shown.map(item => {
            const status = STATUSES[item.status] || STATUSES.pending
            return (
              <article key={item.id} className="nk-admin-card" style={{ borderRight: `3px solid ${status.color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--ad-card-b)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 5 }}>
                      <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>{item.childName || 'بدون نام'}</h2>
                      <span style={{ fontSize: 10.5, color: status.color, background: `${status.color}16`, border: `1px solid ${status.color}38`, borderRadius: 999, padding: '3px 9px', fontWeight: 800 }}>{status.label}</span>
                      <span style={{ fontSize: 10.5, color: 'var(--ad-text3)', background: 'var(--ad-rowh)', borderRadius: 999, padding: '3px 9px', fontWeight: 800 }}>
                        {item.childAge ? `${item.childAge} ساله` : 'سن نامشخص'} {item.childGender ? `— ${item.childGender}` : ''}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ad-text3)' }}>ثبت: {faDate(item.date)}</div>
                  </div>
                  <select className="nk-admin-select" value={item.status} disabled={savingId === item.id} onChange={event => updateStatus(item.id, event.target.value)} style={{ opacity: savingId === item.id ? .6 : 1 }}>
                    {Object.entries(STATUSES).map(([key, option]) => <option key={key} value={key}>{option.label}</option>)}
                  </select>
                </div>

                <div className="nk-admin-grid">
                  <Detail label="نام کودک" value={item.childName} />
                  <Detail label="سن" value={item.childAge} />
                  <Detail label="جنسیت" value={item.childGender} />
                  <Detail label="عضو باشگاه" value={item.isMember ? 'بله' : 'خیر'} />
                  <Detail label="نام والد / ولی" value={item.parentName} />
                  <Detail label="نسبت" value={item.relation} />
                  <Detail label="موبایل" value={item.parentPhone} ltr />
                  <Detail label="منبع آشنایی" value={item.heardFrom === 'سایر' && item.heardOther ? `سایر: ${item.heardOther}` : item.heardFrom} />
                  <Detail label="داروها / شرایط پزشکی" value={item.medicalNotes} full />
                  <Detail label="توضیحات" value={item.notes} full />
                </div>

                {item.parentPhone && (
                  <div style={{ marginTop: 16 }}>
                    <a href={`tel:${item.parentPhone}`} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: 9, background: 'rgba(39,94,170,.1)', border: '1px solid rgba(39,94,170,.25)', color: '#275EAA', fontSize: 12, fontWeight: 800 }}>
                      تماس با والدین
                    </a>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
