// src/data/grammar/hints/index.js
// =======================================
// 🌸 動詞活用ヒント インデックス
// 重要: HINTS_BY_TARGET 内で使うため、まず import し、後でまとめて export する
// =======================================

// 1) 各ヒントを "import"（ローカル束縛を作る）
import { HINT_JISHO_FORM } from "./jishoForm";               // 辞書形
import { HINT_MASU_FORM } from "./masuForm";                 // ます形
import { HINT_NAI_FORM } from "./naiForm";                   // ない形
import { HINT_TA_FORM } from "./taForm";                     // た形
import { HINT_TE_FORM } from "./teForm";                     // て形
import { HINT_TAI_FORM } from "./taiForm";                   // たい形
import { HINT_KANOU_FORM } from "./kanouForm";               // 可能形
import { HINT_UKEMI_FORM } from "./ukemiForm";               // 受け身形
import { HINT_SHIEKI_FORM } from "./shiekiForm";             // 使役形
import { HINT_SHIEKI_UKEMI_FORM } from "./shiekiUkemiForm";  // 使役受け身形
import { HINT_IKOU_FORM } from "./ikouForm";                 // 意向形
import { HINT_MEIREI_FORM } from "./meireiForm";             // 命令形
import { HINT_JOUKEN_FORM } from "./joukenForm";             // 条件形（〜ば）
import { HINT_TARA_FORM } from "./taraForm";                 // たら形
import { HINT_RENYOU_FORM } from "./renyouForm";             // 連用形
import { HINT_SHINKOU_FORM } from "./shinkouForm";           // 進行形

// 2) まとめオブジェクト（ターゲット名 → 各言語ヒント）
export const HINTS_BY_TARGET = {
  "辞書形":       HINT_JISHO_FORM,
  "ます形":       HINT_MASU_FORM,
  "ない形":       HINT_NAI_FORM,
  "た形":         HINT_TA_FORM,
  "て形":         HINT_TE_FORM,
  "たい形":       HINT_TAI_FORM,
  "可能形":       HINT_KANOU_FORM,
  "受け身形":     HINT_UKEMI_FORM,
  "使役形":       HINT_SHIEKI_FORM,
  "使役受け身形": HINT_SHIEKI_UKEMI_FORM,
  "意向形":       HINT_IKOU_FORM,
  "命令形":       HINT_MEIREI_FORM,
  "条件形":       HINT_JOUKEN_FORM,
  "たら形":       HINT_TARA_FORM,
  "連用形":       HINT_RENYOU_FORM,
  "進行形":       HINT_SHINKOU_FORM,
};

// 3) 外部からも個別に使えるように named export を再掲
export {
  HINT_JISHO_FORM,
  HINT_MASU_FORM,
  HINT_NAI_FORM,
  HINT_TA_FORM,
  HINT_TE_FORM,
  HINT_TAI_FORM,
  HINT_KANOU_FORM,
  HINT_UKEMI_FORM,
  HINT_SHIEKI_FORM,
  HINT_SHIEKI_UKEMI_FORM,
  HINT_IKOU_FORM,
  HINT_MEIREI_FORM,
  HINT_JOUKEN_FORM,
  HINT_TARA_FORM,
  HINT_RENYOU_FORM,
  HINT_SHINKOU_FORM,
};
