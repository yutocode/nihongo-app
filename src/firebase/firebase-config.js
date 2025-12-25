// src/firebase/firebase-config.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getFirestore as getFirestoreLite } from "firebase/firestore/lite";
import {
  getAuth,
  setPersistence,
  indexedDBLocalPersistence,
  browserLocalPersistence,
} from "firebase/auth";

/**
 * Firebase Config
 * - 本番は .env (Viteなら VITE_*) 推奨
 * - env 未設定でも動くように fallback を残す
 */
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDqin1UCPFkfFObScDR5QtJQXxzBlkg-hE",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "app-4db93.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "app-4db93",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "app-4db93.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "901561976774",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:901561976774:web:59628729f7caf28e7654c7",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FR05H677B9",
};

/** 1) Firebase App（多重初期化防止） */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/** 実行環境判定 */
const isBrowser = typeof window !== "undefined";
const ua = isBrowser ? navigator.userAgent || "" : "";

const isIOSUA = /iPad|iPhone|iPod/.test(ua);
const isIPadOS13Plus =
  isBrowser && /Macintosh/.test(ua) && "ontouchend" in window;

const isCapacitor =
  isBrowser &&
  (globalThis.Capacitor?.isNativePlatform?.() ||
    !!globalThis.Capacitor ||
    !!globalThis.cordova);

const isIOS = isIOSUA || isIPadOS13Plus;

/**
 * 2) Firestore（通常SDK）
 * - iOS/Capacitor では long polling 固定（AutoDetectは切る）
 */
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: isIOS || isCapacitor,
  experimentalAutoDetectLongPolling: false,
  useFetchStreams: false,
  ignoreUndefinedProperties: true,
});

/**
 * 2.5) Firestore Lite（REST）
 * - “読み取りだけ” で安定性を優先したい画面用（例: RankingPage）
 */
export const dbLite = getFirestoreLite(app);

/** 3) Auth */
export const auth = getAuth(app);

function canUseIndexedDB() {
  if (!isBrowser) return false;
  try {
    return typeof indexedDB !== "undefined" && indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * 4) 永続化（重要）
 * - 多重実行しない
 */
let persistencePromise = null;

export function ensureAuthPersistence() {
  if (!isBrowser) return Promise.resolve();
  if (persistencePromise) return persistencePromise;

  persistencePromise = (async () => {
    // iOS/Capacitorは IndexedDB が死ぬことがあるので try → fallback
    if (canUseIndexedDB()) {
      try {
        await setPersistence(auth, indexedDBLocalPersistence);
        // eslint-disable-next-line no-console
        console.log("[Auth] persistence -> indexedDB");
        return;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[Auth] indexedDB persistence failed, fallback", e);
      }
    }

    await setPersistence(auth, browserLocalPersistence);
    // eslint-disable-next-line no-console
    console.log("[Auth] persistence -> localStorage");
  })();

  return persistencePromise;
}

// モジュール読み込み時点で1回だけ仕込む（signInより先に走りやすい）
ensureAuthPersistence().catch(() => {});

export default app;