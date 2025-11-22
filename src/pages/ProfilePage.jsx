// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";

import { useAppStore } from "@/store/useAppStore";
import { db, auth } from "@/firebase/firebase-config";
import JellyfishLogo from "@/components/avatars/JellyfishLogo";
import "../styles/Profile.css";

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
        <span
          className="pf__lvMeta"
          aria-label={`次のレベルまで ${into}/${need}`}
        >
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
      {todayMarked ? (
        <span className="pf__streakDot" aria-label="今日カウント済み" />
      ) : null}
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

/* =======================
   本体
======================= */

export default function ProfilePage() {
  const navigate = useNavigate();

  /* ---- Zustand ---- */
  const user = useAppStore((s) => s.user);
  const avatarKey = useAppStore((s) => s.avatarKey || "jellyfish");
  const setAvatarKey = useAppStore((s) => s.setAvatarKey);
  const xp = useAppStore((s) => s.xp);
  const daily = useAppStore((s) => s.daily);
  const resetStore = useAppStore((s) => s.resetAll || s.hardReset || null);

  /* ---- Local state ---- */
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

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
        const snap = await getDoc(doc(db, "users", user.uid));
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

  /* ---- 部分更新保存 ---- */
  const saveProfile = useCallback(
    async (partial) => {
      if (!user) return;
      setSaving(true);
      try {
        const ref = doc(db, "users", user.uid);
        const patch = { ...partial, updatedAt: serverTimestamp() };
        await updateDoc(ref, patch);
        setProfile((prev) => ({ ...(prev || {}), ...partial }));
      } catch (e) {
        console.error("Failed to save profile:", e);
      } finally {
        setSaving(false);
      }
    },
    [user],
  );

  /* ---- アバター変更（将来拡張） ---- */
  const handleAvatarClick = () => {
    console.log("avatarKey:", avatarKey);
  };

  /* ---- ログアウト（iPhone対策でタイムアウト付き） ---- */
  const handleLogout = useCallback(async () => {
    console.log("[LOGOUT] start");
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
      console.log("[LOGOUT] done (forced navigate)");
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
  const AvatarIcon = JellyfishLogo;

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
    typeof stats.lessonsCompleted === "number"
      ? stats.lessonsCompleted
      : 0;

  /* ---- Render ---- */
  return (
    <main className="profile">
      {/* Header */}
      <section className="profile__header">
        <button
          className="avatar-btn"
          onClick={handleAvatarClick}
          aria-label="プロフィール画像"
        >
          <div className="avatar avatar--tile">
            <AvatarIcon size={72} />
          </div>
        </button>

        <div className="profile__id">
          <h1 className="profile__name">
            {profile.displayName || user.displayName || "ユーザー"}
          </h1>
          {profile.username && (
            <div className="profile__handle">@{profile.username}</div>
          )}
          <div className="profile__target">
            目標: {profile.jlptTarget || "未設定"}
          </div>
        </div>

        <div className="profile__headerRight">
          <LevelSummary xp={xp} />
          <StreakBadge
            current={streakCurrent}
            best={bestStreak}
            todayMarked={todayMarked}
          />
          <button
            className="btn btn--primary"
            onClick={() => setEditingProfile(true)}
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
        <p className="profile__bio">
          {profile.bio || "自己紹介は未設定です。"}
        </p>
      </section>

      {/* Privacy */}
      <section className="profile__section">
        <h2 className="profile__sectionTitle">公開設定</h2>
        <div className="profile__toggles">
          <Toggle
            label="ランキングに表示する"
            checked={!!privacy.showInRanking}
            onChange={(v) =>
              saveProfile({
                privacy: { ...privacy, showInRanking: v },
              })
            }
            disabled={saving}
          />
          <Toggle
            label="連続日数を公開する"
            checked={!!privacy.showStreakPublic}
            onChange={(v) =>
              saveProfile({
                privacy: { ...privacy, showStreakPublic: v },
              })
            }
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