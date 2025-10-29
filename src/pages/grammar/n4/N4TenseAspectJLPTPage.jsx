// src/pages/grammar/n4/N4TenseAspectJLPTPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/GrammarQuiz.css";
import { n4TenseAspectLessons } from "../../../data/grammar/n4/tense_aspect";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";

const normalizeLesson = (k) => {
  if (!k) return "Lesson1";
  const m = String(k).match(/lesson\s*(\d+)/i);
  return m ? `Lesson${m[1]}` : k;
};

export default function N4TenseAspectJLPTPage() {
  const { lesson } = useParams();
  const navigate = useNavigate();
  const lessonKey = normalizeLesson(lesson);

  // 元データ（なければ Lesson1）
  const pool =
    n4TenseAspectLessons?.[lessonKey] ??
    n4TenseAspectLessons?.Lesson1 ??
    [];

  // MCQ用に整形
  const items = useMemo(() => {
    const safe = (pool || []).filter(
      (q) =>
        Array.isArray(q?.choices_ja) &&
        q.choices_ja.length === 4 &&
        Number.isInteger(q.correct)
    );
    return safe.map((q, i) => {
      // JLPT 風：空欄表記を（　）に置換してHTML描画
      const sentenceHtml = String(q.sentence_ja || "").replace(/___/g, "（　）");
      return {
        id: q.id ?? `n4-ta-${lessonKey}-${i}`,
        // context は renderQuestion で上に別表示
        question: sentenceHtml,
        choices: q.choices_ja.slice(),
        answer: q.correct,
        _context: q.context_ja || "",
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
      title={`N4 時制・アスペクト（JLPT）${lessonKey}`}
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
      onExit={() => navigate("/grammar/n4")}
      // 上にコンテキスト、その下に問題文（HTML）を表示
      renderQuestion={(q) => (
        <div>
          {q?._context ? (
            <pre
              className="context"
              style={{ whiteSpace: "pre-wrap", marginBottom: 8 }}
              dangerouslySetInnerHTML={{ __html: q._context }}
            />
          ) : null}
          <div
            dangerouslySetInnerHTML={{ __html: q?.question || "" }}
          />
        </div>
      )}
      // 選択肢はHTML許容
      renderChoice={(c) => (
        <span dangerouslySetInnerHTML={{ __html: String(c) }} />
      )}
      // ★ 番号を非表示に
      numberLabels={[]}
    />
  );
}
