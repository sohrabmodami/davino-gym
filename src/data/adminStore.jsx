import { createContext, useContext, useState, useEffect } from 'react'
import { trainers as defaultTrainers } from './trainers'
import { articles as defaultArticles } from './articles'

const STORAGE_KEY = 'davino_admin_v2' // v2: گالری از کش حذف شد؛ کش قدیمی (خرابِ فراتر از سقف) دور ریخته می‌شود

const defaultGallery = []

/* ۷ پکیج: ۴ کلاس گروهی (ماتریس بزرگسالان/کودکان × ۴/۸ جلسه) + ۳ تک‌جلسه/آزاد
   kind: 'group' | 'single'
   group → audience ('بزرگسالان'|'کودکان') + sessions (4|8)
   single → sub (زیرعنوان) + icon ('free'|'private'|'fun') */
const defaultPricing = [
  // ── کلاس‌های گروهی ──
  {
    id: 1, kind: 'group', audience: 'بزرگسالان', sessions: 4,
    name: '۴ جلسه در ماه', sub: 'برای شروع و آشنایی',
    price: '۴۸۰,۰۰۰', unit: 'ماهانه', popular: false, color: '#6B7280',
    features: ['۴ جلسه کلاس گروهی', 'دسترسی به دیواره‌های مبتدی', 'رختکن و دوش', 'مشاوره اولیه رایگان'],
    cta: 'انتخاب پکیج',
  },
  {
    id: 2, kind: 'group', audience: 'بزرگسالان', sessions: 8,
    name: '۸ جلسه در ماه', sub: 'برای پیشرفت جدی',
    price: '۸۵۰,۰۰۰', unit: 'ماهانه', popular: true, color: '#EA443C',
    features: ['۸ جلسه کلاس گروهی', 'دسترسی نامحدود به دیواره‌ها', 'برنامه تمرینی اختصاصی', 'تخفیف ۱۵٪ روی سانس آزاد', 'باشگاه جامعه داوینو'],
    cta: 'انتخاب پکیج',
  },
  {
    id: 3, kind: 'group', audience: 'کودکان', sessions: 4,
    name: '۴ جلسه در ماه', sub: 'ویژه ۶ تا ۱۴ سال',
    price: '۴۲۰,۰۰۰', unit: 'ماهانه', popular: false, color: '#6B7280',
    features: ['۴ جلسه کلاس کودکان', 'مربی متخصص آموزش کودک', 'تجهیزات ایمنی ویژه', 'رختکن و دوش'],
    cta: 'انتخاب پکیج',
  },
  {
    id: 4, kind: 'group', audience: 'کودکان', sessions: 8,
    name: '۸ جلسه در ماه', sub: 'ویژه ۶ تا ۱۴ سال',
    price: '۷۵۰,۰۰۰', unit: 'ماهانه', popular: true, color: '#EA443C',
    features: ['۸ جلسه کلاس کودکان', 'مربی متخصص آموزش کودک', 'برنامه رشد مهارتی', 'تخفیف خواهر/برادر', 'گزارش پیشرفت ماهانه'],
    cta: 'انتخاب پکیج',
  },
  // ── تک‌جلسه و دسترسی آزاد ──
  {
    id: 5, kind: 'single', icon: 'free',
    name: 'تمرین آزاد', sub: 'بدون مربی',
    price: '۹۰,۰۰۰', unit: 'هر سانس', popular: false, color: '#22C55E',
    features: ['ورود آزاد به سالن', 'استفاده از همه دیواره‌ها', 'بدون نیاز به رزرو'],
    cta: 'رزرو سانس',
  },
  {
    id: 6, kind: 'single', icon: 'private',
    name: 'تمرین خصوصی', sub: 'تک‌جلسه با مربی',
    price: '۳۵۰,۰۰۰', unit: 'هر جلسه', popular: false, color: '#EA443C',
    features: ['یک جلسه اختصاصی با مربی', 'برنامه‌ریزی شخصی', 'تحلیل تکنیک'],
    cta: 'رزرو جلسه',
  },
  {
    id: 7, kind: 'single', icon: 'fun',
    name: 'سانس تفریحی', sub: 'گروهی و آزاد',
    price: '۱۲۰,۰۰۰', unit: 'هر نفر', popular: false, color: '#A855F7',
    features: ['مناسب گروه‌های دوستانه', 'راهنمای ایمنی همراه', 'تجهیزات رایگان'],
    cta: 'رزرو سانس',
  },
]

/* هر کلاس با trainerId به یک مربی واقعی (data/trainers) وصل است.
   trainerName صرفاً کش برای نمایش است؛ منبع حقیقت trainerId است و نام/عکس/آواتار
   به‌صورت زنده از رکورد مربی خوانده می‌شود. */
const defaultClasses = [
  { id: 1, title: 'سنگنوردی مقدماتی', trainerId: 'saba-karbasian', trainerName: 'صبا کرباسیان', days: ['شنبه', 'سه‌شنبه'], startTime: '16:00', endTime: '17:30', level: 'مبتدی', sessions: 8, capacity: 12, enrolled: 8, price: '۲۵۰,۰۰۰', color: '#22C55E', active: true },
  { id: 2, title: 'بولدرینگ پیشرفته', trainerId: 'arash-kamali', trainerName: 'آرش کمالی', days: ['یکشنبه', 'چهارشنبه'], startTime: '18:00', endTime: '19:30', level: 'پیشرفته', sessions: 8, capacity: 8, enrolled: 7, price: '۳۵۰,۰۰۰', color: '#3B82F6', active: true },
  { id: 3, title: 'لید تکنیک', trainerId: 'kiarash-najafi', trainerName: 'کیارش نجفی', days: ['دوشنبه', 'پنجشنبه'], startTime: '08:00', endTime: '09:30', level: 'متوسط', sessions: 8, capacity: 10, enrolled: 7, price: '۳۲۰,۰۰۰', color: '#F59E0B', active: true },
  { id: 4, title: 'سنگنوردی نوجوانان', trainerId: 'zeinab-farahani', trainerName: 'زینب فراهانی', days: ['دوشنبه', 'پنجشنبه'], startTime: '17:00', endTime: '18:30', level: 'مبتدی', sessions: 8, capacity: 10, enrolled: 6, price: '۲۸۰,۰۰۰', color: '#EA443C', active: true },
  { id: 5, title: 'کلاس کودکان', trainerId: 'zeinab-farahani', trainerName: 'زینب فراهانی', days: ['جمعه'], startTime: '10:00', endTime: '11:30', level: 'مبتدی', sessions: 4, capacity: 10, enrolled: 9, price: '۲۰۰,۰۰۰', color: '#A855F7', active: true },
  { id: 6, title: 'بولدرینگ مقدماتی', trainerId: 'niloofar-heidari', trainerName: 'نیلوفر حیدری', days: ['شنبه', 'چهارشنبه'], startTime: '20:00', endTime: '21:30', level: 'مبتدی', sessions: 8, capacity: 12, enrolled: 5, price: '۲۵۰,۰۰۰', color: '#06B6D4', active: true },
  { id: 7, title: 'مسابقات و تکنیک', trainerId: 'masoud-mozafari', trainerName: 'مسعود مظفری', days: ['پنجشنبه'], startTime: '09:00', endTime: '11:00', level: 'پیشرفته', sessions: 4, capacity: 6, enrolled: 4, price: '۴۵۰,۰۰۰', color: '#10B981', active: true },
]

const defaultSettings = {
  gymName: 'داوینو کلایمینگ',
  address: 'تهران، خیابان ولیعصر، خیابان داوینو، پلاک ۲۴',
  phone: '۰۲۱-۸۸۸۸-۰۰۰۰',
  hours: 'شنبه تا پنجشنبه ۱۰ الی ۲۲ · جمعه‌ها ۱۲:۳۰ الی ۲۲',
  mobile: '',
  instagram: '',
  instagram2: '',
  telegram: '',
  whatsapp: '',
  youtube: '',
  instagramVisible: true,
  instagram2Visible: true,
  telegramVisible: true,
  whatsappVisible: true,
  youtubeVisible: true,
  heroTitle: 'به قله برس،\nداوینو همراهته',
  heroSubtitle: 'از مبتدی تا حرفه‌ای — با مربیان مجرب، دیواره‌های متنوع و فضای امن، مسیر سنگنوردی‌ات رو شروع کن.',
  heroBadge: 'باشگاه سنگنوردی حرفه‌ای تهران',
  heroImage: '',
  heroWallHeight: '۱۵ متر',
  heroRating: '۴.۹ ★',
  heroCardTitle: 'دیواره‌های حرفه‌ای',
  footerDescription: 'از ۱۳۹۴ تاکنون، خانه‌ی سنگنوردان تهران. بزرگ‌ترین باشگاه سنگنوردی سرپوشیده با ۱۸ مسیر و ۱۵ متر ارتفاع.',
}

const TOKEN_KEY = 'davino_admin_token' // رمز ادمین برای نوشتن روی سرور (sessionStorage)
const API = '/api/content'            // کامل (شامل گالری) — سنگین
const CORE_API = '/api/content-core'  // سبک (بدون گالری) — برای نمایش سریع متن/هیرو

// کش نسخهٔ قدیمی (davino_admin) ممکن است تا ~۵MB دادهٔ خراب داشته باشد و سهم localStorage را پر کند
// و باعث fail شدن نوشتن کش جدید شود — یک‌بار پاکش کن.
try { localStorage.removeItem('davino_admin') } catch { /* ignore */ }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// گالری (عکس‌های base64 حجیم) در کش localStorage ذخیره نمی‌شود؛ وگرنه حجم از سقف
// مرورگر (~۵MB) رد می‌شود و نوشتن fail می‌کند و کش برای همیشه «قدیمی» می‌ماند (منشأ فلش).
// گالری همیشه از سرور خوانده می‌شود.
function save(data) {
  try {
    const { gallery, ...light } = data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(light))
  } catch {}
}

function getToken() {
  try { return sessionStorage.getItem(TOKEN_KEY) } catch { return null }
}

// نگاشت کلاس‌های قدیمی (بدون trainerId) به مربی واقعی بر اساس نام
function migrateClasses(list, trainerList) {
  return list.map(c => {
    if (c.trainerId) return c
    const match = trainerList.find(t => t.name === c.trainerName)
    return match ? { ...c, trainerId: match.id } : c
  })
}

export const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const stored = load()
  // مهاجرت: اگر pricing ذخیره‌شده ساختار قدیمی (بدون kind) داشت، با ۷ پکیج جدید جایگزین کن
  const storedPricing = Array.isArray(stored?.pricing) && stored.pricing.every(p => p.kind)
    ? stored.pricing
    : defaultPricing
  const initialTrainers = stored?.trainers ?? defaultTrainers
  const storedClasses = Array.isArray(stored?.classes) ? migrateClasses(stored.classes, initialTrainers) : defaultClasses

  const [trainers, setTrainers] = useState(initialTrainers)
  const [gallery, setGallery] = useState(stored?.gallery ?? defaultGallery)
  const [pricing, setPricing] = useState(storedPricing)
  const [settings, setSettings] = useState(stored?.settings ?? defaultSettings)
  const [classes, setClasses] = useState(storedClasses)
  const [articles, setArticles] = useState(Array.isArray(stored?.articles) ? stored.articles : defaultArticles)
  // تا وقتی از سرور نخوانده‌ایم، روی سرور نمی‌نویسیم (تا داده‌ی سرور با پیش‌فرض پاک نشود)
  const [hydrated, setHydrated] = useState(false)   // کامل (شامل گالری) — شرط نوشتن روی سرور
  const [coreReady, setCoreReady] = useState(false) // هستهٔ سبک آماده — شرط نمایش صفحه
  const [saveError, setSaveError] = useState(null)
  // اگر کش لوکال داشتیم، همان را نشان بده؛ اگر نه، تا پاسخ سرور صبر کن تا داده‌ی پیش‌فرض «فلش» نشود
  const hadCache = stored != null

  // ── خواندن محتوا از سرور هنگام بارگذاری (همه‌ی بازدیدکننده‌ها یک نسخه می‌بینند) ──
  useEffect(() => {
    let cancelled = false
    // اعمال داده‌ی سرور روی state (هم برای هستهٔ سبک، هم برای پاسخ کامل)
    const apply = (data) => {
      if (cancelled || !data || typeof data !== 'object') return
      if (Array.isArray(data.trainers)) setTrainers(data.trainers)
      if (Array.isArray(data.gallery)) setGallery(data.gallery)
      if (Array.isArray(data.pricing)) setPricing(data.pricing.every(p => p.kind) ? data.pricing : defaultPricing)
      if (data.settings && typeof data.settings === 'object') setSettings(data.settings)
      if (Array.isArray(data.classes)) setClasses(migrateClasses(data.classes, data.trainers || initialTrainers))
      if (Array.isArray(data.articles)) setArticles(data.articles)
    }

    // مرحله ۱ — هستهٔ سبک (بدون گالری، ~۱مگ): سریع می‌رسد تا متن‌ها/هیرو زود درست شوند
    fetch(CORE_API)
      .then(r => (r.ok ? r.json() : null))
      .then(apply)
      .catch(() => {})
      .finally(() => { if (!cancelled) setCoreReady(true) })

    // مرحله ۲ — کامل (شامل گالری، سنگین): گالری را پر می‌کند و اجازهٔ ذخیره روی سرور را می‌دهد
    fetch(API)
      .then(r => (r.ok ? r.json() : null))
      .then(apply)
      .catch(() => {}) // سرور در دسترس نیست → از کش localStorage/پیش‌فرض استفاده می‌شود
      .finally(() => { if (!cancelled) { setCoreReady(true); setHydrated(true) } })

    return () => { cancelled = true }
  }, [])

  // ── ذخیره: همیشه در localStorage (کش)، و روی سرور فقط وقتی ادمین وارد شده ──
  useEffect(() => {
    const data = { trainers, gallery, pricing, settings, classes, articles }
    save(data)
    if (!hydrated) return
    const token = getToken()
    if (!token) return // بازدیدکننده‌ی عادی روی سرور نمی‌نویسد
    const t = setTimeout(() => {
      fetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
        .then(r => {
          if (!r.ok) {
            setSaveError(r.status === 413
              ? 'حجم اطلاعات (عکس‌ها) بیش از حد مجاز سرور است — چند عکس رو حذف کن یا حجم عکس‌ها رو کم کن'
              : `ذخیره روی سرور ناموفق بود (کد ${r.status})`)
          } else {
            setSaveError(null)
          }
        })
        .catch(() => setSaveError('اتصال به سرور برقرار نشد — تغییرات فقط روی همین مرورگر ذخیره شد'))
    }, 600) // debounce تا چند ادیت پشت‌سرهم یک‌بار ذخیره شود
    return () => clearTimeout(t)
  }, [trainers, gallery, pricing, settings, classes, articles, hydrated])

  const updateTrainer = (id, patch) => {
    setTrainers(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t))
    // اگر نام مربی تغییر کرد، نام کش‌شده در کلاس‌های مرتبط هم هماهنگ شود
    if (patch.name) {
      setClasses(cs => cs.map(c => c.trainerId === id ? { ...c, trainerName: patch.name } : c))
    }
  }

  const deleteTrainer = (id) =>
    setTrainers(ts => ts.filter(t => t.id !== id))

  const addTrainer = (trainer) =>
    setTrainers(ts => [...ts, trainer])

  const updatePlan = (id, patch) =>
    setPricing(ps => ps.map(p => p.id === id ? { ...p, ...patch } : p))

  const updateSettings = (patch) =>
    setSettings(s => ({ ...s, ...patch }))

  const deleteGalleryItem = (id) =>
    setGallery(gs => gs.filter(g => g.id !== id))

  const addGalleryItems = (items) =>
    setGallery(gs => [...gs, ...items.map((it, i) => ({ ...it, id: Date.now() + i }))])

  const reorderGallery = (newGallery) =>
    setGallery(newGallery)

  const addClass = (item) =>
    setClasses(cs => [...cs, { ...item, id: Date.now() }])

  const updateClass = (id, patch) =>
    setClasses(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c))

  const deleteClass = (id) =>
    setClasses(cs => cs.filter(c => c.id !== id))

  const addArticle = (item) =>
    setArticles(as => [{ ...item, id: Date.now(), date: new Date().toISOString() }, ...as])

  const updateArticle = (id, patch) =>
    setArticles(as => as.map(a => a.id === id ? { ...a, ...patch } : a))

  const deleteArticle = (id) =>
    setArticles(as => as.filter(a => a.id !== id))

  return (
    <AdminContext.Provider value={{
      trainers, gallery, pricing, settings, classes, articles,
      updateTrainer, deleteTrainer, addTrainer,
      updatePlan, updateSettings,
      deleteGalleryItem, addGalleryItems, reorderGallery,
      addClass, updateClass, deleteClass,
      addArticle, updateArticle, deleteArticle,
      hydrated, coreReady, ready: coreReady || hadCache,
      saveError, clearSaveError: () => setSaveError(null),
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
