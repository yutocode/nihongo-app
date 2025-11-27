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

      {/* メインコンテンツ（Layout.css 側で下に BottomNav 分の余白を確保） */}
      <main className="app-content" role="main">
        <Outlet />
      </main>

      {/* 👇 フッターを先に描画して、その“上”に BottomNav がかぶさる形 */}
      {!hideChrome && <Footer />}

      {/* どの画面でも一番下に固定したいアンダーバー */}
      {!hideChrome && <BottomNav />}
    </div>
  );
}