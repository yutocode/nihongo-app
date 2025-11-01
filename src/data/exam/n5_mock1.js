// src/data/exam/n5_mock1.js
export const N5_MOCK1 = {
  id: "n5_mock1",
  title: "N5 模試 Lesson1",
  durationSec: 45 * 60,          // 45分
  sections: [
    { key: "vocab",  range: [1,5],   label: "文字・語彙",  weight: 0.3 },
    { key: "grammar",range: [6,8],   label: "文法",        weight: 0.3 },
    { key: "reading",range: [9,11],  label: "読解",        weight: 0.4 },
  ],
  pass: { overall: 0.6, readingMin: 0.5 }, // 例: 合格60%、読解50%以上
  seed: "n5-mock1-2025-10",       // 同一受験で順序固定用
};
