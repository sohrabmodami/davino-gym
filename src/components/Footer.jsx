import Logo from './Logo'
import { useAdmin } from '../data/adminStore.jsx'

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

const navLinks = [
  { label: 'خانه',      href: '/#hero' },
  { label: 'درباره ما', href: '/#about' },
  { label: 'خدمات',     href: '/#services' },
  { label: 'مربیان',    href: '/#trainers' },
  { label: 'کلاس‌ها',   href: '/classes' },
  { label: 'گالری',     href: '/#gallery' },
  { label: 'قیمت‌ها',   href: '/#pricing' },
  { label: 'تماس با ما',href: '/#contact' },
]

const MobilePhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2z"/>
  </svg>
)
const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

export default function Footer() {
  const { settings } = useAdmin()

  const allSocials = [
    { key: 'instagram', icon: <InstagramIcon />, label: 'اینستاگرام', href: settings.instagram, color: '#E1306C', visKey: 'instagramVisible' },
    { key: 'telegram',  icon: <TelegramIcon />,  label: 'تلگرام',     href: settings.telegram,  color: '#229ED9', visKey: 'telegramVisible' },
    { key: 'whatsapp',  icon: <WhatsappIcon />,  label: 'واتساپ',     href: settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g,'')}` : '', color: '#25D366', visKey: 'whatsappVisible' },
    { key: 'youtube',   icon: <YoutubeIcon />,   label: 'یوتیوب',     href: settings.youtube,   color: '#FF0000', visKey: 'youtubeVisible' },
  ]

  const visibleSocials = allSocials.filter(s => settings[s.visKey] !== false && s.href)

  const contactItems = [
    { icon: <LocationIcon />, label: 'آدرس',   value: settings.address || 'تهران، خیابان ولیعصر' },
    { icon: <PhoneIcon />,    label: 'تلفن',   value: settings.phone   || '۰۲۱-۸۸۸۸-۰۰۰۰' },
    { icon: <ClockIcon />,    label: 'ساعات',  value: settings.hours   || 'شنبه تا پنجشنبه ۸–۲۲' },
  ]

  return (
    <footer style={{ background: '#0f0f0f', color: '#fff', direction: 'rtl' }}>

      {/* Main grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 2rem 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 18 }}>
              <Logo size={1.1} dark />
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.4)', lineHeight: 2, marginBottom: 28, maxWidth: 320 }}>
              از ۱۳۹۴ تاکنون، خانه‌ی سنگنوردان تهران. بزرگ‌ترین باشگاه سنگنوردی سرپوشیده با ۱۸ مسیر و ۱۵ متر ارتفاع.
            </p>

            {/* Phone numbers */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
              {settings.phone && (
                <a href={`tel:${settings.phone}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(234,68,60,.1)', border: '1px solid rgba(234,68,60,.2)',
                  borderRadius: 12, padding: '9px 14px', textDecoration: 'none',
                  color: '#fff', transition: 'background .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(234,68,60,.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(234,68,60,.1)'}
                >
                  <span style={{ color: '#EA443C', display: 'flex' }}><PhoneIcon /></span>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, marginBottom: 1 }}>تلفن ثابت</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{settings.phone}</div>
                  </div>
                </a>
              )}
              {settings.mobile && (
                <a href={`tel:${settings.mobile}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)',
                  borderRadius: 12, padding: '9px 14px', textDecoration: 'none',
                  color: '#fff', transition: 'background .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,.08)'}
                >
                  <span style={{ color: '#22C55E', display: 'flex' }}><MobilePhoneIcon /></span>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, marginBottom: 1 }}>تلفن همراه</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{settings.mobile}</div>
                  </div>
                </a>
              )}
            </div>

            {/* Social icons */}
            {visibleSocials.length > 0 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {visibleSocials.map(s => (
                  <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.5)', transition: 'all .2s', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.borderColor = s.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'; e.currentTarget.style.color = 'rgba(255,255,255,.5)'; e.currentTarget.style.transform = 'none' }}
                  >{s.icon}</a>
                ))}
              </div>
            )}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,.25)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24 }}>اطلاعات تماس</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {contactItems.map((item, i) => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 0',
                  borderBottom: i < contactItems.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(234,68,60,.1)', border: '1px solid rgba(234,68,60,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA443C', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 24, display: 'flex', justifyContent: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>
            © ۱۴۰۳ داوینو کلایمینگ — تمامی حقوق محفوظ است
          </p>
        </div>
      </div>

    </footer>
  )
}
