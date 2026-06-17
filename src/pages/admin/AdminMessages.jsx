import { useState, useEffect, useCallback } from 'react'

const TOKEN_KEY = 'davino_admin_token'

const CSS = `
  @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .msg-card { background: var(--ad-card); border: 1px solid var(--ad-card-b); border-radius: 14px; padding: 18px 20px; transition: border-color .18s; }
  .msg-card:hover { border-color: rgba(234,68,60,.35); }
  .msg-btn { font-family: 'Vazirmatn', sans-serif; font-size: 12.5px; font-weight: 700; border-radius: 9px; padding: 7px 13px; cursor: pointer; border: 1.5px solid var(--ad-card-b); background: var(--ad-card); color: var(--ad-text2); transition: all .15s; }
  .msg-btn:hover { border-color: #bbb; }
  .filter-tab { font-family: 'Vazirmatn', sans-serif; font-size: 13px; font-weight: 700; border: none; cursor: pointer; padding: 7px 16px; border-radius: 999px; background: transparent; color: var(--ad-text2); transition: all .2s; }
  .filter-tab.active { background: #EA443C; color: #fff; }
`

const faDate = (iso) => {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
  } catch { return iso }
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all | new | done

  const token = sessionStorage.getItem(TOKEN_KEY) || ''

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/messages', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      setMessages(Array.isArray(data.messages) ? data.messages : [])
    } catch {
      setError('بارگذاری پیام‌ها ناموفق بود. مطمئن شو سرور در حال اجراست.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  const persist = async (next) => {
    setMessages(next) // به‌روزرسانی خوش‌بینانه
    try {
      await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: next }),
      })
    } catch { load() } // در صورت خطا، از سرور تازه‌سازی کن
  }

  const toggleStatus = (id) =>
    persist(messages.map(m => m.id === id ? { ...m, status: m.status === 'done' ? 'new' : 'done' } : m))

  const remove = (id) => {
    if (!confirm('این پیام حذف شود؟')) return
    persist(messages.filter(m => m.id !== id))
  }

  const shown = messages.filter(m => filter === 'all' ? true : m.status === filter)
  const newCount = messages.filter(m => m.status === 'new').length

  return (
    <div style={{ padding: '36px 40px', maxWidth: 860 }}>
      <style>{CSS}</style>

      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>پیام‌های تماس</h1>
          <p style={{ fontSize: 13, color: 'var(--ad-text2)' }}>
            درخواست‌های ثبت‌شده از فرم تماس سایت{newCount > 0 ? ` — ${newCount} پیام جدید` : ''}
          </p>
        </div>
        <button className="msg-btn" onClick={load}>تازه‌سازی</button>
      </div>

      {/* فیلتر وضعیت */}
      <div style={{ display: 'inline-flex', background: 'var(--ad-card)', border: '1px solid var(--ad-card-b)', borderRadius: 999, padding: 3, marginBottom: 22 }}>
        {[['all', 'همه'], ['new', 'جدید'], ['done', 'پیگیری‌شده']].map(([k, label]) => (
          <button key={k} className={`filter-tab${filter === k ? ' active' : ''}`} onClick={() => setFilter(k)}>{label}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ fontSize: 14, color: 'var(--ad-text3)' }}>در حال بارگذاری…</p>
      ) : error ? (
        <div style={{ fontSize: 14, color: '#ef4444', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 12, padding: '14px 18px' }}>{error}</div>
      ) : shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ad-text3)' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ marginBottom: 12, opacity: .6 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <p style={{ fontSize: 14 }}>پیامی برای نمایش نیست</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {shown.map(m => (
            <div key={m.id} className="msg-card" style={{ animation: 'slideUp .2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{m.name}</span>
                {m.status === 'new'
                  ? <span style={{ fontSize: 10, fontWeight: 800, color: '#EA443C', background: 'rgba(234,68,60,.12)', border: '1px solid rgba(234,68,60,.25)', borderRadius: 999, padding: '2px 9px' }}>جدید</span>
                  : <span style={{ fontSize: 10, fontWeight: 800, color: '#22C55E', background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 999, padding: '2px 9px' }}>پیگیری‌شده</span>
                }
                <span style={{ marginRight: 'auto', fontSize: 11.5, color: 'var(--ad-text3)' }}>{faDate(m.date)}</span>
              </div>

              <a href={`tel:${m.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#EA443C', textDecoration: 'none', marginBottom: m.message ? 10 : 14, direction: 'ltr' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2z"/></svg>
                {m.phone}
              </a>

              {m.message && (
                <p style={{ fontSize: 14, color: 'var(--ad-text2)', lineHeight: 1.85, margin: '0 0 14px', whiteSpace: 'pre-wrap' }}>{m.message}</p>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="msg-btn" onClick={() => toggleStatus(m.id)}>
                  {m.status === 'done' ? 'علامت به‌عنوان جدید' : 'علامت پیگیری‌شده'}
                </button>
                <button className="msg-btn" onClick={() => remove(m.id)} style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,.3)' }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
