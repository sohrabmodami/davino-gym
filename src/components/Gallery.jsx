import { useState } from 'react'

// Simulated climbing gym gallery items with color-coded placeholders
const galleryItems = [
  { id: 1, label: 'دیواره مسابقاتی ۱۵ متر', tag: 'دیواره', color: '#1B2F1E', accent: '#4ADE80', span: 'wide' },
  { id: 2, label: 'بولدرینگ – سطح سخت', tag: 'بولدرینگ', color: '#1E2535', accent: '#60A5FA', span: 'normal' },
  { id: 3, label: 'کلاس مبتدیان', tag: 'آموزش', color: '#2A1A2E', accent: '#C084FC', span: 'normal' },
  { id: 4, label: 'تمرین Lead کلایمینگ', tag: 'Lead', color: '#2A1810', accent: '#EA443C', span: 'normal' },
  { id: 5, label: 'کلاس کودکان', tag: 'کودکان', color: '#1E2A20', accent: '#34D399', span: 'normal' },
  { id: 6, label: 'فضای استراحت', tag: 'فضا', color: '#1F1C2C', accent: '#818CF8', span: 'wide' },
  { id: 7, label: 'مسابقات داخلی', tag: 'مسابقات', color: '#2A1215', accent: '#EA443C', span: 'normal' },
  { id: 8, label: 'تجهیزات ایمنی', tag: 'تجهیزات', color: '#1C2A1C', accent: '#86EFAC', span: 'normal' },
]

const tags = ['همه', 'دیواره', 'بولدرینگ', 'آموزش', 'Lead', 'کودکان', 'مسابقات', 'تجهیزات', 'فضا']

function GalleryCard({ item, onClick }) {
  return (
    <div
      onClick={() => onClick(item)}
      className={item.span === 'wide' ? 'gallery-wide' : ''}
      style={{
        gridColumn: item.span === 'wide' ? 'span 2' : 'span 1',
        borderRadius: '18px', overflow: 'hidden',
        background: item.color,
        aspectRatio: item.span === 'wide' ? '16/7' : '4/3',
        position: 'relative', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.25), 0 0 0 2px ${item.accent}50`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Simulated climbing texture */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {[...Array(5)].map((_, r) =>
          [...Array(7)].map((_, c) => (
            <circle key={`${r}-${c}`} cx={30 + c * 55} cy={30 + r * 55} r="10" fill={item.accent}/>
          ))
        )}
      </svg>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${item.accent}15 0%, transparent 50%), linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)`,
      }} />

      {/* Center icon */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: `${item.accent}20`, border: `2px solid ${item.accent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      </div>

      {/* Bottom info */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{item.label}</div>
        <div style={{
          background: `${item.accent}25`, border: `1px solid ${item.accent}50`,
          borderRadius: '6px', padding: '3px 10px',
          fontSize: '11px', fontWeight: 700, color: item.accent,
        }}>{item.tag}</div>
      </div>
    </div>
  )
}

export default function Gallery() {
  const [activeTag, setActiveTag] = useState('همه')
  const [lightbox, setLightbox] = useState(null)

  const filtered = activeTag === 'همه' ? galleryItems : galleryItems.filter(g => g.tag === activeTag)

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

          {/* Filter tags */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={{
                padding: '7px 18px', borderRadius: '50px', fontSize: '13px', fontWeight: 600,
                background: activeTag === tag ? 'var(--color-primary)' : 'rgba(234,68,60,0.06)',
                color: activeTag === tag ? '#fff' : 'var(--color-primary)',
                border: activeTag === tag ? 'none' : '1.5px solid rgba(234,68,60,0.2)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style grid */}
        <div className="gallery-grid">
          {filtered.map(item => (
            <GalleryCard key={item.id} item={item} onClick={setLightbox} />
          ))}
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '40px',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: lightbox.color, borderRadius: '24px',
                width: '100%', maxWidth: '700px', aspectRatio: '16/9',
                position: 'relative', overflow: 'hidden',
                border: `2px solid ${lightbox.accent}40`,
                boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px ${lightbox.accent}20`,
              }}
            >
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '16px',
              }}>
                <div style={{ fontSize: '48px', color: lightbox.accent, opacity: 0.4 }}>📸</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{lightbox.label}</div>
                <div style={{
                  background: `${lightbox.accent}20`, border: `1px solid ${lightbox.accent}40`,
                  borderRadius: '8px', padding: '6px 16px',
                  fontSize: '13px', fontWeight: 700, color: lightbox.accent,
                }}>{lightbox.tag}</div>
              </div>
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute', top: '16px', left: '16px',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >✕</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
