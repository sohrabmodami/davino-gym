const plans = [
  {
    name: 'پایه',
    price: '۳۹۰',
    period: 'ماهانه',
    desc: 'برای شروع سفر سنگنوردی',
    color: '#6B7280',
    features: [
      'دسترسی به دیواره‌های عمومی',
      '۲ جلسه آموزش مبتدی',
      'کفش قرضی رایگان',
      'رختکن و دوش',
    ],
    cta: 'شروع کن',
    popular: false,
  },
  {
    name: 'کلایمر',
    price: '۷۹۰',
    period: 'ماهانه',
    desc: 'محبوب‌ترین پلن — برای رشد جدی',
    color: '#EA443C',
    features: [
      'دسترسی نامحدود به تمام دیواره‌ها',
      'کلاس‌های گروهی نامحدود',
      '۱ جلسه PT خصوصی در هفته',
      'تجهیزات قرضی رایگان',
      'دسترسی ۷ روز هفته',
    ],
    cta: 'همین الان بخر',
    popular: true,
  },
  {
    name: 'Pro',
    price: '۱۳۹۰',
    period: 'ماهانه',
    desc: 'برای کسایی که جدی می‌خوان بالا برن',
    color: '#EA443C',
    features: [
      'همه امکانات کلایمر',
      '۳ جلسه PT خصوصی در هفته',
      'برنامه تمرینی اختصاصی',
      'آنالیز ویدیویی تکنیک',
      'دسترسی به تیم مسابقاتی',
      'لاکر اختصاصی',
    ],
    cta: 'Pro بشو',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: '100px 2.5rem', background: 'var(--color-bg-section)' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(234,68,60,0.08)', border: '1px solid rgba(234,68,60,0.2)',
            borderRadius: '50px', padding: '5px 16px', marginBottom: '16px',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>قیمت‌گذاری</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, marginBottom: '14px', letterSpacing: '-0.5px' }}>
            پلن مناسبت رو انتخاب کن
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-foreground-muted)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.75 }}>
            بدون قرارداد اجباری — هر وقت خواستی لغو کن
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div key={i} className={plan.popular ? 'pricing-popular' : ''} style={{
              background: '#fff',
              border: plan.popular ? `2px solid ${plan.color}` : '1.5px solid var(--color-border)',
              borderRadius: '24px',
              padding: plan.popular ? '40px 28px' : '32px 28px',
              position: 'relative', overflow: 'hidden',
              transform: plan.popular ? 'scale(1.04)' : 'scale(1)',
              boxShadow: plan.popular ? `0 20px 60px rgba(234,68,60,0.12)` : '0 2px 16px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => {
                if (!plan.popular) {
                  e.currentTarget.style.borderColor = `${plan.color}60`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.08)'
                }
              }}
              onMouseLeave={e => {
                if (!plan.popular) {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)'
                }
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
                  background: plan.color, color: '#fff',
                  fontWeight: 800, fontSize: '11px', padding: '4px 16px', borderRadius: '50px',
                  letterSpacing: '0.5px', whiteSpace: 'nowrap',
                }}>⭐ پرطرفدارترین</div>
              )}

              <div style={{ paddingTop: plan.popular ? '20px' : 0 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: plan.color, marginBottom: '6px' }}>{plan.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-foreground-muted)', marginBottom: '24px' }}>{plan.desc}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '44px', fontWeight: 900, color: 'var(--color-foreground)', lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: '14px', color: 'var(--color-foreground-muted)' }}>هزار تومان</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-foreground-dim)', marginBottom: '28px' }}>{plan.period}</p>

                <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map((feat, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                        background: `${plan.color}15`, border: `1px solid ${plan.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--color-foreground-muted)' }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <button style={{
                  width: '100%', padding: '13px',
                  borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                  background: plan.popular ? plan.color : `${plan.color}10`,
                  color: plan.popular ? '#fff' : plan.color,
                  border: plan.popular ? 'none' : `1.5px solid ${plan.color}25`,
                  boxShadow: plan.popular ? `0 6px 20px ${plan.color}40` : 'none',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.target.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {[
            { t: '🔒', l: 'پرداخت ۱۰۰٪ امن' },
            { t: '↩', l: 'بازگشت وجه ۳۰ روزه' },
            { t: '🎯', l: 'بدون قرارداد اجباری' },
          ].map(item => (
            <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{item.t}</span>
              <span style={{ fontSize: '13px', color: 'var(--color-foreground-muted)' }}>{item.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
