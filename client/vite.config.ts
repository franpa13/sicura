import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo el backend se sirve por el proxy: el navegador ve un
    // solo origen (localhost:5173) y las cookies httpOnly viajan solas,
    // sin CORS ni SameSite que pelear.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
