// src/data/exam/index.js
import {
  N5_MOCK1_META,
  N5_MOCK1_ITEMS,
  N5_MOCK1_SECTION_OF,
} from "./n5/n5_mock1";

export const EXAM_REGISTRY = {
  "n5-mock1": {
    meta: N5_MOCK1_META,
    items: N5_MOCK1_ITEMS,
    sectionOf: N5_MOCK1_SECTION_OF,
  },
};

// 分野ごとに束ねるヘルパ（スコア画面やレビューで便利）
export function groupBySection(examPack) {
  const map = { vocab: [], grammar: [], reading: [], listening: [] };
  for (const q of examPack.items) map[q.section].push(q);
  return map;
}
