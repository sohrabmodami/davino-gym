import { useState } from 'react'
import { useAdmin } from '../data/adminStore.jsx'

/* سایه‌ی کمی تیره‌تر از رنگ پایه‌ی کارت برای راه‌راهِ دوسایه (مطابق دیزاین) */
function darken(hex, amt = 9) {
  if (!hex || hex[0] !== '#' || hex.length < 7) return '#15152a'
  const clamp = v => Math.max(0, Math.min(255, v))
  const r = clamp(parseInt(hex.slice(1, 3), 16) - amt)
  const g = clamp(parseInt(hex.slice(3, 5), 16) - amt)
  const b = clamp(parseInt(hex.slice(5, 7), 16) - amt)
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

function GalleryCard({ item, onClick }) {
  const hasPhoto = !!item.photo
  const accent = item.accent || '#EA443C'
  const base = item.color || '#1a1a2e'
  const shade = darken(base)

  return (
    <div
      onClick={() => onClick(item)}
      className={item.span === 'wide' ? 'gallery-wide' : undefined}
      style={{
        borderRadius: '18px', overflow: 'hidden',
        background: hasPhoto
          ? '#111'
          : `repeating-linear-gradient(135deg, ${base}, ${base} 14px, ${shade} 14px, ${shade} 28px)`,
        position: 'relative', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.35)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {hasPhoto && (
        <img src={item.photo} alt={item.title || item.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)',
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{item.title || item.label}</div>
        <div style={{
          background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
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
    <section id="gallery" style={{
      padding: 'clamp(70px, 8vw, 100px) clamp(24px, 4vw, 40px)',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--line)',
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 800, color: 'var(--accent)',
            letterSpacing: '.14em', background: 'rgba(234,68,60,.1)',
            border: '1px solid rgba(234,68,60,.22)', borderRadius: 999,
            padding: '6px 15px', marginBottom: 16,
          }}>گالری</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, marginBottom: '14px', letterSpacing: '-0.5px' }}>
            داوینو در یک نگاه
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-foreground-muted)', maxWidth: '420px', margin: '0 auto 32px', lineHeight: 1.75 }}>
            فضاها، دیواره‌ها و لحظه‌های ناب باشگاه
          </p>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={{
                padding: '7px 18px', borderRadius: 999, fontSize: '13px',
                fontWeight: activeTag === tag ? 700 : 600,
                background: activeTag === tag ? 'var(--accent)' : 'var(--surface)',
                color: activeTag === tag ? '#fff' : 'var(--t60)',
                border: activeTag === tag ? '1px solid var(--accent)' : '1px solid var(--surface-b)',
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
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--t45)' }}>
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
