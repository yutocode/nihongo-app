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

// ---- App ----
const app = initializeApp(firebaseConfig);

// ---- Firestore ----
// GitHub Pages / 一部ネットワークでの接続問題対策としてロングポーリング指定
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});

// ---- Auth ----
export const auth = getAuth(app);

// Capacitor(iOSアプリ) かどうか判定
const isCapacitorWebView =
  typeof window !== "undefined" &&
  window.location &&
  window.location.origin.startsWith("capacitor://");

const persistence = isCapacitorWebView
  ? inMemoryPersistence // iOS アプリ: メモリのみ
  : browserLocalPersistence; // Web: これまで通り localStorage

setPersistence(auth, persistence)
  .then(() => {
    console.log(
      "[Auth] persistence:",
      isCapacitorWebView ? "inMemory" : "browserLocal",
    );
  })
  .catch((e) => {
    console.warn("[Auth] persistence error:", e);
  });

// デフォルトは app を返す
export default app;