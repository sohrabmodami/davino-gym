import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../../components/Logo'

const navItems = [
  {
    path: '/admin', label: 'داشبورد', exact: true,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    path: '/admin/trainers', label: 'مربیان',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    path: '/admin/pricing', label: 'قیمت‌ها',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  },
  {
    path: '/admin/classes', label: 'کلاس‌ها',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    path: '/admin/gallery', label: 'گالری',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  },
  {
    path: '/admin/settings', label: 'تنظیمات',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg>,
  },
]

const CSS = `
  .admin-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 10px; margin-bottom: 2px;
    color: rgba(255,255,255,.45); text-decoration: none; font-size: 14px;
    font-weight: 500; transition: all .18s; cursor: pointer;
    font-family: 'Vazirmatn', sans-serif; background: none; border: none; width: 100%;
    white-space: nowrap; position: relative;
  }
  .admin-nav-item:hover { color: rgba(255,255,255,.8); background: rgba(255,255,255,.06); }
  .admin-nav-item.active { color: #EA443C; background: rgba(234,68,60,.12); font-weight: 700; }
  .admin-nav-item.active::before {
    content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 20px; background: #EA443C; border-radius: 3px 0 0 3px;
  }
  .admin-nav-item.collapsed { justify-content: center; padding: 10px; }
  .admin-nav-item.collapsed::before { display: none; }

  .sidebar-tooltip {
    position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
    background: #18181b; color: #fff; font-size: 12px; font-weight: 600;
    padding: 5px 10px; border-radius: 7px; white-space: nowrap;
    margin-right: 8px; pointer-events: none; opacity: 0;
    font-family: 'Vazirmatn', sans-serif; border: 1px solid rgba(255,255,255,.1);
    transition: opacity .15s;
  }
  .admin-nav-item.collapsed:hover .sidebar-tooltip { opacity: 1; }
`

export default function AdminLayout({ children, onLogout }) {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (item) => item.exact ? pathname === item.path : pathname.startsWith(item.path)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F3F0', fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl' }}>
      <style>{CSS}</style>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 232, flexShrink: 0,
        background: '#18181b',
        display: 'flex', flexDirection: 'column',
        transition: 'width .25s cubic-bezier(.4,0,.2,1)',
        position: 'sticky', top: 0, height: '100vh',
        zIndex: 10, overflow: 'hidden',
        borderLeft: '1px solid rgba(255,255,255,.05)',
      }}>
        {/* Brand */}
        <div style={{
          padding: collapsed ? '18px 0' : '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,.07)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 68,
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Logo size={0.85} dark />
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.4)', cursor: 'pointer', padding: 7, display: 'flex', borderRadius: 8, transition: 'all .15s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = 'rgba(255,255,255,.4)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav label */}
        {!collapsed && (
          <div style={{ padding: '16px 16px 6px', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.2)', letterSpacing: 1.5 }}>
            منو
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '4px 8px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = isActive(item)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item${active ? ' active' : ''}${collapsed ? ' collapsed' : ''}`}
              >
                <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                {!collapsed && item.label}
                {collapsed && <span className="sidebar-tooltip">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        {!collapsed && (
          <div style={{ padding: '6px 8px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
            <Link to="/" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, marginBottom: 2,
              color: 'rgba(255,255,255,.35)', textDecoration: 'none', fontSize: 13,
              transition: 'all .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,.6)'; e.currentTarget.style.background = 'rgba(255,255,255,.05)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.35)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              مشاهده سایت
            </Link>
            <button onClick={onLogout} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, width: '100%',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,.35)', fontSize: 13,
              fontFamily: 'Vazirmatn, sans-serif', transition: 'all .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.35)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              خروج
            </button>
          </div>
        )}

        {collapsed && (
          <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
            <button onClick={onLogout} title="خروج" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '9px', borderRadius: 10,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,.3)', transition: 'all .15s',
              fontFamily: 'Vazirmatn, sans-serif',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.3)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
