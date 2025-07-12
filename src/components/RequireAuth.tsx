import { Navigate, useLocation } from "react-router-dom";
import { isLoggedInFromSession } from "@/utils/auth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    if (!isLoggedInFromSession()) {
        return (
            <Navigate
                to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                replace
            />
        );
    }

    return children;
}
