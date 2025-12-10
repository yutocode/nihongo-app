// src/store/useAppStore.jsx
import { create } from "zustand";
import { tokyoDayKey } from "@/utils/daykey"; // 東京タイムゾーンの暦日キー

/** localStorage 安全取得 */
const safeGet = (key, fallback) => {
  try {
    return window?.localStorage?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const AUTH_USER_KEY = "auth.user";
const xpKey = (uid) => `xp.total:${uid || "anon"}`;
const XP_TOTAL_FALLBACK = "0";

/** Firebase User などを localStorage に保存しやすい形にスナップショット */
const snapshotUser = (user) => {
  if (!user) return null;
  const src = user._delegate ?? user; // Firebase v9 互換オブジェクトも対応
  return {
    uid: src.uid,
    email: src.email ?? null,
    displayName: src.displayName ?? null,
    photoURL: src.photoURL ?? null,
    providerId: src.providerId ?? null,
  };
};

/** 初期ユーザー（localStorage から復元） */
const initialUser = (() => {
  try {
    const raw = safeGet(AUTH_USER_KEY, null);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

/** ユーザーごとの XP を読み書き */
const loadXPTotalForUid = (uid) => {
  try {
    const raw = safeGet(xpKey(uid), XP_TOTAL_FALLBACK);
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return 0;
    return n;
  } catch {
    return 0;
  }
};

const saveXPTotalForUid = (uid, total) => {
  try {
    const v = Math.max(0, total | 0);
    window?.localStorage?.setItem(xpKey(uid), String(v));
  } catch {
    // 失敗しても致命的ではないので握りつぶす
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
    return {
      total,
      level: cap,
      need,
      into: need,
      percent: 100,
      levelLabel: "N5",
    };
  }

  const percent = need > 0 ? Math.floor((remain / need) * 100) : 0;
  return { total, level: lvl, need, into: remain, percent, levelLabel: "N5" };
}

/** 日付キー（東京基準ラッパー） */
const todayKey = () => tokyoDayKey();

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

// 初期 XP（初期ユーザーにひもづく値を読む）
const initialXPTotal = loadXPTotalForUid(initialUser?.uid);

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
  user: initialUser,
  setUser: (user) => {
    const snapshot = snapshotUser(user);

    // ユーザー情報を localStorage に保存 / 削除
    try {
      if (snapshot) {
        window?.localStorage?.setItem(
          AUTH_USER_KEY,
          JSON.stringify(snapshot),
        );
      } else {
        window?.localStorage?.removeItem(AUTH_USER_KEY);
      }
    } catch {
      // noop
    }

    // ユーザーごとの XP を読み込んで反映
    const total = loadXPTotalForUid(snapshot?.uid);
    set({
      user: snapshot,
      xp: computeProgress(total),
    });
  },
  clearUser: () => {
    try {
      window?.localStorage?.removeItem(AUTH_USER_KEY);
    } catch {}
    // 匿名用 XP に差し替え（必要ならここも 0 にしてOK）
    const anonTotal = loadXPTotalForUid(null);
    set({
      user: null,
      xp: computeProgress(anonTotal),
    });
  },

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
  avatarKey: safeGet("avatarKey", "panda"),
  setAvatarKey: (key) => {
    const k = key || "panda";
    try {
      window?.localStorage?.setItem("avatarKey", k);
    } catch {}
    set({ avatarKey: k });
  },

  /* ===== XP ===== */
  xp: computeProgress(initialXPTotal),
  addXP: (amount = 0) => {
    const st = get();
    const cur = st.xp.total | 0;
    const add = amount | 0;
    const next = Math.max(0, cur + add);

    saveXPTotalForUid(st.user?.uid, next);
    set({ xp: computeProgress(next), _xpDirty: true });
  },
  setXPTotal: (total, opts = {}) => {
    const st = get();
    const safe = Math.max(0, total | 0);
    const cur = st.xp.total | 0;
    const next = opts.force ? safe : Math.max(cur, safe); // 非減少ガード

    if (next !== cur) {
      saveXPTotalForUid(st.user?.uid, next);
      set({ xp: computeProgress(next), _xpDirty: true });
    }
  },
  setLevelLabel: (label) =>
    set({ xp: { ...get().xp, levelLabel: label } }),
  resetXP: () => {
    const st = get();
    saveXPTotalForUid(st.user?.uid, 0);
    set({ xp: computeProgress(0), _xpDirty: true });
  },

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
      message:
        DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)],
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
        Math.min(d.targetWords, (d.wordsDone | 0) + add),
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
        Math.min(d.targetQuizzes, (d.quizzesDone | 0) + add),
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
    return Math.round((Math.max(0, d.wordsDone | 0) / denom) * 100);
  },
  getQuizProgress: () => {
    const d = get().daily;
    const denom = d.targetQuizzes | 0;
    if (denom <= 0) return 0;
    return Math.round((Math.max(0, d.quizzesDone | 0) / denom) * 100);
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
      const st = get();
      st.addXP(unit * n);
      st.incDailyQuizzes(n, st.user?.uid);
    }
  },
  awardQuizComplete: (amount = XP_WEIGHTS.QUIZ_COMPLETE) => {
    const st = get();
    st.addXP(amount);
  },

  /* ===== サーバ同期フラグ ===== */
  _xpDirty: false,
  setXpDirty: (v) => set({ _xpDirty: !!v }),
}));