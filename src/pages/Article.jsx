import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RichText from '../components/RichText'
import { useAdmin } from '../data/adminStore.jsx'
import useSeo from '../hooks/useSeo'

const faDate = (iso) => {
  try { return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }) }
  catch { return '' }
}

export default function Article() {
  const { slug } = useParams()
  const { articles = [], ready } = useAdmin()
  const article = articles.find(a => a.slug === slug && a.published)

  useSeo(article ? {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords,
  } : {})

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!article) return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', minHeight: '80vh', direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--t50)', marginBottom: 16 }}>{ready ? 'مقاله پیدا نشد' : 'در حال بارگذاری…'}</p>
          {ready && <Link to="/blog" style={{ color: 'var(--accent)', fontWeight: 700 }}>بازگشت به بلاگ</Link>}
        </div>
      </main>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', direction: 'rtl' }}>
        <article style={{ padding: 'calc(66px + clamp(36px, 5vw, 56px)) clamp(24px, 4vw, 40px) clamp(56px, 7vw, 80px)' }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--t50)', fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              بازگشت به بلاگ
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              {article.category && <span style={{ background: 'rgba(39,94,170,.12)', border: '1px solid rgba(39,94,170,.28)', color: 'var(--accent)', fontSize: 12, fontWeight: 800, padding: '5px 13px', borderRadius: 999 }}>{article.category}</span>}
              <span style={{ fontSize: 13, color: 'var(--t45)' }}>{faDate(article.date)}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1.4, color: 'var(--text)', margin: '0 0 22px' }}>
              {article.title}
            </h1>

            {article.cover && (
              <img src={article.cover} alt={article.title} style={{ width: '100%', borderRadius: 18, marginBottom: 30, border: '1px solid var(--surface-b)' }} />
            )}

            <RichText text={article.content} />

            <div style={{
              marginTop: 48, padding: 'clamp(24px, 4vw, 34px)', borderRadius: 20,
              background: 'var(--surface)', border: '1px solid var(--surface-b)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>آماده‌ای اولین صعودت رو تجربه کنی؟</div>
              <p style={{ fontSize: 14, color: 'var(--t50)', margin: '0 0 20px' }}>جلسه‌ی اول مشاوره در آکادمی داوینو رایگانه</p>
              <Link to="/register" style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: 15, padding: '13px 32px', borderRadius: 12, boxShadow: '0 10px 28px rgba(39,94,170,.34)' }}>ثبت‌نام</Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
