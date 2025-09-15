import { create } from "zustand";

/** ユーティリティ： "n5.particles.Lesson1" のような path で安全に更新 */
function setByPath(root, path, updater) {
  const keys = String(path).split(".");
  const last = keys.pop();
  let cur = root;
  for (const k of keys) {
    if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  const prev = cur[last] ?? { answered: 0, correct: 0, total: 0 };
  cur[last] = updater(prev);
}

/**
 * sections 例:
 * {
 *   n5: {
 *     particles: { total: 40, answered: 12, correct: 9,
 *       Lesson1: { total: 20, answered: 12, correct: 9 },
 *       Lesson2: { total: 20, answered: 0,  correct: 0 },
 *     },
 *     adjectives: {...}
 *   },
 *   n4: {...}
 * }
 */
export const useProgressStore = create((set, get) => ({
  sections: {},

  /** 分母（total）をセット。path 例: "n5.particles", "n5.particles.Lesson1" */
  setTotalByPath(path, total) {
    set((state) => {
      const next = structuredClone(state.sections);
      setByPath(next, path, (cur) => ({ ...cur, total: Number(total) || 0 }));
      return { sections: next };
    });
  },

  /** 回答を記録（正誤）。path 例: "n5.particles", "n5.particles.Lesson1" */
  recordAnswerByPath(path, isCorrect) {
    set((state) => {
      const next = structuredClone(state.sections);
      setByPath(next, path, (cur) => ({
        answered: (cur.answered || 0) + 1,
        correct: (cur.correct || 0) + (isCorrect ? 1 : 0),
        total: cur.total || 0,
      }));
      return { sections: next };
    });
  },

  /** まとめて上書き（Firestoreからのロードなどに） */
  hydrate(sectionsObj) {
    set({ sections: sectionsObj || {} });
  },

  /** 全消し（デバッグ用） */
  resetAll() {
    set({ sections: {} });
  },
}));

// まだ入れていなければ：npm i zustand
