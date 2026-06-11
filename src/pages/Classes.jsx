import { useState, useMemo, useEffect } from 'react'
import { useAdmin } from '../data/adminStore.jsx'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const DAYS_ALL = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

const LEVEL_META = {
  'مبتدی':     { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'متوسط':     { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  'پیشرفته':   { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'همه سطوح': { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
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
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .cls-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #ede8e0;
    overflow: hidden;
    transition: transform .2s, box-shadow .2s, border-color .2s;
    animation: fadeUp .4s ease both;
    display: flex;
    flex-direction: column;
  }
  .cls-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0,0,0,.1);
    border-color: #d4cfc8;
  }

  .day-pill {
    font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 999px;
    background: rgba(0,0,0,.05); color: #666;
    font-family: 'Vazirmatn', sans-serif;
    white-space: nowrap;
  }

  .filter-tab {
    padding: 7px 16px; border-radius: 999px;
    font-family: 'Vazirmatn', sans-serif; font-size: 13px; font-weight: 600;
    border: 1.5px solid #e8e3dc; background: #fff; color: #777;
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .filter-tab:hover { border-color: #EA443C; color: #EA443C; }
  .filter-tab.on { background: #EA443C; color: #fff; border-color: #EA443C; box-shadow: 0 4px 12px rgba(234,68,60,.25); }

  .chip-select {
    padding: 7px 14px 7px 34px;
    border-radius: 10px;
    border: 1.5px solid #e8e3dc; background: #fff; color: #555;
    font-family: 'Vazirmatn', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; outline: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: left 11px center;
    transition: border-color .15s;
  }
  .chip-select:focus { border-color: #EA443C; }

  .view-tog {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 14px; border-radius: 10px;
    font-family: 'Vazirmatn', sans-serif; font-size: 12px; font-weight: 700;
    border: 1.5px solid #e8e3dc; background: #fff; color: #aaa;
    cursor: pointer; transition: all .15s;
  }
  .view-tog.on { background: #18181b; color: #fff; border-color: #18181b; }

  .week-col-head {
    text-align: center; padding: 10px 4px 12px;
    font-size: 12px; font-weight: 800; color: #888;
    border-bottom: 2px solid #f0ebe3;
    margin-bottom: 10px; font-family: 'Vazirmatn', sans-serif;
  }
  .week-card {
    border-radius: 12px; padding: 10px 12px;
    border-right: 3px solid var(--c, #EA443C);
    background: #fff; border-top: 1px solid #f0ebe3;
    border-bottom: 1px solid #f0ebe3; border-left: 1px solid #f0ebe3;
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
  const photo = trainerObj?.photo || ''
  const initial = trainerObj?.initial || cls.trainerName?.[0] || '؟'
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
            <span style={{ fontSize: 22, fontWeight: 900, color: '#111', fontFamily: 'Vazirmatn', lineHeight: 1 }}>{cls.startTime}</span>
            <span style={{ fontSize: 12, color: '#bbb', fontWeight: 600 }}>— {cls.endTime}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 11px', borderRadius: 999, background: lm.bg, color: lm.color, border: `1px solid ${lm.border}` }}>
            {cls.level}
          </span>
        </div>

        {/* Title */}
        <div style={{ fontSize: 17, fontWeight: 900, color: '#111', marginBottom: 12, lineHeight: 1.3 }}>
          {cls.title}
        </div>

        {/* Trainer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14, padding: '10px 12px', background: '#f9f7f5', borderRadius: 12 }}>
          {photo ? (
            <img src={photo} alt={cls.trainerName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,.6)', boxShadow: '0 0 0 1.5px rgba(0,0,0,.08)' }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,.6)', boxShadow: '0 0 0 1.5px rgba(0,0,0,.08)' }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#fff', fontFamily: 'Vazirmatn' }}>{initial}</span>
            </div>
          )}
          <div>
            <div style={{ fontSize: 10, color: '#bbb', fontWeight: 700, marginBottom: 1 }}>مربی</div>
            <div style={{ fontSize: 13, color: '#333', fontWeight: 800 }}>{cls.trainerName}</div>
          </div>
        </div>

        {/* Days + sessions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {cls.days.map(d => <span key={d} className="day-pill">{d}</span>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f9f7f5', borderRadius: 8, padding: '4px 10px', flexShrink: 0 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#888' }}>{cls.sessions || 8} جلسه/ماه</span>
          </div>
        </div>

        {/* Duration */}
        <div style={{ fontSize: 11, color: '#bbb', fontWeight: 600, marginBottom: 12 }}>
          مدت هر جلسه: {dur}
        </div>

        {/* Footer: capacity + price */}
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1.5px solid #f5f0ea' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: full ? '#ef4444' : '#aaa', fontWeight: 700 }}>
              {full ? '⚠ ظرفیت تکمیل' : `${cls.enrolled} از ${cls.capacity} نفر`}
            </span>
            <span style={{ fontSize: 15, fontWeight: 900, color: '#111' }}>
              {cls.price} <span style={{ fontSize: 10, color: '#bbb', fontWeight: 500 }}>تومان</span>
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: '#f0ebe3', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: full ? '#ef4444' : cls.color, borderRadius: 999, transition: 'width .6s ease' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function WeekView({ classes }) {
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
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#111', marginBottom: 3 }}>{cls.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: cls.color, marginBottom: 4 }}>{cls.startTime} — {cls.endTime}</div>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{cls.trainerName}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: lm.bg, color: lm.color }}>{cls.level}</span>
                      <span style={{ fontSize: 10, color: '#bbb', fontWeight: 700 }}>{cls.sessions || 8}×/ماه</span>
                    </div>
                  </div>
                )
              })}
              {dayCls.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px 8px', color: '#e0dbd3', fontSize: 20 }}>—</div>
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

  const active = classes.filter(c => c.active)
  const trainerNames = ['همه مربیان', ...new Set(active.map(c => c.trainerName))]

  const filtered = useMemo(() => active
    .filter(c => day === 'همه' || c.days.includes(day))
    .filter(c => level === 'همه' || c.level === level)
    .filter(c => trainer === 'همه مربیان' || c.trainerName === trainer)
    .filter(c => sessions === 'همه' || String(c.sessions || 8) === sessions)
    .sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime))
  , [classes, day, level, trainer, sessions])

  const hasFilter = day !== 'همه' || level !== 'همه' || trainer !== 'همه مربیان' || sessions !== 'همه'

  const totalSpots = active.reduce((s, c) => s + Math.max(0, c.capacity - c.enrolled), 0)

  return (
    <>
      <style>{CSS}</style>
      <Navbar />

      {/* Page header */}
      <section style={{
        paddingTop: 100,
        paddingBottom: 48,
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
        background: 'linear-gradient(180deg, #fff9f5 0%, #fff 100%)',
        borderBottom: '1px solid #ede8e0',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(234,68,60,.07)', border: '1px solid rgba(234,68,60,.18)', borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                <span style={{ fontSize: 12, color: '#EA443C', fontWeight: 800, fontFamily: 'Vazirmatn' }}>ثبت‌نام باز است</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: '#111', lineHeight: 1.2, margin: '0 0 12px', fontFamily: 'Vazirmatn' }}>
                برنامه کلاس‌های سنگنوردی
              </h1>
              <p style={{ fontSize: 15, color: '#888', fontFamily: 'Vazirmatn', margin: 0, lineHeight: 1.7 }}>
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
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#EA443C', fontFamily: 'Vazirmatn', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'Vazirmatn', marginTop: 4, fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff',
        borderBottom: '1px solid #ede8e0',
        boxShadow: '0 2px 12px rgba(0,0,0,.05)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 2.5rem 0' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderTop: '1px solid #f5f0ea', paddingTop: 10 }}>
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

            <div style={{ marginRight: 'auto', display: 'flex', borderRadius: 10, border: '1.5px solid #e8e3dc', overflow: 'hidden' }}>
              <button className={`view-tog${view === 'card' ? ' on' : ''}`} style={{ borderRadius: 0, border: 'none', borderLeft: '1px solid #e8e3dc' }} onClick={() => setView('card')}>
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
      <div style={{ background: '#faf8f5', minHeight: '50vh', paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 2.5rem 0' }}>

          {/* Results bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: '#aaa', fontFamily: 'Vazirmatn', fontWeight: 600, margin: 0 }}>
              {view === 'week' ? 'نمای هفتگی' : `${filtered.length} کلاس`}
            </p>
            {hasFilter && (
              <button onClick={() => { setDay('همه'); setLevel('همه'); setTrainer('همه مربیان'); setSessions('همه') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#EA443C', fontFamily: 'Vazirmatn', fontWeight: 700 }}>
                پاک کردن فیلترها ×
              </button>
            )}
          </div>

          {view === 'week' ? (
            <WeekView classes={classes} />
          ) : filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 18 }}>
              {filtered.map((cls, i) => <ClassCard key={cls.id} cls={cls} idx={i} trainerObj={trainers.find(t => t.name === cls.trainerName)} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f5f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#999', fontFamily: 'Vazirmatn', marginBottom: 8 }}>کلاسی با این فیلترها پیدا نشد</div>
              <div style={{ fontSize: 13, color: '#bbb', fontFamily: 'Vazirmatn' }}>فیلترهای دیگری امتحان کن</div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section style={{ background: '#111', padding: '56px 2.5rem', textAlign: 'center' }}>
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
