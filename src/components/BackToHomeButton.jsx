// src/components/BackToHomeButton.jsx
import { useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export default function BackToHomeButton({ label = "ホーム" }) {
  const nav = useNavigate();
  return (
    <button className="back-home" onClick={() => nav("/home")}>
      <FiHome size={18} />
      <span>{label}</span>
    </button>
  );
}
