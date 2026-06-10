export default function Hero() {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '100px 2.5rem 60px',
      background: 'linear-gradient(160deg, #FFF9F5 0%, #F5F0EA 60%, #EDE8E0 100%)',
    }}>
      {/* Background texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `radial-gradient(circle at 70% 30%, rgba(234,68,60,0.07) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(234,68,60,0.05) 0%, transparent 40%)`,
      }} />

      {/* Rock texture SVG bg */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, zIndex: 0 }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <pattern id="rock" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <polygon points="10,2 18,8 15,18 5,18 2,8" fill="none" stroke="#EA443C" strokeWidth="0.5"/>
        </pattern>
        <rect width="100" height="100" fill="url(#rock)"/>
      </svg>

      <div className="hero-grid" style={{
        maxWidth: '1200px', margin: '0 auto', width: '100%',
        position: 'relative', zIndex: 1,
      }}>
        {/* Text */}
        <div style={{ animation: 'fade-up 0.7s ease both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(234,68,60,0.1)', border: '1px solid rgba(234,68,60,0.25)',
            borderRadius: '50px', padding: '6px 16px', marginBottom: '28px',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 700 }}>باشگاه سنگنوردی حرفه‌ای تهران</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 900,
            lineHeight: 1.2, marginBottom: '24px', letterSpacing: '-1px',
            color: 'var(--color-foreground)',
          }}>
            به قله برس،<br />
            <span style={{ color: 'var(--color-primary)' }}>داوینو</span> همراهته
          </h1>

          <p style={{
            fontSize: '17px', color: 'var(--color-foreground-muted)',
            lineHeight: 1.8, marginBottom: '40px', maxWidth: '460px',
          }}>
            از مبتدی تا حرفه‌ای — با مربیان مجرب، دیواره‌های متنوع و فضای امن، مسیر سنگنوردی‌ات رو شروع کن.
          </p>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <a href="#pricing" style={{
              background: 'var(--color-primary)',
              color: '#fff', fontWeight: 700, fontSize: '16px',
              padding: '14px 36px', borderRadius: '50px',
              boxShadow: '0 8px 24px rgba(234,68,60,0.4)',
              transition: 'all 0.25s ease', display: 'inline-block',
            }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 32px rgba(234,68,60,0.5)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 24px rgba(234,68,60,0.4)'; }}
            >عضویت رایگان</a>
            <a href="#about" style={{
              color: 'var(--color-foreground)', fontWeight: 600, fontSize: '15px',
              padding: '14px 28px', borderRadius: '50px',
              border: '1.5px solid var(--color-border)',
              background: 'rgba(255,255,255,0.7)',
              transition: 'all 0.25s ease', display: 'inline-block',
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.color = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.color = 'var(--color-foreground)'; }}
            >بیشتر بدان</a>
          </div>

          {/* Stats */}
          <div className="hero-stats" style={{ display: 'flex', gap: '36px', marginTop: '56px', paddingTop: '32px', borderTop: '1px solid var(--color-border)' }}>
            {[
              { num: '۱۲۰۰+', label: 'سنگنورد فعال' },
              { num: '۱۸', label: 'دیواره متنوع' },
              { num: '۹', label: 'سال تجربه' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>{stat.num}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-foreground-muted)', marginTop: '5px', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="hero-visual" style={{ justifyContent: 'center', animation: 'fade-up 0.7s 0.15s ease both' }}>
          <div style={{ position: 'relative', width: '380px', height: '480px' }}>
            {/* Main card */}
            <div style={{
              width: '100%', height: '100%', borderRadius: '28px',
              background: 'linear-gradient(145deg, #2C1A10 0%, #1A0F08 100%)',
              overflow: 'hidden', position: 'relative',
              boxShadow: '0 40px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(234,68,60,0.15)',
            }}>
              {/* Climbing wall illustration */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }} viewBox="0 0 380 480" xmlns="http://www.w3.org/2000/svg">
                {[...Array(8)].map((_, r) =>
                  [...Array(6)].map((_, c) => (
                    <circle key={`${r}-${c}`} cx={40 + c * 55 + (r % 2) * 27} cy={40 + r * 55} r="8" fill="#EA443C"/>
                  ))
                )}
              </svg>

              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(44,26,16,0.85) 100%)',
              }} />

              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '32px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(234,68,60,0.7)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  DAVINO CLIMBING GYM
                </div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
                  دیواره‌های حرفه‌ای
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['مبتدی', 'متوسط', 'حرفه‌ای', 'مسابقاتی'].map(lvl => (
                    <span key={lvl} style={{
                      background: 'rgba(234,68,60,0.15)', border: '1px solid rgba(234,68,60,0.3)',
                      borderRadius: '6px', padding: '4px 12px',
                      fontSize: '12px', color: '#EA443C', fontWeight: 600,
                    }}>{lvl}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{
              position: 'absolute', top: '-14px', left: '-14px',
              background: '#fff', border: '1px solid var(--color-border)',
              borderRadius: '16px', padding: '12px 18px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              animation: 'float 3.5s ease-in-out infinite',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>ارتفاع دیواره</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-primary)' }}>۱۵ متر</div>
            </div>

            <div style={{
              position: 'absolute', bottom: '-14px', right: '-14px',
              background: 'var(--color-primary)', borderRadius: '16px', padding: '12px 18px',
              boxShadow: '0 8px 24px rgba(234,68,60,0.35)',
              animation: 'float 4s 1s ease-in-out infinite',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>امتیاز کاربران</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff' }}>۴.۹ ★</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
