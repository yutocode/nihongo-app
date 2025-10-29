//src/pages/grammar/n5/AdjTypeQuizPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/GrammarQuiz.css";

import useMCQQuiz from "../../../utils/useMCQQuiz";
import MCQQuizShell from "../../../components/quiz/MCQQuizShell";
import { getN5AdjLessonMixed } from "../../../data/grammar/n5/adjectives";

const LABEL_I = "い形容詞";
const LABEL_NA = "な形容詞";

function ChoiceFace({ label, lang }) {
  const isI = label === LABEL_I;
  const prefix = isI ? "い" : "な";
  const sub =
    lang.startsWith("en") ? (isI ? "i-adjective" : "na-adjective")
    : lang.startsWith("id") ? (isI ? "adjektiva-i" : "adjektiva-na")
    : lang.startsWith("zh-tw") || lang === "tw" ? (isI ? "い形容詞" : "な形容詞")
    : lang.startsWith("zh") ? (isI ? "い形容词" : "な形容词")
    : (isI ? "い形容詞" : "な形容詞");

  return (
    <div style={{ display: "grid", gap: 4 }}>
      <span className="jp" style={{ fontSize: 18, lineHeight: 1.1 }}>
        {prefix}<ruby>形容詞<rt>けいようし</rt></ruby>
      </span>
      <span style={{ fontSize: 12, opacity: 0.9 }}>{sub}</span>
    </div>
  );
}

export default function AdjTypeQuizPage() {
  const navigate = useNavigate();
  const { level = "n5", lesson = "lesson1" } = useParams();
  const { i18n, t } = useTranslation();

  // データ → MCQ 形式に正規化（2択）
  const items = useMemo(() => {
    if (level !== "n5") return [];
    const pool = getN5AdjLessonMixed(lesson) ?? [];
    return pool.map((it) => {
      const correct = it.type === "i" ? LABEL_I : LABEL_NA;
      const wrong   = it.type === "i" ? LABEL_NA : LABEL_I;
      const choices = [correct, wrong];
      return { id: it.id, question: it.word, choices, answer: 0 };
    });
  }, [level, lesson]);

  const quiz = useMCQQuiz(items, { shuffleQuestions: true, shuffleChoices: true, fxDelay: 700 });

  return (
    <MCQQuizShell
      title={t("adj.title", { level: level.toUpperCase() })}
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
      onExit={() => navigate(`/adj/${level}`)}
      renderQuestion={(q) => <span className="jp" style={{ fontSize: 28 }}>{q?.question}</span>}
      renderChoice={(c) => <ChoiceFace label={c} lang={i18n.language.toLowerCase()} />}
      // 2択なので番号は省略（空配列）／4択にしたいなら ["1","2","3","4"]
      numberLabels={[]}
    />
  );
}
