// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// グローバルスタイル
import "./styles/Global.css";

// i18n 設定
import "./i18n/i18n.js";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("❌ #root element not found in index.html");
}

const app = <App />;

// =============================
//  レンダリング
// =============================
// 開発(dev): StrictMode を外して「二重レンダ（useEffect 2回実行）」を防ぐ
// 本番(prod): StrictMode を有効化して潜在的な問題を検出
createRoot(rootEl).render(
  import.meta.env.PROD ? (
    <React.StrictMode>{app}</React.StrictMode>
  ) : (
    app
  )
);
