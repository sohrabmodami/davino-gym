import { useState } from 'react'
import { useAdmin } from '../data/adminStore.jsx'

function GalleryCard({ item, onClick }) {
  const hasPhoto = !!item.photo
  const accent = item.accent || '#EA443C'

  return (
    <div
      onClick={() => onClick(item)}
      style={{
        gridColumn: item.span === 'wide' ? 'span 2' : 'span 1',
        borderRadius: '18px', overflow: 'hidden',
        background: hasPhoto ? '#111' : (item.color || '#1a1a2e'),
        aspectRatio: item.span === 'wide' ? '16/7' : '4/3',
        position: 'relative', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.25), 0 0 0 2px ${accent}50`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {hasPhoto ? (
        <img src={item.photo} alt={item.title || item.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            {[...Array(5)].map((_, r) =>
              [...Array(7)].map((_, c) => (
                <circle key={`${r}-${c}`} cx={30 + c * 55} cy={30 + r * 55} r="10" fill={accent}/>
              ))
            )}
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: `${accent}20`, border: `2px solid ${accent}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          </div>
        </>
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)`,
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{item.title || item.label}</div>
        <div style={{
          background: `rgba(255,255,255,0.18)`, border: `1px solid rgba(255,255,255,0.3)`,
          borderRadius: '6px', padding: '3px 10px',
          fontSize: '11px', fontWeight: 700, color: '#fff',
          backdropFilter: 'blur(4px)',
        }}>{item.category || item.tag}</div>
      </div>
    </div>
  )
}

export default function Gallery() {
  const { gallery } = useAdmin()
  const [activeTag, setActiveTag] = useState('همه')
  const [lightbox, setLightbox] = useState(null)

  const allTags = ['همه', ...new Set(gallery.map(g => g.category || g.tag).filter(Boolean))]
  const filtered = activeTag === 'همه' ? gallery : gallery.filter(g => (g.category || g.tag) === activeTag)

  return (
    <section id="gallery" style={{ padding: '100px 2.5rem', background: 'var(--color-bg-white)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(234,68,60,0.08)', border: '1px solid rgba(234,68,60,0.2)',
            borderRadius: '50px', padding: '5px 16px', marginBottom: '16px',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>گالری</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, marginBottom: '14px', letterSpacing: '-0.5px' }}>
            داوینو در یک نگاه
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-foreground-muted)', maxWidth: '420px', margin: '0 auto 32px', lineHeight: 1.75 }}>
            فضاها، دیواره‌ها و لحظه‌های ناب باشگاه
          </p>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={{
                padding: '7px 18px', borderRadius: '50px', fontSize: '13px', fontWeight: 600,
                background: activeTag === tag ? 'var(--color-primary)' : 'rgba(234,68,60,0.06)',
                color: activeTag === tag ? '#fff' : 'var(--color-primary)',
                border: activeTag === tag ? 'none' : '1.5px solid rgba(234,68,60,0.2)',
                transition: 'all 0.2s ease', cursor: 'pointer',
              }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="gallery-grid">
          {filtered.map(item => (
            <GalleryCard key={item.id} item={item} onClick={setLightbox} />
          ))}
        </div>

        {gallery.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#bbb' }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>گالری هنوز تصویری ندارد</p>
          </div>
        )}

        {lightbox && (
          <div
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '40px',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: lightbox.photo ? 'transparent' : (lightbox.color || '#1a1a2e'),
                borderRadius: '24px', width: '100%', maxWidth: '800px',
                aspectRatio: '16/9', position: 'relative', overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              }}
            >
              {lightbox.photo
                ? <img src={lightbox.photo} alt={lightbox.title || lightbox.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{lightbox.title || lightbox.label}</div>
                  </div>
                )
              }
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,.7)', padding: '24px 24px 20px' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{lightbox.title || lightbox.label}</div>
                <span style={{ fontSize: 12, background: 'rgba(255,255,255,.18)', color: '#fff', padding: '2px 10px', borderRadius: 999, fontWeight: 600 }}>{lightbox.category || lightbox.tag}</span>
              </div>
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute', top: '16px', left: '16px',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 18,
                }}
              >✕</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
