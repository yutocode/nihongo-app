// src/data/exam/index.js

// ===== N5 =====
import {
  N5_MOCK1_META,
  N5_MOCK1_ITEMS,
  N5_MOCK1_SECTION_OF,
} from "./n5/n5_mock1";

// ===== N4 =====
import {
  N4_MOCK1_META,
  N4_MOCK1_ITEMS,
  N4_MOCK1_SECTION_OF,
} from "./n4/n4_mock1";

// ===== N3 =====
import {
  N3_MOCK1_META,
  N3_MOCK1_ITEMS,
  N3_MOCK1_SECTION_OF,
} from "./n3/n3_mock1";

// 試験レジストリ
export const EXAM_REGISTRY = {
  "n5-mock1": {
    meta: N5_MOCK1_META,
    items: N5_MOCK1_ITEMS,
    sectionOf: N5_MOCK1_SECTION_OF,
  },
  "n4-mock1": {
    meta: N4_MOCK1_META,
    items: N4_MOCK1_ITEMS,
    sectionOf: N4_MOCK1_SECTION_OF,
  },
  "n3-mock1": {
    meta: N3_MOCK1_META,
    items: N3_MOCK1_ITEMS,
    sectionOf: N3_MOCK1_SECTION_OF,
  },
};

// 分野ごとに束ねるヘルパ（スコア画面やレビューで便利）
// sectionOf(no) → q.section → "vocab" の順で判定。
// 未知セクションにも対応しつつ、最後に既定4分野キーを必ず用意。
export function groupBySection(examPack) {
  const map = {};
  const items = examPack?.items || [];
  const sectionOf =
    typeof examPack?.sectionOf === "function" ? examPack.sectionOf : null;

  for (const q of items) {
    const sec =
      (sectionOf ? sectionOf(q.no) : null) ||
      q.section ||
      (q.no <= 8 ? "vocab" : q.no <= 20 ? "grammar" : q.no <= 30 ? "reading" : "listening");

    if (!map[sec]) map[sec] = [];
    map[sec].push(q);
  }

  // 既定4分野の穴埋め（存在しない場合は空配列）
  for (const k of ["vocab", "grammar", "reading", "listening"]) {
    if (!map[k]) map[k] = [];
  }
  return map;
}
