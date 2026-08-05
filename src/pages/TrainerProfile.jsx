import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useAdmin } from '../data/adminStore.jsx'

const faNum = (n) => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])
const WEEK_DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

/* rgba کمرنگ از رنگ هگز کلاس */
const tint = (hex, a) => {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return `rgba(234,68,60,${a})`
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

const CSS = `
  @keyframes tpFadeUp { from { transform: translateY(18px); } to { transform: translateY(0); } }
`

export default function TrainerProfile() {
  const { id } = useParams()
  const { trainers, classes = [] } = useAdmin()
  const trainer = trainers.find(t => t.id === id)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (!trainer) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--t50)', marginBottom: 16 }}>مربی پیدا نشد</p>
        <Link to="/#trainers" style={{ color: 'var(--accent)', fontWeight: 700 }}>بازگشت</Link>
      </div>
    </div>
  )

  const trainerClasses = classes.filter(c => c.active && (c.trainerId === trainer.id || (!c.trainerId && c.trainerName === trainer.name)))
  const classesByDay = (day) => trainerClasses.filter(c => c.days.includes(day))
  const nameParts = trainer.name.split(' ')

  const stats = [
    { val: trainer.exp, lbl: 'سابقه تدریس' },
    { val: trainer.sessions, lbl: 'جلسه آموزش' },
    { val: trainerClasses.length > 0 ? `${trainerClasses.length}` : '—', lbl: 'کلاس فعال' },
    { val: trainer.tag, lbl: 'درجه', accent: true },
  ]

  return (
    <div style={{
      fontFamily: 'var(--font-body)', direction: 'rtl',
      background: 'var(--bg)', color: 'var(--text)',
      minHeight: '100vh', transition: 'background .3s, color .3s',
    }}>
      <style>{CSS}</style>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ── نوار بالا ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 28px', borderBottom: '1px solid var(--line)',
          position: 'sticky', top: 0, background: 'var(--nav)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          zIndex: 20, gap: 12,
        }}>
          <Link to="/#trainers" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: 'var(--t50)', fontSize: 13, fontWeight: 700, transition: 'color .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--t50)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            مربیان
          </Link>
          <span style={{ fontFamily: 'var(--font-latin)', fontSize: 13, fontWeight: 700, letterSpacing: '.18em', color: 'var(--t45)' }}>DAVINO</span>
        </div>

        {/* ── هیرو ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px, 5vw, 52px)',
          padding: 'clamp(32px, 5vw, 48px) clamp(24px, 4vw, 44px) 40px',
          alignItems: 'center',
        }}>
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <div style={{
              fontFamily: 'var(--font-latin)', fontSize: 12, fontWeight: 600,
              letterSpacing: '.24em', color: 'var(--accent)', textTransform: 'uppercase',
              marginBottom: 16, animation: 'tpFadeUp .6s .05s both',
            }}>{trainer.role}</div>
            <h1 style={{
              fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: 900, lineHeight: 1,
              letterSpacing: '-.02em', margin: '0 0 14px',
              animation: 'tpFadeUp .6s .1s both',
            }}>
              {nameParts[0]}{nameParts.length > 1 && <><br/>{nameParts.slice(1).join(' ')}</>}
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2.4vw, 16px)', color: 'var(--t50)', fontWeight: 500,
              margin: '0 0 30px', lineHeight: 1.7, animation: 'tpFadeUp .6s .15s both',
            }}>{trainer.role} · {trainer.cert}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px 0', animation: 'tpFadeUp .6s .2s both' }}>
              {stats.map((s, i) => (
                <div key={s.lbl} style={{
                  padding: i === 0 ? '0 0 0 24px' : '0 24px',
                  borderLeft: i < stats.length - 1 ? '1px solid var(--obtnbd)' : 'none',
                }}>
                  <div style={{ fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 900, lineHeight: 1, color: s.accent ? 'var(--accent)' : 'var(--text)' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--t45)', fontWeight: 600, marginTop: 6 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* کارت پرتره ۳:۴ */}
          <div style={{ flex: '0 1 340px', minWidth: 240, position: 'relative', animation: 'tpFadeUp .7s .15s both' }}>
            <div style={{ position: 'absolute', inset: -26, background: 'radial-gradient(circle at 60% 40%, rgba(234,68,60,.18), transparent 60%)', pointerEvents: 'none' }} />
            <div style={{
              position: 'relative', aspectRatio: '3/4', borderRadius: 20, overflow: 'hidden',
              border: '1px solid var(--surface-b)', boxShadow: '0 30px 70px rgba(0,0,0,.25)',
            }}>
              {trainer.photo
                ? <img src={trainer.photo} alt={trainer.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: `repeating-linear-gradient(135deg, ${trainer.gradFrom}, ${trainer.gradFrom} 12px, ${trainer.gradTo} 12px, ${trainer.gradTo} 24px)`,
                    display: 'flex', flexDirection: 'column', gap: 6,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 72, fontWeight: 900, color: 'rgba(255,255,255,.3)', lineHeight: 1 }}>{trainer.initial}</span>
                    <span style={{ fontFamily: 'var(--font-latin)', fontSize: 12, letterSpacing: '.2em', color: 'rgba(255,255,255,.35)' }}>PHOTO · PORTRAIT</span>
                  </div>
                )
              }
              <div style={{
                position: 'absolute', top: 14, right: 14,
                background: 'rgba(234,68,60,.92)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,.2)', color: '#fff',
                fontSize: 10, fontWeight: 800, padding: '5px 11px', borderRadius: 999,
              }}>★ {trainer.tag}</div>
            </div>
          </div>
        </div>

        {/* ── برنامه‌ی هفتگی ── */}
        <div style={{ padding: '8px clamp(24px, 4vw, 44px) 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '.14em' }}>برنامه‌ی هفتگی</div>
            <div style={{ fontSize: 12, color: 'var(--t45)', fontWeight: 500 }}>
              {trainerClasses.length > 0 ? `${trainerClasses.length} کلاس فعال در هفته` : 'بدون کلاس فعال'}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(116px, 1fr))', gap: 8 }}>
            {WEEK_DAYS.map(day => {
              const dayClasses = classesByDay(day)
              const hasClass = dayClasses.length > 0
              return (
                <div key={day} style={{
                  background: hasClass ? 'var(--surface)' : 'transparent',
                  border: `1px solid ${hasClass ? 'var(--surface-b)' : 'var(--line)'}`,
                  borderRadius: 13, padding: '12px 10px', minHeight: 128,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: hasClass ? (dayClasses[0].color || 'var(--accent)') : 'var(--dot)' }} />
                    <span style={{ fontSize: 12, fontWeight: hasClass ? 800 : 700, color: hasClass ? 'var(--text)' : 'var(--t45)' }}>{day}</span>
                  </div>
                  {hasClass
                    ? dayClasses.map(cls => (
                      <div key={cls.id} style={{
                        background: tint(cls.color, .13), border: `1px solid ${tint(cls.color, .28)}`,
                        borderRadius: 9, padding: '7px 9px', marginBottom: 6,
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text)', lineHeight: 1.4, marginBottom: 3 }}>{cls.title}</div>
                        <div style={{ fontFamily: 'var(--font-latin)', fontSize: 10, color: cls.color, fontWeight: 700 }}>{cls.startTime}</div>
                      </div>
                    ))
                    : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64, color: 'var(--dot)', fontSize: 18 }}>—</div>
                  }
                </div>
              )
            })}
          </div>
        </div>

        {/* ── درباره مربی ── */}
        <div style={{
          padding: '38px clamp(24px, 4vw, 44px) 44px',
          borderTop: '1px solid var(--line)',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '.14em', marginBottom: 14 }}>درباره مربی</div>
            <p style={{ fontSize: 15, lineHeight: 2.1, color: 'var(--t60)', fontWeight: 500, margin: '0 0 24px' }}>{trainer.bio}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {trainer.specialties.map(s => (
                <span key={s} style={{
                  border: '1px solid var(--obtnbd)', color: 'var(--t60)',
                  fontSize: 12, fontWeight: 600, padding: '7px 15px', borderRadius: 999,
                }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 18,
          padding: '26px clamp(24px, 4vw, 44px)',
          background: 'var(--surface)', borderTop: '1px solid var(--line)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)' }}>جلسه‌ی اول مشاوره رایگانه</span>
            <span style={{ fontSize: 13, color: 'var(--t45)' }}>با {nameParts[0]} شروع کن</span>
          </div>
          <Link to="/#contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--accent)', color: '#fff',
            fontSize: 14, fontWeight: 900, padding: '13px 26px', borderRadius: 11,
            transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(234,68,60,.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            رزرو جلسه
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
        </div>

      </div>
    </div>
  )
}
