import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { n5IntentPlanLessons } from "../data/grammar/n5/intent-plan";
import "../styles/GrammarQuiz.css";

// ---- utils ----
const range = (n) => Array.from({ length: n }, (_, i) => i);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 正解インデックスを、シャッフル後の新しい位置にマップ
function remapCorrect(originalCorrect, orderMap) {
  if (Array.isArray(originalCorrect)) {
    return originalCorrect.map((idx) => orderMap.indexOf(idx));
  }
  return orderMap.indexOf(originalCorrect);
}

export default function N5IntentPlanQuizPage() {
  const { lesson } = useParams(); // "Lesson1" など
  const pool = n5IntentPlanLessons?.[lesson] ?? n5IntentPlanLessons?.Lesson1 ?? [];

  // 出題と選択肢をシャッフル（毎回ランダム）
  const questions = useMemo(() => {
    const withShuffledChoices = pool.map((q) => {
      const order = shuffle(range(q.choices_ja.length));
      const shuffledChoices = order.map((i) => q.choices_ja[i]);
      const remapped = remapCorrect(q.correct, order);
      return { ...q, choices_ja: shuffledChoices, correct: remapped };
    });
    return shuffle(withShuffledChoices);
  }, [pool]);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [fx, setFx] = useState(null); // "ok" | "ng" | null
  const [lock, setLock] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setIdx(0);
    setScore(0);
    setFx(null);
    setLock(false);
    setSelected(null);
  }, [lesson]);

  const q = questions[idx];
  const total = questions.length;
  const progress = Math.floor((idx / Math.max(total, 1)) * 100);

  if (!q) {
    return (
      <div className="quiz-wrap">
        <div className="gq-head"><div>N5 意図・計画</div></div>
        <div className="gq-card"><p>問題が見つかりません。</p></div>
      </div>
    );
  }

  // 空所「___」を見やすいボックスに
  const sentenceHtml = (q.sentence_ja || "").replaceAll(
    "___",
    "<span class='gq-blank'>___</span>"
  );

  const pick = (i) => {
    if (lock) return;
    setSelected(i);

    const ok = Array.isArray(q.correct)
      ? q.correct.includes(i)
      : i === q.correct;

    setLock(true);
    setFx(ok ? "ok" : "ng");
    if (ok) setScore((s) => s + 1);

    setTimeout(() => {
      setFx(null);
      setLock(false);
      setSelected(null);
      if (idx + 1 < total) setIdx(idx + 1);
    }, 900);
  };

  const prev = () => {
    if (lock) return;
    if (idx > 0) {
      setIdx(idx - 1);
      setSelected(null);
      setFx(null);
    }
  };

  return (
    <div className={`quiz-wrap ${fx ? (fx === "ok" ? "show-correct" : "show-wrong") : ""}`}>
      <header className="gq-head">
        <div className="gq-title">N5 意図・計画（{lesson || "Lesson1"}）</div>
        <div className="gq-score">Score: {score}/{total}</div>
      </header>

      <div className="gq-progress">
        <div className="gq-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className={`gq-card ${fx ? `fx-${fx}` : ""}`}>
        {/* ○/× エフェクト */}
        <div className={`gq-fx ${fx === "ok" ? "show ok" : ""}`}>○</div>
        <div className={`gq-fx ${fx === "ng" ? "show ng" : ""}`}>×</div>

        <div className="gq-qnum">Q{idx + 1}/{total}</div>

        <p className="gq-sentence" dangerouslySetInnerHTML={{ __html: sentenceHtml }} />

        <div className="choices">
          {q.choices_ja.map((c, i) => {
            const classes =
              selected !== null
                ? i === (Array.isArray(q.correct) ? q.correct[0] : q.correct)
                  ? "choice-btn correct"
                  : i === selected
                  ? "choice-btn wrong"
                  : "choice-btn"
                : "choice-btn";
            return (
              <button
                key={`${q.id}-${i}`}
                className={classes}
                onClick={() => pick(i)}
                disabled={lock}
                dangerouslySetInnerHTML={{ __html: c }}
              />
            );
          })}
        </div>

        <div className="quiz-footer-nav" style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button className="choice-btn" onClick={prev} disabled={idx === 0 || lock}>
            ← 前の問題
          </button>
        </div>
      </div>

      {/* アニメSVG（比較と同じ） */}
      {fx && (
        <div className="judge-overlay" aria-hidden>
          {fx === "ok" ? (
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
