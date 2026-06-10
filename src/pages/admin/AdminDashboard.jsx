import { useAdmin } from '../../data/adminStore.jsx'

const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{
    background: '#fff', borderRadius: 16, padding: '24px',
    border: '1.5px solid #e8e3dc', display: 'flex', alignItems: 'center', gap: 20,
  }}>
    <div style={{
      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
      background: `${color}12`, border: `1.5px solid ${color}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#111', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color, fontWeight: 600, marginTop: 3 }}>{sub}</div>}
    </div>
  </div>
)

export default function AdminDashboard() {
  const { trainers, gallery, pricing } = useAdmin()

  const stats = [
    {
      label: 'مربیان فعال', value: trainers.length, color: '#EA443C', sub: 'در ۶ تخصص',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      label: 'آیتم‌های گالری', value: gallery.length, color: '#3B82F6', sub: 'عکس و ویدیو',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    },
    {
      label: 'پلن‌های قیمت‌گذاری', value: pricing.length, color: '#22C55E', sub: `${pricing.filter(p => p.popular).length} پلن ویژه`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    },
    {
      label: 'جلسات کل مربیان', value: trainers.reduce((sum, t) => sum + parseInt(t.sessions?.replace(/\D/g, '') || 0), 0) + '+',
      color: '#A855F7', sub: 'مجموع سابقه',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    },
  ]

  return (
    <div style={{ padding: '40px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#111', marginBottom: 4 }}>داشبورد</h1>
        <p style={{ fontSize: 14, color: '#888' }}>خلاصه وضعیت باشگاه داوینو</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Trainers quick view */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8e3dc', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>مربیان</h2>
          <a href="/admin/trainers" style={{ fontSize: 13, color: '#EA443C', textDecoration: 'none', fontWeight: 600 }}>مشاهده همه ←</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafaf9' }}>
              {['نام', 'تخصص', 'تجربه', 'جلسات', 'وضعیت'].map(h => (
                <th key={h} style={{ padding: '10px 24px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#888', fontFamily: 'Vazirmatn, sans-serif' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trainers.map((t, i) => (
              <tr key={t.id} style={{ borderTop: '1px solid #f5f0ea' }}>
                <td style={{ padding: '14px 24px', fontSize: 14, fontWeight: 700, color: '#111' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${t.gradFrom}, ${t.gradTo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,.6)', flexShrink: 0 }}>{t.initial}</div>
                    {t.name}
                  </div>
                </td>
                <td style={{ padding: '14px 24px', fontSize: 13, color: '#555' }}>{t.role}</td>
                <td style={{ padding: '14px 24px', fontSize: 13, color: '#555' }}>{t.exp}</td>
                <td style={{ padding: '14px 24px', fontSize: 13, color: '#555' }}>{t.sessions}</td>
                <td style={{ padding: '14px 24px' }}>
                  <span style={{ background: '#dcfce7', color: '#166534', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>فعال</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing quick view */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8e3dc', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>پلن‌های قیمت‌گذاری</h2>
          <a href="/admin/pricing" style={{ fontSize: 13, color: '#EA443C', textDecoration: 'none', fontWeight: 600 }}>ویرایش ←</a>
        </div>
        <div style={{ display: 'flex', gap: 16, padding: 24, flexWrap: 'wrap' }}>
          {pricing.map(p => (
            <div key={p.id} style={{ flex: 1, minWidth: 160, background: '#fafaf9', borderRadius: 12, padding: '16px 20px', border: p.popular ? `2px solid ${p.color}` : '1px solid #e8e3dc' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: p.color }}>{p.price} <span style={{ fontSize: 11, fontWeight: 500, color: '#888' }}>تومان/{p.period}</span></div>
              {p.popular && <span style={{ fontSize: 10, background: p.color, color: '#fff', padding: '2px 8px', borderRadius: 999, fontWeight: 700, display: 'inline-block', marginTop: 6 }}>پرطرفدار</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
