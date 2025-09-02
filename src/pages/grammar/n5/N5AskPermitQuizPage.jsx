// src/pages/grammar/n5/N5AskPermitQuizPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { n5AskPermitLessons } from "../../../data/grammar/n5/ask-permit";
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

export default function N5AskPermitQuizPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { level = "n5", lesson } = useParams();

  const pool = n5AskPermitLessons?.[lesson] ?? n5AskPermitLessons?.Lesson1 ?? [];

  // 出題＆選択肢をランダム化
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
  const [fx, setFx] = useState(null);
  const [lock, setLock] = useState(false);
  const [selected, setSelected] = useState(null);

  // レッスン切替時に初期化
  useEffect(() => {
    setIdx(0);
    setScore(0);
    setFx(null);
    setLock(false);
    setSelected(null);
  }, [lesson]);

  const q = questions[idx];
  if (!q) {
    return (
      <div className="quiz-wrap">
        <div className="gq-head"><div>N5 請求・許可</div></div>
        <div className="gq-card">
          <p>{t("grammar.quiz.notFound", { defaultValue: "この課のクイズデータは見つかりません。" })}</p>
        </div>
      </div>
    );
  }

  const total = questions.length;
  const progress = Math.floor((idx / Math.max(1, total)) * 100);

  // ── 指示文（翻訳 or 日本語フォールバック）
  const RAW_FORM = String(q.form ?? "").trim().toLowerCase();
  const FORM_ALIAS = {
    req: "request",
    request: "request",
    permission: "permission",
    permit: "permission",
    allow: "permission",
    prohibition: "prohibition",
    forbid: "prohibition",
    obligation: "obligation",
    must: "obligation",
    unnecessary: "unnecessary",
    needless: "unnecessary",
  };
  const formKey = FORM_ALIAS[RAW_FORM] ?? "default";
  const i18nKey = `askPermit.instruction.${formKey}`;
  const jpFallback = {
    request: "この文を依頼形にしてください。",
    permission: "この文を許可形にしてください。",
    prohibition: "この文を禁止形にしてください。",
    obligation: "この文を義務形にしてください。",
    unnecessary: "この文を不要形にしてください。",
    default: "正しい形にしてください。",
  };
  const tVal = t(i18nKey);
  const instruction = tVal === i18nKey ? jpFallback[formKey] : tVal;

  // 空所「___」の装飾
  const sentenceHtml = (q.sentence_ja || "").replaceAll(
    "___",
    "<span class='gq-blank'>___</span>"
  );

  const pick = (i) => {
    if (lock) return;
    setSelected(i);
    const ok = Array.isArray(q.correct) ? q.correct.includes(i) : i === q.correct;

    setLock(true);
    setFx(ok ? "ok" : "ng");
    if (ok) setScore((s) => s + 1);

    setTimeout(() => {
      setFx(null);
      setLock(false);
      setSelected(null);
      if (idx + 1 < total) setIdx((n) => n + 1);
    }, 900);
  };

  const prev = () => {
    if (!lock && idx > 0) setIdx((n) => n - 1);
  };

  const goLessonList = () =>
    navigate(`/grammar/${String(level).toLowerCase()}/ask-permit`);

  return (
    <div className={`quiz-wrap ${fx ? (fx === "ok" ? "show-correct" : "show-wrong") : ""}`}>
      <header className="gq-head">
        <div className="gq-title">N5 請求・許可（{lesson || "Lesson1"}）</div>
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

        {instruction && <p className="gq-instruction">{instruction}</p>}
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
            ← {t("common.prev", { defaultValue: "前の問題" })}
          </button>
          <button className="choice-btn ghost" onClick={goLessonList} disabled={lock}>
            {t("grammar.lessons.backToList", { defaultValue: "レッスン一覧へ" })}
          </button>
        </div>
      </div>

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
