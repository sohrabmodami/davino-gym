import { useAdmin } from '../data/adminStore.jsx'
import { useNavigate } from 'react-router-dom'

const ALL_LEVELS = 'مبتدی تا پیشرفته'

const CSS = `
  .cls-preview-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--surface-b);
    border-radius: 18px;
    padding: 22px 20px;
    overflow: hidden;
    transition: all .2s;
    animation: dvUp .5s ease both;
  }
  .cls-preview-card:hover { transform: translateY(-4px); border-color: var(--accent); }
  .cls-preview-card::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 4px; height: 100%;
    background: var(--c, var(--accent));
    border-radius: 18px 0 0 18px;
  }
`

export default function ClassesPreview() {
  const { classes = [], trainers = [] } = useAdmin()
  const navigate = useNavigate()

  // نام زندهٔ مربی از رکورد مربی
  const nameOf = (cls) => trainers.find(t => t.id === cls.trainerId)?.name || cls.trainerName || '— بدون مربی —'

  const featured = classes.filter(c => c.active).slice(0, 4)
  if (featured.length === 0) return null

  return (
    <section id="classes" style={{
      padding: 'clamp(70px, 8vw, 100px) clamp(24px, 4vw, 40px)',
      background: 'var(--bg)',
      transition: 'background .3s',
    }}>
      <style>{CSS}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* هدر */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '.14em',
              background: 'rgba(39,94,170,.1)', border: '1px solid rgba(39,94,170,.22)',
              borderRadius: 999, padding: '6px 15px', marginBottom: 18,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              برنامه کلاس‌ها
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.6rem)', fontWeight: 900, color: 'var(--text)', lineHeight: 1.18, margin: 0 }}>
              کلاس مناسب خودت رو<br/>پیدا کن
            </h2>
          </div>
          <button
            onClick={() => navigate('/classes')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: 'var(--accent)',
              border: '1.5px solid var(--accent)', borderRadius: 12,
              padding: '11px 22px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)' }}
          >
            مشاهده همه کلاس‌ها
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        </div>

        {/* کارت‌ها */}
        <div className="classes-preview-grid">
          {featured.map((cls, i) => {
            const pct = Math.round((cls.enrolled / cls.capacity) * 100)
            return (
              <div key={cls.id} className="cls-preview-card" style={{ '--c': cls.color, animationDelay: `${i * 80}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                      {cls.days.slice(0, 3).map(d => (
                        <span key={d} style={{ fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: 'var(--surface-b)', color: 'var(--t60)' }}>{d}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)', lineHeight: 1.3 }}>{cls.title}</div>
                  </div>
                  <div style={{ textAlign: 'left', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-latin)', fontSize: 16, fontWeight: 700, color: cls.color }}>{cls.startTime}</div>
                    <div style={{ fontSize: 10, color: 'var(--t35)' }}>تا {cls.endTime}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--t60)', fontWeight: 600 }}>{nameOf(cls)}</span>
                  <span style={{ marginRight: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: 'rgba(161,161,170,.14)', color: 'var(--t60)', whiteSpace: 'nowrap' }}>{ALL_LEVELS}</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 12, background: 'var(--surface-b)', borderRadius: 8, padding: '4px 10px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--t45)" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t50)' }}>{cls.sessions || 8} جلسه/ماه</span>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--t35)', marginBottom: 4 }}>{cls.enrolled}/{cls.capacity} نفر</div>
                    <div style={{ width: 80, height: 4, background: 'var(--track)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? '#ef4444' : cls.color, borderRadius: 999 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)' }}>
                    {cls.price} <span style={{ fontSize: 10, color: 'var(--t45)', fontWeight: 400 }}>تومان</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA پایین */}
        <div style={{ textAlign: 'center', marginTop: 38 }}>
          <button
            onClick={() => navigate('/classes')}
            style={{
              background: 'var(--accent)', color: '#fff', border: 'none',
              borderRadius: 12, padding: '14px 34px', fontSize: 15, fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 28px rgba(39,94,170,.3)',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(39,94,170,.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(39,94,170,.3)' }}
          >
            مشاهده برنامه کامل کلاس‌ها ←
          </button>
        </div>
      </div>
    </section>
  )
}
