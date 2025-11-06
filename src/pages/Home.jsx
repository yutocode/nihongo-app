// src/pages/Home.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { EXAM_REGISTRY } from "@/data/exam";

import FeatureTile from "../components/FeatureTile";
import "../styles/Home.css";

// EXAM_REGISTRY から自動で「各レベルの最初の模試ID」を拾う
const LEVEL_KEYS = ["n5", "n4", "n3", "n2", "n1"];
const AUTO_EXAM_BY_LEVEL = (() => {
  const map = { n5: null, n4: null, n3: null, n2: null, n1: null };
  for (const [examId, pack] of Object.entries(EXAM_REGISTRY)) {
    const lv = (pack?.meta?.level || "").toLowerCase(); // "N5" → "n5"
    if (LEVEL_KEYS.includes(lv) && !map[lv]) {
      map[lv] = examId; // そのレベルで最初に見つかった模試を採用
    }
  }
  return map;
})();

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const level = useAppStore((s) => s.level) || "n5";

  // 現在レベルで使う模試ID（無ければ null → タイルは準備中/CTAはレッスンへ）
  const examId = useMemo(() => AUTO_EXAM_BY_LEVEL[level] || null, [level]);

  // CTA：模試があれば模試へ、無ければ従来どおりレッスンへ
  const handleStart = () => {
    if (examId) navigate(`/exam/${examId}`);
    else navigate(`/lessons/${level}`);
  };

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

          {/* JLPT 模試（レベルに応じて遷移／未対応レベルは非活性表示） */}
          <FeatureTile
            iconName="medal"
            label={t("home.menu.mockExam", "JLPT 模試")}
            desc={
              examId
                ? t("home.menu.mockExamDesc", `${level.toUpperCase()} 試験モード`)
                : t("home.menu.mockExamSoon", "このレベルは準備中")
            }
            onClick={examId ? () => navigate(`/exam/${examId}`) : undefined}
            disabled={!examId}
          />

          {/* リスニング：近日公開（そのまま） */}
          <FeatureTile disabled>
            <span className="coming-soon">{t("common.comingSoon", "近日公開")}</span>
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
          onClick={handleStart}
          aria-label={
            examId
              ? t("home.cta.startExam", `${level.toUpperCase()} 模試を始める`)
              : t("home.cta.start", `${level.toUpperCase()}から学習を始める`)
          }
        >
          {examId
            ? t("home.cta.startExam", `${level.toUpperCase()} 模試を始める`)
            : t("home.cta.start", `${level.toUpperCase()}から学習を始める`)}
        </button>
      </div>
    </main>
  );
};

export default Home;
