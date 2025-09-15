// すべての詳細JSONをパターンで束ねる（必要な時だけ読み込む）
const modules = import.meta.glob("/src/data/wordDetails/**/**/*.json");

export async function loadDetail(level, category, lesson, id) {
  const key = `/src/data/wordDetails/${String(level)}/${String(category)}/${String(lesson)}/${String(id)}.json`;
  const loader = modules[key];
  if (!loader) return null;                 // まだ作ってなければ null
  const mod = await loader();               // 動的 import
  return mod.default || mod;                // JSON は default に入る
}
