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

// 🌸 N5 の動詞活用データを読み込み
import { N5_VERB_LESSONS } from "../../../data/grammar/n5";

// ============================
// 🧩 補助関数
// ============================

/** rubies: [{base:"財布", yomi:"さいふ"}, ...] をベース文字列に適用 */
function applyWordRubies(base, rubies) {
  const dict = [...rubies].filter(Boolean).sort((a, b) => b.base.length - a.base.length);
  const segs = [];
  let i = 0;
  while (i < base.length) {
    let hit = null;
    for (const r of dict) {
      if (r?.base && base.startsWith(r.base, i)) { hit = r; break; }
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

// 言語コード→キー変換
const pickLangKey = (lng) => {
  const L = String(lng || "").toLowerCase();
  if (L.startsWith("zh-tw") || L.includes("hant")) return "tw";
  if (L.startsWith("zh")) return "zh";
  if (L.startsWith("en")) return "en";
  if (L.startsWith("id")) return "id";
  if (L.startsWith("ko")) return "ko";
  if (L.startsWith("vi")) return "vi";
  if (L.startsWith("th")) return "th";
  if (L.startsWith("my")) return "my";
  if (L.startsWith("km")) return "km";
  return "ja";
};

// lesson1 → n5-verb-forms-lesson1 に正規化
const normalizeVerbLessonKey = (level, lesson) =>
  `${level}-verb-forms-${String(lesson).toLowerCase()}`;

// ============================
// 🌸 メインコンポーネント
// ============================
export default function GrammarQuizPage() {
  const navigate = useNavigate();
  const { level = "n5", category = "", lesson = "lesson1" } = useParams();
  const { i18n, t } = useTranslation();

  // ベースキー
  const lessonKey = category
    ? `${String(level).toLowerCase()}-${String(category).toLowerCase()}-${String(lesson).toLowerCase()}`
    : `${String(level).toLowerCase()}-${String(lesson).toLowerCase()}`;

  // ========= データ選択ロジック =========
  const rawQuestions = useMemo(() => {
    const L = String(level).toLowerCase();
    const C = String(category).toLowerCase();
    const LES = String(lesson).toLowerCase();

    // 🔸 動詞活用カテゴリーの場合
    if (C === "verb-forms") {
      const key1 = normalizeVerbLessonKey(L, LES);
      return (
        N5_VERB_LESSONS.get(key1) ||
        N5_VERB_LESSONS.get(`${L}-lesson${LES.replace("lesson", "")}`) ||
        []
      );
    }

    // 🔸 それ以外（通常文法レッスン）
    return LESSON_MAP.get(lessonKey) ?? [];
  }, [level, category, lesson, lessonKey]);

  // ========= 実行用問題生成 =========
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

  // ========= 状態管理 =========
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [judge, setJudge] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setJudge(null);
    setFinished(false);
    setShowHint(false);
  }, [lessonKey]);

  const total = questions.length;
  const q = questions[index];

  // ========= 回答処理 =========
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
    setShowHint(false);
  };

  const goPrev = () => {
    if (selected === null && index > 0) setIndex((n) => n - 1);
  };
  const goLessonList = () =>
    navigate(category ? `/grammar/${level}/${category}` : `/grammar/${level}`);

  // ========= ヒント処理 =========
  const hintText = useMemo(() => {
    if (!q || !q.hints) return "";
    const key = pickLangKey(i18n.language);
    return (
      (typeof q.hints === "object" && (q.hints[key] || q.hints.ja || "")) || ""
    );
  }, [q, i18n.language]);

  // ========= ルビ適用 =========
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
    return baseRaw;
  }, [q]);

  // ========= 出力部 =========
  if (total === 0) {
    return (
      <div className="quiz-wrap">
        <h1>{`${level?.toUpperCase()} ${lesson}`}</h1>
        <p>
          {t("grammar.quiz.noData", {
            defaultValue: "このレッスンの問題データが見つかりませんでした。",
          })}
        </p>
        <button className="choice-btn" onClick={() => navigate(-1)}>
          {t("common.back", { defaultValue: "戻る" })}
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-wrap">
        <h1>{`${level?.toUpperCase()} ${lesson}`}</h1>
        <div className="result-card">
          <p className="counter">
            {t("grammar.quiz.score", { defaultValue: "Score" })}: {score} /{" "}
            {total}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="choice-btn" onClick={restart}>
              {t("common.retry", { defaultValue: "もう一度" })}
            </button>
            <button className="choice-btn" onClick={goLessonList}>
              {t("common.backToLessons", { defaultValue: "レッスン一覧へ" })}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTop = () => {
    if (!q) return null;
    if (q.base) {
      const label = TARGET_LABELS[q._target]?.ja || "普通形";
      const baseForHeader =
        q.yomi
          ? makeRubyValue(stripRuby(q.base), q.yomi, { kanjiOnly: true })
          : q.base;
      return (
        <div className="conj-card">
          {hintText && (
            <button className="conj-hint-btn" onClick={() => setShowHint(true)}>
              ？
            </button>
          )}
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
      <div className="jp jp-card">
        {hintText && (
          <button className="conj-hint-btn" onClick={() => setShowHint(true)}>
            ？
          </button>
        )}
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

  return (
    <div
      className={`quiz-wrap ${
        judge ? (judge === "correct" ? "show-correct" : "show-wrong") : ""
      }`}
      key={q?.id || index}
    >
      <h1>{`${level?.toUpperCase()} ${lesson}`}</h1>
      <p className="counter">
        {index + 1} / {total}
      </p>

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
        <button
          className="choice-btn"
          onClick={goLessonList}
          disabled={selected !== null}
        >
          {t("common.backToLessons", { defaultValue: "レッスン一覧へ" })}
        </button>
      </div>

      {showHint && hintText && (
        <div className="gq-hint-dim" onClick={() => setShowHint(false)}>
          <div className="gq-hint-box" onClick={(e) => e.stopPropagation()}>
            <div className="gq-hint-head">
              <span className="gq-hint-title">
                {t("grammar.quiz.hint", { defaultValue: "ヒント" })}
              </span>
              <button
                className="gq-hint-close"
                onClick={() => setShowHint(false)}
              >
                ×
              </button>
            </div>
            <div className="gq-hint-body">
              <TextWithRuby value={hintText} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
