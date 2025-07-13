type StatusIndicatorProps = {
    status: string;
    iconSrc: string;
};

export default function StatusIndicator({ status, iconSrc }: StatusIndicatorProps) {
    return (
        <div className="flex flex-row items-center gap-2 min-w-fit">
            <img src={iconSrc} className="w-5 h-5" />
            <p
                className={`text-lg font-bold ${status === "완료" ? "text-[#00D123] px-2" : "text-blue-500"
                    }`}
            >
                {status}
            </p>
        </div>
    );
}
