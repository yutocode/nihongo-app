// Asia/Tokyo の暦日キー（YYYY-MM-DD）
export function tokyoDayKey(d = new Date()) {
  const fmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d); // 例: "2025-11-11"
}

// 2つの YYYY-MM-DD の日数差（b - a）※東京基準
export function dayDiffInTokyo(aISO, bISO) {
  const a = new Date(`${aISO}T00:00:00+09:00`);
  const b = new Date(`${bISO}T00:00:00+09:00`);
  return Math.round((b - a) / 86400000);
}
