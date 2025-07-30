// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// src/pages/Home.jsx
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <h1>{t("title", "Welcome!")}</h1>
      <p>{t("selectLanguage")}</p>
      <div className="home-buttons">
        <button onClick={() => navigate("/words")}>{t("start")} 単語帳</button>
        <button onClick={() => navigate("/quiz")}>{t("start")} クイズ</button>
      </div>
    </div>
  );
};

export default Home;
