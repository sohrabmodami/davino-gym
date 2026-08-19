import { useState } from 'react'

const PRESETS = {
  workshop: {
    number: '5022291080100272',
    display: '5022  2910  8010  0272',
    holder: 'الهه ویشه',
    bankLabel: 'DEBIT',
    brand: 'davino',
    themeClass: 'ws-bank-card--blue',
  },
  natureKids: {
    number: '6219861884441865',
    display: '6219  8618  8444  1865',
    holder: 'محمد مهدی بنهری',
    bankLabel: 'blu bank',
    brand: 'blu',
    themeClass: 'ws-bank-card--blu',
  },
}

const CSS = `
  .ws-bank-card {
    position: relative; width: 100%; max-width: 380px; margin: 0 auto 18px;
    aspect-ratio: 1.586; border-radius: 18px; overflow: hidden;
    color: #fff; box-shadow: 0 18px 40px rgba(0, 0, 0, .22), 0 2px 0 rgba(255,255,255,.08) inset;
    text-align: left; direction: ltr; isolation: isolate;
  }
  .ws-bank-card--blue {
    background: linear-gradient(145deg, #163a6e 0%, #275EAA 48%, #1E4A8A 100%);
    box-shadow: 0 18px 40px rgba(39, 94, 170, .32), 0 2px 0 rgba(255,255,255,.08) inset;
  }
  .ws-bank-card--blu {
    background: linear-gradient(145deg, #6b4a28 0%, #a67c52 42%, #8b6238 100%);
    box-shadow: 0 18px 40px rgba(107, 74, 40, .35), 0 2px 0 rgba(255,255,255,.1) inset;
  }
  .ws-bank-card::before {
    content: ''; position: absolute; inset: -40% -20% auto auto; width: 70%; height: 90%;
    background: radial-gradient(circle, rgba(255,255,255,.18) 0%, transparent 68%);
    pointer-events: none;
  }
  .ws-bank-card::after {
    content: ''; position: absolute; inset: auto auto -45% -25%; width: 75%; height: 95%;
    background: radial-gradient(circle, rgba(255,255,255,.08) 0%, transparent 65%);
    pointer-events: none;
  }
  .ws-bank-shine {
    position: absolute; inset: 0;
    background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,.08) 48%, transparent 62%);
    pointer-events: none;
  }
  .ws-bank-inner {
    position: relative; z-index: 1; height: 100%;
    padding: clamp(18px, 4.5vw, 24px); display: flex; flex-direction: column; justify-content: space-between;
  }
  .ws-bank-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .ws-bank-chip {
    width: 42px; height: 32px; border-radius: 7px;
    background: linear-gradient(135deg, #e8c878 0%, #c9a24a 40%, #f0d78a 70%, #b8903e 100%);
    box-shadow: 0 2px 6px rgba(0,0,0,.25);
    position: relative; overflow: hidden;
  }
  .ws-bank-chip::before, .ws-bank-chip::after {
    content: ''; position: absolute; left: 0; right: 0; height: 1px; background: rgba(120,80,20,.35);
  }
  .ws-bank-chip::before { top: 33%; }
  .ws-bank-chip::after { top: 66%; }
  .ws-bank-contactless {
    width: 28px; height: 28px; color: rgba(255,255,255,.75);
  }
  .ws-bank-number {
    font: 700 clamp(17px, 4.6vw, 22px) var(--font-latin);
    letter-spacing: .14em; color: #fff; margin: 8px 0 0;
    text-shadow: 0 1px 2px rgba(0,0,0,.25);
  }
  .ws-bank-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
  .ws-bank-label { font: 600 9px var(--font-latin); letter-spacing: .16em; color: rgba(255,255,255,.45); text-transform: uppercase; margin-bottom: 4px; }
  .ws-bank-name { font: 700 14px var(--font-body); color: rgba(255,255,255,.95); letter-spacing: .02em; }
  .ws-bank-copy {
    border: 1px solid rgba(255,255,255,.22); background: rgba(255,255,255,.08);
    color: #fff; border-radius: 999px; padding: 6px 12px; font: 700 11px var(--font-body);
    backdrop-filter: blur(6px); cursor: pointer; white-space: nowrap;
  }
  .ws-bank-copy:hover { background: rgba(255,255,255,.16); }
  .ws-bank-blu-logo {
    font: 800 22px var(--font-latin); letter-spacing: -.02em; line-height: 1;
  }
  .ws-bank-blu-tag {
    font: 600 9px var(--font-latin); letter-spacing: .04em; color: rgba(255,255,255,.55); margin-top: 4px;
  }
`

export default function BankCard({ variant = 'workshop' }) {
  const preset = PRESETS[variant] || PRESETS.workshop
  const [copied, setCopied] = useState(false)
  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(preset.number)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* ignore */ }
  }
  return (
    <>
      <style>{CSS}</style>
      <div className={`ws-bank-card ${preset.themeClass}`} role="img" aria-label={`شماره کارت ${preset.display} به نام ${preset.holder}`}>
        <div className="ws-bank-shine" aria-hidden="true" />
        <div className="ws-bank-inner">
          <div className="ws-bank-top">
            <div>
              {preset.brand === 'blu' ? (
                <div>
                  <div className="ws-bank-blu-logo">blu</div>
                  <div className="ws-bank-blu-tag">bank, but lovely</div>
                </div>
              ) : (
                <img src="/davino-logo-light.png" alt="Davino" style={{ height: 28, width: 'auto', display: 'block' }} />
              )}
              <div style={{ marginTop: 14 }} className="ws-bank-chip" aria-hidden="true" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <svg className="ws-bank-contactless" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M8.5 8.5c2.2 2.2 2.2 5.8 0 8M12 6c3.9 3.9 3.9 10.1 0 14M15.5 3.5c5.5 5.5 5.5 14.5 0 20" />
              </svg>
              <button type="button" className="ws-bank-copy" onClick={copyNumber}>{copied ? 'کپی شد' : 'کپی شماره'}</button>
            </div>
          </div>
          <div className="ws-bank-number">{preset.display}</div>
          <div className="ws-bank-bottom">
            <div>
              <div className="ws-bank-label">Card Holder</div>
              <div className="ws-bank-name">{preset.holder}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="ws-bank-label">Bank Card</div>
              <div style={{ font: '700 12px var(--font-latin)', color: 'rgba(255,255,255,.7)', letterSpacing: '.08em' }}>{preset.bankLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
