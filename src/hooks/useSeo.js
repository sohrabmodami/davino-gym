import { useEffect } from 'react'

// تنظیم عنوان و متا برای سئوی سمت‌کلاینت. هنگام خروج، مقادیر قبلی بازمی‌گردند.
function setMeta(attr, key, value) {
  if (!value) return null
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  let created = false
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
    created = true
  }
  const prev = el.getAttribute('content')
  el.setAttribute('content', value)
  return { el, prev, created }
}

export default function useSeo({ title, description, keywords } = {}) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title

    const restorers = [
      setMeta('name', 'description', description),
      setMeta('name', 'keywords', keywords),
      setMeta('property', 'og:title', title),
      setMeta('property', 'og:description', description),
    ].filter(Boolean)

    return () => {
      document.title = prevTitle
      for (const r of restorers) {
        if (r.created) r.el.remove()
        else if (r.prev != null) r.el.setAttribute('content', r.prev)
      }
    }
  }, [title, description, keywords])
}
