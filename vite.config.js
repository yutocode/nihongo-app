// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite 設定ファイル
export default defineConfig({
  plugins: [react()],
  base: "./", // 相対パスでビルド（Netlify / GitHub Pages対応）
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // "@/..." で src を参照
    },
  },
  server: {
    host: "0.0.0.0",  // LAN 経由でスマホや他PCからアクセス可能
    port: 5173,       // デフォルトポート
    strictPort: true, // ポートが埋まっていたらエラーを出す
    open: false,      // サーバー起動時に自動でブラウザを開かない
  },
});
