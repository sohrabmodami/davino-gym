import { useAdmin } from '../../data/adminStore.jsx'
import { Link } from 'react-router-dom'

const CSS = `
  @keyframes adUp { from{transform:translateY(12px)} to{transform:translateY(0)} }
  .stat-card { background: var(--ad-card); border-radius: 16px; padding: 24px; border: 1px solid var(--ad-card-b); transition: box-shadow .2s, transform .2s, background .3s; animation: adUp .4s ease both; }
  .stat-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.12); transform: translateY(-2px); }
  .admin-table-row { border-top: 1px solid var(--ad-side-b); transition: background .15s; }
  .admin-table-row:hover { background: var(--ad-rowh); }
  .admin-link { color: #275EAA; text-decoration: none; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 4px; transition: gap .15s; }
  .admin-link:hover { gap: 8px; }
`

function StatCard({ label, value, icon, color, sub, delay = 0 }) {
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}14`, border: `1px solid ${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0,
        }}>{icon}</div>
        {sub && (
          <span style={{ fontSize: 11, color, fontWeight: 700, background: `${color}12`, padding: '3px 8px', borderRadius: 999 }}>
            {sub}
          </span>
        )}
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--ad-text2)', fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const { trainers, gallery, pricing } = useAdmin()

  const stats = [
    {
      label: 'مربیان فعال', value: trainers.length, color: '#275EAA', sub: 'فعال',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      label: 'آیتم‌های گالری', value: gallery.length, color: '#3B82F6', sub: 'آیتم',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    },
    {
      label: 'پلن‌های عضویت', value: pricing.length, color: '#22C55E', sub: `${pricing.filter(p => p.popular).length} ویژه`,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    },
    {
      label: 'مجموع جلسات', value: trainers.reduce((sum, t) => sum + parseInt(t.sessions?.replace(/\D/g, '') || 0), 0) + '+',
      color: '#A855F7', sub: 'سابقه',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    },
  ]

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200 }}>
      <style>{CSS}</style>

      {/* Page header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>داشبورد</h1>
          <p style={{ fontSize: 13, color: 'var(--ad-text3)' }}>خلاصه وضعیت باشگاه داوینو</p>
        </div>
        <div style={{ background: 'var(--ad-chip)', border: '1px solid var(--ad-card-b)', borderRadius: 10, padding: '7px 14px', textAlign: 'left' }}>
          <div style={{ fontSize: 10, color: 'var(--ad-text3)', fontWeight: 600, marginBottom: 2 }}>نسخه سایت</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ad-text2)', fontFamily: 'monospace' }}>v1.2.0</div>
          <div style={{ fontSize: 10, color: 'var(--ad-text3)', marginTop: 1 }}>2026-06-11</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 60} />)}
      </div>

      {/* Trainers table */}
      <div style={{ background: 'var(--ad-card)', borderRadius: 16, border: '1px solid var(--ad-card-b)', overflow: 'hidden', marginBottom: 20, transition: 'background .3s' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--ad-side-b)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 1 }}>مربیان</h2>
            <p style={{ fontSize: 12, color: 'var(--ad-text3)' }}>{trainers.length} مربی فعال</p>
          </div>
          <Link to="/admin/trainers" className="admin-link">
            مشاهده همه
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ad-rowh)' }}>
                {['نام', 'تخصص', 'تجربه', 'جلسات', 'وضعیت'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'right', fontSize: 11, fontWeight: 800, color: 'var(--ad-th)', fontFamily: 'Vazirmatn, sans-serif', letterSpacing: .5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trainers.map(t => (
                <tr key={t.id} className="admin-table-row">
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${t.gradFrom}, ${t.gradTo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,.7)', flexShrink: 0 }}>{t.initial}</div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{t.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 20px', fontSize: 13, color: 'var(--ad-text2)' }}>{t.role}</td>
                  <td style={{ padding: '13px 20px', fontSize: 13, color: 'var(--ad-text2)' }}>{t.exp}</td>
                  <td style={{ padding: '13px 20px', fontSize: 13, color: 'var(--ad-text2)' }}>{t.sessions}</td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>فعال</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing preview */}
      <div style={{ background: 'var(--ad-card)', borderRadius: 16, border: '1px solid var(--ad-card-b)', overflow: 'hidden', transition: 'background .3s' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--ad-side-b)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 1 }}>پلن‌های عضویت</h2>
            <p style={{ fontSize: 12, color: 'var(--ad-text3)' }}>{pricing.length} پلن</p>
          </div>
          <Link to="/admin/pricing" className="admin-link">
            ویرایش
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 14, padding: 20, flexWrap: 'wrap' }}>
          {pricing.map(p => (
            <div key={p.id} style={{
              flex: 1, minWidth: 150, background: 'var(--ad-rowh)', borderRadius: 14,
              padding: '16px 20px', border: p.popular ? `2px solid ${p.color}30` : '1px solid var(--ad-card-b)',
              position: 'relative',
            }}>
              {p.popular && (
                <span style={{ position: 'absolute', top: -1, right: 16, background: p.color, color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: '0 0 8px 8px' }}>ویژه</span>
              )}
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: p.color, lineHeight: 1 }}>
                {p.price}
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ad-text3)', marginRight: 4 }}>تومان/{p.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
