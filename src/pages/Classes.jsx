import { useState, useMemo, useEffect } from 'react'
import { useAdmin } from '../data/adminStore.jsx'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const DAYS_ALL = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

const LEVEL_META = {
  'مبتدی':     { bg: 'rgba(34,197,94,.14)',   color: '#4ade80',            border: 'rgba(34,197,94,.28)' },
  'متوسط':     { bg: 'rgba(234,68,60,.14)',   color: 'var(--accentText)',  border: 'rgba(234,68,60,.28)' },
  'پیشرفته':   { bg: 'rgba(59,130,246,.14)',  color: '#60a5fa',            border: 'rgba(59,130,246,.28)' },
  'همه سطوح': { bg: 'rgba(161,161,170,.14)', color: 'var(--t60)',         border: 'rgba(161,161,170,.28)' },
}

function timeToMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function duration(start, end) {
  const d = timeToMin(end) - timeToMin(start)
  return d >= 60 ? `${Math.floor(d/60)}:${String(d%60).padStart(2,'0')} ساعت` : `${d} دقیقه`
}

const CSS = `
  @keyframes fadeUp { from{transform:translateY(16px)} to{transform:translateY(0)} }

  .cls-card {
    background: var(--surface);
    border-radius: 20px;
    border: 1px solid var(--surface-b);
    overflow: hidden;
    transition: transform .2s, box-shadow .2s, border-color .2s;
    animation: fadeUp .4s ease both;
    display: flex;
    flex-direction: column;
  }
  .cls-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-card);
    border-color: var(--accent);
  }

  .day-pill {
    font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 999px;
    background: var(--surface-b); color: var(--t60);
    font-family: 'Vazirmatn', sans-serif;
    white-space: nowrap;
  }

  .filter-tab {
    padding: 7px 16px; border-radius: 999px;
    font-family: 'Vazirmatn', sans-serif; font-size: 13px; font-weight: 600;
    border: 1px solid var(--surface-b); background: var(--surface); color: var(--t60);
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .filter-tab:hover { border-color: var(--accent); color: var(--accent); }
  .filter-tab.on { background: #EA443C; color: #fff; border-color: #EA443C; box-shadow: 0 4px 12px rgba(234,68,60,.25); }

  .chip-select {
    padding: 7px 14px 7px 34px;
    border-radius: 10px;
    border: 1px solid var(--surface-b); background: var(--surface); color: var(--t60);
    font-family: 'Vazirmatn', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; outline: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: left 11px center;
    transition: border-color .15s;
  }
  .chip-select:focus { border-color: var(--accent); }

  .view-tog {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 14px; border-radius: 10px;
    font-family: 'Vazirmatn', sans-serif; font-size: 12px; font-weight: 700;
    border: 1px solid var(--surface-b); background: var(--surface); color: var(--t45);
    cursor: pointer; transition: all .15s;
  }
  .view-tog.on { background: var(--btnbg); color: var(--btnfg); border-color: var(--btnbg); }

  .week-col-head {
    text-align: center; padding: 10px 4px 12px;
    font-size: 12px; font-weight: 800; color: var(--t50);
    border-bottom: 2px solid var(--track);
    margin-bottom: 10px; font-family: 'Vazirmatn', sans-serif;
  }
  .week-card {
    border-radius: 12px; padding: 10px 12px;
    border-right: 3px solid var(--c, #EA443C);
    background: var(--surface); border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line); border-left: 1px solid var(--line);
    margin-bottom: 8px; cursor: default;
    transition: transform .15s, box-shadow .15s;
    font-family: 'Vazirmatn', sans-serif;
  }
  .week-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.08); }
`

function ClassCard({ cls, idx, trainerObj }) {
  const lm = LEVEL_META[cls.level] || LEVEL_META['همه سطوح']
  const pct = cls.capacity > 0 ? Math.round((cls.enrolled / cls.capacity) * 100) : 0
  const full = cls.enrolled >= cls.capacity
  const dur = duration(cls.startTime, cls.endTime)
  // نام و آواتار زنده از رکورد مربی
  const trainerName = trainerObj?.name || cls.trainerName || '— بدون مربی —'
  const photo = trainerObj?.photo || ''
  const initial = trainerObj?.initial || trainerName[0] || '؟'
  const gradFrom = trainerObj?.gradFrom || cls.color
  const gradTo = trainerObj?.gradTo || cls.color

  return (
    <div className="cls-card" style={{ animationDelay: `${idx * 60}ms` }}>
      {/* Color bar top */}
      <div style={{ height: 4, background: cls.color, width: '100%' }} />

      <div style={{ padding: '20px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Time + level */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-latin)', lineHeight: 1 }}>{cls.startTime}</span>
            <span style={{ fontSize: 12, color: 'var(--t35)', fontWeight: 600 }}>— {cls.endTime}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 11px', borderRadius: 999, background: lm.bg, color: lm.color, border: `1px solid ${lm.border}` }}>
            {cls.level}
          </span>
        </div>

        {/* Title */}
        <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)', marginBottom: 12, lineHeight: 1.3 }}>
          {cls.title}
        </div>

        {/* Trainer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14, padding: '10px 12px', background: 'var(--surface-b)', borderRadius: 12 }}>
          {photo ? (
            <img src={photo} alt={trainerName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,.6)', boxShadow: '0 0 0 1.5px rgba(0,0,0,.08)' }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,.6)', boxShadow: '0 0 0 1.5px rgba(0,0,0,.08)' }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#fff', fontFamily: 'Vazirmatn' }}>{initial}</span>
            </div>
          )}
          <div>
            <div style={{ fontSize: 10, color: 'var(--t45)', fontWeight: 700, marginBottom: 1 }}>مربی</div>
            <div style={{ fontSize: 13, color: 'var(--t85)', fontWeight: 800 }}>{trainerName}</div>
          </div>
        </div>

        {/* Days + sessions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {cls.days.map(d => <span key={d} className="day-pill">{d}</span>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--surface-b)', borderRadius: 8, padding: '4px 10px', flexShrink: 0 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--t45)" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t50)' }}>{cls.sessions || 8} جلسه/ماه</span>
          </div>
        </div>

        {/* Duration */}
        <div style={{ fontSize: 11, color: 'var(--t35)', fontWeight: 600, marginBottom: 12 }}>
          مدت هر جلسه: {dur}
        </div>

        {/* Footer: capacity + price */}
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: full ? '#ef4444' : 'var(--t45)', fontWeight: 700 }}>
              {full ? '⚠ ظرفیت تکمیل' : `${cls.enrolled} از ${cls.capacity} نفر`}
            </span>
            <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>
              {cls.price} <span style={{ fontSize: 10, color: 'var(--t45)', fontWeight: 500 }}>تومان</span>
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--track)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: full ? '#ef4444' : cls.color, borderRadius: 999, transition: 'width .6s ease' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function WeekView({ classes, nameOf }) {
  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(160px, 1fr))', gap: 10, minWidth: 960 }}>
        {DAYS_ALL.map(day => {
          const dayCls = classes
            .filter(c => c.active && c.days.includes(day))
            .sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime))
          return (
            <div key={day}>
              <div className="week-col-head">{day}</div>
              {dayCls.map(cls => {
                const lm = LEVEL_META[cls.level] || LEVEL_META['همه سطوح']
                return (
                  <div key={cls.id} className="week-card" style={{ '--c': cls.color }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)', marginBottom: 3 }}>{cls.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: cls.color, marginBottom: 4 }}>{cls.startTime} — {cls.endTime}</div>
                    <div style={{ fontSize: 11, color: 'var(--t50)', marginBottom: 6 }}>{nameOf(cls)}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: lm.bg, color: lm.color }}>{cls.level}</span>
                      <span style={{ fontSize: 10, color: 'var(--t45)', fontWeight: 700 }}>{cls.sessions || 8}×/ماه</span>
                    </div>
                  </div>
                )
              })}
              {dayCls.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--dot)', fontSize: 20 }}>—</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Classes() {
  const { classes = [], trainers = [] } = useAdmin()
  const [day, setDay] = useState('همه')
  const [level, setLevel] = useState('همه')
  const [trainer, setTrainer] = useState('همه مربیان')
  const [sessions, setSessions] = useState('همه')
  const [view, setView] = useState('card')

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [])

  // نام زندهٔ مربی هر کلاس از رکورد مربی (با fallback به نام کش‌شده)
  const trainerOf = (cls) => trainers.find(t => t.id === cls.trainerId) || trainers.find(t => t.name === cls.trainerName)
  const nameOf = (cls) => trainerOf(cls)?.name || cls.trainerName || '— بدون مربی —'

  const active = classes.filter(c => c.active)
  const trainerNames = ['همه مربیان', ...new Set(active.map(nameOf))]

  // فیلترهای سطح/مربی/جلسات (بدون فیلتر روز) — برای هر دو نمای کارت و هفتگی مشترک‌اند
  const byAttrs = useMemo(() => active
    .filter(c => level === 'همه' || c.level === level)
    .filter(c => trainer === 'همه مربیان' || nameOf(c) === trainer)
    .filter(c => sessions === 'همه' || String(c.sessions || 8) === sessions)
  , [classes, trainers, level, trainer, sessions])

  // نمای کارت علاوه بر بالا، فیلتر روز را هم اعمال می‌کند
  const filtered = useMemo(() => byAttrs
    .filter(c => day === 'همه' || c.days.includes(day))
    .sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime))
  , [byAttrs, day])

  const hasFilter = day !== 'همه' || level !== 'همه' || trainer !== 'همه مربیان' || sessions !== 'همه'

  const totalSpots = active.reduce((s, c) => s + Math.max(0, c.capacity - c.enrolled), 0)

  return (
    <>
      <style>{CSS}</style>
      <Navbar />

      {/* Page header */}
      <section style={{
        paddingTop: 100,
        paddingBottom: 'clamp(28px, 5vw, 48px)',
        paddingLeft: 'clamp(1.2rem, 4vw, 2.5rem)',
        paddingRight: 'clamp(1.2rem, 4vw, 2.5rem)',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--line)',
        transition: 'background .3s',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(234,68,60,.12)', border: '1px solid rgba(234,68,60,.28)', borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                <span style={{ fontSize: 12, color: 'var(--accentText)', fontWeight: 800, fontFamily: 'Vazirmatn' }}>ثبت‌نام باز است</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: 'var(--text)', lineHeight: 1.2, margin: '0 0 12px', fontFamily: 'Vazirmatn' }}>
                برنامه کلاس‌های سنگنوردی
              </h1>
              <p style={{ fontSize: 15, color: 'var(--t50)', fontFamily: 'Vazirmatn', margin: 0, lineHeight: 1.7 }}>
                کلاس مناسب سطح و زمانت رو انتخاب کن و همین هفته شروع کن
              </p>
            </div>
            {/* Quick stats */}
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { n: active.length, l: 'کلاس فعال' },
                { n: new Set(active.map(c => c.trainerName)).size, l: 'مربی' },
                { n: totalSpots, l: 'ظرفیت باقی‌مانده' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent)', fontFamily: 'Vazirmatn', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--t45)', fontFamily: 'Vazirmatn', marginTop: 4, fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div style={{
        position: 'sticky', top: 66, zIndex: 50,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--line)',
        transition: 'background .3s',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px clamp(1.2rem, 4vw, 2.5rem) 0' }}>
          {/* Row 1: day tabs — scrollable */}
          <div style={{ overflowX: 'auto', paddingBottom: 10 }}>
            <div style={{ display: 'flex', gap: 5, width: 'max-content' }}>
              {['همه', ...DAYS_ALL].map(d => (
                <button key={d} className={`filter-tab${day === d ? ' on' : ''}`} onClick={() => { setDay(d); if(view === 'week') setView('card') }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: dropdowns + view toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
            <select className="chip-select" value={level} onChange={e => setLevel(e.target.value)}>
              <option value="همه">همه سطوح</option>
              {['مبتدی', 'متوسط', 'پیشرفته'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="chip-select" value={trainer} onChange={e => setTrainer(e.target.value)}>
              {trainerNames.map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="chip-select" value={sessions} onChange={e => setSessions(e.target.value)}>
              <option value="همه">همه جلسات</option>
              <option value="4">۴ جلسه/ماه</option>
              <option value="8">۸ جلسه/ماه</option>
            </select>

            <div style={{ marginRight: 'auto', display: 'flex', borderRadius: 10, border: '1px solid var(--surface-b)', overflow: 'hidden' }}>
              <button className={`view-tog${view === 'card' ? ' on' : ''}`} style={{ borderRadius: 0, border: 'none', borderLeft: '1px solid var(--surface-b)' }} onClick={() => setView('card')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </button>
              <button className={`view-tog${view === 'week' ? ' on' : ''}`} style={{ borderRadius: 0, border: 'none' }} onClick={() => setView('week')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="14" x2="21" y2="14"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: 'var(--bg2)', minHeight: '50vh', paddingBottom: 80, transition: 'background .3s' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px clamp(1.2rem, 4vw, 2.5rem) 0' }}>

          {/* Results bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: 'var(--t45)', fontFamily: 'Vazirmatn', fontWeight: 600, margin: 0 }}>
              {view === 'week' ? 'نمای هفتگی' : `${filtered.length} کلاس`}
            </p>
            {hasFilter && (
              <button onClick={() => { setDay('همه'); setLevel('همه'); setTrainer('همه مربیان'); setSessions('همه') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--accent)', fontFamily: 'Vazirmatn', fontWeight: 700 }}>
                پاک کردن فیلترها ×
              </button>
            )}
          </div>

          {view === 'week' ? (
            <WeekView classes={byAttrs} nameOf={nameOf} />
          ) : filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))', gap: 16 }}>
              {filtered.map((cls, i) => <ClassCard key={cls.id} cls={cls} idx={i} trainerObj={trainerOf(cls)} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-b)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--t35)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t50)', fontFamily: 'Vazirmatn', marginBottom: 8 }}>کلاسی با این فیلترها پیدا نشد</div>
              <div style={{ fontSize: 13, color: 'var(--t45)', fontFamily: 'Vazirmatn' }}>فیلترهای دیگری امتحان کن</div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section style={{ background: '#0e0d11', borderTop: '1px solid rgba(255,255,255,.07)', padding: '56px clamp(1.2rem, 4vw, 2.5rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', fontFamily: 'Vazirmatn', marginBottom: 10 }}>
            سوال داری؟ همین الان بپرس
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', fontFamily: 'Vazirmatn', marginBottom: 28, lineHeight: 1.7 }}>
            تیم ما آماده‌ست کمک کنه کلاس مناسبت رو انتخاب کنی
          </div>
          <a href="/#contact" style={{
            display: 'inline-block', background: '#EA443C', color: '#fff',
            fontWeight: 800, fontSize: 15, padding: '13px 36px', borderRadius: 12,
            fontFamily: 'Vazirmatn', textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(234,68,60,.35)',
          }}>
            تماس با ما
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
