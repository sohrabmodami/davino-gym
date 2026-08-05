import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persianFa from 'react-date-object/locales/persian_fa'
import { ArrowRight, CalendarBlank, Check } from '@phosphor-icons/react'
import 'react-multi-date-picker/styles/layouts/mobile.css'
import Logo from '../components/Logo'
import { useAdmin } from '../data/adminStore.jsx'

const EMPTY_FORM = {
  fullName: '', nationalId: '', birthDate: '', phone: '', address: '', insuranceExpiry: '', company: '',
}

const normalizeDigits = (value) => String(value)
  .replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
  .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))
  .replace(/\D/g, '')

function DateTrigger({ value, openCalendar, placeholder }) {
  return (
    <button type="button" className={`register-date-trigger${value ? ' has-value' : ''}`} onClick={openCalendar}>
      <span>{value || placeholder}</span>
      <CalendarBlank size={20} weight="duotone" aria-hidden="true" />
    </button>
  )
}

function PersianDateField({ value, onChange, placeholder, maxDate }) {
  return (
    <DatePicker
      value={value || null}
      onChange={date => onChange(date ? date.format('YYYY/MM/DD') : '')}
      calendar={persian}
      locale={persianFa}
      format="YYYY/MM/DD"
      maxDate={maxDate}
      calendarPosition="bottom-right"
      className="register-jalali-calendar"
      containerClassName="register-date-container"
      render={<DateTrigger placeholder={placeholder} />}
      mobileLabels={{ OK: 'تأیید', CANCEL: 'انصراف' }}
    />
  )
}

const CSS = `
  .register-shell { min-height: 100vh; background: var(--bg); color: var(--text); direction: rtl; }
  .register-main { max-width: 1120px; margin: 0 auto; padding: 42px 28px 72px; }
  .register-layout { display: grid; grid-template-columns: minmax(0, 1fr) 330px; gap: 24px; align-items: start; }
  .register-card { background: var(--surface); border: 1px solid var(--surface-b); border-radius: 20px; padding: clamp(22px, 4vw, 34px); }
  .register-summary { position: sticky; top: 24px; }
  .register-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .register-field { display: flex; flex-direction: column; gap: 8px; }
  .register-field.full { grid-column: 1 / -1; }
  .register-label { font-size: 13px; font-weight: 700; color: var(--t60); }
  .register-input { width: 100%; min-height: 48px; padding: 12px 14px; color: var(--text); background: var(--bg2); border: 1.5px solid var(--surface-b); border-radius: 11px; outline: none; font: 14px var(--font-body); transition: border-color .2s, box-shadow .2s; }
  .register-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(234,68,60,.1); }
  .register-date-container { width: 100%; }
  .register-date-trigger { width: 100%; min-height: 48px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--t45); background: var(--bg2); border: 1.5px solid var(--surface-b); border-radius: 11px; font: 14px var(--font-body); text-align: right; transition: border-color .2s, box-shadow .2s; }
  .register-date-trigger:hover, .register-date-trigger:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(234,68,60,.1); }
  .register-date-trigger.has-value { color: var(--text); }
  .register-date-trigger svg { color: var(--accent); flex-shrink: 0; }
  .register-jalali-calendar { font-family: var(--font-body); background: var(--bg2) !important; color: var(--text); border: 1px solid var(--surface-b); border-radius: 16px; box-shadow: var(--shadow-card); padding: 8px; }
  .register-jalali-calendar .rmdp-calendar,
  .register-jalali-calendar .rmdp-day-picker,
  .register-jalali-calendar .rmdp-day-picker > div,
  .register-jalali-calendar .rmdp-week,
  .register-jalali-calendar .rmdp-month-picker,
  .register-jalali-calendar .rmdp-year-picker { background: var(--bg2) !important; color: var(--text) !important; }
  .register-jalali-calendar .rmdp-header-values { color: var(--text); font-weight: 800; }
  .register-jalali-calendar .rmdp-week-day { color: var(--accent); font-weight: 800; }
  .register-jalali-calendar .rmdp-day { color: var(--t60) !important; }
  .register-jalali-calendar .rmdp-day span { color: inherit !important; border-radius: 9px; }
  .register-jalali-calendar .rmdp-day.rmdp-day-hidden span { color: transparent !important; }
  .register-jalali-calendar .rmdp-day.rmdp-disabled span { color: var(--t35) !important; }
  .register-jalali-calendar .rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden) span:hover { background: var(--accent-soft); color: var(--text); }
  .register-jalali-calendar .rmdp-day.rmdp-selected span { color: #fff !important; background: var(--accent) !important; box-shadow: none; }
  .register-jalali-calendar .rmdp-day.rmdp-today:not(.rmdp-selected) span { border: 1px solid var(--accent); background: transparent !important; color: var(--text) !important; }
  .register-jalali-calendar .rmdp-arrow { border-color: var(--accent); }
  .register-jalali-calendar .rmdp-arrow-container:hover { background: var(--accent-soft); box-shadow: none; }
  .register-jalali-calendar .rmdp-action-button { color: var(--accent); font-family: var(--font-body); font-weight: 800; }
  .register-date-container .ep-arrow::after { background: var(--bg2) !important; border-color: var(--surface-b) !important; }
  .register-plan { display: flex; align-items: center; justify-content: space-between; gap: 14px; width: 100%; padding: 14px 15px; background: var(--bg2); color: var(--text); border: 1.5px solid var(--surface-b); border-radius: 12px; text-align: right; transition: border-color .2s, background .2s; }
  .register-plan.selected { border-color: var(--accent); background: var(--accent-soft); }
  @media (max-width: 820px) { .register-layout { grid-template-columns: 1fr; } .register-summary { position: static; } }
  @media (max-width: 580px) { .register-main { padding: 28px 18px 56px; } .register-fields { grid-template-columns: 1fr; } .register-field.full { grid-column: auto; } }
`

export default function Register() {
  const { pricing } = useAdmin()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPlan = searchParams.get('plan')
  const initialPlan = pricing.find(p => String(p.id) === requestedPlan)?.id ?? pricing[0]?.id ?? ''
  const [planId, setPlanId] = useState(initialPlan)
  const [form, setForm] = useState(EMPTY_FORM)
  const [accepted, setAccepted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])
  useEffect(() => {
    if (!planId && pricing[0]) setPlanId(pricing[0].id)
  }, [pricing, planId])

  const selectedPlan = useMemo(() => pricing.find(p => String(p.id) === String(planId)), [pricing, planId])
  const selectPlan = (id) => {
    setPlanId(id)
    setSearchParams({ plan: String(id) }, { replace: true })
  }
  const setField = (key, value) => setForm(current => ({ ...current, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!selectedPlan) return setError('لطفاً یک پکیج انتخاب کن.')
    if (!/^\d{10}$/.test(form.nationalId)) return setError('کد ملی باید دقیقاً ۱۰ رقم باشد.')
    if (!form.birthDate || !form.insuranceExpiry) return setError('تاریخ تولد و اعتبار بیمه ورزشی را انتخاب کن.')
    if (!/^09\d{9}$/.test(form.phone)) return setError('شماره تماس باید ۱۱ رقم و با ۰۹ شروع شود.')
    if (!accepted) return setError('برای ادامه، تأیید صحت اطلاعات لازم است.')
    setSending(true)
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          planId: selectedPlan.id,
          planName: `${selectedPlan.name}${selectedPlan.audience ? ` — ${selectedPlan.audience}` : ''}`,
          planPrice: selectedPlan.price,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'ارسال فرم ناموفق بود')
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'ارسال فرم ناموفق بود. لطفاً دوباره تلاش کن.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="register-shell">
      <style>{CSS}</style>
      <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--nav)', backdropFilter: 'blur(14px)' }}>
        <div style={{ maxWidth: 1120, height: 68, padding: '0 28px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" aria-label="صفحه اصلی"><Logo size={.92} /></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--t60)', fontWeight: 700 }}>
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
              بازگشت به پکیج‌ها
            </Link>
          </div>
        </div>
      </header>

      <main className="register-main">
        {submitted ? (
          <div className="register-card" style={{ maxWidth: 620, margin: '52px auto', textAlign: 'center', padding: '54px 30px' }}>
            <div style={{ width: 62, height: 62, margin: '0 auto 20px', display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#22C55E', background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.3)' }}>
              <Check size={28} weight="bold" aria-hidden="true" />
            </div>
            <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', marginBottom: 12 }}>درخواست ثبت‌نام ثبت شد</h1>
            <p style={{ color: 'var(--t60)', lineHeight: 1.9, marginBottom: 26 }}>همکاران داوینو برای تأیید اطلاعات و هماهنگی شروع کلاس با شما تماس می‌گیرند.</p>
            <Link to="/" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: 11, background: 'var(--accent)', color: '#fff', fontWeight: 800 }}>بازگشت به صفحه اصلی</Link>
          </div>
        ) : (
          <>
            <div style={{ maxWidth: 680, marginBottom: 34 }}>
              <div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 800, marginBottom: 10 }}>ثبت‌نام در داوینو</div>
              <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', lineHeight: 1.25, marginBottom: 12 }}>اولین قدم مسیر صعودت</h1>
              <p style={{ color: 'var(--t60)', lineHeight: 1.9 }}>اطلاعاتت را کامل کن و پکیج مناسب را انتخاب کن؛ پس از بررسی برای هماهنگی با تو تماس می‌گیریم.</p>
            </div>

            <form onSubmit={handleSubmit} className="register-layout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <section className="register-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <span style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 900 }}>۱</span>
                    <h2 style={{ fontSize: 18 }}>اطلاعات فردی</h2>
                  </div>
                  <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company} onChange={e => setField('company', e.target.value)} style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden', clipPath: 'inset(50%)', pointerEvents: 'none' }} />
                  <div className="register-fields">
                    <label className="register-field full"><span className="register-label">نام و نام خانوادگی</span><input className="register-input" required autoComplete="name" value={form.fullName} onChange={e => setField('fullName', e.target.value)} placeholder="مثلاً علی احمدی" /></label>
                    <label className="register-field"><span className="register-label">کد ملی</span><input className="register-input" required inputMode="numeric" maxLength={10} value={form.nationalId} onChange={e => setField('nationalId', normalizeDigits(e.target.value).slice(0, 10))} placeholder="۱۰ رقم" dir="ltr" /></label>
                    <div className="register-field"><span className="register-label">تاریخ تولد</span><PersianDateField value={form.birthDate} onChange={value => setField('birthDate', value)} placeholder="انتخاب تاریخ تولد" maxDate={new Date()} /></div>
                    <label className="register-field"><span className="register-label">شماره تماس</span><input className="register-input" required type="tel" inputMode="numeric" autoComplete="tel" maxLength={11} value={form.phone} onChange={e => setField('phone', normalizeDigits(e.target.value).slice(0, 11))} placeholder="09123456789" dir="ltr" /></label>
                    <div className="register-field"><span className="register-label">اعتبار بیمه ورزشی تا</span><PersianDateField value={form.insuranceExpiry} onChange={value => setField('insuranceExpiry', value)} placeholder="انتخاب تاریخ اعتبار" /></div>
                    <label className="register-field full"><span className="register-label">آدرس</span><textarea className="register-input" required rows={3} autoComplete="street-address" value={form.address} onChange={e => setField('address', e.target.value)} placeholder="آدرس کامل محل سکونت" style={{ resize: 'vertical', minHeight: 90 }} /></label>
                  </div>
                </section>

                <section className="register-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <span style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 900 }}>۲</span>
                    <h2 style={{ fontSize: 18 }}>انتخاب پکیج</h2>
                  </div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {pricing.map(plan => (
                      <button type="button" key={plan.id} onClick={() => selectPlan(plan.id)} className={`register-plan${String(planId) === String(plan.id) ? ' selected' : ''}`}>
                        <span><strong style={{ display: 'block', fontSize: 14, marginBottom: 3 }}>{plan.name}{plan.audience ? ` — ${plan.audience}` : ''}</strong><small style={{ color: 'var(--t50)' }}>{plan.sub}</small></span>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 900, color: 'var(--accent)' }}>{plan.price} <small style={{ fontWeight: 600 }}>تومان</small></span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="register-card register-summary">
                <div style={{ fontSize: 12, color: 'var(--t45)', fontWeight: 800, marginBottom: 16 }}>خلاصه ثبت‌نام</div>
                {selectedPlan ? <>
                  <h2 style={{ fontSize: 19, marginBottom: 5 }}>{selectedPlan.name}</h2>
                  <div style={{ fontSize: 13, color: 'var(--t50)', marginBottom: 22 }}>{selectedPlan.audience || selectedPlan.sub}</div>
                  <div style={{ padding: '18px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
                    <span style={{ fontSize: 13, color: 'var(--t60)' }}>مبلغ پکیج</span>
                    <strong style={{ fontSize: 20 }}>{selectedPlan.price} <small style={{ fontSize: 11, color: 'var(--t50)' }}>تومان</small></strong>
                  </div>
                </> : <p style={{ color: 'var(--t50)', fontSize: 13 }}>یک پکیج انتخاب کن.</p>}
                <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 18, cursor: 'pointer' }}>
                  <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop: 4, accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: 12, color: 'var(--t60)', lineHeight: 1.8 }}>صحت اطلاعات واردشده و تماس داوینو برای ادامه فرایند را تأیید می‌کنم.</span>
                </label>
                {error && <div role="alert" style={{ fontSize: 12, color: '#ef4444', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', padding: '10px 12px', borderRadius: 9, lineHeight: 1.7, marginBottom: 14 }}>{error}</div>}
                <button type="submit" disabled={sending || !selectedPlan} style={{ width: '100%', minHeight: 48, borderRadius: 11, background: 'var(--accent)', color: '#fff', fontSize: 15, fontWeight: 900, opacity: sending ? .65 : 1 }}>
                  {sending ? 'در حال ثبت…' : 'ثبت درخواست'}
                </button>
                <p style={{ fontSize: 11, color: 'var(--t45)', textAlign: 'center', lineHeight: 1.8, marginTop: 12 }}>در این مرحله پرداختی انجام نمی‌شود.</p>
              </aside>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
