// src/pages/RegisterPage.jsx
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebase-config'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import '../styles/RegisterPage.css'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const setUser = useAppStore(state => state.setUser)

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      alert('登録成功！')
      navigate('/home')
    } catch (error) {
      alert('登録失敗: ' + error.message)
    }
  }

  return (
    <div className="register-container">
      <h2>新規登録</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>登録する</button>
    </div>
  )
}

export default RegisterPage

