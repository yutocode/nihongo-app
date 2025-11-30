// src/pages/Home.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { EXAM_REGISTRY } from "@/data/exam";
import { StepProgress } from "@/components/ui/StepProgress";
import FeatureTile from "../components/FeatureTile";
import "../styles/Home.css";

/* ==== JLPT 模試の公開フラグ ====
   iOS 審査中は false にして完全ロック。
   将来リリースするときだけ true に切り替える。
*/
const ENABLE_MOCK_EXAM = false;

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
  const levelLabel = String(level).toUpperCase();

  // 現在レベルで使う模試ID（ロック中は常に null）
  const examId = useMemo(() => {
    if (!ENABLE_MOCK_EXAM) return null;
    return AUTO_EXAM_BY_LEVEL[level] || null;
  }, [level]);

  const hasMockExam = ENABLE_MOCK_EXAM && !!examId;

  const handleStartMockExam = () => {
    if (!hasMockExam) return;
    navigate(`/exam/${examId}`);
  };

  // CTA：いまは必ずレッスンへ（模試解禁したら hasMockExam を見る）
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
      {/* タイル 4×2 グリッド（全部まとめて1グリッド） */}
      <section className="section container">
        <div className="grid-four">
          {/* 1段目 */}
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

          {/* JLPT 模試：今はロック */}
          <FeatureTile
            iconName="medal"
            label={t("home.menu.mockExam", "JLPT 模試")}
            onClick={hasMockExam ? handleStartMockExam : undefined}
            disabled={!hasMockExam}
          />

          {/* リスニング：近日公開（ロック） */}
          <FeatureTile
            iconName="headphones"
            label={t("home.menu.listeningSoon", "近日公開")}
            disabled
          />

          {/* 2段目 */}
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

          <FeatureTile
            iconName="book"
            label={t("home.menu.readerSoon", "近日公開本")}
            disabled
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
    </main>
  );
};

export default Home;
