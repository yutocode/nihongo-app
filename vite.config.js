// vite.config.js
// @ts-check
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/**
 * 先頭/末尾スラッシュを整形
 * @param {string=} input
 * @returns {string}
 */
function ensureSlash(input) {
  if (!input) return "/";
  let v = input.trim();
  if (!v.startsWith("/")) v = `/${v}`;
  if (!v.endsWith("/")) v = `${v}/`;
  return v;
}

/**
 * GitHub Pages と iOS(Capacitor) で base を切り替え
 * @param {string} mode
 * @param {Record<string, string>} env
 * @returns {string}
 */
function resolveBase(mode, env) {
  if (env.VITE_BASE) return ensureSlash(env.VITE_BASE);

  if (env.VITE_DEPLOY_TARGET === "gh") {
    const repoFromEnv =
      env.VITE_REPO_NAME ||
      (env.GITHUB_REPOSITORY ? env.GITHUB_REPOSITORY.split("/").pop() : "");
    const repo = repoFromEnv || "nihongo-app";
    return `/${repo}/`;
  }
  return "/";
}

export default defineConfig(({ mode }) => {
  /** @type {Record<string, string>} */
  const env = loadEnv(mode, process.cwd(), "");
  const BASE = resolveBase(mode, env);

  return {
    plugins: [
      react({
        jsxRuntime: "automatic",
        babel: { plugins: [] },
      }),
    ],

    // Router の basename と一致（import.meta.env.BASE_URL）
    base: BASE,

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      // React の重複バンドル防止
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
            firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          },
        },
      },
      esbuild: {
        target: "es2020",
        // iOS 実機デバッグ用に console / debugger を消さない
        drop: [],
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