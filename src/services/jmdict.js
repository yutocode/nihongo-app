// src/services/jmdict.js
import { loadDictionary } from "@scriptin/jmdict-simplified-loader";

let dictPromise = null; // 1回だけ読み込む

export function ensureJMdictLoaded() {
  if (!dictPromise) {
    dictPromise = loadDictionary(); // ← 非同期で辞書全体を読み込み
  }
  return dictPromise;
}

// 例：かな/漢字で検索する小ユーティリティ
export async function searchWords(q) {
  const dict = await ensureJMdictLoaded();
  const s = String(q).trim();

  // kana/kanji の一致・部分一致など（実装は簡略）
  const byKana  = dict.jmdict.wordsByKana.get(s)  || [];
  const byKanji = dict.jmdict.wordsByKanji.get(s) || [];

  // 重複除去して返す
  const out = [...byKana, ...byKanji];
  return Array.from(new Map(out.map(w => [w.id, w])).values());
}

