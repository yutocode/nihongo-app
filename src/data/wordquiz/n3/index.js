// src/data/wordquiz/n3/index.js

// ---- Re-exports ----
export { Lesson1 } from "./lesson1";
export { Lesson2 } from "./lesson2";
export { Lesson3 } from "./lesson3";
export { Lesson4 } from "./lesson4";
export { Lesson5 } from "./lesson5";
export { Lesson6 } from "./lesson6";
export { Lesson7 } from "./lesson7";
export { Lesson8 } from "./lesson8";
export { Lesson9 } from "./lesson9";
export { Lesson10 } from "./lesson10";
export { Lesson11 } from "./lesson11";
export { Lesson12 } from "./lesson12";
export { Lesson13 } from "./lesson13";
export { Lesson14 } from "./lesson14";
export { Lesson15 } from "./lesson15";
export { Lesson16 } from "./lesson16";
export { Lesson17 } from "./lesson17";
export { Lesson18 } from "./lesson18";
export { Lesson19 } from "./lesson19";
export { Lesson20 } from "./lesson20";
export { Lesson21 } from "./lesson21";
export { Lesson22 } from "./lesson22";
export { Lesson23 } from "./lesson23";
export { Lesson24 } from "./lesson24";
export { Lesson25 } from "./lesson25";
export { Lesson26 } from "./lesson26";
export { Lesson27 } from "./lesson27";
export { Lesson28 } from "./lesson28";
export { Lesson29 } from "./lesson29";
export { Lesson30 } from "./lesson30";

// ---- Collections ----
import * as lessons from "./index"; // 👈 自分自身から re-import

export const N3Lessons = [
  lessons.Lesson1, lessons.Lesson2, lessons.Lesson3, lessons.Lesson4, lessons.Lesson5,
  lessons.Lesson6, lessons.Lesson7, lessons.Lesson8, lessons.Lesson9, lessons.Lesson10,
  lessons.Lesson11, lessons.Lesson12, lessons.Lesson13, lessons.Lesson14, lessons.Lesson15,
  lessons.Lesson16, lessons.Lesson17, lessons.Lesson18, lessons.Lesson19, lessons.Lesson20,
  lessons.Lesson21, lessons.Lesson22, lessons.Lesson23, lessons.Lesson24, lessons.Lesson25,
  lessons.Lesson26, lessons.Lesson27, lessons.Lesson28, lessons.Lesson29, lessons.Lesson30,
];

export const N3LessonMap = Object.fromEntries(
  N3Lessons.map((lesson, idx) => [idx + 1, lesson])
);

export const N3All = N3Lessons.flat();

// ---- Helpers ----
export const getN3ItemById = (id) =>
  N3All.find((q) => q.id === Number(id)) || null;

export const getN3Lesson = (lessonNumber) =>
  N3LessonMap[Number(lessonNumber)] || null;

export const getN3Range = (startId, endId) =>
  N3All.filter((q) => q.id >= Number(startId) && q.id <= Number(endId));

export const getN3Random = (n = 10) => {
  const pool = [...N3All];
  const out = [];
  while (out.length < n && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
};

export const getN3LessonRandom = (lessonNumber, n = 10) => {
  const lesson = getN3Lesson(lessonNumber);
  if (!lesson) return [];
  const pool = [...lesson];
  const out = [];
  while (out.length < n && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
};
