// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// グローバルスタイル
import "./styles/Global.css";

// i18n 設定
import "./i18n/i18n.js";

/* =============================
   テーマをライト固定にする
   ============================= */
const rootHtml = document.documentElement;
rootHtml.setAttribute("data-theme", "light");

// アドレスバー等の色（index.html に <meta name="theme-color"> がある前提）
const themeMeta = document.querySelector('meta[name="theme-color"]');
if (themeMeta) {
  themeMeta.setAttribute("content", "#f7f8fa");
}

/* =============================
   React レンダリング
   ============================= */
const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("❌ #root element not found in index.html");
}

const app = <App />;

// 開発(dev): StrictMode を外して useEffect の二重実行を防ぐ
// 本番(prod): StrictMode で潜在的な問題を検出
createRoot(rootEl).render(
  import.meta.env.PROD ? <React.StrictMode>{app}</React.StrictMode> : app
);
