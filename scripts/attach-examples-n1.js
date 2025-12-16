/**
 * N1 漢字 JSON に Tanaka Corpus の A 例文を最大4つ付与
 * - A行のみ
 * - 重複排除
 * - 最大4文
 */

import fs from "fs";

// ===== PATH =====
const KANJI_PATH = "src/data/kanji/n1.json";
const CORPUS_PATH = "corpus/tanaka.txt";
const OUTPUT_PATH = "src/data/kanji/n1_with_examples.json";

// ===== LOAD =====
const kanjiData = JSON.parse(fs.readFileSync(KANJI_PATH, "utf-8"));
const corpusLines = fs
  .readFileSync(CORPUS_PATH, "utf-8")
  .split("\n")
  .map(l => l.trim())
  .filter(Boolean);

// ===== PROCESS =====
let attached = 0;

for (const kanji of Object.keys(kanjiData)) {
  const examples = [];

  for (const line of corpusLines) {
    if (!line.startsWith("A:")) continue;
    if (!line.includes(kanji)) continue;

    const sentence = line.replace(/^A:\s*/, "");
    if (!examples.includes(sentence)) {
      examples.push(sentence);
    }
    if (examples.length >= 4) break;
  }

  kanjiData[kanji].examples = examples;
  if (examples.length > 0) attached++;
}

// ===== OUTPUT =====
fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(kanjiData, null, 2),
  "utf-8"
);

console.log(`✅ N1 例文付与完了: ${attached} 漢字`);
console.log(`📄 出力: ${OUTPUT_PATH}`);