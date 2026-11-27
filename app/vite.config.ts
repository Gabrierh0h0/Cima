import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.svg', 'icons/favicon.ico', 'icons/apple-touch-icon.png', 'fonts/*.woff2'],
      manifest: {
        name: 'Cima',
        short_name: 'Cima',
        description: 'Tu rutina, serie por serie.',
        lang: 'es-CO',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#141312',
        theme_color: '#141312',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,woff2,png,svg,ico}'], navigateFallback: 'index.html' },
    }),
  ],
  test: { environment: 'node' },
})
