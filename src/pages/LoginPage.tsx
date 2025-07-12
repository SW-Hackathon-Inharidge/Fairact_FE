export default function LoginPage() {
    const redirect = location.search ? new URLSearchParams(location.search).get("redirect") || "/" : "/";
    
    const BASE_GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth";
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URL = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

    const GOOGLE_LOGIN_URL = `${BASE_GOOGLE_AUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URL}&response_type=code&scope=openid%20email%20profile&access_type=offline&state=fairact`;

    const BASE_KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const KAKAO_REDIRECT_URL = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    const KAKAO_LOGIN_URL = `${BASE_KAKAO_AUTH_URL}?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;

    const handleGoogleLogin = () => {
        sessionStorage.setItem("postLoginRedirect", redirect);
        window.location.href = GOOGLE_LOGIN_URL;
    };

    const handleKaKaoLogin = () => {
        sessionStorage.setItem("postLoginRedirect", redirect);
        window.location.href = KAKAO_LOGIN_URL;
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white px-4">
            <h1 className="text-4xl font-extrabold mb-12 text-gray-800">FairAct에 로그인하기</h1>
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-72 h-14 bg-white rounded-full flex items-center gap-4 px-6 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                aria-label="Google 로그인"
            >
                <img
                    src="https://d1nuzc1w51n1es.cloudfront.net/d99d8628713bb69bd142.png"
                    alt="Google logo"
                    className="w-8 h-8"
                />
                <span className="font-semibold text-gray-900 text-lg">Google로 시작하기</span>
            </button>

            <button
                type="button"
                onClick={handleKaKaoLogin}
                className="w-72 h-14 mt-6 bg-[#FFE812] rounded-full flex items-center gap-4 px-6 shadow-md cursor-pointer hover:bg-yellow-300 transition-colors"
                aria-label="카카오톡 로그인"
            >
                <img
                    src="https://d1nuzc1w51n1es.cloudfront.net/c9b51919f15c93b05ae8.png"
                    alt="KakaoTalk logo"
                    className="w-8 h-8"
                />
                <span className="font-semibold text-gray-900 text-lg">카카오로 시작하기</span>
            </button>
        </div>
    );
}
