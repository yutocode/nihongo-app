// src/pages/grammar/n4/N4ParticlesQuizPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
// ★ N4用データに差し替え
import { getN4ParticlesLesson } from "../../../data/grammar/n4/particles";

// lesson パラメータを "Lesson1" 形式に正規化
function normalizeLesson(raw) {
  if (!raw) return "Lesson1";
  const s = String(raw).trim();
  // "lesson1" / "Lesson1" / "1" / "l1" などを許容
  const m = s.match(/(\d+)/);
  const no = m ? parseInt(m[1], 10) : 1;
  return `Lesson${Math.max(1, no)}`;
}

export default function N4ParticlesQuizPage() {
  const navigate = useNavigate();
  const { level = "n4", lesson = "lesson1" } = useParams();

  const normLevel = String(level).toLowerCase();
  const normLesson = normalizeLesson(lesson);

  // データ → MCQ 形式に整形
  const items = useMemo(() => {
    if (normLevel !== "n4") return [];
    const src = getN4ParticlesLesson(normLesson) ?? [];
    return src
      .filter(
        (q) =>
          Array.isArray(q?.choices) &&
          q.choices.length === 4 &&
          Number.isInteger(q?.answer) &&
          q.answer >= 0 &&
          q.answer < 4
      )
      .map((q, i) => ({
        id: q.id ?? `particles-${normLesson}-${i}`,
        // ふりがなHTMLがあればそれを使う（シェル側で innerHTML 描画）
        question: q.furigana || q.question || "",
        choices: q.choices,
        answer: q.answer,
      }));
  }, [normLevel, normLesson]);

  // ○×や進行は共通フックに任せる（ここでランダム化ON）
  const quiz = useMCQQuiz(items, {
    shuffleQuestions: true,
    shuffleChoices: true,
    fxDelay: 750,
  });

  return (
    <MCQQuizShell
      title={`N4 particles ${normLesson}`}
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
      onExit={() => navigate(`/grammar/${normLevel}/particles`)}
      // 問題文：<ruby> を含む場合は innerHTML 表示、それ以外はプレーン
      renderQuestion={(q) =>
        typeof q?.question === "string" && q.question.includes("<rt>") ? (
          <span
            className="jp"
            style={{ fontSize: 22 }}
            dangerouslySetInnerHTML={{ __html: q.question }}
          />
        ) : (
          <span className="jp" style={{ fontSize: 22 }}>
            {q?.question || ""}
          </span>
        )
      }
      // ★ 番号を非表示に
      numberLabels={[]}
    />
  );
}
