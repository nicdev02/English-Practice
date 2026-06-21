import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to your GitHub repo name for GitHub Pages, e.g. '/english-speaking-practice/'
export default defineConfig({
  plugins: [react()],
  base: '/English-Practice/',
})
