import { useState, useEffect } from 'react'
import Logo from './Logo'

const navLinks = [
  { label: 'خانه', href: '#hero' },
  { label: 'درباره ما', href: '#about' },
  { label: 'خدمات', href: '#services' },
  { label: 'مربیان', href: '#trainers' },
  { label: 'گالری', href: '#gallery' },
  { label: 'قیمت‌ها', href: '#pricing' },
  { label: 'تماس', href: '#contact' },
]

const CSS = `
  .nav-link {
    color: var(--color-foreground-muted);
    font-size: 14px; font-weight: 600;
    transition: color 0.2s;
    text-decoration: none;
  }
  .nav-link:hover { color: var(--color-primary); }
  .nav-cta {
    background: var(--color-primary);
    color: #fff; font-weight: 700; font-size: 14px;
    padding: 10px 24px; border-radius: 50px;
    box-shadow: 0 4px 16px rgba(234,68,60,0.35);
    transition: all 0.2s ease; display: inline-block;
    text-decoration: none; font-family: 'Vazirmatn', sans-serif;
  }
  .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(234,68,60,0.45); }
  .nav-mobile {
    position: absolute; top: 72px; right: 0; left: 0;
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--color-border);
    flex-direction: column;
    padding: 16px 1.5rem 24px;
    gap: 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    z-index: 999;
  }
  .nav-mobile .nav-link {
    padding: 14px 0;
    border-bottom: 1px solid var(--color-border-light);
    font-size: 15px;
    display: block;
  }
  .nav-mobile .nav-cta {
    margin-top: 16px;
    display: block;
    text-align: center;
  }
  .hamburger-line {
    display: block; width: 22px; height: 2px;
    background: var(--color-foreground);
    border-radius: 2px;
    transition: all 0.25s ease;
  }
`

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: '72px',
      transition: 'all 0.3s ease',
      background: scrolled || menuOpen ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
      borderBottom: scrolled || menuOpen ? '1px solid var(--color-border)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
    }}>
      <style>{CSS}</style>

      {/* Inner container — max 1200px centered */}
      <div style={{
        maxWidth: 1200, margin: '0 auto', height: '100%',
        padding: '0 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="#hero" onClick={closeMenu}><Logo size={1.1} /></a>

        {/* Desktop nav */}
        <nav className="nav-links">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="nav-link">{link.label}</a>
          ))}
          <a href="#contact" className="nav-cta">ثبت‌نام رایگان</a>
        </nav>

        {/* Hamburger */}
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 8 }}
          aria-label="منو"
        >
          <span className="hamburger-line" style={menuOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}} />
          <span className="hamburger-line" style={menuOpen ? { opacity: 0 } : {}} />
          <span className="hamburger-line" style={menuOpen ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}} />
        </button>
      </div>

      {/* Mobile menu — full width, outside container */}
      <nav className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <a key={link.href} href={link.href} className="nav-link" onClick={closeMenu}>{link.label}</a>
        ))}
        <a href="#contact" className="nav-cta" onClick={closeMenu}>ثبت‌نام رایگان</a>
      </nav>
    </header>
  )
}
