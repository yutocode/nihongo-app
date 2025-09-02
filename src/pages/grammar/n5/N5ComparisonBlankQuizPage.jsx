// src/pages/grammar/n5/N5ComparisonBlankQuizPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { n5ComparisonLessons } from "../../../data/grammar/n5/comparison";
import "../../../styles/GrammarQuiz.css";

const range = (n) => Array.from({ length: n }, (_, i) => i);
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const remapCorrect = (orig, order) =>
  Array.isArray(orig) ? orig.map((i) => order.indexOf(i)) : order.indexOf(orig);
const normalizeLesson = (k) => {
  if (!k) return "Lesson1";
  const m = String(k).match(/lesson\s*(\d+)/i);
  return m ? `Lesson${m[1]}` : k;
};

const ChoiceBtn = ({ text, onClick, disabled, className = "" }) => (
  <button
    className={`choice-btn ${className}`}
    onClick={onClick}
    disabled={disabled}
    dangerouslySetInnerHTML={{ __html: text }}
  />
);

export default function N5ComparisonBlankQuizPage() {
  const { lesson } = useParams();
  const lessonKey = normalizeLesson(lesson);
  const pool = n5ComparisonLessons?.[lessonKey] ?? n5ComparisonLessons?.Lesson1 ?? [];

  const questions = useMemo(() => {
    const withChoices = pool.map((q) => {
      const order = shuffle(range(q.choices_ja.length));
      return {
        ...q,
        choices_ja: order.map((i) => q.choices_ja[i]),
        correct: remapCorrect(q.correct, order),
      };
    });
    return shuffle(withChoices);
  }, [pool]);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [judge, setJudge] = useState(null);    // "ok" | "ng" | null（○×）
  const [lock, setLock] = useState(false);
  const [picked, setPicked] = useState([]);    // 複数空所の選択履歴
  const [blinkAt, setBlinkAt] = useState(-1);  // 点滅する空欄の番号

  const q = questions[idx];
  const isMulti = Array.isArray(q?.correct);
  const need = isMulti ? q.correct.length : 1;

  useEffect(() => {
    setIdx(0); setScore(0); setJudge(null); setLock(false);
    setPicked([]); setBlinkAt(-1);
  }, [lessonKey]);

  if (!q) {
    return (
      <div className="quiz-wrap">
        <h1>N5 比較クイズ（{lessonKey}）</h1>
        <p>このレッスンの問題データが見つかりません。</p>
      </div>
    );
  }

  const nextQuestion = () => {
    setJudge(null); setLock(false); setPicked([]); setBlinkAt(-1);
    if (idx + 1 < questions.length) setIdx(idx + 1);
  };

  const handlePick = (choiceIndex) => {
    if (lock) return;

    if (!isMulti) {
      const ok = choiceIndex === q.correct;
      setLock(true); setJudge(ok ? "ok" : "ng");
      if (ok) setScore((s) => s + 1);
      setTimeout(nextQuestion, 650);
      return;
    }

    const step = picked.length;
    const expected = q.correct[step];

    if (choiceIndex !== expected) {
      setLock(true); setJudge("ng");
      setTimeout(() => {
        setJudge(null); setLock(false);
        setPicked([]); setBlinkAt(-1);
      }, 650);
      return;
    }

    const nextPicked = [...picked, choiceIndex];
    setPicked(nextPicked);
    setBlinkAt(step);
    setTimeout(() => setBlinkAt(-1), 400);

    if (nextPicked.length >= need) {
      setLock(true); setJudge("ok"); setScore((s) => s + 1);
      setTimeout(nextQuestion, 650);
    }
  };

  const parts = String(q.sentence_ja || "").split("___");

  const finished =
    idx === questions.length - 1 && judge === null && !lock && picked.length === 0;

  return (
    <div className="quiz-wrap">
      <div className="counter">
        N5 比較クイズ（{lessonKey}）<br />
        Score: {score}/{questions.length}
      </div>

      <div className="question">
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            <span dangerouslySetInnerHTML={{ __html: p }} />
            {i < parts.length - 1 && (
              <span className={`blank ${blinkAt === i ? "blink" : ""}`}>___</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="choices">
        {q.choices_ja.map((c, i) => (
          <ChoiceBtn
            key={i}
            text={c}
            onClick={() => handlePick(i)}
            disabled={lock}
            className={picked.includes(i) ? "ghost" : ""}
          />
        ))}
      </div>

      {isMulti && (
        <div className="counter" style={{ marginTop: -6 }}>
          ※ 正しい順にタップ（{need}つ）
        </div>
      )}

      {idx > 0 && !lock && !judge && (
        <div style={{ marginTop: 12 }}>
          <button
            className="choice-btn ghost"
            onClick={() => { setIdx(idx - 1); setPicked([]); setBlinkAt(-1); }}
          >
            ← 前の問題
          </button>
        </div>
      )}

      <div className="judge-overlay" aria-hidden>
        {judge === "ok" && (
          <svg className="judge-circle" viewBox="0 0 120 120">
            <circle className="ring" cx="60" cy="60" r="45" />
            <circle className="ring2" cx="60" cy="60" r="30" />
          </svg>
        )}
        {judge === "ng" && (
          <svg className="judge-cross" viewBox="0 0 120 120">
            <line className="bar1" x1="35" y1="35" x2="85" y2="85" />
            <line className="bar2" x1="85" y1="35" x2="35" y2="85" />
          </svg>
        )}
      </div>

      {finished && (
        <div style={{ marginTop: 12 }}>
          <button className="choice-btn" onClick={() => window.location.reload()}>
            結果 {score}/{questions.length} — もう一度
          </button>
        </div>
      )}
    </div>
  );
}
