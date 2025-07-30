// src/components/Header.jsx
import React from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";


const Header = () => {
  const navigate = useNavigate();
  const { selectedLanguage } = useAppStore();

  const labels = {
    ja: "日本語学習アプリ",
    en: "Japanese Learning App",
    id: "Aplikasi Belajar Bahasa Jepang",
    zh: "日语学习应用",
    tw: "日語學習應用"
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>🎌</div>
      <h1>{labels[selectedLanguage] || labels.ja}</h1>
    </header>
  );
};

export default Header;
