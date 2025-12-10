// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

import { useAppStore } from "@/store/useAppStore";
import { db, auth } from "@/firebase/firebase-config";
import "@/styles/Profile.css";

/* =======================
   内蔵アバター（写真なし）
   - 追加したいときは AVATAR_LIST に1行足すだけ
======================= */
const AVATAR_LIST = [
  { key: "panda", label: "Panda" },
  { key: "jellyfish", label: "Jellyfish" },
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "rabbit", label: "Rabbit" },
  { key: "fox", label: "Fox" },
  { key: "bear", label: "Bear" },
  { key: "koala", label: "Koala" },
  { key: "penguin", label: "Penguin" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "owl", label: "Owl" },
];

function AvatarGlyph({ name = "panda", size = 72 }) {
  const n = String(name || "panda").toLowerCase();

  // 共通スタイル（線の太さ・角丸）
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  // ざっくりでも “統一感” 重視のミニマルSVG
  // ※必要なら後で各アイコンを同じテイストで描き直して増やせる
  const render = () => {
    switch (n) {
      case "jellyfish":
        return (
          <>
            <path {...common} d="M64 86c0-28 22-50 48-50s48 22 48 50" />
            <path {...common} d="M64 86c10 16 30 26 48 26s38-10 48-26" />
            <path {...common} d="M84 120c0 22-8 36-8 52" />
            <path {...common} d="M104 122c0 24-6 38-6 56" />
            <path {...common} d="M120 122c0 26 0 40 0 58" />
            <path {...common} d="M136 122c0 24 6 38 6 56" />
            <path {...common} d="M156 120c0 22 8 36 8 52" />
          </>
        );
      case "cat":
        return (
          <>
            <path {...common} d="M72 90l12-20 18 14" />
            <path {...common} d="M168 90l-12-20-18 14" />
            <path {...common} d="M72 94c0-22 22-40 48-40s48 18 48 40" />
            <path {...common} d="M72 94c0 34 20 56 48 56s48-22 48-56" />
            <path {...common} d="M100 114h0" />
            <path {...common} d="M140 114h0" />
            <path {...common} d="M116 132c4 4 20 4 24 0" />
            <path {...common} d="M86 128l-18 6" />
            <path {...common} d="M86 136l-18 10" />
            <path {...common} d="M170 128l18 6" />
            <path {...common} d="M170 136l18 10" />
          </>
        );
      case "dog":
        return (
          <>
            <path {...common} d="M80 92c-16 8-22 22-22 40" />
            <path {...common} d="M160 92c16 8 22 22 22 40" />
            <path {...common} d="M74 98c6-26 26-44 46-44s40 18 46 44" />
            <path {...common} d="M74 98c0 40 18 62 46 62s46-22 46-62" />
            <path {...common} d="M108 118h0" />
            <path {...common} d="M132 118h0" />
            <path {...common} d="M112 138c8 6 16 6 24 0" />
            <path {...common} d="M120 140v10" />
          </>
        );
      case "rabbit":
        return (
          <>
            <path {...common} d="M96 52c-10 14-10 34 0 48" />
            <path {...common} d="M144 52c10 14 10 34 0 48" />
            <path {...common} d="M76 104c8-28 28-46 44-46s36 18 44 46" />
            <path {...common} d="M76 104c0 34 18 54 44 54s44-20 44-54" />
            <path {...common} d="M106 118h0" />
            <path {...common} d="M134 118h0" />
            <path {...common} d="M116 136c4 4 20 4 24 0" />
          </>
        );
      case "fox":
        return (
          <>
            <path {...common} d="M70 108c8-30 30-50 50-50s42 20 50 50" />
            <path {...common} d="M70 108c0 34 20 54 50 54s50-20 50-54" />
            <path {...common} d="M88 92l-14-18" />
            <path {...common} d="M168 92l14-18" />
            <path {...common} d="M104 120h0" />
            <path {...common} d="M152 120h0" />
            <path {...common} d="M118 140c10 6 20 6 30 0" />
          </>
        );
      case "bear":
        return (
          <>
            <path {...common} d="M92 66c-10 0-18 8-18 18" />
            <path {...common} d="M164 66c10 0 18 8 18 18" />
            <path {...common} d="M78 104c6-30 28-50 50-50s44 20 50 50" />
            <path {...common} d="M78 104c0 36 18 58 50 58s50-22 50-58" />
            <path {...common} d="M106 120h0" />
            <path {...common} d="M150 120h0" />
            <path {...common} d="M116 142c8 6 16 6 24 0" />
          </>
        );
      case "koala":
        return (
          <>
            <path {...common} d="M86 82c-10 0-18 8-18 18s8 18 18 18" />
            <path {...common} d="M170 82c10 0 18 8 18 18s-8 18-18 18" />
            <path {...common} d="M84 108c6-30 26-50 44-50s38 20 44 50" />
            <path {...common} d="M84 108c0 32 16 52 44 52s44-20 44-52" />
            <path {...common} d="M112 120h0" />
            <path {...common} d="M140 120h0" />
            <path {...common} d="M120 130c0 10 16 10 16 0s-16-10-16 0z" />
          </>
        );
      case "penguin":
        return (
          <>
            <path {...common} d="M92 78c10-16 26-24 36-24s26 8 36 24" />
            <path {...common} d="M92 78c-8 14-12 30-12 48 0 32 18 54 48 54s48-22 48-54c0-18-4-34-12-48" />
            <path {...common} d="M106 128h0" />
            <path {...common} d="M150 128h0" />
            <path {...common} d="M124 150c6 4 12 4 18 0" />
          </>
        );
      case "lion":
        return (
          <>
            <path {...common} d="M74 110c6-34 30-54 54-54s48 20 54 54" />
            <path {...common} d="M74 110c0 34 22 54 54 54s54-20 54-54" />
            <path {...common} d="M96 86c10-10 20-16 32-16s22 6 32 16" />
            <path {...common} d="M108 122h0" />
            <path {...common} d="M148 122h0" />
            <path {...common} d="M118 142c10 6 20 6 30 0" />
          </>
        );
      case "tiger":
        return (
          <>
            <path {...common} d="M78 108c8-32 30-52 50-52s42 20 50 52" />
            <path {...common} d="M78 108c0 34 20 54 50 54s50-20 50-54" />
            <path {...common} d="M96 96l-10-12" />
            <path {...common} d="M160 96l10-12" />
            <path {...common} d="M106 120h0" />
            <path {...common} d="M150 120h0" />
            <path {...common} d="M120 142c8 6 16 6 24 0" />
            <path {...common} d="M92 132l-16 8" />
            <path {...common} d="M164 132l16 8" />
          </>
        );
      case "owl":
        return (
          <>
            <path {...common} d="M88 96c8-22 22-38 40-38s32 16 40 38" />
            <path {...common} d="M88 96c0 38 14 64 40 64s40-26 40-64" />
            <path {...common} d="M106 114c0 10 16 10 16 0s-16-10-16 0z" />
            <path {...common} d="M134 114c0 10 16 10 16 0s-16-10-16 0z" />
            <path {...common} d="M128 138c6 4 12 4 18 0" />
          </>
        );
      case "panda":
      default:
        return (
          <>
            <path {...common} d="M86 86c-12 0-22 10-22 22" />
            <path {...common} d="M170 86c12 0 22 10 22 22" />
            <path {...common} d="M74 108c6-30 28-50 54-50s48 20 54 50" />
            <path {...common} d="M74 108c0 34 18 56 54 56s54-22 54-56" />
            <path {...common} d="M104 120c0 10 16 10 16 0s-16-10-16 0z" />
            <path {...common} d="M136 120c0 10 16 10 16 0s-16-10-16 0z" />
            <path {...common} d="M118 142c10 6 20 6 30 0" />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-label={n}
      className="pf__avatarSvg"
    >
      {/* 背景円 */}
      <circle cx="120" cy="120" r="112" className="pf__avatarBg" />
      <g transform="translate(0,0)">{render()}</g>
    </svg>
  );
}

/* =======================
   内蔵コンポーネント
======================= */

/** レベル概要（Lvピル + 進捗バー + 数値） */
function LevelSummary({ xp }) {
  const level = xp?.level ?? 1;
  const label = xp?.levelLabel ?? "N5";
  const percent = Math.max(0, Math.min(100, xp?.percent ?? 0));
  const into = xp?.into ?? 0;
  const need = xp?.need ?? 0;

  return (
    <div className="pf__lv" role="group" aria-label="学習レベル">
      <div className="pf__lvLeft">
        <span className="pf__lvChip" aria-label={`レベル ${level}`}>
          Lv {level}
        </span>
        <span className="pf__lvSep" aria-hidden>
          •
        </span>
        <span className="pf__lvLabel" aria-label={`目標級 ${label}`}>
          {label}
        </span>
      </div>

      <div className="pf__lvRight" aria-label="進捗">
        <div
          className="pf__lvBar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
          aria-label="レベル進捗"
        >
          <div className="pf__lvFill" style={{ width: `${percent}%` }}>
            <span className="pf__lvShine" aria-hidden />
          </div>
        </div>
        <span className="pf__lvMeta" aria-label={`次のレベルまで ${into}/${need}`}>
          {into}/{need}（{percent}%）
        </span>
      </div>
    </div>
  );
}

/** ストリーク・バッジ（🔥 + 今日済みドット） */
function StreakBadge({
  current = 0,
  best = 0,
  todayMarked = false,
  className = "",
}) {
  return (
    <div
      className={`pf__streak ${className}`}
      role="status"
      aria-live="polite"
      title={`最長 ${best} 日`}
    >
      <span className="pf__streakFlame" aria-hidden>
        🔥
      </span>
      <span className="pf__streakCount" aria-label={`連続${current}日`}>
        {current}
      </span>
      {todayMarked ? <span className="pf__streakDot" aria-label="今日カウント済み" /> : null}
    </div>
  );
}

/** 統計カード */
function StatCard({ label, value, aria }) {
  return (
    <div className="stat" role="group" aria-label={aria || label}>
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

/** iOS風トグル */
function Toggle({ label, checked, onChange, disabled }) {
  return (
    <label className="toggle" aria-label={label}>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle__label">{label}</span>
      <span className="toggle__switch" aria-hidden />
    </label>
  );
}

/** 編集モーダル */
function EditProfileModal({ initial, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(initial);

  useEffect(() => setForm(initial), [initial]);

  const set = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} aria-hidden />
      <div
        className="modal__body"
        role="dialog"
        aria-modal="true"
        aria-label="プロフィール編集"
      >
        <h3 className="modal__title">プロフィール編集</h3>

        <label className="field">
          <span>表示名</span>
          <input
            value={form.displayName}
            onChange={(e) => set("displayName", e.target.value.slice(0, 32))}
            placeholder="例: まい"
            aria-label="表示名"
          />
        </label>

        <label className="field">
          <span>目標レベル</span>
          <select
            value={form.jlptTarget}
            onChange={(e) => set("jlptTarget", e.target.value)}
            aria-label="目標レベル"
          >
            {["N5", "N4", "N3", "N2", "N1"].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>自己紹介（140字）</span>
          <textarea
            value={form.bio}
            onChange={(e) => set("bio", e.target.value.slice(0, 140))}
            rows={3}
            placeholder="学習の目標や自己紹介を書いてね"
            aria-label="自己紹介"
          />
          <div className="hint">{(form.bio || "").length}/140</div>
        </label>

        <div className="modal__actions">
          <button className="btn" onClick={onClose} disabled={saving}>
            キャンセル
          </button>
          <button
            className="btn btn--primary"
            onClick={() => onSubmit?.(form)}
            disabled={saving}
          >
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** アバター選択モーダル（写真なし） */
function AvatarPickerModal({ currentKey, onClose, onPick, saving }) {
  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} aria-hidden />
      <div
        className="modal__body"
        role="dialog"
        aria-modal="true"
        aria-label="アバターを選択"
      >
        <h3 className="modal__title">アイコンを選ぶ</h3>

        <div className="pf__avatarGrid" role="radiogroup" aria-label="アイコン一覧">
          {AVATAR_LIST.map((a) => {
            const selected = a.key === currentKey;
            return (
              <button
                key={a.key}
                type="button"
                className={`pf__avatarItem ${selected ? "is-selected" : ""}`}
                onClick={() => onPick?.(a.key)}
                disabled={saving}
                role="radio"
                aria-checked={selected}
                aria-label={a.label}
              >
                <span className="pf__avatarRing" aria-hidden="true">
                  <AvatarGlyph name={a.key} size={56} />
                </span>
                <span className="pf__avatarLabel">{a.label}</span>
              </button>
            );
          })}
        </div>

        <div className="modal__actions">
          <button className="btn" onClick={onClose} disabled={saving}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   本体
======================= */

export default function ProfilePage() {
  const navigate = useNavigate();

  /* ---- Zustand ---- */
  const user = useAppStore((s) => s.user);
  const avatarKey = useAppStore((s) => s.avatarKey || "panda");
  const setAvatarKey = useAppStore((s) => s.setAvatarKey);
  const xp = useAppStore((s) => s.xp);
  const daily = useAppStore((s) => s.daily);
  const resetStore = useAppStore((s) => s.resetAll || s.hardReset || null);

  /* ---- Local state ---- */
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  /* ---- Firestoreからプロフィール読込 ---- */
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!user) {
        if (alive) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (!alive) return;

        const data = snap.exists() ? snap.data() : {};

        if (data.avatarKey) setAvatarKey(data.avatarKey);

        setProfile(data);
      } catch (e) {
        console.error("Failed to load profile:", e);
        if (alive) setProfile({});
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user, setAvatarKey]);

  /* ---- 部分更新保存（未作成でもOK） ---- */
  const saveProfile = useCallback(
    async (partial) => {
      if (!user) return;
      setSaving(true);
      try {
        const ref = doc(db, "users", user.uid);
        const patch = { ...partial, updatedAt: serverTimestamp() };
        await setDoc(ref, patch, { merge: true });
        setProfile((prev) => ({ ...(prev || {}), ...partial }));
      } catch (e) {
        console.error("Failed to save profile:", e);
      } finally {
        setSaving(false);
      }
    },
    [user],
  );

  /* ---- アバター変更 ---- */
  const handleAvatarClick = () => {
    setAvatarOpen(true);
  };

  const handlePickAvatar = async (key) => {
    const next = String(key || "panda");
    setAvatarKey?.(next);
    await saveProfile({ avatarKey: next });
    setAvatarOpen(false);
  };

  /* ---- ログアウト（iPhone対策でタイムアウト付き） ---- */
  const handleLogout = useCallback(async () => {
    try {
      await Promise.race([
        signOut(auth),
        new Promise((resolve) => setTimeout(resolve, 8000)),
      ]);
    } catch (e) {
      console.warn("[LOGOUT ERROR]", e);
    } finally {
      resetStore?.();
      navigate("/auth", { replace: true });
    }
  }, [navigate, resetStore]);

  /* ---- 早期リターン ---- */
  if (loading) {
    return <div className="profile__loading">読み込み中…</div>;
  }
  if (!user || profile === null) {
    return (
      <div className="profile__empty">
        プロフィールが見つかりません。ログイン状態を確認してください。
      </div>
    );
  }

  /* ---- 表示用値 ---- */
  const stats = profile.stats || {};
  const privacy = {
    showInRanking: true,
    showStreakPublic: true,
    ...(profile.privacy || {}),
  };

  const totalXP =
    typeof profile.xpTotal === "number"
      ? profile.xpTotal
      : typeof stats.totalXP === "number"
      ? stats.totalXP
      : 0;

  const streakCurrent = Math.max(0, daily?.streak ?? 0);
  const bestStreak =
    typeof stats.bestStreak === "number" ? stats.bestStreak : streakCurrent;

  const todayMarked =
    (daily?.wordsDone ?? 0) >= (daily?.targetWords ?? Infinity) &&
    (daily?.quizzesDone ?? 0) >= (daily?.targetQuizzes ?? Infinity);

  const lessonsCompleted =
    typeof stats.lessonsCompleted === "number" ? stats.lessonsCompleted : 0;

  /* ---- Render ---- */
  return (
    <main className="profile">
      {/* Header */}
      <section className="profile__header">
        <button
          type="button"
          className="avatar-btn"
          onClick={handleAvatarClick}
          aria-label="プロフィール画像（変更）"
          aria-haspopup="dialog"
          aria-expanded={avatarOpen ? "true" : "false"}
        >
          <div className="avatar avatar--tile">
            <AvatarGlyph name={avatarKey} size={72} />
          </div>
        </button>

        <div className="profile__id">
          <h1 className="profile__name">
            {profile.displayName || user.displayName || "ユーザー"}
          </h1>
          {profile.username && (
            <div className="profile__handle">@{profile.username}</div>
          )}
          <div className="profile__target">目標: {profile.jlptTarget || "未設定"}</div>
        </div>

        <div className="profile__headerRight">
          <LevelSummary xp={xp} />
          <StreakBadge current={streakCurrent} best={bestStreak} todayMarked={todayMarked} />
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setEditingProfile(true)}
            disabled={saving}
          >
            編集
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="profile__stats" aria-label="学習統計">
        <StatCard label="合計XP" value={totalXP} />
        <StatCard label="連続日数" value={streakCurrent} />
        <StatCard label="完了レッスン" value={lessonsCompleted} />
      </section>

      {/* Bio */}
      <section className="profile__section">
        <h2 className="profile__sectionTitle">自己紹介</h2>
        <p className="profile__bio">{profile.bio || "自己紹介は未設定です。"}</p>
      </section>

      {/* Privacy */}
      <section className="profile__section">
        <h2 className="profile__sectionTitle">公開設定</h2>
        <div className="profile__toggles">
          <Toggle
            label="ランキングに表示する"
            checked={!!privacy.showInRanking}
            onChange={(v) => saveProfile({ privacy: { ...privacy, showInRanking: v } })}
            disabled={saving}
          />
          <Toggle
            label="連続日数を公開する"
            checked={!!privacy.showStreakPublic}
            onChange={(v) => saveProfile({ privacy: { ...privacy, showStreakPublic: v } })}
            disabled={saving}
          />
        </div>
      </section>

      {/* Logout */}
      <section className="profile__section profile__logoutSection">
        <button
          type="button"
          className="btn btn--danger profile__logoutBtn"
          onClick={handleLogout}
        >
          🔒 Log Out
        </button>
      </section>

      {/* Avatar Modal */}
      {avatarOpen && (
        <AvatarPickerModal
          currentKey={avatarKey}
          saving={saving}
          onClose={() => setAvatarOpen(false)}
          onPick={handlePickAvatar}
        />
      )}

      {/* Edit Modal */}
      {editingProfile && (
        <EditProfileModal
          initial={{
            displayName: profile.displayName || user.displayName || "",
            bio: profile.bio || "",
            jlptTarget: profile.jlptTarget || "N5",
          }}
          saving={saving}
          onClose={() => setEditingProfile(false)}
          onSubmit={async (vals) => {
            await saveProfile(vals);
            setEditingProfile(false);
          }}
        />
      )}
    </main>
  );
}