import ToxicClause from "@/components/ToxicClause";
import { UploadContractResponse } from "@/services/contract";
import { useEffect, useState } from "react";

interface ToxicClauseListProps {
    contract: UploadContractResponse;
    onAllChecked: (checked: boolean) => void;
    isSigned: boolean;
    hoveredClauseText?: string | null;
}

export default function ToxicClauseList({ contract, onAllChecked, isSigned, hoveredClauseText }: ToxicClauseListProps) {
    const safeClauses = Array.isArray(contract.clauses) ? contract.clauses : [];

    const [checkedStates, setCheckedStates] = useState<boolean[]>(() =>
        Array(safeClauses.length).fill(false)
    );

    useEffect(() => {
        setCheckedStates(Array(safeClauses.length).fill(false));
    }, [contract.clauses]);

    useEffect(() => {
        const allChecked = checkedStates.every((v) => v);
        onAllChecked(allChecked);
    }, [checkedStates, onAllChecked]);

    useEffect(() => {
        if (!hoveredClauseText) return;

        const element = document.getElementById(`clause-${hoveredClauseText}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [hoveredClauseText]);

    const handleCheckChange = (index: number, checked: boolean) => {
        const newStates = [...checkedStates];
        newStates[index] = checked;
        setCheckedStates(newStates);
    };

    return (
        <aside className="w-1/4 bg-blue-500 flex-shrink-0 pt-28 px-8 flex flex-col items-center h-screen">
            <p className="text-white text-2xl font-bold pt-12 text-center truncate w-full max-w-full">
                {contract.title}
            </p>
            <p className="text-white text-sm p-6">
                독소조항 주의 항목은 미리 업로드 된 계약서 상의 조항을 살펴보고 주의를 주는 것이므로,
                누락된 부분이 있을 수 있습니다. 이 외에 다른 조항도 다시 한 번 확인하시길 바랍니다.
            </p>

            <div className="overflow-y-auto flex-1 w-full pr-2 py-4 pb-40 mt-24 mb-8 flex flex-col gap-24">
                {safeClauses.map((clause, index) => (
                    <div key={index} id={`clause-${clause.clause?.text ?? `unknown-${index}`}`}>
                        <ToxicClause
                            text={clause.clause?.text ?? ""}
                            reason={clause.reason}
                            suggestion={clause.suggestion}
                            confirmText="아래 내용을 확인하고 이해했습니다"
                            checked={checkedStates[index] ?? false}
                            onCheck={(checked) => handleCheckChange(index, checked)}
                            hideCheckbox={isSigned}
                        />
                    </div>
                ))}

            </div>
        </aside>
    );
}
