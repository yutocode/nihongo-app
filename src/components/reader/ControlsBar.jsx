import React from "react";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";

export default function ControlsBar({
  onPrev, onNext, onPlay,
  canPrev, canNext,
  step = 1, total = 1
}) {
  return (
    <div className="controls">
      <div className="controls__inner">
        <button
          className="ctrl-btn"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="previous"
        >
          <FaChevronLeft />
        </button>

        <button className="ctrl-btn is-primary" onClick={onPlay} aria-label="play">
          <FaPlay />
        </button>

        <button
          className="ctrl-btn"
          onClick={onNext}
          disabled={!canNext}
          aria-label="next"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* 下にプログレス（1/10 と細バー） */}
      <div className="controls__progress">
        <span className="controls__count">{step}/{total}</span>
        <div className="controls__bar">
          <div
            className="controls__bar__fill"
            style={{ width: `${Math.round((step / total) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
