import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Per compatibilità con CRA
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})