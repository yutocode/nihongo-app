// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="layout-container">
      <Header />
      <main className="layout-main">
        <Outlet /> {/* 🔥 これがないと中身が表示されません！ */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;





