import { useAdmin } from '../data/adminStore.jsx'

const maskCubes = 'radial-gradient(115% 120% at 22% 12%, #000 8%, transparent 62%)'
const maskGrid = 'radial-gradient(120% 120% at 22% 12%, #000 10%, transparent 66%)'
const maskRings = 'radial-gradient(circle at center, #000 40%, transparent 72%)'

export default function Hero() {
  const { settings } = useAdmin()
  return (
    <section id="hero" style={{
      position: 'relative', overflow: 'hidden',
      padding: 'calc(66px + clamp(60px, 9vw, 104px)) clamp(24px, 4vw, 40px) clamp(56px, 7vw, 88px)',
      background: 'var(--bg)',
    }}>
      {/* درخشش قرمز متحرک */}
      <div style={{
        position: 'absolute', top: -160, left: '8%', width: 560, height: 560,
        background: 'radial-gradient(circle, rgba(234,68,60,.16), transparent 64%)',
        filter: 'blur(20px)', pointerEvents: 'none',
        animation: 'dvGlow 8s ease-in-out infinite',
      }} />
      {/* لایه ۱: مکعب‌های ایزومتریک */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-conic-gradient(from 30deg, var(--cubeTop) 0 120deg, var(--cubeL) 0 240deg, var(--cubeR) 0 360deg)',
        backgroundSize: '96px 166px', opacity: .6,
        WebkitMaskImage: maskCubes, maskImage: maskCubes,
      }} />
      {/* لایه ۲: خطوط ایزومتریک */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(30deg, var(--hgrid) 0 1px, transparent 1px 48px),
          repeating-linear-gradient(150deg, var(--hgrid) 0 1px, transparent 1px 48px),
          repeating-linear-gradient(90deg, var(--hgrid) 0 1px, transparent 1px 56px)`,
        WebkitMaskImage: maskGrid, maskImage: maskGrid,
      }} />
      {/* لایه ۳: حلقه‌های توپوگرافی */}
      <div style={{
        position: 'absolute', top: -180, left: -140, width: 720, height: 720, pointerEvents: 'none',
        backgroundImage: 'repeating-radial-gradient(circle, transparent 0 50px, var(--hring) 50px 51px)',
        opacity: .6,
        WebkitMaskImage: maskRings, maskImage: maskRings,
      }} />

      <div className="hero-grid" style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* متن */}
        <div style={{ flex: '1 1 420px', minWidth: 300 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            background: 'rgba(234,68,60,.12)', border: '1px solid rgba(234,68,60,.28)',
            borderRadius: 999, padding: '7px 16px', marginBottom: 26,
            animation: 'dvUp .6s .05s both',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 0 3px rgba(34,197,94,.2)' }} />
            <span style={{ fontSize: 13, color: 'var(--accentText)', fontWeight: 700 }}>{settings.heroBadge || 'باشگاه سنگنوردی حرفه‌ای تهران'}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 900,
            lineHeight: 1.12, letterSpacing: '-.02em', margin: '0 0 22px',
            color: 'var(--text)', animation: 'dvUp .6s .1s both',
          }}>
            {(settings.heroTitle || 'به قله برس،\nداوینو همراهته').split('\n').map((line, i, arr) => (
              <span key={i}>
                {line.split(/(داوینو)/).map((part, j) =>
                  part === 'داوینو' ? <span key={j} style={{ color: 'var(--accent)' }}>{part}</span> : part
                )}
                {i < arr.length - 1 && <br/>}
              </span>
            ))}
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2.2vw, 17px)', color: 'var(--t60)',
            lineHeight: 1.9, margin: '0 0 36px', maxWidth: 480,
            animation: 'dvUp .6s .15s both',
          }}>
            {settings.heroSubtitle || 'از مبتدی تا حرفه‌ای — با مربیان مجرب، دیواره‌های متنوع و فضای امن، مسیر سنگنوردی‌ات رو شروع کن.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', animation: 'dvUp .6s .2s both' }}>
            <a href="#pricing" style={{
              background: 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: 16,
              padding: '15px 38px', borderRadius: 12,
              boxShadow: '0 10px 28px rgba(234,68,60,.34)',
              transition: 'all .25s', display: 'inline-block',
            }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 16px 36px rgba(234,68,60,.48)' }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 28px rgba(234,68,60,.34)' }}
            >ثبت‌نام</a>
            <a href="#about" style={{
              color: 'var(--text)', background: 'var(--surface)', fontWeight: 700, fontSize: 15,
              padding: '15px 30px', borderRadius: 12,
              border: '1.5px solid var(--obtnbd)',
              transition: 'all .25s', display: 'inline-block',
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--obtnbd)'; e.target.style.color = 'var(--text)' }}
            >بیشتر بدان</a>
          </div>

          {/* آمار */}
          <div className="hero-stats" style={{
            display: 'flex', flexWrap: 'wrap', gap: 36, marginTop: 52, paddingTop: 32,
            borderTop: '1px solid var(--line)', animation: 'dvUp .6s .25s both',
          }}>
            {[
              { num: '۱۲۰۰+', label: 'سنگنورد فعال' },
              { num: '۱۸', label: 'دیواره متنوع' },
              { num: '۹', label: 'سال تجربه' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>{stat.num}</div>
                <div style={{ fontSize: 13, color: 'var(--t45)', marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* کارت عکس — همیشه تیره (انتخاب دیزاین) */}
        <div className="hero-visual" style={{ flex: '1 1 480px', minWidth: 300, position: 'relative', animation: 'dvUp .7s .15s both' }}>
          <div style={{
            position: 'relative', height: 'clamp(440px, 54vw, 620px)',
            borderRadius: 26, overflow: 'hidden',
            border: '1px solid rgba(234,68,60,.18)',
            boxShadow: '0 40px 90px rgba(0,0,0,.5)',
          }}>
            {settings.heroImage
              ? <img src={settings.heroImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              : (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(135deg, #1b1620, #1b1620 14px, #16121b 14px, #16121b 28px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-latin)', fontSize: 12, letterSpacing: '.24em', color: 'rgba(255,255,255,.24)' }}>PHOTO · دیواره</span>
                </div>
              )
            }
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 35%, rgba(8,6,10,.9) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 30, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-latin)', fontSize: 11, color: 'rgba(234,68,60,.85)', fontWeight: 600, letterSpacing: '.22em', marginBottom: 8 }}>
                DAVINO CLIMBING GYM
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 16 }}>
                {settings.heroCardTitle || 'دیواره‌های حرفه‌ای'}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['مبتدی', 'متوسط', 'حرفه‌ای', 'مسابقاتی'].map(lvl => (
                  <span key={lvl} style={{
                    background: 'rgba(234,68,60,.16)', border: '1px solid rgba(234,68,60,.32)',
                    borderRadius: 7, padding: '4px 13px',
                    fontSize: 12, color: '#f3a39d', fontWeight: 700,
                  }}>{lvl}</span>
                ))}
              </div>
            </div>
          </div>

          {/* کارت‌های شناور */}
          <div style={{
            position: 'absolute', top: -16, left: -16,
            background: '#17141a', border: '1px solid rgba(255,255,255,.12)',
            borderRadius: 16, padding: '13px 19px',
            boxShadow: '0 12px 30px rgba(0,0,0,.4)',
            animation: 'dvFloat 4s ease-in-out infinite',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>ارتفاع دیواره</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent)', marginTop: 2 }}>{settings.heroWallHeight || '۱۵ متر'}</div>
          </div>
          <div style={{
            position: 'absolute', bottom: -16, right: -16,
            background: 'var(--accent)', borderRadius: 16, padding: '13px 19px',
            boxShadow: '0 12px 30px rgba(234,68,60,.4)',
            animation: 'dvFloat 4.6s 1s ease-in-out infinite',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>امتیاز کاربران</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginTop: 2 }}>{settings.heroRating || '۴.۹ ★'}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
