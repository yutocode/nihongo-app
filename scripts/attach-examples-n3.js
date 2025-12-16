/**
 * N3 漢字 JSON に Tanaka Corpus の A 例文を最大4つ付与する
 * - A文のみ使用
 * - 重複排除
 * - 最大4文
 * - 足りない分は自動生成で補完
 */

import fs from "fs";

// ===== パス設定 =====
const KANJI_PATH = "src/data/kanji/n3.json";
const CORPUS_PATH = "corpus/tanaka.txt";
const OUTPUT_PATH = "src/data/kanji/n3_with_examples.json";

// ===== 読み込み =====
const kanjiData = JSON.parse(fs.readFileSync(KANJI_PATH, "utf-8"));
const corpusLines = fs
  .readFileSync(CORPUS_PATH, "utf-8")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

// ===== 自動生成テンプレ =====
function generateFallbackExamples(kanji, count) {
  const templates = [
    `${kanji}な考え方は大切だ。`,
    `${kanji}安を感じる人も多い。`,
    `${kanji}可能な方法を探している。`,
    `${kanji}な状況が続いている。`,
    `${kanji}満な結果に終わった。`,
  ];

  return templates.slice(0, count);
}

// ===== 処理 =====
let attachedCount = 0;

for (const kanji of Object.keys(kanjiData)) {
  const found = [];

  for (const line of corpusLines) {
    // A文のみ
    if (!line.startsWith("A:")) continue;
    if (!line.includes(kanji)) continue;

    const sentence = line.replace(/^A:\s*/, "").trim();

    if (!found.includes(sentence)) {
      found.push(sentence);
    }

    if (found.length >= 4) break;
  }

  // 足りない分を自動生成で補完
  if (found.length < 4) {
    const need = 4 - found.length;
    const generated = generateFallbackExamples(kanji, need);

    for (const g of generated) {
      if (!found.includes(g)) {
        found.push(g);
      }
      if (found.length >= 4) break;
    }
  }

  kanjiData[kanji].examples = found;
  if (found.length > 0) attachedCount++;
}

// ===== 出力 =====
fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(kanjiData, null, 2),
  "utf-8"
);

console.log(`✅ N3 例文付与完了: ${attachedCount} 漢字`);
console.log(`📄 出力: ${OUTPUT_PATH}`);