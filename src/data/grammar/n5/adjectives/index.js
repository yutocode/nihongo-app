// src/data/grammar/n5/adjectives/index.js

// 各レッスンの読み込み
import { n5AdjLesson1 } from "./lesson1.js";
import { n5AdjLesson2 } from "./lesson2.js";
import { n5AdjLesson3 } from "./lesson3.js";
import { n5AdjLesson4 } from "./lesson4.js";
import { n5AdjLesson5 } from "./lesson5.js";
import { n5AdjLesson6 } from "./lesson6.js";

// lesson 個別エクスポート（必要なら直接 import できるようにする）
export {
  n5AdjLesson1,
  n5AdjLesson2,
  n5AdjLesson3,
  n5AdjLesson4,
  n5AdjLesson5,
  n5AdjLesson6,
};

// レッスンをまとめて参照できるオブジェクト
export const N5_ADJ_LESSONS = {
  lesson1: n5AdjLesson1,
  lesson2: n5AdjLesson2,
  lesson3: n5AdjLesson3,
  lesson4: n5AdjLesson4,
  lesson5: n5AdjLesson5,
  lesson6: n5AdjLesson6,
};

// ----------------------------------------------------------
// ↓ おまけ機能：い/な形容詞をランダムミックスするビルダー
// ----------------------------------------------------------

// プール（い/な全体リスト）
import { n5AdjTypePool } from "../n5AdjTypePool.js";


// シード付き乱数（決定的シャッフル用）
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleWithSeed(arr, seed) {
  const rnd = mulberry32(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// lessonKey (例: "lesson1") に応じて い/な形容詞 5問ずつ → 10問返す
export function getN5AdjLessonMixed(lessonKey) {
  const num = parseInt(String(lessonKey).replace(/\D+/g, "") || "1", 10);
  const seed = 1234 + num;

  const I = n5AdjTypePool.filter(x => x.type === "i" || x.type === "i_opt");
  const NA = n5AdjTypePool.filter(x => x.type === "na");

  const Ishuffled = shuffleWithSeed(I, seed);
  const NAshuffled = shuffleWithSeed(NA, seed * 7 + 11);

  const takeI = Ishuffled.slice(0, 5);
  const takeNA = NAshuffled.slice(0, 5);

  return shuffleWithSeed([...takeI, ...takeNA], seed * 31 + 99);
}
