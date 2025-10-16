// src/utils/grouping.js
import { getPosById, getPosOrder } from "./posById";

/* -------------------------------------------
 * チャンク分割: 既定50語、最後が少なすぎる時は直前から融通（最小20語を保証）
 * ------------------------------------------- */
export function chunkWithMin(arr, preferred = 50, min = 20) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const out = [];
  let buf = [];
  for (const x of arr) {
    buf.push(x);
    if (buf.length === preferred) {
      out.push(buf);
      buf = [];
    }
  }
  if (buf.length) {
    if (buf.length < min && out.length > 0) {
      const prev = out[out.length - 1];
      const canGive = Math.max(0, prev.length - min);
      const need = min - buf.length;
      const give = Math.min(canGive, need);
      if (give > 0) {
        const moved = prev.splice(prev.length - give, give);
        buf = moved.concat(buf);
      }
    }
    out.push(buf);
  }
  return out;
}

/* -------------------------------------------
 * 正規化ヘルパ
 * ------------------------------------------- */
const normSortById = (words) =>
  (words || [])
    .map((w) => ({ ...w, id: Number(w.id) }))
    .filter((w) => Number.isFinite(w.id))
    .sort((a, b) => a.id - b.id);

/* -------------------------------------------
 * インデックス形式（Lesson1: [...]）→ フラット配列
 * level を渡せば _pos/_rating を付与
 * ------------------------------------------- */
export function flattenWordsFromIndex(wordSetsObj, level) {
  const flat = [];
  if (!wordSetsObj) return flat;

  for (const mod of Object.values(wordSetsObj)) {
    for (const [k, list] of Object.entries(mod)) {
      if (!/^Lesson\d+$/i.test(k) || !Array.isArray(list)) continue;
      for (const w of list) {
        if (!w || typeof w !== "object") continue;
        const id = Number(w.id);
        const pos = getPosById(level, id, w.pos || w.partOfSpeech || ""); // ★ id優先
        const rating = Number(w.freq ?? w.rating ?? 0) || 0;               // 0〜5想定
        flat.push({ ...w, id, _lessonKey: k, _pos: pos, _rating: rating });
      }
    }
  }
  return flat;
}

/* -------------------------------------------
 * 1) 番号順（id昇順で50語ずつ）
 * ------------------------------------------- */
export function buildBlocksByNumber(words, blockSize = 50) {
  const all = normSortById(words);
  const chunks = chunkWithMin(all, blockSize, 20);
  return chunks.map((arr, i) => {
    const from = arr[0]?.id ?? "";
    const to = arr[arr.length - 1]?.id ?? "";
    return {
      key: `num:${from}-${to}:${i}`,
      label: `${from}–${to}`,
      count: arr.length,
      ids: arr.map((w) => w.id),
    };
  });
}

/* -------------------------------------------
 * 2) 品詞で分ける（レベル別の表示順に従い、各品詞を50語ずつ）
 * ------------------------------------------- */
export function buildBlocksByPOS(words, level, blockSize = 50) {
  const all = normSortById(words);
  const order = getPosOrder(level); // 例: ["名詞","い形容詞","な形容詞","副詞","動詞","その他"]

  // idレンジで厳密にバケツ分け（_posが無くてもOK）
  const buckets = new Map(order.map((p) => [p, []]));
  for (const w of all) {
    const p = getPosById(level, w.id, w._pos || w.pos || "その他");
    if (!buckets.has(p)) buckets.set(p, []); // 念のため未知品詞にも対応
    buckets.get(p).push(w);
  }

  const blocks = [];
  for (const pos of order) {
    const list = (buckets.get(pos) || []).sort((a, b) => a.id - b.id);
    if (!list.length) continue;

    const chunks = chunkWithMin(list, blockSize, 20);
    chunks.forEach((ck, idx) => {
      const from = ck[0]?.id ?? "";
      const to = ck[ck.length - 1]?.id ?? "";
      blocks.push({
        key: `pos:${pos}:${from}-${to}:${idx}`,
        label: `${pos}${ck.length}問`, // 例: 名詞50問 / 名詞22問
        count: ck.length,
        ids: ck.map((w) => w.id),
      });
    });
  }
  return blocks;
}

/* -------------------------------------------
 * 3) よく出る順（rating/freq 降順で50語ずつ）
 *    ラベルはブロック内の平均★を四捨五入
 * ------------------------------------------- */
export const stars = (n) => {
  const s = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return "★★★★★☆☆☆☆☆".slice(5 - s, 10 - s);
};

export function buildBlocksByFreq(words, blockSize = 50) {
  const all = normSortById(words).sort(
    (a, b) => (b._rating || b.rating || b.freq || 0) - (a._rating || a.rating || a.freq || 0)
  );
  if (!all.length) return [];

  const chunks = chunkWithMin(all, blockSize, 20);
  return chunks.map((ck, idx) => {
    const avg =
      ck.reduce((sum, w) => sum + (Number(w._rating ?? w.rating ?? w.freq) || 0), 0) /
      (ck.length || 1);
    const labelStars = stars(avg);
    return {
      key: `freq:${idx}`,
      label: `${labelStars} ${ck.length}問`,
      count: ck.length,
      ids: ck.map((w) => w.id),
    };
  });
}
