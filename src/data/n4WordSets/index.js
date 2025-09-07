import { n4part1 } from "./n4part1.js";
import { n4part2 } from "./n4part2.js";
import { n4part3 } from "./n4part3.js";
import { n4part4 } from "./n4part4.js";
import { n4part5 } from "./n4part5.js";
import { n4part6 } from "./n4part6.js";
import { n4part7 } from "./n4part7.js";
import { n4part8 } from "./n4part8.js";
import { n4part9 } from "./n4part9.js";
import { n4part10 } from "./n4part10.js";
import { n4part11 } from "./n4part11.js";
import { n4part12 } from "./n4part12.js";

// 元の全セット
export const n4WordSets = {
  Lesson1: n4part1.Lesson1,
  Lesson2: n4part2.Lesson2,
  Lesson3: n4part3.Lesson3,
  Lesson4: n4part4.Lesson4,
  Lesson5: n4part5.Lesson5,
  Lesson6: n4part6.Lesson6,
  Lesson7: n4part7.Lesson7,
  Lesson8: n4part8.Lesson8,
  Lesson9: n4part9.Lesson9,
  Lesson10: n4part10.Lesson10,
  Lesson11: n4part11.Lesson11,
  Lesson12: n4part12.Lesson12,
};

// ---- Helpers ----
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 各レッスンからランダムに n 問（デフォルト10問）
export const getN4LessonRandom = (lessonNumber, n = 10) => {
  const lessonKey = `Lesson${lessonNumber}`;
  const lesson = n4WordSets[lessonKey];
  if (!lesson) return [];
  return shuffle(lesson).slice(0, n);
};
