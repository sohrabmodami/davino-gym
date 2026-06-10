import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setForm({ name: '', phone: '', message: '' })
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    color: 'var(--color-foreground)',
    fontSize: '15px', fontFamily: 'var(--font-body)',
    outline: 'none', transition: 'border-color 0.2s',
    direction: 'rtl',
  }

  return (
    <section id="contact" style={{
      padding: '100px 2rem',
      background: 'linear-gradient(180deg, transparent 0%, rgba(234,68,60,0.03) 50%, transparent 100%)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(234,68,60,0.1)', border: '1px solid rgba(234,68,60,0.2)',
            borderRadius: '50px', padding: '6px 16px', marginBottom: '16px',
          }}>
            <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>تماس با ما</span>
          </div>
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
                  value: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 2.19 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z"/></svg>,
                  label: 'تلفن',
                  value: '۰۲۱-۱۲۳۴۵۶۷۸',
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  label: 'ساعت کاری',
                  value: 'شنبه تا پنجشنبه: ۶ صبح تا ۱۱ شب',
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

            {/* Map placeholder */}
            <div style={{
              height: '200px', borderRadius: '16px',
              background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '12px',
              color: 'var(--color-foreground-muted)',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(234,68,60,0.5)" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ fontSize: '14px' }}>نقشه موقعیت باشگاه</span>
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
                    onFocus={e => e.target.style.borderColor = 'rgba(234,68,60,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
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
                    onFocus={e => e.target.style.borderColor = 'rgba(234,68,60,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
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
                    onFocus={e => e.target.style.borderColor = 'rgba(234,68,60,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                  />
                </div>
                <button type="submit" style={{
                  background: 'linear-gradient(135deg, #EA443C, #FB923C)',
                  color: '#0B0F19', fontWeight: 700, fontSize: '16px',
                  padding: '14px', borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(234,68,60,0.35)',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = '0 12px 40px rgba(234,68,60,0.5)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 8px 30px rgba(234,68,60,0.35)'; }}
                >
                  ارسال پیام
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
