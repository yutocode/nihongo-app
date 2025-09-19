import { useAppStore } from "../store/useAppStore";
import { useNavigate } from "react-router-dom";

export default function LevelSelectPage() {
  const setLevel = useAppStore((s) => s.setLevel);
  const nav = useNavigate();

  const choose = (lv) => {
    setLevel(lv);           // 'n5' でも 'N5' でもOK
    nav("/home", { replace: true });   // ← 右側のホームに即戻す
  };

  return (
    <div className="level-page">
      <h2>レベルを選んでください</h2>
      <div className="row">
        <button onClick={() => choose("n5")}>N5</button>
        <button onClick={() => choose("n4")}>N4</button>
        <button onClick={() => choose("n3")}>N3</button>
        <button onClick={() => choose("n2")}>N2</button>
        <button onClick={() => choose("n1")}>N1</button>
      </div>
    </div>
  );
}
