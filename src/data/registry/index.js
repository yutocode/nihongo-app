// src/data/registry/index.js
// 全レベルの単語を “id 主導” で集約して、byId と all を提供

import { n1WordSets } from "../n1WordSets/index.js";
import { n2WordSets } from "../n2WordSets/index.js";
import { n3WordSets } from "../n3WordSets/index.js";
import { n4WordSets } from "../n4WordSets/index.js";
import { n5WordSets } from "../n5WordSets/index.js";

// ファイル名や LessonX キーは無視して、中の配列だけ吸い出す
function collectWords(wordSetsObj) {
  const out = [];
  if (!wordSetsObj) return out;
  for (const mod of Object.values(wordSetsObj)) {
    for (const value of Object.values(mod)) {
      if (Array.isArray(value)) {
        out.push(...value);
      } else if (value && typeof value === "object") {
        for (const v of Object.values(value)) {
          if (Array.isArray(v)) out.push(...v);
        }
      }
    }
  }
  return out;
}

function buildRegistry(wordSetsObj) {
  const all = collectWords(wordSetsObj)
    .filter(Boolean)
    .map((w) => ({ ...w, id: Number(w.id) }))   // idを数値化
    .filter((w) => Number.isFinite(w.id))        // idが無い/NaNを除外
    .sort((a, b) => a.id - b.id);                // id昇順で揃える

  const byId = Object.fromEntries(all.map((w) => [w.id, w]));
  return { all, byId };
}

export const levels = {
  n1: buildRegistry(n1WordSets),
  n2: buildRegistry(n2WordSets),
  n3: buildRegistry(n3WordSets),
  n4: buildRegistry(n4WordSets),
  n5: buildRegistry(n5WordSets),
};

export const getAllWords = (level) =>
  levels?.[String(level).toLowerCase()]?.all ?? [];

export const getWordById = (level, id) =>
  levels?.[String(level).toLowerCase()]?.byId?.[Number(id)] ?? null;
