import React, { useEffect, useRef } from "react";
import "../styles/DetailModal.css";

export default function DetailModal({
  open = false,
  onClose = () => {},
  title,
  content,
  footer,
}) {
  const backdropRef = useRef(null);

  // ESC で閉じる
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // バックドロップクリックで閉じる（中クリックは無効）
  const onBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="dm-backdrop"
      ref={backdropRef}
      onMouseDown={onBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="dm-modal" onMouseDown={(e) => e.stopPropagation()}>
        <header className="dm-header">
          <h3 className="dm-title">{title ?? "Detail"}</h3>
          <button className="dm-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="dm-body">
          {typeof content === "string" ? <p>{content}</p> : content}
        </div>

        {footer ? <footer className="dm-footer">{footer}</footer> : null}
      </div>
    </div>
  );
}
