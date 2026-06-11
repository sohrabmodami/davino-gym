import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

const navLinks = [
  { label: 'خانه',      id: 'hero' },
  { label: 'درباره ما', id: 'about' },
  { label: 'خدمات',     id: 'services' },
  { label: 'مربیان',    id: 'trainers' },
  { label: 'کلاس‌ها',   href: '/classes' },
  { label: 'گالری',     id: 'gallery' },
  { label: 'قیمت‌ها',   id: 'pricing' },
  { label: 'تماس',      id: 'contact' },
]

const CSS = `
  .nav-item {
    color: #444;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    padding: 6px 0;
    position: relative;
    transition: color .2s;
    background: none;
    border: none;
    font-family: 'Vazirmatn', sans-serif;
    cursor: pointer;
    white-space: nowrap;
  }
  .nav-item::after {
    content: '';
    position: absolute;
    bottom: 0; right: 0;
    width: 0; height: 2px;
    background: #EA443C;
    border-radius: 2px;
    transition: width .25s ease;
  }
  .nav-item:hover { color: #EA443C; }
  .nav-item:hover::after { width: 100%; }

  .nav-cta-btn {
    position: relative;
    border: none;
    cursor: pointer;
    border-radius: 12px;
    padding: 2px;
    background: transparent;
    flex-shrink: 0;
    transition: transform .2s ease;
  }
  .nav-cta-btn::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 13px;
    padding: 2px;
    background: conic-gradient(
      from var(--cta-angle, 0deg),
      #EA443C 0%,
      #ff6b6b 25%,
      #c0392b 50%,
      #ff6b6b 75%,
      #EA443C 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    animation: cta-border-spin 2s linear infinite;
  }
  @property --cta-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes cta-border-spin {
    to { --cta-angle: 360deg; }
  }
  .nav-cta-inner {
    position: relative;
    display: block;
    background: #EA443C;
    border-radius: 10px;
    padding: 9px 22px;
    color: #fff;
    font-family: 'Vazirmatn', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    white-space: nowrap;
    letter-spacing: 0.2px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.2);
    transition: filter .2s;
  }
  .nav-cta-btn:hover { transform: translateY(-2px); }
  .nav-cta-btn:hover .nav-cta-inner { filter: brightness(1.1); }

  .hamburger-line {
    display: block;
    width: 20px; height: 2px;
    background: #333;
    border-radius: 2px;
    transition: all .25s ease;
  }

  /* Mobile nav-toggle: hidden on desktop */
  .nav-toggle {
    display: none !important;
  }
  @media (max-width: 860px) {
    .nav-toggle { display: flex !important; }
    .nav-desktop  { display: none !important; }
  }

  /* Mobile drawer */
  .mobile-overlay {
    position: fixed; inset: 0; z-index: 1100;
    background: rgba(0,0,0,.35);
    backdrop-filter: blur(3px);
    animation: fadeIn .2s;
  }
  .mobile-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 270px; z-index: 1101;
    background: #fff;
    box-shadow: -6px 0 32px rgba(0,0,0,.12);
    display: flex; flex-direction: column;
    animation: slideRight .25s ease;
    direction: rtl;
  }
  .drawer-link {
    display: block;
    padding: 15px 24px;
    font-size: 15px; font-weight: 600;
    color: #333; text-decoration: none;
    border-bottom: 1px solid #f5f0ea;
    transition: background .15s, color .15s;
    cursor: pointer;
    background: none; border: none;
    border-bottom: 1px solid #f5f0ea;
    font-family: 'Vazirmatn', sans-serif;
    width: 100%; text-align: right;
  }
  .drawer-link:hover { background: #fff8f7; color: #EA443C; }

  @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideRight{ from { transform: translateX(100%) } to { transform: translateX(0) } }
`

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

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

  return (
    <>
      <style>{CSS}</style>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000,
        height: 68,
        background: '#fff',
        borderBottom: scrolled ? '1px solid #ede8e0' : '1px solid #f0ebe3',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,.06)' : 'none',
        transition: 'box-shadow .3s, border-color .3s',
        direction: 'rtl',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          height: '100%', padding: '0 2rem',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24,
        }}>

          {/* Logo — always dark (navbar is always white) */}
          <button onClick={() => goTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <Logo size={0.95} dark={false} />
          </button>

          {/* Desktop links */}
          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1, justifyContent: 'center' }}>
            {navLinks.map(l => l.href
              ? <button key={l.href} onClick={() => { setMenuOpen(false); navigate(l.href) }} className="nav-item">{l.label}</button>
              : <button key={l.id} onClick={() => goTo(l.id)} className="nav-item">{l.label}</button>
            )}
          </nav>

          {/* CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <button onClick={() => goTo('contact')} className="nav-cta-btn nav-desktop"><span className="nav-cta-inner">دریافت بیمه ورزشی</span></button>

            {/* Hamburger */}
            <button
              className="nav-toggle"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 6 }}
              aria-label="منو"
            >
              <span className="hamburger-line" style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span className="hamburger-line" style={{ opacity: menuOpen ? 0 : 1 }} />
              <span className="hamburger-line" style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-drawer">
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #f0ebe3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Logo size={0.85} dark={false} />
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {navLinks.map(l => l.href
                ? <button key={l.href} onClick={() => { setMenuOpen(false); navigate(l.href) }} className="drawer-link">{l.label}</button>
                : <button key={l.id} onClick={() => goTo(l.id)} className="drawer-link">{l.label}</button>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #f0ebe3' }}>
              <button onClick={() => goTo('contact')} className="nav-cta-btn" style={{ width: '100%', padding: '13px' }}>
                <span className="nav-cta-inner">دریافت بیمه ورزشی</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
