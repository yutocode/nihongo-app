// src/pages/grammar/n3/N3VoiceQuizPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
import { getN3VoiceLesson } from "../../../data/grammar/n3/voice";

function normalizeLesson(raw) {
  const m = String(raw ?? "").match(/(\d+)/);
  const n = m ? Math.max(1, parseInt(m[1], 10)) : 1;
  return `Lesson${n}`;
}

const hasRuby = (s) => typeof s === "string" && /<ruby\b|<rt\b/i.test(s);

export default function N3VoiceQuizPage() {
  const navigate = useNavigate();
  const { level = "n3", lesson = "lesson1" } = useParams();

  const normLevel = String(level).toLowerCase();
  const normLesson = normalizeLesson(lesson);

  const items = useMemo(() => {
    if (normLevel !== "n3") return [];
    const src = getN3VoiceLesson(normLesson) ?? [];
    const mapped = src
      .filter(
        (q) =>
          Array.isArray(q?.choices) &&
          q.choices.length === 4 &&
          Number.isInteger(q?.answer) &&
          q.answer >= 0 &&
          q.answer < 4
      )
      .map((q, i) => {
        // ※ プロパティ差異に強いフォールバック
        const html =
          q.furigana ??
          q.question ??
          q.sentence ??
          q.sentence_ja ??
          "";

        if (!html) {
          // 何も入ってこない場合は一目で気づけるようにログ
          // eslint-disable-next-line no-console
          console.warn("[N3VoiceQuizPage] empty question:", q);
        }

        return {
          id: q.id ?? `n3-voice-${normLesson}-${i}`,
          question: String(html),
          choices: q.choices,
          answer: q.answer,
        };
      });

    // 先頭だけデバッグ確認
    if (mapped[0]) {
      // eslint-disable-next-line no-console
      console.debug("[N3VoiceQuizPage] sample question:", mapped[0].question);
    }

    return mapped;
  }, [normLevel, normLesson]);

  const quiz = useMCQQuiz(items, {
    shuffleQuestions: true,
    shuffleChoices: true,
    fxDelay: 750,
  });

  return (
    <MCQQuizShell
      title={`N3 受け身・使役受け身 ${normLesson}`}
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
      onExit={() => navigate(`/grammar/n3`)}
      renderQuestion={(q) =>
        hasRuby(q?.question) ? (
          <span
            className="jp"
            style={{ fontSize: 22 }}
            // ここで直接 HTML として流し込み
            dangerouslySetInnerHTML={{ __html: q.question }}
          />
        ) : (
          <span className="jp" style={{ fontSize: 22 }}>
            {q?.question || ""}
          </span>
        )
      }
      numberLabels={[]}
    />
  );
}
