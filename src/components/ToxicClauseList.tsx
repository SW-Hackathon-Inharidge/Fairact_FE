import ToxicClause from "@/components/ToxicClause";

interface ToxicClauseListProps {
  title: string;
}

export default function ToxicClauseList({ title }: ToxicClauseListProps) {
  return (
    <>
      <aside className="w-80 bg-blue-500 flex-shrink-0 pt-28 px-6 flex flex-col items-center h-screen">
        <p className="text-white text-2xl font-bold pt-12 text-center truncate">{title}</p>
        <p className="text-white text-sm p-7">
          독소조항 주의 항목은 미리 업로드 된 계약서 상의 조항을 살펴보고 주의를 주는 것이므로,
          누락된 부분이 있을 수 있습니다. 이 외에 다른 조항도 다시 한 번 확인하시길 바랍니다.
        </p>

        <div className="overflow-y-auto flex-1 w-full pr-2 py-4 pb-40 mt-24 mb-8 flex flex-col gap-24">
          <ToxicClause
            title="월 급여에는 제반 법정수당이 포함되어 있다."
            description="임금 항목에 기본금, 연장, 야간, 휴일근로수당을 명확히 기재할 것을 요구하세요."
            confirmText="아래 내용을 확인하고 이해했습니다"
          />
          <ToxicClause
            title="월 급여에는 제반 법정수당이 포함되어 있다."
            description="임금 항목에 기본금, 연장, 야간, 휴일근로수당을 명확히 기재할 것을 요구하세요."
            confirmText="아래 내용을 확인하고 이해했습니다"
          />
        </div>
      </aside>
    </>
  );
}
