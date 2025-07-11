type StatusIndicatorProps = {
    status: string;
    iconSrc: string;
};

export default function StatusIndicator({ status, iconSrc }: StatusIndicatorProps) {
    return (
        <div className="flex flex-row items-center gap-2 min-w-fit">
            <img src={iconSrc} className="w-5 h-5" />
            <p className="text-blue-500 text-lg font-bold">{status}</p>
        </div>
    );
}
