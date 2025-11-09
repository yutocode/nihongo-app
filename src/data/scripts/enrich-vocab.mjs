import fs from "node:fs";
import { XMLParser } from "fast-xml-parser";
import * as wk from "wanakana";

function readLines(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
}

function buildKanjidic() {
  const cache = "data/cache/kanjidic2.json";
  if (fs.existsSync(cache)) return JSON.parse(fs.readFileSync(cache, "utf8"));
  const src = "data/raw/kanjidic2.xml";
  if (!fs.existsSync(src)) {
    console.error("❌ data/raw/kanjidic2.xml がありません（EDRDGのKANJIDIC2を配置してください）");
    process.exit(1);
  }
  const xml = fs.readFileSync(src, "utf8");
  const jp = new XMLParser({ ignoreAttributes: false }).parse(xml);
  const out = {};
  for (const ch of jp.kanjidic2.character) {
    const literal = ch.literal;
    const r = ch.reading_meaning?.rmgroup || {};
    const readings = Array.isArray(r.reading) ? r.reading : (r.reading ? [r.reading] : []);
    const on = readings.filter(x => x["@_r_type"] === "ja_on").map(x => x["#text"]);
    const kun = readings.filter(x => x["@_r_type"] === "ja_kun").map(x => x["#text"]);
    out[literal] = {
      on, kun,
      strokes: Number(ch.misc?.stroke_count?.[0] ?? ch.misc?.stroke_count ?? 0),
      grade: Number(ch.misc?.grade ?? 0),
      jlpt: Number(ch.misc?.jlpt ?? 0),
      radical: ch.radical?.[0]?.value ?? ch.radical?.value ?? null,
    };
  }
  fs.mkdirSync("data/cache", { recursive: true });
  fs.writeFileSync(cache, JSON.stringify(out));
  return out;
}

/** まずは“ひと塊ルビ”。後で分割に強化可 */
function makeFurigana(kanji, readingKana) {
  const kana = wk.toHiragana(readingKana || "");
  if (wk.isKana(kanji)) return [{ rb: kanji, rt: kanji }];
  return [{ rb: kanji, rt: kana }];
}
const chars = (s) => Array.from(s || "");

function main() {
  const master = readLines("data/raw/master.jsonl");
  if (!master.length) {
    console.error("❌ data/raw/master.jsonl がありません。先に `npm run vocab:collect` を実行してください。");
    process.exit(1);
  }
  const K = buildKanjidic();

  const enriched = master.map(r => {
    const ks = chars(r.kanji).filter(wk.isKanji);
    const kanjiInfo = ks.map(c => ({ char: c, ...(K[c] || { on:[], kun:[], strokes:0, grade:0, jlpt:0, radical:null }) }));
    const furigana = makeFurigana(r.kanji, r.reading);
    return { ...r, furigana, kanjiInfo };
  });

  fs.writeFileSync("data/cache/enriched.jsonl", enriched.map(x=>JSON.stringify(x)).join("\n"));
  console.log(`✅ enriched ${enriched.length} → data/cache/enriched.jsonl`);
}

main();
