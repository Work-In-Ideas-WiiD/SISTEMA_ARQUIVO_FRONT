import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  base: process.env.BASE_PATH || '/',
  plugins: [vue()],
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : undefined,
  build: {
    sourcemap: false
  },
  server: {
    // Libera acesso via túnel (cloudflared/ngrok) em testes locais
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``
      }
    }
  }
}))
