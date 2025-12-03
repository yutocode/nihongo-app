// src/firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqin1UCPFkfFObScDR5QtJQXxzBlkg-hE",
  authDomain: "app-4db93.firebaseapp.com",
  projectId: "app-4db93",
  storageBucket: "app-4db93.appspot.com",
  messagingSenderId: "901561976774",
  appId: "1:901561976774:web:59628729f7caf28e7654c7",
  measurementId: "G-FR05H677B9",
};

// =====================
// Firebase App
// =====================
const app = initializeApp(firebaseConfig);

// =====================
// Firestore
// =====================
// GitHub Pages や一部のネットワーク環境向けにロングポーリングを有効化
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});

// =====================
// Auth
// =====================
export const auth = getAuth(app);

// 実行環境チェック
const isBrowser = typeof window !== "undefined";

// Capacitor(iOSアプリ) かどうか判定（ログ用）
const isCapacitorWebView =
  isBrowser &&
  typeof window.location?.origin === "string" &&
  window.location.origin.startsWith("capacitor://");

// 基本は「端末を閉じてもログイン状態を保持」したいので local を使う
const primaryPersistence = browserLocalPersistence;

// ===== 永続化設定（エラー時は inMemory にフォールバック） =====
(async () => {
  try {
    await setPersistence(auth, primaryPersistence);
    console.log(
      "[Auth] persistence set:",
      isCapacitorWebView ? "browserLocal (Capacitor)" : "browserLocal (Web)",
    );
  } catch (e) {
    console.warn("[Auth] persistence error, fallback to inMemory:", e);
    try {
      await setPersistence(auth, inMemoryPersistence);
      console.log("[Auth] persistence set: inMemory (fallback)");
    } catch (err) {
      console.error("[Auth] failed to set inMemory persistence", err);
    }
  }
})();

export default app;