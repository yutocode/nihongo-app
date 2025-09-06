// src/pages/WordQuizPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/WordQuiz.css";

// N5 / N4 を読み込み（index は “export { LessonX } …” 形式でOK）
import * as n5Quiz from "../data/wordquiz/n5";
import * as n4Quiz from "../data/wordquiz/n4";

// レベル→データの対応表を拡張
const MAP = { n5: n5Quiz, n4: n4Quiz };

const normalizeLesson = (x) => {
  if (!x) return "Lesson1";
  const m = String(x).match(/lesson\s*(\d+)/i);
  return m ? `Lesson${m[1]}` : String(x);
};

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function WordQuizPage() {
  const { level = "n5", lesson: rawLesson = "Lesson1" } = useParams();
  const lesson = normalizeLesson(rawLesson);
  const nav = useNavigate();
  const { t } = useTranslation();

  // 選択レベルの該当レッスン配列（未定義なら []）
  const data = MAP[level]?.[lesson] || [];

  // 出題順・選択肢はランダムのまま
  const questions = useMemo(() => {
    return shuffle(data).map((item, idx) => {
      const shuffledChoices = shuffle(item.choices_ja);
      const correctIndex = shuffledChoices.indexOf(item.choices_ja[item.correct]);
      return {
        id: item.id ?? idx,
        sentence: item.question_ja, // ルビ付きHTML
        options: shuffledChoices,   // 4択（ひらがな）
        correctIndex,
      };
    });
  }, [data]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null); // number|null
  const [judge, setJudge] = useState(null);       // "correct"|"wrong"|null

  const total = questions.length;
  const q = questions[index];

  // レッスン切替でリセット
  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setJudge(null);
  }, [lesson, level]);

  // 問題が存在しないときは一覧へ自動で戻す
  useEffect(() => {
    if (!total) {
      const timer = setTimeout(() => nav(-1), 50);
      return () => clearTimeout(timer);
    }
  }, [total, nav]);

  if (!q) {
    return (
      <div className="quiz-wrap">
        <h1>{`${(level || "").toUpperCase()} ${lesson}`}</h1>
        <p>
          {t("common.noWordsFound", {
            defaultValue: "問題が見つかりません。自動で戻ります…",
          })}
        </p>
      </div>
    );
  }

  const handleAnswer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const ok = i === q.correctIndex;
    setJudge(ok ? "correct" : "wrong");
    // 0.9秒後に自動で次へ
    setTimeout(() => {
      if (index + 1 < total) {
        setIndex((n) => n + 1);
        setSelected(null);
        setJudge(null);
      } else {
        // 終了：レッスン一覧へ戻る
        nav(-1);
      }
    }, 900);
  };

  const goPrev = () => {
    if (index === 0) return;
    setIndex((n) => n - 1);
    setSelected(null);
    setJudge(null);
  };

  const goNext = () => {
    if (index + 1 < total) {
      setIndex((n) => n + 1);
      setSelected(null);
      setJudge(null);
    } else {
      nav(-1);
    }
  };

  return (
    <div
      className={`quiz-wrap ${
        judge ? (judge === "correct" ? "show-correct" : "show-wrong") : ""
      }`}
      key={q.id}
    >
      <h1>{`${level.toUpperCase()} ${lesson}`}</h1>
      <p className="counter">
        {index + 1} / {total}
      </p>

      {/* 例文（漢字にルビ、ターゲット下線などはデータ側HTML） */}
      <h2 className="question">
        <span dangerouslySetInnerHTML={{ __html: q.sentence }} />
      </h2>

      <div className="choices">
        {q.options.map((opt, i) => {
          const cls =
            selected !== null
              ? i === q.correctIndex
                ? "choice-btn correct"
                : i === selected
                ? "choice-btn wrong"
                : "choice-btn"
              : "choice-btn";
          return (
            <button
              key={`${q.id}-${i}`}
              className={cls}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* 下部ナビ：前へ／次へ */}
      <div className="wq-actions">
        <button
          className="wq-prev"
          onClick={goPrev}
          disabled={index === 0 || selected !== null}
        >
          ← {t("common.prev", "前へ")}
        </button>

        <button className="wq-next" onClick={goNext} disabled={selected !== null}>
          {index < total - 1 ? t("quiz.next", "次へ") : t("quiz.finish", "終了")}
        </button>
      </div>

      {/* ◯✖️オーバーレイ */}
      {judge && (
        <div className="judge-overlay" aria-hidden>
          {judge === "correct" ? (
            <svg className="judge-circle" viewBox="0 0 120 120">
              <circle className="ring" cx="60" cy="60" r="45" />
              <circle className="ring2" cx="60" cy="60" r="30" />
            </svg>
          ) : (
            <svg className="judge-cross" viewBox="0 0 120 120">
              <line className="bar1" x1="30" y1="30" x2="90" y2="90" />
              <line className="bar2" x1="90" y1="30" x2="30" y2="90" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
