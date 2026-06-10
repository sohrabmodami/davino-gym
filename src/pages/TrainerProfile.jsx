import { useParams, Link } from 'react-router-dom'
import { trainers } from '../data/trainers'
import Logo from '../components/Logo'

const CSS = `
  @keyframes trainer-spin { to { transform: rotate(360deg); } }
  .profile-ring {
    position: absolute; inset: -10px; border-radius: 50%;
    border: 2px dashed rgba(234,68,60,.4);
    animation: trainer-spin 10s linear infinite;
  }
  .profile-arc {
    position: absolute; inset: -10px; border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #EA443C; border-right-color: #EA443C;
    animation: trainer-spin 6s linear infinite reverse;
  }
  .spec-tag {
    background: rgba(234,68,60,.08);
    border: 1px solid rgba(234,68,60,.2);
    color: #b52027;
    font-size: 12px; font-weight: 700;
    padding: 6px 14px; border-radius: 999px;
    font-family: 'Vazirmatn', sans-serif;
  }
  .achieve-item {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px;
    background: #fff;
    border: 1.5px solid #f0e8df;
    border-radius: 12px;
    font-family: 'Vazirmatn', sans-serif;
  }
  .book-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #EA443C; color: #fff;
    font-family: 'Vazirmatn', sans-serif;
    font-size: 15px; font-weight: 900;
    padding: 13px 32px; border-radius: 999px;
    border: none; cursor: pointer;
    box-shadow: 0 6px 20px rgba(234,68,60,.35);
    transition: transform .2s ease, box-shadow .2s ease;
    text-decoration: none;
  }
  .book-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(234,68,60,.45); }
  .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    color: #888; font-size: 14px; font-weight: 600;
    text-decoration: none; font-family: 'Vazirmatn', sans-serif;
    transition: color .2s;
  }
  .back-btn:hover { color: #EA443C; }
  .day-pill-lg {
    background: rgba(234,68,60,.08);
    border: 1px solid rgba(234,68,60,.2);
    color: #b52027; font-size: 13px; font-weight: 700;
    padding: 6px 16px; border-radius: 999px;
    font-family: 'Vazirmatn', sans-serif;
  }
`

const BadgeIcon = () => (
  <svg viewBox="0 0 20 20" fill="#fff" width="16" height="16">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
)

export default function TrainerProfile() {
  const { id } = useParams()
  const trainer = trainers.find(t => t.id === id)

  if (!trainer) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Vazirmatn, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, color: '#888' }}>مربی پیدا نشد</p>
          <Link to="/" style={{ color: '#EA443C', fontWeight: 700, marginTop: 12, display: 'inline-block' }}>بازگشت به خانه</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3F0', fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl' }}>
      <style>{CSS}</style>

      {/* Navbar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E8E3DC',
        padding: '0 2.5rem', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      }}>
        <Link to="/"><Logo size={1.1} /></Link>
        <Link to="/#trainers" className="back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          بازگشت به مربیان
        </Link>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 2rem 100px' }}>

        {/* Hero card */}
        <div className="profile-hero-grid" style={{
          background: '#fff', borderRadius: 24,
          border: '1.5px solid #e8e8e8',
          boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
          padding: '40px 32px',
          marginBottom: 28,
        }}>
          {/* Avatar */}
          <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
            <div className="profile-ring" />
            <div className="profile-arc" />
            <div style={{
              width: 160, height: 160, borderRadius: '50%',
              overflow: 'hidden', border: '5px solid #fff',
              boxShadow: '0 6px 24px rgba(234,68,60,.2)',
              position: 'relative', zIndex: 1,
              background: `linear-gradient(150deg, ${trainer.gradFrom}, ${trainer.gradTo})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 56, fontWeight: 900, color: 'rgba(255,255,255,.18)' }}>{trainer.initial}</span>
            </div>
            <div style={{
              position: 'absolute', bottom: 4, left: 4, zIndex: 2,
              width: 40, height: 40, borderRadius: '50%',
              background: '#EA443C', border: '3px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(234,68,60,.4)',
            }}>
              <BadgeIcon />
            </div>
          </div>

          {/* Info */}
          <div>
            {/* Tag */}
            <div style={{
              display: 'inline-block',
              background: 'rgba(234,68,60,.08)', border: '1px solid rgba(234,68,60,.2)',
              borderRadius: 999, padding: '4px 14px', marginBottom: 12,
              fontSize: 12, fontWeight: 800, color: '#EA443C',
            }}>{trainer.tag}</div>

            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111', marginBottom: 6 }}>{trainer.name}</h1>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#EA443C', marginBottom: 20 }}>{trainer.role}</p>

            {/* Meta row */}
            <div className="profile-meta-row" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
              {[
                { label: 'تجربه', val: trainer.exp },
                { label: 'جلسات', val: trainer.sessions },
                { label: 'سطح', val: trainer.level },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#111' }}>{m.val}</div>
                  <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Cert */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#F9F5FF', border: '1px solid #E9D5FF',
              borderRadius: 10, padding: '8px 16px', marginBottom: 20,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#7C3AED' }}>{trainer.cert}</span>
            </div>

            {/* Days */}
            <div className="profile-days" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {trainer.days.map(d => <span key={d} className="day-pill-lg">{d}</span>)}
            </div>
          </div>
        </div>

        {/* Bio + Specialties + Achievements */}
        <div className="profile-cards-grid">

          {/* Bio */}
          <div className="profile-bio-span" style={{
            background: '#fff', borderRadius: 20, border: '1.5px solid #e8e8e8',
            padding: '28px', gridColumn: '1 / -1',
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: '#111', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#EA443C', borderRadius: 2, display: 'inline-block' }} />
              درباره مربی
            </h2>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 2, fontWeight: 500 }}>{trainer.bio}</p>
          </div>

          {/* Specialties */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8e8e8', padding: '28px 28px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: '#111', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#EA443C', borderRadius: 2, display: 'inline-block' }} />
              تخصص‌ها
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {trainer.specialties.map(s => <span key={s} className="spec-tag">{s}</span>)}
            </div>
          </div>

          {/* Achievements */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8e8e8', padding: '28px 28px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: '#111', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#EA443C', borderRadius: 2, display: 'inline-block' }} />
              افتخارات
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {trainer.achievements.map((a, i) => (
                <div key={i} className="achieve-item">
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(234,68,60,.1)', border: '1px solid rgba(234,68,60,.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg viewBox="0 0 20 20" fill="#EA443C" width="14" height="14">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${trainer.gradFrom}, ${trainer.gradTo})`,
          borderRadius: 20, padding: '36px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
              آماده شروع با {trainer.name} هستی؟
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>
              جلسه اول مشاوره رایگانه — همین الان رزرو کن
            </p>
          </div>
          <Link to="/#contact" className="book-btn">
            رزرو جلسه
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

      </div>
    </div>
  )
}
