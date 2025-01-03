import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/tarkov-graph/',
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
})
