import { useEffect, useState } from "react";
import Loader from "@/assets/icon/loader.png";

export default function Loading({ phrase }: { phrase: string }) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev === "") return ".";
                if (prev === ".") return "..";
                if (prev === "..") return "...";
                return "";
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center gap-6">
            <img src={Loader} alt="로딩 중" className="w-12 h-12 animate-spin" />
            <p className="text-zinc-700 text-xl font-semibold">
                {phrase}
                <span>{dots}</span>
            </p>
        </div>
    );
}
