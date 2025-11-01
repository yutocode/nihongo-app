// src/data/grammar/n4/advice-obligation/index.js

import { N4_ADVICE_OBLIGATION_Lesson1 } from "./n4_advice_obligation_lesson1";
import { N4_ADVICE_OBLIGATION_Lesson2 } from "./n4_advice_obligation_lesson2";
import { N4_ADVICE_OBLIGATION_Lesson3 } from "./n4_advice_obligation_lesson3";
import { N4_ADVICE_OBLIGATION_Lesson4 } from "./n4_advice_obligation_lesson4";
import { N4_ADVICE_OBLIGATION_Lesson5 } from "./n4_advice_obligation_lesson5";
import { N4_ADVICE_OBLIGATION_Lesson6 } from "./n4_advice_obligation_lesson6";
import { N4_ADVICE_OBLIGATION_Lesson7 } from "./n4_advice_obligation_lesson7";
import { N4_ADVICE_OBLIGATION_Lesson8 } from "./n4_advice_obligation_lesson8";

export const N4_AO_LESSON_COUNT = 8;

/** レッスンキーを "LessonX" 形式に正規化（範囲外は 1..8 に丸める） */
export function normalizeLessonKey(raw) {
  const m = String(raw ?? "").match(/(\d+)/);
  let no = m ? parseInt(m[1], 10) : 1;
  if (!Number.isFinite(no)) no = 1;
  no = Math.min(Math.max(no, 1), N4_AO_LESSON_COUNT);
  return `Lesson${no}`;
}

const LESSONS = new Map([
  ["Lesson1", N4_ADVICE_OBLIGATION_Lesson1],
  ["Lesson2", N4_ADVICE_OBLIGATION_Lesson2],
  ["Lesson3", N4_ADVICE_OBLIGATION_Lesson3],
  ["Lesson4", N4_ADVICE_OBLIGATION_Lesson4],
  ["Lesson5", N4_ADVICE_OBLIGATION_Lesson5],
  ["Lesson6", N4_ADVICE_OBLIGATION_Lesson6],
  ["Lesson7", N4_ADVICE_OBLIGATION_Lesson7],
  ["Lesson8", N4_ADVICE_OBLIGATION_Lesson8],
]);

/** N4: 助言・義務・不要 クイズデータ取得 */
export function getN4AdviceObligationLesson(lessonKey) {
  const key = normalizeLessonKey(lessonKey);
  return LESSONS.get(key) || [];
}

/** 利便用：利用可能なレッスンキー配列を返す（["Lesson1", ...]） */
export function listN4AdviceObligationLessons() {
  return Array.from({ length: N4_AO_LESSON_COUNT }, (_, i) => `Lesson${i + 1}`);
}
