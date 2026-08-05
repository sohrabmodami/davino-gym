const paragraphs = [
  'من، مهدی بنهری، دانش‌آموخته مهندسی صنایع و دارای کارشناسی ارشد و دکترای حرفه‌ای مدیریت کارآفرینی هستم. تلاش کردم مسیر شغلی خود را با ترکیب دانش دانشگاهی، تجربه مدیریتی و نگاه کارآفرینانه دنبال کنم و همواره باور داشته‌ام که موفقیت‌های ماندگار، حاصل تلاش، همدلی و همراهی یک کار تیمی است.',
  'حدود ۱۲ سال پیش، به همراه دو تن از دوستان، گروه داوین را با هدف خلق ارزش، توسعه کسب‌وکارهای نوآورانه و ارائه خدمات حرفه‌ای ایجاد کردیم. از ابتدای این مسیر، تلاش ما بر ایجاد مجموعه‌ای مبتنی بر کیفیت محصولات و خدمات، مسئولیت‌پذیری و رشد پایدار بوده است.',
  'در حال حاضر به عنوان مدیرعامل آکادمی سنگنوردی داوینو و رئیس هیئت‌مدیره شرکت پیشگام تدبیر داوین، مسئولیت هدایت راهبردی، توسعه کسب‌وکار و طراحی مسیرهای رشد مجموعه را بر عهده دارم.',
  'در کنار فعالیت‌های اجرایی و کارآفرینی، به مدت ۵ سال سابقه تدریس دانشگاهی در رشته مهندسی صنایع داشته‌ام و تلاش کرده‌ام دانش تخصصی و تجربیات عملی مدیریت و کسب‌وکار را در مسیر آموزش و تربیت نسل جدید دانشجویان به کار بگیرم که این تجربه آموزشی، نقش مهمی در توسعه مسیر حرفه‌ای ما داشته است.',
  'یکی از مهم‌ترین دستاوردهای این مسیر، تأسیس آکادمی سنگنوردی و کوهنوردی داوینو بوده است؛ مجموعه‌ای که با همراهی یک تیم جوان و متعهد شکل گرفت تا فضایی ایمن، استاندارد و الهام‌بخش برای آموزش سنگنوردی به کودکان، نوجوانان و بزرگسالان ایجاد شود. داوینو امروز علاوه بر آموزش تخصصی، در زمینه طراحی و اجرای دیواره‌های سنگنوردی، توسعه فضاهای ورزشی و ارائه خدمات تخصصی این حوزه نیز فعالیت می‌کند.',
  'همچنین بیش از ۱۰ سال مدیریت بازرگانی فروشگاه داوینو را بر عهده داشته‌ام؛ مجموعه‌ای فعال در زمینه تأمین و عرضه تجهیزات تخصصی سنگنوردی، کوهنوردی و کار در ارتفاع که در این مسیر افتخار همکاری به عنوان نماینده فروش مرکزی برندهای معتبر جهانی Petzl، Beal و La Sportiva را داشته‌ایم.',
  'چشم‌انداز ما، ادامه مسیر رشد گروه داوین به عنوان مجموعه‌ای پیشرو در حوزه ورزش، آموزش، کارآفرینی و خدمات تخصصی است؛ مجموعه‌ای که با تکیه بر سرمایه انسانی، نوآوری و کیفیت، بتواند اثری ماندگار در جامعه ایجاد کند.',
]

const highlights = [
  { label: 'سمت', value: 'مدیرعامل آکادمی سنگنوردی داوینو' },
  { label: 'سمت', value: 'رئیس هیئت‌مدیره شرکت پیشگام تدبیر داوین' },
  { label: 'تحصیلات', value: 'مهندسی صنایع · کارشناسی ارشد و دکترای حرفه‌ای مدیریت کارآفرینی' },
  { label: 'گروه داوین', value: 'بیش از ۱۲ سال تجربه کارآفرینی و توسعه کسب‌وکار' },
  { label: 'تدریس', value: '۵ سال سابقه تدریس دانشگاهی مهندسی صنایع' },
  { label: 'بازرگانی', value: 'بیش از ۱۰ سال مدیریت فروشگاه داوینو · نماینده Petzl، Beal و La Sportiva' },
]

export default function Management() {
  return (
    <section id="management" style={{
      padding: 'clamp(70px, 8vw, 100px) clamp(24px, 4vw, 40px)',
      background: 'var(--bg)',
      borderTop: '1px solid var(--line)',
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ marginBottom: 'clamp(32px, 5vw, 48px)' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 800, color: 'var(--accent)',
            letterSpacing: '.14em', background: 'rgba(39,94,170,.1)',
            border: '1px solid rgba(39,94,170,.22)', borderRadius: 999,
            padding: '6px 15px', marginBottom: 20,
          }}>درباره مدیریت مجموعه</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.18, letterSpacing: '-.01em', margin: '0 0 10px', color: 'var(--text)' }}>
            مهدی <span style={{ color: 'var(--accent)' }}>بنهری</span>
          </h2>
          <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'var(--t50)', margin: 0, lineHeight: 1.8, maxWidth: 560 }}>
            مدیرعامل آکادمی سنگنوردی داوینو و رئیس هیئت‌مدیره شرکت پیشگام تدبیر داوین
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(36px, 5vw, 56px)', alignItems: 'start',
        }}>
          <div>
            {paragraphs.map((p, i) => (
              <p key={i} style={{
                fontSize: 'clamp(14.5px, 2vw, 16px)', color: 'var(--t60)', lineHeight: 2.1,
                margin: i === paragraphs.length - 1 ? 0 : '0 0 18px', textAlign: 'justify',
              }}>{p}</p>
            ))}

            <blockquote style={{
              margin: '28px 0 0', padding: '22px 24px',
              background: 'var(--accent-soft)', border: '1px solid rgba(39,94,170,.2)',
              borderRight: '3px solid var(--accent)', borderRadius: '0 16px 16px 0',
            }}>
              <p style={{
                fontSize: 'clamp(15px, 2vw, 17px)', fontWeight: 700, color: 'var(--text)',
                lineHeight: 1.9, margin: 0,
              }}>
                هیچ قله بزرگی به تنهایی فتح نمی‌شود؛ هر موفقیت ارزشمند، نتیجه اعتماد، همدلی و تلاش یک تیم است.
              </p>
            </blockquote>
          </div>

          <aside style={{
            background: 'var(--surface)', border: '1px solid var(--surface-b)',
            borderRadius: 24, overflow: 'hidden',
            transition: 'background .3s', position: 'sticky', top: 90,
          }}>
            <div style={{
              aspectRatio: '4 / 5', overflow: 'hidden', background: 'var(--bg2)',
            }}>
              <img
                src="/mehdi-banehri.png"
                alt="مهدی بنهری"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
            </div>
            <div style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', color: 'var(--text)' }}>مهدی بنهری</h3>
              <p style={{ fontSize: 13, color: 'var(--t50)', lineHeight: 1.7, margin: '0 0 24px' }}>
                بنیان‌گذار گروه داوین · هدایت راهبردی و توسعه کسب‌وکار
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {highlights.map((item, i) => (
                  <div key={i} style={{ paddingBottom: i === highlights.length - 1 ? 0 : 16, borderBottom: i === highlights.length - 1 ? 'none' : '1px solid var(--surface-b)' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', marginBottom: 4, letterSpacing: '.04em' }}>{item.label}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--t60)', lineHeight: 1.75, fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
