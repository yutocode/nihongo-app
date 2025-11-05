import React, { useEffect, useState } from "react";

function applyTheme(theme /* 'light' | 'dark' */) {
  const html = document.documentElement;

  // data-theme / class を統一
  html.setAttribute("data-theme", theme);
  html.classList.toggle("theme-dark", theme === "dark");
  html.classList.toggle("theme-light", theme === "light");

  // iOS/Safari の自動配色をブロック（UAコンポーネント含む）
  // 1) <meta name="color-scheme">
  const metaScheme =
    document.getElementById("meta-color-scheme") ||
    (() => {
      const m = document.createElement("meta");
      m.id = "meta-color-scheme";
      m.setAttribute("name", "color-scheme");
      document.head.appendChild(m);
      return m;
    })();
  // 選択テーマのみを許可（"light dark" にしない）
  metaScheme.setAttribute("content", theme);

  // 2) <meta name="theme-color">（アドレスバー色）
  const metaTheme =
    document.getElementById("meta-theme-color") ||
    (() => {
      const m = document.createElement("meta");
      m.id = "meta-theme-color";
      m.setAttribute("name", "theme-color");
      document.head.appendChild(m);
      return m;
    })();
  metaTheme.setAttribute("content", theme === "dark" ? "#0f1115" : "#ffffff");

  // 3) CSS の color-scheme でも明示（フォーム/スクロールUIの自動反転を抑止）
  html.style.colorScheme = theme; // ← iOS Safari でも効く

  // （任意）PWA ステータスバー
  // const appleStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  // if (appleStatus) appleStatus.setAttribute("content", theme === "dark" ? "black-translucent" : "default");
}

export default function ThemeToggle({ className = "" }) {
  // 端末設定は見ない。保存値が無ければ "light" に固定で開始
  const saved =
    (typeof localStorage !== "undefined" && localStorage.getItem("theme")) || "light";
  const [theme, setTheme] = useState(saved === "dark" ? "dark" : "light");

  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  return (
    <div className={`theme-toggle ${className}`} role="group" aria-label="Theme">
      <button
        type="button"
        className={`theme-toggle__btn ${theme === "light" ? "is-active" : ""}`}
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        title="ライト"
      >
        ☀️ Light
      </button>
      <button
        type="button"
        className={`theme-toggle__btn ${theme === "dark" ? "is-active" : ""}`}
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        title="ダーク"
      >
        🌙 Dark
      </button>

      <style>{`
        .theme-toggle { display:inline-flex; gap:8px; background: var(--surface-2, #f3f4f6); padding:6px; border-radius:12px; }
        .theme-toggle__btn { border:0; border-radius:8px; padding:8px 12px; background:transparent; cursor:pointer; font:inherit; }
        .theme-toggle__btn.is-active { background: var(--brand-cta, #e5e7eb); }
        html.theme-dark .theme-toggle { background:#1f2430; }
        html.theme-dark .theme-toggle__btn { color:#e5e7eb; }
        html.theme-dark .theme-toggle__btn.is-active { background:#2b3040; }
      `}</style>
    </div>
  );
}
