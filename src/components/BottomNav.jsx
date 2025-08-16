// src/components/BottomNav.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBookOpen, FaGem, FaCog } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import "../styles/BottomNav.css";

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <FaHome onClick={() => navigate("/home")} />
      <FaBookOpen onClick={() => navigate("/words/n5/Lesson1")} />
      <MdQuiz onClick={() => navigate("/quiz")} className="center-icon" />
      <FaGem onClick={() => navigate("/premium")} />
      <FaCog onClick={() => navigate("/settings")} />
    </div>
  );
};

export default BottomNav;
