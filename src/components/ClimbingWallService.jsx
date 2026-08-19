import { Link } from 'react-router-dom'
import { useAdmin } from '../data/adminStore.jsx'

const CheckIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)

const featureGroups = [
  {
    title: 'خدمات ما شامل',
    color: '#275EAA',
    items: [
      'طراحی و اجرای دیواره سنگنوردی کودک',
      'دیواره‌های آموزشی مدارس و مراکز فرهنگی',
      'دیواره‌های تمرینی برای باشگاه‌ها',
      'دیواره‌های خانگی برای کودکان و بزرگسالان',
      'دیواره‌های بولدرینگ',
      'دیواره‌های تفریحی و سرگرمی',
    ],
  },
  {
    title: 'متریال استاندارد و باکیفیت',
    color: '#3B82F6',
    items: [
      'سازه‌های فلزی مقاوم و مهندسی‌شده',
      'صفحات تخصصی مناسب سنگنوردی',
      'گیره‌های استاندارد با دوام بالا',
      'پیچ و اتصالات ایمن و مقاوم',
      'کفپوش‌ها و تشک‌های ضربه‌گیر استاندارد',
    ],
  },
  {
    title: 'مزایای احداث دیواره سنگنوردی',
    color: '#22C55E',
    items: [
      'افزایش فعالیت بدنی و تحرک',
      'تقویت اعتمادبه‌نفس و تمرکز',
      'توسعه مهارت حل مسئله',
      'بهبود هماهنگی بین ذهن و بدن',
      'ایجاد فضایی جذاب و متفاوت برای کودکان و نوجوانان',
      'افزایش ارزش و جذابیت مراکز آموزشی و تفریحی',
    ],
  },
  {
    title: 'چرا داوینو؟',
    color: '#F59E0B',
    items: [
      'تجربه تخصصی در حوزه سنگنوردی',
      'طراحی اختصاصی متناسب با فضای شما',
      'استفاده از تجهیزات استاندارد و باکیفیت',
      'اجرای ایمن و حرفه‌ای',
      'مشاوره تخصصی پیش از اجرا',
      'پشتیبانی و خدمات پس از نصب',
    ],
  },
]

const tint = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

export default function ClimbingWallService() {
  const { settings } = useAdmin()
  const mobile = settings.mobile

  return (
    <section id="climbing-wall" style={{
      padding: 'clamp(70px, 8vw, 100px) clamp(24px, 4vw, 40px)',
      background: 'var(--bg)',
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* سرتیتر */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 52px)' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 800, color: 'var(--accent)',
            letterSpacing: '.14em', background: 'rgba(39,94,170,.1)',
            border: '1px solid rgba(39,94,170,.22)', borderRadius: 999,
            padding: '6px 15px', marginBottom: 18,
          }}>احداث دیواره سنگنوردی</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)', fontWeight: 900, lineHeight: 1.35, letterSpacing: '-.01em', margin: '0 0 14px', color: 'var(--text)', maxWidth: 780, marginInline: 'auto' }}>
            احداث دیواره سنگنوردی استاندارد توسط باشگاه سنگنوردی داوینو
          </h2>
          <p style={{ fontSize: 16, color: 'var(--t50)', maxWidth: 600, margin: '0 auto', lineHeight: 1.9 }}>
            طراحی و اجرای انواع دیواره سنگنوردی در مدارس، مهدکودک‌ها، منازل و مراکز ورزشی
          </p>
        </div>

        {/* متن معرفی */}
        <div style={{ maxWidth: 820, margin: '0 auto clamp(40px, 5vw, 56px)' }}>
          <p style={{ fontSize: 'clamp(14.5px, 2vw, 16px)', color: 'var(--t60)', lineHeight: 2.1, textAlign: 'justify', margin: '0 0 18px' }}>
            باشگاه سنگنوردی داوینو با بهره‌گیری از تجربه تخصصی در زمینه آموزش و توسعه ورزش سنگنوردی، خدمات طراحی، ساخت و اجرای انواع دیواره‌های سنگنوردی را در ابعاد و فضاهای مختلف ارائه می‌دهد.
          </p>
          <p style={{ fontSize: 'clamp(14.5px, 2vw, 16px)', color: 'var(--t60)', lineHeight: 2.1, textAlign: 'justify', margin: '0 0 18px' }}>
            امروزه سنگنوردی به‌عنوان یکی از کامل‌ترین ورزش‌های جسمی و ذهنی شناخته می‌شود و ایجاد یک دیواره استاندارد می‌تواند فضایی ایمن، جذاب و آموزشی برای کودکان، نوجوانان و بزرگسالان فراهم کند. مجموعه داوینو آمادگی دارد انواع دیواره‌های سنگنوردی را در مهدکودک‌ها، مدارس، مجتمع‌های مسکونی، باشگاه‌ها، مراکز تفریحی و حتی منازل شخصی اجرا نماید.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: '32px 0 10px' }}>
            اجرای دیواره سنگنوردی در هر ابعاد و فضایی
          </h3>
          <p style={{ fontSize: 'clamp(14.5px, 2vw, 16px)', color: 'var(--t60)', lineHeight: 2.1, textAlign: 'justify', margin: 0 }}>
            محدودیت فضا مانعی برای ساخت دیواره سنگنوردی نیست. کارشناسان داوینو پس از بازدید و بررسی محل، متناسب با ابعاد و شرایط موجود بهترین طرح را ارائه می‌کنند.
          </p>
        </div>

        {/* کارت‌های خدمات / متریال / مزایا / چرا داوینو */}
        <div className="wall-features-grid" style={{ marginBottom: 'clamp(40px, 5vw, 56px)' }}>
          {featureGroups.map(group => (
            <div
              key={group.title}
              style={{
                background: 'var(--surface)', border: '1px solid var(--surface-b)',
                borderRadius: 16, padding: 18,
                borderTop: `3px solid ${group.color}`,
              }}
            >
              <h4 style={{ fontSize: 13.5, fontWeight: 800, margin: '0 0 12px', color: 'var(--text)' }}>{group.title}</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--t50)', lineHeight: 1.7 }}>
                    <span style={{
                      flexShrink: 0, width: 16, height: 16, borderRadius: 5, marginTop: 1,
                      background: tint(group.color, .12), color: group.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><CheckIcon size={11} /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* بستن متن + CTA تماس */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--surface-b)',
          borderRadius: 24, padding: 'clamp(28px, 4vw, 40px)', textAlign: 'center',
        }}>
          <p style={{ fontSize: 'clamp(14.5px, 2vw, 16px)', color: 'var(--t60)', lineHeight: 2, maxWidth: 700, margin: '0 auto 24px', textAlign: 'justify' }}>
            اگر قصد دارید در مدرسه، مهدکودک، باشگاه، مجتمع مسکونی یا منزل خود یک دیواره سنگنوردی استاندارد و ایمن داشته باشید، تیم تخصصی داوینو آماده است تا از مرحله طراحی تا اجرای نهایی در کنار شما باشد.
          </p>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
            برای دریافت مشاوره و بازدید، با ما در تماس باشید
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link
              to="/wall-construction"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'var(--accent)', color: '#fff', textDecoration: 'none',
                fontSize: 16, fontWeight: 800, padding: '14px 30px', borderRadius: 14,
                boxShadow: '0 8px 26px rgba(39,94,170,0.35)',
              }}
            >
              مشاهده اطلاعات کامل و خدمات
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            {mobile && (
            <a
              href={`tel:${mobile}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'var(--surface)', color: 'var(--text)', textDecoration: 'none',
                fontSize: 16, fontWeight: 800, padding: '14px 30px', borderRadius: 14,
                border: '1.5px solid var(--obtnbd)', direction: 'ltr',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 2.19 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z"/></svg>
              {mobile}
            </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
