// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// グローバルスタイル
import "./styles/Global.css";

// i18n（準備済みなら有効化）
import "./i18n/i18n.js";

const rootEl = document.getElementById("root");

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
