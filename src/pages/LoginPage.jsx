//src/pages/LoginPage.jsx
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebase-config'
import { Link } from 'react-router-dom'
import '../styles/LoginPage.css'

// <div className="login-container"> でラップする

// JSXの中にこれを追加：
<p>
  アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
</p>

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('ログイン成功:', userCredential.user)
    } catch (error) {
      alert('ログイン失敗:' + error.message)
    }
  }

  return (
  <div className="login-container">
    <h2>ログイン</h2>
    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handleLogin}>ログイン</button>
    
    <p>
      アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
    </p>
  </div>
)

}

export default LoginPage
