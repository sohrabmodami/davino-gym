import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../../components/Logo'

const navItems = [
  { path: '/admin', label: 'داشبورد', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )},
  { path: '/admin/trainers', label: 'مربیان', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )},
  { path: '/admin/pricing', label: 'قیمت‌ها', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  )},
  { path: '/admin/gallery', label: 'گالری', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )},
  { path: '/admin/settings', label: 'تنظیمات', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  )},
]

export default function AdminLayout({ children, onLogout }) {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F3F0', fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl' }}>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 240, flexShrink: 0,
        background: '#111', color: '#fff',
        display: 'flex', flexDirection: 'column',
        transition: 'width .25s ease',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 12px' : '24px 20px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && <Logo size={0.9} dark />}
          <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(item => {
            const active = pathname === item.path
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '12px' : '11px 12px',
                borderRadius: 10, marginBottom: 4,
                background: active ? 'rgba(234,68,60,.15)' : 'transparent',
                color: active ? '#EA443C' : 'rgba(255,255,255,.5)',
                textDecoration: 'none', fontSize: 14, fontWeight: active ? 700 : 500,
                transition: 'all .18s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,.06)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: collapsed ? '12px' : '11px 12px', borderRadius: 10,
            color: 'rgba(255,255,255,.35)', textDecoration: 'none', fontSize: 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            {!collapsed && 'مشاهده سایت'}
          </Link>
          <button onClick={onLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: collapsed ? '12px' : '11px 12px', borderRadius: 10, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,.35)', fontSize: 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
            fontFamily: 'Vazirmatn, sans-serif',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {!collapsed && 'خروج'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
