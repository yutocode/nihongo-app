import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ← ここを修正（n5配下 → 2階層上）
import "../../../styles/GrammarQuiz.css";

// ← ここも修正（n5配下なので 3階層上）
import { getN5AdjLessonMixed } from "../../../data/grammar/n5/adjectives";

const LABEL_I = "い形容詞";
const LABEL_NA = "な形容詞";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function makeOrder(n) {
  return shuffle([...Array(n).keys()]);
}

function subLabel(type, lang) {
  const L = (lang || "ja").toLowerCase();
  const isEn = L.startsWith("en");
  const isId = L.startsWith("id");
  const isZh = L.startsWith("zh");
  const isTw = L.startsWith("zh-tw") || L === "tw";
  if (isEn) return type === "i" ? "i-adjective" : "na-adjective";
  if (isId) return type === "i" ? "adjektiva-i" : "adjektiva-na";
  if (isZh) return type === "i" ? "い形容词" : "な形容词";
  if (isTw) return type === "i" ? "い形容詞" : "な形容詞";
  return type === "i" ? "い形容詞" : "な形容詞";
}

function ChoiceFace({ kind, lang }) {
  const prefix = kind === "i" ? "い" : "な";
  const sub = subLabel(kind, lang);
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <span className="jp" style={{ fontSize: 18, lineHeight: 1.1 }}>
        {prefix}
        <ruby>形容詞<rt>けいようし</rt></ruby>
      </span>
      <span style={{ fontSize: 12, opacity: 0.9 }}>{sub}</span>
    </div>
  );
}

export default function AdjTypeQuizPage() {
  const navigate = useNavigate();
  const { level = "n5", lesson = "lesson1" } = useParams();
  const { t, i18n } = useTranslation();

  const items = useMemo(() => {
    if (level !== "n5") return [];
    return getN5AdjLessonMixed(lesson) ?? [];
  }, [level, lesson]);

  const total = items.length || 10;
  const [order, setOrder] = useState(() => makeOrder(items.length));
  const [ptr, setPtr] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [judge, setJudge] = useState(null);
  const [finished, setFinished] = useState(false);

  const current = useMemo(() => {
    if (!items.length || ptr >= order.length) return null;
    return items[order[ptr]];
  }, [items, order, ptr]);

  const choices = useMemo(() => {
    if (!current) return [];
    const correctLabel = current.type === "i" ? LABEL_I : LABEL_NA;
    const wrongLabel = current.type === "i" ? LABEL_NA : LABEL_I;
    return shuffle([correctLabel, wrongLabel]);
  }, [current]);

  useEffect(() => {
    setOrder(makeOrder(items.length));
    setPtr(0);
    setScore(0);
    setSelected(null);
    setJudge(null);
    setFinished(false);
  }, [items.length]);

  const handleSelect = (i) => {
    if (selected !== null || !current) return;
    const isCorrect =
      (current.type === "i" && choices[i] === LABEL_I) ||
      (current.type === "na" && choices[i] === LABEL_NA);

    setSelected(i);
    setJudge(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      setSelected(null);
      setJudge(null);
      const nextPtr = ptr + 1;
      if (nextPtr >= total) setFinished(true);
      else setPtr(nextPtr);
    }, 700);
  };

  const restart = () => {
    setOrder(makeOrder(items.length));
    setPtr(0);
    setScore(0);
    setSelected(null);
    setJudge(null);
    setFinished(false);
  };

  const goPrevQuestion = () => {
    if (selected !== null) return;
    if (ptr > 0) {
      setPtr((p) => p - 1);
      setJudge(null);
      setSelected(null);
      setFinished(false);
    }
  };

  const goLessonList = () => navigate(`/adj/${level}`);
  const goCategoryList = () => navigate(`/grammar/${level}`);

  // ======= レイアウト =======
  if (!current && !finished) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-top-nav">
          <button className="nav-btn" onClick={goLessonList}>{t("adj.toLessonList")}</button>
          <button className="nav-btn" onClick={goCategoryList}>{t("adj.toCategoryList")}</button>
        </div>

        <h1>{t("adj.title", { level: level.toUpperCase() })}</h1>
        <p>{t("adj.notFound")}</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-top-nav">
          <button className="nav-btn" onClick={goLessonList}>{t("adj.toLessonList")}</button>
          <button className="nav-btn" onClick={goCategoryList}>{t("adj.toCategoryList")}</button>
        </div>

        <h1>{t("adj.title", { level: level.toUpperCase() })}</h1>
        <div className="result-card">
          <p className="counter">{t("adj.score", { score, total })}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
            <button className="choice-btn" onClick={restart}>{t("adj.retry")}</button>
            <button className="choice-btn" onClick={goPrevQuestion} disabled={ptr === 0}>
              {t("adj.backOne")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const wordDisplay = current?.word ?? "";
  const correctIdx =
    current?.type === "i" ? choices.indexOf(LABEL_I) : choices.indexOf(LABEL_NA);

  return (
    <div className={`quiz-wrap ${judge ? (judge === "correct" ? "show-correct" : "show-wrong") : ""}`}>
      <div className="quiz-top-nav">
        <button className="nav-btn" onClick={goLessonList}>{t("adj.toLessonList")}</button>
        <button className="nav-btn" onClick={goCategoryList}>{t("adj.toCategoryList")}</button>
      </div>

      <h1>{t("adj.title", { level: level.toUpperCase() })}</h1>
      <p className="counter">{t("adj.counter", { current: ptr + 1, total })}</p>

      <h2 className="question">
        <span className="jp" style={{ fontSize: 28 }}>{wordDisplay}</span>
      </h2>

      <div className="choices">
        {choices.map((label, i) => {
          const isI = label === LABEL_I;
          const classes =
            selected !== null
              ? i === correctIdx
                ? "choice-btn correct"
                : i === selected
                ? "choice-btn wrong"
                : "choice-btn"
              : "choice-btn";
          return (
            <button
              key={`${current.id}-${i}`}
              className={classes}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
            >
              <ChoiceFace kind={isI ? "i" : "na"} lang={i18n.language} />
            </button>
          );
        })}
      </div>

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
