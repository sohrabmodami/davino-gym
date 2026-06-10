const milestones = [
  { year: '۱۳۹۴', title: 'تأسیس داوینو', desc: 'شروع فعالیت با یک دیواره ۸ متری و ۵ مربی' },
  { year: '۱۳۹۶', title: 'توسعه فضا', desc: 'افزایش مساحت به ۱۲۰۰ متر مربع و ۱۸ مسیر جدید' },
  { year: '۱۳۹۸', title: 'قهرمانی ملی', desc: 'کسب مقام اول تیمی در مسابقات ملی سنگنوردی' },
  { year: '۱۴۰۱', title: 'دیواره ۱۵ متری', desc: 'افتتاح بلندترین دیواره سرپوشیده تهران' },
]

export default function About() {
  return (
    <section id="about" style={{
      padding: '100px 2.5rem',
      background: 'var(--color-bg-white)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="about-grid">
          {/* Left: Story */}
          <div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(234,68,60,0.08)', border: '1px solid rgba(234,68,60,0.2)',
              borderRadius: '50px', padding: '5px 16px', marginBottom: '20px',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>داستان ما</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900,
              marginBottom: '20px', lineHeight: 1.2, letterSpacing: '-0.5px',
            }}>
              از یک رویا تا<br />
              <span style={{ color: 'var(--color-primary)' }}>بزرگ‌ترین کلایمینگ جیم</span><br />
              تهران
            </h2>

            <p style={{ fontSize: '16px', color: 'var(--color-foreground-muted)', lineHeight: 1.85, marginBottom: '20px' }}>
              داوینو کلایمینگ در سال ۱۳۹۴ با یک رویا شروع شد — فضایی امن و حرفه‌ای که هر کسی بتونه سنگنوردی رو کشف کنه. امروز با بیش از ۱۲۰۰ عضو فعال، ۱۸ دیواره متنوع و تیمی از بهترین مربیان ایران، مفتخریم که خانه‌ی سنگنوردان تهران هستیم.
            </p>
            <p style={{ fontSize: '16px', color: 'var(--color-foreground-muted)', lineHeight: 1.85 }}>
              فلسفه ما سادس: سنگنوردی فقط برای جسم نیست — ذهن، اراده و اعتماد به نفس رو هم تقویت می‌کنه. ما اینجاییم تا این مسیر رو کنارت طی کنیم.
            </p>

            {/* Values */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '36px' }}>
              {[
                { icon: '🏔', title: 'ایمنی اول', desc: 'تمام تجهیزات دارای استاندارد بین‌المللی UIAA' },
                { icon: '🎯', title: 'آموزش اصولی', desc: 'برنامه آموزشی مرحله به مرحله برای هر سطح' },
                { icon: '🤝', title: 'جامعه‌محور', desc: 'فضایی برای رشد مشترک و دوستی‌های پایدار' },
              ].map(val => (
                <div key={val.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                    background: 'rgba(234,68,60,0.08)', border: '1px solid rgba(234,68,60,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px',
                  }}>{val.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '3px' }}>{val.title}</div>
                    <div style={{ fontSize: '14px', color: 'var(--color-foreground-muted)' }}>{val.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Timeline */}
          <div>
            <div style={{
              background: 'var(--color-bg)',
              borderRadius: '24px', padding: '36px',
              border: '1px solid var(--color-border)',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '32px', color: 'var(--color-foreground)' }}>
                مسیر داوینو
              </h3>

              <div style={{ position: 'relative' }}>
                {/* Timeline line */}
                <div style={{
                  position: 'absolute', right: '19px', top: '8px', bottom: '8px',
                  width: '2px', background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-border) 100%)',
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {milestones.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', paddingRight: '44px', position: 'relative' }}>
                      {/* Dot */}
                      <div style={{
                        position: 'absolute', right: '12px', top: '4px',
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: i === milestones.length - 1 ? 'var(--color-primary)' : '#fff',
                        border: '2px solid var(--color-primary)',
                        boxShadow: i === milestones.length - 1 ? '0 0 0 4px rgba(234,68,60,0.15)' : 'none',
                        flexShrink: 0,
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)',
                          marginBottom: '4px', letterSpacing: '0.5px',
                        }}>{m.year}</div>
                        <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '3px' }}>{m.title}</div>
                        <div style={{ fontSize: '13px', color: 'var(--color-foreground-muted)', lineHeight: 1.6 }}>{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '32px',
                paddingTop: '24px', borderTop: '1px solid var(--color-border)',
              }}>
                {[
                  { num: '۱۲۰۰+', label: 'عضو فعال' },
                  { num: '۱۸', label: 'دیواره و مسیر' },
                  { num: '۱۵م', label: 'بلندترین دیواره' },
                  { num: '۴.۹/۵', label: 'رضایت کاربران' },
                ].map(s => (
                  <div key={s.label} style={{
                    background: 'var(--color-bg-white)', borderRadius: '12px',
                    padding: '16px', border: '1px solid var(--color-border)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-primary)' }}>{s.num}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-foreground-muted)', marginTop: '3px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
