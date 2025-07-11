import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserInfo {
    user_id: number;
    name: string;
    email: string;
    profile_uri?: string;
}

interface UserState {
    userInfo: UserInfo | null;
    setUserInfo: (info: UserInfo) => void;
    clearUserInfo: () => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userInfo: null,
            setUserInfo: (info) => set({ userInfo: info }),
            clearUserInfo: () => set({ userInfo: null }),
        }),
        {
            name: "user-session",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useUserStore;
