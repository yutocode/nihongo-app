// src/firebase/firebase-config.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDqin1UCPFkfFObScDR5QtJQXxzBlkg-hE",
  authDomain: "app-4db93.firebaseapp.com",
  projectId: "app-4db93",
  storageBucket: "app-4db93.appspot.com", // ← 修正
  messagingSenderId: "901561976774",
  appId: "1:901561976774:web:59628729f7caf28e7654c7",
  measurementId: "G-FR05H677B9"
}

// Firebaseの初期化
const app = initializeApp(firebaseConfig)

// 🔑 認証（Auth）機能を使うためのexport
export const auth = getAuth(app)




