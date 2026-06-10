import Logo from './Logo'

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.697l-2.95-.924c-.642-.204-.655-.642.136-.953l11.57-4.461c.537-.194 1.006.131.326.889z"/>
  </svg>
)
const WhatsappIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const socials = [
  { icon: <InstagramIcon />, label: 'اینستاگرام', href: '#', color: '#E1306C' },
  { icon: <TelegramIcon />,  label: 'تلگرام',     href: '#', color: '#229ED9' },
  { icon: <WhatsappIcon />,  label: 'واتساپ',     href: '#', color: '#25D366' },
  { icon: <YoutubeIcon />,   label: 'یوتیوب',     href: '#', color: '#FF0000' },
]

const CSS = `
  .footer-social-btn {
    width: 42px; height: 42px; border-radius: 12px;
    background: var(--color-bg-white);
    border: 1.5px solid var(--color-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--color-foreground-muted);
    transition: all 0.22s ease;
    text-decoration: none;
  }
  .footer-social-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
  .footer-link {
    font-size: 13px; color: var(--color-foreground-muted);
    transition: color 0.2s; text-decoration: none;
    display: flex; align-items: center; gap: 6px;
  }
  .footer-link:hover { color: var(--color-primary); }
  .footer-link::before {
    content: ''; display: inline-block;
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--color-border);
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .footer-link:hover::before { background: var(--color-primary); }
`

export default function Footer() {
  return (
    <footer style={{ background: '#111', color: '#fff', direction: 'rtl' }}>
      <style>{CSS}</style>

      {/* Main footer */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 2.5rem 48px' }}>
        <div className="footer-grid">

          {/* Brand col */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <Logo size={1.1} dark />
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.85, maxWidth: 260, marginBottom: 28 }}>
              از ۱۳۹۴ تاکنون، خانه‌ی سنگنوردان تهران. بزرگ‌ترین باشگاه سنگنوردی سرپوشیده با ۱۸ مسیر و ۱۵ متر ارتفاع.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer-social-btn"
                  aria-label={s.label}
                  style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.55)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.borderColor = s.color; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'; e.currentTarget.style.color = 'rgba(255,255,255,.55)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links cols */}
          {[
            { title: 'خدمات', links: ['سنگنوردی مبتدی', 'بولدرینگ', 'Lead کلایمینگ', 'کلاس کودکان', 'تمرین خصوصی'] },
            { title: 'باشگاه',  links: ['درباره ما', 'تیم مربیان', 'گالری', 'مسابقات', 'اخبار'] },
            { title: 'پشتیبانی', links: ['سوالات متداول', 'تماس با ما', 'شرایط عضویت', 'حریم خصوصی'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 800, marginBottom: 20, color: 'rgba(255,255,255,.9)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {col.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(link => (
                  <a key={link} href="#" className="footer-link"
                    style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', transition: 'color 0.2s', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.45)'}
                  >{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div style={{
          display: 'flex', gap: 32, flexWrap: 'wrap',
          borderTop: '1px solid rgba(255,255,255,.08)',
          borderBottom: '1px solid rgba(255,255,255,.08)',
          padding: '28px 0', marginTop: 48,
        }}>
          {[
            { icon: '📍', text: 'تهران، خیابان ولیعصر، خیابان داوینو، پلاک ۲۴' },
            { icon: '📞', text: '۰۲۱-۸۸۸۸-۰۰۰۰' },
            { icon: '⏰', text: 'شنبه تا پنجشنبه ۸ صبح تا ۱۰ شب' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.45)' }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 24 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.3)' }}>
            © ۱۴۰۳ داوینو کلایمینگ — تمامی حقوق محفوظ است
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['حریم خصوصی', 'شرایط استفاده', 'نقشه سایت'].map(item => (
              <a key={item} href="#"
                style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.3)'}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
