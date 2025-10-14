// 品詞（Part of Speech）をレッスン番号から返す（名詞=1〜10に対応済み）
export const getPosByLesson = (lessonNo) => {
  const n = Number(lessonNo);
  if (!Number.isFinite(n)) return "";

  if (n >= 1 && n <= 10)  return "名詞";          // Nouns
  if (n >= 11 && n <= 12) return "い形容詞";      // i-adjectives
  if (n === 13)           return "な形容詞";      // na-adjectives
  if (n === 14)           return "副詞/表現";     // Adverbs / Expressions
  if (n === 15)           return "助詞/接続";     // Particles / Conjunctions
  if (n === 16)           return "助数詞";        // Counters
  if (n >= 17 && n <= 18) return "動詞";          // Verbs

  return "";
};
