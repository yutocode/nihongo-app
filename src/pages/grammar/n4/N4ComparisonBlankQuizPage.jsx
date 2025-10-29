// src/pages/grammar/n4/N4ComparisonBlankQuizPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { n4ComparisonLessons } from "../../../data/grammar/n4/comparison";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";

// ---- helpers ----
const normalizeLesson = (k) => {
  if (!k) return "Lesson1";
  const m = String(k).match(/lesson\s*(\d+)/i);
  return m ? `Lesson${m[1]}` : k;
};

export default function N4ComparisonBlankQuizPage() {
  const { lesson } = useParams();
  const navigate = useNavigate();
  const lessonKey = normalizeLesson(lesson);

  const pool = n4ComparisonLessons?.[lessonKey] ?? n4ComparisonLessons?.Lesson1 ?? [];

  const items = useMemo(() => {
    return (pool || []).map((q, i) => {
      const answerIndex = Array.isArray(q.correct) ? q.correct[0] : q.correct;
      const decorated = String(q.sentence_ja || "").replaceAll(
        "___",
        "<span class='gq-blank'>___</span>"
      );
      return {
        id: q.id ?? `n4cmp-${lessonKey}-${i}`,
        question: decorated,          // HTMLとして描画する
        choices: q.choices_ja || [],
        answer: Number.isInteger(answerIndex) ? answerIndex : 0,
        _explain: q.explain_ja || "",
      };
    });
  }, [pool, lessonKey]);

  const quiz = useMCQQuiz(items, {
    shuffleQuestions: true,
    shuffleChoices: true,
    fxDelay: 700,
  });

  return (
    <MCQQuizShell
      title={`N4 比較（空所）${lessonKey}`}
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
      onExit={() => navigate("/grammar/n4/comparison")}
      // ★ TextWithRubyは使わず、HTMLをそのまま描画
      renderQuestion={(q) => (
        <span
          className="jp"
          style={{ fontSize: 22 }}
          dangerouslySetInnerHTML={{ __html: q?.question || "" }}
        />
      )}
      renderChoice={(c) => (
        <span dangerouslySetInnerHTML={{ __html: String(c) }} />
      )}
      // ★ 番号を非表示に
      numberLabels={[]}
    />
  );
}
