import StatusIndicator from './StatusIndicator';
import ContractInfo from './ContractInfo';
import TimestampAndState from './TimestampAndState';

type ContractRowProps = {
    status: string;
    iconSrc: string;
    title: string;
    owner: string;
    worker: string;
    date: string;
    state: string;
};

export default function ContractRow({
    status,
    iconSrc,
    title,
    owner,
    worker,
    date,
    state,
}: ContractRowProps) {
    return (
        <div className="flex flex-row justify-between items-start w-full gap-12 p-2 border-b">
            <StatusIndicator status={status} iconSrc={iconSrc} />
            <ContractInfo title={title} owner={owner} worker={worker} />
            <TimestampAndState date={date} state={state} />
        </div>
    );
}
