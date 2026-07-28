import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      // Il service worker si aggiorna da solo: le impostazioni stanno in
      // localStorage, quindi un reload silenzioso non fa perdere niente.
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tavolante — Distributore di carte',
        short_name: 'Tavolante',
        description:
          'Calcola da quale giocatore iniziare a distribuire le carte nel Murlan.',
        lang: 'it',
        id: '/',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#092820',
        theme_color: '#092820',
        categories: ['games', 'utilities'],
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico}'],
        // La copertina delle condivisioni la scaricano i crawler, non l'app:
        // precacharla sul telefono sarebbero 70 kB buttati.
        globIgnores: ['**/og-cover.png'],
        // I font arrivano dalla CDN di Google: senza cache l'app installata
        // ripiegherebbe sui font di sistema appena si va offline.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // Permette di provare install e offline con `npm run dev`.
        enabled: true,
        type: 'module',
      },
    }),
  ],
})
