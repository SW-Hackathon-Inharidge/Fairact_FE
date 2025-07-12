import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { sendOAuthCode } from "@/services/auth";

interface OAuthLoginProps {
  provider: "google" | "kakao";
}

export default function OAuthLogin({ provider }: OAuthLoginProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    const redirectTo = sessionStorage.getItem("postLoginRedirect") || "/";

    if (code) {
      sendOAuthCode(provider, code)
        .then(() => {
          sessionStorage.removeItem("postLoginRedirect");
          navigate(redirectTo, { replace: true });
        })
        .catch((err) => {
          console.error("OAuth 로그인 실패", err);
        });
    }
  }, [location.search, navigate, provider]);

  return <p>로그인 처리 중입니다...</p>;
}
