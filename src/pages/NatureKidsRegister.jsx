import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check } from '@phosphor-icons/react'
import Logo from '../components/Logo'
import BankCard from '../components/BankCard'
import useSeo from '../hooks/useSeo'

const PRICE = '۲،۵۰۰،۰۰۰'
const TELEGRAM_PHONE = '09201246057'
const TELEGRAM_DISPLAY = '۰۹۲۰۱۲۴۶۰۵۷'

const CONSENT_PARAGRAPHS = [
  'اینجانب با آگاهی کامل از ماهیت فعالیت سنگ‌نوردی و خطرات احتمالی آن، رضایت خود را برای حضور فرزندم در این برنامه اعلام می‌کنم.',
  'همچنین تأیید می‌کنم فرزندم فاقد هرگونه بیماری، آسیب‌دیدگی یا شرایط جسمانی شناخته‌شده‌ای است که انجام فعالیت ورزشی و سنگ‌نوردی برای وی ممنوع یا محدودکننده باشد و متعهد می‌شوم در صورت وجود هرگونه شرایط خاص، مراتب را پیش از شروع برنامه به مسئولان اطلاع دهم.',
  'با مطالعه نکات و مقررات ایمنی برنامه، متعهد به رعایت آن‌ها هستم.',
]

const GEAR = [
  'لباس مناسب و راحت برای فعالیت ورزشی',
  'کفش مناسب',
  'کوله‌پشتی کوچک',
  'بطری آب',
  'کلاه و عینک آفتابی',
  'کرم ضدآفتاب',
  'لباس اضافه',
  'زیرانداز کوچک',
  'میان‌وعده شخصی در صورت نیاز',
  'داروهای شخصی در صورت مصرف',
]

const NOTES = [
  'حضور کودکان با هماهنگی و رضایت والدین انجام می‌شود.',
  'برنامه تحت نظر مربیان و با رعایت اصول ایمنی برگزار خواهد شد.',
  'لطفاً وسایل مورد نیاز را از شب قبل آماده کنید.',
  'ظرفیت برنامه محدود است و اولویت با افرادی است که زودتر ثبت‌نام خود را نهایی کنند.',
]

const RELATIONS = ['پدر', 'مادر', 'ولی']
const HEARD_OPTIONS = ['اینستاگرام', 'دوستان و آشنایان', 'سایت داوینو', 'کانال تلگرام', 'سایر']

const EMPTY_FORM = {
  parentName: '',
  parentPhone: '',
  relation: '',
  childName: '',
  childAge: '',
  childGender: '',
  isMember: '',
  medicalNotes: '',
  notes: '',
  heardFrom: '',
  heardOther: '',
  company: '',
}

const normalizeDigits = (value) => String(value)
  .replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
  .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))
  .replace(/\D/g, '')

const CSS = `
  .nk-shell { min-height: 100vh; background: var(--bg); color: var(--text); direction: rtl; }
  .nk-main { max-width: 760px; margin: 0 auto; padding: 42px 28px 72px; }
  .nk-card { background: var(--surface); border: 1px solid var(--surface-b); border-radius: 20px; padding: clamp(22px, 4vw, 32px); margin-bottom: 20px; }
  .nk-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .nk-field { display: flex; flex-direction: column; gap: 8px; }
  .nk-field.full { grid-column: 1 / -1; }
  .nk-label { font-size: 13px; font-weight: 700; color: var(--t60); }
  .nk-input { width: 100%; min-height: 48px; padding: 12px 14px; color: var(--text); background: var(--bg2); border: 1.5px solid var(--surface-b); border-radius: 11px; outline: none; font: 14px var(--font-body); transition: border-color .2s, box-shadow .2s; }
  .nk-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(39,94,170,.1); }
  .nk-check { display: flex; align-items: flex-start; gap: 9px; cursor: pointer; font-size: 13.5px; color: var(--text); line-height: 1.6; }
  .nk-check input { margin-top: 3px; accent-color: var(--accent); flex-shrink: 0; }
  .nk-radio-row { display: flex; gap: 18px; flex-wrap: wrap; }
  .nk-section-title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .nk-section-title span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; background: var(--accent); color: #fff; font-size: 13px; font-weight: 900; }
  .nk-section-title h2 { font-size: 17px; margin: 0; }
  .nk-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .nk-meta-item { background: var(--bg2); border: 1px solid var(--surface-b); border-radius: 14px; padding: 14px 16px; }
  .nk-meta-item .k { font-size: 12px; font-weight: 800; color: var(--accent); margin-bottom: 6px; }
  .nk-meta-item .v { font-size: 14.5px; font-weight: 700; line-height: 1.7; }
  .nk-list { margin: 0; padding: 0 18px 0 0; display: grid; gap: 8px; }
  .nk-list li { font-size: 14px; color: var(--t60); line-height: 1.8; }
  .nk-check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
  @media (max-width: 580px) {
    .nk-main { padding: 28px 18px 56px; }
    .nk-fields, .nk-meta, .nk-check-grid { grid-template-columns: 1fr; }
    .nk-field.full { grid-column: auto; }
  }
`

export default function NatureKidsRegister() {
  const [searchParams] = useSearchParams()
  const previewSuccess = searchParams.get('preview') === 'success'
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    parentName: previewSuccess ? 'مریم احمدی' : '',
    childName: previewSuccess ? 'آوا احمدی' : '',
  })
  const [consent, setConsent] = useState(previewSuccess)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(previewSuccess)

  useSeo({
    title: 'ثبت‌نام سنگ‌نوردی طبیعت کودکان | آکادمی داوینو',
    description: 'ثبت‌نام برنامه آموزشی سنگ‌نوردی طبیعت ویژه کودکان — دوشنبه ۲ شهریور، منطقه گسیل، جاده چالوس.',
    keywords: 'سنگ‌نوردی کودکان, سنگ‌نوردی طبیعت, داوینو, گسیل, جاده چالوس',
  })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const setField = (key, value) => setForm(current => ({ ...current, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const fail = (message) => {
      setError(message)
      requestAnimationFrame(() => {
        document.getElementById('nk-form-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }

    if (!form.parentName.trim()) return fail('نام والدین را وارد کنید.')
    if (!/^09\d{9}$/.test(form.parentPhone)) return fail('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.')
    if (!form.relation) return fail('نسبت با کودک را انتخاب کنید.')
    if (!form.childName.trim()) return fail('نام کودک را وارد کنید.')
    if (!form.childAge.trim()) return fail('سن کودک را وارد کنید.')
    const ageNum = Number(form.childAge)
    if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 17) return fail('سن کودک باید بین ۱ تا ۱۷ سال باشد.')
    if (!form.childGender) return fail('جنسیت کودک را انتخاب کنید.')
    if (form.isMember === '') return fail('عضویت در باشگاه داوینو را مشخص کنید.')
    if (!form.heardFrom) return fail('از کجا با این برنامه آشنا شدید را انتخاب کنید.')
    if (form.heardFrom === 'سایر' && !form.heardOther.trim()) return fail('لطفاً منبع آشنایی را بنویسید.')
    if (!consent) return fail('برای ثبت‌نام، رضایت والدین لازم است.')

    setSending(true)
    try {
      const response = await fetch('/api/nature-kids-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: form.parentName,
          parentPhone: form.parentPhone,
          relation: form.relation,
          childName: form.childName,
          childAge: form.childAge,
          childGender: form.childGender,
          isMember: form.isMember === 'بله',
          medicalNotes: form.medicalNotes,
          notes: form.notes,
          heardFrom: form.heardFrom,
          heardOther: form.heardOther,
          consent: true,
          company: form.company,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'ارسال فرم ناموفق بود')
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'ارسال فرم ناموفق بود. لطفاً دوباره تلاش کنید.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="nk-shell">
      <style>{CSS}</style>
      <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--nav)', backdropFilter: 'blur(14px)' }}>
        <div style={{ maxWidth: 760, height: 68, padding: '0 28px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" aria-label="صفحه اصلی"><Logo size={.92} /></Link>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--t60)', fontWeight: 700 }}>
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
            بازگشت
          </Link>
        </div>
      </header>

      <main className="nk-main">
        {submitted ? (
          <div className="nk-card" style={{ textAlign: 'center', padding: 'clamp(36px, 5vw, 54px) clamp(22px, 4vw, 34px)', marginTop: 40 }}>
            <div style={{ width: 62, height: 62, margin: '0 auto 20px', display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#22C55E', background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.3)' }}>
              <Check size={28} weight="bold" aria-hidden="true" />
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 5vw, 34px)', marginBottom: 10 }}>ثبت‌نام با موفقیت انجام شد</h1>
            <p style={{ color: 'var(--t60)', lineHeight: 1.9, marginBottom: 8, fontSize: 15 }}>
              {form.childName.trim() || 'کودک'} — با هماهنگی {form.parentName.trim() || 'والدین'}
            </p>
            <p style={{ color: 'var(--text)', fontWeight: 800, fontSize: 18, marginBottom: 28 }}>
              مبلغ قابل پرداخت: <span style={{ color: 'var(--accent)' }}>{PRICE}</span> <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t50)' }}>تومان</span>
            </p>

            <div style={{
              textAlign: 'right', background: 'var(--bg2)', border: '1px solid var(--surface-b)',
              borderRadius: 16, padding: '22px 20px', marginBottom: 28, lineHeight: 1.95,
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', marginBottom: 12 }}>مراحل ثبت‌نام قطعی</div>
              <p style={{ fontSize: 14.5, color: 'var(--t60)', margin: '0 0 18px' }}>
                برای نهایی شدن ثبت‌نام، مبلغ <strong style={{ color: 'var(--text)' }}>{PRICE} تومان</strong> را به کارت زیر واریز کنید:
              </p>
              <BankCard variant="natureKids" />
              <p style={{ fontSize: 14.5, color: 'var(--t60)', margin: 0 }}>
                سپس لطفاً تصویر فیش واریزی را از طریق تلگرام به شماره{' '}
                <a href={`tel:${TELEGRAM_PHONE}`} dir="ltr" style={{ color: 'var(--accent)', fontWeight: 800, whiteSpace: 'nowrap' }}>{TELEGRAM_DISPLAY}</a>
                {' '}ارسال کنید تا ثبت‌نام شما قطعی شود.
              </p>
            </div>

            <Link to="/" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: 11, background: 'var(--accent)', color: '#fff', fontWeight: 800 }}>بازگشت به صفحه اصلی</Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 800, marginBottom: 10 }}>برنامه آموزشی کودکان</div>
              <h1 style={{ fontSize: 'clamp(26px, 5vw, 38px)', lineHeight: 1.3, marginBottom: 12 }}>سنگ‌نوردی طبیعت ویژه کودکان</h1>
              <p style={{ color: 'var(--t60)', lineHeight: 1.9 }}>
                آکادمی سنگ‌نوردی داوینو در نظر دارد برنامه آموزشی سنگ‌نوردی طبیعت ویژه کودکان را برگزار کند.
                در این برنامه، کودکان در کنار تجربه حضور در طبیعت، بر روی دیواره‌های طبیعی با حمایت مربیان سنگنوردی می‌کنند.
              </p>
            </div>

            <section className="nk-card">
              <div className="nk-meta">
                <div className="nk-meta-item">
                  <div className="k">زمان برنامه</div>
                  <div className="v">دوشنبه ۲ شهریورماه</div>
                </div>
                <div className="nk-meta-item">
                  <div className="k">ساعت حضور</div>
                  <div className="v">۸ صبح</div>
                </div>
                <div className="nk-meta-item">
                  <div className="k">محل برگزاری</div>
                  <div className="v">منطقه گسیل، جاده چالوس</div>
                </div>
                <div className="nk-meta-item" style={{ gridColumn: '1 / -1' }}>
                  <div className="k">پذیرایی</div>
                  <div className="v">یک وعده صبحانه مختصر برای کودکان در نظر گرفته شده است.</div>
                </div>
                <div className="nk-meta-item" style={{ gridColumn: '1 / -1' }}>
                  <div className="k">هزینه ثبت‌نام</div>
                  <div className="v">{PRICE} تومان — برای هر کودک</div>
                </div>
              </div>
            </section>

            <section className="nk-card">
              <div className="nk-section-title">
                <span>۱</span>
                <h2>فهرست وسایل مورد نیاز</h2>
              </div>
              <ul className="nk-list">
                {GEAR.map(item => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="nk-card">
              <div className="nk-section-title">
                <span>۲</span>
                <h2>نکات مهم</h2>
              </div>
              <ul className="nk-list">
                {NOTES.map(item => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <form onSubmit={handleSubmit} noValidate>
              <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company} onChange={e => setField('company', e.target.value)} style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden', clipPath: 'inset(50%)', pointerEvents: 'none' }} />

              <section className="nk-card">
                <div className="nk-section-title">
                  <span>۳</span>
                  <h2>اطلاعات کودک</h2>
                </div>
                <div className="nk-fields">
                  <label className="nk-field full">
                    <span className="nk-label">نام و نام خانوادگی کودک</span>
                    <input className="nk-input" value={form.childName} onChange={e => setField('childName', e.target.value)} placeholder="مثلاً آوا احمدی" />
                  </label>
                  <label className="nk-field">
                    <span className="nk-label">سن کودک</span>
                    <input className="nk-input" inputMode="numeric" maxLength={2} value={form.childAge} onChange={e => setField('childAge', normalizeDigits(e.target.value).slice(0, 2))} placeholder="مثلاً ۸" dir="ltr" />
                  </label>
                  <div className="nk-field">
                    <span className="nk-label">جنسیت</span>
                    <div className="nk-radio-row" style={{ marginTop: 4 }}>
                      {['پسر', 'دختر'].map(g => (
                        <label key={g} className="nk-check">
                          <input type="radio" name="childGender" checked={form.childGender === g} onChange={() => setField('childGender', g)} />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="nk-field full">
                    <span className="nk-label">آیا کودک در باشگاه داوینو عضو است؟</span>
                    <div className="nk-radio-row" style={{ marginTop: 4 }}>
                      {['بله', 'خیر'].map(opt => (
                        <label key={opt} className="nk-check">
                          <input type="radio" name="isMember" checked={form.isMember === opt} onChange={() => setField('isMember', opt)} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="nk-card">
                <div className="nk-section-title">
                  <span>۴</span>
                  <h2>اطلاعات والدین</h2>
                </div>
                <div className="nk-fields">
                  <label className="nk-field full">
                    <span className="nk-label">نام و نام خانوادگی والد / ولی</span>
                    <input className="nk-input" autoComplete="name" value={form.parentName} onChange={e => setField('parentName', e.target.value)} placeholder="مثلاً مریم احمدی" />
                  </label>
                  <label className="nk-field">
                    <span className="nk-label">شماره موبایل</span>
                    <input className="nk-input" type="tel" inputMode="numeric" autoComplete="tel" maxLength={11} value={form.parentPhone} onChange={e => setField('parentPhone', normalizeDigits(e.target.value).slice(0, 11))} placeholder="09123456789" dir="ltr" />
                  </label>
                  <div className="nk-field">
                    <span className="nk-label">نسبت با کودک</span>
                    <div className="nk-radio-row" style={{ marginTop: 4 }}>
                      {RELATIONS.map(r => (
                        <label key={r} className="nk-check">
                          <input type="radio" name="relation" checked={form.relation === r} onChange={() => setField('relation', r)} />
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="nk-field full">
                    <span className="nk-label">داروها یا شرایط پزشکی خاص (اختیاری)</span>
                    <textarea className="nk-input" rows={3} value={form.medicalNotes} onChange={e => setField('medicalNotes', e.target.value)} placeholder="در صورت مصرف دارو یا حساسیت، بنویسید…" style={{ resize: 'vertical', minHeight: 90 }} />
                  </label>
                  <label className="nk-field full">
                    <span className="nk-label">توضیحات بیشتر (اختیاری)</span>
                    <textarea className="nk-input" rows={3} value={form.notes} onChange={e => setField('notes', e.target.value)} placeholder="اگر نکته‌ای برای هماهنگی دارید بنویسید…" style={{ resize: 'vertical', minHeight: 90 }} />
                  </label>
                </div>
              </section>

              <section className="nk-card">
                <div className="nk-section-title">
                  <span>۵</span>
                  <h2>از کجا با این برنامه آشنا شدید؟</h2>
                </div>
                <div className="nk-check-grid">
                  {HEARD_OPTIONS.map(item => (
                    <label key={item} className="nk-check">
                      <input type="radio" name="heardFrom" checked={form.heardFrom === item} onChange={() => setField('heardFrom', item)} />
                      {item}
                    </label>
                  ))}
                </div>
                {form.heardFrom === 'سایر' && (
                  <label className="nk-field full" style={{ marginTop: 14 }}>
                    <span className="nk-label">سایر</span>
                    <input className="nk-input" value={form.heardOther} onChange={e => setField('heardOther', e.target.value)} placeholder="توضیح دهید…" />
                  </label>
                )}
              </section>

              <section className="nk-card">
                <div className="nk-section-title">
                  <span>۶</span>
                  <h2>پرداخت و ارسال فیش</h2>
                </div>
                <p style={{ fontSize: 14.5, color: 'var(--t60)', lineHeight: 1.9, margin: '0 0 18px' }}>
                  پس از ثبت‌نام، مبلغ <strong style={{ color: 'var(--text)' }}>{PRICE} تومان</strong> را به کارت زیر واریز کنید.
                  سپس لطفاً تصویر فیش واریزی را از طریق تلگرام به شماره{' '}
                  <a href={`tel:${TELEGRAM_PHONE}`} dir="ltr" style={{ color: 'var(--accent)', fontWeight: 800 }}>{TELEGRAM_DISPLAY}</a>
                  {' '}ارسال کنید.
                </p>
                <BankCard variant="natureKids" />
              </section>

              <section className="nk-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="nk-section-title" style={{ marginBottom: 4 }}>
                  <span>۷</span>
                  <h2>رضایت والدین</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 4 }}>
                  {CONSENT_PARAGRAPHS.map(text => (
                    <p key={text} style={{ fontSize: 13.5, color: 'var(--t60)', lineHeight: 1.95, margin: 0 }}>{text}</p>
                  ))}
                </div>
                <label className="nk-check">
                  <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                  <span>متن رضایت‌نامه را مطالعه کرده‌ام و می‌پذیرم.</span>
                </label>
                {error && (
                  <div id="nk-form-error" role="alert" style={{ fontSize: 13, color: '#ef4444', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', padding: '12px 14px', borderRadius: 11, lineHeight: 1.7 }}>
                    {error}
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--t45)', fontWeight: 800, marginBottom: 6 }}>هزینه ثبت‌نام</div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{PRICE} <small style={{ fontSize: 13, fontWeight: 600, color: 'var(--t50)' }}>تومان</small></div>
                    <div style={{ fontSize: 12, color: 'var(--t50)', marginTop: 4 }}>برای هر کودک</div>
                  </div>
                  <button type="submit" disabled={sending} style={{ minWidth: 180, minHeight: 48, padding: '0 28px', borderRadius: 11, background: 'var(--accent)', color: '#fff', fontSize: 15, fontWeight: 900, opacity: sending ? .65 : 1 }}>
                    {sending ? 'در حال ثبت…' : 'ثبت‌نام'}
                  </button>
                </div>
              </section>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
