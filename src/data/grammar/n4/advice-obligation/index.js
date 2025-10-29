import { N4_ADVICE_OBLIGATION_Lesson1 } from "./n4_advice_obligation_lesson1";

// レッスンキーを "LessonX" 形式に正規化
function normalizeLessonKey(raw) {
  if (!raw) return "Lesson1";
  const m = String(raw).match(/(\d+)/);
  const no = m ? Math.max(1, parseInt(m[1], 10)) : 1;
  return `Lesson${no}`;
}

const LESSONS = new Map([
  ["Lesson1", N4_ADVICE_OBLIGATION_Lesson1],
  // 追加する場合は ["Lesson2", N4_ADVICE_OBLIGATION_Lesson2] のように登録
]);

/** N4: 助言・義務・不要 クイズデータ取得 */
export function getN4AdviceObligationLesson(lessonKey) {
  const key = normalizeLessonKey(lessonKey);
  return LESSONS.get(key) || [];
}
