// src/pages/grammar/common/GrammarQuizPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarQuiz.css";

import { conjugate, generateDistractors, shuffle, TARGETS } from "../../../utils/conjugation";
import TextWithRuby from "../../../components/TextWithRuby";
import { stripRuby, makeRubyValue } from "../../../utils/autoRuby";

import { LESSON_MAP } from "../../../utils/loadLessons";
import { TARGET_LABELS } from "../../../constants/grammarLabels";
import { prepareRuntime } from "../../../utils/quizRuntime";

/** rubies: [{base:"財布", yomi:"さいふ"}, ...] をベース文字列に適用して segments を作る */
function applyWordRubies(base, rubies) {
  const dict = [...rubies].filter(Boolean).sort((a, b) => b.base.length - a.base.length);
  const segs = [];
  let i = 0;
  while (i < base.length) {
    let hit = null;
    for (const r of dict) {
      if (r?.base && base.startsWith(r.base, i)) {
        hit = r;
        break;
      }
    }
    if (hit) {
      segs.push({ t: hit.base, y: hit.yomi });
      i += hit.base.length;
    } else {
      segs.push({ t: base[i] });
      i++;
    }
  }
  return { segments: segs };
}

export default function GrammarQuizPage() {
  const navigate = useNavigate();
  const { level = "n5", category = "", lesson = "lesson1" } = useParams();
  const { i18n, t } = useTranslation();

  const lessonKey = category
    ? `${String(level).toLowerCase()}-${String(category).toLowerCase()}-${String(lesson).toLowerCase()}`
    : `${String(level).toLowerCase()}-${String(lesson).toLowerCase()}`;

  // 生データ
  const rawQuestions = useMemo(() => LESSON_MAP.get(lessonKey) ?? [], [lessonKey]);

  // 実行用問題
  const questions = useMemo(
    () =>
      prepareRuntime({
        arr: rawQuestions,
        i18nLang: i18n.language,
        TARGETS,
        conjugate,
        generateDistractors,
        shuffle,
      }),
    [rawQuestions, i18n.language]
  );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [judge, setJudge] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setJudge(null);
    setFinished(false);
  }, [lessonKey]);

  const total = questions.length;
  const q = questions[index];

  const goPrev = () => {
    if (selected === null && index > 0) setIndex((n) => n - 1);
  };
  const goLessonList = () =>
    navigate(category ? `/grammar/${level}/${category}` : `/grammar/${level}`);

  const handleAnswer = (i) => {
    if (!q || selected !== null) return;
    const isCorrect = i === q.answer;
    setSelected(i);
    setJudge(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      setSelected(null);
      setJudge(null);
      if (index + 1 < total) setIndex((n) => n + 1);
      else setFinished(true);
    }, 900);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setJudge(null);
    setFinished(false);
  };

  // ── 文タイプの質問文にルビを適用
  const sentenceWithRuby = useMemo(() => {
    if (!q || !q.question) return "";

    if (Array.isArray(q.segments) && q.segments.length) {
      return { segments: q.segments.map((s) => ({ t: s.t, y: s.y ?? s.r })) };
    }

    if (typeof q.furigana === "string" && q.furigana.includes("<ruby")) {
      return q.furigana;
    }

    const baseRaw = String(q.question);

    if (Array.isArray(q.rubies) && q.rubies.length) {
      return applyWordRubies(baseRaw, q.rubies);
    }

    const marker = "◻◻";
    const base = stripRuby(baseRaw).replace(/＿+/g, marker);
    const yomi = String(q.yomi || "").replace(/＿+/g, marker);
    const val = yomi ? makeRubyValue(base, yomi, { kanjiOnly: true }) : base;

    const restoreObj = (v) => ({
      segments: v.segments.map((s) => ({
        ...s,
        t: (s.t || "").replaceAll(marker, "＿＿"),
        y: s.y ? String(s.y).replaceAll(marker, "＿＿") : s.y,
      })),
    });

    if (typeof val === "string") {
      const restored = val.replaceAll(marker, "＿＿");
      if (/^[、。，．・]/.test(restored) || restored.includes(marker)) return baseRaw;
      return restored;
    }
    if (val && Array.isArray(val.segments)) {
      const restored = restoreObj(val);
      return restored;
    }
    return baseRaw;
  }, [q]);

  const renderTop = () => {
    if (!q) return null;

    if (q.base) {
      const label = TARGET_LABELS[q._target]?.ja || "普通形";
      const baseForHeader =
        q.yomi ? makeRubyValue(stripRuby(q.base), q.yomi, { kanjiOnly: true }) : q.base;

      return (
        <div className="conj-card">
          <div className="conj-base">
            〔{label}〕 <TextWithRuby value={baseForHeader} />
          </div>
          {q.l1text && (
            <div className="conj-l1">
              <TextWithRuby value={q.l1text} />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="jp">
        <TextWithRuby value={sentenceWithRuby} />
      </div>
    );
  };

  const renderChoiceContent = (c) => {
    if (c && typeof c === "object" && Array.isArray(c.segments)) {
      return <TextWithRuby value={{ segments: c.segments }} />;
    }
    return <TextWithRuby value={c} />;
  };

  if (total === 0) {
    return (
      <div className="quiz-wrap">
        <h1>{`${level?.toUpperCase()} ${lesson} ${t("grammar.quiz.title", { defaultValue: "文法" })}`}</h1>
        <p>{t("grammar.quiz.noData", { defaultValue: "このレッスンの問題データが見つかりませんでした。" })}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="choice-btn" onClick={() => navigate(-1)}>
            {t("common.back", { defaultValue: "戻る" })}
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-wrap">
        <h1>{`${level?.toUpperCase()} ${lesson} ${t("grammar.quiz.title", { defaultValue: "文法" })}`}</h1>
        <div className="result-card">
          <p className="counter">{t("grammar.quiz.score", { defaultValue: "Score" })}: {score} / {total}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="choice-btn" onClick={restart}>
              {t("common.retry", { defaultValue: "もう一度" })}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`quiz-wrap ${judge ? (judge === "correct" ? "show-correct" : "show-wrong") : ""}`}
      key={q?.id || index}
    >
      <h1>{`${level?.toUpperCase()} ${lesson} ${t("grammar.quiz.title", { defaultValue: "文法" })}`}</h1>
      <p className="counter">{index + 1} / {total}</p>

      <h2 className="question">{renderTop()}</h2>

      <div className="choices">
        {q.choices.map((c, i) => {
          const classes =
            selected !== null
              ? i === q.answer
                ? "choice-btn correct"
                : i === selected
                ? "choice-btn wrong"
                : "choice-btn"
              : "choice-btn";

          const keyText =
            typeof c === "string"
              ? c
              : Array.isArray(c?.segments)
              ? c.segments.map((s) => s.t).join("")
              : String(i);

          return (
            <button
              key={`${q.id ?? "q"}-${i}-${keyText}`}
              className={classes}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
            >
              {renderChoiceContent(c)}
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

      <div className="quiz-footer-nav">
        <button
          className="choice-btn"
          onClick={goPrev}
          disabled={index === 0 || selected !== null}
        >
          ← {t("common.prev", { defaultValue: "前へ" })}
        </button>
      </div>
    </div>
  );
}
