import { useAdmin } from '../data/adminStore.jsx'
import { useNavigate } from 'react-router-dom'

const LEVEL_COLORS = {
  'مبتدی':     { bg: 'rgba(34,197,94,.1)',   color: '#16a34a' },
  'متوسط':     { bg: 'rgba(234,68,60,.1)',   color: '#EA443C' },
  'پیشرفته':   { bg: 'rgba(59,130,246,.1)',  color: '#2563eb' },
  'همه سطوح': { bg: 'rgba(161,161,170,.12)', color: '#71717a' },
}

const CSS = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .cls-preview-card {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #ede8e0;
    padding: 22px 20px;
    position: relative;
    overflow: hidden;
    transition: transform .2s, box-shadow .2s;
    animation: fadeUp .5s ease both;
  }
  .cls-preview-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.1); }
  .cls-preview-card::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 4px; height: 100%;
    background: var(--c, #EA443C);
    border-radius: 0 18px 18px 0;
  }
`

export default function ClassesPreview() {
  const { classes = [] } = useAdmin()
  const navigate = useNavigate()

  const featured = classes.filter(c => c.active).slice(0, 4)
  if (featured.length === 0) return null

  return (
    <section id="classes" style={{
      padding: '96px 2.5rem',
      background: 'linear-gradient(180deg, #faf8f5 0%, #fff 100%)',
    }}>
      <style>{CSS}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(234,68,60,.08)', border: '1px solid rgba(234,68,60,.2)', borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EA443C" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span style={{ fontSize: 12, color: '#EA443C', fontWeight: 700 }}>برنامه کلاس‌ها</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#111', lineHeight: 1.2, margin: 0 }}>
              کلاس مناسب خودت رو<br/>پیدا کن
            </h2>
          </div>
          <button
            onClick={() => navigate('/classes')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', color: '#EA443C',
              border: '1.5px solid #EA443C', borderRadius: 12,
              padding: '11px 22px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Vazirmatn',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EA443C'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#EA443C' }}
          >
            مشاهده همه کلاس‌ها
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {featured.map((cls, i) => {
            const lc = LEVEL_COLORS[cls.level] || LEVEL_COLORS['همه سطوح']
            const pct = Math.round((cls.enrolled / cls.capacity) * 100)
            return (
              <div key={cls.id} className="cls-preview-card" style={{ '--c': cls.color, animationDelay: `${i * 80}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                      {cls.days.slice(0, 3).map(d => (
                        <span key={d} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(0,0,0,.05)', color: '#666' }}>{d}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#111', lineHeight: 1.3 }}>{cls.title}</div>
                  </div>
                  <div style={{ textAlign: 'left', flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: cls.color }}>{cls.startTime}</div>
                    <div style={{ fontSize: 10, color: '#bbb', fontWeight: 600 }}>تا {cls.endTime}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${cls.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={cls.color} strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <span style={{ fontSize: 12, color: '#777', fontWeight: 600 }}>{cls.trainerName}</span>
                  <span style={{ marginRight: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: lc.bg, color: lc.color }}>{cls.level}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12, background: '#f9f7f5', borderRadius: 8, padding: '4px 10px', alignSelf: 'flex-start' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#999' }}>{cls.sessions || 8} جلسه/ماه</span>
                </div>

                <div style={{ borderTop: '1px solid #f5f0ea', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#bbb', fontWeight: 600, marginBottom: 3 }}>{cls.enrolled}/{cls.capacity} نفر</div>
                    <div style={{ width: 80, height: 4, background: '#f0ebe3', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? '#ef4444' : cls.color, borderRadius: 999 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#111' }}>
                    {cls.price} <span style={{ fontSize: 10, color: '#aaa', fontWeight: 400 }}>تومان</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={() => navigate('/classes')}
            style={{
              background: '#EA443C', color: '#fff', border: 'none',
              borderRadius: 12, padding: '13px 32px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Vazirmatn',
              boxShadow: '0 8px 24px rgba(234,68,60,.3)',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(234,68,60,.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(234,68,60,.3)' }}
          >
            مشاهده برنامه کامل کلاس‌ها ←
          </button>
        </div>
      </div>
    </section>
  )
}
