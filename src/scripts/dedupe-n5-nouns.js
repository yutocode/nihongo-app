// src/scripts/dedupe-n5-nouns.js
// 使い方: node src/scripts/dedupe-n5-nouns.js
// 入力: src/data/n5WordSets/n5part_nouns1.js ... n5part_nouns6.js
// 出力: 
//   - src/data-tools/n5_nouns_duplicates_report.txt（重複レポート）
//   - src/data-dedup/n5WordSets/n5part_nouns1.js ...（重複なしで再構成）
// 仕様:
//   - 同一 kanji は最初の出現を採用。以降は除外。
//   - 50件ごとにファイルを切って id を 1..50 に振り直し、LessonX キー名も合わせます。

import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src", "data", "n5WordSets");
const OUT_DIR = path.join(ROOT, "src", "data-dedup", "n5WordSets");
const TOOLS_DIR = path.join(ROOT, "src", "data-tools");
await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(TOOLS_DIR, { recursive: true });

const FILE_PREFIX = "n5part_nouns";
const FILES = (await fs.readdir(SRC_DIR))
  .filter(f => f.startsWith(FILE_PREFIX) && f.endsWith(".js"))
  .sort();

// "kanji": "…" / '…' / “…” / `…` まで対応、キー名も kanji/kannji の揺れ対応
const entryRegex = /\{\s*id\s*:\s*([0-9]+)\s*,\s*(kanji|kannji)\s*:\s*["'“”`]\s*([^"'“”`]+?)\s*["'“”`]\s*,\s*reading\s*:\s*["'“”`][^"'“”`]*["'“”`]\s*,\s*meanings\s*:\s*\{[^}]*\}\s*\}/g;

// 1) すべてのエントリを読み込み（元の順序を保つ）
const allEntries = [];
const dupReport = [];
for (const fname of FILES) {
  const full = path.join(SRC_DIR, fname);
  const text = await fs.readFile(full, "utf8");
  let m;
  let idx = 0;
  while ((m = entryRegex.exec(text)) !== null) {
    idx += 1;
    const idRaw = Number(m[1]);
    const kanji = m[3].trim();
    // 「エントリ全体のテキスト」を残しておく（再出力に使用）
    const entryText = m[0];
    allEntries.push({
      srcFile: fname,
      srcIndex: idx,
      idRaw,
      kanji,
      entryText,
    });
  }
}

// 2) 重複排除（最初の出現のみ採用）
const seen = new Map(); // kanji -> {srcFile, srcIndex}
const uniqueEntries = [];
for (const e of allEntries) {
  if (!seen.has(e.kanji)) {
    seen.set(e.kanji, { srcFile: e.srcFile, srcIndex: e.srcIndex });
    uniqueEntries.push(e);
  } else {
    const first = seen.get(e.kanji);
    dupReport.push(
      `${e.kanji}\t2回目以降: ${e.srcFile}#${e.srcIndex}（初出: ${first.srcFile}#${first.srcIndex}）`
    );
  }
}

// 3) レポート出力
const reportPath = path.join(TOOLS_DIR, "n5_nouns_duplicates_report.txt");
const summary =
  `総エントリ数(重複込み): ${allEntries.length}\n` +
  `ユニーク数: ${uniqueEntries.length}\n` +
  `重複数: ${dupReport.length}\n` +
  `対象ファイル: ${FILES.join(", ")}\n\n` +
  `--- 重複詳細（後発のみ列挙） ---\n` +
  (dupReport.length ? dupReport.join("\n") : "重複なし");
await fs.writeFile(reportPath, summary, "utf8");

// 4) 50件ごとに分割して、新しい n5part_nounsX.js を再生成
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
const chunks = chunk(uniqueEntries, 50);

// 生成テンプレ（フォーマットはあなたの元ファイルに合わせてます）
function buildFileContent(partIndex, entries) {
  const lessonName = `Lesson${partIndex}`;
  const constName = `${FILE_PREFIX}${partIndex}`.replace(/-/g, "_");
  const lines = [];
  lines.push(`export const ${constName} = {`);
  lines.push(`  ${lessonName}: [`);
  entries.forEach((e, i) => {
    // id は 1..50 に振り直し（内容は元 entryText の id を上書き）
    const newId = i + 1;
    // entryText から id のみ置換（他はそのまま保持）
    const updated = e.entryText.replace(/id\s*:\s*[0-9]+/, `id: ${newId}`);
    lines.push(`    ${updated},`);
  });
  lines.push(`  ],`);
  lines.push(`};\n`);
  return lines.join("\n");
}

for (let i = 0; i < chunks.length; i++) {
  const partNum = i + 1;
  const outPath = path.join(OUT_DIR, `${FILE_PREFIX}${partNum}.js`);
  const content = buildFileContent(partNum, chunks[i]);
  await fs.writeFile(outPath, content, "utf8");
}

// 5) インデックスも（必要なら）
const indexPath = path.join(OUT_DIR, `index.js`);
const indexLines = [
  ...chunks.map((_, i) => `import { ${FILE_PREFIX}${i + 1} } from "./${FILE_PREFIX}${i + 1}.js";`),
  "",
  "export const n5NounsWordSets = {",
  ...chunks.map((_, i) => `  Lesson${i + 1}: ${FILE_PREFIX}${i + 1}.Lesson${i + 1},`),
  "};",
  "",
];
await fs.writeFile(indexPath, indexLines.join("\n"), "utf8");

// 6) コンソールに結果表示
console.log("✅ 完了");
console.log("- 重複込み:", allEntries.length);
console.log("- ユニーク:", uniqueEntries.length);
console.log("- 新規出力先:", path.relative(ROOT, OUT_DIR));
console.log("- 重複レポート:", path.relative(ROOT, reportPath));
