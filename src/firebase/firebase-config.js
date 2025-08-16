// src/firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore"; // ← ここ重要

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

// ✅ Listen 400対策（“強制ロングポーリング”のみ有効に）
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
  // experimentalAutoDetectLongPolling: true, // ← 併用禁止なので外す
});

export const auth = getAuth(app);
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("Auth persistence: local");
  } catch (e) {
    console.warn("Auth persistence error:", e);
  }
})();

export default app;
