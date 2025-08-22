// src/components/TextWithRuby.jsx
import React from "react";
import Ruby from "./Ruby";
import { parseRubyString } from "../utils/parseRuby";

/**
 * value の受け取りパターン
 * 1) 文字列: プレーン or <ruby>…<rt>…</rt></ruby> を含むHTML
 * 2) オブジェクト:
 *    - { text:"飲む", ruby:"のむ" } / { text:"飲む", yomi:"のむ" }
 *    - { segments:[{ t:"飲", r:"の" }, { t:"む" }]}
 *    - { segments:[{ t:"飲", y:"の" }, { t:"む" }]} ← y も対応
 */
export default function TextWithRuby({ value }) {
  if (value == null) return null;

  // 1) 文字列
  if (typeof value === "string") {
    if (value.includes("<ruby>") && value.includes("<rt>")) {
      const props = parseRubyString(value);
      return <Ruby {...props} />;
    }
    return <span>{value}</span>;
  }

  // 2) オブジェクト
  if (typeof value === "object") {
    // a) segments が来たら r/y を統一
    if (Array.isArray(value.segments)) {
      const segments = value.segments.map((s) => ({
        t: s.t ?? "",
        r: s.r ?? s.y ?? undefined, // r が無ければ y を使う
      }));
      return <Ruby segments={segments} />;
    }

    // b) text + ruby/yomi
    if (value.text) {
      const ruby = value.ruby ?? value.yomi ?? undefined;
      if (ruby) return <Ruby text={value.text} ruby={ruby} />;
      return <span>{value.text}</span>;
    }
  }

  return null;
}
