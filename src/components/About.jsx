import { Link } from 'react-router-dom'

const paragraphs = [
  'آکادمی سنگنوردی داوینو، زیرمجموعه گروه داوین، فعالیت خود را از سال ۱۳۹۶ در مجتمع تجاری مگامال تهران آغاز کرده است. هدف ما از ابتدا ایجاد محیطی تخصصی، ایمن و استاندارد برای آموزش و توسعه ورزش سنگنوردی در تمامی گروه‌های سنی بوده است.',
  'در داوینو، آموزش سنگنوردی برای کودکان، نوجوانان و بزرگسالان با رویکردی علمی و متناسب با نیازهای هر رده سنی ارائه می‌شود. ما بر این باوریم که هر فرد مسیر یادگیری و پیشرفت منحصربه‌فردی دارد؛ به همین دلیل کلاس‌های آموزشی به‌صورت نیمه‌خصوصی و با ظرفیت محدود برگزار می‌شوند تا هر هنرجو از توجه، آموزش و پشتیبانی کافی برخوردار باشد.',
  'یکی از ویژگی‌های متمایز آکادمی داوینو، بهره‌گیری از مربیان تخصصی برای هر گروه سنی است. تیم آموزشی ما با شناخت دقیق ویژگی‌ها و نیازهای جسمی و ذهنی هر رده سنی، برنامه‌های آموزشی متناسبی را طراحی و اجرا می‌کند تا فرآیند یادگیری علاوه بر ایمنی و اثربخشی، لذت‌بخش و انگیزه‌بخش باشد.',
  'در طول سال‌های فعالیت خود، داوینو همواره تلاش کرده است فضایی فراتر از یک باشگاه ورزشی ایجاد کند؛ محیطی که در آن افراد بتوانند علاوه بر یادگیری مهارت‌های سنگنوردی، اعتمادبه‌نفس، تمرکز، نظم و روحیه تلاش برای رسیدن به اهداف را در خود تقویت کنند.',
  'امروز مفتخریم که با تکیه بر تجربه، دانش تخصصی و همراهی اعضای خانواده بزرگ داوینو، میزبان علاقه‌مندان سنگنوردی در تمامی سطوح باشیم و آنان را در مسیر رشد، پیشرفت و فتح قله‌ای جدید همراهی کنیم.',
]

const milestones = [
  { year: '۱۳۹۶', title: 'آغاز یک رویا', desc: 'افتتاح آکادمی سنگنوردی داوینو در طبقه F1 مجتمع مگامال تهران و میزبانی نخستین دوره مسابقات کشوری سنگنوردی نونهالان و نوجوانان.' },
  { year: '۱۴۰۱', title: 'فصل جدید داوینو', desc: 'انتقال باشگاه به طبقه G2 مجتمع مگامال و برگزاری دومین دوره مسابقات کشوری سنگنوردی نونهالان و نوجوانان.' },
  { year: '۱۴۰۲', title: 'گسترش همکاری‌های تخصصی', desc: 'آغاز برگزاری دوره‌های آموزشی سنگنوردی برای اعضای باشگاه‌های کوهنوردی و صعودهای ورزشی و توسعه همکاری‌های تخصصی در جامعه کوهنوردی کشور.' },
  { year: '۱۴۰۳', title: 'فراتر از دیواره', desc: 'برگزاری سومین دوره مسابقات کشوری سنگنوردی نونهالان و نوجوانان و آغاز تورهای تخصصی طبیعت‌گردی و سنگنوردی در طبیعت با هدف ارتقای مهارت‌های عملی هنرجویان.' },
  { year: '۱۴۰۵', title: 'گامی بلند به سوی آینده', desc: 'افتتاح سالن جدید سنگنوردی داوینو در طبقه F3 مجتمع مگامال؛ فضایی مدرن و تخصصی برای آموزش، تمرین و پرورش نسل جدید سنگنوردان.', active: true },
]

export default function About() {
  return (
    <section id="about" style={{
      padding: 'clamp(70px, 8vw, 100px) clamp(24px, 4vw, 40px)',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--line)',
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* سرتیتر */}
        <div style={{ marginBottom: 'clamp(32px, 5vw, 48px)' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 800, color: 'var(--accent)',
            letterSpacing: '.14em', background: 'rgba(39,94,170,.1)',
            border: '1px solid rgba(39,94,170,.22)', borderRadius: 999,
            padding: '6px 15px', marginBottom: 20,
          }}>درباره ما</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.18, letterSpacing: '-.01em', margin: 0, color: 'var(--text)' }}>
            آکادمی سنگنوردی <span style={{ color: 'var(--accent)' }}>داوینو</span>
          </h2>
        </div>

        {/* چیدمان دو ستونه: متن + تایم‌لاین */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(36px, 5vw, 56px)', alignItems: 'start',
        }}>
          {/* متن درباره ما */}
          <div>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 'clamp(14.5px, 2vw, 16px)', color: 'var(--t60)', lineHeight: 2.1, margin: i === paragraphs.length - 1 ? 0 : '0 0 18px', textAlign: 'justify' }}>{p}</p>
            ))}
          </div>

          {/* کارت مسیر داوینو — تایم‌لاین عمودی */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--surface-b)',
            borderRadius: 24, padding: 'clamp(24px, 3vw, 36px)',
            transition: 'background .3s', position: 'sticky', top: 90,
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 28px', color: 'var(--text)' }}>مسیر داوینو</h3>
            <div style={{ position: 'relative', paddingRight: 8 }}>
              <div style={{ position: 'absolute', right: 7, top: 6, bottom: 6, width: 2, background: 'linear-gradient(180deg, var(--accent), var(--track))' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {milestones.map(m => (
                  <div key={m.year} style={{ position: 'relative', paddingRight: 38 }}>
                    <div style={{
                      position: 'absolute', right: 0, top: 3, width: 16, height: 16, borderRadius: '50%',
                      background: m.active ? 'var(--accent)' : 'var(--bg2)',
                      border: '2px solid var(--accent)',
                      boxShadow: m.active ? '0 0 0 4px rgba(39,94,170,.18)' : 'none',
                    }} />
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 4, letterSpacing: '.04em' }}>{m.year} · {m.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--t50)', lineHeight: 1.75 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid var(--surface-b)', textAlign: 'center' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--accent)', lineHeight: 1.7 }}>
                ۹ سال رشد، آموزش و صعود در کنار خانواده داوینو
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 'clamp(36px, 5vw, 52px)',
          background: 'var(--surface)',
          border: '1px solid var(--surface-b)',
          borderRadius: 24,
          padding: 'clamp(24px, 3vw, 32px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}>
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>درباره مدیریت مجموعه</div>
            <div style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>مهدی بنهری</div>
            <p style={{ fontSize: 14, color: 'var(--t50)', lineHeight: 1.8, margin: 0 }}>
              مدیرعامل آکادمی سنگنوردی داوینو و رئیس هیئت‌مدیره شرکت پیشگام تدبیر داوین
            </p>
          </div>
          <Link
            to="/management"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--accent)', color: '#fff', textDecoration: 'none',
              fontSize: 14, fontWeight: 800, padding: '12px 22px', borderRadius: 14,
              boxShadow: '0 8px 26px rgba(39,94,170,0.28)',
              whiteSpace: 'nowrap',
            }}
          >
            مطالعه بیوگرافی
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
