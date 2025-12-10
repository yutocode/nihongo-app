// src/firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
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

/**
 * 1) Firebase App
 */
const app = initializeApp(firebaseConfig);

/**
 * 2) Firestore
 *    （ロングポーリング設定はそのまま）
 */
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});

/**
 * 3) Auth
 *    - ブラウザ / WebView でも端末にセッションを残したいので
 *      indexedDBLocalPersistence を優先
 *    - もし indexedDB が使えない環境では browserLocalPersistence にフォールバック
 */
const isBrowser = typeof window !== "undefined";

let persistenceForAuth = browserLocalPersistence;
if (isBrowser && "indexedDB" in window) {
  persistenceForAuth = indexedDBLocalPersistence;
}

export const auth = initializeAuth(app, {
  persistence: persistenceForAuth,
});

export default app;