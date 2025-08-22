// src/utils/rubyMap.js
const KANJI_RX = /[\u4E00-\u9FFF]/;
export const isKanji = (ch) => KANJI_RX.test(ch);

/** base:"飲む", yomi:"のむ" -> {0:"の"}（0は「飲」の位置） */
export function buildKanjiReadingMap(base, yomi) {
  const map = {};
  if (!base || !yomi) return map;
  const B = Array.from(base);
  const Y = Array.from(yomi);
  let k = 0;
  for (let i = 0; i < B.length; i++) {
    const ch = B[i];
    if (!isKanji(ch)) {
      if (k < Y.length && Y[k] === ch) k++;
      continue;
    }
    // 次の「base側のかな」出現までをこの漢字の読みとみなす
    let nextKana = null;
    for (let j = i + 1; j < B.length; j++) {
      if (!isKanji(B[j])) { nextKana = B[j]; break; }
    }
    let start = k, p = k;
    if (nextKana) { while (p < Y.length && Y[p] !== nextKana) p++; }
    else { p = Y.length; }
    map[i] = Y.slice(start, p).join("") || Y[k] || "";
    k = Math.min(p + (nextKana ? 1 : 0), Y.length);
  }
  return map;
}

/** "飲んで" + {0:"の"} -> [{t:"飲",r:"の"},{t:"んで"}] */
export function makeKanjiOnlySegments(text, kanjiMap) {
  const segs = [];
  if (!text) return segs;
  const C = Array.from(text);
  for (let i = 0; i < C.length; i++) {
    const ch = C[i];
    if (isKanji(ch) && kanjiMap[i] && kanjiMap[i].length > 0) {
      segs.push({ t: ch, r: kanjiMap[i] });
    } else {
      if (segs.length && !segs[segs.length - 1].r) segs[segs.length - 1].t += ch;
      else segs.push({ t: ch });
    }
  }
  return segs;
}
