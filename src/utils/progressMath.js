// src/utils/posById.js
// ------------------------------------------
// 各レベルごとの id → 品詞範囲をマップ
// ------------------------------------------
const POS_RANGE_BY_LEVEL = {
  n5: [
    { pos: "名詞",     from: 1,   to: 372 },
    { pos: "い形容詞", from: 373, to: 427 },
    { pos: "な形容詞", from: 428, to: 445 },
    { pos: "副詞",     from: 446, to: 457 },
    { pos: "動詞",     from: 458, to: 558 },
    { pos: "その他",   from: 559, to: 718 },
  ],
  n4: [
    { pos: "名詞",     from: 1,   to: 317 },
    { pos: "い形容詞", from: 318, to: 334 },
    { pos: "な形容詞", from: 335, to: 357 },
    { pos: "副詞",     from: 358, to: 377 },
    { pos: "動詞",     from: 378, to: 522 },
    { pos: "その他",   from: 523, to: 668 },
  ],
  n3: [
    { pos: "名詞",     from: 1,    to: 1417 },
    { pos: "い形容詞", from: 1418, to: 1440 },
    { pos: "な形容詞", from: 1441, to: 1583 }, // ← 1584〜1615が副詞なので一つ前で区切る
    { pos: "副詞",     from: 1584, to: 1615 },
    { pos: "動詞",     from: 1616, to: 2006 },
    { pos: "その他",   from: 2007, to: 2139 },
  ],
  n2: [
    { pos: "名詞",     from: 1,    to: 1034 },
    { pos: "い形容詞", from: 1035, to: 1074 },
    { pos: "な形容詞", from: 1075, to: 1145 },
    { pos: "副詞",     from: 1146, to: 1209 },
    { pos: "動詞",     from: 1210, to: 1433 },
    { pos: "その他",   from: 1434, to: 1748 },
  ],
  n1: [
    { pos: "名詞",     from: 1,    to: 1813 },
    { pos: "い形容詞", from: 1814, to: 1859 },
    { pos: "な形容詞", from: 1860, to: 2048 },
    { pos: "副詞",     from: 2049, to: 2118 },
    { pos: "動詞",     from: 2119, to: 2487 },
    { pos: "その他",   from: 2488, to: 2699 },
  ],
};

// ------------------------------------------
// 指定された level と id から品詞を返す
// ------------------------------------------
export function getPosById(level, id, fallback = "—") {
  const key = String(level).toLowerCase();
  const ranges = POS_RANGE_BY_LEVEL[key];
  const num = Number(id);
  if (!ranges || !Number.isFinite(num)) return fallback;

  for (const r of ranges) {
    if (num >= r.from && num <= r.to) return r.pos;
  }
  return fallback;
}

// ------------------------------------------
// 品詞の順番を返す（ソートや表示用）
// ------------------------------------------
export function getPosOrder(level) {
  const key = String(level).toLowerCase();
  const ranges = POS_RANGE_BY_LEVEL[key];
  if (!ranges) return ["名詞","い形容詞","な形容詞","副詞","動詞","その他"];
  return ranges.map(r => r.pos);
}
