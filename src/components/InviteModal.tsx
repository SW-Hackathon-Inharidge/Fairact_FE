import Modal from "@/components/Modal";
import { useState } from "react";

interface InviteModalProps {
    email: string;
    isInviting: boolean;
    setEmail: (email: string) => void;
    isOpen: boolean;
    onClose: () => void;
    handleInvite: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ email, isInviting, setEmail, isOpen, onClose, handleInvite }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col w-[700px] bg-white rounded-2xl p-8 py-16 shadow-lg items-center justify-center">
                <h2 className="text-3xl font-bold mb-6 text-center">전자 서명 참여자를 초대해주세요</h2>

                <input
                    type="email"
                    placeholder="초대할 사용자의 이메일을 입력해주세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-4/5 mb-6 px-4 py-3 rounded-2xl border border-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        disabled={isInviting}
                        onClick={handleInvite}
                        className={`px-6 py-3 rounded-2xl font-bold transition 
    ${isInviting
                                ? "bg-blue-300 text-white cursor-not-allowed opacity-50"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                    >
                        {isInviting ? "전송 중..." : "초대"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default InviteModal;