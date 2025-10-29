// src/constants/verbFormLevels.js
export const LEVEL_ORDER = ["n5","n4","n3","n2","n1"]; // 低→高（小文字で統一）

// 各活用が「最低どのレベルから出題OKか」
export const MIN_LEVEL_BY_TARGET = {
  "辞書形": "n5",
  "ます形": "n5",
  "ない形": "n5",
  "た形": "n5",
  "て形": "n5",
  "たい形": "n5",
  "進行形": "n5",
  "たら形": "n5",
  "連用形": "n5",

  "意向形": "n4",
  "可能形": "n4",
  "受け身形": "n4",
  "条件形": "n4",

  "命令形": "n3",
  "使役形": "n3",

  "使役受け身形": "n2"
};

// levelがtargetを許可するか
export function levelAllows(target, level) {
  const need = MIN_LEVEL_BY_TARGET[target];
  if (!need) return true; // 未定義は許可（将来拡張用）
  return LEVEL_ORDER.indexOf(String(level).toLowerCase())
       >= LEVEL_ORDER.indexOf(String(need).toLowerCase());
}

// その級で使えるターゲット一覧（allTargets指定が無ければテーブルの鍵で作る）
export function targetsForLevel(level, allTargets) {
  const pool = allTargets || Object.keys(MIN_LEVEL_BY_TARGET);
  return pool.filter(t => levelAllows(t, level));
}
