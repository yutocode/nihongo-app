// scripts/extract-n5-nouns-kanji.js
// 使い方: node scripts/extract-n5-nouns-kanji.js

import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const GLOB_DIR = path.join(ROOT, "src", "data", "n5WordSets");
const FILE_PREFIX = "n5part_nouns";
const OUT_DIR = path.join(ROOT, "src", "data-tools");

// 引用符: " ' “ ” ` に対応、キー名: kanji/kannji
const kanjiRegex = /(kanji|kannji)\s*:\s*["'“”`]\s*([^"'“”`]+?)\s*["'“”`]/g;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const all = await fs.readdir(GLOB_DIR);
  const targets = all
    .filter((f) => f.startsWith(FILE_PREFIX) && f.endsWith(".js"))
    .sort();

  if (targets.length === 0) {
    console.error("対象ファイルが見つかりませんでした:", GLOB_DIR);
    process.exit(1);
  }

  console.log("🔎 対象ファイル:", targets.join(", "));

  const rawList = [];     // 重複込み
  const perFileCounts = [];

  for (const file of targets) {
    const full = path.join(GLOB_DIR, file);
    const txt = await fs.readFile(full, "utf8");

    let m;
    let count = 0;
    while ((m = kanjiRegex.exec(txt)) !== null) {
      const k = m[2].trim();
      rawList.push(k);
      count++;
    }
    perFileCounts.push({ file, count });
  }

  // ユニーク化
  const unique = Array.from(new Set(rawList));

  // 出力
  const txtOutAll = path.join(OUT_DIR, "n5_nouns_kanji_all.txt");     // 重複込み
  const txtOutUniq = path.join(OUT_DIR, "n5_nouns_kanji.txt");        // ユニーク
  const jsonOutUniq = path.join(OUT_DIR, "n5_nouns_kanji.json");

  await fs.writeFile(txtOutAll, rawList.join("\n"), "utf8");
  await fs.writeFile(txtOutUniq, unique.join("\n"), "utf8");
  await fs.writeFile(jsonOutUniq, JSON.stringify(unique, null, 2), "utf8");

  // レポート
  console.log("\n📄 ファイル別ヒット数");
  for (const { file, count } of perFileCounts) {
    console.log(`- ${file}: ${count}`);
  }
  console.log("\n📊 合計");
  console.log(`- 重複込み: ${rawList.length}`);
  console.log(`- ユニーク: ${unique.length}`);

  console.log("\n📝 出力");
  console.log("-", path.relative(ROOT, txtOutAll), "(重複込み)");
  console.log("-", path.relative(ROOT, txtOutUniq), "(ユニーク)");
  console.log("-", path.relative(ROOT, jsonOutUniq));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
