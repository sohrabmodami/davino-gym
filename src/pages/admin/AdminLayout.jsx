import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAdmin } from '../../data/adminStore.jsx'

const PAGE_TITLES = {
  '/admin': 'داشبورد',
  '/admin/trainers': 'مربیان',
  '/admin/pricing': 'قیمت‌ها',
  '/admin/classes': 'کلاس‌ها',
  '/admin/blog': 'بلاگ',
  '/admin/gallery': 'گالری',
  '/admin/messages': 'پیام‌ها',
  '/admin/registrations': 'درخواست‌های ثبت‌نام',
  '/admin/workshop': 'ثبت‌نام کارگاه',
  '/admin/settings': 'تنظیمات',
}

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
    path: '/admin/blog', label: 'بلاگ',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><line x1="9" y1="7" x2="16" y2="7"/><line x1="9" y1="11" x2="14" y2="11"/></svg>,
  },
  {
    path: '/admin/gallery', label: 'گالری',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  },
  {
    path: '/admin/registrations', label: 'درخواست‌های ثبت‌نام',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  },
  {
    path: '/admin/workshop', label: 'ثبت‌نام کارگاه',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><path d="M8 7h8M8 11h6"/></svg>,
  },
  {
    path: '/admin/messages', label: 'پیام‌ها',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
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
    color: var(--ad-side-item); text-decoration: none; font-size: 14px;
    font-weight: 500; transition: all .18s; cursor: pointer;
    font-family: 'Vazirmatn', sans-serif; background: none; border: none; width: 100%;
    white-space: nowrap; position: relative;
  }
  .admin-nav-item:hover { color: var(--text); background: var(--ad-side-hover); }
  .admin-nav-item.active { color: #275EAA; background: rgba(39,94,170,.12); font-weight: 700; }
  .admin-nav-item.active::before {
    content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 20px; background: #275EAA; border-radius: 3px 0 0 3px;
  }
  .admin-nav-item.collapsed { justify-content: center; padding: 10px; }
  .admin-nav-item.collapsed::before { display: none; }

  .sidebar-tooltip {
    position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
    background: var(--ad-card); color: var(--text); font-size: 12px; font-weight: 600;
    padding: 5px 10px; border-radius: 7px; white-space: nowrap;
    margin-right: 8px; pointer-events: none; opacity: 0;
    font-family: 'Vazirmatn', sans-serif; border: 1px solid var(--ad-card-b);
    transition: opacity .15s;
  }
  .admin-nav-item.collapsed:hover .sidebar-tooltip { opacity: 1; }
`

export default function AdminLayout({ children, onLogout }) {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const { saveError, clearSaveError } = useAdmin()

  const isActive = (item) => item.exact ? pathname === item.path : pathname.startsWith(item.path)
  const pageTitle = PAGE_TITLES[pathname] || (pathname.startsWith('/admin/') ? PAGE_TITLES[`/admin/${pathname.split('/')[2]}`] : '') || 'داشبورد'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ad-page)', color: 'var(--text)', fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl', transition: 'background .3s, color .3s' }}>
      <style>{CSS}</style>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 232, flexShrink: 0,
        background: 'var(--ad-side)',
        display: 'flex', flexDirection: 'column',
        transition: 'width .25s cubic-bezier(.4,0,.2,1), background .3s',
        position: 'sticky', top: 0, height: '100vh',
        zIndex: 10, overflow: 'hidden',
        borderLeft: '1px solid var(--ad-side-b)',
      }}>
        {/* Brand */}
        <div style={{
          padding: collapsed ? '18px 0' : '20px 16px',
          borderBottom: '1px solid var(--ad-side-b)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 68,
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontFamily: 'var(--font-latin)', fontSize: 19, fontWeight: 700, letterSpacing: '.04em', color: 'var(--text)' }}>DAVINO</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#275EAA', background: 'rgba(39,94,170,.12)', border: '1px solid rgba(39,94,170,.25)', borderRadius: 6, padding: '2px 7px' }}>ادمین</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{ background: 'var(--ad-side-hover)', border: '1px solid var(--ad-card-b)', color: 'var(--ad-text3)', cursor: 'pointer', padding: 7, display: 'flex', borderRadius: 8, transition: 'all .15s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--ad-text3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav label */}
        {!collapsed && (
          <div style={{ padding: '16px 16px 6px', fontSize: 10, fontWeight: 800, color: 'var(--ad-text3)', letterSpacing: 1.5 }}>
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
          <div style={{ padding: '6px 8px', borderTop: '1px solid var(--ad-side-b)' }}>
            <Link to="/" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, marginBottom: 2,
              color: 'var(--ad-text3)', textDecoration: 'none', fontSize: 13,
              transition: 'all .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--ad-side-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ad-text3)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              مشاهده سایت
            </Link>
            <button onClick={onLogout} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, width: '100%',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ad-text3)', fontSize: 13,
              fontFamily: 'Vazirmatn, sans-serif', transition: 'all .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ad-text3)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              خروج
            </button>
          </div>
        )}

        {collapsed && (
          <div style={{ padding: '8px', borderTop: '1px solid var(--ad-side-b)' }}>
            <button onClick={onLogout} title="خروج" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '9px', borderRadius: 10,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ad-text3)', transition: 'all .15s',
              fontFamily: 'Vazirmatn, sans-serif',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ad-text3)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 9,
          height: 64, display: 'flex', alignItems: 'center', gap: 14,
          padding: '0 clamp(20px, 3vw, 40px)',
          background: 'var(--ad-topbar)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--ad-side-b)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9, flex: 1, maxWidth: 360,
            background: 'var(--ad-chip)', border: '1px solid var(--ad-card-b)',
            borderRadius: 10, padding: '8px 14px',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ad-text3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="جستجو…" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, fontFamily: 'Vazirmatn, sans-serif' }} />
          </div>
          <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #275EAA, #1E4A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>ا</div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>ادمین</div>
                <div style={{ fontSize: 11, color: 'var(--ad-text3)' }}>{pageTitle}</div>
              </div>
            </div>
          </div>
        </div>

        {saveError && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            margin: '14px clamp(20px, 3vw, 40px) 0', padding: '12px 16px',
            background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)',
            borderRadius: 12, color: '#ef4444', fontSize: 13, fontWeight: 600,
          }}>
            <span>⚠ {saveError}</span>
            <button onClick={clearSaveError} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, padding: 4, flexShrink: 0 }}>✕</button>
          </div>
        )}

        {children}
      </main>
    </div>
  )
}
