// src/components/AuthGuard.jsx
import { Navigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

const AuthGuard = ({ children }) => {
  const user = useAppStore((state) => state.user);
  const authReady = useAppStore((state) => state.authReady);
  const setXPTotal = useAppStore((state) => state.setXPTotal);
  const setAuthReady = useAppStore((state) => state.setAuthReady);

  useEffect(() => {
    const loadUserXP = async () => {
      if (user) {
        try {
          const xpRef = doc(db, "users", user.uid);
          const xpSnap = await getDoc(xpRef);
          if (xpSnap.exists()) {
            const data = xpSnap.data();
            if (typeof data.totalXP === "number") {
              setXPTotal(data.totalXP);
            }
          }
        } catch (error) {
          console.error("XPデータ読み込み失敗:", error);
        }
      }
      setAuthReady(true);
    };

    // ユーザーが確定したらXP読み込み
    if (user !== null && !authReady) {
      loadUserXP();
    }
  }, [user, authReady, setXPTotal, setAuthReady]);

  // 認証確認中はローディング
  if (!authReady) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;

