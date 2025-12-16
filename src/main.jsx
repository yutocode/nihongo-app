// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// ✅ CSS入口は1本にする（順序もここで固定される）
import "./styles/app.css";

// i18n
import "./i18n/i18n.js";

/* =============================
   テーマをライト固定
   ============================= */
document.documentElement.setAttribute("data-theme", "light");

// Safari アドレスバー色
const themeMeta = document.querySelector('meta[name="theme-color"]');
if (themeMeta) themeMeta.setAttribute("content", "#f7f8fa");

/* =============================
   React
   ============================= */
const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("❌ #root element not found in index.html");

const app = <App />;

createRoot(rootEl).render(
  import.meta.env.PROD ? <React.StrictMode>{app}</React.StrictMode> : app
);