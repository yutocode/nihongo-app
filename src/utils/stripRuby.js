// src/utils/stripRuby.js
/** "<ruby>食<rt>た</rt></ruby>べる" -> "食べる" */
export function stripRuby(html) {
  if (typeof html !== "string") return html ?? "";
  let s = html.replace(/<ruby>(.*?)<rt>.*?<\/rt><\/ruby>/g, "$1");
  return s.replace(/<\/?rb>|<\/?rt>|<\/?ruby>/g, "");
}
