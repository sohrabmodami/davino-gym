import { Link } from 'react-router-dom'
import { useAdmin } from '../data/adminStore.jsx'

/* همه مربیان آیکون یکسان — شیلد تیک */
const BadgeIcon = () => (
  <svg viewBox="0 0 20 20" fill="#fff" width="14" height="14">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
)

const ChevronLeft = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
  </svg>
)

const WEEK_ORDER = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

export default function Trainers() {
  const { trainers, classes = [] } = useAdmin()

  // روزهای هر مربی از کلاس‌های فعالش خوانده می‌شود (سینک با برنامه کلاس‌ها)
  const daysOf = (t) => {
    const fromClasses = [...new Set(
      classes.filter(c => c.active && c.trainerId === t.id).flatMap(c => c.days)
    )].sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b))
    return fromClasses.length ? fromClasses : (t.days || [])
  }

  return (
    <section id="trainers" style={{
      padding: 'clamp(70px, 8vw, 100px) clamp(24px, 4vw, 40px)',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--line)',
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 800, color: 'var(--accent)',
            letterSpacing: '.14em', background: 'rgba(234,68,60,.1)',
            border: '1px solid rgba(234,68,60,.22)', borderRadius: 999,
            padding: '6px 15px', marginBottom: 16,
          }}>تیم مربیان</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-.01em', margin: '0 0 12px', color: 'var(--text)' }}>
            از بهترین‌ها یاد بگیر
          </h2>
          <p style={{ fontSize: 16, color: 'var(--t50)', maxWidth: 460, margin: '0 auto', lineHeight: 1.75 }}>
            مربیان مجرب و قهرمانان ملی، همراه قدم‌به‌قدم مسیرت
          </p>
        </div>

        <div className="trainers-grid">
          {trainers.map(t => (
            <Link key={t.id} to={`/trainer/${t.id}`} className="tcard">
              <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 20, flexShrink: 0 }}>
                <div className="tring" />
                <div className="tarc" />
                <div className="tavatar">
                  {t.photo
                    ? <img src={t.photo} alt={t.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: `linear-gradient(150deg, ${t.gradFrom}, ${t.gradTo})`,
                      }}>
                        <span style={{ fontSize: 42, fontWeight: 900, color: 'rgba(255,255,255,.2)', lineHeight: 1 }}>{t.initial}</span>
                      </div>
                  }
                </div>
                <div className="tbadge"><BadgeIcon /></div>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)', margin: '0 0 4px', lineHeight: 1.3 }}>{t.name}</h3>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--accent)', margin: '0 0 18px' }}>{t.role}</p>

              <div className="tdiv" />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 22 }}>
                {daysOf(t).map(d => <span key={d} className="tpill">{d}</span>)}
              </div>

              <span className="tbtn">اطلاعات بیشتر <ChevronLeft /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
