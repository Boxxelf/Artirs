import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Change this to your repository name for GitHub Pages
  // For local development, use '/'
  base: process.env.NODE_ENV === 'production' ? '/artris-web-demo/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
