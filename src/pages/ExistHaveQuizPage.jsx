// src/pages/ExistHaveQuizPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/GrammarQuiz.css";
import { getN5ExistHaveLesson } from "../data/grammar/n5/exist-have";
import TextWithRuby from "../components/TextWithRuby";
import { makeRubyValue, stripRuby } from "../utils/autoRuby";

/** rubies: [{base:"財布", yomi:"さいふ"}, ...] をベース文字列に適用して segments を作る */
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

const HAS_KANJI = /[\u4E00-\u9FFF]/; // CJK 漢字

export default function ExistHaveQuizPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { level = "n5", lesson = "lesson1" } = useParams();

  // N5 のみロード
  const items = useMemo(() => {
    if (level !== "n5") return [];
    return getN5ExistHaveLesson(lesson);
  }, [level, lesson]);

  const total = items.length;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);   // 選択した選択肢の文字
  const [judge, setJudge] = useState(null);         // "correct" | "wrong" | null
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setIdx(0);
    setSelected(null);
    setJudge(null);
    setScore(0);
    setFinished(false);
  }, [lesson]);

  const q = items[idx];

  const handleSelect = (choice) => {
    if (!q || selected !== null) return;
    const ok = choice === q.answer;
    setSelected(choice);
    setJudge(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setSelected(null);
      setJudge(null);
      if (idx + 1 >= total) setFinished(true);
      else setIdx((n) => n + 1);
    }, 750);
  };

  const goCategoryList = () => navigate(`/grammar/${level}/exist-have`);

  if (!total) {
    return (
      <div className="quiz-wrap">
        <h1>{t("exist.title", { defaultValue: "存在・所有クイズ" })}</h1>
        <p>{t("exist.noData", { defaultValue: "問題が見つかりません。" })}</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-wrap">
        <h1>{t("exist.title", { defaultValue: "存在・所有クイズ" })}</h1>
        <div className="result-card">
          <p className="counter">
            {t("common.score", { defaultValue: "スコア" })}: {score} / {total}
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button className="choice-btn" onClick={() => navigate(0)}>
              {t("common.retry", { defaultValue: "もう一度" })}
            </button>
            <button className="choice-btn" onClick={goCategoryList}>
              {t("exist.toList", { defaultValue: "レッスン一覧へ" })}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 選択肢を都度シャッフル
  const shuffledChoices = useMemo(() => {
    const a = q.choices.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [q, idx]);

  // ── 質問文のルビ生成（優先順：furigana → segments → rubies → yomi自動 → question素）
  const questionWithRuby = useMemo(() => {
    if (!q) return "";

    // 0) furigana（HTMLの<ruby>…<rt>…</rt>）があれば最優先
    if (typeof q.furigana === "string" && q.furigana.includes("<rt>")) {
      return q.furigana; // TextWithRuby が HTML をパースして表示
    }

    // 1) segments があればそのまま使う
    if (Array.isArray(q.segments) && q.segments.length) {
      return { segments: q.segments.map((s) => ({ t: s.t, y: s.y ?? s.r })) };
    }

    const rawBase = String(q.question || "");

    // 2) rubies（{base,yomi}）があれば安全に適用
    if (Array.isArray(q.rubies) && q.rubies.length) {
      return applyWordRubies(rawBase, q.rubies);
    }

    // 3) 漢字が無ければそのまま
    if (!HAS_KANJI.test(rawBase)) return rawBase;

    // 4) 自動ルビ（yomi があれば漢字だけ）
    const marker = "◻◻"; // 空欄「＿＿」退避マーカー
    const base = stripRuby(rawBase).replace(/＿+/g, marker);
    const yomi = String(q.yomi || "").replace(/＿+/g, marker);
    const val  = yomi ? makeRubyValue(base, yomi, { kanjiOnly: true }) : base;

    const restoreObj = (v) => ({
      segments: v.segments.map((s) => ({
        ...s,
        t: (s.t || "").replaceAll(marker, "＿＿"),
        y: s.y ? String(s.y).replaceAll(marker, "＿＿") : s.y,
      })),
    });
    const toPlain = (v) =>
      typeof v === "string"
        ? v
        : Array.isArray(v?.segments)
        ? v.segments.map((s) => s.t || "").join("")
        : "";

    if (typeof val === "string") {
      const restored = val.replaceAll(marker, "＿＿");
      if (/^[、。，．・]/.test(restored) || restored.includes(marker)) return rawBase;
      return restored;
    }
    if (val && Array.isArray(val.segments)) {
      const restored = restoreObj(val);
      const plain = toPlain(restored);
      if (/^[、。，．・]/.test(plain) || plain.includes(marker)) return rawBase;
      return restored;
    }
    return rawBase;
  }, [q]);

  return (
    <div className={`quiz-wrap ${judge ? (judge === "correct" ? "show-correct" : "show-wrong") : ""}`}>
      <h1>
        {t("exist.title", { defaultValue: "存在・所有クイズ" })}（{level.toUpperCase()} / {lesson}）
      </h1>
      <p className="counter">{idx + 1} / {total}</p>

      <h2 className="question jp" style={{ fontSize: 24 }}>
        <TextWithRuby value={questionWithRuby} />
      </h2>

      <div className="choices">
        {shuffledChoices.map((c) => {
          const cls =
            selected !== null
              ? c === q.answer
                ? "choice-btn correct"
                : c === selected
                ? "choice-btn wrong"
                : "choice-btn"
              : "choice-btn";
          return (
            <button
              key={`${idx}-${c}`}
              className={cls}
              onClick={() => handleSelect(c)}
              disabled={selected !== null}
            >
              {c}
            </button>
          );
        })}
      </div>

      {selected !== null && q.explanation && (
        <div className="explain">
          <p style={{ marginTop: 12 }}>{q.explanation}</p>
        </div>
      )}

      {judge && (
        <div className="judge-overlay" aria-hidden>
          {judge === "correct" ? (
            <svg className="judge-circle" viewBox="0 0 120 120" key={`ok-${idx}-${selected}`}>
              <circle className="ring" cx="60" cy="60" r="45" />
              <circle className="ring2" cx="60" cy="60" r="30" />
            </svg>
          ) : (
            <svg className="judge-cross" viewBox="0 0 120 120" key={`ng-${idx}-${selected}`}>
              <line className="bar1" x1="30" y1="30" x2="90" y2="90" />
              <line className="bar2" x1="90" y1="30" x2="30" y2="90" />
            </svg>
          )}
        </div>
      )}

      <div className="quiz-footer-nav" style={{ marginTop: 12 }}>
        <button
          className="choice-btn"
          onClick={() => setIdx((n) => Math.max(0, n - 1))}
          disabled={idx === 0 || selected !== null}
        >
          ← {t("common.prev", { defaultValue: "前へ" })}
        </button>
      </div>
    </div>
  );
}