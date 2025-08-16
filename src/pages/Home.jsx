// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import FeatureTile from "../components/FeatureTile";
// Daily widgets は将来追加：
// import DailyGreeting from "../components/DailyGreeting";
// import DailyMeters from "../components/DailyMeters";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="home-wrap">
      {/* ===== 上段（4ボタン） ===== */}
      <section className="section">
        <div className="grid-four">
          <FeatureTile
            iconName="book"
            label={t("home.menu.wordbook", "単語帳")}
            onClick={() => navigate("/level")}
          />
          <FeatureTile
            iconName="quiz"
            label={t("home.menu.quiz", "クイズ")}
            onClick={() => navigate("/quiz")}
          />
          <FeatureTile
            iconName="trophy"
            label={t("home.menu.ranking", "ランキング")}
            onClick={() => navigate("/ranking")}
          />
          <FeatureTile
            iconName="headphones"
            label={t("home.menu.listening", "リスニング")}
            onClick={() => navigate("/listening")}
          />
        </div>
      </section>

      {/* ===== 下段（4ボタン） ===== */}
      <section className="section">
        <div className="grid-four">
          <FeatureTile
            iconName="target"
            label={t("home.menu.challenge", "チャレンジ")}
            onClick={() => navigate("/challenge")}
          />
          <FeatureTile
            iconName="quiz"
            label={t("home.menu.examStructure", "試験構成")}
            onClick={() => navigate("/exam-structure")}
          />
          <FeatureTile
            iconName="book"
            label={t("home.menu.alphabet", "アルファベット")}
            onClick={() => navigate("/alphabet")}
          />
          <FeatureTile
            iconName="trophy"
            label={t("home.menu.practice", "模擬テスト")}
            onClick={() => navigate("/practice")}
          />
        </div>
      </section>

      {/* CTA */}
      <button className="cta-big" onClick={() => navigate("/level")}>
        {t("home.cta.startN5", "Start conquering JLPT N5")}
      </button>
    </div>
  );
};

export default Home;
