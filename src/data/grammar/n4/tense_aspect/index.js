// src/data/grammar/n4/tense_aspect/index.js

/**
 * N4: Tense & Aspect lessons loader
 * - Vite の import.meta.glob を使って ./lesson*.js を自動収集
 * - 各 lesson ファイルは default export（配列）推奨。空でもOK。
 * - 例: lesson1.js → export default [ { ... }, ... ]
 */

const modules = import.meta.glob("./lesson*.js", { eager: true });

/** @type {Record<string, any[]>} */
const map = {};

// 例: "./lesson1.js" → Lesson1
for (const [path, mod] of Object.entries(modules)) {
  const m = path.match(/lesson(\d+)\.js$/i);
  if (!m) continue;
  const num = Number(m[1]);
  const key = `Lesson${num}`;
  const data = (mod && mod.default) || []; // 中身が空でも安全に
  map[key] = Array.isArray(data) ? data : [];
}

// レッスン番号順で並び替え（見栄え用）
const sortedEntries = Object.entries(map).sort((a, b) => {
  const na = Number(a[0].replace("Lesson", ""));
  const nb = Number(b[0].replace("Lesson", ""));
  return na - nb;
});

export const n4TenseAspectLessons = Object.fromEntries(sortedEntries);

// デフォルトエクスポートも用意（既存コード互換）
export default n4TenseAspectLessons;
