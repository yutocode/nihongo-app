// src/pages/WordQuizPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/WordQuiz.css";

import useMCQQuiz from "@/utils/useMCQQuiz";
import MCQQuizShell from "@/components/quiz/MCQQuizShell";
import WordProgressBar from "@/components/WordProgressBar.jsx";

// ===== データ（各レベル）=====
import { n1WordSets } from "@/data/wordquiz/n1";
import { n2WordSets } from "@/data/wordquiz/n2";
import { n3WordSets } from "@/data/wordquiz/n3";
import { n4WordSets } from "@/data/wordquiz/n4";
import { n5WordSets } from "@/data/wordquiz/n5";

const WORDSETS_BY_LEVEL = {
  n1: n1WordSets,
  n2: n2WordSets,
  n3: n3WordSets,
  n4: n4WordSets,
  n5: n5WordSets,
};

/* ---------------------------
 * ユーティリティ
 * --------------------------- */
// 各パートが「配列」でも「{ LessonX:[…] }」でも吸収してフラット化
function flattenFromParts(wordSetsObj) {
  const out = [];
  if (!wordSetsObj) return out;

  for (const [partKey, part] of Object.entries(wordSetsObj)) {
    if (!part) continue;

    // そのまま配列
    if (Array.isArray(part)) {
      for (const w of part) {
        if (!w || typeof w !== "object") continue;
        out.push({ ...w, _partKey: partKey, id: Number(w.id) });
      }
      continue;
    }

    // { LessonX: [...] } 形式
    if (typeof part === "object") {
      for (const [k, list] of Object.entries(part)) {
        if (!/^Lesson\d+$/i.test(k) || !Array.isArray(list)) continue;
        for (const w of list) {
          if (!w || typeof w !== "object") continue;
          out.push({
            ...w,
            _partKey: partKey,
            _lessonKey: k,
            id: Number(w.id),
          });
        }
      }
    }
  }

  return out
    .filter((w) => Number.isFinite(w.id))
    .sort((a, b) => a.id - b.id);
}

// :lesson を解釈（pos/num/rand/all/自由語）
function parseKey(raw) {
  const s = String(raw || "");

  // pos:名詞:1-50[:offset]
  {
    const m = s.match(/^pos:([^:]+)(?::(\d+)-(\d+))?(?::(\d+))?$/i);
    if (m) {
      return {
        kind: "pos",
        pos: m[1],
        from: m[2] ? +m[2] : null,
        to: m[3] ? +m[3] : null,
        offset: m[4] ? +m[4] : 0,
      };
    }
  }

  // num:1-100
  {
    const m = s.match(/^num:(\d+)-(\d+)$/i);
    if (m) return { kind: "num", from: +m[1], to: +m[2] };
  }

  // rand:all
  if (s === "rand:all") return { kind: "rand", all: true };

  // rand:1-300
  {
    const m = s.match(/^rand:(\d+)-(\d+)$/i);
    if (m) return { kind: "rand", from: +m[1], to: +m[2] };
  }

  // all
  if (s.toLowerCase() === "all") return { kind: "all" };

  // それ以外はテキスト検索
  return { kind: "text", q: s };
}

// 品詞ゆる判定（partKey/posに対応）
const pk = (x) => String(x?._partKey || "").toLowerCase();
const isVerbLike = (x) =>
  /verbs?/.test(pk(x)) || /動詞/.test(String(x?.pos || ""));
const isNounLike = (x) =>
  /nouns?/.test(pk(x)) || /名詞/.test(String(x?.pos || ""));
const isAdjILike = (x) =>
  /iadjectives?/.test(pk(x)) || /い形|形容詞/.test(String(x?.pos || ""));
const isAdjNaLike = (x) =>
  /naadjectives?/.test(pk(x)) || /な形|形容動詞/.test(String(x?.pos || ""));
const isAdvLike = (x) =>
  /adverbs?/.test(pk(x)) || /副詞/.test(String(x?.pos || ""));

// データ → MCQ形式
function toMCQItems(sourceItems) {
  return sourceItems.map((it, i) => {
    if (
      it?.question_ja &&
      Array.isArray(it?.choices_ja) &&
      Number.isFinite(it?.correct)
    ) {
      const choices = it.choices_ja.map(String);
      const ansIdx = Math.max(
        0,
        Math.min(choices.length - 1, Number(it.correct)),
      );
      return {
        id: it.id ?? i,
        question: String(it.question_ja), // HTML（<ruby>, <u> 等）OK
        choices,
        answer: ansIdx,
        payload: it,
      };
    }

    const dump = JSON.stringify(it).slice(0, 40);
    return {
      id: it.id ?? i,
      question: `<code>${dump}</code> から正しい項目を選んでください`,
      choices: ["A", "B", "C", "D"],
      answer: 0,
      payload: it,
    };
  });
}

/* ---------------------------
 * メイン
 * --------------------------- */
export default function WordQuizPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { level = "n5", lesson: rawLesson = "all" } = useParams();

  const normLevel = String(level).toLowerCase();
  const sets = WORDSETS_BY_LEVEL[normLevel] || {};

  const decoded = useMemo(() => {
    try {
      return decodeURIComponent(String(rawLesson || "all"));
    } catch {
      return String(rawLesson || "all");
    }
  }, [rawLesson]);

  const key = useMemo(() => parseKey(decoded), [decoded]);
  const all = useMemo(() => flattenFromParts(sets), [sets]);

  // プール抽出
  const pool = useMemo(() => {
    if (!all.length) return [];

    switch (key.kind) {
      case "all":
        return all;

      case "num": {
        const { from, to } = key;
        return all.filter((w) => w.id >= from && w.id <= to);
      }

      case "rand": {
        return key.all
          ? all
          : all.filter(
              (w) =>
                w.id >= (key.from || -Infinity) &&
                w.id <= (key.to || Infinity),
            );
      }

      case "pos": {
        const { pos, from, to, offset } = key;
        let arr = all;

        if (pos.includes("動詞")) arr = arr.filter(isVerbLike);
        else if (pos.includes("名詞")) arr = arr.filter(isNounLike);
        else if (pos.includes("い形")) arr = arr.filter(isAdjILike);
        else if (pos.includes("な形")) arr = arr.filter(isAdjNaLike);
        else if (pos.includes("副詞")) arr = arr.filter(isAdvLike);

        if (Number.isFinite(from) && Number.isFinite(to)) {
          arr = arr.filter((w) => w.id >= from && w.id <= to);
        }
        if (Number.isFinite(offset) && offset > 0) {
          arr = arr.slice(offset);
        }
        return arr;
      }

      case "text": {
        const q = key.q.toLowerCase();
        return all.filter(
          (w) =>
            String(w._partKey || "").toLowerCase().includes(q) ||
            String(w._lessonKey || "").toLowerCase().includes(q),
        );
      }

      default:
        return all;
    }
  }, [all, key]);

  // MCQ化 → シャッフルして10問
  const items = useMemo(() => {
    const base = toMCQItems(pool);
    return [...base].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [pool]);

  // データ無しUI
  if (!items.length) {
    return (
      <div className="quiz-wrap">
        <h1>{`${normLevel.toUpperCase()} ${decoded || "ALL"}`}</h1>
        <p className="counter">0 / 0</p>
        <div className="question">該当データが見つかりませんでした。</div>
        <div className="wq-actions">
          <button className="result-back" onClick={() => navigate(-1)}>
            レッスン一覧へ戻る
          </button>
        </div>
      </div>
    );
  }

  const quiz = useMCQQuiz(items, {
    shuffleQuestions: false, // 上でシャッフル済み
    shuffleChoices: true,
    fxDelay: 750,
  });

  return (
    <div className="wq-page">
      {/* ★ 単語帳と同じプログレスバー */}
      <div className="wq-progress">
        <WordProgressBar currentIndex={quiz.index} total={quiz.total} />
      </div>

      <MCQQuizShell
        title={`${t("wordquiz.title", {
          defaultValue: "単語クイズ",
        })}（${level.toUpperCase()} / ${decoded}）`}
        questions={quiz.questions}
        current={quiz.current}
        index={quiz.index}
        total={quiz.total}
        score={quiz.score}
        selected={quiz.selected}
        judge={quiz.judge}
        finished={quiz.finished}
        onPick={quiz.pick}
        onRestart={quiz.restart}
        onBack={quiz.backOne}
        onExit={() => navigate(`/word-quiz/${normLevel}`)}
        renderQuestion={(q) => (
          // HTML（<u>, <ruby> など）をそのまま表示
          <span
            className="jp"
            style={{ fontSize: 22 }}
            dangerouslySetInnerHTML={{ __html: String(q?.question || "") }}
          />
        )}
        numberLabels={[]}
      />
    </div>
  );
}
