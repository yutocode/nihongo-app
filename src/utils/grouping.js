// src/utils/grouping.js
import { getPosById, getPosOrder } from "./posById";

/* -------------------------------------------
 * 小ユーティリティ
 * ------------------------------------------- */
const toInt = (v) => (Number.isFinite(Number(v)) ? Number(v) : NaN);
const uniq = (arr) => Array.from(new Set(arr));

/** id 昇順・数値化してソート（不正 id は除外） */
const normSortById = (words = []) =>
  words
    .map((w) => ({ ...w, id: toInt(w?.id) }))
    .filter((w) => Number.isFinite(w.id))
    .sort((a, b) => a.id - b.id);

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
 * インデックス形式（{ Lesson1:[...], ... }）→ フラット配列
 * - level を渡すと _pos / _rating を付与
 * ------------------------------------------- */
export function flattenWordsFromIndex(wordSetsObj, level) {
  const flat = [];
  if (!wordSetsObj) return flat;

  for (const mod of Object.values(wordSetsObj)) {
    if (!mod || typeof mod !== "object") continue;
    for (const [k, list] of Object.entries(mod)) {
      if (!/^Lesson\d+$/i.test(k) || !Array.isArray(list)) continue;
      for (const w of list) {
        if (!w || typeof w !== "object") continue;
        const id = toInt(w.id);
        const pos = Number.isFinite(id)
          ? getPosById(
              String(level).toLowerCase(),
              id,
              w.pos || w.partOfSpeech || ""
            )
          : w.pos || w.partOfSpeech || "その他";
        const rating = toInt(w.freq ?? w.rating);
        flat.push({
          ...w,
          id,
          _lessonKey: k,
          _pos: pos,
          _rating: Number.isFinite(rating) ? rating : 0,
        });
      }
    }
  }
  return flat;
}

/* -------------------------------------------
 * 1) 番号レンジ（例: 1–50, 51–100, ...）
 * 返却: [{ key:"num:1-50", label:"1–50", count, ids }]
 * ------------------------------------------- */
export function buildBlocksByNumber(words, blockSize = 50) {
  const all = normSortById(words);
  if (!all.length) return [];

  const chunks = chunkWithMin(all, blockSize, 20);
  return chunks.map((arr) => {
    const from = arr[0]?.id ?? "";
    const to = arr[arr.length - 1]?.id ?? "";
    return {
      key: `num:${from}-${to}`, // ★ 末尾の :index は付けない
      label: `${from}–${to}`,
      count: arr.length,
      ids: arr.map((w) => w.id),
    };
  });
}

/* -------------------------------------------
 * 2) 品詞ブロック（レベル別の表示順に従い、各品詞を50語ずつ）
 * 返却: [{ key:"pos:名詞:1-50", label:"名詞（50語）", count, ids }]
 * ------------------------------------------- */
export function buildBlocksByPOS(words, level, blockSize = 50) {
  const normLevel = String(level).toLowerCase();
  const all = normSortById(words);
  const order = getPosOrder(normLevel); // ["名詞","い形容詞","な形容詞","副詞","動詞","その他"]

  // 品詞ごとのバケツ
  const buckets = new Map(order.map((p) => [p, []]));
  const ensure = (p) => {
    if (!buckets.has(p)) buckets.set(p, []);
    return buckets.get(p);
  };

  for (const w of all) {
    const wid = w.id;
    let pos = Number.isFinite(wid) ? getPosById(normLevel, wid, null) : null;
    if (!pos) {
      const p = String(
        w._pos ??
          w.pos ??
          w.partOfSpeech ??
          (Array.isArray(w?.tags) ? w.tags.join(",") : "")
      ).toLowerCase();
      if (p.includes("名詞") || p === "n" || p.startsWith("n")) pos = "名詞";
      else if (p.includes("い形") || p.includes("形容詞") || p.startsWith("adj-i"))
        pos = "い形容詞";
      else if (p.includes("な形") || p.includes("形容動詞") || p.startsWith("adj-na"))
        pos = "な形容詞";
      else if (p.includes("副詞") || p === "adv" || p.startsWith("adv"))
        pos = "副詞";
      else if (p.includes("動詞") || p.startsWith("v")) pos = "動詞";
      else pos = "その他";
    }
    ensure(pos).push(w);
  }

  const blocks = [];

  // 定義済み品詞
  for (const pos of order) {
    const list = (buckets.get(pos) || []).sort((a, b) => a.id - b.id);
    if (!list.length) continue;

    const chunks = chunkWithMin(list, blockSize, 20);
    chunks.forEach((ck) => {
      const from = ck[0]?.id ?? "";
      const to = ck[ck.length - 1]?.id ?? "";
      blocks.push({
        key: `pos:${pos}:${from}-${to}`, // ★ :index を付けない
        label: `${pos}（${ck.length}語）`,
        count: ck.length,
        ids: uniq(ck.map((w) => w.id)),
      });
    });
  }

  // 定義にない品詞があれば最後に追加
  for (const [p, arr] of buckets.entries()) {
    if (order.includes(p) || !arr.length) continue;
    const chunks = chunkWithMin(arr.sort((a, b) => a.id - b.id), blockSize, 20);
    chunks.forEach((ck) => {
      const from = ck[0]?.id ?? "";
      const to = ck[ck.length - 1]?.id ?? "";
      blocks.push({
        key: `pos:${p}:${from}-${to}`,
        label: `${p}（${ck.length}語）`,
        count: ck.length,
        ids: uniq(ck.map((w) => w.id)),
      });
    });
  }

  return blocks;
}

/* -------------------------------------------
 * 3) よく出る順（_rating/freq 降順で50語ずつ）
 *    ラベルは平均★（四捨五入）
 * 返却: [{ key:"freq:0", label:"★★★☆☆ 50語", count, ids }]
 * ------------------------------------------- */
export const stars = (n) => {
  const s = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return "★★★★★☆☆☆☆☆".slice(5 - s, 10 - s);
};

export function buildBlocksByFreq(words, blockSize = 50) {
  const all = normSortById(words).sort(
    (a, b) =>
      (b._rating ?? b.rating ?? b.freq ?? 0) -
      (a._rating ?? a.rating ?? a.freq ?? 0)
  );
  if (!all.length) return [];

  const chunks = chunkWithMin(all, blockSize, 20);
  return chunks.map((ck, idx) => {
    const avg =
      ck.reduce(
        (sum, w) =>
          sum + (Number(w._rating ?? w.rating ?? w.freq) || 0),
        0
      ) / (ck.length || 1);
    return {
      key: `freq:${idx}`,
      label: `${stars(avg)} ${ck.length}語`,
      count: ck.length,
      ids: ck.map((w) => w.id),
    };
  });
}
