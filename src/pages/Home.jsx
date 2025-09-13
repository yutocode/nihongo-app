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
    <main className="app-wrap home-wrap" role="main" aria-label={t("home.title", "ホーム")}>
      {/* ===== 上段（4ボタン） ===== */}
      <section className="section container">
        <div className="grid-four">
          <FeatureTile
            iconName="book"
            label={t("home.menu.wordbook", "単語帳")}
            desc={t("home.menu.wordbookDesc", "カードで暗記")}
            onClick={() => navigate("/level")}
          />
          <FeatureTile
            iconName="question"
            label={t("home.menu.grammarQuiz", "文法クイズ")}
            desc={t("home.menu.grammarQuizDesc", "N5〜N1対応")}
            onClick={() => navigate("/grammar")}
          />
          <FeatureTile
            iconName="text"
            label={t("home.menu.text", "テキスト")}
            desc={t("home.menu.textDesc", "読解・解説")}
            onClick={() => navigate("/text")}
          />
          <FeatureTile
            iconName="headphones"
            label={t("home.menu.listening", "リスニング")}
            desc={t("home.menu.listeningDesc", "音声で練習")}
            onClick={() => navigate("/listening")}
          />
        </div>
      </section>

      {/* ===== 下段（4ボタン） ===== */}
      <section className="section container">
        <div className="grid-four">
          <FeatureTile
            iconName="target"
            label={t("home.menu.myWordbook", "My単語帳")}
            desc={t("home.menu.myWordbookDesc", "自分だけの単語")}
            onClick={() => navigate("/my-words")}
          />
          <FeatureTile
            iconName="quiz"
            label={t("home.menu.wordQuiz", "Word Quiz")}
            desc={t("home.menu.wordQuizDesc", "語彙テスト")}
            onClick={() => navigate("/word-quiz")}
          />
          <FeatureTile
            iconName="alphabet"
            label={t("home.menu.alphabet", "アルファベット")}
            desc={t("home.menu.alphabetDesc", "発音・文字")}
            onClick={() => navigate("/alphabet")}
          />
          <FeatureTile
            iconName="practice"
            label={t("home.menu.practice", "模擬テスト")}
            desc={t("home.menu.practiceDesc", "本番形式")}
            onClick={() => navigate("/practice")}
          />
        </div>
      </section>

      {/* CTA */}
      <div className="container cta-wrap">
        <button
          className="cta-big btn-primary"
          onClick={() => navigate("/level")}
          aria-label={t("home.cta.startN5", "N5から学習を始める")}
        >
          {t("home.cta.startN5", "N5から学習を始める")}
        </button>
      </div>
    </main>
  );
};

export default Home;
