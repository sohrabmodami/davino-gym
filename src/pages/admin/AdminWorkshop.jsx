import { useCallback, useEffect, useState } from 'react'

const TOKEN_KEY = 'davino_admin_token'

const STATUSES = {
  pending: { label: 'پیگیری‌نشده', color: '#F59E0B' },
  contacted: { label: 'پیگیری‌شده', color: '#3B82F6' },
  completed: { label: 'ثبت‌نام تکمیل‌شده', color: '#22C55E' },
  cancelled: { label: 'لغوشده', color: '#EF4444' },
}

const CSS = `
  @keyframes wsUp { from { transform: translateY(10px); } to { transform: translateY(0); } }
  .ws-admin-card { background: var(--ad-card); border: 1px solid var(--ad-card-b); border-radius: 16px; padding: 20px; animation: wsUp .22s ease; }
  .ws-admin-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px 22px; }
  .ws-admin-filter { border: none; padding: 7px 14px; border-radius: 999px; background: transparent; color: var(--ad-text2); font: 700 12px 'Vazirmatn'; white-space: nowrap; }
  .ws-admin-filter.active { background: #275EAA; color: #fff; }
  .ws-admin-select { min-width: 175px; background: var(--ad-rowh); color: var(--text); border: 1.5px solid var(--ad-card-b); border-radius: 10px; padding: 9px 12px; outline: none; font: 700 12px 'Vazirmatn'; }
  .ws-admin-btn { padding: 8px 14px; border-radius: 9px; border: 1px solid var(--ad-card-b); background: var(--ad-card); color: var(--ad-text2); font: 700 12px 'Vazirmatn'; cursor: pointer; }
  .ws-admin-btn.primary { background: #275EAA; color: #fff; border-color: #275EAA; }
  @media (max-width: 760px) { .ws-admin-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 520px) { .ws-admin-grid { grid-template-columns: 1fr; } .ws-admin-card { padding: 16px; } }
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
    'تاریخ', 'وضعیت', 'تعداد', 'مبلغ',
    'نام ۱', 'موبایل ۱', 'سن ۱', 'شغل ۱', 'ایمیل ۱',
    'نام ۲', 'موبایل ۲', 'سن ۲', 'شغل ۲', 'ایمیل ۲',
    'نام فرزند', 'سن فرزند', 'جنسیت', 'عضو باشگاه',
    'دغدغه‌ها', 'مورد دیگر', 'انتظار از کارگاه', 'منبع آشنایی', 'سایر منبع',
  ]
  const rows = registrations.map(item => {
    const a1 = item.attendees?.[0] || {}
    const a2 = item.attendees?.[1] || {}
    const child = item.child || {}
    const concerns = [...(item.concerns || [])]
    if (item.concernOther) {
      const idx = concerns.indexOf('مورد دیگر')
      if (idx >= 0) concerns[idx] = `مورد دیگر: ${item.concernOther}`
      else concerns.push(item.concernOther)
    }
    return [
      item.date, STATUSES[item.status]?.label || item.status, item.attendeeCount, item.price,
      a1.fullName, a1.phone, a1.age, a1.job, a1.email,
      a2.fullName, a2.phone, a2.age, a2.job, a2.email,
      child.name, child.age, child.gender, child.isMember ? 'بله' : 'خیر',
      concerns.join(' | '), item.concernOther, item.expectation,
      item.heardFrom, item.heardOther,
    ].map(csvEscape).join(',')
  })
  const bom = '\uFEFF'
  const blob = new Blob([bom + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `workshop-registrations-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function AdminWorkshop() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const token = sessionStorage.getItem(TOKEN_KEY) || ''

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/workshop-registrations', { headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) throw new Error('failed')
      const data = await response.json()
      setRegistrations(Array.isArray(data.registrations) ? data.registrations : [])
    } catch {
      setError('بارگذاری ثبت‌نام‌های کارگاه ناموفق بود.')
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
      const response = await fetch('/api/workshop-registrations', {
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
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>ثبت‌نام کارگاه</h1>
          <p style={{ fontSize: 13, color: 'var(--ad-text2)' }}>{counts.pending || 0} درخواست هنوز پیگیری نشده است</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="ws-admin-btn" onClick={load}>تازه‌سازی</button>
          <button className="ws-admin-btn primary" disabled={!registrations.length} onClick={() => exportCsv(shown.length ? shown : registrations)}>خروجی CSV</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: 3, marginBottom: 22, width: 'fit-content', maxWidth: '100%', overflowX: 'auto', background: 'var(--ad-card)', border: '1px solid var(--ad-card-b)', borderRadius: 999 }}>
        <button className={`ws-admin-filter${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>همه ({registrations.length})</button>
        {Object.entries(STATUSES).map(([key, status]) => (
          <button key={key} className={`ws-admin-filter${filter === key ? ' active' : ''}`} onClick={() => setFilter(key)}>{status.label} ({counts[key] || 0})</button>
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
            const concerns = [...(item.concerns || [])]
            if (item.concernOther && concerns.includes('مورد دیگر')) {
              const idx = concerns.indexOf('مورد دیگر')
              concerns[idx] = `مورد دیگر: ${item.concernOther}`
            }
            return (
              <article key={item.id} className="ws-admin-card" style={{ borderRight: `3px solid ${status.color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--ad-card-b)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 5 }}>
                      <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>
                        {(item.attendees || []).map(a => a.fullName).filter(Boolean).join(' و ') || 'بدون نام'}
                      </h2>
                      <span style={{ fontSize: 10.5, color: status.color, background: `${status.color}16`, border: `1px solid ${status.color}38`, borderRadius: 999, padding: '3px 9px', fontWeight: 800 }}>{status.label}</span>
                      <span style={{ fontSize: 10.5, color: 'var(--ad-text3)', background: 'var(--ad-rowh)', borderRadius: 999, padding: '3px 9px', fontWeight: 800 }}>
                        {item.attendeeCount === 2 ? 'دو نفر' : 'یک نفر'} — {item.price} تومان
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ad-text3)' }}>ثبت: {faDate(item.date)}</div>
                  </div>
                  <select className="ws-admin-select" value={item.status} disabled={savingId === item.id} onChange={event => updateStatus(item.id, event.target.value)} style={{ opacity: savingId === item.id ? .6 : 1 }}>
                    {Object.entries(STATUSES).map(([key, option]) => <option key={key} value={key}>{option.label}</option>)}
                  </select>
                </div>

                {(item.attendees || []).map((person, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text3)', marginBottom: 10 }}>
                      {item.attendeeCount === 2 ? `شرکت‌کننده ${index + 1}` : 'شرکت‌کننده'}
                    </div>
                    <div className="ws-admin-grid">
                      <Detail label="نام و نام خانوادگی" value={person.fullName} />
                      <Detail label="موبایل" value={person.phone} ltr />
                      <Detail label="سن" value={person.age} />
                      <Detail label="شغل" value={person.job} />
                      <Detail label="ایمیل" value={person.email} ltr />
                    </div>
                  </div>
                ))}

                <div style={{ marginBottom: 16, paddingTop: 4, borderTop: '1px solid var(--ad-card-b)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text3)', margin: '12px 0 10px' }}>فرزند</div>
                  <div className="ws-admin-grid">
                    <Detail label="نام فرزند" value={item.child?.name} />
                    <Detail label="سن" value={item.child?.age} />
                    <Detail label="جنسیت" value={item.child?.gender} />
                    <Detail label="عضو باشگاه" value={item.child?.isMember ? 'بله' : 'خیر'} />
                  </div>
                </div>

                <div className="ws-admin-grid">
                  <Detail label="دغدغه‌ها" value={concerns.join('، ')} full />
                  <Detail label="انتظار از کارگاه" value={item.expectation} full />
                  <Detail label="منبع آشنایی" value={item.heardFrom === 'سایر' && item.heardOther ? `سایر: ${item.heardOther}` : item.heardFrom} full />
                </div>

                {item.attendees?.[0]?.phone && (
                  <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(item.attendees || []).map((person, index) => person.phone ? (
                      <a key={index} href={`tel:${person.phone}`} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: 9, background: 'rgba(39,94,170,.1)', border: '1px solid rgba(39,94,170,.25)', color: '#275EAA', fontSize: 12, fontWeight: 800 }}>
                        تماس {item.attendeeCount === 2 ? `(${index + 1})` : ''}
                      </a>
                    ) : null)}
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
