// src/utils/quizRuntime.js
import { stripRuby } from "./stripRuby";
import { buildKanjiReadingMap, makeKanjiOnlySegments } from "./rubyMap";
import { TARGET_LABELS } from "../constants/grammarLabels";

/** 言語別の指示文自動生成 */
export function buildAutoPrompt(base, target, i18nLang) {
  const lang = (i18nLang || "ja").toLowerCase();
  const L = TARGET_LABELS[target] || TARGET_LABELS.plain;
  if (lang.startsWith("zh")) return `「${base}」を${L.zh}にすると？`;
  if (lang.startsWith("id")) return `Ubah 『${base}』 ke ${L.id}.`;
  if (lang.startsWith("en")) return `Change 『${base}』 to ${L.en}.`;
  return `「${base}」を${L.ja}にすると？`;
}

/** l1優先取得（なければ自動生成） */
export function pickL1(q, i18nLang, chosenTarget) {
  if (q?.l1) {
    const lang = (i18nLang || "ja").toLowerCase();
    const cand = [lang, lang.split("-")[0], "zh", "tw", "id", "en", "ja"];
    for (const k of cand) if (q.l1[k]) return q.l1[k];
  }
  const basePlain = stripRuby(q?.base ?? "");
  if (basePlain) return buildAutoPrompt(basePlain, chosenTarget, i18nLang);
  return null;
}

/** 実行用問題データに変換（漢字だけルビ） */
export function prepareRuntime({
  arr,
  i18nLang,
  TARGETS,
  conjugate,
  generateDistractors,
  shuffle,
}) {
  return arr.map((q) => {
    if (!q.base) {
      const choices = shuffle(q.choices || []);
      const correctOriginal = q.choices?.[q.answer];
      const answer = choices.findIndex((c) => c === correctOriginal);
      return { ...q, choices, answer };
    }

    const basePlain = stripRuby(q.base);
    const target =
      q.target && TARGETS.includes(q.target)
        ? q.target
        : TARGETS[Math.floor(Math.random() * TARGETS.length)];

    if (q.yomi) {
      const kanjiMap = buildKanjiReadingMap(basePlain, q.yomi);
      const pool = new Set([target]);
      const poolSrc = TARGETS.filter((t) => t !== target);
      while (pool.size < 4 && poolSrc.length) {
        const t = poolSrc.splice(Math.floor(Math.random() * poolSrc.length), 1)[0];
        pool.add(t);
      }
      const targetList = Array.from(pool);

      const pairs = targetList.map((t) => {
        const text = conjugate(basePlain, t);
        return { segments: makeKanjiOnlySegments(text, kanjiMap), _t: t };
      });

      const shuffled = shuffle(pairs);
      const answer = shuffled.findIndex((p) => p._t === target);

      return {
        ...q,
        _basePlain: basePlain,
        _target: target,
        l1text: pickL1(q, i18nLang, target),
        choices: shuffled.map(({ segments }) => ({ segments })), // 表示用
        answer,
        correct: conjugate(basePlain, target),
      };
    }

    // yomiが無い場合：ふりがな無し
    const correct = conjugate(basePlain, target);
    const wrongs = generateDistractors(basePlain, target, 3);
    const choices = shuffle([correct, ...wrongs].slice(0, 4));
    const answer = choices.findIndex((c) => c === correct);

    return {
      ...q,
      _basePlain: basePlain,
      _target: target,
      l1text: pickL1(q, i18nLang, target),
      choices,
      answer,
      correct,
    };
  });
}
