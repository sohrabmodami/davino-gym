import { useState, useEffect, useRef, useCallback } from 'react'
import { useAdmin } from '../data/adminStore.jsx'

/* تعداد ستون‌های grid بر اساس بریک‌پوینت‌های فعلی سایت (900 / 560) */
function useGalleryColumns() {
  const getCols = () => {
    if (typeof window === 'undefined') return 4
    if (window.innerWidth <= 560) return 2
    if (window.innerWidth <= 900) return 3
    return 4
  }
  const [cols, setCols] = useState(getCols)
  useEffect(() => {
    const onResize = () => setCols(getCols())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return cols
}

function Lightbox({ items, index, onClose, onNav }) {
  const touchStart = useRef(null)
  const item = items[index]

  const goPrev = useCallback(() => onNav((index - 1 + items.length) % items.length), [index, items.length, onNav])
  const goNext = useCallback(() => onNav((index + 1) % items.length), [index, items.length, onNav])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goNext()
      else if (e.key === 'ArrowRight') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext, onClose])

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext()
      else goPrev()
    }
    touchStart.current = null
  }

  if (!item) return null

  return (
    <div
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 40px)',
      }}
    >
      <img
        src={item.photo}
        alt=""
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '92vw', maxHeight: '85vh', objectFit: 'contain',
          borderRadius: 12, boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}
      />

      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, left: 20,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 18,
        }}
      >✕</button>

      {items.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); goPrev() }}
            aria-label="تصویر قبلی"
            style={{
              position: 'absolute', top: '50%', right: 'clamp(10px, 3vw, 28px)', transform: 'translateY(-50%)',
              width: 46, height: 46, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 22,
            }}
          >›</button>
          <button
            onClick={e => { e.stopPropagation(); goNext() }}
            aria-label="تصویر بعدی"
            style={{
              position: 'absolute', top: '50%', left: 'clamp(10px, 3vw, 28px)', transform: 'translateY(-50%)',
              width: 46, height: 46, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 22,
            }}
          >‹</button>
        </>
      )}

      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
        background: 'rgba(0,0,0,0.4)', padding: '5px 14px', borderRadius: 999,
        direction: 'ltr',
      }}>{index + 1} / {items.length}</div>
    </div>
  )
}

export default function Gallery() {
  const { gallery } = useAdmin()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const cols = useGalleryColumns()

  const visibleLimit = cols * 3
  const visible = showAll ? gallery : gallery.slice(0, visibleLimit)
  const hasMore = !showAll && gallery.length > visibleLimit

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
          <p style={{ fontSize: '16px', color: 'var(--color-foreground-muted)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.75 }}>
            فضاها، دیواره‌ها و لحظه‌های ناب باشگاه
          </p>
        </div>

        {gallery.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--t45)' }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>گالری هنوز تصویری ندارد</p>
          </div>
        ) : (
          <>
            <div className="gallery-masonry">
              {visible.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(i)}
                  style={{
                    borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.015)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <img src={item.photo} alt="" style={{ width: '100%', display: 'block' }} loading="lazy" />
                </div>
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 36 }}>
                <button
                  onClick={() => setShowAll(true)}
                  style={{
                    background: 'var(--surface)', color: 'var(--text)',
                    border: '1px solid var(--surface-b)', borderRadius: 999,
                    padding: '13px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--surface-b)'; e.currentTarget.style.color = 'var(--text)' }}
                >
                  دیدن همه عکس‌ها
                </button>
              </div>
            )}
          </>
        )}

        {lightboxIndex !== null && (
          <Lightbox
            items={visible}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={setLightboxIndex}
          />
        )}
      </div>
    </section>
  )
}
