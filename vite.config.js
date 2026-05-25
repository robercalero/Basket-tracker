import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  build: { outDir: "dist" },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png", "icons/*.svg"],
      manifest: {
        name: "Basket Tracker",
        short_name: "Basket Tracker",
        description: "Registro y seguimiento de entrenamientos de baloncesto",
        start_url: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#06060C",
        theme_color: "#06060C",
        categories: ["fitness", "sports", "health"],
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
          { src: "icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{html,css,js,json,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*/,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ],
});
