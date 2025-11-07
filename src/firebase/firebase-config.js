// src/firebase/firebase-config.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// あなたのプロジェクトの設定
const firebaseConfig = {
  apiKey: "AIzaSyDqin1UCPFkfFObScDR5QtJQXxzBlkg-hE",
  authDomain: "app-4db93.firebaseapp.com",
  projectId: "app-4db93",
  storageBucket: "app-4db93.appspot.com",
  messagingSenderId: "901561976774",
  appId: "1:901561976774:web:59628729f7caf28e7654c7",
  measurementId: "G-FR05H677B9",
};

// -------- initialize --------
const app = initializeApp(firebaseConfig);

// Firestore
// GitHub Pages / 一部回線での接続問題対策としてロングポーリング指定
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// Auth
export const auth = getAuth(app);

// ログイン状態をブラウザに永続化（毎回ログイン防止）
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("[Auth] persistence: local");
  })
  .catch((e) => {
    console.warn("[Auth] persistence error:", e);
  });

export default app;
