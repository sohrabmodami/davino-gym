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

const defaultClasses = [
  { id: 1, title: 'سنگنوردی مقدماتی', trainerName: 'علی محمدی', days: ['شنبه', 'سه‌شنبه'], startTime: '16:00', endTime: '17:30', level: 'مبتدی', sessions: 8, capacity: 12, enrolled: 8, price: '۲۵۰,۰۰۰', color: '#22C55E', active: true },
  { id: 2, title: 'بولدرینگ پیشرفته', trainerName: 'سارا رضایی', days: ['یکشنبه', 'چهارشنبه'], startTime: '18:00', endTime: '19:30', level: 'پیشرفته', sessions: 8, capacity: 8, enrolled: 7, price: '۳۵۰,۰۰۰', color: '#3B82F6', active: true },
  { id: 3, title: 'لید تکنیک', trainerName: 'رضا کریمی', days: ['دوشنبه', 'پنجشنبه'], startTime: '08:00', endTime: '09:30', level: 'متوسط', sessions: 8, capacity: 10, enrolled: 7, price: '۳۲۰,۰۰۰', color: '#F59E0B', active: true },
  { id: 4, title: 'سنگنوردی نوجوانان', trainerName: 'علی محمدی', days: ['دوشنبه', 'پنجشنبه'], startTime: '17:00', endTime: '18:30', level: 'مبتدی', sessions: 8, capacity: 10, enrolled: 6, price: '۲۸۰,۰۰۰', color: '#EA443C', active: true },
  { id: 5, title: 'کلاس کودکان', trainerName: 'سارا رضایی', days: ['جمعه'], startTime: '10:00', endTime: '11:30', level: 'مبتدی', sessions: 4, capacity: 10, enrolled: 9, price: '۲۰۰,۰۰۰', color: '#A855F7', active: true },
  { id: 6, title: 'بولدرینگ مقدماتی', trainerName: 'رضا کریمی', days: ['شنبه', 'چهارشنبه'], startTime: '20:00', endTime: '21:30', level: 'مبتدی', sessions: 8, capacity: 12, enrolled: 5, price: '۲۵۰,۰۰۰', color: '#06B6D4', active: true },
  { id: 7, title: 'مسابقات و تکنیک', trainerName: 'علی محمدی', days: ['پنجشنبه'], startTime: '09:00', endTime: '11:00', level: 'پیشرفته', sessions: 4, capacity: 6, enrolled: 4, price: '۴۵۰,۰۰۰', color: '#10B981', active: true },
]

const defaultSettings = {
  gymName: 'داوینو کلایمینگ',
  address: 'تهران، خیابان ولیعصر، خیابان داوینو، پلاک ۲۴',
  phone: '۰۲۱-۸۸۸۸-۰۰۰۰',
  hours: 'شنبه تا پنجشنبه ۸ صبح تا ۱۰ شب',
  mobile: '',
  instagram: '',
  telegram: '',
  whatsapp: '',
  youtube: '',
  instagramVisible: true,
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
  const [classes, setClasses] = useState(stored?.classes ?? defaultClasses)

  useEffect(() => {
    save({ trainers, gallery, pricing, settings, classes })
  }, [trainers, gallery, pricing, settings, classes])

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

  const addClass = (item) =>
    setClasses(cs => [...cs, { ...item, id: Date.now() }])

  const updateClass = (id, patch) =>
    setClasses(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c))

  const deleteClass = (id) =>
    setClasses(cs => cs.filter(c => c.id !== id))

  return (
    <AdminContext.Provider value={{
      trainers, gallery, pricing, settings, classes,
      updateTrainer, deleteTrainer, addTrainer,
      updatePlan, updateSettings,
      deleteGalleryItem, addGalleryItem,
      addClass, updateClass, deleteClass,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
