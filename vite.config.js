// vite.config.js
// @ts-check
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({
        jsxRuntime: "automatic",
        babel: { plugins: [] },
      }),
    ],

    // ←★ iOS / Netlify 用は常にルート配信
    base: "/",

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      dedupe: ["react", "react-dom"],
    },

    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      open: false,
    },

    preview: {
      host: "0.0.0.0",
      port: 5174,
      strictPort: true,
    },

    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
      target: "es2020",
      cssCodeSplit: true,
      minify: "esbuild",
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            i18n: ["i18next", "react-i18next"],
            firebase: [
              "firebase/app",
              "firebase/auth",
              "firebase/firestore",
            ],
          },
        },
      },
      esbuild: {
        target: "es2020",
        drop: [], // iOS デバッグ用に console を消さない
        legalComments: "none",
      },
    },

    assetsInclude: ["**/*.mp3", "**/*.wav", "**/*.m4a"],

    optimizeDeps: {
      esbuildOptions: { target: "es2020" },
    },

    envPrefix: ["VITE_"],

    define: {
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version ?? "0.0.0",
      ),
    },
  };
});