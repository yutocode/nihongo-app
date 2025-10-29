import { useMemo, useState, useEffect } from "react";

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function useMCQQuiz(items, {
  shuffleQuestions = true,
  shuffleChoices = true,
  fxDelay = 700,
} = {}) {
  // items: [{ id, question, choices:[], answer:Number }]
  const questions = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const base = shuffleQuestions ? shuffle(items) : items.slice();
    if (!shuffleChoices) return base;
    return base.map((q) => {
      if (!Array.isArray(q.choices) || typeof q.answer !== "number") return q;
      const order = shuffle([...Array(q.choices.length).keys()]);
      return {
        ...q,
        _order: order,
        choices: order.map((i) => q.choices[i]),
        answer: order.indexOf(q.answer),
      };
    });
  }, [items, shuffleQuestions, shuffleChoices]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);   // number|null
  const [judge, setJudge] = useState(null);         // "correct"|"wrong"|null
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setIndex(0); setScore(0); setSelected(null); setJudge(null); setFinished(false);
  }, [items]);

  const current = questions[index] || null;
  const total = questions.length;

  const pick = (i) => {
    if (!current || selected !== null) return;
    const ok = i === current.answer;
    setSelected(i);
    setJudge(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setSelected(null);
      setJudge(null);
      if (index + 1 < total) setIndex((n) => n + 1);
      else setFinished(true);
    }, fxDelay);
  };

  const restart = () => {
    setIndex(0); setScore(0); setSelected(null); setJudge(null); setFinished(false);
  };

  const backOne = () => {
    if (selected !== null) return;
    if (index > 0) setIndex((n) => n - 1);
  };

  return { questions, current, index, total, score, selected, judge, finished, pick, restart, backOne };
}
