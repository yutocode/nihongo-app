// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import JellyfishLogo from "@/components/avatars/JellyfishLogo";

import "./../styles/Profile.css";

export default function ProfilePage() {
  const user = useAppStore((s) => s.user);
  const avatarKey = useAppStore((s) => s.avatarKey || "jellyfish");
  const setAvatarKey = useAppStore((s) => s.setAvatarKey);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  // プロフィール読み込み
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!alive) return;

        const data = snap.exists() ? snap.data() : {};

        // FirestoreにavatarKeyがあればZustandにも反映
        if (data.avatarKey) {
          setAvatarKey(data.avatarKey);
        }

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

  // プロフィール保存（名前・自己紹介など）
  const saveProfile = useCallback(
    async (partial) => {
      if (!user || !profile) return;
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
    [user, profile]
  );

  // アバター変更（今は Jellyfish 1種類だが将来拡張を想定）
  const handleAvatarClick = () => {
    // ここで将来 AvatarPicker を開くなどの処理を入れられる
    // 今は固定なので何もしない or コメントアウト
    // 例: setAvatarPicking(true);
  };

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

  const stats = profile.stats || {};
  const privacy = profile.privacy || {};
  const AvatarIcon = JellyfishLogo; // 将来 avatarKey に応じて切り替えたくなったらここを拡張

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

        <button
          className="btn btn--primary"
          onClick={() => setEditingProfile(true)}
        >
          編集
        </button>
      </section>

      {/* Stats */}
      <section className="profile__stats">
        <StatCard label="合計XP" value={stats.totalXP ?? 0} />
        <StatCard label="連続日数" value={stats.streakDays ?? 0} />
        <StatCard label="完了レッスン" value={stats.lessonsCompleted ?? 0} />
      </section>

      {/* Bio */}
      <section className="profile__section">
        <h2>自己紹介</h2>
        <p className="profile__bio">
          {profile.bio || "自己紹介は未設定です。"}
        </p>
      </section>

      {/* Privacy */}
      <section className="profile__section">
        <h2>公開設定</h2>
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
      </section>

      {/* Edit Modal */}
      {editingProfile && (
        <EditProfileModal
          initial={{
            displayName:
              profile.displayName || user.displayName || "",
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

/* ==== Sub components ==== */

function StatCard({ label, value }) {
  return (
    <div className="stat">
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

function Toggle({ label, checked, onChange, disabled }) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
}

function EditProfileModal({ initial, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) =>
    setForm((s) => ({
      ...s,
      [k]: v,
    }));

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__body" role="dialog" aria-modal="true">
        <h3>プロフィール編集</h3>

        <label className="field">
          <span>表示名</span>
          <input
            value={form.displayName}
            onChange={(e) =>
              set("displayName", e.target.value.slice(0, 32))
            }
            placeholder="例: まい"
          />
        </label>

        <label className="field">
          <span>目標レベル</span>
          <select
            value={form.jlptTarget}
            onChange={(e) => set("jlptTarget", e.target.value)}
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
            onChange={(e) =>
              set("bio", e.target.value.slice(0, 140))
            }
            rows={3}
            placeholder="学習の目標や自己紹介を書いてね"
          />
          <div className="hint">{form.bio.length}/140</div>
        </label>

        <div className="modal__actions">
          <button className="btn" onClick={onClose} disabled={saving}>
            キャンセル
          </button>
          <button
            className="btn btn--primary"
            onClick={() => onSubmit(form)}
            disabled={saving}
          >
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
