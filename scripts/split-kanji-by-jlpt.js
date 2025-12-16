import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src/data/kanji/kanji.json");
const OUT_DIR = path.join(ROOT, "src/data/kanji");

const kanji = JSON.parse(fs.readFileSync(SRC, "utf-8"));

const buckets = {
  N5: {},
  N4: {},
  N3: {},
  N2: {},
  N1: {},
  EXTRA: {},
};

for (const [char, data] of Object.entries(kanji)) {
  const jlpt = data.jlpt;

  if (jlpt === "N5") buckets.N5[char] = data;
  else if (jlpt === "N4") buckets.N4[char] = data;
  else if (jlpt === "N3") buckets.N3[char] = data;
  else if (jlpt === "N2") buckets.N2[char] = data;
  else if (jlpt === "N1") buckets.N1[char] = data;
  else buckets.EXTRA[char] = data;
}

const write = (name, obj) => {
  fs.writeFileSync(
    path.join(OUT_DIR, name),
    JSON.stringify(obj, null, 2),
    "utf-8"
  );
  console.log(`✅ ${name}: ${Object.keys(obj).length} 字`);
};

write("n5.json", buckets.N5);
write("n4.json", buckets.N4);
write("n3.json", buckets.N3);
write("n2.json", buckets.N2);
write("n1.json", buckets.N1);
write("extra.json", buckets.EXTRA);