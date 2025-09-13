// src/utils/xpPersistence.js
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  getDoc,               // ★ 追加
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useAppStore } from "../store/useAppStore";
import { auth } from "../firebase/firebase-config";

/* =========================
 *  Firestore パス & フィールド
 * ========================= */
const FIELD = "xpTotal";
const progressRef = (uid) => doc(db, "users", uid, "stats", "progress"); // 本命
const legacyUserRefPath = (uid) => `users/${uid}`;                        // 旧互換（totalXP）
const progressDocPath = (uid) => `users/${uid}/stats/progress`;

/* =========================
 *  初回ユーザードキュメント作成（404防止）
 * ========================= */
export async function ensureUserDoc(uid) {
  if (!uid) return;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        createdAt: serverTimestamp(),
        xpTotal: 0,
        level: "N5",
        daily: {},
      }, { merge: true });
      console.log("[XP] ensureUserDoc created for", uid);
    }
  } catch (e) {
    console.error("[XP] ensureUserDoc failed", e?.code || e?.message || e);
  }
}

/* =========================
 *  REST ヘルパ（Listenを完全回避）
 * ========================= */
async function restGetDoc(path) {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "app-4db93";
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}`;

  const user = auth.currentUser;
  const headers = { "Content-Type": "application/json" };
  if (user) {
    const token = await user.getIdToken(false);
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`REST get failed ${res.status}: ${text}`);
  }
  return await res.json();
}

function getNumberFieldFromRestDoc(restDoc, field) {
  const f = restDoc?.fields?.[field];
  if (!f) return 0;
  if (typeof f.doubleValue !== "undefined") return Number(f.doubleValue) || 0;
  if (typeof f.integerValue !== "undefined") return Number(f.integerValue) || 0;
  return 0;
}

/* =========================
 *  ユーティリティ（リトライ付き）
 * ========================= */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function withRetry(fn, tries = 3, base = 400) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      const code = e?.code || e?.message || "";
      if (code.includes("unavailable") || code.includes("deadline-exceeded")) {
        await sleep(base * (i + 1));
        continue;
      }
      if (code.match?.(/\b(5\d\d)\b/)) {
        await sleep(base * (i + 1));
        continue;
      }
      throw e;
    }
  }
  throw last;
}

/* =========================
 *  ローカル保存 (localStorage)
 * ========================= */
const lsKey = (uid) => `xp:${uid}`;

export function loadXPFromLocal(uid) {
  try {
    const raw = localStorage.getItem(lsKey(uid));
    if (!raw) return null;
    const n = Number(JSON.parse(raw)?.[FIELD]);
    return Number.isFinite(n) ? n : null;
  } catch (e) {
    console.warn("[XP] loadLocal fail", e);
    return null;
  }
}

export function saveXPToLocal(uid, total) {
  try {
    localStorage.setItem(lsKey(uid), JSON.stringify({ [FIELD]: Number(total) || 0 }));
  } catch (e) {
    console.warn("[XP] saveLocal fail", e);
  }
}

/* =========================
 *  Firestore 読み（REST）
 * ========================= */
export async function loadXPFromServer(uid) {
  const docJson = await withRetry(() => restGetDoc(progressDocPath(uid)));
  if (!docJson) {
    await withRetry(() =>
      setDoc(progressRef(uid), { [FIELD]: 0, updatedAt: serverTimestamp() })
    );
    return 0;
  }
  return getNumberFieldFromRestDoc(docJson, FIELD);
}

async function loadLegacyIfAny(uid) {
  const docJson = await withRetry(() => restGetDoc(legacyUserRefPath(uid)));
  if (!docJson) return 0;
  return getNumberFieldFromRestDoc(docJson, "totalXP");
}

/* =========================
 *  Firestore 書き
 * ========================= */
export async function incrementXPOnServer(uid, delta) {
  if (!delta) return;
  try {
    await withRetry(() =>
      updateDoc(progressRef(uid), {
        [FIELD]: increment(delta),
        updatedAt: serverTimestamp(),
      })
    );
    console.log("[XP] server +=", delta);
  } catch (e) {
    console.warn("[XP] updateDoc failed → setDoc fallback", e?.code || e?.message || e);
    await withRetry(() =>
      setDoc(progressRef(uid), { [FIELD]: delta, updatedAt: serverTimestamp() })
    );
  }
}

/* =========================
 *  初期化
 * ========================= */
export async function initUserXP(uid) {
  if (!uid) {
    console.error("[XP] initUserXP called with empty uid");
    return;
  }

  // ★ 最初に ensureUserDoc を呼んで 404 を防止
  await ensureUserDoc(uid);

  const local = loadXPFromLocal(uid);
  if (local != null) {
    useAppStore.getState().setXPTotal(local);
  }

  startAutoSave(uid);

  (async () => {
    try {
      const [progress, legacy] = await Promise.all([
        loadXPFromServer(uid),
        loadLegacyIfAny(uid),
      ]);

      const current = useAppStore.getState().xp.total;
      const adopted = Math.max(progress, legacy, current);

      if (adopted !== current) useAppStore.getState().setXPTotal(adopted);
      saveXPToLocal(uid, adopted);

      const delta = adopted - progress;
      if (delta > 0) await incrementXPOnServer(uid, delta);
    } catch (e) {
      console.error("[XP] initUserXP server sync failed", e?.code || e?.message || e);
    }
  })();
}

/* =========================
 *  自動保存
 * ========================= */
let unsub = null;
let last = { uid: null, total: 0 };
let timer = null;
let boundFlush = null;
let boundVisHandler = null;

export function startAutoSave(uid) {
  stopAutoSave();
  last = { uid, total: useAppStore.getState().xp.total };

  unsub = useAppStore.subscribe(
    (s) => s.xp.total,
    (total) => {
      saveXPToLocal(uid, total);
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        const delta = total - last.total;
        if (delta !== 0) {
          try {
            await incrementXPOnServer(uid, delta);
            last.total = total;
          } catch (e) {
            console.error("[XP] autosave increment fail", e?.code || e?.message || e);
          }
        }
      }, 500);
    }
  );

  const flush = async () => {
    const cur = useAppStore.getState().xp.total;
    const delta = cur - last.total;
    if (delta !== 0) {
      try {
        await incrementXPOnServer(uid, delta);
        last.total = cur;
      } catch (e) {
        console.error("[XP] flush fail", e?.code || e?.message || e);
      }
    }
  };

  boundFlush = flush;
  boundVisHandler = () => {
    if (document.visibilityState === "hidden") boundFlush?.();
  };

  window.addEventListener("visibilitychange", boundVisHandler);
  window.addEventListener("beforeunload", boundFlush);
}

export function stopAutoSave() {
  if (unsub) {
    unsub();
    unsub = null;
  }
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (boundVisHandler) {
    window.removeEventListener("visibilitychange", boundVisHandler);
    boundVisHandler = null;
  }
  if (boundFlush) {
    window.removeEventListener("beforeunload", boundFlush);
    boundFlush = null;
  }
  last = { uid: null, total: 0 };
}

/* =========================
 *  手動同期
 * ========================= */
export async function syncXPNow(uid) {
  if (!uid) return;
  const cur = useAppStore.getState().xp.total;
  const server = await loadXPFromServer(uid);
  const adopted = Math.max(cur, server);
  if (adopted !== cur) useAppStore.getState().setXPTotal(adopted);
  saveXPToLocal(uid, adopted);
  const delta = adopted - server;
  if (delta > 0) await incrementXPOnServer(uid, delta);
}
