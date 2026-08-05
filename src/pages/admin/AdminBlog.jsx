import { useState } from 'react'
import { useAdmin } from '../../data/adminStore.jsx'

const CSS = `
  .blog-inp { border: 1.5px solid var(--ad-card-b); border-radius: 10px; padding: 10px 14px; font-size: 14px; outline: none; font-family: 'Vazirmatn', sans-serif; transition: border-color .18s, box-shadow .18s; width: 100%; box-sizing: border-box; color: var(--text); background: var(--ad-card); }
  .blog-inp:focus { border-color: #EA443C; box-shadow: 0 0 0 3px rgba(234,68,60,.08); }
  .blog-sec { background: var(--ad-card); border-radius: 16px; border: 1px solid var(--ad-card-b); padding: 24px; margin-bottom: 18px; }
  .blog-lbl { display: block; font-size: 12.5px; font-weight: 700; color: var(--ad-text2); margin-bottom: 7px; }
  .blog-btn { font-family: 'Vazirmatn', sans-serif; font-size: 13.5px; font-weight: 800; border-radius: 10px; padding: 11px 22px; cursor: pointer; border: none; transition: all .15s; }
  .blog-btn-primary { background: #EA443C; color: #fff; }
  .blog-btn-ghost { background: var(--ad-card); color: var(--ad-text2); border: 1.5px solid var(--ad-card-b); }
  .blog-row { display: flex; align-items: center; gap: 14px; background: var(--ad-card); border: 1px solid var(--ad-card-b); border-radius: 13px; padding: 14px 18px; transition: border-color .18s; }
  .blog-row:hover { border-color: rgba(234,68,60,.35); }
  .blog-hint { font-size: 11.5px; color: var(--ad-text3); margin-top: 5px; }
`

const CATEGORIES = ['آموزش', 'بولدرینگ', 'تجهیزات', 'تمرین', 'اخبار', 'عمومی']

const emptyArticle = {
  title: '', slug: '', category: 'آموزش', excerpt: '', cover: '',
  content: '', metaTitle: '', metaDescription: '', keywords: '', published: true,
}

// اسلاگ پیشنهادی از عنوان (فاصله→خط‌تیره، حذف نویسه‌های ناامن URL)
const slugify = (s) => String(s || '').trim().toLowerCase()
  .replace(/[\s_]+/g, '-')
  .replace(/[^\p{L}\p{N}-]/gu, '')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')

const faDate = (iso) => {
  try { return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }) }
  catch { return '' }
}

function Editor({ initial, existingSlugs, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [slugTouched, setSlugTouched] = useState(!!initial.slug)
  const [err, setErr] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const onTitle = (v) => {
    setForm(f => ({ ...f, title: v, slug: slugTouched ? f.slug : slugify(v) }))
  }

  const onCover = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('cover', ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const submit = () => {
    const slug = slugify(form.slug || form.title)
    if (!form.title.trim()) return setErr('عنوان مقاله لازم است')
    if (!slug) return setErr('نشانی (slug) مقاله لازم است')
    if (existingSlugs.includes(slug)) return setErr('این نشانی قبلاً استفاده شده — نشانی یکتا انتخاب کن')
    if (!form.content.trim()) return setErr('متن مقاله لازم است')
    onSave({ ...form, slug })
  }

  return (
    <div>
      <style>{CSS}</style>

      <div className="blog-sec">
        <label className="blog-lbl">عنوان مقاله *</label>
        <input className="blog-inp" value={form.title} onChange={e => onTitle(e.target.value)} placeholder="مثلاً: سنگنوردی چیست؟" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
          <div>
            <label className="blog-lbl">نشانی صفحه (slug) *</label>
            <input className="blog-inp" style={{ direction: 'ltr', textAlign: 'left' }} value={form.slug}
              onChange={e => { setSlugTouched(true); set('slug', e.target.value) }} placeholder="what-is-climbing" />
            <div className="blog-hint">آدرس مقاله: /blog/{slugify(form.slug || form.title) || '...'}</div>
          </div>
          <div>
            <label className="blog-lbl">دسته‌بندی</label>
            <select className="blog-inp" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="blog-lbl">خلاصه (نمایش در فهرست بلاگ)</label>
          <textarea className="blog-inp" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="یک یا دو جمله معرفی کوتاه" />
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="blog-lbl">تصویر شاخص (اختیاری)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {form.cover
              ? <img src={form.cover} alt="" style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--ad-card-b)' }} />
              : <div style={{ width: 120, height: 68, borderRadius: 10, border: '1px dashed var(--ad-card-b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ad-text3)', fontSize: 11 }}>بدون تصویر</div>}
            <label className="blog-btn blog-btn-ghost" style={{ cursor: 'pointer' }}>
              انتخاب تصویر
              <input type="file" accept="image/*" onChange={onCover} style={{ display: 'none' }} />
            </label>
            {form.cover && <button className="blog-btn blog-btn-ghost" onClick={() => set('cover', '')}>حذف تصویر</button>}
          </div>
        </div>
      </div>

      <div className="blog-sec">
        <label className="blog-lbl">متن مقاله *</label>
        <textarea className="blog-inp" style={{ minHeight: 320, lineHeight: 2, resize: 'vertical' }} value={form.content} onChange={e => set('content', e.target.value)}
          placeholder={'برای عنوان از ## و برای زیرعنوان از ### استفاده کن.\nبرای بولت خط را با - شروع کن.\nبرای جداکننده یک خط با --- بگذار.'} />
        <div className="blog-hint">نشانه‌گذاری: «## عنوان» ، «### زیرعنوان» ، «- مورد لیست» ، «---» جداکننده. خط خالی = پاراگراف جدید.</div>
      </div>

      <div className="blog-sec">
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>تنظیمات سئو (SEO)</div>
        <div className="blog-hint" style={{ marginBottom: 16 }}>برای دیده‌شدن بهتر مقاله در گوگل این بخش‌ها را کامل کن.</div>

        <label className="blog-lbl">عنوان سئو (Meta Title)</label>
        <input className="blog-inp" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="اگر خالی بماند از عنوان مقاله استفاده می‌شود" />
        <div className="blog-hint">{(form.metaTitle || form.title).length} نویسه — پیشنهاد: زیر ۶۰ نویسه</div>

        <div style={{ marginTop: 16 }}>
          <label className="blog-lbl">توضیحات سئو (Meta Description)</label>
          <textarea className="blog-inp" rows={2} value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} placeholder="اگر خالی بماند از خلاصه استفاده می‌شود" />
          <div className="blog-hint">{(form.metaDescription || form.excerpt).length} نویسه — پیشنهاد: ۱۲۰ تا ۱۶۰ نویسه</div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="blog-lbl">کلمات کلیدی (با ویرگول جدا کن)</label>
          <input className="blog-inp" value={form.keywords} onChange={e => set('keywords', e.target.value)} placeholder="سنگنوردی, بولدرینگ, آموزش سنگنوردی" />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} style={{ width: 18, height: 18, accentColor: '#EA443C' }} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>منتشر شود (در سایت نمایش داده شود)</span>
        </label>
      </div>

      {err && <div style={{ fontSize: 13, color: '#ef4444', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>{err}</div>}

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="blog-btn blog-btn-primary" onClick={submit}>ذخیره مقاله</button>
        <button className="blog-btn blog-btn-ghost" onClick={onCancel}>انصراف</button>
      </div>
    </div>
  )
}

export default function AdminBlog() {
  const { articles = [], addArticle, updateArticle, deleteArticle } = useAdmin()
  const [editing, setEditing] = useState(null) // null | 'new' | article object

  const startNew = () => setEditing('new')
  const startEdit = (a) => setEditing(a)
  const cancel = () => setEditing(null)

  const save = (data) => {
    if (editing === 'new') addArticle(data)
    else updateArticle(editing.id, data)
    setEditing(null)
  }

  const remove = (a) => {
    if (window.confirm(`مقاله «${a.title}» حذف شود؟`)) deleteArticle(a.id)
  }

  const existingSlugs = articles
    .filter(a => editing === 'new' || a.id !== editing?.id)
    .map(a => a.slug)

  return (
    <div style={{ padding: 'clamp(18px, 3vw, 32px) clamp(20px, 3vw, 40px)', maxWidth: 900 }}>
      <style>{CSS}</style>

      {editing ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>{editing === 'new' ? 'مقاله جدید' : 'ویرایش مقاله'}</h2>
          </div>
          <Editor
            initial={editing === 'new' ? { ...emptyArticle } : { ...emptyArticle, ...editing }}
            existingSlugs={existingSlugs}
            onSave={save}
            onCancel={cancel}
          />
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>مقالات بلاگ</h2>
              <p style={{ fontSize: 12.5, color: 'var(--ad-text3)', marginTop: 4 }}>{articles.length} مقاله</p>
            </div>
            <button className="blog-btn blog-btn-primary" onClick={startNew}>+ مقاله جدید</button>
          </div>

          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--ad-text3)', padding: '50px 0', background: 'var(--ad-card)', border: '1px dashed var(--ad-card-b)', borderRadius: 14 }}>
              هنوز مقاله‌ای ثبت نشده. با «مقاله جدید» شروع کن.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {articles.map(a => (
                <div key={a.id} className="blog-row">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>{a.title}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 9px', borderRadius: 999, background: 'rgba(234,68,60,.12)', color: '#EA443C' }}>{a.category}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 9px', borderRadius: 999, background: a.published ? 'rgba(34,197,94,.14)' : 'var(--ad-rowh)', color: a.published ? '#16a34a' : 'var(--ad-text3)' }}>
                        {a.published ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ad-text3)', direction: 'ltr', textAlign: 'right' }}>/blog/{a.slug} · {faDate(a.date)}</div>
                  </div>
                  <button className="blog-btn blog-btn-ghost" onClick={() => startEdit(a)}>ویرایش</button>
                  <button className="blog-btn blog-btn-ghost" style={{ color: '#ef4444' }} onClick={() => remove(a)}>حذف</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
