import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import AdminDashboard from './AdminDashboard'
import AdminTrainers from './AdminTrainers'
import AdminPricing from './AdminPricing'
import AdminGallery from './AdminGallery'
import AdminSettings from './AdminSettings'
import AdminClasses from './AdminClasses'
import AdminBlog from './AdminBlog'
import AdminMessages from './AdminMessages'
import AdminRegistrations from './AdminRegistrations'
import AdminWorkshop from './AdminWorkshop'

const SESSION_KEY = 'davino_admin_auth'
const TOKEN_KEY = 'davino_admin_token'

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')

  // توکن (رمز ادمین) را نگه می‌داریم تا store بتواند تغییرات را روی سرور ذخیره کند
  const login = (token) => {
    sessionStorage.setItem(SESSION_KEY, '1')
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    setAuthed(true)
  }
  const logout = async () => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      await fetch('/api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch { /* ignore */ }
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    setAuthed(false)
  }

  if (!authed) return <AdminLogin onLogin={login} />

  return (
    <AdminLayout onLogout={logout}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/trainers" element={<AdminTrainers />} />
        <Route path="/pricing" element={<AdminPricing />} />
        <Route path="/gallery" element={<AdminGallery />} />
        <Route path="/classes" element={<AdminClasses />} />
        <Route path="/blog" element={<AdminBlog />} />
        <Route path="/messages" element={<AdminMessages />} />
        <Route path="/registrations" element={<AdminRegistrations />} />
        <Route path="/workshop" element={<AdminWorkshop />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}
