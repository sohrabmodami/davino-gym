import { Link } from 'react-router-dom'

export default function NatureKidsBanner() {
  return (
    <section aria-label="برنامه سنگ‌نوردی طبیعت کودکان" style={{
      padding: '0 clamp(24px, 4vw, 40px) clamp(28px, 4vw, 44px)',
      background: 'var(--bg)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        background: 'var(--surface)',
        border: '1px solid var(--surface-b)',
        borderRadius: 22,
        padding: 'clamp(22px, 3.5vw, 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 22,
        flexWrap: 'wrap',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ flex: '1 1 420px', minWidth: 260 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.28)',
            color: '#15803d', borderRadius: 999, padding: '5px 12px',
            fontSize: 12, fontWeight: 800, marginBottom: 12,
          }}>
            برنامه ویژه کودکان
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, lineHeight: 1.35, marginBottom: 10 }}>
            سنگ‌نوردی طبیعت در گسیل
          </h2>
          <p style={{ color: 'var(--t60)', lineHeight: 1.9, fontSize: 14.5, maxWidth: 640 }}>
            چهارشنبه ۴ شهریورماه — ساعت ۸ صبح — منطقه گسیل، جاده چالوس. سنگ‌نوردی روی دیواره‌های طبیعی با حمایت مربیان، صبحانه مختصر برای کودکان.
          </p>
        </div>
        <Link
          to="/nature-kids"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 50, padding: '0 26px', borderRadius: 12,
            background: 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: 15,
            boxShadow: '0 10px 24px rgba(39,94,170,.28)', whiteSpace: 'nowrap',
          }}
        >
          ثبت‌نام در برنامه
        </Link>
      </div>
    </section>
  )
}
