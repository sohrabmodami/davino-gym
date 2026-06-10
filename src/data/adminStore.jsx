import { createContext, useContext, useState, useEffect } from 'react'
import { trainers as defaultTrainers } from './trainers'

const STORAGE_KEY = 'davino_admin'

const defaultGallery = [
  { id: 1, title: 'دیواره Lead', category: 'دیواره', span: 'wide', color: '#1a1a2e', accent: '#EA443C' },
  { id: 2, title: 'بولدرینگ', category: 'بولدرینگ', span: 'normal', color: '#16213e', accent: '#3B82F6' },
  { id: 3, title: 'کلاس کودکان', category: 'رویداد', span: 'normal', color: '#0f3460', accent: '#22C55E' },
  { id: 4, title: 'مسابقات ملی', category: 'رویداد', span: 'wide', color: '#533483', accent: '#A855F7' },
  { id: 5, title: 'تمرین قدرتی', category: 'تمرین', span: 'normal', color: '#2c1810', accent: '#F59E0B' },
  { id: 6, title: 'دیواره سرعت', category: 'دیواره', span: 'normal', color: '#0d2137', accent: '#06B6D4' },
]

const defaultPricing = [
  {
    id: 1, name: 'پایه', price: '۴۸۰,۰۰۰', period: 'ماهانه', popular: false,
    color: '#6B7280',
    features: ['دسترسی به دیواره‌های مبتدی', '۱۲ ساعت در ماه', 'رختکن و دوش', 'مشاوره اولیه رایگان'],
    cta: 'شروع کن',
  },
  {
    id: 2, name: 'حرفه‌ای', price: '۸۵۰,۰۰۰', period: 'ماهانه', popular: true,
    color: '#EA443C',
    features: ['دسترسی نامحدود به همه دیواره‌ها', 'یک جلسه خصوصی در ماه', 'برنامه تمرینی اختصاصی', 'تخفیف ۱۵٪ روی کلاس‌ها', 'باشگاه جامعه داوینو'],
    cta: 'همین الان بپیوند',
  },
  {
    id: 3, name: 'تیمی', price: '۱,۲۰۰,۰۰۰', period: 'ماهانه', popular: false,
    color: '#1A1410',
    features: ['همه امکانات پلن حرفه‌ای', '۴ جلسه خصوصی در ماه', 'برنامه مسابقاتی', 'دسترسی VIP به رویدادها', 'کوچینگ آنلاین', 'تحلیل ویدیویی تکنیک'],
    cta: 'تماس بگیر',
  },
]

const defaultSettings = {
  gymName: 'داوینو کلایمینگ',
  address: 'تهران، خیابان ولیعصر، خیابان داوینو، پلاک ۲۴',
  phone: '۰۲۱-۸۸۸۸-۰۰۰۰',
  hours: 'شنبه تا پنجشنبه ۸ صبح تا ۱۰ شب',
  instagram: '',
  telegram: '',
  whatsapp: '',
  youtube: '',
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const stored = load()
  const [trainers, setTrainers] = useState(stored?.trainers ?? defaultTrainers)
  const [gallery, setGallery] = useState(stored?.gallery ?? defaultGallery)
  const [pricing, setPricing] = useState(stored?.pricing ?? defaultPricing)
  const [settings, setSettings] = useState(stored?.settings ?? defaultSettings)

  useEffect(() => {
    save({ trainers, gallery, pricing, settings })
  }, [trainers, gallery, pricing, settings])

  const updateTrainer = (id, patch) =>
    setTrainers(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t))

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

  const addGalleryItem = (item) =>
    setGallery(gs => [...gs, { ...item, id: Date.now() }])

  return (
    <AdminContext.Provider value={{
      trainers, gallery, pricing, settings,
      updateTrainer, deleteTrainer, addTrainer,
      updatePlan, updateSettings,
      deleteGalleryItem, addGalleryItem,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
