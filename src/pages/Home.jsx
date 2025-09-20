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
  const level = useAppStore((s) => s.level) || "n5";

  return (
    <main
      className="app-wrap home-wrap"
      role="main"
      aria-label={t("home.title", "ホーム")}
    >
      {/* 上段 4ボタン */}
      <section className="section container">
        <div className="grid-four">
          <FeatureTile
            iconName="book"
            label={t("home.menu.wordbook", "単語帳")}
            desc={t("home.menu.wordbookDesc", "カードで暗記")}
            onClick={() => navigate(`/lessons/${level}`)}
          />
          <FeatureTile
            iconName="question"
            label={t("home.menu.grammarQuiz", "文法クイズ")}
            desc={t("home.menu.grammarQuizDesc", "N5〜N1対応")}
            onClick={() => navigate(`/grammar/${level}`)}
          />

          {/* 課文：近日公開 */}
          <FeatureTile disabled>
            <span className="coming-soon">近日公開</span>
          </FeatureTile>

          {/* リスニング：近日公開 */}
          <FeatureTile disabled>
            <span className="coming-soon">近日公開</span>
          </FeatureTile>
        </div>
      </section>

      {/* 下段 4ボタン */}
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
            onClick={() => navigate(`/word-quiz/${level}`)}
          />
          <FeatureTile
            iconName="alphabet"
            label={t("home.menu.alphabet", "アルファベット")}
            desc={t("home.menu.alphabetDesc", "発音・文字")}
            onClick={() => navigate("/alphabet")}
          />
          <FeatureTile
            iconName="book"
            label={t("home.menu.reader", "本")}
            desc={t("home.menu.readerDesc", "ストーリーを読む")}
            onClick={() => navigate(`/reader/${level}`)}
          />
        </div>
      </section>

      {/* CTA */}
      <div className="container cta-wrap">
        <button
          className="cta-big btn-primary"
          onClick={() => navigate(`/lessons/${level}`)}
          aria-label={t(
            "home.cta.start",
            `${level.toUpperCase()}から学習を始める`
          )}
        >
          {t("home.cta.start", `${level.toUpperCase()}から学習を始める`)}
        </button>
      </div>
    </main>
  );
};

export default Home;
