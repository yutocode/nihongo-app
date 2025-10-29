// src/pages/grammar/n5/N5ParticlesQuizPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
import { getN5ParticlesLesson } from "../../../data/grammar/n5/particles";

export default function N5ParticlesQuizPage() {
  const navigate = useNavigate();
  const { level = "n5", lesson = "lesson1" } = useParams();

  // データ → MCQ 形式に整形
  const items = useMemo(() => {
    if (String(level).toLowerCase() !== "n5") return [];
    const src = getN5ParticlesLesson(lesson) ?? [];
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
        id: q.id ?? `particles-${lesson}-${i}`,
        // ふりがなHTMLがあればそれを使う（シェル側で innerHTML 描画）
        question: q.furigana || q.question || "",
        choices: q.choices,
        answer: q.answer,
      }));
  }, [level, lesson]);

  // ○×や進行は共通フックに任せる（ここでランダム化ON）
  const quiz = useMCQQuiz(items, {
    shuffleQuestions: true,
    shuffleChoices: true,
    fxDelay: 750,
  });

  return (
    <MCQQuizShell
      title={`${String(level).toUpperCase()} particles ${lesson}`}
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
      onExit={() => navigate(`/grammar/${level}/particles`)}
      // 問題文：<ruby> を含む場合はinnerHTML表示、それ以外はプレーン
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
