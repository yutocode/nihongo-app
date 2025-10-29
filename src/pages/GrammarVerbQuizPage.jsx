// src/pages/GrammarVerbQuizPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/GrammarQuiz.css";

import TextWithRuby from "../components/TextWithRuby";
// ヒント（無ければ空で安全）
import { HINTS_BY_TARGET } from "../data/grammar/hints";
// 動詞レッスンのハブ（n5/verb-forms/index.js）
import { N5_VERB_LESSONS } from "../data/grammar/n5/verb-forms";
// レベルごとの出題可否
import { targetsForLevel } from "../constants/verbFormLevels";

// 全ターゲット（ラベルと順序の基準）
const TARGETS = [
  "辞書形", "ます形", "ない形", "た形", "て形", "たい形",
  "可能形", "受け身形", "使役形", "使役受け身形",
  "意向形", "命令形", "条件形", "たら形", "連用形", "進行形",
];

const TARGET_LABELS_JA = {
  辞書形: "辞書形（基本形）",
  ます形: "ます形（丁寧形）",
  ない形: "否定形（普通形）",
  た形: "た形（過去形）",
  て形: "て形（接続形）",
  たい形: "たい形（希望形）",
  可能形: "可能形（能力・可能）",
  受け身形: "受け身形（受動）",
  使役形: "使役形（〜させる）",
  使役受け身形: "使役受け身形（〜させられる）",
  意向形: "意向形（〜しよう）",
  命令形: "命令形（〜しろ／〜せよ）",
  条件形: "条件形（〜ば）",
  たら形: "たら形（〜たら）",
  連用形: "連用形（接続用）",
  進行形: "進行形（〜ている）",
};

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** 選択肢4つを保証（同動詞→他動詞の同ターゲット→辞書形で補完）
 *  ※ 同一動詞の他活用は allowedTargets のみ許可（N5にN4+を混ぜない）
 */
function buildChoices(correct, verb, typeKey, bank, allowedTargets) {
  const set = new Set([correct]);

  // 1) 同一動詞の他活用（許可ターゲットのみ）
  Object.entries(verb.conjugations || {}).forEach(([k, v]) => {
    if (!allowedTargets.includes(k)) return;
    if (set.size < 4 && v && v !== correct) set.add(v);
  });

  // 2) 他動詞の同ターゲット活用
  if (set.size < 4) {
    bank.forEach((w) => {
      const v = w?.conjugations?.[typeKey];
      if (set.size < 4 && v && v !== correct) set.add(v);
    });
  }

  // 3) まだ足りなければ辞書形で補完（辞書形は常時許可）
  if (set.size < 4) {
    bank.forEach((w) => {
      const v = w?.conjugations?.["辞書形"] || w?.kanji || w?.reading;
      if (set.size < 4 && v && v !== correct) set.add(v);
    });
  }

  // 4) 最後の保険
  while (set.size < 4) set.add(correct + " ");
  return shuffle(Array.from(set)).slice(0, 4);
}

function buildQuestionsFromVerb(verb, bank, allowedTargets) {
  if (!verb?.conjugations) return [];
  // 許可ターゲットのみ出題候補にする
  const available = allowedTargets.filter((k) => Boolean(verb.conjugations[k]));
  if (available.length === 0) return [];

  // 1動詞あたり最大5問
  const pickTargets = shuffle(available).slice(0, Math.min(5, available.length));

  return pickTargets.map((typeKey) => {
    const correct = verb.conjugations[typeKey];
    const choices = buildChoices(correct, verb, typeKey, bank, allowedTargets);
    return {
      id: `${verb.id}-${typeKey}`,
      base: verb.kanji || verb.reading || verb.base,
      yomi: verb.reading,
      _target: typeKey,
      titleLabel: TARGET_LABELS_JA[typeKey] || typeKey,
      choices,
      answer: choices.indexOf(correct),
    };
  });
}

export default function GrammarVerbQuizPage() {
  const navigate = useNavigate();
  // ルート：/grammar/:level/verb-forms/:lesson を想定
  const { level = "n5", lesson = "lesson1" } = useParams();
  const { t, i18n } = useTranslation();

  const langKey =
    (i18n.language || "ja").toLowerCase().startsWith("zh-tw") ? "tw" :
    (i18n.language || "ja").slice(0, 2);

  // データ取得キー（n5/verb-forms/index.js の Map と一致）
  const mapKey = `${String(level).toLowerCase()}-verb-forms-${String(lesson).toLowerCase()}`;

  // レッスン配列
  const verbs = useMemo(() => N5_VERB_LESSONS.get(mapKey) ?? [], [mapKey]);

  // レベルで許可されるターゲット
  const allowedTargets = useMemo(
    () => targetsForLevel(String(level).toLowerCase(), TARGETS),
    [level]
  );

  // 設問生成（最大12問）
  const questions = useMemo(() => {
    const all = verbs.flatMap((v) => buildQuestionsFromVerb(v, verbs, allowedTargets));
    if (all.length <= 12) return shuffle(all);
    return shuffle(all).slice(0, 12);
  }, [verbs, allowedTargets]);

  // ====== 状態 ======
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [judge, setJudge] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false); // 追加：ヒント表示制御

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setJudge(null);
    setScore(0);
    setFinished(false);
    setShowHint(false);
  }, [mapKey]);

  const total = questions.length;
  const q = questions[index];

  // HINT（無ければ空文字）
  const hint =
    (HINTS_BY_TARGET && q
      ? (HINTS_BY_TARGET[q._target]?.[langKey] || HINTS_BY_TARGET[q._target]?.ja)
      : "") || "";

  const handleAnswer = (i) => {
    if (!q || selected !== null) return;
    const ok = i === q.answer;
    setSelected(i);
    setJudge(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    window.setTimeout(() => {
      setSelected(null);
      setJudge(null);
      if (index + 1 < total) setIndex((n) => n + 1);
      else setFinished(true);
    }, 900);
  };

  const goBack = () => navigate(-1);

  // ====== レンダリング ======
  if (total === 0) {
    return (
      <div className="quiz-wrap">
        <h1>{`${String(level).toUpperCase()} 動詞 文法`}</h1>
        <p>{t("grammar.quiz.noData", { defaultValue: "このレッスンのデータが見つかりません。" })}</p>
        <button className="choice-btn" onClick={goBack}>
          {t("common.back", { defaultValue: "戻る" })}
        </button>
      </div>
    );
  }

  const header = (
    <div className="conj-card">
      {/* 左上ヒントボタン（💡） */}
      {hint && (
        <button
          className="conj-hint-btn"
          onClick={() => setShowHint(true)}
          aria-label="ヒント"
          title="ヒント"
        >
          💡
        </button>
      )}

      <div className="conj-suptitle">{`${String(level).toUpperCase()} 文法　動詞（ふりがなつき）`}</div>
      <div className="conj-base">
        <TextWithRuby value={{ segments: [{ t: q.base, y: q.yomi }] }} />
      </div>
      <div className="conj-target">【{q.titleLabel}】</div>
      {/* ヒント本文はモーダルに表示 */}
    </div>
  );

  if (finished) {
    return (
      <div className="quiz-wrap">
        <h1>{`${String(level).toUpperCase()} 動詞 文法`}</h1>
        <div className="result-card">
          <p className="counter">Score: {score} / {total}</p>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            className="choice-btn"
            onClick={() => {
              setIndex(0);
              setScore(0);
              setFinished(false);
              setSelected(null);
              setJudge(null);
              setShowHint(false);
            }}
          >
            {t("common.retry", { defaultValue: "もう一度" })}
          </button>
          <button className="choice-btn" onClick={goBack}>
            {t("common.backToLessons", { defaultValue: "レッスン一覧へ" })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`quiz-wrap ${judge ? (judge === "correct" ? "show-correct" : "show-wrong") : ""}`}
      key={`${q.id}-${index}`}
    >
      <h1>{`${String(level).toUpperCase()} 動詞 文法`}</h1>
      <p className="counter">{index + 1} / {total}</p>

      <h2 className="question">{header}</h2>

      <div className="choices" role="list">
        {q.choices.map((opt, i) => {
          const cls =
            selected !== null
              ? i === q.answer
                ? "choice-btn correct"
                : i === selected
                ? "choice-btn wrong"
                : "choice-btn"
              : "choice-btn";
          return (
            <button
              key={`${q.id}-${i}-${opt}`}
              className={cls}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
            >
              {opt}
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

      {/* ヒントモーダル */}
      {showHint && hint && (
        <div className="gq-hint-dim" onClick={() => setShowHint(false)}>
          <div className="gq-hint-box" onClick={(e) => e.stopPropagation()}>
            <div className="gq-hint-head">
              <span className="gq-hint-title">{t("grammar.quiz.hint", { defaultValue: "ヒント" })}</span>
              <button className="gq-hint-close" onClick={() => setShowHint(false)}>×</button>
            </div>
            <div className="gq-hint-body">
              <TextWithRuby value={hint} />
            </div>
          </div>
        </div>
      )}

      <div className="quiz-footer-nav">
        <button className="choice-btn" onClick={goBack} disabled={selected !== null}>
          {t("common.back", { defaultValue: "戻る" })}
        </button>
      </div>
    </div>
  );
}
