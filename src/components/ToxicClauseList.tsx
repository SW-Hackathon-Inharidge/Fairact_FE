import ToxicClause from "@/components/ToxicClause";
import { Clause } from "@/services/contract";
import { useEffect, useState } from "react";

interface ToxicClauseListProps {
    title: string;
    clauses: Clause[] | null;
    onAllChecked: (checked: boolean) => void;
    isSigned: boolean
}

export default function ToxicClauseList({ title, clauses, onAllChecked, isSigned }: ToxicClauseListProps) {
    const safeClauses = clauses ?? [];
    const [checkedStates, setCheckedStates] = useState<boolean[]>(() =>
        Array(safeClauses.length).fill(false)
    );

    useEffect(() => {
        const allChecked = checkedStates.every((v) => v);
        onAllChecked(allChecked);
    }, [checkedStates, onAllChecked]);

    const handleCheckChange = (index: number, checked: boolean) => {
        const newStates = [...checkedStates];
        newStates[index] = checked;
        setCheckedStates(newStates);
    };

    return (
        <aside className="w-1/5 bg-blue-500 flex-shrink-0 pt-28 px-8 flex flex-col items-center h-screen">
            <p className="text-white text-2xl font-bold pt-12 text-center truncate w-full max-w-full">
                {title}
            </p>
            <p className="text-white text-sm p-6">
                독소조항 주의 항목은 미리 업로드 된 계약서 상의 조항을 살펴보고 주의를 주는 것이므로,
                누락된 부분이 있을 수 있습니다. 이 외에 다른 조항도 다시 한 번 확인하시길 바랍니다.
            </p>

            <div className="overflow-y-auto flex-1 w-full pr-2 py-4 pb-40 mt-24 mb-8 flex flex-col gap-24">
                {safeClauses.map((clause, index) => (
                    <ToxicClause
                        key={index}
                        reason={clause.reason}
                        description={clause.suggestion}
                        confirmText="아래 내용을 확인하고 이해했습니다"
                        checked={checkedStates[index]}
                        onCheck={(checked) => handleCheckChange(index, checked)}
                        hideCheckbox={isSigned}
                    />
                ))}
            </div>
        </aside>
    );
}
