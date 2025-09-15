import SectionTile from "../components/SectionTile.jsx";
import { useProgressStore } from "../store/useProgressStore.jsx";

const N5_CATEGORIES = [
  { key: "particles",  label: "助詞" },
  { key: "verbForms",  label: "動詞變化" },
  { key: "adjectives", label: "形容詞" },
  { key: "existHave",  label: "存在／擁有" },
  { key: "comparison", label: "比較與程度" },
  { key: "intention",  label: "意圖・計劃・推測" },
  { key: "request",    label: "請求・許可" },
  { key: "basicsEtc",  label: "其他基礎" },
];

export default function GrammarHub() {
  const sections = useProgressStore((s) => s.sections?.n5 || {}); // n5配下に保存する想定
  return (
    <div style={{ padding:"1rem" }}>
      {N5_CATEGORIES.map((c) => {
        const stat = sections[c.key] || { answered: 0, total: 0 };
        return (
          <SectionTile
            key={c.key}
            label={c.label}
            answered={stat.answered || 0}
            total={stat.total || 0}
            onClick={() => /* 既存の遷移 */ {}}
          />
        );
      })}
    </div>
  );
}
