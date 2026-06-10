import { useState } from 'react'
import Logo from '../../components/Logo'

const PASS = 'davino1394'

export default function AdminLogin({ onLogin }) {
  const [pass, setPass] = useState('')
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
      background: 'linear-gradient(135deg, #0f0a06 0%, #1a0f08 50%, #0d0d0d 100%)',
      fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl',
    }}>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        .login-input {
          width: 100%; background: rgba(255,255,255,.06); border: 1.5px solid rgba(255,255,255,.1);
          border-radius: 12px; padding: 14px 16px; color: #fff; font-size: 15px;
          font-family: 'Vazirmatn', sans-serif; outline: none; transition: border-color .2s;
          box-sizing: border-box;
        }
        .login-input:focus { border-color: #EA443C; }
        .login-input.error { border-color: #f87171; }
        .login-btn {
          width: 100%; background: #EA443C; color: #fff; border: none; border-radius: 12px;
          padding: 14px; font-size: 15px; font-weight: 800; cursor: pointer;
          font-family: 'Vazirmatn', sans-serif; transition: all .2s;
          box-shadow: 0 8px 24px rgba(234,68,60,.35);
        }
        .login-btn:hover { background: #d63830; transform: translateY(-1px); }
      `}</style>

      <div style={{
        background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 400,
        backdropFilter: 'blur(20px)',
        animation: shake ? 'shake 0.5s ease' : 'none',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Logo size={1.1} dark />
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginTop: 12 }}>پنل مدیریت داوینو</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', display: 'block', marginBottom: 8 }}>
              رمز عبور
            </label>
            <input
              type="password"
              className={`login-input${error ? ' error' : ''}`}
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false) }}
              placeholder="رمز عبور را وارد کنید"
              autoFocus
            />
            {error && <p style={{ color: '#f87171', fontSize: 12, marginTop: 6 }}>رمز عبور اشتباه است</p>}
          </div>
          <button type="submit" className="login-btn">ورود به پنل</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,.2)' }}>
          رمز پیش‌فرض: davino1394
        </p>
      </div>
    </div>
  )
}
