import { useState } from 'react'
import { useAdmin } from '../data/adminStore.jsx'

export default function Contact() {
  const { settings } = useAdmin()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
      setForm({ name: '', phone: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      setError('ارسال پیام ناموفق بود. لطفاً دوباره تلاش کن یا تماس بگیر.')
    } finally {
      setSending(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: 'var(--surface)',
    border: '1px solid var(--surface-b)',
    borderRadius: '12px',
    color: 'var(--text)',
    fontSize: '15px', fontFamily: 'var(--font-body)',
    outline: 'none', transition: 'border-color 0.2s',
    direction: 'rtl',
  }

  return (
    <section id="contact" style={{
      padding: 'clamp(70px, 8vw, 100px) clamp(24px, 4vw, 40px)',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--line)',
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 800, color: 'var(--accent)',
            letterSpacing: '.14em', background: 'rgba(234,68,60,.1)',
            border: '1px solid rgba(234,68,60,.22)', borderRadius: 999,
            padding: '6px 15px', marginBottom: 16,
          }}>تماس با ما</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            آماده‌ای شروع کنی؟
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--color-foreground-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            همین الان با ما تماس بگیر — مشاوره اول رایگانه
          </p>
        </div>

        <div className="contact-grid">
          {/* Info */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {[
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: 'آدرس',
                  value: settings.address || 'تهران، خیابان ولیعصر، پلاک ۲۴',
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 2.19 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z"/></svg>,
                  label: 'تلفن',
                  value: settings.phone || '۰۲۱-۸۸۸۸-۰۰۰۰',
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  label: 'ساعت کاری',
                  value: settings.hours || 'شنبه تا پنجشنبه ۸ صبح تا ۱۰ شب',
                },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                    background: 'rgba(234,68,60,0.1)', border: '1px solid rgba(234,68,60,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary)',
                  }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-foreground-dim)', marginBottom: '4px' }}>{info.label}</div>
                    <div style={{ fontSize: '15px', color: 'var(--color-foreground)', fontWeight: 500 }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* نقشه‌ی موقعیت باشگاه */}
            <div style={{ position: 'relative', height: '220px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <iframe
                title="موقعیت باشگاه داوینو روی نقشه"
                src="https://maps.google.com/maps?q=35.7045443,51.3084522&z=16&hl=fa&output=embed"
                width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, display: 'block', filter: 'grayscale(0.15)' }}
              />
              <a
                href="https://maps.app.goo.gl/EYNBr3ev51czKjCg6"
                target="_blank" rel="noopener noreferrer"
                style={{
                  position: 'absolute', bottom: 12, left: 12,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'var(--accent)', color: '#fff', textDecoration: 'none',
                  fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,.3)',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                مسیریابی در گوگل‌مپ
              </a>
            </div>
          </div>

          {/* Form */}
          <div style={{
            background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
            borderRadius: '24px', padding: '36px',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>پیام ارسال شد!</h3>
                <p style={{ color: 'var(--color-foreground-muted)', fontSize: '14px' }}>به زودی با شما تماس می‌گیریم.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-foreground-muted)' }}>
                    نام و نام خانوادگی
                  </label>
                  <input
                    required type="text" placeholder="مثلاً: علی احمدی"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(234,68,60,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'var(--surface-b)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-foreground-muted)' }}>
                    شماره تماس
                  </label>
                  <input
                    required type="tel" placeholder="۰۹۱۲-۳۴۵-۶۷۸۹"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(234,68,60,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'var(--surface-b)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-foreground-muted)' }}>
                    پیام شما
                  </label>
                  <textarea
                    rows={4} placeholder="چطور می‌تونیم کمکت کنیم؟"
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(234,68,60,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'var(--surface-b)'}
                  />
                </div>
                {error && (
                  <div style={{ fontSize: 13, color: '#ef4444', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                    {error}
                  </div>
                )}
                <button type="submit" disabled={sending} style={{
                  background: 'var(--accent)',
                  color: '#fff', fontWeight: 800, fontSize: '16px',
                  padding: '15px', borderRadius: '12px',
                  boxShadow: '0 8px 26px rgba(234,68,60,0.35)',
                  transition: 'all 0.2s ease',
                  opacity: sending ? 0.7 : 1, cursor: sending ? 'default' : 'pointer',
                }}
                  onMouseEnter={e => { if (sending) return; e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = '0 12px 34px rgba(234,68,60,0.5)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 8px 26px rgba(234,68,60,0.35)'; }}
                >
                  {sending ? 'در حال ارسال…' : 'ارسال پیام'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
