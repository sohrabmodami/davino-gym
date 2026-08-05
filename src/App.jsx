import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Management from './components/Management'
import Services from './components/Services'
import ClimbingWallService from './components/ClimbingWallService'
import Trainers from './components/Trainers'
import Gallery from './components/Gallery'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ClassesPreview from './components/ClassesPreview'
import TrainerProfile from './pages/TrainerProfile'
import Classes from './pages/Classes'
import Register from './pages/Register'
import WorkshopRegister from './pages/WorkshopRegister'
import Blog from './pages/Blog'
import Article from './pages/Article'
import WallConstruction from './pages/WallConstruction'
import AdminApp from './pages/admin/AdminApp'
import ErrorBoundary from './components/ErrorBoundary'
import { AdminProvider, useAdmin } from './data/adminStore.jsx'

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="dv-spinner" />
      <style>{`
        .dv-spinner { width: 38px; height: 38px; border-radius: 50%; border: 3px solid var(--surface-b); border-top-color: var(--accent); animation: dvSpin .8s linear infinite; }
        @keyframes dvSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function HomePage() {
  const { ready } = useAdmin()
  // تا وقتی داده‌ی واقعی (سرور یا کش) آماده نشده، به‌جای فلش‌شدن داده‌ی پیش‌فرض لودر نشان بده
  if (!ready) return <PageLoader />
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Management />
        <Services />
        <ClimbingWallService />
        <Trainers />
        <ClassesPreview />
        <Gallery />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
          <Route path="/trainer/:id" element={<ErrorBoundary><TrainerProfile /></ErrorBoundary>} />
          <Route path="/classes" element={<ErrorBoundary><Classes /></ErrorBoundary>} />
          <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
          <Route path="/workshop" element={<ErrorBoundary><WorkshopRegister /></ErrorBoundary>} />
          <Route path="/blog" element={<ErrorBoundary><Blog /></ErrorBoundary>} />
          <Route path="/blog/:slug" element={<ErrorBoundary><Article /></ErrorBoundary>} />
          <Route path="/wall-construction" element={<ErrorBoundary><WallConstruction /></ErrorBoundary>} />
          <Route path="/admin/*" element={<ErrorBoundary><AdminApp /></ErrorBoundary>} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}
