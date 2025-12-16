// scripts/strip-svg-from-kanji-json.js
import fs from "fs";
import path from "path";

const filePath = path.resolve("src/data/kanji/kanji.json");

const raw = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(raw);

for (const key of Object.keys(data)) {
  delete data[key].svgFile;
  delete data[key].svgPath;
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

console.log("✅ svgFile / svgPath を削除しました");