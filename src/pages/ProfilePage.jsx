// src/pages/ProfilePage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import CatAvatar from "@/components/ui/CatAvatar/CatAvatar";
import "@/styles/Profile.css";

/* ---------- Icons (original SVG set) ---------- */
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

function IconPencil(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3L16.5 4a2 2 0 0 0-3 0L3 14.5V20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6.5l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconRibbon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M8 3h8l-1.2 6H9.2L8 3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 9l-2.5 10 4-2 2.5 2L12 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 9l2.5 10-4-2-2.5 2L12 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.001"
      />
    </svg>
  );
}

function IconBolt(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M13 2L4 14h7l-1 8 10-14h-7l0-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFlame(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 22c4 0 7-2.9 7-7 0-3-2-5.2-3.6-6.9-.9-1-1.6-2-1.8-3.2C11.2 6 10 7.7 9.5 9c-.6 1.5-2.5 2.7-2.5 6 0 4.1 3 7 5 7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 22c2.5 0 4.5-1.9 4.5-4.6 0-1.8-1.1-3-2-4.1-.4-.5-.8-1-1-1.6-.9.8-1.7 2-2 3-.4 1.2-1.5 1.9-1.5 3.8 0 2.6 1.8 3.5 2 3.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

function IconMedal(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M8 3h3l1 3 1-3h3l-2 6H10L8 3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="15"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 12.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3.9-1.8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- UI parts ---------- */
function StatBadge({ tone = "neutral", icon }) {
  return (
    <div className={`pf__statBadge pf__statBadge--${tone}`} aria-hidden="true">
      {icon}
    </div>
  );
}

function StatCard({ badge, value, label }) {
  return (
    <div className="pf__statCard" role="group" aria-label={label}>
      <div className="pf__statBadgeWrap">{badge}</div>
      <div className="pf__statValue">{value}</div>
      <div className="pf__statLabel">{label}</div>
    </div>
  );
}

function JlptRow({ level, label, value }) {
  return (
    <div
      className="pf__jlptRow"
      role="group"
      aria-label={`${level} ${label} ${value}%`}
    >
      <div className="pf__jlptLeft">
        <div className="pf__jlptLevel">{level}</div>
        <div className="pf__jlptLabel">{label}</div>
      </div>

      <div className="pf__jlptBarWrap" aria-hidden="true">
        <div className="pf__jlptBarTrack">
          <div className="pf__jlptBarFill" style={{ width: `${value}%` }} />
        </div>
      </div>

      <div className="pf__jlptPct">{value}%</div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();

  const user = useAppStore((s) => s.user);
  const xp = useAppStore((s) => s.xp);
  const daily = useAppStore((s) => s.daily);
  const ranking = useAppStore((s) => s.ranking);
  const profile = useAppStore((s) => s.profile);

  const name = profile?.displayName || user?.displayName || "田中太郎";
  const email = user?.email || profile?.email || "tanaka.taro@example.com";

  const level = xp?.level ?? profile?.level ?? 12;
  const xpTotal = xp?.totalXP ?? xp?.totalXp ?? profile?.xpTotal ?? 8450;
  const streak = daily?.streak ?? profile?.streak ?? 47;
  const rank = ranking?.myRank ?? profile?.rank ?? 156;

  const avatarVariant = profile?.avatarVariant || user?.avatarVariant || "cream";

  const avatarText = useMemo(() => {
    const s = String(name || " ").trim();
    if (!s) return "田";
    return s.slice(0, 1);
  }, [name]);

  return (
    <main className="pf" role="main" aria-label="プロフィール">
      <header className="pf__top" aria-label="プロフィール上部">
        <button
          type="button"
          className="pf__iconBtn"
          onClick={() => navigate(-1)}
          aria-label="戻る"
        >
          <IconBack className="pf__iconSvg" />
        </button>

        <div className="pf__identity" aria-label="ユーザー情報">
          <div className="pf__avatar" aria-label="プロフィール画像">
            <CatAvatar
              variant={avatarVariant}
              size="fill"
              title={`${name} avatar`}
              className="pf__catAvatar"
              aria-label="プロフィールアバター"
            />
            <span className="pf__avatarFallback" aria-hidden="true">
              {avatarText}
            </span>
          </div>

          <div className="pf__who">
            <div className="pf__name" title={name}>
              {name}
            </div>
            <div className="pf__email" title={email}>
              {email}
            </div>
          </div>

          <button
            type="button"
            className="pf__editBtn"
            onClick={() => navigate("/profile/edit")}
            aria-label="プロフィールを編集"
          >
            <IconPencil className="pf__editSvg" />
            <span className="pf__editText">編集</span>
          </button>
        </div>
      </header>

      <section className="pf__stats" aria-label="ステータス">
        <StatCard
          badge={
            <StatBadge
              tone="success"
              icon={<IconRibbon className="pf__badgeSvg" />}
            />
          }
          value={`Lv ${level}`}
          label="レベル"
        />
        <StatCard
          badge={
            <StatBadge
              tone="neutral"
              icon={<IconBolt className="pf__badgeSvg" />}
            />
          }
          value={Number(xpTotal).toLocaleString()}
          label="XP"
        />
        <StatCard
          badge={
            <StatBadge
              tone="success"
              icon={<IconFlame className="pf__badgeSvg" />}
            />
          }
          value={`${streak}日`}
          label="連続学習"
        />
        <StatCard
          badge={
            <StatBadge
              tone="neutral"
              icon={<IconMedal className="pf__badgeSvg" />}
            />
          }
          value={`${rank}位`}
          label="ランキング"
        />
      </section>

      <section className="pf__jlpt" aria-label="JLPT進捗">
        <h2 className="pf__jlptTitle">JLPT進捗</h2>

        <div className="pf__jlptList" role="list">
          <JlptRow level="N5" label="初級" value={100} />
          <JlptRow level="N4" label="初中級" value={85} />
          <JlptRow level="N3" label="中級" value={52} />
          <JlptRow level="N2" label="中上級" value={18} />
          <JlptRow level="N1" label="上級" value={0} />
        </div>
      </section>
    </main>
  );
}