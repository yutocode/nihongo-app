import React, { useEffect, useRef, useState } from "react";
import "./TracingCanvas.css";

/**
 * なぞり学習用キャンバス
 * - ガイド文字や筆順SVGを背景に表示
 * - マウス/タッチで書ける
 */
export default function TracingCanvas({
  char = "あ",
  width = 360,
  height = 360,
  guideType = "text", // "text" | "svg"
  guideSvg = null,    // guideType==="svg" の場合にSVGパスを渡す
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [curWidth, setCurWidth] = useState(14);

  // 高DPI対応
  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useEffect(() => { redraw(); }, [paths, curWidth]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches?.[0];
    const cx = (touch ? touch.clientX : e.clientX) - rect.left;
    const cy = (touch ? touch.clientY : e.clientY) - rect.top;
    return { x: cx, y: cy };
  };

  const start = (e) => {
    e.preventDefault();
    const p = getPos(e);
    setPaths((ps) => [...ps, { points: [p], w: curWidth }]);
    setIsDrawing(true);
  };
  const move = (e) => {
    if (!isDrawing) return;
    const p = getPos(e);
    setPaths((ps) => {
      const next = [...ps];
      next[next.length - 1].points.push(p);
      return next;
    });
  };
  const end = () => setIsDrawing(false);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (const stroke of paths) {
      ctx.beginPath();
      const pts = stroke.points;
      if (!pts.length) continue;
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.lineWidth = stroke.w;
      ctx.strokeStyle = "#222";
      ctx.stroke();
    }
  };

  const undo = () => setPaths((ps) => ps.slice(0, -1));
  const clearAll = () => setPaths([]);

  return (
    <div className="trace-wrap" style={{ width, height }}>
      <div className="trace-guide">
        {guideType === "text" && <span>{char}</span>}
        {guideType === "svg" && guideSvg && (
          <img src={guideSvg} alt={`guide ${char}`} />
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="trace-canvas"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />

      <div className="trace-tools">
        <button onClick={undo} disabled={!paths.length}>↩ Undo</button>
        <button onClick={clearAll} disabled={!paths.length}>🗑 Clear</button>
        {[10, 14, 20].map((w) => (
          <button
            key={w}
            className={w === curWidth ? "active" : ""}
            onClick={() => setCurWidth(w)}
          >
            {w}px
          </button>
        ))}
      </div>
    </div>
  );
}
