// src/data/grammar/n5/exist-have/index.js
import { n5ExistHaveLesson1 } from "./lesson1";
import { n5ExistHaveLesson2 } from "./lesson2";
import { n5ExistHaveLesson3 } from "./lesson3";
import { n5ExistHaveLesson4 } from "./lesson4";
import { n5ExistHaveLesson5 } from "./lesson5";
import { n5ExistHaveLesson6 } from "./lesson6";

export const N5_EXIST_HAVE_LESSONS = {
  lesson1: n5ExistHaveLesson1,
  lesson2: n5ExistHaveLesson2,
  lesson3: n5ExistHaveLesson3,
  lesson4: n5ExistHaveLesson4,
  lesson5: n5ExistHaveLesson5,
  lesson6: n5ExistHaveLesson6,
};

// ユーティリティ：配列シャッフル（非破壊）
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * N5 存在・所有（ある／いる／持つ）のレッスンを取得
 * @param {("lesson1"|"lesson2"|"lesson3"|"lesson4"|"lesson5"|"lesson6")} lesson
 * @param {{ shuffleQuestions?: boolean, shuffleChoices?: boolean }} options
 *  - shuffleQuestions: 問題の並びを毎回シャッフル（デフォルト true）
 *  - shuffleChoices: 各問題の選択肢を毎回シャッフル（デフォルト true）
 * @returns {Array<{id:number,question:string,yomi:string,choices:string[],answer:string}>}
 */
export function getN5ExistHaveLesson(
  lesson = "lesson1",
  { shuffleQuestions = true, shuffleChoices = true } = {}
) {
  const src = N5_EXIST_HAVE_LESSONS[lesson] || N5_EXIST_HAVE_LESSONS.lesson1;

  // 問題の順序をシャッフル（任意）
  const questions = shuffleQuestions ? shuffle(src) : src.slice();

  // 選択肢も毎回シャッフル（任意）— answer は文字一致判定想定
  const withChoices = shuffleChoices
    ? questions.map((q) => ({
        ...q,
        choices: shuffle(q.choices),
      }))
    : questions;

  // id を 1..N に振り直して返す（画面側キー安定化）
  return withChoices.map((q, idx) => ({ ...q, id: idx + 1 }));
}

// レッスン一覧を UI で使いたい時用
export const N5_EXIST_HAVE_LESSON_IDS = Object.keys(N5_EXIST_HAVE_LESSONS);
// => ["lesson1","lesson2","lesson3","lesson4","lesson5","lesson6"]
