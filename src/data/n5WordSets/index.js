// src/data/n5WordSets/index.js
import { n5part_nouns1 } from "./n5part_nouns1.js";
import { n5part_nouns2 } from "./n5part_nouns2.js";
import { n5part_nouns3 } from "./n5part_nouns3.js";
import { n5part_nouns4 } from "./n5part_nouns4.js";
import { n5part_nouns5 } from "./n5part_nouns5.js";
import { n5part_nouns6 } from "./n5part_nouns6.js";

import { n5part_iAdjectives1 } from "./n5part_iAdjectives1.js";
import { n5part_iAdjectives2 } from "./n5part_iAdjectives2.js";

import { n5part_naAdjectives1 } from "./n5part_naAdjectives1.js";

import { n5part_adverbs1 } from "./n5part_adverbs1.js";

import { n5part_particles1 } from "./n5part_particles1.js";

import { n5part_counters1 } from "./n5part_counters1.js";

import { n5part_verbs1 } from "./n5part_verbs1.js";
import { n5part_verbs2 } from "./n5part_verbs2.js";

// util: レッスンごとに番号付け
const withIds = (list, startId) =>
  list.map((w, i) => ({ id: startId + i, ...w }));

// ==================== エクスポート ====================
export const n5WordSets = {
  // 名詞
  Lesson1: withIds(n5part_nouns1.Lesson1, 1),
  Lesson2: withIds(n5part_nouns2.Lesson2, 51),
  Lesson3: withIds(n5part_nouns3.Lesson3, 101),
  Lesson4: withIds(n5part_nouns4.Lesson4, 151),
  Lesson5: withIds(n5part_nouns5.Lesson5, 201),
  Lesson6: withIds(n5part_nouns6.Lesson6, 251),

  // い形容詞
  Lesson7: withIds(n5part_iAdjectives1.Lesson7, 301),
  Lesson8: withIds(n5part_iAdjectives2.Lesson8, 351),

  // な形容詞
  Lesson9: withIds(n5part_naAdjectives1.Lesson9, 401),

  // 副詞・表現
  Lesson10: withIds(n5part_adverbs1.Lesson10, 451),

  // 助詞・接続
  Lesson11: withIds(n5part_particles1.Lesson11, 501),

  // 助数詞
  Lesson12: withIds(n5part_counters1.Lesson12, 531),

  // 動詞
  Lesson13: withIds(n5part_verbs1.Lesson13, 561),
  Lesson14: withIds(n5part_verbs2.Lesson14, 611),
};
