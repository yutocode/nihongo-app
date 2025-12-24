// src/firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import {
  initializeAuth,
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

/** 1) Firebase App */
const app = initializeApp(firebaseConfig);

/**
 * iOS/WKWebView 判定
 * - Listen/channel が不安定になりやすいので iOS は long polling を強制すると安定しやすい
 */
const isBrowser = typeof window !== "undefined";
const ua = isBrowser ? navigator.userAgent || "" : "";
const isIOS = /iPad|iPhone|iPod/.test(ua);

/** 2) Firestore（安定化） */
export const db = initializeFirestore(app, {
  // iOS は強制 long polling、それ以外は自動検出
  experimentalForceLongPolling: isIOS,
  experimentalAutoDetectLongPolling: !isIOS,

  // fetch streams は切っておく（WKWebViewでコケやすい時がある）
  useFetchStreams: false,

  // undefined を入れても落とさない
  ignoreUndefinedProperties: true,
});

/**
 * 3) Auth（永続ログイン）
 * - 「配列で渡す」は環境によって不安定なので、確実な1つを選んで渡す
 */
let persistenceForAuth = browserLocalPersistence;
if (isBrowser && "indexedDB" in window) {
  persistenceForAuth = indexedDBLocalPersistence;
}

export const auth = initializeAuth(app, {
  persistence: persistenceForAuth,
});

export default app;