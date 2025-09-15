// 既存 useProgressStore が「flat（vocabulary/kanji…）」でも
// 「levels.n5.vocabulary…」でも動くように安全に集計するヘルパ

export function pickLevelSections(storeSections, levelKey = "n5") {
  // 形1: { vocabulary: {...}, kanji: {...}, ... }
  if (storeSections?.vocabulary || storeSections?.kanji) return storeSections;

  // 形2: { n5: { vocabulary: {...}, ... }, n4: {...} }
  if (storeSections?.[levelKey]) return storeSections[levelKey];

  return {};
}

export function summarizeSections(sec) {
  const vals = Object.values(sec || {});
  const answered = vals.reduce((a, s) => a + (s?.answered || 0), 0);
  const correct  = vals.reduce((a, s) => a + (s?.correct  || 0), 0);
  const total    = vals.reduce((a, s) => a + (s?.total    || 0), 0);
  const pct = answered ? Math.round((correct / Math.max(total || answered, 1)) * 100) : 0;
  return { answered, correct, total, pct };
}
