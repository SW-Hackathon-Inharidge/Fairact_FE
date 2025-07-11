type ContractInfoProps = {
    title: string;
    owner: string;
    worker: string;
};

export default function ContractInfo({ title, owner, worker }: ContractInfoProps) {
    return (
        <div className="flex flex-col flex-grow min-w-0 gap-1">
            <p className="font-bold text-xl truncate">{title}</p>
            <p className="text-blue-500 text-lg">{owner + ", " + worker}</p>
        </div>
    );
}
