/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Shown in Settings, so you can tell which version a device is running.
function version(): string {
  let commit = 'local'
  try {
    commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    // Not a git checkout: keep "local".
  }
  return `${commit} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`
}

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(version()) },
  plugins: [
    react(),
    tailwindcss(),
    // Installable on phones and usable offline: the app shell, fonts and content are cached.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'fluéncy',
        short_name: 'fluéncy',
        description: 'A personal language-learning app.',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#efe7dd',
        theme_color: '#efe7dd',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Sync calls go to api.github.com and are never cached.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Recorded audio is cached as it is played, so anything you have heard works offline.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/audio/') && url.pathname.endsWith('.mp3'),
            handler: 'CacheFirst',
            options: { cacheName: 'audio', expiration: { maxEntries: 5000 } },
          },
          {
            // The list of recordings changes when lines are re-recorded, so check online first.
            urlPattern: ({ url }) => url.pathname.endsWith('/manifest.json') && url.pathname.includes('/audio/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'audio-manifest' },
          },
        ],
      },
    }),
  ],
  // Relative base so the built app works from any folder or GitHub Pages path.
  base: './',
  server: { host: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
