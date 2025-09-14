// ===== 名詞 (Lesson1〜6) =====
import { n5part_nouns1 } from "./n5part_nouns1";
import { n5part_nouns2 } from "./n5part_nouns2";
import { n5part_nouns3 } from "./n5part_nouns3";
import { n5part_nouns4 } from "./n5part_nouns4";
import { n5part_nouns5 } from "./n5part_nouns5";
import { n5part_nouns6 } from "./n5part_nouns6";

// ===== い形容詞 (Lesson7〜8) =====
import { n5part_iAdjectives1 } from "./n5part_iAdjectives1";
import { n5part_iAdjectives2 } from "./n5part_iAdjectives2";

// ===== な形容詞 (Lesson9) =====
import { n5part_naAdjectives1 } from "./n5part_naAdjectives1";

// ===== 副詞・表現 (Lesson10) =====
import { n5part_adverbs1 } from "./n5part_adverbs1";

// ===== 助詞・接続 (Lesson11) =====
import { n5part_particles1 } from "./n5part_particles1";

// ===== 助数詞 (Lesson12) =====
import { n5part_counters1 } from "./n5part_counters1";

// ===== 動詞 (Lesson13〜14) =====
import { n5part_verbs1 } from "./n5part_verbs1";
import { n5part_verbs2 } from "./n5part_verbs2";

// ==================== エクスポート ====================
export const n5WordSets = {
  // 名詞
  Lesson1: n5part_nouns1.Lesson1,
  Lesson2: n5part_nouns2.Lesson2,
  Lesson3: n5part_nouns3.Lesson3,
  Lesson4: n5part_nouns4.Lesson4,
  Lesson5: n5part_nouns5.Lesson5,
  Lesson6: n5part_nouns6.Lesson6,

  // い形容詞
  Lesson7: n5part_iAdjectives1.Lesson7,
  Lesson8: n5part_iAdjectives2.Lesson8,

  // な形容詞
  Lesson9: n5part_naAdjectives1.Lesson9,

  // 副詞・表現
  Lesson10: n5part_adverbs1.Lesson10,

  // 助詞・接続
  Lesson11: n5part_particles1.Lesson11,

  // 助数詞
  Lesson12: n5part_counters1.Lesson12,

  // 動詞（verbs1 + verbs2 を統合して Lesson13 と Lesson14）
  Lesson13: n5part_verbs1.Lesson13,
  Lesson14: n5part_verbs2.Lesson14,
};
