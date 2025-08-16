// src/components/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav"; // 🔥 追加！

const Layout = () => {
  const location = useLocation();
  const isAuthPage = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <div className="layout-container">
      {!isAuthPage && <Header />}
      <main className="layout-main">
        <Outlet /> {/* 🔥 メインのページコンテンツがここに表示される */}
      </main>
      {!isAuthPage && <BottomNav />} {/* 🔥 すべての画面にナビ表示したくない時はここで調整 */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default Layout;
