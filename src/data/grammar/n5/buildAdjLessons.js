// src/data/grammar/n5/buildAdjLessons.js
// n5AdjTypePool を い/な で分け、Lesson1〜6 を各10件で自動構成するビルダー。

import { n5AdjTypePool } from "./n5AdjTypePool";

// い/な/その他 を分ける
function splitByType(pool) {
  const i = [];
  const na = [];
  const other = []; // ヒント行やオプションなど
  for (const x of pool) {
    if (x.type === "i") i.push(x);
    else if (x.type === "na") na.push(x);
    else other.push(x);
  }
  return { i, na, other };
}

// 汎用: 供給配列 src から count 件取り出す（足りなければ空配列返す）
function take(src, count) {
  const out = src.splice(0, count);
  return out;
}

// 10件に満たないとき、補充用配列から追加（足りなければあるだけ）
function padTo10(arr, fillerSrc) {
  while (arr.length < 10 && fillerSrc.length) {
    arr.push(fillerSrc.shift());
  }
  return arr;
}

/**
 * レッスン構成ルール（各10件）
 * - L1: い形容詞 1〜10
 * - L2: い形容詞 11〜20
 * - L3: 残りの い形容詞 から10件（足りなければ な形容詞で補充）
 * - L4: な形容詞 10件
 * - L5: な形容詞 10件（足りなければ い形容詞で補充）
 * - L6: 残り（い/な混合）で10件（足りなければ other で補充）
 */
export function buildN5AdjLessons() {
  const { i, na, other } = splitByType([...n5AdjTypePool]);

  const L1 = take(i, 10);
  const L2 = take(i, 10);
  const L3 = padTo10(take(i, 10), na);
  const L4 = take(na, 10);
  const L5 = padTo10(take(na, 10), i);
  const rest = [...i, ...na, ...other];
  const L6 = take(rest, 10);

  return {
    lesson1: L1,
    lesson2: L2,
    lesson3: L3,
    lesson4: L4,
    lesson5: L5,
    lesson6: L6,
  };
}
