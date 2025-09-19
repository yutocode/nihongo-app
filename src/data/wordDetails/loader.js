// src/data/wordDetails/loader.js
const files = import.meta.glob("/src/data/wordDetails/*/*/*/*.json", { eager: false });

const toKey = (level, category, lesson, id) =>
  `/src/data/wordDetails/${String(level)}/${String(category)}/${String(lesson)}/${String(id)}.json`;

export async function loadDetail(level, category, lesson, id, fallbackWord) {
  const key = toKey(level, category, lesson, id);
  if (files[key]) {
    try {
      const mod = await files[key]();
      return (mod && mod.default) || mod || null;
    } catch (e) {
      console.error("[loadDetail] failed:", e);
    }
  }
  // JSONが無いときの最低限フォールバック
  if (fallbackWord) {
    return {
      kanji: fallbackWord.kanji || "",
      reading: fallbackWord.reading || "",
      pos: fallbackWord.pos || null,
      meanings: fallbackWord.meanings || {},
      examples: [],
      tags: [String(level).toUpperCase(), String(lesson)]
    };
  }
  return null;
}
