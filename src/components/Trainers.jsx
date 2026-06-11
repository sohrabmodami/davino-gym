import { Link } from 'react-router-dom'
import { useAdmin } from '../data/adminStore.jsx'

const CSS = `
  @keyframes trainer-spin { to { transform: rotate(360deg); } }

  .trainer-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #e8e8e8;
    padding: 32px 24px 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition:
      transform .32s cubic-bezier(.22,.61,.36,1),
      box-shadow .32s cubic-bezier(.22,.61,.36,1),
      border-color .28s ease;
    text-decoration: none;
    color: inherit;
  }
  .trainer-card:hover {
    transform: translateY(-7px);
    box-shadow: 0 6px 20px rgba(17,17,17,.07), 0 20px 50px rgba(17,17,17,.11);
    border-color: rgba(234,68,60,.3);
  }

  .avatar-ring {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px dashed rgba(234,68,60,.35);
    transition: border-color .3s ease;
  }
  .trainer-card:hover .avatar-ring {
    border-color: rgba(234,68,60,.7);
    animation: trainer-spin 8s linear infinite;
  }

  .avatar-arc {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2.5px solid transparent;
    border-top-color: #EA443C;
    border-right-color: #EA443C;
    transition: transform .32s ease;
  }
  .trainer-card:hover .avatar-arc { transform: rotate(45deg); }

  .avatar-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,.12);
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow .3s ease;
  }
  .trainer-card:hover .avatar-circle { box-shadow: 0 6px 24px rgba(234,68,60,.22); }

  .avatar-badge {
    position: absolute;
    bottom: 2px;
    left: 2px;
    z-index: 2;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #EA443C;
    border: 3px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(234,68,60,.4);
    transition: transform .25s ease;
  }
  .trainer-card:hover .avatar-badge { transform: scale(1.15); }

  .card-divider {
    width: 36px; height: 2px;
    background: linear-gradient(90deg, rgba(234,68,60,.15), #EA443C, rgba(234,68,60,.15));
    border-radius: 999px;
    margin-bottom: 18px;
    transition: width .3s ease;
  }
  .trainer-card:hover .card-divider { width: 60px; }

  .day-pill {
    background: rgba(234,68,60,.08);
    border: 1px solid rgba(234,68,60,.18);
    color: #b52027;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 999px;
    transition: background .2s ease;
    font-family: 'Vazirmatn', sans-serif;
  }
  .trainer-card:hover .day-pill { background: rgba(234,68,60,.14); }

  .card-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #111;
    color: #fff;
    font-family: 'Vazirmatn', sans-serif;
    font-size: 12.5px;
    font-weight: 900;
    padding: 9px 22px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    margin-top: auto;
    transition: background .22s ease, transform .22s ease;
    text-decoration: none;
  }
  .trainer-card:hover .card-btn { background: #EA443C; transform: translateY(-1px); }
`

/* همه مربیان آیکون یکسان — شیلد تیک مثل صبا کرباسیان */
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

export default function Trainers() {
  const { trainers } = useAdmin()
  return (
    <section id="trainers" style={{ padding: '100px 2.5rem', background: 'var(--color-bg)' }}>
      <style>{CSS}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: '#EA443C', fontSize: '11px', fontWeight: 900,
            letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '14px',
          }}>
            <span style={{ width: 28, height: 1.5, background: '#EA443C', borderRadius: 999, display: 'inline-block' }} />
            Coaching Team
            <span style={{ width: 28, height: 1.5, background: '#EA443C', borderRadius: 999, display: 'inline-block' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: '#111' }}>
            مربیان آکادمی داوینو
          </h2>
          <p style={{ marginTop: 10, color: '#888', fontSize: 15, fontWeight: 500 }}>
            با بهترین مربیان سنگ‌نوردی آشنا شوید
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '22px',
        }}>
          {trainers.map((t) => (
            <Link key={t.id} to={`/trainer/${t.id}`} className="trainer-card">
              <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 20, flexShrink: 0 }}>
                <div className="avatar-ring" />
                <div className="avatar-arc" />
                <div className="avatar-circle">
                  {t.photo
                    ? <img src={t.photo} alt={t.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: `linear-gradient(150deg, ${t.gradFrom}, ${t.gradTo})`,
                      }}>
                        <span style={{ fontSize: 42, fontWeight: 900, color: 'rgba(255,255,255,.18)', lineHeight: 1 }}>{t.initial}</span>
                      </div>
                  }
                </div>
                <div className="avatar-badge"><BadgeIcon /></div>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 900, color: '#111', marginBottom: 4, lineHeight: 1.3 }}>{t.name}</h3>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: '#EA443C', marginBottom: 18 }}>{t.role}</p>

              <div className="card-divider" />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 22 }}>
                {t.days.map(d => <span key={d} className="day-pill">{d}</span>)}
              </div>

              <span className="card-btn">مشاهده رزومه <ChevronLeft /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
