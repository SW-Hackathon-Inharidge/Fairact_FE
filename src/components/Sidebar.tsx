import { useState } from "react";
import Modal from "@/components/Modal";

type SidebarProps = {
    categories: { key: string; label: string }[];
    selectedCategory: string;
    onSelectCategory: (key: string) => void;
};

export default function Sidebar({
    categories,
    selectedCategory,
    onSelectCategory,
}: SidebarProps) {
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);

    const openFileModal = () => setIsFileModalOpen(true);

    return (
        <>
            <aside className="w-80 bg-blue-500 flex-shrink-0 pt-28 px-6">
                <div
                    className="mt-10 w-[90%] px-5 py-3 bg-white rounded-2xl flex justify-center items-center gap-2.5 mb-6 mx-auto cursor-pointer"
                    onClick={openFileModal}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openFileModal()}
                >
                    <img src="./src/assets/icon/upload.png" className="w-6 h-6" />
                    <div className="text-sky-700 text-2xl font-bold">파일 업로드</div>
                </div>

                <div className="ml-5 mt-10 py-2 text-white text-xl font-normal leading-loose">계약</div>

                <nav className="flex flex-col gap-2">
                    {categories.map(({ key, label }) => (
                        <button
                            key={key}
                            className={`px-10 py-2 rounded-[5px] inline-flex items-center gap-6 w-full text-left ${selectedCategory === key ? "bg-blue-700 text-white" : "text-blue-100"
                                }`}
                            onClick={() => onSelectCategory(key)}
                        >
                            <img
                                src={`./src/assets/icon/${getIconName(key)}`}
                                alt={label}
                                className="w-6 h-6"
                            />
                            <span className="text-2xl font-bold">{label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {isFileModalOpen && (
                <Modal isOpen={isFileModalOpen} onClose={() => setIsFileModalOpen(false)}>
                    <div className="relative bg-white max-w-[927px] w-full mx-auto p-12 overflow-hidden rounded-lg shadow-lg">
                        {/* 타이틀 */}
                        <h1 className="text-3xl font-bold text-center mb-4 leading-[60px] text-black font-['Inter']">
                            파일 업로드 하기
                        </h1>

                        {/* 설명 텍스트 */}
                        <p className="text-lg text-neutral-400 font-['Inter'] leading-loose mb-4 max-w-xl mx-auto text-center">
                            압축 형식(zip)파일을 제외한 모든 유형의 파일을 등록할 수 있습니다.<br />
                            파일 1개당 크기는 20MB를 초과할 수 없으며, 최대 10개까지 등록할 수 있습니다.
                        </p>

                        {/* 드래그 앤 드롭 박스 */}
                        <div className="bg-zinc-300 rounded-3xl max-w-[767px] w-full h-36 mx-auto flex flex-col items-center justify-center relative mb-8 px-6">
                            <p className="text-lg text-neutral-400 font-['Inter'] leading-loose text-center mb-4">
                                첨부 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러 파일을 직접 선택해주세요.
                            </p>

                            {/* 파일 선택 버튼 */}
                            <button className="bg-sky-700 rounded-2xl inline-flex items-center gap-2.5 px-6 py-2 text-white text-lg font-normal font-['Inter'] leading-9 hover:bg-sky-800 transition">
                                <img src="./src/assets/icon/white-upload.png" alt="파일 선택" className="w-6 h-6" />
                                파일 선택
                            </button>
                        </div>

                        {/* 하단 버튼 */}
                        <div className="flex justify-center max-w-[767px] w-full mx-auto">
                            <button className="bg-blue-500 rounded-2xl flex items-center gap-2.5 px-6 py-2.5 text-white text-2xl font-bold font-['Inter'] leading-9 hover:bg-blue-600 transition">
                                <span>다음</span>
                                <img src="./src/assets/icon/right.png" alt="다음" className="w-6 h-6"></img>
                            </button>
                        </div>
                    </div>

                </Modal>
            )}
        </>
    );
}

function getIconName(key: string) {
    switch (key) {
        case "home":
            return "home.png";
        case "myDocuments":
            return "document.png";
        case "invitationPending":
            return "eye-off.png";
        case "mySignaturePending":
            return "x-square.png";
        case "otherSignaturePending":
            return "shared-contract.png";
        case "completedContracts":
            return "check.png";
        default:
            return "home.png";
    }
}
