// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// ================================
// 🚀 Vite + React 設定（最新版）
// ================================
export default defineConfig({
  plugins: [react()],

  // 📦 相対パスでビルド（Netlify / GitHub Pages対応）
  base: "./",

  // 🧭 import エイリアス設定
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // "@/..." → src/
    },
  },

  // 🌐 開発サーバー設定
  server: {
    host: "0.0.0.0",   // LAN経由でスマホ・他PCからアクセスOK
    port: 5173,        // デフォルトポート
    strictPort: true,  // 使用中ならエラーで停止
    open: false,       // 起動時に自動ブラウザ起動しない
  },
});
