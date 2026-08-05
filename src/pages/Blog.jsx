import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAdmin } from '../data/adminStore.jsx'
import useSeo from '../hooks/useSeo'

const faDate = (iso) => {
  try { return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }) }
  catch { return '' }
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
)

export default function Blog() {
  const { articles = [] } = useAdmin()
  const published = useMemo(() => articles.filter(a => a.published), [articles])

  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('همه')

  const categories = useMemo(() => {
    const set = new Set(published.map(a => a.category).filter(Boolean))
    return ['همه', ...set]
  }, [published])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return published.filter(a => {
      const okCat = cat === 'همه' || a.category === cat
      const okQ = !q || `${a.title} ${a.excerpt} ${a.category} ${a.keywords || ''}`.toLowerCase().includes(q)
      return okCat && okQ
    })
  }, [published, query, cat])

  useSeo({
    title: 'بلاگ آکادمی سنگنوردی داوینو | مقالات آموزش سنگنوردی و بولدرینگ',
    description: 'مقالات تخصصی سنگنوردی، بولدرینگ، آموزش و تجهیزات در بلاگ آکادمی سنگنوردی داوینو.',
    keywords: 'بلاگ سنگنوردی, مقاله سنگنوردی, آموزش بولدرینگ, آکادمی داوینو',
  })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', direction: 'rtl' }}>

        {/* ── هیرو بلاگ ── */}
        <section className="blog-hero">
          <div className="blog-hero-glow" />
          <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-block', fontSize: 11, fontWeight: 800, color: 'var(--accent)',
              letterSpacing: '.14em', background: 'rgba(234,68,60,.1)',
              border: '1px solid rgba(234,68,60,.22)', borderRadius: 999,
              padding: '6px 15px', marginBottom: 18,
            }}>بلاگ داوینو</div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-.02em', margin: '0 0 16px', color: 'var(--text)', lineHeight: 1.25 }}>
              مقالات و مطالب آموزشی سنگنوردی
            </h1>
            <p style={{ fontSize: 'clamp(15px, 2.2vw, 17px)', color: 'var(--t50)', maxWidth: 560, margin: '0 auto 30px', lineHeight: 1.9 }}>
              هرآنچه باید درباره سنگنوردی، بولدرینگ، تمرین و تجهیزات بدانی — به قلم تیم داوینو
            </p>

            {/* سرچ */}
            <div className="blog-search">
              <SearchIcon />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="جستجو در مقاله‌ها…"
                aria-label="جستجو در مقاله‌ها"
              />
              {query && <button className="blog-search-clear" onClick={() => setQuery('')} aria-label="پاک کردن جستجو">✕</button>}
            </div>
          </div>
        </section>

        {/* ── محتوا ── */}
        <section style={{ padding: '0 clamp(24px, 4vw, 40px) clamp(56px, 7vw, 88px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            {/* چیپ‌های دسته‌بندی */}
            {categories.length > 1 && (
              <div className="blog-cats">
                {categories.map(c => (
                  <button
                    key={c}
                    className={`blog-cat${cat === c ? ' active' : ''}`}
                    onClick={() => setCat(c)}
                  >{c}</button>
                ))}
              </div>
            )}

            <div style={{ fontSize: 13, color: 'var(--t45)', marginBottom: 20 }}>
              {filtered.length} مقاله{query && ` برای «${query}»`}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--t45)', padding: '60px 0' }}>
                {published.length === 0 ? 'هنوز مقاله‌ای منتشر نشده است.' : 'مقاله‌ای با این فیلتر پیدا نشد.'}
              </div>
            ) : (
              <>
                {/* مقاله شاخص — کارت پهن */}
                {(() => {
                  const f = filtered[0]
                  return (
                    <Link to={`/blog/${f.slug}`} className="blog-featured">
                      <div className="blog-featured-cover">
                        {f.cover
                          ? <img src={f.cover} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div className="blog-card-ph"><span>DAVINO</span></div>}
                        {f.category && <span className="blog-card-cat">{f.category}</span>}
                      </div>
                      <div className="blog-featured-body">
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '.12em', marginBottom: 12 }}>مقاله ویژه</span>
                        <h2 style={{ fontSize: 'clamp(1.3rem, 2.6vw, 1.9rem)', fontWeight: 900, color: 'var(--text)', lineHeight: 1.5, margin: '0 0 14px', letterSpacing: '-.01em' }}>{f.title}</h2>
                        <p style={{ fontSize: 15, color: 'var(--t55)', lineHeight: 2, margin: '0 0 22px' }}>{f.excerpt}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 800, padding: '11px 24px', borderRadius: 12 }}>مطالعه مقاله ←</span>
                          <span style={{ fontSize: 12.5, color: 'var(--t45)' }}>{faDate(f.date)}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })()}

                {/* بقیه مقاله‌ها */}
                {filtered.length > 1 && (
                  <div className="blog-grid" style={{ marginTop: 24 }}>
                    {filtered.slice(1).map(a => (
                      <Link key={a.id} to={`/blog/${a.slug}`} className="blog-card">
                        <div className="blog-card-cover">
                          {a.cover
                            ? <img src={a.cover} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div className="blog-card-ph"><span>DAVINO</span></div>}
                          {a.category && <span className="blog-card-cat">{a.category}</span>}
                        </div>
                        <div style={{ padding: '18px 20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', lineHeight: 1.6, margin: '0 0 10px' }}>{a.title}</h2>
                          <p style={{ fontSize: 13.5, color: 'var(--t50)', lineHeight: 1.9, margin: '0 0 16px', flex: 1 }}>{a.excerpt}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                            <span style={{ fontSize: 12, color: 'var(--t45)' }}>{faDate(a.date)}</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>ادامه مطلب ←</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .blog-hero {
          position: relative; overflow: hidden;
          padding: calc(66px + clamp(44px, 7vw, 76px)) clamp(24px, 4vw, 40px) clamp(36px, 5vw, 52px);
          background: var(--bg2); border-bottom: 1px solid var(--line);
        }
        .blog-hero-glow {
          position: absolute; top: -140px; left: 50%; transform: translateX(-50%);
          width: 620px; height: 420px; pointer-events: none;
          background: radial-gradient(circle, rgba(234,68,60,.14), transparent 65%);
          filter: blur(20px);
        }
        .blog-search {
          display: flex; align-items: center; gap: 10px;
          max-width: 480px; margin: 0 auto;
          background: var(--surface); border: 1.5px solid var(--surface-b);
          border-radius: 14px; padding: 4px 14px;
          color: var(--t45); transition: border-color .2s, box-shadow .2s;
        }
        .blog-search:focus-within { border-color: rgba(234,68,60,.55); box-shadow: 0 0 0 3px rgba(234,68,60,.08); }
        .blog-search input {
          flex: 1; background: none; border: none; outline: none;
          padding: 13px 0; font-size: 15px; color: var(--text);
          font-family: var(--font-body); direction: rtl;
        }
        .blog-search-clear { background: none; border: none; cursor: pointer; color: var(--t45); font-size: 15px; padding: 6px; flex-shrink: 0; }
        .blog-search-clear:hover { color: var(--accent); }

        .blog-cats { display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: 20px; }
        .blog-cat {
          font-family: var(--font-body); font-size: 13px; font-weight: 700;
          border: 1.5px solid var(--surface-b); background: var(--surface);
          color: var(--t60); cursor: pointer; padding: 8px 18px; border-radius: 999px;
          transition: all .18s; white-space: nowrap;
        }
        .blog-cat:hover { border-color: var(--accent); color: var(--accent); }
        .blog-cat.active { background: var(--accent); border-color: var(--accent); color: #fff; }

        .blog-featured {
          display: flex; text-decoration: none; overflow: hidden;
          background: var(--surface); border: 1px solid var(--surface-b);
          border-radius: 22px; transition: transform .2s, border-color .2s, box-shadow .2s;
        }
        .blog-featured:hover { transform: translateY(-4px); border-color: rgba(234,68,60,.4); box-shadow: 0 22px 50px rgba(0,0,0,.16); }
        .blog-featured-cover { position: relative; flex: 1 1 48%; min-height: 300px; overflow: hidden; background: var(--bg2); }
        .blog-featured-body { flex: 1 1 52%; display: flex; flex-direction: column; padding: clamp(24px, 3.5vw, 40px); }
        @media (max-width: 760px) {
          .blog-featured { flex-direction: column; }
          .blog-featured-cover { flex: none; min-height: 0; aspect-ratio: 16/9; }
        }

        .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 22px; }
        .blog-card {
          display: flex; flex-direction: column; text-decoration: none;
          background: var(--surface); border: 1px solid var(--surface-b);
          border-radius: 18px; overflow: hidden; transition: transform .2s, border-color .2s, box-shadow .2s;
        }
        .blog-card:hover { transform: translateY(-4px); border-color: rgba(234,68,60,.4); box-shadow: 0 18px 40px rgba(0,0,0,.14); }
        .blog-card-cover { position: relative; aspect-ratio: 16/9; overflow: hidden; background: var(--bg2); }
        .blog-card-ph {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: repeating-linear-gradient(135deg, #1b1620, #1b1620 14px, #16121b 14px, #16121b 28px);
        }
        .blog-card-ph span { font-family: var(--font-latin); font-size: 13px; letter-spacing: .24em; color: rgba(234,68,60,.7); font-weight: 700; }
        .blog-card-cat {
          position: absolute; top: 12px; right: 12px;
          background: rgba(234,68,60,.92); color: #fff; font-size: 11px; font-weight: 800;
          padding: 5px 12px; border-radius: 999px;
        }
      `}</style>
    </>
  )
}
