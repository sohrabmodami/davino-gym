import { useState } from 'react'
import Logo from '../../components/Logo'

const PASS = 'davino1394'

export default function AdminLogin({ onLogin }) {
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (pass === PASS) {
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0f0f11',
      fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl', padding: 20,
    }}>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .admin-login-input {
          width: 100%; background: rgba(255,255,255,.05); border: 1.5px solid rgba(255,255,255,.1);
          border-radius: 12px; padding: 13px 16px; color: #fff; font-size: 14px;
          font-family: 'Vazirmatn', sans-serif; outline: none; transition: border-color .2s, background .2s;
          box-sizing: border-box;
        }
        .admin-login-input:focus { border-color: #EA443C; background: rgba(234,68,60,.05); }
        .admin-login-input.error { border-color: #f87171 !important; }
        .admin-login-btn {
          width: 100%; background: #EA443C; color: #fff; border: none; border-radius: 12px;
          padding: 13px; font-size: 15px; font-weight: 800; cursor: pointer;
          font-family: 'Vazirmatn', sans-serif; transition: all .2s;
          box-shadow: 0 4px 20px rgba(234,68,60,.4); letter-spacing: .3px;
        }
        .admin-login-btn:hover { background: #d63830; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(234,68,60,.5); }
        .admin-login-btn:active { transform: translateY(0); }
        .eye-btn { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: rgba(255,255,255,.35); padding: 4px; display: flex; transition: color .15s; }
        .eye-btn:hover { color: rgba(255,255,255,.6); }
      `}</style>

      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(234,68,60,.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(234,68,60,.05) 0%, transparent 40%)', pointerEvents: 'none' }} />

      <div style={{
        background: 'rgba(255,255,255,.04)',
        border: '1px solid rgba(255,255,255,.09)',
        borderRadius: 24, padding: '44px 40px',
        width: '100%', maxWidth: 400,
        backdropFilter: 'blur(24px)',
        position: 'relative', zIndex: 1,
        animation: shake ? 'shake .5s ease' : 'fadeUp .5s ease both',
        boxShadow: '0 24px 80px rgba(0,0,0,.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Logo size={1.0} dark />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(234,68,60,.1)', border: '1px solid rgba(234,68,60,.2)', borderRadius: 999, padding: '4px 14px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EA443C" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span style={{ fontSize: 12, color: '#EA443C', fontWeight: 700 }}>پنل مدیریت</span>
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', display: 'block', marginBottom: 7, fontWeight: 600 }}>
              رمز عبور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                className={`admin-login-input${error ? ' error' : ''}`}
                value={pass}
                onChange={e => { setPass(e.target.value); setError(false) }}
                placeholder="رمز عبور را وارد کنید"
                autoFocus
              />
              <button type="button" className="eye-btn" onClick={() => setShow(s => !s)}>
                {show
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ color: '#f87171', fontSize: 12, fontWeight: 500 }}>رمز عبور اشتباه است</span>
              </div>
            )}
          </div>
          <button type="submit" className="admin-login-btn">ورود به پنل</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,.18)' }}>
          رمز پیش‌فرض: davino1394
        </p>
      </div>
    </div>
  )
}
