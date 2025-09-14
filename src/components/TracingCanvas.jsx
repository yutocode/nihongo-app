import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Minimal Tracing Canvas (no toolbar)
 * - Stabilized drawing (lazy brush)
 * - Live follow line (direction guide)
 * - Auto beautify on stroke end (resample + simplify + Catmull-Rom)
 */
export default function TracingCanvas({
  char = "あ",
  width = 360,
  height = 360,
  background = "transparent",
  guideColor = "#c7c7c7",
  guideAlpha = 0.35,
  strokeColor = "#111",
  lineWidth = 14,           // 固定の太さ
  storageKeyPrefix = "kana-trace-",
  showGrid = true,
}) {
  const baseRef = useRef(null);     // 背景(グリッド+ゴースト+既存ストローク)
  const drawRef = useRef(null);     // ライブ描画(現在ストローク+フォロー線)
  const [paths, setPaths] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [rawPath, setRawPath] = useState([]); // pointerの生データ
  const dpr = (typeof window !== "undefined" && window.devicePixelRatio) || 1;
  const key = useMemo(() => `${storageKeyPrefix}${char}`.trim(), [storageKeyPrefix, char]);

  // lazy brush（手ぶれ補正）用の仮想カーソル
  const lazyPos = useRef({ x: null, y: null });
  const smoothing = 0.35;  // 0〜1（大きいほど強い補正＝遅延）

  useEffect(() => {
    const saved = localStorage.getItem(key);
    setPaths(saved ? JSON.parse(saved) : []);
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(paths));
    redrawBase();
  }, [paths, width, height, dpr, background, showGrid, char, guideColor, guideAlpha, lineWidth, strokeColor]);

  // 初期化 & リサイズ
  useEffect(() => {
    const canvases = [baseRef.current, drawRef.current];
    canvases.forEach((c) => {
      c.width = Math.floor(width * dpr);
      c.height = Math.floor(height * dpr);
      c.style.width = `${width}px`;
      c.style.height = `${height}px`;
      const ctx = c.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    });
    redrawBase();
  }, [width, height, dpr]);

  // ===== drawing core =====
  const getPoint = (e) => {
    const rect = drawRef.current.getBoundingClientRect();
    const t = e.touches?.[0];
    const cx = t ? t.clientX : e.clientX;
    const cy = t ? t.clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  };

  const onDown = (e) => {
    e.preventDefault();
    const p = getPoint(e);
    setDrawing(true);
    setRawPath([{ x: p.x, y: p.y }]);
    lazyPos.current = { x: p.x, y: p.y };
    clearDrawLayer();
  };

  const onMove = (e) => {
    if (!drawing) return;
    const p = getPoint(e);
    // lazy brush（手ぶれ補正）
    const lp = lazyPos.current;
    const nx = lp.x + (p.x - lp.x) * smoothing;
    const ny = lp.y + (p.y - lp.y) * smoothing;
    lazyPos.current = { x: nx, y: ny };

    setRawPath((prev) => {
      const next = [...prev, { x: nx, y: ny }];
      drawLive(next);
      return next;
    });
  };

  const onUp = () => {
    if (!drawing) return;
    setDrawing(false);
    clearDrawLayer();

    if (rawPath.length > 1) {
      const beautified = beautifyPath(rawPath);
      setPaths((prev) => [...prev, beautified]);
    }
    setRawPath([]);
  };

  // ===== Rendering =====
  function redrawBase() {
    const c = baseRef.current;
    const ctx = c.getContext("2d");
    // background
    if (background !== "transparent") {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
    if (showGrid) drawGrid(ctx);
    drawGhost(ctx);
    // draw existing paths
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    for (const path of paths) strokePath(ctx, path);
  }

  function clearDrawLayer() {
    const c = drawRef.current;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, width, height);
  }

  // 現在ストローク + フォロー線
  function drawLive(curPath) {
    const c = drawRef.current;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    // 現在ストローク
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    strokePath(ctx, curPath);

    // フォロー線（進行方向ガイド）
    if (curPath.length > 3) {
      const tail = curPath.slice(-6);
      const dir = directionFromTail(tail);
      const last = tail[tail.length - 1];
      const guideLen = 36; // 先に伸ばす長さ
      const gx = last.x + dir.x * guideLen;
      const gy = last.y + dir.y * guideLen;

      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 6]);
      ctx.lineWidth = Math.max(2, lineWidth * 0.35);
      ctx.strokeStyle = "#7aa2ff";
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(gx, gy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
  }

  function strokePath(ctx, path) {
    if (!path || path.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
    ctx.stroke();
  }

  function drawGrid(ctx) {
    ctx.save();
    ctx.strokeStyle = "#eaeaea";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
    ctx.restore();
  }

  function drawGhost(ctx) {
    ctx.save();
    ctx.globalAlpha = guideAlpha;
    ctx.fillStyle = guideColor;
    ctx.strokeStyle = guideColor;
    const fontSize = Math.min(width, height) * 0.78;
    ctx.font = `${fontSize}px "Noto Sans JP","Hiragino Kaku Gothic ProN","Meiryo",system-ui,sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = Math.max(2, fontSize * 0.03);
    ctx.strokeText(char, width / 2, height / 2);
    ctx.globalAlpha = guideAlpha * 0.65;
    ctx.fillText(char, width / 2, height / 2);
    ctx.restore();
  }

  // ===== Path utilities =====
  function directionFromTail(tail) {
    // 末尾方向ベクトル（正規化）
    const a = tail[0], b = tail[tail.length - 1];
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  }

  function beautifyPath(points) {
    // 1) 等間隔リサンプル
    const resampled = resample(points, 2.2); // px間隔
    // 2) DP簡略化
    const simplified = douglasPeucker(resampled, 1.4);
    // 3) Catmull-Romで滑らか化（折返しを守るため軽め）
    const smooth = catmullRom2poly(simplified, 8);
    return smooth;
  }

  function resample(pts, step = 2) {
    if (pts.length < 2) return pts.slice();
    const out = [pts[0]];
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = out[out.length - 1];
      const b = pts[i];
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (acc + d >= step) {
        const t = (step - acc) / d;
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
        pts.splice(i, 0, out[out.length - 1]);
        acc = 0;
      } else {
        acc += d;
      }
    }
    if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
    return out;
  }

  function douglasPeucker(points, eps) {
    if (points.length <= 2) return points.slice();
    const idx = findFarthest(points, 0, points.length - 1);
    const dmax = perpDistance(points[idx], points[0], points[points.length - 1]);
    if (dmax > eps) {
      const left = douglasPeucker(points.slice(0, idx + 1), eps);
      const right = douglasPeucker(points.slice(idx), eps);
      return left.slice(0, -1).concat(right);
    }
    return [points[0], points[points.length - 1]];
  }
  function findFarthest(pts, i, j) {
    let idx = i, dmax = -1;
    for (let k = i + 1; k < j; k++) {
      const d = perpDistance(pts[k], pts[i], pts[j]);
      if (d > dmax) { dmax = d; idx = k; }
    }
    return idx;
  }
  function perpDistance(p, a, b) {
    const A = p.x - a.x, B = p.y - a.y, C = b.x - a.x, D = b.y - a.y;
    const dot = A * C + B * D;
    const len = C * C + D * D || 1;
    const t = Math.max(0, Math.min(1, dot / len));
    const x = a.x + t * C, y = a.y + t * D;
    return Math.hypot(p.x - x, p.y - y);
    }

  function catmullRom2poly(pts, segments = 8) {
    if (pts.length < 3) return pts.slice();
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      for (let t = 0; t <= 1; t += 1 / segments) {
        const t2 = t * t, t3 = t2 * t;
        const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
        const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
        out.push({ x, y });
      }
    }
    // 最後の点で終わるように調整
    out.push(pts[pts.length - 1]);
    return out;
  }

  // ===== JSX =====
  return (
    <div className="trace-wrap" style={{ width, userSelect: "none", touchAction: "none" }}>
      <div className="trace-stage" style={{ position: "relative", width, height }}>
        <canvas
          ref={baseRef}
          width={Math.floor(width * dpr)}
          height={Math.floor(height * dpr)}
          style={{ position: "absolute", inset: 0, width, height }}
        />
        <canvas
          ref={drawRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          width={Math.floor(width * dpr)}
          height={Math.floor(height * dpr)}
          style={{ position: "absolute", inset: 0, width, height }}
        />
      </div>
    </div>
  );
}
