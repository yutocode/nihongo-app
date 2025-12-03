// src/components/Layout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import "@/styles/Layout.css";

/**
 * このパスでは Header / BottomNav / Footer を隠す
 * （ログイン周りだけフルスクリーン）
 */
const HIDE_CHROME_PATHS = new Set(["/", "/login", "/register"]);

export default function Layout() {
  const location = useLocation();
  const hideChrome = HIDE_CHROME_PATHS.has(location.pathname);

  // ルート変更時に一番上へ
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="app-shell" data-route={location.pathname}>
      {/* ===== 固定ヘッダー（位置決めだけ Layout 側でやる） ===== */}
      {!hideChrome && (
        <header className="app-shell-header" aria-label="App header">
          <Header />
        </header>
      )}

      {/* ===== コンテンツエリア（ここだけスクロール） ===== */}
      <main className="app-content" role="main">
        <Outlet />
        {!hideChrome && <Footer />}
      </main>

      {/* ===== 固定ボトムナビ ===== */}
      {!hideChrome && (
        <nav className="app-shell-bottom" aria-label="Bottom navigation">
          <BottomNav />
        </nav>
      )}
    </div>
  );
}