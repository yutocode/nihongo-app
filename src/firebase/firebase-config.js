// src/firebase/firebase-config.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  // inMemoryPersistence,  // 必要ならあとで使う用
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

const app = initializeApp(firebaseConfig);

// Firestore（これはそのままでOK）
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// Auth
export const auth = getAuth(app);

/**
 * iOS / Capacitor では browserLocalPersistence が
 * 変な挙動をすることがあるので、
 * 「本物のブラウザ (http / https)」でだけ使う
 */
const isRealBrowser =
  typeof window !== "undefined" &&
  (window.location.protocol === "http:" ||
    window.location.protocol === "https:");

if (isRealBrowser) {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("[Auth] persistence: local");
    })
    .catch((e) => {
      console.warn("[Auth] persistence error:", e);
    });
} else {
  // capacitor://localhost, file:// などではデフォルトに任せる
  console.log("[Auth] skip custom persistence for this environment");
}

export default app;