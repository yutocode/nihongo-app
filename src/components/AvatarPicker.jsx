// src/components/AvatarPicker.jsx
import React, { useEffect, useCallback } from "react";
import { ANIMAL_ICON_MAP } from "./avatars/AnimalIcons";

const AVATAR_KEYS = Object.keys(ANIMAL_ICON_MAP);

/**
 * AvatarPicker
 * - 白黒の動物アイコンを選ぶモーダル
 * - 表示/非表示は親コンポーネントから制御
 */
const AvatarPicker = ({ open, value, onChange, onClose }) => {
  // 非表示のときは何も描画しない
  if (!open) return null;

  // Escapeキーで閉じる
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // アバター選択
  const handleSelect = useCallback(
    (key) => {
      if (!key) return;
      onChange?.(key); // 親側で setAvatarKey とモーダルcloseをやる
    },
    [onChange]
  );

  const handleBackdropClick = () => {
    onClose?.();
  };

  const stop = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      aria-hidden="true"
    >
      <div
        className="modal-panel"
        onClick={stop}
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-picker-title"
      >
        <h3 id="avatar-picker-title">アバターを選ぶ</h3>

        <div className="avatar-grid">
          {AVATAR_KEYS.map((key) => {
            const Icon = ANIMAL_ICON_MAP[key];
            const isActive = value === key;
            return (
              <button
                key={key}
                type="button"
                className={
                  "avatar-choice" + (isActive ? " is-active" : "")
                }
                onClick={() => handleSelect(key)}
                aria-label={key}
              >
                <Icon size={40} />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="avatar-close"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default AvatarPicker;
