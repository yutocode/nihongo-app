// src/store/useAppStore.jsx
import { create } from "zustand";

/** localStorage 安全取得 */
const safeGet = (key, fallback) => {
  try {
    return window?.localStorage?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

/** レベル設計 */
export const LEVELING = {
  CAP: 100,
  BASE_REQ: 20,
  STEP_REQ: 20,
};

export const XP_WEIGHTS = {
  WORD_LEARNED: 5,
  QUIZ_CORRECT: 3,
  QUIZ_COMPLETE: 10,
};

/** レベル進捗計算 */
function computeProgress(total) {
  const cap = LEVELING.CAP;
  const base = LEVELING.BASE_REQ;
  const step = LEVELING.STEP_REQ;

  let lvl = 1;
  let need = base;
  let remain = Math.max(0, total | 0);

  while (remain >= need && lvl < cap) {
    remain -= need;
    lvl++;
    need = base + (lvl - 1) * step;
  }

  if (lvl >= cap) {
    return { total, level: cap, need, into: need, percent: 100, levelLabel: "N5" };
  }

  const percent = need > 0 ? Math.floor((remain / need) * 100) : 0;
  return { total, level: lvl, need, into: remain, percent, levelLabel: "N5" };
}

/** 日付キー */
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};
const dailyKey = (uid) => `daily:${uid || "anon"}`;

/** 日替わりメッセージ／トピック */
const DAILY_MESSAGES = [
  "今日も頑張りましょう！",
  "小さな一歩が大きな成長に！",
  "継続は力なり！",
  "挑戦する心を忘れずに！",
  "昨日より今日、今日より明日！",
];
const DAILY_TOPICS = [
  "旅行で使える日本語",
  "日常会話フレーズ",
  "ビジネス日本語",
  "JLPT N5 漢字特集",
  "日本文化クイズ",
];

export const useAppStore = create((set, get) => ({
  /* ===== 認証 ===== */
  authReady: false,
  setAuthReady: (v) => set({ authReady: !!v }),

  /* ===== 言語設定 ===== */
  selectedLanguage: safeGet("lang", "ja"),
  setLanguage: (lang) => {
    try {
      window?.localStorage?.setItem("lang", lang);
    } catch {}
    set({ selectedLanguage: lang });
  },

  /* ===== ユーザー ===== */
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  /* ===== レベル ===== */
  level: safeGet("app.level", ""), // 初回は空
  setLevel: (lvl) => {
    try {
      const v = String(lvl).toLowerCase();
      window?.localStorage?.setItem("app.level", v);
      set({ level: v });
    } catch {
      set({ level: String(lvl).toLowerCase() });
    }
  },

  /* ===== アバター（プロフィールアイコン） ===== */
  // avatarKey は "panda" | "cat" | "dog" | "penguin" ... を想定
  avatarKey: safeGet("avatarKey", "panda"),
  setAvatarKey: (key) => {
    const k = key || "panda";
    try {
      window?.localStorage?.setItem("avatarKey", k);
    } catch {}
    set({ avatarKey: k });
  },

  /* ===== XP ===== */
  xp: computeProgress(0),
  addXP: (amount = 0) => {
    const cur = get().xp.total | 0;
    const add = amount | 0;
    const next = Math.max(0, cur + add);
    set({ xp: computeProgress(next), _xpDirty: true });
  },
  setXPTotal: (total, opts = {}) => {
    const safe = Math.max(0, total | 0);
    const cur = get().xp.total | 0;
    const next = opts.force ? safe : Math.max(cur, safe); // 非減少ガード
    if (next !== cur) set({ xp: computeProgress(next), _xpDirty: true });
  },
  setLevelLabel: (label) => set({ xp: { ...get().xp, levelLabel: label } }),
  resetXP: () => set({ xp: computeProgress(0), _xpDirty: true }),

  /* ===== デイリー進捗 ===== */
  daily: {
    dateKey: todayKey(),
    targetWords: 20,
    targetQuizzes: 5,
    wordsDone: 0,
    quizzesDone: 0,
    streak: 0,
    message: DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)],
    topic: DAILY_TOPICS[Math.floor(Math.random() * DAILY_TOPICS.length)],
  },

  loadDailyForUser: (uid) => {
    try {
      const raw = window.localStorage.getItem(dailyKey(uid));
      if (!raw) return;
      const obj = JSON.parse(raw);
      if (obj.dateKey !== todayKey()) {
        get().resetDaily(uid, obj);
      } else {
        set({ daily: obj });
      }
    } catch {}
  },

  saveDailyForUser: (uid) => {
    try {
      const st = get().daily;
      window.localStorage.setItem(dailyKey(uid), JSON.stringify(st));
    } catch {}
  },

  ensureDailyToday: (uid) => {
    const d = get().daily;
    if (d.dateKey !== todayKey()) {
      get().resetDaily(uid, d);
    }
  },
  // 互換用: 旧関数名を残しておく
  ensureToday: (uid) => {
    const d = get().daily;
    if (d.dateKey !== todayKey()) {
      get().resetDaily(uid, d);
    }
  },

  resetDaily: (uid, prev = get().daily) => {
    const wordsDone = prev?.wordsDone ?? 0;
    const quizzesDone = prev?.quizzesDone ?? 0;
    const targetWords = prev?.targetWords ?? 20;
    const targetQuizzes = prev?.targetQuizzes ?? 5;

    const wasAchieved =
      wordsDone >= targetWords && quizzesDone >= targetQuizzes;

    const next = {
      dateKey: todayKey(),
      targetWords,
      targetQuizzes,
      wordsDone: 0,
      quizzesDone: 0,
      streak: Math.max(0, (prev?.streak ?? 0) + (wasAchieved ? 1 : 0)),
      message: DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)],
      topic: DAILY_TOPICS[Math.floor(Math.random() * DAILY_TOPICS.length)],
    };
    set({ daily: next });
    get().saveDailyForUser(uid);
  },

  setDailyTargets: (words, quizzes, uid) => {
    const d = get().daily;
    const next = {
      ...d,
      targetWords: Math.max(0, words | 0),
      targetQuizzes: Math.max(0, quizzes | 0),
    };
    set({ daily: next });
    get().saveDailyForUser(uid);
  },

  incDailyWords: (n = 1, uid) => {
    const d = get().daily;
    const add = n | 0;
    const next = {
      ...d,
      wordsDone: Math.max(
        0,
        Math.min(d.targetWords, (d.wordsDone | 0) + add)
      ),
    };
    set({ daily: next });
    get().saveDailyForUser(uid);
  },

  incDailyQuizzes: (n = 1, uid) => {
    const d = get().daily;
    const add = n | 0;
    const next = {
      ...d,
      quizzesDone: Math.max(
        0,
        Math.min(d.targetQuizzes, (d.quizzesDone | 0) + add)
      ),
    };
    set({ daily: next });
    get().saveDailyForUser(uid);
  },

  /* ===== 進捗計算（UI用） ===== */
  getWordProgress: () => {
    const d = get().daily;
    const denom = d.targetWords | 0;
    if (denom <= 0) return 0;
    return Math.round(
      (Math.max(0, d.wordsDone | 0) / denom) * 100
    );
  },
  getQuizProgress: () => {
    const d = get().daily;
    const denom = d.targetQuizzes | 0;
    if (denom <= 0) return 0;
    return Math.round(
      (Math.max(0, d.quizzesDone | 0) / denom) * 100
    );
  },

  /* ===== XP付与 ===== */
  _learnedOnce: new Set(),
  markWordLearnedOnce: (wordId, amount = XP_WEIGHTS.WORD_LEARNED) => {
    const st = get();
    if (!wordId) return;
    if (!st._learnedOnce.has(wordId)) {
      st._learnedOnce.add(wordId);
      st.addXP(amount);
      st.incDailyWords(1, st.user?.uid);
    }
  },
  awardQuizCorrect: (count = 1, unit = XP_WEIGHTS.QUIZ_CORRECT) => {
    const n = count | 0;
    if (n > 0) {
      get().addXP(unit * n);
      get().incDailyQuizzes(n, get().user?.uid);
    }
  },
  awardQuizComplete: (amount = XP_WEIGHTS.QUIZ_COMPLETE) => {
    get().addXP(amount);
  },

  /* ===== サーバ同期フラグ ===== */
  _xpDirty: false,
  setXpDirty: (v) => set({ _xpDirty: !!v }),
}));
