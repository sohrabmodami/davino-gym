import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ManagementSection from '../components/Management'
import useSeo from '../hooks/useSeo'

export default function Management() {
  useSeo({
    title: 'درباره مدیریت مجموعه | آکادمی سنگنوردی داوینو',
    description: 'آشنایی با مهدی بنهری، مدیرعامل آکادمی سنگنوردی داوینو و رئیس هیئت‌مدیره شرکت پیشگام تدبیر داوین.',
    keywords: 'مهدی بنهری, مدیریت داوینو, مدیرعامل داوینو, گروه داوین, آکادمی سنگنوردی داوینو',
  })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', direction: 'rtl' }}>
        <ManagementSection asPage />
      </main>
      <Footer />
    </>
  )
}
