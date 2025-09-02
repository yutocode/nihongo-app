// src/store/useMyWordsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 1レコードのIDを安定して作る
 * - 優先: word.id
 * - 次点: `${level}:${lesson}:${idx}`
 * - 最後: `${kanji}|${reading}|${level}|${lesson}`
 */
function buildId(word = {}) {
  if (word.id) return String(word.id);

  const level  = word.level  ?? "";
  const lesson = word.lesson ?? "";
  const idx    = word.idx ?? word.index ?? "";

  if (level && lesson && (idx !== "" && idx !== undefined)) {
    return `${level}:${lesson}:${idx}`;
  }

  const kanji   = word.kanji ?? "";
  const reading = word.reading ?? word.readings?.[0] ?? "";
  return `${kanji}|${reading}|${level}|${lesson}`;
}

export const useMyWordsStore = create()(
  persist(
    (set, get) => ({
      /** 保存データ */
      items: [], // {id, kanji, reading(s), meanings, level, lesson, idx, addedAt}

      /** 件数 */
      count() {
        return get().items.length;
      },

      /** ID存在チェック */
      has(id) {
        return get().items.some((w) => w.id === id);
      },

      /** word から存在チェック */
      hasWord(word) {
        const id = buildId(word);
        return get().items.some((w) => w.id === id);
      },

      /** 追加（重複はスキップして false を返す） */
      add(word) {
        const id = buildId(word);
        if (get().items.some((w) => w.id === id)) return false;

        const item = {
          ...word,
          id,
          addedAt: Date.now(),
        };
        set((state) => ({ items: [item, ...state.items] }));
        return true;
      },

      /** IDで削除 */
      remove(id) {
        set((state) => ({ items: state.items.filter((w) => w.id !== id) }));
      },

      /** word から削除 */
      removeWord(word) {
        const id = buildId(word);
        set((state) => ({ items: state.items.filter((w) => w.id !== id) }));
      },

      /** 追加/削除のトグル。結果を "added" | "removed" で返す */
      toggle(word) {
        const id = buildId(word);
        if (get().items.some((w) => w.id === id)) {
          set((state) => ({ items: state.items.filter((w) => w.id !== id) }));
          return "removed";
        }
        const item = { ...word, id, addedAt: Date.now() };
        set((state) => ({ items: [item, ...state.items] }));
        return "added";
      },

      /** 全削除 */
      clear() {
        set({ items: [] });
      },
    }),
    {
      name: "my-wordbook-v1",
      version: 1,
    }
  )
);