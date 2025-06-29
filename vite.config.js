import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'chart.js', 'react-chartjs-2']
  }
})
