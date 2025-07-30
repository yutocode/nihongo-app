// src/pages/RankingPage.jsx
import React from 'react'
import { useAppStore } from '../store/useAppStore'
import { useTranslation } from 'react-i18next'
import '../styles/RankingPage.css'

const RankingPage = () => {
  const { t } = useTranslation()
  const ranking = useAppStore(state => state.ranking)

  return (
    <div className="ranking-page">
      <h2 className="ranking-title">🏆 {t('ranking.title', 'ランキング')}</h2>
      <p className="ranking-description">{t('ranking.description', '上位ユーザーを確認しましょう！')}</p>
      <ul className="ranking-list">
        {ranking
          .sort((a, b) => b.xp - a.xp)
          .map((user, index) => (
            <li key={user.id} className={`ranking-item ${index === 0 ? 'first-place' : ''}`}>
              <span className="rank-number">{index + 1}</span>
              <span className="rank-name">{user.name}</span>
              <span className="rank-xp">{user.xp} {t('ranking.xp', 'XP')}</span>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default RankingPage



