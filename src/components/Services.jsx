const services = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12m0 0L8 8m4 4l4-4M3 15c0 3.314 4.03 6 9 6s9-2.686 9-6"/><path d="M3 9c0 3.314 4.03 6 9 6s9-2.686 9-6M3 9c0-3.314 4.03-6 9-6s9 2.686 9 6"/></svg>,
    title: 'سنگنوردی مبتدی',
    desc: 'برای اولین‌بارها — آموزش اصول پایه، تکنیک‌های صحیح و ایمنی از صفر',
    color: '#22C55E',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'کلاس‌های پیشرفته',
    desc: 'تکنیک‌های بولدرینگ و لید برای سنگنوردان متوسط و حرفه‌ای',
    color: '#EA443C',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'تمرین گروهی',
    desc: 'جلسات گروهی با انگیزه بیشتر، رقابت دوستانه و پیشرفت سریع‌تر',
    color: '#8B5CF6',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    title: 'آمادگی جسمانی',
    desc: 'تقویت قدرت انگشتان، تعادل، انعطاف و استقامت ویژه سنگنوردی',
    color: '#EC4899',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    title: 'تیم مسابقاتی',
    desc: 'آماده‌سازی برای مسابقات استانی، کشوری و بین‌المللی سنگنوردی',
    color: '#EA443C',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    title: 'برنامه کودکان',
    desc: 'کلاس‌های ویژه کودکان ۶ تا ۱۴ سال با مربیان متخصص آموزش کودک',
    color: '#F59E0B',
  },
]

export default function Services() {
  return (
    <section id="services" style={{ padding: '100px 2.5rem', background: 'var(--color-bg-section)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(234,68,60,0.08)', border: '1px solid rgba(234,68,60,0.2)',
            borderRadius: '50px', padding: '5px 16px', marginBottom: '16px',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>خدمات ما</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, marginBottom: '14px', letterSpacing: '-0.5px' }}>
            برای هر سطح، یک مسیر
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-foreground-muted)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.75 }}>
            از اولین قدم تا قهرمانی — داوینو همه‌چیز داره
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
          {services.map((s, i) => (
            <div key={i}
              style={{
                background: 'var(--color-bg-white)',
                border: '1.5px solid var(--color-border)',
                borderRadius: '20px', padding: '28px',
                transition: 'all 0.28s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = `${s.color}50`
                e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.08)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '14px',
                background: `${s.color}12`,
                border: `1.5px solid ${s.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color, marginBottom: '18px',
              }}>{s.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-foreground-muted)', lineHeight: 1.7 }}>{s.desc}</p>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: s.color }}>
                <span>اطلاعات بیشتر</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
