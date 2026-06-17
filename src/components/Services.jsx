const services = [
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'کلاس‌های مبتدی و پیشرفته',
    desc: 'دوره‌های آموزشی داوینو برای افراد ۱۴ سال به بالا، از سطح مبتدی تا پیشرفته طراحی شده‌اند. هنرجویان در محیطی ایمن و تخصصی، اصول پایه سنگنوردی، تکنیک‌های صعود، مهارت‌های حرکتی و مباحث پیشرفته را زیر نظر مربیان مجرب فرا می‌گیرند. کلاس‌ها به‌صورت نیمه‌خصوصی و با ظرفیت ۴ تا ۶ نفر برای هر مربی برگزار می‌شوند تا کیفیت آموزش در بالاترین سطح حفظ شود.',
    color: '#EA443C',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    title: 'آمادگی جسمانی و تخصصی سنگنوردی',
    desc: 'این دوره‌ها با هدف افزایش توان جسمانی، استقامت، قدرت، انعطاف‌پذیری و آمادگی تخصصی مورد نیاز سنگنوردان طراحی شده‌اند. برنامه‌های تمرینی متناسب با سطح آمادگی هر ورزشکار تدوین می‌شوند تا مسیر پیشرفت سریع‌تر و اصولی‌تر طی شود.',
    color: '#EC4899',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'تمرینات گروهی',
    desc: 'تمرینات گروهی فرصتی برای ارتقای مهارت‌ها در کنار سایر سنگنوردان است. این جلسات با برنامه‌ریزی مربیان مجموعه برگزار می‌شوند و علاوه بر افزایش توانایی‌های فنی، به تقویت روحیه تیمی، انگیزه و تجربه عملی هنرجویان کمک می‌کنند.',
    color: '#8B5CF6',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5C6 4 6 9 6 9zm0 0h12m-12 0v9a2 2 0 002 2h8a2 2 0 002-2V9m0 0h1.5a2.5 2.5 0 000-5C18 4 18 9 18 9z"/><path d="M8 22V9M16 22V9"/></svg>,
    title: 'برگزاری مسابقات',
    desc: 'آکادمی داوینو با سابقه برگزاری سه دوره مسابقات کشوری سنگنوردی نونهالان و نوجوانان، نقش فعالی در توسعه و ترویج این رشته در سطح پایه داشته است. این مسابقات با هدف ایجاد فضای رقابتی سالم، ارزیابی توانایی ورزشکاران و پرورش نسل آینده سنگنوردان برگزار می‌شوند و فرصتی ارزشمند برای محک‌زدن مهارت‌ها در فضایی استاندارد و حرفه‌ای فراهم می‌کنند.',
    color: '#F59E0B',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
    title: 'کلاس‌های ویژه کودکان',
    desc: 'دوره‌های تخصصی کودکان برای گروه سنی ۶ تا ۱۴ سال طراحی شده‌اند و توسط مربیان متخصص کودک با ظرفیت محدود ۴ تا ۶ نفر برگزار می‌شوند. آموزش با رویکردی متناسب با سن و توانایی کودکان ارائه می‌شود و علاوه بر مهارت‌های سنگنوردی، به افزایش اعتمادبه‌نفس، تمرکز، هماهنگی حرکتی و رشد فردی کودکان کمک می‌کند.',
    color: '#22C55E',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3l4 8 5-5 5 14H2L8 3z"/></svg>,
    title: 'کلاس‌های سنگنوردی طبیعت',
    desc: 'این دوره‌ها برای علاقه‌مندانی طراحی شده‌اند که قصد دارند مهارت‌های خود را از دیواره‌های آموزشی به محیط‌های طبیعی منتقل کنند. آموزش تکنیک‌های صعود در طبیعت، کار با تجهیزات، اصول ایمنی و تجربه عملی در فضای باز از بخش‌های مهم این برنامه‌هاست. تجهیزات تخصصی توسط آکادمی در اختیار هنرجویان قرار می‌گیرد و همه‌ی برنامه‌ها زیر نظر مربیان باتجربه برگزار می‌شوند.',
    color: '#06B6D4',
  },
]

/* rgba کمرنگ از رنگ هگز هر کارت */
const tint = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

export default function Services() {
  return (
    <section id="services" style={{
      padding: 'clamp(70px, 8vw, 100px) clamp(24px, 4vw, 40px)',
      background: 'var(--bg)',
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 800, color: 'var(--accent)',
            letterSpacing: '.14em', background: 'rgba(234,68,60,.1)',
            border: '1px solid rgba(234,68,60,.22)', borderRadius: 999,
            padding: '6px 15px', marginBottom: 16,
          }}>خدمات ما</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-.01em', margin: '0 0 12px', color: 'var(--text)' }}>
            برای هر سطح، یک مسیر
          </h2>
          <p style={{ fontSize: 16, color: 'var(--t50)', maxWidth: 460, margin: '0 auto', lineHeight: 1.75 }}>
            از اولین قدم تا قهرمانی — داوینو همه‌چیز داره
          </p>
        </div>

        <div className="services-grid">
          {services.map(s => (
            <div
              key={s.title}
              style={{
                background: 'var(--surface)', border: '1px solid var(--surface-b)',
                borderRadius: 20, padding: 28, transition: 'all .28s',
                display: 'flex', flexDirection: 'column',
                borderTop: `3px solid ${s.color}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = tint(s.color, .4); e.currentTarget.style.borderTopColor = s.color }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--surface-b)'; e.currentTarget.style.borderTopColor = s.color }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: tint(s.color, .12), border: `1px solid ${tint(s.color, .25)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color, marginBottom: 18,
              }}>{s.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 10px', color: 'var(--text)' }}>{s.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--t50)', lineHeight: 2, margin: 0, textAlign: 'justify' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
