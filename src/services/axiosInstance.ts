import axios from "axios";

const userAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

const contractAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_CONTRACT_URL,
    headers: { "Content-Type": "application/json" },
});

const plainAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

const pendingRequests = new Map<string, AbortController>();

function getRequestKey(config: any): string {
    const { method, url, params, data } = config;
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
}

function setupInterceptors(instance: typeof userAxiosInstance | typeof contractAxiosInstance) {
    instance.interceptors.request.use((config) => {
        const key = getRequestKey(config);
        if (pendingRequests.has(key)) {
            return Promise.reject(new axios.Cancel(`중복 요청 차단됨: ${key}`));
        }

        const controller = new AbortController();
        config.signal = controller.signal;
        pendingRequests.set(key, controller);

        const token = sessionStorage.getItem("access_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    instance.interceptors.response.use(
        (response) => {
            const key = getRequestKey(response.config);
            pendingRequests.delete(key);
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            const key = getRequestKey(originalRequest);

            pendingRequests.delete(key);

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                const newToken = await refreshAccessToken();
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return instance(originalRequest);
                } else {
                    sessionStorage.clear();
                    window.location.href = "/";
                }
            }

            return Promise.reject(error);
        }
    );
}

async function refreshAccessToken(): Promise<string | null> {
    const accessToken = sessionStorage.getItem("access_token");
    const refreshToken = sessionStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) return null;

    try {
        const response = await plainAxios.post("/user/auth/refresh", {
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
    } catch (error) {
        console.error("토큰 리프레시 실패:", error);
        return null;
    }
}

setupInterceptors(userAxiosInstance);
setupInterceptors(contractAxiosInstance);

export { userAxiosInstance, contractAxiosInstance };
