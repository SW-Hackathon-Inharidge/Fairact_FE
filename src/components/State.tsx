type StateProps = {
    beforeAccept: number;
    beforeSign: number;
    complete: number;
};

export default function State({
    beforeAccept, beforeSign, complete
}: StateProps) {
    return (
        <>
            <div className="bg-zinc-100 w-full h-[4.5rem] rounded-xl flex items-center gap-7">
                <div className="px-5 py-2 bg-rose-100 rounded-2xl outline outline-2 outline-offset-[-2px] outline-orange-600 flex flex-col justify-center gap-2.5">
                    <div className="flex gap-2.5">
                        <span className="text-orange-600 text-2xl font-bold">초대 수락 전</span>
                        <span className="text-orange-600 text-2xl font-bold">+{beforeAccept}</span>
                    </div>
                </div>
                <div className="px-5 py-2 bg-emerald-50 rounded-2xl outline outline-2 outline-offset-[-2px] outline-green-600 flex flex-col justify-center gap-2.5">
                    <div className="flex gap-2.5">
                        <span className="text-green-600 text-2xl font-bold">서명 전</span>
                        <span className="text-green-600 text-2xl font-bold">+{beforeSign}</span>
                    </div>
                </div>
                <div className="px-5 py-2 bg-white rounded-2xl outline outline-2 outline-offset-[-2px] outline-neutral-400 flex flex-col justify-center gap-2.5">
                    <div className="flex gap-2.5">
                        <span className="text-neutral-400 text-2xl font-bold">계약 완료</span>
                        <span className="text-neutral-400 text-2xl font-bold">+{complete}</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-neutral-400" />
        </>
    )
}