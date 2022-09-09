import { defineConfig } from "vite";
import { VitePWA, cachePreset } from "vite-plugin-pwa";

type RuntimeCaching = typeof cachePreset[number];

function buildRuntimeCachingEntry(
  urlPattern: RegExp,
  cacheName: string
): RuntimeCaching {
  return {
    urlPattern,
    handler: "CacheFirst",
    options: {
      cacheName,
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  };
}

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      registerType: "prompt",
      srcDir: "./src",
      filename: "sw.ts",
      includeAssets: ["assets/**/*"],
      workbox: {
        runtimeCaching: [
          buildRuntimeCachingEntry(
            /^https:\/\/fonts\.googleapis\.com\/.*/i,
            "google-fonts-cache"
          ),
          buildRuntimeCachingEntry(
            /^https:\/\/fonts\.gstatic\.com\/.*/i,
            "gstatic-fonts-cache"
          ),
        ],
      },
    }),
  ],
});
