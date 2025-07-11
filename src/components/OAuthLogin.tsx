import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOAuthCode } from "@/services/auth";

interface OAuthLoginProps {
    provider: string;
}

export default function OAuthLogin({provider} : OAuthLoginProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code && provider) {
      sendOAuthCode(provider as "google" | "kakao", code)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.error("OAuth 로그인 실패", err);
        });
    }
  }, []);

  return <p>로그인 처리 중입니다...</p>;
}