// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../firebase/firebase-config'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import '../styles/AuthPage.css'

const AuthPage = () => {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const navigate = useNavigate()
  const setUser = useAppStore((state) => state.setUser)

  // Google翻訳スクリプトの読み込み（ログインページのみ表示）
  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'ja',
          includedLanguages: 'id,en,zh-CN,zh-TW',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      )
    }

    // ログイン後にスクリプトと翻訳バッジを消す
    return () => {
      const widget = document.getElementById('google_translate_element')
      if (widget) widget.innerHTML = ''

      const scriptTag = document.querySelector(
        'script[src*="translate_a/element.js"]'
      )
      if (scriptTag) scriptTag.remove()

      delete window.googleTranslateElementInit
    }
  }, [])

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      )
      setUser(userCredential.user)
      navigate('/home')
    } catch (error) {
      alert('ログイン失敗: ' + error.message)
    }
  }

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      )
      setUser(userCredential.user)
      alert('登録成功！')
      navigate('/home')
    } catch (error) {
      alert('登録失敗: ' + error.message)
    }
  }

  return (
    <div className="auth-page">
      {/* 🔠 Google翻訳バッジ */}
      <div
        id="google_translate_element"
        style={{ textAlign: 'right', marginBottom: '10px' }}
      ></div>

      <div className="auth-box login-box">
        <h2>ログイン</h2>
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={handleLogin}>ログイン</button>
      </div>

      <div className="auth-box register-box">
        <h2>新規登録</h2>
        <input
          type="email"
          placeholder="Email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button onClick={handleRegister}>登録する</button>
      </div>
    </div>
  )
}

export default AuthPage





