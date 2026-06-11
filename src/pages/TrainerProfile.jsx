import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAdmin } from '../data/adminStore.jsx'
import Navbar from '../components/Navbar'

const CSS = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .tp-hero {
    position: relative;
    width: 100%;
    height: 88vh;
    min-height: 520px;
    max-height: 780px;
    overflow: hidden;
  }
  .tp-hero-img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center top;
  }
  .tp-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0.15) 40%,
      rgba(0,0,0,0.72) 75%,
      rgba(0,0,0,0.88) 100%
    );
  }
  .tp-hero-initial {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
  }
  .tp-hero-content {
    position: absolute; bottom: 0; right: 0; left: 0;
    padding: 0 clamp(1.5rem, 5vw, 5rem) clamp(2.5rem, 5vw, 4rem);
    animation: fadeUp .6s ease both;
  }

  .tp-tag {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(234,68,60,.85); color: #fff;
    font-size: 12px; font-weight: 800;
    padding: 5px 14px; border-radius: 999px;
    font-family: 'Vazirmatn', sans-serif;
    margin-bottom: 14px;
    backdrop-filter: blur(8px);
  }
  .tp-name {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 900; color: #fff; line-height: 1.1;
    margin: 0 0 8px; font-family: 'Vazirmatn', sans-serif;
  }
  .tp-role {
    font-size: clamp(14px, 2vw, 17px);
    color: rgba(255,255,255,.7); font-weight: 600;
    font-family: 'Vazirmatn', sans-serif; margin: 0;
  }

  .tp-stats-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #fff;
    border-bottom: 1px solid #ede8e0;
  }
  .tp-stat {
    padding: 22px 16px; text-align: center;
    border-left: 1px solid #ede8e0;
    animation: fadeUp .5s ease both;
  }
  .tp-stat:last-child { border-left: none; }
  .tp-stat-val {
    font-size: clamp(16px, 2.5vw, 22px);
    font-weight: 900; color: #111;
    font-family: 'Vazirmatn', sans-serif; line-height: 1.2;
  }
  .tp-stat-lbl {
    font-size: 11px; color: #aaa; font-weight: 700;
    font-family: 'Vazirmatn', sans-serif; margin-top: 3px;
  }

  .tp-section {
    background: #fff; border-radius: 20px;
    border: 1.5px solid #ede8e0;
    padding: clamp(20px, 4vw, 32px);
    animation: fadeUp .5s ease both;
  }
  .tp-section-title {
    font-size: 15px; font-weight: 900; color: #111;
    margin: 0 0 18px;
    display: flex; align-items: center; gap: 10px;
    font-family: 'Vazirmatn', sans-serif;
  }
  .tp-section-title::before {
    content: ''; width: 3px; height: 18px;
    background: #EA443C; border-radius: 2px; display: block; flex-shrink: 0;
  }

  .spec-tag {
    background: rgba(234,68,60,.07);
    border: 1px solid rgba(234,68,60,.18);
    color: #c0392b;
    font-size: 12px; font-weight: 700;
    padding: 6px 14px; border-radius: 999px;
    font-family: 'Vazirmatn', sans-serif;
  }
  .achieve-row {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px; border-radius: 12px;
    background: #faf8f5; border: 1px solid #f0ebe3;
  }
  .day-chip {
    background: #f5f0ea; color: #7a5c3c;
    font-size: 13px; font-weight: 800;
    padding: 7px 16px; border-radius: 999px;
    font-family: 'Vazirmatn', sans-serif;
  }
  .back-btn {
    position: absolute; top: clamp(80px, 10vw, 100px); right: clamp(1.5rem, 5vw, 5rem);
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.15); backdrop-filter: blur(12px);
    color: #fff; font-size: 13px; font-weight: 700;
    padding: 8px 16px; border-radius: 999px;
    text-decoration: none; font-family: 'Vazirmatn', sans-serif;
    border: 1px solid rgba(255,255,255,.25);
    transition: background .2s;
    z-index: 2;
  }
  .back-btn:hover { background: rgba(255,255,255,.25); }

  @media (max-width: 640px) {
    .tp-stats-bar { grid-template-columns: repeat(2, 1fr); }
    .tp-stat:nth-child(2) { border-left: none; }
    .tp-stat:nth-child(3) { border-top: 1px solid #ede8e0; }
    .tp-stat:nth-child(4) { border-top: 1px solid #ede8e0; }
    .tp-grid { grid-template-columns: 1fr !important; }
  }
`

export default function TrainerProfile() {
  const { id } = useParams()
  const { trainers, classes = [] } = useAdmin()
  const trainer = trainers.find(t => t.id === id)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (!trainer) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Vazirmatn, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, color: '#888' }}>مربی پیدا نشد</p>
          <Link to="/#trainers" style={{ color: '#EA443C', fontWeight: 700, marginTop: 12, display: 'inline-block' }}>بازگشت به مربیان</Link>
        </div>
      </div>
    )
  }

  // Classes taught by this trainer
  const trainerClasses = classes.filter(c => c.active && c.trainerName === trainer.name)

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3f0', fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl' }}>
      <style>{CSS}</style>
      <Navbar />

      {/* ── Hero ── */}
      <div className="tp-hero">
        {trainer.photo ? (
          <img className="tp-hero-img" src={trainer.photo} alt={trainer.name} />
        ) : (
          <div className="tp-hero-initial" style={{ background: `linear-gradient(145deg, ${trainer.gradFrom} 0%, ${trainer.gradTo} 100%)` }}>
            <span style={{ fontSize: 'clamp(100px, 20vw, 180px)', fontWeight: 900, color: 'rgba(255,255,255,.12)', userSelect: 'none' }}>
              {trainer.initial}
            </span>
          </div>
        )}

        <div className="tp-hero-overlay" />

        {/* Back button */}
        <Link to="/#trainers" className="back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          مربیان
        </Link>

        {/* Name + role overlay */}
        <div className="tp-hero-content">
          <div className="tp-tag">
            <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            {trainer.tag}
          </div>
          <h1 className="tp-name">{trainer.name}</h1>
          <p className="tp-role">{trainer.role}</p>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="tp-stats-bar">
        {[
          { val: trainer.exp, lbl: 'سابقه', color: '#EA443C' },
          { val: trainer.sessions, lbl: 'جلسات آموزشی', color: '#3B82F6' },
          { val: trainer.level, lbl: 'سطح تدریس', color: '#22C55E' },
          { val: trainer.cert?.split(' ').slice(-2).join(' ') || '—', lbl: 'گواهینامه', color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} className="tp-stat" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="tp-stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="tp-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem) 5rem' }}>

        {/* Days + cert */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
          {trainer.days.map(d => <span key={d} className="day-chip">{d}</span>)}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#F5F0FF', border: '1px solid #DDD6FE', borderRadius: 999, padding: '7px 16px', fontSize: 12, fontWeight: 700, color: '#7C3AED', marginRight: 'auto' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {trainer.cert}
          </span>
        </div>

        {/* Bio */}
        <div className="tp-section" style={{ marginBottom: 18, animationDelay: '100ms' }}>
          <h2 className="tp-section-title">درباره مربی</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 2, fontWeight: 500, margin: 0 }}>{trainer.bio}</p>
        </div>

        {/* 2-col grid */}
        <div className="tp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>

          {/* Specialties */}
          <div className="tp-section" style={{ animationDelay: '180ms' }}>
            <h2 className="tp-section-title">تخصص‌ها</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {trainer.specialties.map(s => <span key={s} className="spec-tag">{s}</span>)}
            </div>
          </div>

          {/* Achievements */}
          <div className="tp-section" style={{ animationDelay: '240ms' }}>
            <h2 className="tp-section-title">افتخارات</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {trainer.achievements.map((a, i) => (
                <div key={i} className="achieve-row">
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(234,68,60,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 20 20" fill="#EA443C" width="13" height="13">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Classes by this trainer */}
        {trainerClasses.length > 0 && (
          <div className="tp-section" style={{ marginBottom: 18, animationDelay: '300ms' }}>
            <h2 className="tp-section-title">کلاس‌های فعال</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {trainerClasses.map(cls => (
                <div key={cls.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: '#faf8f5', border: '1px solid #f0ebe3' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cls.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#111', marginBottom: 3 }}>{cls.title}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {cls.days.map(d => <span key={d} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(0,0,0,.05)', color: '#666' }}>{d}</span>)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'left', flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: cls.color }}>{cls.startTime}</div>
                    <div style={{ fontSize: 10, color: '#bbb' }}>تا {cls.endTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${trainer.gradFrom}, ${trainer.gradTo})`,
          borderRadius: 24, padding: 'clamp(24px, 4vw, 40px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
          animationDelay: '360ms',
        }}>
          <div>
            <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 900, color: '#fff', marginBottom: 6, fontFamily: 'Vazirmatn' }}>
              آماده شروع با {trainer.name} هستی؟
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', fontWeight: 500, margin: 0, fontFamily: 'Vazirmatn' }}>
              جلسه اول مشاوره رایگانه — همین الان رزرو کن
            </p>
          </div>
          <Link to="/#contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', color: '#111',
            fontFamily: 'Vazirmatn', fontSize: 14, fontWeight: 900,
            padding: '12px 28px', borderRadius: 999,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,.15)',
            transition: 'transform .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            رزرو جلسه
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

      </div>
    </div>
  )
}
