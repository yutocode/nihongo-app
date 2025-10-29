// src/data/grammar/n5/particles/index.js
import L1 from "./lesson1";
import L2 from "./lesson2";
import L3 from "./lesson3";
import L4 from "./lesson4";
import L5 from "./lesson5";
import L6 from "./lesson6";
import L7 from "./lesson7";
import L8 from "./lesson8";
import L9 from "./lesson9";
import L10 from "./lesson10";

// レッスンキー正規化: "lesson1" → "Lesson1"
function normalizeLesson(key) {
  if (!key) return "Lesson1";
  const m = String(key).match(/lesson\s*(\d+)/i);
  return m ? `Lesson${m[1]}` : String(key);
}

export const n5ParticlesLessons = {
  Lesson1: L1,
  Lesson2: L2,
  Lesson3: L3,
  Lesson4: L4,
  Lesson5: L5,
  Lesson6: L6,
  Lesson7: L7,
  Lesson8: L8,
  Lesson9: L9,
  Lesson10: L10,
};

// 1レッスン分（配列）を取得
export function getN5ParticlesLesson(lesson = "lesson1") {
  const key = normalizeLesson(lesson);
  return n5ParticlesLessons[key] ?? [];
}

// すべての問題をフラットで取得（必要なら）
export function getAllN5Particles() {
  return Object.values(n5ParticlesLessons).flat();
}

export default n5ParticlesLessons;
