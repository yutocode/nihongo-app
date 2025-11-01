// src/store/useExamStore.jsx
import { create } from "zustand";
import seedrandom from "seedrandom";

export const useExamStore = create((set, get) => ({
  exam: null,          // 試験メタ
  items: [],           // 出題（シャッフル済み）
  answers: {},         // { [qid]: choiceIndex }
  startedAt: null,
  endsAt: null,
  lockedNav: true,     // 前へ戻れない
  setExam(meta, rawItems) {
    const rng = seedrandom(meta.seed);
    // セクション内順序は維持しつつ、選択肢だけシャッフル例：
    const items = rawItems.map(q => {
      const idx = [...q.choices.keys()].sort(() => rng() - 0.5);
      return { ...q, choiceOrder: idx };
    });
    const now = Date.now();
    set({
      exam: meta,
      items,
      answers: {},
      startedAt: now,
      endsAt: now + meta.durationSec * 1000
    });
  },
  answer(qid, choice) { set(s => ({ answers: { ...s.answers, [qid]: choice } })); },
  submit() { /* 採点→結果ページへ */ }
}));
