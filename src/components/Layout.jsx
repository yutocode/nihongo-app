// src/components/Layout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import "@/styles/Layout.css";

/**
 * ここで“UIクローム（Header/BottomNav/Footer）”を隠すパスを定義。
 * 認証/初期ページでは非表示。それ以外は常に表示＆BottomNavは固定。
 */
const HIDE_CHROME_PATHS = new Set(["/", "/login", "/register"]);

export default function Layout() {
  const location = useLocation();
  const hideChrome = HIDE_CHROME_PATHS.has(location.pathname);

  // ルート変更時にスクロール位置をトップへ（必要なければ削除OK）
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="app-shell" data-route={location.pathname}>
      {!hideChrome && <Header />}

      {/* コンテンツ。下にBottomNav高さぶんの余白を自動付与します */}
      <main className="app-content" role="main">
        <Outlet />
      </main>

      {/* どの画面でも固定表示（auth画面では非表示） */}
      {!hideChrome && <BottomNav />}

      {!hideChrome && <Footer />}
    </div>
  );
}
