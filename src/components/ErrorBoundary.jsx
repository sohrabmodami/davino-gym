import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0f0f11', color: '#fff',
          fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl', padding: 20,
          textAlign: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>خطایی رخ داد</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', marginBottom: 20, maxWidth: 400 }}>
              صفحه مورد نظر با مشکل مواجه شد. لطفاً صفحه را重新 بارگذاری کن.
            </p>
            <button onClick={() => window.location.reload()}
              style={{
                background: '#EA443C', color: '#fff', border: 'none', borderRadius: 12,
                padding: '12px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                fontFamily: 'Vazirmatn, sans-serif',
              }}>
              بارگذاری مجدد
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
