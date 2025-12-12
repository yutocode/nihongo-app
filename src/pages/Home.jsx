// src/pages/Home.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppStore } from "@/store/useAppStore";
import { EXAM_REGISTRY } from "@/data/exam";

import FeatureTile from "@/components/FeatureTile";

import "@/styles/Home.css";

/* ==== JLPT 模試の公開フラグ ==== */
const ENABLE_MOCK_EXAM = false;

// EXAM_REGISTRY から自動で「各レベルの最初の模試ID」を拾う
const LEVEL_KEYS = ["n5", "n4", "n3", "n2", "n1"];
const AUTO_EXAM_BY_LEVEL = (() => {
  const map = { n5: null, n4: null, n3: null, n2: null, n1: null };
  for (const [examId, pack] of Object.entries(EXAM_REGISTRY)) {
    const lv = (pack?.meta?.level || "").toLowerCase();
    if (LEVEL_KEYS.includes(lv) && !map[lv]) {
      map[lv] = examId;
    }
  }
  return map;
})();

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const level = useAppStore((s) => s.level) || "n5";
  const levelLabel = String(level).toUpperCase();

  const examId = useMemo(() => {
    if (!ENABLE_MOCK_EXAM) return null;
    return AUTO_EXAM_BY_LEVEL[level] || null;
  }, [level]);

  const hasMockExam = ENABLE_MOCK_EXAM && !!examId;

  const handleStartMockExam = () => {
    if (!hasMockExam) return;
    navigate(`/exam/${examId}`);
  };

  const handleStart = () => {
    if (hasMockExam) {
      handleStartMockExam();
    } else {
      navigate(`/lessons/${level}`);
    }
  };

  return (
    <main
      className="app-wrap home-wrap"
      role="main"
      aria-label={t("home.title", "ホーム")}
    >
      <div className="home-shell">
        {/* 上の余白（ステータスバー分） */}
        <div className="home-safe-top" aria-hidden="true" />

        {/* タイル 4×2 グリッド */}
        <section className="section container">
          <div className="grid-four">
            {/* 1 行目 */}
            <FeatureTile
              iconName="book"
              label={t("home.menu.wordbook", "単語帳")}
              onClick={() => navigate(`/lessons/${level}`)}
            />

            <FeatureTile
              iconName="question"
              label={t("home.menu.grammarQuiz", "文法クイズ")}
              onClick={() => navigate(`/grammar/${level}`)}
            />

            <FeatureTile
              iconName="medal"
              label={t("home.menu.mockExam", "JLPT 模試")}
              onClick={hasMockExam ? handleStartMockExam : undefined}
              disabled={!hasMockExam}
            />

            <FeatureTile
              iconName="headphones"
              label={t("home.menu.listeningSoon", "近日公開")}
              disabled
            />

            {/* 2 行目 */}
            <FeatureTile
              iconName="target"
              label={t("home.menu.myWordbook", "My単語帳")}
              onClick={() => navigate("/my-words")}
            />

            <FeatureTile
              iconName="quiz"
              label={t("home.menu.wordQuiz", "単語クイズ")}
              onClick={() => navigate(`/word-quiz/${level}`)}
            />

            <FeatureTile
              iconName="alphabet"
              label={t("home.menu.alphabetSoon", "近日公開文字")}
              disabled
            />

            {/* 右下：漢字専用タイル */}
            <FeatureTile
              iconName="book" // いったん本アイコンを流用（あとで漢字アイコンを追加してもOK）
              label={t("home.menu.kanji", "漢字")}
              onClick={() => navigate(`/kanji/${level}`)}
            />
          </div>
        </section>

        {/* CTA */}
        <div className="container cta-wrap">
          <button
            className="cta-big btn-primary"
            onClick={handleStart}
            aria-label={
              hasMockExam
                ? t("home.cta.startExam", `${levelLabel} 模試を始める`)
                : t("home.cta.start", `${levelLabel}から学習を始める`)
            }
          >
            {hasMockExam
              ? t("home.cta.startExam", `${levelLabel} 模試を始める`)
              : t("home.cta.start", `${levelLabel}から学習を始める`)}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;