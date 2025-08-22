// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import FeatureTile from "../components/FeatureTile";
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

          {/* 文法 → レベル選択ページへ */}
          <FeatureTile
            iconName="question" 
            label={t("home.menu.grammarQuiz", "文法クイズ")}
            onClick={() => navigate("/grammar")} // ★レベル選択に飛ぶ
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
        {t("home.cta.startN5", "N5から学習を始める")}
      </button>
    </div>
  );
};

export default Home;
