import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";

export function isLoggedInFromCookie(): boolean {
    const cookie = document.cookie;
    return cookie.includes("auth=true");
}

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");

    const userName = "김인하";
    const userMail = "kiminha@kakao.com";

    useEffect(() => {
        setIsLoggedIn(isLoggedInFromCookie());
    }, []);

    function handleCopyLink() {
        const url = window.location.origin;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success("배포 링크가 복사되었습니다!");
            })
            .catch(() => {
                toast.error("복사에 실패했어요.");
            });
    }

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-28 bg-white shadow z-50 flex items-center px-20 justify-between">
                <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="logo" className="w-8 h-10" />
                    <h1 className="text-black text-4xl font-bold">Fairact</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div
                        className="w-12 h-12 px-3 py-2 bg-white rounded-2xl outline outline-2 outline-offset-[-2px] outline-neutral-400 flex justify-center items-center cursor-pointer hover:bg-gray-100"
                        onClick={handleCopyLink}
                    >
                        <img src="./src/assets/icon/share.png" alt="공유" className="w-6 h-6" />
                    </div>

                    <div
                        className="w-12 h-12 rounded-full cursor-pointer overflow-hidden flex justify-center items-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <img
                            src={isLoggedIn && profileUrl ? profileUrl : "./src/assets/icon/user.png"}
                            alt="프로필"
                            className="w-7 h-7 object-cover"
                        />
                    </div>
                </div>
            </header>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="fixed flex bg-sky-700 top-28 right-20 z-50 rounded-lg shadow-lg p-8 gap-4 w-100">
                    {isLoggedIn ? (
                        <>
                            <img
                                src={profileUrl}
                                alt="프로필"
                                className="w-24 h-24 rounded-full object-cover"
                            />

                            <div className="flex flex-col gap-3 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex items-baseline gap-1">
                                        <p className="text-2xl font-bold m-0 p-0">{userName}</p>
                                        <p className="text-lg m-0 p-0">님</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="w-30 h-10 text-sm font-bold bg-white text-sky-700 rounded-full flex items-center justify-center gap-2 px-4 cursor-pointer hover:bg-gray-200 transition"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                                <p className="truncate text-lg font-bold">{userMail}</p>
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
                                >
                                    <img
                                        src="https://d1nuzc1w51n1es.cloudfront.net/c9b51919f15c93b05ae8.png"
                                        alt="KakaoTalk logo"
                                        className="w-8 h-8"
                                    />
                                    <span className="font-semibold text-black text-base">카카오톡으로 시작하기</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
}
