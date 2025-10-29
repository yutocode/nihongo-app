import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/WordQuiz.css";

// ===== 各レベル =====
import { n1WordSets } from "../data/wordquiz/n1";
import { n2WordSets } from "../data/wordquiz/n2";
import { n3WordSets } from "../data/wordquiz/n3";
import { n4WordSets } from "../data/wordquiz/n4";
import { n5WordSets } from "../data/wordquiz/n5";

const WORDSETS_BY_LEVEL = {
  n1: n1WordSets, n2: n2WordSets, n3: n3WordSets, n4: n4WordSets, n5: n5WordSets,
};

// ==== Utility ====
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pickN = (arr, n, exceptSet = new Set()) => {
  const pool = arr.filter((x) => !exceptSet.has(x));
  return shuffle(pool).slice(0, Math.max(0, n));
};

// ==== データ形式を統一 ====
function adaptItemToQuestion(item, poolReadings) {
  const kanji = item?.kanji || item?.word || item?.base || "";
  const reading = item?.reading || item?.yomi || "";

  if (!kanji || !reading) {
    const s = JSON.stringify(item ?? {});
    return {
      qhtml: `この語を選んでください：<code>${s.slice(0, 30)}…</code>`,
      options: [s.slice(0, 8), "A", "B", "C"],
      correctIndex: 0,
    };
  }

  const exclude = new Set([reading]);
  const dummies = pickN(poolReadings, 12, exclude).filter((r) => r && r !== reading).slice(0, 3);
  const options = shuffle([reading, ...dummies]);
  const correctIndex = options.indexOf(reading);
  return {
    qhtml: `「${kanji}」の読みは？`,
    options,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
  };
}

const isVerbLike = (x) => {
  const pos = String(x?.pos || "").toLowerCase();
  return pos.startsWith("v") || pos.includes("動詞") || !!x?.conjugations;
};

// =============================================================
//                WordQuizPage メインコンポーネント
// =============================================================
export default function WordQuizPage() {
  const { level = "n5", lesson: rawLesson = "all" } = useParams();
  const nav = useNavigate();
  const { t } = useTranslation();

  const wordSets = WORDSETS_BY_LEVEL[level?.toLowerCase()] || {};
  const lessonKeyRaw = String(rawLesson || "all").toLowerCase();

  // ====== レッスンデータ抽出 ======
  const selectedData = useMemo(() => {
    const allEntries = Object.entries(wordSets);
    if (!allEntries.length) return [];
    if (lessonKeyRaw === "all")
      return allEntries.flatMap(([, arr]) => (Array.isArray(arr) ? arr : []));
    const exact = wordSets[lessonKeyRaw];
    if (Array.isArray(exact) && exact.length) return exact;
    const matched = allEntries
      .filter(([k]) => k.toLowerCase().includes(lessonKeyRaw))
      .flatMap(([, arr]) => (Array.isArray(arr) ? arr : []));
    return matched.length ? matched : allEntries.flatMap(([, arr]) => (Array.isArray(arr) ? arr : []));
  }, [wordSets, lessonKeyRaw]);

  // ===== 品詞でフィルタリング =====
  const filteredData = useMemo(() => {
    const lowerKey = String(rawLesson).toLowerCase();

    if (lowerKey.includes("動詞")) {
      return selectedData.filter((item) => isVerbLike(item));
    }
    if (lowerKey.includes("名詞")) {
      return selectedData.filter(
        (item) => !isVerbLike(item) && String(item.pos || "").includes("名詞")
      );
    }
    if (lowerKey.includes("い形")) {
      return selectedData.filter((item) => String(item.pos || "").includes("い形"));
    }
    if (lowerKey.includes("な形")) {
      return selectedData.filter((item) => String(item.pos || "").includes("な形"));
    }
    if (lowerKey.includes("副詞")) {
      return selectedData.filter((item) => String(item.pos || "").includes("副詞"));
    }
    return selectedData;
  }, [selectedData, rawLesson]);

  // ===== クイズ作成 =====
  const QUIZ_SIZE = 10;
  const pool = useMemo(() => shuffle(filteredData).slice(0, QUIZ_SIZE), [filteredData]);

  const readingPool = useMemo(() => {
    const readings = filteredData.map((x) => x?.reading || x?.yomi).filter(Boolean).map(String);
    return Array.from(new Set(readings));
  }, [filteredData]);

  const questions = useMemo(
    () =>
      pool.map((item, idx) => {
        const { qhtml, options, correctIndex } = adaptItemToQuestion(item, readingPool);
        return {
          id: item?.id ?? idx,
          kanji: item?.kanji ?? "",
          html: qhtml,
          options,
          correctIndex,
        };
      }),
    [pool, readingPool]
  );

  // ===== 状態管理 =====
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [judge, setJudge] = useState(null);
  const [history, setHistory] = useState([]);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const q = questions[index];

  // ===== リセット =====
  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setJudge(null);
    setHistory([]);
    setFinished(false);
  }, [level, rawLesson]);

  // ===== データがないと戻る =====
  useEffect(() => {
    if (!total) {
      const timer = setTimeout(() => nav(-1), 200);
      return () => clearTimeout(timer);
    }
  }, [total, nav]);

  // ===== 回答処理 =====
  const handleAnswer = (i) => {
    if (selected !== null || !q) return;
    setSelected(i);
    const ok = i === q.correctIndex;
    setJudge(ok ? "correct" : "wrong");
    setHistory((h) => [
      ...h,
      {
        no: index + 1,
        id: q.id,
        html: q.html,
        kanji: q.kanji,
        correct: q.options[q.correctIndex],
        picked: q.options[i],
        ok,
      },
    ]);
  };

  const goNext = () => {
    if (selected === null) return;
    if (index + 1 < total) {
      setIndex((n) => n + 1);
      setSelected(null);
      setJudge(null);
    } else {
      setFinished(true);
    }
  };

  const score = history.filter((h) => h.ok).length;

  // ✅ ======= 結果画面 =======
  if (finished) {
    const goDetail = (id) => nav(`/word/${level}/${id}`);

    return (
      <div className="quiz-result">
        <h2>{`${String(level).toUpperCase()} ${String(rawLesson || "ALL")} - 結果`}</h2>
        <p className="result-score">Score {score} / {total}</p>

        <ul className="result-list">
          {history.map((h, i) => (
            <li
              key={i}
              className={`result-item ${h.ok ? "ok" : "ng"}`}
            >
              <div className="q">
                <span
                  className="word-link"
                  onClick={() => goDetail(h.id)}
                  title="詳細を見る"
                >
                  No.{h.id}「{h.kanji}」
                </span>
                ： <span dangerouslySetInnerHTML={{ __html: h.html }} />
              </div>
              <div className="ansline">
                <span className="correct">正: {h.correct}</span>
                <span className="your">あなた: {h.picked}</span>
                <span className="mark">{h.ok ? "✅" : "❌"}</span>
              </div>
            </li>
          ))}
        </ul>

        <button className="result-back" onClick={() => nav(-1)}>
          レッスン一覧へ戻る
        </button>
      </div>
    );
  }

  // ===== 出題画面 =====
  return (
    <div
      className={`quiz-wrap ${judge ? (judge === "correct" ? "show-correct" : "show-wrong") : ""}`}
      key={q?.id}
    >
      <h1>{`${String(level).toUpperCase()} ${String(rawLesson || "ALL")}`}</h1>
      <p className="counter">{index + 1} / {total}</p>

      <h2 className="question">
        <span dangerouslySetInnerHTML={{ __html: q.html }} />
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

      <div className="wq-actions">
        <button className="wq-next" onClick={goNext} disabled={selected === null}>
          {index < total - 1 ? "次へ" : "終了"}
        </button>
      </div>
    </div>
  );
}
