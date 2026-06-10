import Logo from './Logo'

export default function Footer() {
  return (
    <footer style={{
      padding: '60px 2.5rem 32px',
      borderTop: '1px solid var(--color-border)',
      background: '#FAFAF9',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Logo size={1.1} />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-foreground-muted)', lineHeight: 1.8, maxWidth: '260px' }}>
              از ۱۳۹۴ تاکنون، خانه‌ی سنگنوردان تهران. بزرگ‌ترین باشگاه سنگنوردی سرپوشیده با ۱۸ مسیر متنوع و ۱۵ متر ارتفاع.
            </p>
          </div>
          {[
            { title: 'خدمات', links: ['سنگنوردی مبتدی', 'بولدرینگ', 'Lead کلایمینگ', 'کلاس کودکان'] },
            { title: 'باشگاه', links: ['درباره ما', 'تیم مربیان', 'گالری', 'مسابقات'] },
            { title: 'پشتیبانی', links: ['سوالات متداول', 'تماس با ما', 'شرایط عضویت', 'حریم خصوصی'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px', color: 'var(--color-foreground)' }}>{col.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ fontSize: '13px', color: 'var(--color-foreground-muted)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--color-foreground-muted)'}
                  >{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '24px', borderTop: '1px solid var(--color-border)',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--color-foreground-dim)' }}>
            © ۱۴۰۳ داوینو کلایمینگ — تمامی حقوق محفوظ است
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['اینستاگرام', 'تلگرام', 'واتساپ'].map(s => (
              <a key={s} href="#" style={{ fontSize: '13px', color: 'var(--color-foreground-muted)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--color-foreground-muted)'}
              >{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
