//src/data/grammar/n5/verb-forms/index.js
import { lesson1 } from "./lesson1.js";
import { lesson2 } from "./lesson2.js";
import { lesson3 } from "./lesson3.js";

export { lesson1, lesson2, lesson3 };

export const N5_VERB_LESSONS = new Map([
  ["n5-verb-forms-lesson1", lesson1],
  ["n5-verb-forms-lesson2", lesson2],
  ["n5-verb-forms-lesson3", lesson3],
  // 予備キー（任意）
  ["n5-lesson1", lesson1],
  ["n5-lesson2", lesson2],
  ["n5-lesson3", lesson3],
]);
