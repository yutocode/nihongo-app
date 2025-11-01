import { N3_VOICE_Lesson1 } from "./lesson1";
import { N3_VOICE_Lesson2 } from "./lesson2";
import { N3_VOICE_Lesson3 } from "./lesson3";
import { N3_VOICE_Lesson4 } from "./lesson4";
import { N3_VOICE_Lesson5 } from "./lesson5";
import { N3_VOICE_Lesson6 } from "./lesson6";
import { N3_VOICE_Lesson7 } from "./lesson7";
import { N3_VOICE_Lesson8 } from "./lesson8";

export const N3_VOICE_LESSON_COUNT = 8;

function normalizeLessonKey(raw) {
  const m = String(raw ?? "").match(/(\d+)/);
  let no = m ? parseInt(m[1], 10) : 1;
  if (!Number.isFinite(no)) no = 1;
  no = Math.min(Math.max(no, 1), N3_VOICE_LESSON_COUNT);
  return `Lesson${no}`;
}

const LESSONS = new Map([
  ["Lesson1", N3_VOICE_Lesson1],
  ["Lesson2", N3_VOICE_Lesson2],
  ["Lesson3", N3_VOICE_Lesson3],
  ["Lesson4", N3_VOICE_Lesson4],
  ["Lesson5", N3_VOICE_Lesson5],
  ["Lesson6", N3_VOICE_Lesson6],
  ["Lesson7", N3_VOICE_Lesson7],
  ["Lesson8", N3_VOICE_Lesson8],
]);

export function getN3VoiceLesson(lessonKey) {
  return LESSONS.get(normalizeLessonKey(lessonKey)) || [];
}
