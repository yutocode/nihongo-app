// src/components/Layout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import "@/styles/Layout.css";

/**
 * ここで“UIクローム（Header/BottomNav/Footer）”を隠すパスを定義。
 * 認証/初期ページでは非表示。それ以外は常に表示。
 */
const HIDE_CHROME_PATHS = new Set(["/", "/login", "/register"]);

export default function Layout() {
  const location = useLocation();
  const hideChrome = HIDE_CHROME_PATHS.has(location.pathname);

  // ルート変更時にスクロール位置をトップへ
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="app-shell" data-route={location.pathname}>
      {/* 上部ヘッダー（認証系では非表示） */}
      {!hideChrome && <Header />}

      {/* メインコンテンツ
          - Layout.css 側で BottomNav 分の下パディングを確保
          - Footer も main 内に含めて「ナビの直上」に表示 */}
      <main className="app-content" role="main">
        <Outlet />
        {!hideChrome && <Footer />}
      </main>

      {/* どの画面でも一番下に固定したいアンダーナビ */}
      {!hideChrome && <BottomNav />}
    </div>
  );
}