import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useAdmin } from '../data/adminStore.jsx'
import Navbar from '../components/Navbar'

const CSS = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes spin-slow{ to{transform:rotate(360deg)} }

  .tp-hero {
    position: relative;
    width: 100%;
    min-height: 92vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  /* photo case */
  .tp-photo {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; object-position: center top;
  }
  .tp-photo-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,.05) 0%,
      rgba(0,0,0,.1)  35%,
      rgba(0,0,0,.65) 70%,
      rgba(0,0,0,.88) 100%
    );
  }

  /* no-photo case */
  .tp-pattern-bg {
    position: absolute; inset: 0;
  }
  .tp-avatar-wrap {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    padding-bottom: 12vh;
    animation: fadeIn .8s ease;
  }
  .tp-avatar-ring {
    position: absolute; inset: -18px; border-radius: 50%;
    border: 1.5px dashed rgba(255,255,255,.2);
    animation: spin-slow 18s linear infinite;
  }
  .tp-avatar-ring2 {
    position: absolute; inset: -36px; border-radius: 50%;
    border: 1px dashed rgba(255,255,255,.1);
    animation: spin-slow 28s linear infinite reverse;
  }

  .tp-hero-bottom {
    position: relative; z-index: 2;
    padding: 0 clamp(1.5rem, 6vw, 6rem) clamp(2.5rem, 5vw, 4.5rem);
    animation: fadeUp .7s .1s ease both;
  }

  .tp-tag {
    display: inline-flex; align-items: center; gap: 7px;
    background: #EA443C; color: #fff;
    font-size: 11px; font-weight: 800; letter-spacing: .5px;
    padding: 5px 14px; border-radius: 999px;
    margin-bottom: 16px; font-family: 'Vazirmatn', sans-serif;
    box-shadow: 0 4px 16px rgba(234,68,60,.4);
  }
  .tp-name {
    font-size: clamp(2.2rem, 5.5vw, 3.8rem);
    font-weight: 900; color: #fff; line-height: 1.05;
    margin: 0 0 10px; font-family: 'Vazirmatn', sans-serif;
    text-shadow: 0 2px 20px rgba(0,0,0,.3);
  }
  .tp-role {
    font-size: clamp(14px, 1.8vw, 17px);
    color: rgba(255,255,255,.6); font-weight: 600;
    font-family: 'Vazirmatn', sans-serif; margin: 0;
  }

  /* back */
  .tp-back {
    position: absolute;
    top: clamp(76px,9vw,96px); right: clamp(1.5rem,6vw,6rem);
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,.12); backdrop-filter: blur(14px);
    color: rgba(255,255,255,.9); font-size: 12px; font-weight: 800;
    padding: 8px 18px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,.2); text-decoration: none;
    font-family: 'Vazirmatn', sans-serif;
    transition: background .2s; z-index: 3;
  }
  .tp-back:hover { background: rgba(255,255,255,.22); }

  /* stats */
  .tp-stats {
    display: grid; grid-template-columns: repeat(4,1fr);
    background: #fff;
  }
  .tp-stat {
    padding: 24px 20px; text-align: center;
    border-left: 1px solid #f0ebe3;
    animation: fadeUp .5s ease both;
    position: relative;
  }
  .tp-stat:last-child { border-left: none; }
  .tp-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 10px;
  }
  .tp-stat-val {
    font-size: clamp(17px, 2vw, 22px); font-weight: 900;
    color: #111; font-family: 'Vazirmatn', sans-serif; line-height: 1.1;
  }
  .tp-stat-lbl {
    font-size: 11px; color: #bbb; font-weight: 700;
    font-family: 'Vazirmatn', sans-serif; margin-top: 4px;
  }

  /* cards */
  .tp-card {
    background: #fff; border-radius: 20px;
    border: 1px solid #ede8e0;
    padding: clamp(20px,3.5vw,30px);
    animation: fadeUp .5s ease both;
  }
  .tp-card-title {
    font-size: 14px; font-weight: 900; color: #111;
    margin: 0 0 20px; display: flex; align-items: center; gap: 10px;
    font-family: 'Vazirmatn', sans-serif;
  }
  .tp-card-title-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #EA443C; flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(234,68,60,.15);
  }

  .spec-tag {
    background: rgba(234,68,60,.06); border: 1px solid rgba(234,68,60,.15);
    color: #c0392b; font-size: 12px; font-weight: 700;
    padding: 6px 14px; border-radius: 999px; font-family: 'Vazirmatn', sans-serif;
  }
  .achieve-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: 12px;
    background: #faf8f5;
  }
  .day-chip {
    background: rgba(0,0,0,.05); color: #444;
    font-size: 13px; font-weight: 800;
    padding: 7px 18px; border-radius: 999px;
    font-family: 'Vazirmatn', sans-serif; border: 1px solid rgba(0,0,0,.08);
  }

  @media (max-width: 640px) {
    .tp-stats { grid-template-columns: repeat(2,1fr); }
    .tp-stat:nth-child(2) { border-left: none; }
    .tp-stat:nth-child(3),
    .tp-stat:nth-child(4) { border-top: 1px solid #f0ebe3; }
    .tp-grid-2 { grid-template-columns: 1fr !important; }
  }
`

/* Geometric climbing-wall dots pattern as SVG */
function PatternBg({ color1, color2 }) {
  return (
    <div className="tp-pattern-bg" style={{ background: `linear-gradient(145deg, ${color1} 0%, ${color2} 100%)` }}>
      <svg width="100%" height="100%" style={{ position:'absolute',inset:0,opacity:.08 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2.5" fill="#fff"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>
      {/* diagonal lines */}
      <svg width="100%" height="100%" style={{ position:'absolute',inset:0,opacity:.04 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="lines" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="60" stroke="#fff" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lines)"/>
      </svg>
    </div>
  )
}

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

  const trainerClasses = classes.filter(c => c.active && c.trainerName === trainer.name)
  const accentColor = trainer.gradFrom || '#EA443C'

  const stats = [
    { val: trainer.exp,      lbl: 'سابقه تدریس',   color: '#EA443C', bg: 'rgba(234,68,60,.08)',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#EA443C" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { val: trainer.sessions, lbl: 'جلسات آموزشی',  color: '#3B82F6', bg: 'rgba(59,130,246,.08)',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { val: trainer.level,    lbl: 'سطح تدریس',     color: '#10B981', bg: 'rgba(16,185,129,.08)',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
    { val: trainer.cert?.split(' ').slice(-2).join(' '), lbl: 'گواهینامه', color: '#8B5CF6', bg: 'rgba(139,92,246,.08)',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f4f2ef', fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl' }}>
      <style>{CSS}</style>
      <Navbar />

      {/* ── HERO ── */}
      <div className="tp-hero">
        {trainer.photo ? (
          <>
            <img className="tp-photo" src={trainer.photo} alt={trainer.name} />
            <div className="tp-photo-overlay" />
          </>
        ) : (
          <>
            <PatternBg color1={trainer.gradFrom} color2={trainer.gradTo} />
            {/* Floating avatar */}
            <div className="tp-avatar-wrap">
              <div style={{ position: 'relative', width: 180, height: 180 }}>
                <div className="tp-avatar-ring" />
                <div className="tp-avatar-ring2" />
                <div style={{
                  width: 180, height: 180, borderRadius: '50%',
                  background: 'rgba(255,255,255,.1)',
                  border: '2px solid rgba(255,255,255,.25)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', zIndex: 1,
                  boxShadow: '0 20px 60px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.2)',
                  animation: 'float 5s ease-in-out infinite',
                }}>
                  <span style={{ fontSize: 72, fontWeight: 900, color: 'rgba(255,255,255,.9)', fontFamily: 'Vazirmatn' }}>
                    {trainer.initial}
                  </span>
                </div>
              </div>
            </div>
            {/* dark fade at bottom */}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,.7) 80%, rgba(0,0,0,.88) 100%)' }} />
          </>
        )}

        <Link to="/#trainers" className="tp-back">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          مربیان
        </Link>

        <div className="tp-hero-bottom">
          <div className="tp-tag">
            <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            {trainer.tag}
          </div>
          <h1 className="tp-name">{trainer.name}</h1>
          <p className="tp-role">{trainer.role}</p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="tp-stats" style={{ borderBottom: '1px solid #ede8e0' }}>
        {stats.map((s, i) => (
          <div key={i} className="tp-stat" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="tp-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="tp-stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="tp-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: 'clamp(1.5rem,4vw,3rem) clamp(1rem,3vw,2rem) 5rem', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Days + cert */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {trainer.days.map(d => <span key={d} className="day-chip">{d}</span>)}
          <span style={{
            marginRight:'auto', display:'inline-flex', alignItems:'center', gap:7,
            background:'#F5F0FF', border:'1px solid #DDD6FE',
            borderRadius:999, padding:'7px 16px',
            fontSize:12, fontWeight:700, color:'#7C3AED', fontFamily:'Vazirmatn',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {trainer.cert}
          </span>
        </div>

        {/* Bio */}
        <div className="tp-card" style={{ animationDelay:'80ms' }}>
          <h2 className="tp-card-title"><span className="tp-card-title-dot"/>درباره مربی</h2>
          {/* Accent left border paragraph */}
          <p style={{
            fontSize: 15, color: '#444', lineHeight: 2, fontWeight: 500, margin: 0,
            borderRight: `3px solid ${accentColor}22`, paddingRight: 16,
          }}>{trainer.bio}</p>
        </div>

        {/* 2-col */}
        <div className="tp-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

          {/* Specialties */}
          <div className="tp-card" style={{ animationDelay:'160ms' }}>
            <h2 className="tp-card-title"><span className="tp-card-title-dot"/>تخصص‌ها</h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {trainer.specialties.map(s => <span key={s} className="spec-tag">{s}</span>)}
            </div>
          </div>

          {/* Achievements */}
          <div className="tp-card" style={{ animationDelay:'220ms' }}>
            <h2 className="tp-card-title"><span className="tp-card-title-dot"/>افتخارات</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {trainer.achievements.map((a, i) => (
                <div key={i} className="achieve-row">
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(234,68,60,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg viewBox="0 0 20 20" fill="#EA443C" width="12" height="12">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:'#333' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Classes */}
        {trainerClasses.length > 0 && (
          <div className="tp-card" style={{ animationDelay:'300ms' }}>
            <h2 className="tp-card-title"><span className="tp-card-title-dot"/>کلاس‌های فعال</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {trainerClasses.map(cls => (
                <div key={cls.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:14, border:`1px solid ${cls.color}22`, background:`${cls.color}06` }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:cls.color, flexShrink:0, boxShadow:`0 0 0 3px ${cls.color}22` }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'#111', marginBottom:4 }}>{cls.title}</div>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {cls.days.map(d => <span key={d} style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:999, background:'rgba(0,0,0,.06)', color:'#666' }}>{d}</span>)}
                    </div>
                  </div>
                  <div style={{ textAlign:'left', flexShrink:0 }}>
                    <div style={{ fontSize:15, fontWeight:900, color:cls.color }}>{cls.startTime}</div>
                    <div style={{ fontSize:10, color:'#bbb', marginTop:1 }}>تا {cls.endTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{
          position:'relative', borderRadius:24, overflow:'hidden',
          background:`linear-gradient(135deg, ${trainer.gradFrom} 0%, ${trainer.gradTo} 100%)`,
          padding:'clamp(28px,4vw,44px)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexWrap:'wrap', gap:20, animationDelay:'380ms',
        }}>
          {/* bg dots */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.07, pointerEvents:'none' }} xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="ctadots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="1.5" fill="#fff"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#ctadots)"/>
          </svg>
          <div style={{ position:'relative', zIndex:1 }}>
            <h3 style={{ fontSize:'clamp(16px,2.5vw,21px)', fontWeight:900, color:'#fff', marginBottom:8, fontFamily:'Vazirmatn' }}>
              آماده شروع با {trainer.name} هستی؟
            </h3>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.6)', fontWeight:500, margin:0, fontFamily:'Vazirmatn' }}>
              جلسه اول مشاوره رایگانه — همین الان رزرو کن
            </p>
          </div>
          <Link to="/#contact" style={{
            position:'relative', zIndex:1,
            display:'inline-flex', alignItems:'center', gap:9,
            background:'#fff', color:'#111',
            fontFamily:'Vazirmatn', fontSize:14, fontWeight:900,
            padding:'13px 30px', borderRadius:999, textDecoration:'none',
            boxShadow:'0 8px 24px rgba(0,0,0,.2)',
            transition:'transform .2s, box-shadow .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,.28)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.2)' }}
          >
            رزرو جلسه
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

      </div>
    </div>
  )
}
