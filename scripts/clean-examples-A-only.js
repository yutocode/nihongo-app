import fs from "fs";

const INPUT = "src/data/kanji/n3_with_examples.json";
const OUTPUT = "src/data/kanji/n3_cleaned.json";

const data = JSON.parse(fs.readFileSync(INPUT, "utf-8"));

let changed = 0;

for (const key in data) {
  const ex = data[key].examples;
  if (!Array.isArray(ex)) continue;

  const onlyA = ex
    .map((line) => line.trim())          // ← 超重要
    .filter((line) => line.startsWith("A:"))
    .map((line) => line.replace(/^A:\s*/, ""));

  if (onlyA.length > 0) {
    data[key].examples = onlyA;
    changed++;
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), "utf-8");

console.log(`✅ examples を A のみに整理: ${changed} 漢字`);
console.log(`📄 出力: ${OUTPUT}`);