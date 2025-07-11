import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { logoutUser } from "@/services/auth";
import useUserStore from "@/stores/useUserStore";
import shareIcon from "@/assets/icon/share.png";
import userIcon from "@/assets/icon/user.png";

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { userInfo } = useUserStore();

    const BASE_GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth";
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URL = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

    const GOOGLE_LOGIN_URL = `${BASE_GOOGLE_AUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URL}&response_type=code&scope=openid%20email%20profile&access_type=offline&state=fairact`;

    const BASE_KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const KAKAO_REDIRECT_URL = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    const KAKAO_LOGIN_URL = `${BASE_KAKAO_AUTH_URL}?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;

    const handleCopyLink = () => {
        const url = window.location.origin;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success("배포 링크가 복사되었습니다!");
            })
            .catch(() => {
                toast.error("복사에 실패했어요.");
            });
    };

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_LOGIN_URL;
    };

    const handleKaKaoLogin = () => {
        window.location.href = KAKAO_LOGIN_URL;
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            setIsModalOpen(false);
            toast.success("성공적으로 로그아웃 되었습니다.");
            navigate("/");
        } catch {
            toast.error("로그아웃 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-28 bg-white shadow z-50 flex items-center px-20 justify-between">
                <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate('/')}>
                    <img src="/logo.png" alt="logo" className="w-8 h-10" />
                    <h1 className="text-black text-4xl font-bold">Fairact</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div
                        className="w-12 h-12 px-3 py-2 bg-white rounded-2xl outline outline-2 outline-offset-[-2px] outline-neutral-400 flex justify-center items-center cursor-pointer hover:bg-gray-100"
                        onClick={handleCopyLink}
                    >
                        <img src={shareIcon} alt="공유" className="w-6 h-6" />
                    </div>

                    <div
                        className="w-12 h-12 rounded-full cursor-pointer overflow-hidden flex justify-center items-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <img
                            src={userInfo && userInfo.profile_uri ? userInfo.profile_uri : userIcon}
                            alt="프로필"
                            className="w-7 h-7 object-cover"
                        />
                    </div>
                </div>
            </header >

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="fixed flex bg-sky-700 top-28 right-20 z-50 rounded-lg shadow-lg p-8 gap-4 w-100">
                    {userInfo ? (
                        <>
                            <img
                                src={userInfo.profile_uri}
                                alt="프로필"
                                className="w-24 h-24 rounded-full object-cover"
                            />

                            <div className="flex flex-col gap-3 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex items-baseline gap-1">
                                        <p className="text-2xl font-bold m-0 p-0">{userInfo.name}</p>
                                        <p className="text-lg m-0 p-0">님</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="w-30 h-10 text-sm font-bold bg-white text-sky-700 rounded-full flex items-center justify-center gap-2 px-4 cursor-pointer hover:bg-gray-200 transition"
                                        onClick={handleLogout}
                                    >
                                        로그아웃
                                    </button>
                                </div>
                                <p className="truncate text-lg font-bold">{userInfo.email}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-white flex justify-center items-center rounded-full" />
                            {/* 오른쪽 버튼 그룹 */}
                            <div className="flex flex-col gap-3.5">
                                {/* 구글 로그인 버튼 */}
                                <button
                                    type="button"
                                    className="w-56 h-10 bg-white rounded-full flex items-center gap-2 px-4 cursor-pointer hover:bg-gray-100 transition"
                                    onClick={handleGoogleLogin}
                                >
                                    <img
                                        src="https://d1nuzc1w51n1es.cloudfront.net/d99d8628713bb69bd142.png"
                                        alt="Google logo"
                                        className="w-8 h-8"
                                    />
                                    <span className="font-semibold text-black text-base">Google로 시작하기</span>
                                </button>

                                {/* 카카오톡 로그인 버튼 */}
                                <button
                                    type="button"
                                    className="w-56 h-10 bg-[#FFE812] rounded-full flex items-center gap-2 px-4 cursor-pointer hover:bg-yellow-300 transition"
                                    onClick={handleKaKaoLogin}
                                >
                                    <img
                                        src="https://d1nuzc1w51n1es.cloudfront.net/c9b51919f15c93b05ae8.png"
                                        alt="KakaoTalk logo"
                                        className="w-8 h-8"
                                    />
                                    <span className="font-semibold text-black text-base">카카오로 시작하기</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
}
