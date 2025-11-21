import React, { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";

export default function AppleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        navigate("/home");
      } else {
        navigate("/auth"); // 失敗したらログインへ戻す
      }
    };

    check();
  }, [navigate]);

  return <div>Loading...</div>;
}