import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UploadContractResponse } from "@/services/contract";
import useUserStore from "@/stores/useUserStore";
import ToxicClauseList from "@/components/ToxicClauseList";
import PDFViewer from "@/components/PDFViewer";
import Upload from "@/assets/icon/white-upload.png"
import Check from "@/assets/icon/check.png"
import Up from "@/assets/icon/up_arrow.png";
import Down from "@/assets/icon/down_arrow.png";
import Plus from "@/assets/icon/plus.png";

export default function ContractDetailPage() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const contract = location.state?.contract as UploadContractResponse | undefined;
    const user = useUserStore((state) => state.userInfo);

    useEffect(() => {
        const isValidAccess =
            user &&
            contract &&
            (user.user_id === contract.owner_id || user.user_id === contract.worker_id);

        if (!isValidAccess) {
            alert("해당 계약서에 접근할 수 없습니다.");
            navigate("/", { replace: true });
        }
    }, [user, contract, navigate]);

    if (!contract) {
        return <div className="p-10 text-lg">계약 정보를 불러올 수 없습니다.</div>;
    }


    return (
        <div className="flex h-screen w-screen bg-zinc-100 overflow-hidden">
            <ToxicClauseList title="근로계약서-(주)인천SW" />
            <main className="flex-1 flex flex-col pt-32 px-10 overflow-hidden">
                {/* ────── PDF 영역과 버튼을 좌우 배치 ────── */}
                <div className="flex h-full gap-5">
                    {/* PDFViewer가 들어갈 영역 */}
                    <div className="flex-1 overflow-y-auto">
                        <PDFViewer
                            fileUrl={
                                contract?.file_uri ??
                                "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className="shrink-0 flex items-end pb-10">
                            <button
                                type="button"
                                className="inline-flex w-52 items-center justify-center gap-2.5 rounded-2xl bg-sky-700 px-5 py-2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)]"
                            >
                                <img src={Upload} alt="이메일로 초대" className="w-6 h-6" />
                                <span className="text-2xl font-bold leading-9 text-white">
                                    이메일로 초대
                                </span>
                            </button>
                        </div>
                        <div className="shrink-0 flex items-end pb-10">
                            <button
                                type="button"
                                className="inline-flex w-52 items-center justify-center gap-2.5 rounded-2xl bg-sky-700 px-5 py-2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)]"
                            >
                                <img src={Check} alt="이메일로 초대" className="w-6 h-6" />
                                <span className="text-2xl font-bold leading-9 text-white">
                                    전자서명
                                </span>
                            </button>
                        </div>
                        <div
                            data-property-1={isOpen ? "2" : "1"}
                            className="w-60 flex flex-col items-start"
                        >
                            {/* ───── 상단 사인 버튼 ───── */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full h-12 pl-7 pr-6 py-2 bg-white rounded-2xl outline outline-2 outline-offset-[-2px] outline-neutral-400 flex justify-between items-center"
                            >
                                <div className="text-blue-500 text-xl font-semibold leading-loose">
                                    사인
                                </div>

                                {/* 커스텀 화살표 아이콘 */}
                                {isOpen ? (
                                    <>
                                        <img src={Up} alt="이메일로 초대" className="w-6 h-6" />
                                    </>
                                ) : (
                                    <>
                                        <img src={Down} alt="이메일로 초대" className="w-6 h-6" />
                                    </>
                                )}
                            </button>

                            {/* ───── 드롭다운 영역 ───── */}
                            <div
                                className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                    } w-full flex flex-col`}
                            >
                                {/* 미리보기 1 */}
                                <div className="h-12 pl-7 pr-6 py-2 bg-white rounded-t-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex justify-start items-center gap-2.5 w-full">
                                    <img
                                        className="w-28 h-7 max-w-full"
                                        src="https://placehold.co/110x28"
                                        alt="서명 샘플1"
                                    />
                                </div>

                                {/* 미리보기 2 */}
                                <div className="pl-7 pr-6 py-2 bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black flex justify-start items-center gap-2.5 w-full">
                                    <img
                                        className="w-16 h-16 max-w-full"
                                        src="https://placehold.co/70x70"
                                        alt="서명 샘플2"
                                    />
                                </div>

                                {/* 추가하기 영역 */}
                                <div className="h-12 pl-7 pr-6 py-2 bg-white rounded-b-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex justify-between items-center w-full">
                                    <div className="text-neutral-400 text-xl font-semibold leading-loose">
                                        추가하기
                                    </div>
                                    {/* + 아이콘 */}
                                    <img src={Plus} alt="이메일로 초대" className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
}
