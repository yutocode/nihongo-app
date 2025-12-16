/**
 * N3 漢字 JSON に Tanaka Corpus の日本語例文を最大4つ付与する
 *
 * 条件:
 * - 日本語文のみ使用（タブ前）
 * - 同一文は重複排除
 * - 最大4文
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

// ===== 処理 =====
let attachedCount = 0;

for (const kanji of Object.keys(kanjiData)) {
  const found = new Set();

  for (const line of corpusLines) {
    // 日本語文だけ（タブ前）
    const ja = line.split("\t")[0];
    if (!ja.includes(kanji)) continue;

    found.add(ja);
    if (found.size >= 4) break;
  }

  kanjiData[kanji].examples = Array.from(found);
  if (found.size > 0) attachedCount++;
}

// ===== 出力 =====
fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(kanjiData, null, 2),
  "utf-8"
);

console.log(`✅ N3 例文付与完了: ${attachedCount} 漢字`);
console.log(`📄 出力: ${OUTPUT_PATH}`);