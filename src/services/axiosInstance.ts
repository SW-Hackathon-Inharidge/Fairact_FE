import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

async function refreshAccessToken() {
    const accessToken = sessionStorage.getItem("access_token");
    const refreshToken = sessionStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) {
        return null;
    }

    try {
        const response = await axiosInstance.post("/user/auth/refresh", {
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;
        if (newAccessToken) {
            sessionStorage.setItem("access_token", newAccessToken);
            if (newRefreshToken) {
                sessionStorage.setItem("refresh_token", newRefreshToken);
            }
            return newAccessToken;
        }
        return null;
    } catch {
        return null;
    }
}

// 요청 인터셉터: 매 요청마다 access_token 헤더 추가
axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 응답 인터셉터: 401 발생 시 토큰 갱신 후 재시도
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이면서, 재시도한 적 없는 요청에 대해서만 처리
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshAccessToken();

            if (newToken) {
                // 새 토큰으로 Authorization 헤더 업데이트
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                // 원래 요청 다시 실행
                return axiosInstance(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
