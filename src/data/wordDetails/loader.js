// src/data/wordDetails/loader.js
export async function loadDetail({ id, level }) {
  return {
    id,
    level: level ?? "n5",
    pos: "noun",
    meaning: "（ダミー）意味は未設定です",
    examples: [
      { ja: "ダミーの例文です。", en: "This is a dummy example." }
    ],
    notes: "ここに語源や派生語などのメモを追加できます。"
  };
}
