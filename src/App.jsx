// App.jsx
import React, { useState } from 'react';

const lessons = [
  {
    id: 1,
    title: "N5漢字クイズ",
    questions: [
      {
        question: "「日」は何という意味？",
        options: ["月", "太陽/日", "水", "火"],
        answer: "太陽/日"
      },
      {
        question: "「水」は何という意味？",
        options: ["火", "土", "水", "風"],
        answer: "水"
      }
    ]
  },
  {
    id: 2,
    title: "基本挨拶クイズ",
    questions: [
      {
        question: "「こんにちは」の意味は？",
        options: ["こんばんは", "ありがとう", "こんにちは", "さようなら"],
        answer: "こんにちは"
      }
    ]
  }
];

function App() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  function startLesson(lesson) {
    setSelectedLesson(lesson);
    setCurrentQIndex(0);
    setScore(0);
    setShowResult(false);
  }

  function handleAnswer(option) {
    const currentQuestion = selectedLesson.questions[currentQIndex];
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }
    if (currentQIndex + 1 < selectedLesson.questions.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setShowResult(true);
    }
  }

  if (!selectedLesson) {
    // レッスン選択画面
    return (
      <div style={{padding:20, fontFamily:"sans-serif"}}>
        <h1>日本語学習アプリ - インドネシア向け</h1>
        <h2>レッスン一覧</h2>
        <ul>
          {lessons.map(lesson => (
            <li key={lesson.id}>
              <button onClick={() => startLesson(lesson)}>{lesson.title}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (showResult) {
    // 結果画面
    return (
      <div style={{padding:20, fontFamily:"sans-serif"}}>
        <h2>{selectedLesson.title} - 結果</h2>
        <p>正解数：{score} / {selectedLesson.questions.length}</p>
        <button onClick={() => setSelectedLesson(null)}>レッスン一覧へ戻る</button>
      </div>
    );
  }

  // クイズ画面
  const currentQuestion = selectedLesson.questions[currentQIndex];

  return (
    <div style={{padding:20, fontFamily:"sans-serif"}}>
      <h2>{selectedLesson.title}</h2>
      <p>問題 {currentQIndex + 1} / {selectedLesson.questions.length}</p>
      <p><b>{currentQuestion.question}</b></p>
      <ul style={{listStyle: "none", padding: 0}}>
        {currentQuestion.options.map(option => (
          <li key={option} style={{marginBottom: 10}}>
            <button onClick={() => handleAnswer(option)}>{option}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

