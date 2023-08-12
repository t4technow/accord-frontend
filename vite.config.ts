import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import  path from 'path';

const manifestForPlugin: Partial<VitePWAOptions> ={
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    "short_name": "Accord",
    "name": "Accord: Chat with privacy",
    "icons": [
      {
        "src": "/icons/manifest-icon-512.maskable.png",
        "type": "image/png",
        "sizes": "512x512"
      },
      {
        "src": "/icons/manifest-icon-192.maskable.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "/icons/manifest-icon-512.maskable.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ],
    "id": "/?source=pwa",
    "start_url": "/?source=pwa",
    "background_color": "#3367D6",
    "display": "standalone",
    "scope": "/",
    "theme_color": "#3367D6",
    // "shortcuts": [
    //   {
    //     "name": "How's weather today?",
    //     "short_name": "Today",
    //     "description": "View weather information for today",
    //     "url": "/today?source=pwa",
    //     "icons": [{ "src": "/images/today.png", "sizes": "192x192" }]
    //   },
    //   {
    //     "name": "How's weather tomorrow?",
    //     "short_name": "Tomorrow",
    //     "description": "View weather information for tomorrow",
    //     "url": "/tomorrow?source=pwa",
    //     "icons": [{ "src": "/images/tomorrow.png", "sizes": "192x192" }]
    //   }
    // ],
    "description": "Chat app with all the features you could imagine",
    // "screenshots": [
    //   {
    //     "src": "/images/screenshot1.png",
    //     "type": "image/png",
    //     "sizes": "540x720",
    //     "form_factor": "narrow"
    //   },
    //   {
    //     "src": "/images/screenshot2.jpg",
    //     "type": "image/jpg",
    //     "sizes": "720x540",
    //     "form_factor": "wide"
    //   }
    // ]
  },
  srcDir: path.resolve(__dirname, 'public'),
      filename: 'NotificationWorker.js',
      strategies: 'injectManifest',
}

// https://vitejs.dev/config/
export default defineConfig({
  server: { https: false, host: true },
  plugins: [react(),
    VitePWA(manifestForPlugin),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   outDir: path.resolve(__dirname, 'public'),
    //   injectRegister: false, // I register SW in app.ts, disable auto registration

    //   // HERE! For custom service worker
      

    //   workbox: {
    //     globDirectory: path.resolve(__dirname, 'public'),
    //     globPatterns: [
    //       '{build,images,sounds,icons}/**/*.{js,css,html,ico,png,jpg,mp4,svg}'
    //     ],
    //   },
    //   devOptions: {
    //     enabled: true,
    //     type: 'module',
    //   },
    // })
],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
})
