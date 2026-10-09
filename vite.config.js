import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served from https://whokin.github.io/hugs-counter/ on GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/hugs-counter/',
})
