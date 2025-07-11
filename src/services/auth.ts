import { userAxiosInstance } from "@/services/axiosInstance";
import useUserStore from "@/stores/useUserStore";

export async function sendOAuthCode(provider: "google" | "kakao", code: string) {
    try {
        const response = await userAxiosInstance.post(`/user/oauth/${provider}?code=${code}`);

        const { access_token, refresh_token } = response.data.token;
        const userInfo = response.data.userInfo;

        sessionStorage.setItem("access_token", access_token);
        sessionStorage.setItem("refresh_token", refresh_token);
        const { setUserInfo } = useUserStore.getState();
        setUserInfo(userInfo);

        return response.data;
    } catch (err) {
        console.error("OAuth 요청 실패:", err);
        throw err;
    }
}

export async function logoutUser() {
    const access_token = sessionStorage.getItem("access_token");
    const refresh_token = sessionStorage.getItem("refresh_token");

    if (!access_token || !refresh_token) {
        console.warn("토큰이 없어서 로그아웃할 수 없습니다.");
        return;
    }

    try {
        const response = await userAxiosInstance.post('/user/logout', {
            access_token,
            refresh_token,
        });

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        const { clearUserInfo } = useUserStore.getState();
        clearUserInfo();

        return response.data;
    } catch (err) {
        console.error("로그아웃 요청 실패:", err);
        throw err;
    }
}