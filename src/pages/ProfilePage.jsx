import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import "./../styles/Profile.css";

export default function ProfilePage() {
  const user = useAppStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [p, setP] = useState(null);      // profile
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) return;
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!alive) return;
        setP(snap.exists() ? snap.data() : {});
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [user]);

  const onSave = async (partial) => {
    if (!user) return;
    setSaving(true);
    try {
      const next = { ...p, ...partial, updatedAt: serverTimestamp() };
      await updateDoc(doc(db, "users", user.uid), next);
      setP((prev) => ({ ...prev, ...partial }));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile__loading">読み込み中…</div>;
  if (!p) return <div className="profile__empty">プロフィールが見つかりません</div>;

  const stats = p.stats || {};
  const privacy = p.privacy || {};

  return (
    <main className="profile">
      {/* Header */}
      <section className="profile__header">
        <button
          className="avatar-btn"
          onClick={() => setEditing(true)}
          aria-label="プロフィール画像を変更"
        >
          {p.avatarUrl ? (
            <img src={p.avatarUrl} alt="avatar" className="avatar" />
          ) : (
            <div className="avatar avatar--placeholder">😀</div>
          )}
        </button>

        <div className="profile__id">
          <h1 className="profile__name">{p.displayName || "ユーザー"}</h1>
          {p.username && <div className="profile__handle">@{p.username}</div>}
          <div className="profile__target">目標: {p.jlptTarget || "未設定"}</div>
        </div>

        <button className="btn btn--primary" onClick={() => setEditing(true)}>
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
        <p className="profile__bio">{p.bio || "自己紹介は未設定です。"}</p>
      </section>

      {/* Privacy */}
      <section className="profile__section">
        <h2>公開設定</h2>
        <Toggle
          label="ランキングに表示する"
          checked={!!privacy.showInRanking}
          onChange={(v) => onSave({ privacy: { ...privacy, showInRanking: v } })}
          disabled={saving}
        />
        <Toggle
          label="連続日数を公開する"
          checked={!!privacy.showStreakPublic}
          onChange={(v) => onSave({ privacy: { ...privacy, showStreakPublic: v } })}
          disabled={saving}
        />
      </section>

      {editing && (
        <EditModal
          initial={{
            displayName: p.displayName || "",
            bio: p.bio || "",
            jlptTarget: p.jlptTarget || "N5",
          }}
          onClose={() => setEditing(false)}
          onSubmit={(vals) => onSave(vals)}
          saving={saving}
        />
      )}
    </main>
  );
}

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

function EditModal({ initial, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <div className="modal">
      <div className="modal__body">
        <h3>プロフィール編集</h3>

        <label className="field">
          <span>表示名</span>
          <input
            value={form.displayName}
            onChange={(e) => set("displayName", e.target.value.slice(0, 32))}
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
            onChange={(e) => set("bio", e.target.value.slice(0, 140))}
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
      <div className="modal__backdrop" onClick={onClose} />
    </div>
  );
}
