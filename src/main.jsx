// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// グローバルスタイル（Global.css の先頭で Theme.css を @import しておく）
import "./styles/Global.css";

// i18n 設定
import "./i18n/i18n.js";

/* =============================
   テーマ初期化（描画前に実行）
   ============================= */
(function initTheme() {
  const root = document.documentElement;

  // localStorage 優先。なければ OS 設定。
  const saved = localStorage.getItem("theme"); // "light" | "dark" | null
  const systemPrefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initial = saved === "light" || saved === "dark"
    ? saved
    : (systemPrefersDark ? "dark" : "light");

  applyTheme(initial);

  // ユーザーが保存していない場合のみ、OSの変更を追従
  if (saved !== "light" && saved !== "dark" && window.matchMedia) {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => applyTheme(e.matches ? "dark" : "light");
    // 互換対応
    mql.addEventListener?.("change", handler);
    mql.addListener?.(handler);
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    // アドレスバー等の色（index.html に <meta name="theme-color"> を置いている前提）
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0f14" : "#f7f8fa");
  }
})();

/* =============================
   React レンダリング
   ============================= */
const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("❌ #root element not found in index.html");

const app = <App />;

// 開発(dev): StrictMode を外して useEffect の二重実行を防ぐ
// 本番(prod): StrictMode で潜在的な問題を検出
createRoot(rootEl).render(
  import.meta.env.PROD ? <React.StrictMode>{app}</React.StrictMode> : app
);
