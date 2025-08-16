// src/utils/xpPersistence.js
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
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
 *  REST ヘルパ（Listenを完全回避）
 * ========================= */
async function restGetDoc(path) {
  // Firestore REST：GET v1/projects/{project}/databases/(default)/documents/{path}
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "app-4db93";
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}`;

  const user = auth.currentUser;
  const headers = { "Content-Type": "application/json" };
  if (user) {
    const token = await user.getIdToken(/* forceRefresh= */ false);
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  if (res.status === 404) return null; // ドキュメントなし
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`REST get failed ${res.status}: ${text}`);
  }
  return await res.json(); // Firestore REST の document 形式
}

function getNumberFieldFromRestDoc(restDoc, field) {
  // restDoc.fields[field] の Firestore REST 表現から number を読む
  // numberValue / integerValue のどちらかを想定
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
      // REST の 5xx もリトライ対象に
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
  // progress を REST で取得
  const docJson = await withRetry(() => restGetDoc(progressDocPath(uid)));
  if (!docJson) {
    // なければ作る（SDKでOK：Commit RPCのみ）
    await withRetry(() =>
      setDoc(progressRef(uid), { [FIELD]: 0, updatedAt: serverTimestamp() })
    );
    return 0;
  }
  return getNumberFieldFromRestDoc(docJson, FIELD);
}

// 旧: users/{uid} の totalXP を併合（存在すれば）
async function loadLegacyIfAny(uid) {
  const docJson = await withRetry(() => restGetDoc(legacyUserRefPath(uid)));
  if (!docJson) return 0;
  // 旧スキーマ totalXP は number か integer の想定
  return getNumberFieldFromRestDoc(docJson, "totalXP");
}

/* =========================
 *  Firestore 書き（SDK Commit RPC）
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
 *  初期化：ローカル即適用 → autosave開始 → サーバ統合
 * ========================= */
export async function initUserXP(uid) {
  if (!uid) {
    console.error("[XP] initUserXP called with empty uid");
    return;
  }

  const local = loadXPFromLocal(uid);
  if (local != null) {
    console.log("[XP] apply local", local);
    useAppStore.getState().setXPTotal(local);
  } else {
    console.log("[XP] local none");
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
      console.log("[XP] server", progress, "legacy", legacy, "current", current, "adopted", adopted);

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
 *  自動保存（差分を500msデバウンス）
 *  + ページ離脱時に flush
 * ========================= */
let unsub = null;
let last = { uid: null, total: 0 };
let timer = null;
let boundFlush = null;
let boundVisHandler = null;

export function startAutoSave(uid) {
  stopAutoSave();
  last = { uid, total: useAppStore.getState().xp.total };
  console.log("[XP] autosave start", uid, "base", last.total);

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
        console.log("[XP] flush sent", delta);
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
  console.log("[XP] autosave stop");
}

/* =========================
 *  手動同期（必要なら）
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
  console.log("[XP] manual sync complete. cur:", cur, "server:", server, "adopted:", adopted);
}