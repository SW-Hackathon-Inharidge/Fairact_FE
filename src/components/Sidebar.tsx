import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/Modal";
import { createContract, UploadContractResponse } from "@/services/contract";
import useUserStore from "@/stores/useUserStore";
import Upload from "@/assets/icon/upload.png";
import Right from "@/assets/icon/right.png";
import White_Upload from "@/assets/icon/white-upload.png";
import homeIcon from '@/assets/icon/home.png';
import documentIcon from '@/assets/icon/document.png';
import eyeOffIcon from '@/assets/icon/eye-off.png';
import xSquareIcon from '@/assets/icon/x-square.png';
import sharedContractIcon from '@/assets/icon/shared-contract.png';
import checkIcon from '@/assets/icon/check.png';

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { userInfo } = useUserStore();

    const openFileModal = () => setIsFileModalOpen(true);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setSelectedFile(file);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("파일을 선택해주세요.");
            return;
        }
        setIsUploading(true);
        setError(null);
        try {
            const uploadResult: UploadContractResponse = await createContract(selectedFile);

            setIsFileModalOpen(false);
            setSelectedFile(null);

            navigate(`/contract/${uploadResult.id}`, { state: { contract: uploadResult } });
        } catch (err) {
            setError("업로드 실패했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <aside className="w-1/5 bg-blue-500 flex-shrink-0 pt-28 px-6">
                <div
                    className={`mt-10 w-[90%] px-5 py-3 rounded-2xl flex justify-center items-center gap-2.5 mb-6 mx-auto
    ${userInfo ? "bg-white cursor-pointer" : "bg-gray-200 cursor-not-allowed"}`}
                    onClick={userInfo ? openFileModal : undefined}
                    role="button"
                    tabIndex={userInfo ? 0 : -1}
                    aria-disabled={!userInfo}
                    onKeyDown={(e) => userInfo && e.key === "Enter" && openFileModal()}
                >
                    <img
                        src={Upload}
                        className={userInfo ? "w-6 h-6" : "w-6 h-6 opacity-50"}
                        alt="업로드 아이콘"
                    />
                    <div className={`${userInfo ? "text-sky-700" : "text-gray-400"} text-2xl font-bold`}>
                        파일 업로드
                    </div>
                </div>

                <div className="ml-5 mt-10 py-2 text-white text-xl font-normal leading-loose">계약</div>

                <nav className="flex flex-col gap-2">
                    {categories.map(({ key, label }) => (
                        <button
                            key={key}
                            className={`px-10 py-2 rounded-[5px] inline-flex items-center gap-6 w-full text-left ${selectedCategory === key ? "bg-blue-700 text-white" : "text-blue-100"}`}
                            onClick={() => onSelectCategory(key)}
                        >
                            <img src={getIconByKey(key)} alt={label} className="w-6 h-6" />
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
                            pdf 형식의 파일을 등록할 수 있습니다.
                            <br />
                            파일 1개당 크기는 20MB를 초과할 수 없으며, 최대 10개까지 등록할 수 있습니다.
                        </p>

                        <div className="bg-zinc-300 rounded-3xl max-w-[767px] w-full h-36 mx-auto flex flex-col items-center justify-center relative mb-8 px-6 overflow-hidden">
                            {!selectedFile ? (
                                <p className="text-lg text-neutral-400 font-['Inter'] leading-loose text-center mb-4">
                                    파일 선택 버튼을 눌러 파일을 직접 선택해주세요.
                                </p>
                            ) : (
                                <p className="text-lg font-['Inter'] leading-loose text-center mb-4">
                                    {selectedFile.name}
                                </p>
                            )}

                            <input
                                id="fileInput"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <label
                                htmlFor="fileInput"
                                className="bg-sky-700 rounded-2xl inline-flex items-center gap-2.5 px-6 py-2 text-white text-lg font-normal font-['Inter'] leading-9 cursor-pointer hover:bg-sky-800 transition"
                            >
                                <img src={White_Upload} alt="파일 선택" className="w-6 h-6" />
                                파일 선택
                            </label>

                        </div>

                        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                        <div className="flex justify-center max-w-[767px] w-full mx-auto">
                            <button
                                disabled={isUploading || !selectedFile}
                                onClick={handleUpload}
                                className={`bg-blue-500 rounded-2xl flex items-center gap-2.5 px-6 py-2.5 text-white text-2xl font-bold font-['Inter'] leading-9 hover:bg-blue-600 transition ${(isUploading || !selectedFile) ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                <span>{isUploading ? "업로드 중..." : "다음"}</span>
                                <img src={Right} alt="다음" className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </Modal >
            )
            }
        </>
    );
}

function getIconByKey(key: string) {
    switch (key) {
        case 'home': return homeIcon;
        case 'myDocuments': return documentIcon;
        case 'invitationPending': return eyeOffIcon;
        case 'mySignaturePending': return xSquareIcon;
        case 'otherSignaturePending': return sharedContractIcon;
        case 'completedContracts': return checkIcon;
        default: return homeIcon;
    }
}