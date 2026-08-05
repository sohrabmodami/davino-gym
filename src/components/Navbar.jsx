import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

const navLinks = [
  { label: 'خانه',        id: 'hero' },
  { label: 'خدمات',       id: 'services' },
  { label: 'ساخت دیواره', id: 'climbing-wall' },
  { label: 'مربیان',      id: 'trainers' },
  { label: 'کلاس‌ها',     href: '/classes' },
  { label: 'بلاگ',        href: '/blog' },
  { label: 'گالری',       id: 'gallery' },
  { label: 'قیمت‌ها',     id: 'pricing' },
  { label: 'تماس با ما',  id: 'contact' },
]

const CSS = `
  .nav-logo-btn {
    background: none; border: none; padding: 0; margin: 0;
    flex-shrink: 0; display: flex; align-items: center; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    outline: none;
    user-select: none;
  }
  .nav-logo-btn:focus, .nav-logo-btn:active { outline: none; background: none; }
  .nav-item {
    color: var(--t60);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    padding: 6px 0;
    position: relative;
    transition: color .2s;
    background: none;
    border: none;
    font-family: var(--font-body);
    cursor: pointer;
    white-space: nowrap;
  }
  .nav-item.active { color: var(--text); }
  .nav-item:hover { color: var(--text); }

  .nav-cta-btn {
    background: var(--accent);
    color: #fff;
    font-size: 13.5px;
    font-weight: 700;
    padding: 10px 22px;
    border-radius: 10px;
    text-decoration: none;
    white-space: nowrap;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    box-shadow: 0 6px 20px rgba(39,94,170,.3);
    transition: all .2s;
  }
  .nav-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(39,94,170,.45);
  }

  .nav-burger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 38px; height: 38px;
    background: var(--surface);
    border: 1px solid var(--surface-b);
    color: var(--text);
    border-radius: 10px;
    cursor: pointer;
    transition: all .2s;
  }
  .nav-burger:hover { border-color: var(--accent); }

  .nav-drawer {
    display: none;
    position: absolute;
    top: 100%; right: 0; left: 0;
    background: var(--bg);
    border-bottom: 1px solid var(--navbd);
    padding: 10px 28px 22px;
    flex-direction: column;
    gap: 4px;
    box-shadow: 0 18px 40px rgba(0,0,0,.18);
  }
  .nav-drawer-link {
    display: block;
    width: 100%;
    text-align: right;
    padding: 12px 4px;
    color: var(--t60);
    font-size: 15px;
    font-weight: 600;
    background: none;
    border: none;
    border-bottom: 1px solid var(--line);
    font-family: var(--font-body);
    cursor: pointer;
    transition: color .2s;
  }
  .nav-drawer-link:hover { color: var(--text); }
  .nav-drawer-link.active { color: var(--text); }
  .nav-drawer-cta {
    display: block;
    width: 100%;
    background: var(--accent);
    color: #fff;
    text-align: center;
    font-size: 13.5px;
    font-weight: 700;
    padding: 12px 22px;
    border-radius: 10px;
    border: none;
    margin-top: 14px;
    font-family: var(--font-body);
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(39,94,170,.3);
  }

  @media (max-width: 920px) {
    .nav-center { display: none !important; }
    .nav-cta-btn.nav-bar-cta { display: none !important; }
    .nav-burger { display: inline-flex; }
    .nav-drawer.open { display: flex; }
  }
`

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const goTo = (id) => {
    setMenuOpen(false)
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const renderLink = (l, cls) => l.href
    ? <button key={l.href} onClick={() => { setMenuOpen(false); navigate(l.href) }} className={cls}>{l.label}</button>
    : <button key={l.id} onClick={() => goTo(l.id)} className={`${cls}${l.id === 'hero' ? ' active' : ''}`}>{l.label}</button>

  return (
    <>
      <style>{CSS}</style>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: 'var(--nav)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--navbd)',
        direction: 'rtl',
        transition: 'background .3s',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          height: 66, padding: '0 28px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24,
        }}>

          {/* Logo */}
          <button onClick={() => goTo('hero')} aria-label="داوینو" className="nav-logo-btn">
            <Logo size={0.95} />
          </button>

          {/* Desktop links */}
          <nav className="nav-center" style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1, justifyContent: 'center' }}>
            {navLinks.map(l => renderLink(l, 'nav-item'))}
          </nav>

          {/* Actions: CTA + burger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <a href="https://athlete.ifsm.ir/login" target="_blank" rel="noopener noreferrer" className="nav-cta-btn nav-bar-cta">دریافت بیمه ورزشی</a>
            <button
              className="nav-burger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="باز و بسته کردن منو"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen
                  ? <path d="M18 6L6 18M6 6l12 12"/>
                  : <path d="M3 6h18M3 12h18M3 18h18"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile drawer — پنل تمام‌عرض زیر نوار، مطابق دیزاین */}
        <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
          {navLinks.map(l => renderLink(l, 'nav-drawer-link'))}
          <a href="https://athlete.ifsm.ir/login" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="nav-drawer-cta">دریافت بیمه ورزشی</a>
        </div>
      </header>
    </>
  )
}
