// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";

import FeatureTile from "../components/FeatureTile";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const level = useAppStore((s) => s.level) || "n5"; // 現在のレベル

  return (
    <main
      className="app-wrap home-wrap"
      role="main"
      aria-label={t("home.title", "ホーム")}
    >
      {/* ===== 上段（4ボタン） ===== */}
      <section className="section container">
        <div className="grid-four">
          {/* 単語帳 */}
          <FeatureTile
            iconName="book"
            label={t("home.menu.wordbook", "単語帳")}
            desc={t("home.menu.wordbookDesc", "カードで暗記")}
            onClick={() => navigate(`/lessons/${level}`)}
          />
          {/* 文法 */}
          <FeatureTile
            iconName="question"
            label={t("home.menu.grammarQuiz", "文法クイズ")}
            desc={t("home.menu.grammarQuizDesc", "N5〜N1対応")}
            onClick={() => navigate(`/grammar/${level}`)}
          />
          {/* 読解 */}
          <FeatureTile
            iconName="text"
            label={t("home.menu.text", "テキスト")}
            desc={t("home.menu.textDesc", "読解・解説")}
            onClick={() => navigate(`/reader/${level}`)}
          />
          {/* リスニング */}
          <FeatureTile
            iconName="headphones"
            label={t("home.menu.listening", "リスニング")}
            desc={t("home.menu.listeningDesc", "音声で練習")}
            onClick={() => navigate(`/listening/${level}`)}
          />
        </div>
      </section>

      {/* ===== 下段（4ボタン） ===== */}
      <section className="section container">
        <div className="grid-four">
          {/* My単語帳 */}
          <FeatureTile
            iconName="target"
            label={t("home.menu.myWordbook", "My単語帳")}
            desc={t("home.menu.myWordbookDesc", "自分だけの単語")}
            onClick={() => navigate("/my-words")}
          />
          {/* Word Quiz */}
          <FeatureTile
            iconName="quiz"
            label={t("home.menu.wordQuiz", "Word Quiz")}
            desc={t("home.menu.wordQuizDesc", "語彙テスト")}
            onClick={() => navigate(`/word-quiz/${level}`)}
          />
          {/* アルファベット */}
          <FeatureTile
            iconName="alphabet"
            label={t("home.menu.alphabet", "アルファベット")}
            desc={t("home.menu.alphabetDesc", "発音・文字")}
            onClick={() => navigate("/alphabet")}
          />
          {/* 読書（ストーリー） */}
          <FeatureTile
            iconName="book"
            label={t("home.menu.reader", "本")}
            desc={t("home.menu.readerDesc", "ストーリーを読む")}
            onClick={() => navigate(`/reader/${level}`)}
          />
        </div>
      </section>

      {/* ===== CTA（開始ボタン） ===== */}
      <div className="container cta-wrap">
        <button
          className="cta-big btn-primary"
          onClick={() => navigate(`/lessons/${level}`)}
          aria-label={t("home.cta.start", `${level.toUpperCase()}から学習を始める`)}
        >
          {t("home.cta.start", `${level.toUpperCase()}から学習を始める`)}
        </button>
      </div>
    </main>
  );
};

export default Home;
