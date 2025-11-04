// vite.config.js
// @ts-check
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  // .env, .env.development, .env.production を読み込み
  const env = loadEnv(mode, process.cwd(), "");
  const BASE = env.VITE_BASE ?? "./"; // GitHub Pagesなら "/<repo>/"、Netlify等は "./"

  return {
    plugins: [
      react({
        jsxRuntime: "automatic",
        babel: { plugins: [] },
      }),
    ],

    base: BASE,

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
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
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            i18n: ["i18next", "react-i18next"],
            firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          },
        },
      },
    },

    assetsInclude: ["**/*.mp3", "**/*.wav", "**/*.m4a"],

    optimizeDeps: {
      esbuildOptions: { target: "es2020" },
    },

    envPrefix: "VITE_",
  };
});
