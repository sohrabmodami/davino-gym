import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // در حالت توسعه، درخواست‌های /api به سرور Node (پورت ۳۰۰۱) فوروارد می‌شوند
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
