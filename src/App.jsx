import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Trainers from './components/Trainers'
import Gallery from './components/Gallery'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ClassesPreview from './components/ClassesPreview'
import TrainerProfile from './pages/TrainerProfile'
import Classes from './pages/Classes'
import AdminApp from './pages/admin/AdminApp'
import { AdminProvider } from './data/adminStore.jsx'

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
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
          <Route path="/" element={<HomePage />} />
          <Route path="/trainer/:id" element={<TrainerProfile />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}
