// src/utils/parseRuby.js
// "<ruby>食<rt>た</rt></ruby>べる" → { segments:[{t:"食", r:"た"}, {t:"べる"}] }
// "飲む" → { segments:[{t:"飲む"}] }
export function parseRubyString(s) {
  if (typeof s !== "string" || s.length === 0) {
    return { segments: [{ t: "" }] };
  }

  const segs = [];
  let i = 0;
  const rx = /<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g;
  let m;

  while ((m = rx.exec(s))) {
    if (m.index > i) {
      const plain = s.slice(i, m.index);
      if (plain) segs.push({ t: plain });
    }
    segs.push({ t: m[1], r: m[2] });
    i = m.index + m[0].length;
  }

  if (i < s.length) {
    const rest = s.slice(i);
    if (rest) segs.push({ t: rest });
  }

  if (segs.length === 0) segs.push({ t: s });
  return { segments: segs };
}
