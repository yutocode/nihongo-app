import { N3_PARAPHRASE_Lesson1 } from "./lesson1";
import { N3_PARAPHRASE_Lesson2 } from "./lesson2";
import { N3_PARAPHRASE_Lesson3 } from "./lesson3";
import { N3_PARAPHRASE_Lesson4 } from "./lesson4";
import { N3_PARAPHRASE_Lesson5 } from "./lesson5";

export const N3_PARAPHRASE_LESSON_COUNT = 5;

function normalizeLessonKey(raw) {
  const m = String(raw ?? "").match(/(\d+)/);
  let no = m ? parseInt(m[1], 10) : 1;
  if (!Number.isFinite(no)) no = 1;
  no = Math.min(Math.max(no, 1), N3_PARAPHRASE_LESSON_COUNT);
  return `Lesson${no}`;
}

const LESSONS = new Map([
  ["Lesson1", N3_PARAPHRASE_Lesson1],
  ["Lesson2", N3_PARAPHRASE_Lesson2],
  ["Lesson3", N3_PARAPHRASE_Lesson3],
  ["Lesson4", N3_PARAPHRASE_Lesson4],
  ["Lesson5", N3_PARAPHRASE_Lesson5],
]);

export function getN3ParaphraseLesson(lessonKey) {
  return LESSONS.get(normalizeLessonKey(lessonKey)) || [];
}
