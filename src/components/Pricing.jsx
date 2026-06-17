import { useState } from 'react'
import { useAdmin } from '../data/adminStore.jsx'

/* «۴۸۰,۰۰۰» → «۴۸۰» برای نمایش بزرگ + واحد جدا */

const CheckIcon = ({ color }) => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const SINGLE_ICONS = {
  free: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="17" cy="5" r="1"/><path d="M9 11l2 2 1-3 3 5h2"/><path d="M5 21l3-7 4 2 1 5"/><path d="M8 14l-1-3"/></svg>,
  private: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M19 8l1 2 2 .5-1.5 1.5.5 2-2-1-2 1 .5-2L16 10.5l2-.5z"/></svg>,
  fun: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
}

const tint = (hex, a) => {
  if (!hex || hex[0] !== '#' || hex.length < 7) return `rgba(234,68,60,${a})`
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

/* کارت گروهی پرطرفدار — همیشه تیره (انتخاب دیزاین) */
function GroupCardPopular({ plan }) {
  return (
    <div style={{
      position: 'relative', background: 'linear-gradient(160deg, #1a1013, #120d0c)',
      border: '2px solid var(--accent)', borderRadius: 24, padding: '40px 28px',
      boxShadow: '0 24px 70px rgba(234,68,60,.18)',
    }}>
      <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: 11, padding: '5px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>⭐ پرطرفدارترین</div>
      <div style={{ paddingTop: 20 }}>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent)', margin: '0 0 6px' }}>{plan.name}</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', margin: '0 0 24px' }}>{plan.sub}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 4 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{plan.price}</span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>تومان</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', margin: '0 0 28px' }}>{plan.unit || plan.period}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
          {plan.features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: 'rgba(234,68,60,.2)', border: '1px solid rgba(234,68,60,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckIcon color="#EA443C" /></span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.78)' }}>{f}</span>
            </div>
          ))}
        </div>
        <a href="#contact" style={{ display: 'block', textAlign: 'center', width: '100%', padding: 14, borderRadius: 12, fontWeight: 800, fontSize: 14, background: 'var(--accent)', color: '#fff', boxShadow: '0 8px 24px rgba(234,68,60,.4)', transition: 'all .2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >{plan.cta}</a>
      </div>
    </div>
  )
}

function GroupCardRegular({ plan }) {
  /* کارت گروهیِ معمولی هم مشکی با گرادیانت ملایم (انتخاب کاربر) */
  return (
    <div
      style={{ background: 'linear-gradient(160deg, #211a1c 0%, #131011 100%)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 24, padding: '32px 28px', transition: 'all .3s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(234,68,60,.5)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)' }}
    >
      <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>{plan.name}</h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', margin: '0 0 24px' }}>{plan.sub}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 4 }}>
        <span style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{plan.price}</span>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>تومان</span>
      </div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', margin: '0 0 28px' }}>{plan.unit || plan.period}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: 'rgba(234,68,60,.2)', border: '1px solid rgba(234,68,60,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckIcon color="#EA443C" /></span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.78)' }}>{f}</span>
          </div>
        ))}
      </div>
      <a href="#contact" style={{ display: 'block', textAlign: 'center', width: '100%', padding: 13, borderRadius: 12, fontWeight: 700, fontSize: 14, background: 'rgba(255,255,255,.06)', color: '#fff', border: '1.5px solid rgba(255,255,255,.2)', transition: 'all .2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(234,68,60,.15)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)'; e.currentTarget.style.background = 'rgba(255,255,255,.06)' }}
      >{plan.cta}</a>
    </div>
  )
}

function SingleCard({ plan }) {
  return (
    <div
      style={{ background: 'var(--surface)', border: '1px solid var(--surface-b)', borderRadius: 20, padding: 24, transition: 'all .28s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = tint(plan.color, .4) }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--surface-b)' }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 13, background: tint(plan.color, .12), border: `1px solid ${tint(plan.color, .25)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: plan.color, marginBottom: 16 }}>
        {SINGLE_ICONS[plan.icon] || SINGLE_ICONS.free}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', margin: '0 0 2px' }}>{plan.name}</h3>
      <p style={{ fontSize: 12.5, color: 'var(--t45)', margin: '0 0 16px' }}>{plan.sub}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 16 }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{plan.price}</span>
        <span style={{ fontSize: 12, color: 'var(--t50)' }}>تومان / {plan.unit?.replace(/^هر /, '') || 'جلسه'}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckIcon color={plan.color} />
            <span style={{ fontSize: 12.5, color: 'var(--t60)' }}>{f}</span>
          </div>
        ))}
      </div>
      <a href="#contact" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: plan.color }}>
        {plan.cta}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </a>
    </div>
  )
}

export default function Pricing() {
  const { pricing } = useAdmin()

  const groupPlans = pricing.filter(p => p.kind === 'group')
  const singlePlans = pricing.filter(p => p.kind === 'single')
  const audiences = [...new Set(groupPlans.map(p => p.audience))]
  const [audience, setAudience] = useState(audiences[0] || 'بزرگسالان')

  /* دو کارت گروهیِ مخاطب انتخاب‌شده، مرتب بر اساس تعداد جلسه */
  const shown = groupPlans
    .filter(p => p.audience === audience)
    .sort((a, b) => (a.sessions || 0) - (b.sessions || 0))

  return (
    <section id="pricing" style={{ padding: 'clamp(70px, 8vw, 100px) clamp(24px, 4vw, 40px)', background: 'var(--bg)', transition: 'background .3s' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '.14em', background: 'rgba(234,68,60,.1)', border: '1px solid rgba(234,68,60,.22)', borderRadius: 999, padding: '6px 15px', marginBottom: 16 }}>تعرفه‌ها</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-.01em', margin: '0 0 12px', color: 'var(--text)' }}>پکیج مناسبت رو انتخاب کن</h2>
          <p style={{ fontSize: 16, color: 'var(--t50)', maxWidth: 420, margin: '0 auto', lineHeight: 1.75 }}>بدون قرارداد اجباری — هر وقت خواستی لغو کن</p>
        </div>

        {/* ── کلاس‌های گروهی ── */}
        {groupPlans.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>کلاس‌های گروهی</span>
              <div style={{ flex: 1, height: 1, background: 'var(--line)', minWidth: 20 }} />
              {/* سوییچ مخاطب */}
              <div style={{ display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--surface-b)', borderRadius: 999, padding: 3 }}>
                {audiences.map(a => (
                  <button key={a} onClick={() => setAudience(a)} style={{
                    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                    fontSize: 13, fontWeight: 700, padding: '7px 18px', borderRadius: 999,
                    background: audience === a ? 'var(--accent)' : 'transparent',
                    color: audience === a ? '#fff' : 'var(--t60)',
                    transition: 'all .2s',
                  }}>{a}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, alignItems: 'stretch', marginBottom: 48 }}>
              {shown.map(plan => plan.popular
                ? <GroupCardPopular key={plan.id} plan={plan} />
                : <GroupCardRegular key={plan.id} plan={plan} />
              )}
            </div>
          </>
        )}

        {/* ── تک‌جلسه و دسترسی آزاد ── */}
        {singlePlans.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>تک‌جلسه و دسترسی آزاد</span>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
              {singlePlans.map(plan => <SingleCard key={plan.id} plan={plan} />)}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
