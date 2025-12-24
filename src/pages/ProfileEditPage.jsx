// src/pages/ProfileEditPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import CatAvatar, { AVATAR_PART_KEYS, isPartKey } from "@/components/ui/CatAvatar/CatAvatar";
import "@/styles/ProfileEdit.css";

/* ---------- Icons ---------- */
function IconBack(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M15 18l-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M20 6L9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- constants ---------- */
const SESSION_USER_STORAGE_KEY = "nihongoapp_session_user";
const PROFILE_STORAGE_KEY = "nihongoapp_profile";

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function normalizeKey(key, fallback = "base") {
  const k = String(key || "");
  return isPartKey(k) ? k : fallback;
}

function readLocalProfile() {
  if (typeof window === "undefined") return null;

  const pRaw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  const p = pRaw ? safeJsonParse(pRaw) : null;

  const sRaw = window.localStorage.getItem(SESSION_USER_STORAGE_KEY);
  const s = sRaw ? safeJsonParse(sRaw) : null;

  // 旧キー互換：avatarVariant が残ってたら head/body 両方に採用
  const legacy = (p && p.avatarVariant) || (s && s.avatarVariant) || "base";

  const headKey = normalizeKey((p && p.avatarHeadKey) || (s && s.avatarHeadKey) || legacy, "base");
  const bodyKey = normalizeKey((p && p.avatarBodyKey) || (s && s.avatarBodyKey) || legacy, "base");

  return {
    displayName: (p && p.displayName) || (s && s.displayName) || (s && s.email) || "",
    avatarHeadKey: headKey,
    avatarBodyKey: bodyKey,
  };
}

export default function ProfileEditPage() {
  const navigate = useNavigate();

  const user = useAppStore((s) => s.user);
  const profile = useAppStore((s) => s.profile);

  const storeInitial = useMemo(() => {
    const displayName = profile?.displayName || user?.displayName || "";

    const legacy = profile?.avatarVariant || user?.avatarVariant || "base";
    const headKey = normalizeKey(profile?.avatarHeadKey || user?.avatarHeadKey || legacy, "base");
    const bodyKey = normalizeKey(profile?.avatarBodyKey || user?.avatarBodyKey || legacy, "base");

    return { displayName, avatarHeadKey: headKey, avatarBodyKey: bodyKey };
  }, [
    profile?.displayName,
    profile?.avatarHeadKey,
    profile?.avatarBodyKey,
    profile?.avatarVariant,
    user?.displayName,
    user?.avatarHeadKey,
    user?.avatarBodyKey,
    user?.avatarVariant,
  ]);

  const initialRef = useRef({ displayName: "", avatarHeadKey: "base", avatarBodyKey: "base" });

  const [displayName, setDisplayName] = useState(storeInitial.displayName);
  const [avatarHeadKey, setAvatarHeadKey] = useState(storeInitial.avatarHeadKey);
  const [avatarBodyKey, setAvatarBodyKey] = useState(storeInitial.avatarBodyKey);
  const [saving, setSaving] = useState(false);

  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const local = readLocalProfile();
    const nextName = String(storeInitial.displayName || local?.displayName || "").trim();

    const nextHead = normalizeKey(storeInitial.avatarHeadKey || local?.avatarHeadKey, "base");
    const nextBody = normalizeKey(storeInitial.avatarBodyKey || local?.avatarBodyKey, "base");

    initialRef.current = { displayName: nextName, avatarHeadKey: nextHead, avatarBodyKey: nextBody };
    setDisplayName(nextName);
    setAvatarHeadKey(nextHead);
    setAvatarBodyKey(nextBody);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const touchedRef = useRef(false);
  const onNameChange = (v) => {
    touchedRef.current = true;
    setDisplayName(v);
  };
  const onHeadChange = (k) => {
    touchedRef.current = true;
    setAvatarHeadKey(normalizeKey(k, "base"));
  };
  const onBodyChange = (k) => {
    touchedRef.current = true;
    setAvatarBodyKey(normalizeKey(k, "base"));
  };

  useEffect(() => {
    if (touchedRef.current) return;

    const n = String(storeInitial.displayName || "").trim();
    const h = normalizeKey(storeInitial.avatarHeadKey, "base");
    const b = normalizeKey(storeInitial.avatarBodyKey, "base");

    initialRef.current = { displayName: n, avatarHeadKey: h, avatarBodyKey: b };
    setDisplayName(n);
    setAvatarHeadKey(h);
    setAvatarBodyKey(b);
  }, [storeInitial.displayName, storeInitial.avatarHeadKey, storeInitial.avatarBodyKey]);

  const canSave = useMemo(() => {
    const n = String(displayName || "").trim();
    const init = initialRef.current;

    const changed =
      n !== String(init.displayName || "").trim() ||
      avatarHeadKey !== init.avatarHeadKey ||
      avatarBodyKey !== init.avatarBodyKey;

    return n.length >= 1 && n.length <= 24 && changed && !saving;
  }, [displayName, avatarHeadKey, avatarBodyKey, saving]);

  const persistLocal = (nextUser, nextProfile) => {
    try {
      const raw = window.localStorage.getItem(SESSION_USER_STORAGE_KEY);
      const parsed = raw ? safeJsonParse(raw) : null;
      const merged = parsed ? { ...parsed, ...nextUser } : nextUser;
      window.localStorage.setItem(SESSION_USER_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // noop
    }

    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    } catch {
      // noop
    }
  };

  const handleSave = async () => {
    const name = String(displayName || "").trim();
    if (!name) return;

    const headToSave = normalizeKey(avatarHeadKey, "base");
    const bodyToSave = normalizeKey(avatarBodyKey, "base");

    setSaving(true);
    try {
      const st = useAppStore.getState?.();
      const prevProfile = st?.profile || {};
      const prevUser = st?.user || {};

      const nextProfile = {
        ...prevProfile,
        displayName: name,
        avatarHeadKey: headToSave,
        avatarBodyKey: bodyToSave,

        // 旧キー互換：他ページが avatarVariant を参照しても壊れないように残す
        avatarVariant: headToSave,
      };

      const nextUser = {
        ...prevUser,
        displayName: name,
        avatarHeadKey: headToSave,
        avatarBodyKey: bodyToSave,
        avatarVariant: headToSave,
      };

      if (typeof st?.setProfile === "function") st.setProfile(nextProfile);
      else if (typeof st?.updateProfile === "function") st.updateProfile(nextProfile);
      else if (typeof useAppStore.setState === "function") {
        useAppStore.setState({ profile: nextProfile, user: nextUser });
      }

      persistLocal(nextUser, nextProfile);

      initialRef.current = { displayName: name, avatarHeadKey: headToSave, avatarBodyKey: bodyToSave };
      touchedRef.current = false;

      navigate("/profile", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  // 表示順（あなたの並びに固定）
  const partKeys = useMemo(() => AVATAR_PART_KEYS.filter((k) => isPartKey(k)), []);

  return (
    <main className="pfe" role="main" aria-label="プロフィール編集">
      <header className="pfe__top" aria-label="上部ナビゲーション">
        <button type="button" className="pfe__iconBtn" onClick={() => navigate(-1)} aria-label="戻る">
          <IconBack className="pfe__iconSvg" />
        </button>

        <div className="pfe__titleWrap">
          <div className="pfe__title">プロフィール編集</div>
          <div className="pfe__subtitle">名前とアバターを変更できます</div>
        </div>

        <button
          type="button"
          className="pfe__saveBtn"
          onClick={handleSave}
          disabled={!canSave}
          aria-disabled={!canSave}
          aria-label="保存"
        >
          <IconCheck className="pfe__saveSvg" />
          <span className="pfe__saveText">{saving ? "保存中…" : "保存"}</span>
        </button>
      </header>

      <section className="pfe__card" aria-label="プレビュー">
        <div className="pfe__preview">
          <div className="pfe__previewAvatar" aria-label="アバタープレビュー">
            <CatAvatar
              headKey={avatarHeadKey}
              bodyKey={avatarBodyKey}
              part="full"
              title="avatar preview"
              className="pfe__previewCat"
            />
          </div>

          <div className="pfe__previewText">
            <div className="pfe__previewName" title={displayName || "名前未設定"}>
              {String(displayName || "").trim() || "名前未設定"}
            </div>
            <div className="pfe__previewHint" aria-live="polite">
              {saving ? "保存しています…" : "保存するとプロフィールに反映されます"}
            </div>
          </div>
        </div>
      </section>

      <form
        className="pfe__stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSave) return;
          handleSave();
        }}
      >
        <section className="pfe__card" aria-label="名前">
          <label className="pfe__label" htmlFor="displayName">
            名前
          </label>
          <div className="pfe__field">
            <input
              id="displayName"
              className="pfe__input"
              value={displayName}
              onChange={(e) => onNameChange(e.target.value)}
              inputMode="text"
              autoComplete="name"
              maxLength={24}
              placeholder="例：田中太郎"
              aria-describedby="displayNameHelp"
            />
          </div>
          <div id="displayNameHelp" className="pfe__help">
            1〜24文字（空白のみは不可）
          </div>
        </section>

        {/* ===== 頭 ===== */}
        <section className="pfe__card" aria-label="アバター（頭）">
          <div className="pfe__row">
            <div>
              <div className="pfe__label">頭（首から上）</div>
              <div className="pfe__help">タップして選択</div>
            </div>
          </div>

          <div className="pfe__grid" role="radiogroup" aria-label="頭の種類">
            {partKeys.map((key) => {
              const selected = key === avatarHeadKey;
              return (
                <button
                  key={`head-${key}`}
                  type="button"
                  className={["pfe__variant", selected ? "is-selected" : ""].join(" ")}
                  onClick={() => onHeadChange(key)}
                  role="radio"
                  aria-checked={selected}
                  aria-label={`頭 ${key}`}
                >
                  <span className="pfe__variantInner" aria-hidden="true">
                    <CatAvatar
                      headKey={key}
                      bodyKey={avatarBodyKey}
                      part="head"
                      title={`head ${key}`}
                      className="pfe__variantCat"
                    />
                  </span>
                  <span className="pfe__srOnly">{selected ? "選択中" : "未選択"}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ===== 体 ===== */}
        <section className="pfe__card" aria-label="アバター（体）">
          <div className="pfe__row">
            <div>
              <div className="pfe__label">体（首から下）</div>
              <div className="pfe__help">タップして選択</div>
            </div>
          </div>

          <div className="pfe__grid" role="radiogroup" aria-label="体の種類">
            {partKeys.map((key) => {
              const selected = key === avatarBodyKey;
              return (
                <button
                  key={`body-${key}`}
                  type="button"
                  className={["pfe__variant", selected ? "is-selected" : ""].join(" ")}
                  onClick={() => onBodyChange(key)}
                  role="radio"
                  aria-checked={selected}
                  aria-label={`体 ${key}`}
                >
                  <span className="pfe__variantInner" aria-hidden="true">
                    <CatAvatar
                      headKey={avatarHeadKey}
                      bodyKey={key}
                      part="body"
                      title={`body ${key}`}
                      className="pfe__variantCat"
                    />
                  </span>
                  <span className="pfe__srOnly">{selected ? "選択中" : "未選択"}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="pfe__bottom">
          <button type="submit" className="pfe__primary" disabled={!canSave} aria-disabled={!canSave}>
            {saving ? "保存中…" : "保存して戻る"}
          </button>

          <button type="button" className="pfe__ghost" onClick={() => navigate(-1)} aria-label="キャンセル">
            キャンセル
          </button>
        </div>
      </form>
    </main>
  );
}