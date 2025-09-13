// Vite の import.meta.glob で lesson.json を一括ロード
const modules = import.meta.glob("../data/alphabet/lesson*/lesson.json", { eager: true });

export type AlphabetLesson = {
  id: number;
  title: string;
  hira: string[];
  kata: string[];
  order?: ("learn"|"audio"|"mc4")[];
};

const cache: Record<number, AlphabetLesson> = {};

// 初期化: ファイル名から lessonId を抽出してキャッシュ
for (const path in modules) {
  const mod = modules[path] as any;
  const m = path.match(/lesson(\d+)\/lesson\.json$/);
  if (!m) continue;
  const id = Number(m[1]);
  cache[id] = mod.default ?? mod; // JSON モジュールの default を優先
}

export function getAllAlphabetLessons(): AlphabetLesson[] {
  return Object.values(cache).sort((a,b)=>a.id-b.id);
}

export function getAlphabetLesson(id: number): AlphabetLesson | undefined {
  return cache[id];
}
