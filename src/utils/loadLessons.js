// src/utils/loadLessons.js
function extractArrayFromModule(mod) {
  if (!mod) return null;
  for (const v of Object.values(mod)) if (Array.isArray(v)) return v;
  return null;
}
function keyFromPath(path) {
  const m = path.match(/grammar\/(n[1-5])\/(?:([^/]+)\/)?(lesson\d+)\.js$/i);
  if (!m) return null;
  const level = m[1].toLowerCase();
  const category = (m[2] || "").toLowerCase();
  const lesson = m[3].toLowerCase();
  return category ? `${level}-${category}-${lesson}` : `${level}-${lesson}`;
}
export const LESSON_MAP = (() => {
  const ALL = import.meta.glob("../data/grammar/**/lesson*.js", { eager: true });
  const map = new Map();
  Object.entries(ALL).forEach(([p, mod]) => {
    const key = keyFromPath(p);
    const arr = extractArrayFromModule(mod);
    if (key && arr) map.set(key, arr);
  });
  return map;
})();
