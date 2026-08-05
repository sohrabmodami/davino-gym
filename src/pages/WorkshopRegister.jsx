import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from '@phosphor-icons/react'
import Logo from '../components/Logo'

const PRICE_ONE = '۱،۲۵۰،۰۰۰'
const PRICE_TWO = '۲،۰۰۰،۰۰۰'

const CONCERNS = [
  'کاهش اعتمادبه‌نفس',
  'کمبود مسئولیت‌پذیری',
  'وابستگی بیش از حد به والدین',
  'خجالتی بودن',
  'اضطراب و استرس',
  'نداشتن تمرکز',
  'لجبازی',
  'ناتوانی در کنترل هیجان',
  'استفاده زیاد از موبایل و تبلت',
  'مشکل در ارتباط با همسالان',
  'مورد دیگر',
]

const HEARD_OPTIONS = [
  'اینستاگرام',
  'دوستان و آشنایان',
  'سایت داوینو',
  'کانال تلگرام',
  'سایر',
]

const EMPTY_PERSON = { fullName: '', phone: '', age: '', job: '', email: '' }

const normalizeDigits = (value) => String(value)
  .replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
  .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))
  .replace(/\D/g, '')

const CSS = `
  .ws-shell { min-height: 100vh; background: var(--bg); color: var(--text); direction: rtl; }
  .ws-main { max-width: 760px; margin: 0 auto; padding: 42px 28px 72px; }
  .ws-card { background: var(--surface); border: 1px solid var(--surface-b); border-radius: 20px; padding: clamp(22px, 4vw, 32px); margin-bottom: 20px; }
  .ws-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ws-field { display: flex; flex-direction: column; gap: 8px; }
  .ws-field.full { grid-column: 1 / -1; }
  .ws-label { font-size: 13px; font-weight: 700; color: var(--t60); }
  .ws-input { width: 100%; min-height: 48px; padding: 12px 14px; color: var(--text); background: var(--bg2); border: 1.5px solid var(--surface-b); border-radius: 11px; outline: none; font: 14px var(--font-body); transition: border-color .2s, box-shadow .2s; }
  .ws-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(234,68,60,.1); }
  .ws-choice { display: flex; gap: 10px; flex-wrap: wrap; }
  .ws-chip { flex: 1; min-width: 140px; padding: 16px 18px; border-radius: 14px; border: 1.5px solid var(--surface-b); background: var(--bg2); color: var(--text); text-align: right; font: 700 14px var(--font-body); cursor: pointer; transition: border-color .2s, background .2s; }
  .ws-chip.selected { border-color: var(--accent); background: var(--accent-soft); }
  .ws-chip small { display: block; margin-top: 6px; font-weight: 600; font-size: 12px; color: var(--t50); }
  .ws-check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
  .ws-check { display: flex; align-items: flex-start; gap: 9px; cursor: pointer; font-size: 13.5px; color: var(--text); line-height: 1.6; }
  .ws-check input { margin-top: 3px; accent-color: var(--accent); flex-shrink: 0; }
  .ws-radio-row { display: flex; gap: 18px; flex-wrap: wrap; }
  .ws-section-title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .ws-section-title span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; background: var(--accent); color: #fff; font-size: 13; font-weight: 900; }
  .ws-section-title h2 { font-size: 17px; margin: 0; }
  @media (max-width: 580px) {
    .ws-main { padding: 28px 18px 56px; }
    .ws-fields, .ws-check-grid { grid-template-columns: 1fr; }
    .ws-field.full { grid-column: auto; }
  }
`

export default function WorkshopRegister() {
  const [attendeeCount, setAttendeeCount] = useState(1)
  const [attendees, setAttendees] = useState([{ ...EMPTY_PERSON }, { ...EMPTY_PERSON }])
  const [child, setChild] = useState({ name: '', age: '', gender: '', isMember: '' })
  const [concerns, setConcerns] = useState([])
  const [concernOther, setConcernOther] = useState('')
  const [expectation, setExpectation] = useState('')
  const [heardFrom, setHeardFrom] = useState('')
  const [heardOther, setHeardOther] = useState('')
  const [company, setCompany] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const price = attendeeCount === 2 ? PRICE_TWO : PRICE_ONE

  const setPerson = (index, key, value) => {
    setAttendees(current => current.map((person, i) => i === index ? { ...person, [key]: value } : person))
  }

  const toggleConcern = (item) => {
    setConcerns(current => current.includes(item) ? current.filter(c => c !== item) : [...current, item])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const people = attendees.slice(0, attendeeCount)
    for (let i = 0; i < people.length; i++) {
      const person = people[i]
      if (!person.fullName.trim()) return setError(attendeeCount === 2 ? `نام شرکت‌کننده ${i + 1} را وارد کنید.` : 'نام و نام خانوادگی را وارد کنید.')
      if (!/^09\d{9}$/.test(person.phone)) return setError('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.')
      if (!person.age.trim()) return setError('سن را وارد کنید.')
      if (!person.job.trim()) return setError('شغل را وارد کنید.')
      if (person.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) return setError('ایمیل معتبر نیست.')
    }

    if (!child.name.trim() || !child.age.trim() || !child.gender || child.isMember === '') {
      return setError('اطلاعات فرزند را کامل کنید.')
    }
    if (!concerns.length) return setError('حداقل یک دغدغه را انتخاب کنید.')
    if (concerns.includes('مورد دیگر') && !concernOther.trim()) return setError('لطفاً مورد دیگر را بنویسید.')
    if (!expectation.trim()) return setError('انتظار خود از کارگاه را بنویسید.')
    if (!heardFrom) return setError('از کجا با کارگاه آشنا شدید را انتخاب کنید.')
    if (heardFrom === 'سایر' && !heardOther.trim()) return setError('لطفاً منبع آشنایی را بنویسید.')

    setSending(true)
    try {
      const response = await fetch('/api/workshop-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          attendeeCount,
          attendees: people,
          child: {
            name: child.name,
            age: child.age,
            gender: child.gender,
            isMember: child.isMember === 'بله',
          },
          concerns,
          concernOther,
          expectation,
          heardFrom,
          heardOther,
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
    <div className="ws-shell">
      <style>{CSS}</style>
      <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--nav)', backdropFilter: 'blur(14px)' }}>
        <div style={{ maxWidth: 760, height: 68, padding: '0 28px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" aria-label="صفحه اصلی"><Logo size={.92} /></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--t60)', fontWeight: 700 }}>
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
              بازگشت
            </Link>
          </div>
        </div>
      </header>

      <main className="ws-main">
        {submitted ? (
          <div className="ws-card" style={{ textAlign: 'center', padding: '54px 30px', marginTop: 40 }}>
            <div style={{ width: 62, height: 62, margin: '0 auto 20px', display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#22C55E', background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.3)' }}>
              <Check size={28} weight="bold" aria-hidden="true" />
            </div>
            <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', marginBottom: 12 }}>ثبت‌نام با موفقیت انجام شد</h1>
            <p style={{ color: 'var(--t60)', lineHeight: 1.9, marginBottom: 26 }}>
              درخواست شما ثبت شد. همکاران داوینو برای هماهنگی و ادامه فرایند با شما تماس می‌گیرند.
            </p>
            <Link to="/" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: 11, background: 'var(--accent)', color: '#fff', fontWeight: 800 }}>بازگشت به صفحه اصلی</Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 800, marginBottom: 10 }}>ثبت‌نام کارگاه</div>
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.3, marginBottom: 10 }}>فرم ثبت‌نام کارگاه والدین</h1>
              <p style={{ color: 'var(--t60)', lineHeight: 1.9 }}>اطلاعات خود و فرزندتان را کامل کنید. پس از ثبت، پیام موفقیت نمایش داده می‌شود.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" value={company} onChange={e => setCompany(e.target.value)} style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden', clipPath: 'inset(50%)', pointerEvents: 'none' }} />

              <section className="ws-card">
                <div className="ws-section-title">
                  <span>۱</span>
                  <h2>تعداد شرکت‌کننده</h2>
                </div>
                <div className="ws-choice">
                  <button type="button" className={`ws-chip${attendeeCount === 1 ? ' selected' : ''}`} onClick={() => setAttendeeCount(1)}>
                    یک نفر
                    <small>هزینه: {PRICE_ONE} تومان</small>
                  </button>
                  <button type="button" className={`ws-chip${attendeeCount === 2 ? ' selected' : ''}`} onClick={() => setAttendeeCount(2)}>
                    دو نفر (پدر و مادر)
                    <small>هزینه: {PRICE_TWO} تومان</small>
                  </button>
                </div>
              </section>

              {Array.from({ length: attendeeCount }, (_, index) => (
                <section className="ws-card" key={index}>
                  <div className="ws-section-title">
                    <span>{index + 2}</span>
                    <h2>{attendeeCount === 2 ? `اطلاعات شرکت‌کننده ${index + 1}` : 'اطلاعات شما'}</h2>
                  </div>
                  <div className="ws-fields">
                    <label className="ws-field full">
                      <span className="ws-label">نام و نام خانوادگی</span>
                      <input className="ws-input" required autoComplete="name" value={attendees[index].fullName} onChange={e => setPerson(index, 'fullName', e.target.value)} placeholder="مثلاً علی احمدی" />
                    </label>
                    <label className="ws-field">
                      <span className="ws-label">شماره موبایل</span>
                      <input className="ws-input" required type="tel" inputMode="numeric" autoComplete="tel" maxLength={11} value={attendees[index].phone} onChange={e => setPerson(index, 'phone', normalizeDigits(e.target.value).slice(0, 11))} placeholder="09123456789" dir="ltr" />
                    </label>
                    <label className="ws-field">
                      <span className="ws-label">سن</span>
                      <input className="ws-input" required inputMode="numeric" maxLength={3} value={attendees[index].age} onChange={e => setPerson(index, 'age', normalizeDigits(e.target.value).slice(0, 3))} placeholder="مثلاً ۳۵" dir="ltr" />
                    </label>
                    <label className="ws-field">
                      <span className="ws-label">شغل</span>
                      <input className="ws-input" required value={attendees[index].job} onChange={e => setPerson(index, 'job', e.target.value)} placeholder="مثلاً معلم" />
                    </label>
                    <label className="ws-field">
                      <span className="ws-label">آدرس ایمیل (اختیاری)</span>
                      <input className="ws-input" type="email" autoComplete="email" value={attendees[index].email} onChange={e => setPerson(index, 'email', e.target.value)} placeholder="email@example.com" dir="ltr" />
                    </label>
                  </div>
                </section>
              ))}

              <section className="ws-card">
                <div className="ws-section-title">
                  <span>{attendeeCount + 2}</span>
                  <h2>اطلاعات فرزند</h2>
                </div>
                <div className="ws-fields">
                  <label className="ws-field">
                    <span className="ws-label">نام فرزند</span>
                    <input className="ws-input" required value={child.name} onChange={e => setChild(c => ({ ...c, name: e.target.value }))} placeholder="نام فرزند" />
                  </label>
                  <label className="ws-field">
                    <span className="ws-label">سن فرزند</span>
                    <input className="ws-input" required inputMode="numeric" maxLength={3} value={child.age} onChange={e => setChild(c => ({ ...c, age: normalizeDigits(e.target.value).slice(0, 3) }))} placeholder="مثلاً ۱۰" dir="ltr" />
                  </label>
                  <div className="ws-field full">
                    <span className="ws-label">جنسیت</span>
                    <div className="ws-radio-row" style={{ marginTop: 4 }}>
                      {['پسر', 'دختر'].map(g => (
                        <label key={g} className="ws-check">
                          <input type="radio" name="gender" checked={child.gender === g} onChange={() => setChild(c => ({ ...c, gender: g }))} />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="ws-field full">
                    <span className="ws-label">آیا فرزندتان در باشگاه داوینو عضو است؟</span>
                    <div className="ws-radio-row" style={{ marginTop: 4 }}>
                      {['بله', 'خیر'].map(opt => (
                        <label key={opt} className="ws-check">
                          <input type="radio" name="isMember" checked={child.isMember === opt} onChange={() => setChild(c => ({ ...c, isMember: opt }))} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="ws-card">
                <div className="ws-section-title">
                  <span>{attendeeCount + 3}</span>
                  <h2>دغدغه‌های شما</h2>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--t50)', marginBottom: 14 }}>امکان انتخاب چند گزینه</p>
                <div className="ws-check-grid">
                  {CONCERNS.map(item => (
                    <label key={item} className="ws-check">
                      <input type="checkbox" checked={concerns.includes(item)} onChange={() => toggleConcern(item)} />
                      {item}
                    </label>
                  ))}
                </div>
                {concerns.includes('مورد دیگر') && (
                  <label className="ws-field full" style={{ marginTop: 14 }}>
                    <span className="ws-label">مورد دیگر</span>
                    <input className="ws-input" value={concernOther} onChange={e => setConcernOther(e.target.value)} placeholder="توضیح دهید…" />
                  </label>
                )}
              </section>

              <section className="ws-card">
                <div className="ws-section-title">
                  <span>{attendeeCount + 4}</span>
                  <h2>انتظار شما از کارگاه چیست؟</h2>
                </div>
                <textarea className="ws-input" required rows={4} value={expectation} onChange={e => setExpectation(e.target.value)} placeholder="انتظارات خود را بنویسید…" style={{ resize: 'vertical', minHeight: 110 }} />
              </section>

              <section className="ws-card">
                <div className="ws-section-title">
                  <span>{attendeeCount + 5}</span>
                  <h2>از کجا با این کارگاه آشنا شدید؟</h2>
                </div>
                <div className="ws-check-grid">
                  {HEARD_OPTIONS.map(item => (
                    <label key={item} className="ws-check">
                      <input type="radio" name="heardFrom" checked={heardFrom === item} onChange={() => setHeardFrom(item)} />
                      {item}
                    </label>
                  ))}
                </div>
                {heardFrom === 'سایر' && (
                  <label className="ws-field full" style={{ marginTop: 14 }}>
                    <span className="ws-label">سایر</span>
                    <input className="ws-input" value={heardOther} onChange={e => setHeardOther(e.target.value)} placeholder="توضیح دهید…" />
                  </label>
                )}
              </section>

              <section className="ws-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--t45)', fontWeight: 800, marginBottom: 6 }}>هزینه ثبت‌نام</div>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>{price} <small style={{ fontSize: 13, fontWeight: 600, color: 'var(--t50)' }}>تومان</small></div>
                  <div style={{ fontSize: 12, color: 'var(--t50)', marginTop: 4 }}>{attendeeCount === 2 ? 'پدر و مادر' : 'هر نفر'}</div>
                </div>
                <button type="submit" disabled={sending} style={{ minWidth: 180, minHeight: 48, padding: '0 28px', borderRadius: 11, background: 'var(--accent)', color: '#fff', fontSize: 15, fontWeight: 900, opacity: sending ? .65 : 1 }}>
                  {sending ? 'در حال ثبت…' : 'ثبت‌نام'}
                </button>
              </section>

              {error && (
                <div role="alert" style={{ fontSize: 13, color: '#ef4444', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', padding: '12px 14px', borderRadius: 11, lineHeight: 1.7, marginBottom: 8 }}>
                  {error}
                </div>
              )}
            </form>
          </>
        )}
      </main>
    </div>
  )
}
