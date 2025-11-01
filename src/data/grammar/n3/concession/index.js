// src/data/grammar/n3/concession/index.js
// N3：逆接（が／けれども／のに／しかし／だが／わりに／くせに）lesson1〜lesson10 のインデックス
// Vite 環境前提（import.meta.glob）。自動で lesson1〜lesson10 を読み込み・登録します。

// -------- 自動インポート（eager = 同期読み込み）--------
const modules = import.meta.glob("./lesson*.js", { eager: true });

// 例: "./lesson1.js" -> "lesson1"
function toKey(path) {
  const m = path.match(/\.\/(lesson\d+)\.js$/);
  return m ? m[1].toLowerCase() : null;
}

// デフォルトエクスポートがないので、各モジュール内の named export を拾う。
// 期待するエクスポート名: N3_CONCESSION_LessonX
function pickArrayExport(mod) {
  // 最初に見つかった配列エクスポートを返す（各 lesson ファイルは1つの配列をエクスポート）
  for (const k of Object.keys(mod)) {
    if (Array.isArray(mod[k])) return mod[k];
  }
  return null;
}

// Map("lesson1" -> [...], "lesson2" -> [...], ...)
const N3_CONCESSION_LESSONS = new Map();
Object.entries(modules).forEach(([path, mod]) => {
  const key = toKey(path);
  const arr = pickArrayExport(mod);
  if (key && arr) N3_CONCESSION_LESSONS.set(key, arr);
});

// lesson1〜lesson10 のキーをソートして提供
export const N3_CONCESSION_LESSON_KEYS = Array.from(N3_CONCESSION_LESSONS.keys()).sort(
  (a, b) => Number(a.replace("lesson", "")) - Number(b.replace("lesson", ""))
);

// レッスン配列を取得（存在しなければ lesson1 を返す）
export function getN3ConcessionLesson(lessonKey = "lesson1") {
  const key = String(lessonKey).toLowerCase();
  return N3_CONCESSION_LESSONS.get(key) ?? N3_CONCESSION_LESSONS.get("lesson1") ?? [];
}

// すべての問題をフラット化（どのレッスンから来たかを付与）
export const N3_CONCESSION_ALL = N3_CONCESSION_LESSON_KEYS.flatMap((k) =>
  (N3_CONCESSION_LESSONS.get(k) || []).map((q) => ({ ...q, _lesson: k }))
);

// レッスン総数
export const N3_CONCESSION_COUNT = N3_CONCESSION_LESSON_KEYS.length;

// （任意）次/前レッスンのキーを取得するユーティリティ
export function nextLessonKey(current = "lesson1") {
  const i = N3_CONCESSION_LESSON_KEYS.indexOf(String(current).toLowerCase());
  if (i < 0) return "lesson1";
  return N3_CONCESSION_LESSON_KEYS[Math.min(i + 1, N3_CONCESSION_LESSON_KEYS.length - 1)];
}
export function prevLessonKey(current = "lesson1") {
  const i = N3_CONCESSION_LESSON_KEYS.indexOf(String(current).toLowerCase());
  if (i < 0) return "lesson1";
  return N3_CONCESSION_LESSON_KEYS[Math.max(i - 1, 0)];
}

export default N3_CONCESSION_LESSONS;
