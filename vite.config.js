import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/AfricaLegal1.0.1/', // exatamente o nome do repo
  plugins: [react(), tailwindcss()],
})
