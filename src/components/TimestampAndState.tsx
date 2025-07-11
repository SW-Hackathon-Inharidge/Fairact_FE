type TimestampAndStateProps = {
    date: string;
    state: string;
};

export default function TimestampAndState({ date, state }: TimestampAndStateProps) {
    return (
        <div className="flex flex-col items-end text-right text-sm whitespace-nowrap">
            <p className="text-gray-500 text-lg">{date}</p>
            <p className="text-blue-500 text-lg font-bold">{state}</p>
        </div>
    );
}
