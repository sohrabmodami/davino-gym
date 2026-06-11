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

const SESSION_KEY = 'davino_admin_auth'

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')

  const login = () => { sessionStorage.setItem(SESSION_KEY, '1'); setAuthed(true) }
  const logout = () => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false) }

  if (!authed) return <AdminLogin onLogin={login} />

  return (
    <AdminLayout onLogout={logout}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/trainers" element={<AdminTrainers />} />
        <Route path="/pricing" element={<AdminPricing />} />
        <Route path="/gallery" element={<AdminGallery />} />
        <Route path="/classes" element={<AdminClasses />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}
