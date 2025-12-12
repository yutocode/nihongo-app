// src/components/Layout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { showHomeBanner } from "@/utils/admobClient";
import "@/styles/Layout.css";

/**
 * このパスでは Header / BottomNav / Footer を隠す
 * （ログイン周りだけフルスクリーン）
 */
const HIDE_CHROME_PATHS = new Set(["/", "/login", "/register", "/auth"]);

export default function Layout() {
  const location = useLocation();
  const hideChrome = HIDE_CHROME_PATHS.has(location.pathname);

  // ルート変更時に一番上へ
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  // iOS ネイティブ + ボトムナビありの画面では常にバナー表示をリクエスト
  useEffect(() => {
    if (hideChrome) return;
    if (typeof window === "undefined") return;

    const ua = window.navigator?.userAgent || "";
    const isIOS = /iphone|ipad|ipod/i.test(ua);

    // ★ 判定をゆるめ：Capacitor があればネイティブとみなす
    const isNative = !!window.Capacitor;

    if (!isIOS || !isNative) return;

    // ★ ログを出して、本番でも呼ばれているか確認する
    console.log("[AdMob] Layout effect -> showHomeBanner", {
      path: location.pathname,
      isIOS,
      isNative,
      hideChrome,
    });

    // AdMob 側は同じ adId なら再利用してくれるので毎回呼んで OK
    if (typeof showHomeBanner === "function") {
      showHomeBanner();
    }
  }, [hideChrome, location.pathname]);

  return (
    <div className="app-shell" data-route={location.pathname}>
      {/* ===== 固定ヘッダー ===== */}
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