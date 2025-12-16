// src/pages/KanjiStrokePage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import n1 from "@/data/kanji/n1_with_examples_ruby.json";
import n2 from "@/data/kanji/n2_with_examples_ruby.json";
import n3 from "@/data/kanji/n3_with_examples_ruby.json";
import n4 from "@/data/kanji/n4_with_examples_ruby.json";

import "@/styles/KanjiStrokePage.css";

const DATA_BY_LEVEL = { N4: n4, N3: n3, N2: n2, N1: n1 };
const PRACTICE_COUNT = 20;

// hint（薄いお手本）
const HINT_FONT_WEIGHT = 400;
const HINT_ALPHA = 0.18;

const normalizeLevel = (lv) => {
  const s = String(lv || "N4").trim();
  if (/^n\d$/i.test(s)) return s.toUpperCase();
  if (/^N\d$/.test(s)) return s;
  return "N4";
};

const readCssVar = (name, fallback = "") => {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

const firstFontFamily = (fam) => {
  const s = String(fam || "").trim();
  if (!s) return `"Noto Serif JP"`;
  const first = s.split(",")[0]?.trim();
  return first || `"Noto Serif JP"`;
};

// =====================
// Stroke smoothing core
// =====================
const dist2 = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

const clamp01 = (t) => Math.max(0, Math.min(1, t));

const pointToSegmentDist2 = (p, a, b) => {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const vv = vx * vx + vy * vy || 1;
  const wx = p.x - a.x;
  const wy = p.y - a.y;
  const t = clamp01((wx * vx + wy * vy) / vv);
  const proj = { x: a.x + t * vx, y: a.y + t * vy };
  return dist2(p, proj);
};

const pathLength = (pts) => {
  if (!pts || pts.length < 2) return 0;
  let len = 0;
  for (let i = 1; i < pts.length; i += 1) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    len += Math.hypot(dx, dy);
  }
  return len;
};

const filterMinDistance = (pts, minStep) => {
  if (!pts || pts.length === 0) return [];
  const out = [pts[0]];
  const min2 = minStep * minStep;

  for (let i = 1; i < pts.length; i += 1) {
    const p = pts[i];
    const last = out[out.length - 1];
    if (dist2(p, last) >= min2) out.push(p);
  }
  return out;
};

// 等間隔にリサンプル（補正の安定化）
const resample = (pts, step) => {
  if (!pts || pts.length < 2) return pts || [];
  const s = Math.max(0.5, step);

  const out = [pts[0]];
  let acc = 0;

  for (let i = 1; i < pts.length; i += 1) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);

    if (seg === 0) continue;

    let t = 0;
    while (acc + seg * (1 - t) >= s) {
      const need = s - acc;
      const dt = need / seg;
      t += dt;

      const nx = a.x + (b.x - a.x) * t;
      const ny = a.y + (b.y - a.y) * t;
      out.push({ x: nx, y: ny });

      acc = 0;
    }
    acc += seg * (1 - t);
  }

  if (out.length < 2) out.push(pts[pts.length - 1]);
  else {
    const last = out[out.length - 1];
    const end = pts[pts.length - 1];
    if (dist2(last, end) > 0.25) out.push(end);
  }
  return out;
};

// Chaikin corner cutting（いきなり“補正感”が出る）
const chaikin = (pts, iterations = 2) => {
  if (!pts || pts.length < 3) return pts || [];
  let p = pts.slice();

  for (let it = 0; it < Math.max(1, iterations); it += 1) {
    const out = [p[0]];
    for (let i = 0; i < p.length - 1; i += 1) {
      const a = p[i];
      const b = p[i + 1];
      out.push({ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 });
      out.push({ x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 });
    }
    out.push(p[p.length - 1]);
    p = out;
  }
  return p;
};

// “ほぼ直線”なら直線に寄せる（参考アプリの挙動に近くなる）
const maybeSnapToLine = (pts, size) => {
  if (!pts || pts.length < 2) return pts || [];
  const a = pts[0];
  const b = pts[pts.length - 1];

  const direct = Math.hypot(b.x - a.x, b.y - a.y);
  if (direct < 10) return pts;

  const len = pathLength(pts);
  const lengthRatio = len / direct;

  let maxD2 = 0;
  for (let i = 1; i < pts.length - 1; i += 1) {
    maxD2 = Math.max(maxD2, pointToSegmentDist2(pts[i], a, b));
  }

  const maxD = Math.sqrt(maxD2);

  // ここを上げるほど「直線補正」が強くなる
  const devThresh = Math.max(1.2, size * 0.01); // 例: 360pxなら約3.6px

  // “ほぼ直線”条件：ふくらみが小さい + 回り道してない
  if (maxD <= devThresh && lengthRatio <= 1.08) {
    return [a, b];
  }
  return pts;
};

const drawSmoothPolyline = (ctx, pts) => {
  if (!ctx || !pts || pts.length === 0) return;

  if (pts.length === 1) {
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, Math.max(1, ctx.lineWidth / 2), 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);

  // mid-point quadratic（滑らか＆軽い）
  for (let i = 1; i < pts.length - 1; i += 1) {
    const midX = (pts[i].x + pts[i + 1].x) / 2;
    const midY = (pts[i].y + pts[i + 1].y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
  }

  const n = pts.length;
  ctx.quadraticCurveTo(pts[n - 2].x, pts[n - 2].y, pts[n - 1].x, pts[n - 1].y);
  ctx.stroke();
};

export default function KanjiStrokePage() {
  const navigate = useNavigate();
  const { level, char } = useParams();
  const lv = normalizeLevel(level);

  const practiceList = useMemo(() => {
    const data = DATA_BY_LEVEL[lv] || {};
    const list = Object.values(data).filter((k) => k && k.char);
    return list.slice(0, PRACTICE_COUNT);
  }, [lv]);

  const currentIndex = useMemo(() => {
    const idx = practiceList.findIndex((k) => k.char === char);
    return idx >= 0 ? idx : 0;
  }, [practiceList, char]);

  const currentKanji = practiceList[currentIndex] || null;

  const [paused, setPaused] = useState(false);
  const [showHintKanji, setShowHintKanji] = useState(false);

  const guideCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const wrapRef = useRef(null);

  const guideCtxRef = useRef(null);
  const drawCtxRef = useRef(null);

  const drawingRef = useRef(false);
  const hintDrawTokenRef = useRef(0);

  // strokes
  const currentStrokeRef = useRef([]);
  const strokesRef = useRef([]);

  const getHintFontFamily = () => readCssVar("--font-ja-serif", `"Noto Serif JP", serif`);

  const ensureHintFontLoaded = async (px = 120) => {
    if (typeof document === "undefined") return;
    if (!document.fonts?.load) return;
    try {
      const fam = getHintFontFamily();
      await document.fonts.load(`${HINT_FONT_WEIGHT} ${px}px ${firstFontFamily(fam)}`);
      await document.fonts.ready;
    } catch {
      // noop
    }
  };

  const goToIndex = (idx) => {
    const next = practiceList[idx];
    if (!next) return;
    navigate(`/kanji/stroke/${lv}/${next.char}`, { replace: true });
  };

  const onClose = () => navigate(-1);

  const clearDraw = () => {
    const c = drawCanvasRef.current;
    const ctx = drawCtxRef.current;
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  const clearGuide = () => {
    const c = guideCanvasRef.current;
    const ctx = guideCtxRef.current;
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  const applyDrawStyle = () => {
    const ctx = drawCtxRef.current;
    if (!ctx) return;

    const primary = readCssVar("--color-primary", "#0A84FF");
    const strokeWRaw = readCssVar("--kanji-stroke-width", "");
    const strokeW = Number.parseFloat(strokeWRaw) || 6;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeW;
    ctx.strokeStyle = primary;
  };

  const redrawAllStrokes = () => {
    const ctx = drawCtxRef.current;
    if (!ctx) return;
    clearDraw();
    applyDrawStyle();

    for (const stroke of strokesRef.current) {
      if (!stroke || stroke.length === 0) continue;
      drawSmoothPolyline(ctx, stroke);
    }
  };

  const smoothStroke = (rawPts) => {
    if (!rawPts || rawPts.length < 2) return rawPts || [];

    const wrap = wrapRef.current;
    const size = Math.floor(wrap?.getBoundingClientRect()?.width || 320);

    const ctx = drawCtxRef.current;
    const lw = Number(ctx?.lineWidth || 6);

    // ① 近すぎる点を捨てる（ノイズ削減）
    const filtered = filterMinDistance(rawPts, Math.max(0.6, lw * 0.22));

    // ② 等間隔へ（滑らかさが安定する）
    const step = Math.max(1.2, size * 0.006); // 例: 360px -> 2.1px
    const sampled = resample(filtered, step);

    // ③ Chaikin（補正感）
    const smooth = chaikin(sampled, 2);

    // ④ 直線っぽいなら直線に寄せる
    const snapped = maybeSnapToLine(smooth, size);

    return snapped;
  };

  const drawHintKanji = async () => {
    const token = ++hintDrawTokenRef.current;

    if (!showHintKanji || !currentKanji?.char) {
      clearGuide();
      return;
    }

    const wrap = wrapRef.current;
    const c = guideCanvasRef.current;
    const ctx = guideCtxRef.current;
    if (!wrap || !c || !ctx) return;

    const size = Math.floor(wrap.getBoundingClientRect()?.width || 320);
    const fontPx = Math.max(64, Math.floor(size * 0.72));

    await ensureHintFontLoaded(fontPx);
    if (token !== hintDrawTokenRef.current) return;

    ctx.clearRect(0, 0, c.width, c.height);

    const textColor = readCssVar("--color-text", "rgba(17,17,17,1)");
    const hintFamily = getHintFontFamily();

    ctx.save();
    ctx.globalAlpha = HINT_ALPHA;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${HINT_FONT_WEIGHT} ${fontPx}px ${hintFamily}`;
    ctx.fillText(currentKanji.char, size / 2, size / 2);
    ctx.restore();
  };

  const resizeCanvas = () => {
    const wrap = wrapRef.current;
    const g = guideCanvasRef.current;
    const d = drawCanvasRef.current;
    if (!wrap || !g || !d) return;

    const rect = wrap.getBoundingClientRect();
    const size = Math.max(1, Math.floor(rect.width));
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    // guide
    g.width = size * dpr;
    g.height = size * dpr;
    g.style.width = `${size}px`;
    g.style.height = `${size}px`;
    const gctx = g.getContext("2d");
    guideCtxRef.current = gctx;
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // draw
    d.width = size * dpr;
    d.height = size * dpr;
    d.style.width = `${size}px`;
    d.style.height = `${size}px`;
    const dctx = d.getContext("2d");
    drawCtxRef.current = dctx;
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    applyDrawStyle();
    redrawAllStrokes();
    drawHintKanji();
  };

  // route整合
  useEffect(() => {
    if (!practiceList.length) return;
    if (!char || !practiceList.some((k) => k.char === char)) {
      navigate(`/kanji/stroke/${lv}/${practiceList[0].char}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lv, char, practiceList.length]);

  // init + resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // kanji change
  useEffect(() => {
    setPaused(false);
    currentStrokeRef.current = [];
    strokesRef.current = [];
    clearDraw();
    applyDrawStyle();
    drawHintKanji();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKanji?.char]);

  // hint toggle
  useEffect(() => {
    drawHintKanji();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showHintKanji]);

  // theme toggle
  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      applyDrawStyle();
      redrawAllStrokes();
      drawHintKanji();
    });

    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPoint = (ev) => {
    const c = drawCanvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  };

  const start = (e) => {
    if (paused) return;
    const ctx = drawCtxRef.current;
    if (!ctx) return;

    e.preventDefault?.();

    try {
      e.currentTarget?.setPointerCapture?.(e.pointerId);
    } catch {
      // noop
    }

    drawingRef.current = true;
    currentStrokeRef.current = [];

    const { x, y } = getPoint(e);
    currentStrokeRef.current.push({ x, y });

    // ライブ描画（即レスポンス）
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawingRef.current || paused) return;
    const ctx = drawCtxRef.current;
    if (!ctx) return;

    e.preventDefault?.();

    const events = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [e];
    const pts = currentStrokeRef.current;

    const minStep = Math.max(0.6, (ctx.lineWidth || 6) * 0.22);

    for (const ev of events) {
      const { x, y } = getPoint(ev);
      const last = pts[pts.length - 1];
      if (last && dist2(last, { x, y }) < minStep * minStep) continue;

      pts.push({ x, y });
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const end = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault?.();
    drawingRef.current = false;

    const raw = currentStrokeRef.current || [];
    currentStrokeRef.current = [];

    if (raw.length < 1) return;

    const fixed = smoothStroke(raw);
    strokesRef.current = [...strokesRef.current, fixed];

    // ここで “補正後” を再描画（参考アプリっぽい）
    redrawAllStrokes();
  };

  const onNext = () => {
    const nextIndex = Math.min(practiceList.length - 1, currentIndex + 1);
    if (nextIndex === currentIndex) return;
    goToIndex(nextIndex);
  };

  const onSkip = () => onNext();

  const onErase = () => {
    currentStrokeRef.current = [];
    strokesRef.current = [];
    clearDraw();
    applyDrawStyle();
  };

  if (!currentKanji) return null;

  const progressText = `${currentIndex + 1}/${PRACTICE_COUNT}`;
  const progressPct = `${((currentIndex + 1) / PRACTICE_COUNT) * 100}%`;

  const meaning =
    currentKanji.meanings?.en?.[0] ||
    currentKanji.meaning?.en?.[0] ||
    currentKanji.meanings?.en ||
    "";

  return (
    <main className="ks-wrap" aria-label="Kanji Stroke Practice">
      <header className="ks-top">
        <button
          className="ks-ico"
          type="button"
          aria-label={paused ? "resume" : "pause"}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? "▶" : "Ⅱ"}
        </button>

        <div className="ks-progress" aria-label="progress">
          <div className="ks-progress-text">{progressText}</div>
          <div
            className="ks-bar"
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={PRACTICE_COUNT}
          >
            <div className="ks-bar-fill" style={{ width: progressPct }} />
          </div>
        </div>

        <button className="ks-ico" type="button" aria-label="close" onClick={onClose}>
          ×
        </button>
      </header>

      <section className="ks-title" aria-label="kanji title">
        <div className="ks-kanji">{currentKanji.char}</div>
        <div className="ks-meaning">{meaning}</div>
        <button className="ks-more" type="button">
          See more
        </button>
      </section>

      <section className="ks-board" aria-label="writing board">
        <div className="ks-canvas-wrap" ref={wrapRef}>
          <canvas
            ref={guideCanvasRef}
            aria-hidden="true"
            className="ks-canvas ks-canvas-guide"
          />

          <div className="ks-grid" aria-hidden="true">
            <div className="ks-grid-v" />
            <div className="ks-grid-h" />
          </div>

          <canvas
            ref={drawCanvasRef}
            className="ks-canvas ks-canvas-draw"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            onPointerLeave={end}
          />

          {paused && (
            <div className="ks-pause-overlay" aria-label="paused">
              <div className="ks-pause-pill">Paused</div>
            </div>
          )}
        </div>
      </section>

      <section className="ks-tools" aria-label="tools">
        <button className="ks-tool is-active" type="button" aria-label="erase" onClick={onErase}>
          ⌫
        </button>

        <button
          className={`ks-tool ${showHintKanji ? "" : "is-off"}`}
          type="button"
          aria-label="toggle hint kanji"
          onClick={() => setShowHintKanji((v) => !v)}
        >
          {showHintKanji ? "👁" : "🙈"}
        </button>
      </section>

      <footer className="ks-actions" aria-label="actions">
        <button className="ks-skip" type="button" onClick={onSkip}>
          Skip
        </button>
        <button className="ks-next" type="button" onClick={onNext}>
          Next
        </button>
      </footer>
    </main>
  );
}