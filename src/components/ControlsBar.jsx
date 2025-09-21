// src/components/ControlsBar.jsx
import React from "react";
import { FiSettings, FiPlay, FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
import { TbLanguage } from "react-icons/tb";
import { GiSnail } from "react-icons/gi";
import "@/styles/ControlsBar.css";

export default function ControlsBar({
  onSettings, onTranslate, onPlay, onSlow, onPrev, onNext, onCheck, slowActive=false
}){
  return (
    <div className="cb-wrap">
      <div className="cb-pill">
        <button className="cb-btn" onClick={onSettings}><FiSettings/></button>
        <button className="cb-btn" onClick={onTranslate}><TbLanguage/></button>
        <button className="cb-btn cb-primary" onClick={onPlay}><FiPlay/></button>
        <button className={`cb-btn ${slowActive ? "cb-active":""}`} onClick={onSlow}><GiSnail/></button>
        <button className="cb-btn" onClick={onPrev}><FiChevronLeft/></button>
        <button className="cb-btn cb-ring" onClick={onNext}><FiChevronRight/></button>
        <button className="cb-btn cb-ok" onClick={onCheck}><FiCheck/></button>
      </div>
      <div className="cb-safezone" />
    </div>
  );
}
