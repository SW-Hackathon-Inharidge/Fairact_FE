import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EventSourcePolyfill } from "event-source-polyfill";
import {
    acceptContractInvite,
    fetchContractDetail,
    sendContractInviteEmail,
    signContract,
    UploadContractResponse,
} from "@/services/contract";
import { fetchUserSign, uploadUserSign } from "@/services/auth";
import useUserStore from "@/stores/useUserStore";

import ToxicClauseList from "@/components/ToxicClauseList";
import PDFViewer from "@/components/PDFViewer";
import Modal from "@/components/Modal";
import { SignStepOne, SignStepTwo, SignStepThree } from "@/components/SignModal";
import InviteModal from "@/components/InviteModal";
import Loading from "@/components/Loading";

import Upload from "@/assets/icon/white-upload.png";
import Check from "@/assets/icon/check.png";
import Up from "@/assets/icon/up_arrow.png";
import Down from "@/assets/icon/down_arrow.png";
import Plus from "@/assets/icon/plus.png";

import { emailTemplate } from "@/utils/emailTemplate";
import updateRecentContractIds from "@/utils/RecentContracts";
import { getContractState } from "@/utils/state";

interface ClickPosition {
    x: number;
    y: number;
    page: number;
}

export default function ContractDetailPage() {
    const [contract, setContract] = useState<UploadContractResponse | null>(null);
    const [allChecked, setAllChecked] = useState(false);
    const [authStep, setAuthStep] = useState<1 | 2 | 3 | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [signUrlList, setSignUrlList] = useState<string[]>([]);
    const [selectedSignUrl, setSelectedSignUrl] = useState<string | null>(null);
    const [clickPosition, setClickPosition] = useState<ClickPosition | null>(null);
    const [hoveredClauseText, setHoveredClauseText] = useState<string | null>(null);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useUserStore((state) => state.userInfo);
    const [searchParams] = useSearchParams();
    const invited = searchParams.get("invited") === "true";

    const sseDetailRef = useRef<EventSource | null>(null);
    const sseToxicRef = useRef<EventSource | null>(null);
    const fetchFlag = useRef(false);
    const fetchSignFlag = useRef(false);

    const scale = 10000;

    useEffect(() => {
        if (!id || fetchFlag.current) return;
        fetchFlag.current = true;

        async function init() {
            try {
                let data = await fetchContractDetail(id);

                if (invited && !data.is_invite_accepted) {
                    data = await acceptContractInvite(id);
                }

                const isValidAccess =
                    user?.user_id === data.owner_id ||
                    user?.user_id === data.worker_id ||
                    user?.email === data.worker_email;

                if (invited && !isValidAccess) {
                    alert("초대받은 이메일과 로그인한 이메일이 다릅니다. 해당 이메일로 다시 로그인해주세요.");
                    navigate("/", { replace: true });
                    return;
                }

                if (!isValidAccess) {
                    toast.error("해당 계약서에 접근할 수 없습니다.");
                    navigate("/", { replace: true });
                    return;
                }

                setContract(data);
                updateRecentContractIds(data.id);
            } catch (error) {
                toast.error("계약 정보를 불러오지 못했습니다.");
                navigate("/", { replace: true });
            }
        }

        init();
    }, [id, invited, navigate, user]);

    useEffect(() => {
        if (!user?.user_id) return;

        const EventSource = EventSourcePolyfill || window.EventSource;
        const MAX_RETRIES = 10;
        const RETRY_INTERVAL = 3000;
        let retryCount = 0;
        let retryTimer: number | null = null;

        const connectSSE = () => {
            if (sseDetailRef.current || sseToxicRef.current) return;

            const detailEventSource = new EventSource(`${import.meta.env.VITE_API_CONTRACT_URL}/contract/sse/subscribe/detail`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
                }
            });
            const toxicEventSource = new EventSource(`${import.meta.env.VITE_API_CONTRACT_URL}/contract/sse/subscribe/toxic-clause`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
                }
            });

            sseDetailRef.current = detailEventSource;
            sseToxicRef.current = toxicEventSource;

            detailEventSource.addEventListener("keep-alive", () => { });
            toxicEventSource.addEventListener("keep-alive", () => { });

            detailEventSource.addEventListener("contract-detail", (event) => {
                try {
                    const updatedContract: UploadContractResponse = JSON.parse(event.data);
                    setContract(updatedContract);
                } catch (e) {
                    console.error("❌ SSE contract-detail 파싱 실패", e);
                }
            });

            toxicEventSource.addEventListener("toxic-clause", (event) => {
                try {
                    const updated = JSON.parse(event.data);
                    setContract(updated);
                } catch (e) {
                    console.error("❌ SSE toxic-clause 파싱 실패", e);
                }
            });

            const handleError = (type: "detail" | "toxic") => (e: any) => {
                console.error(`❌ SSE(${type}) 연결 오류`, e);

                if (type === "detail" && sseDetailRef.current) {
                    sseDetailRef.current.close();
                    sseDetailRef.current = null;
                }
                if (type === "toxic" && sseToxicRef.current) {
                    sseToxicRef.current.close();
                    sseToxicRef.current = null;
                }

                if (retryCount < MAX_RETRIES && !retryTimer) {
                    retryCount++;
                    retryTimer = setTimeout(() => {
                        retryTimer = null;
                        connectSSE();
                    }, RETRY_INTERVAL);
                } else if (retryCount >= MAX_RETRIES) {
                    console.warn("🚫 SSE 재연결 최대 횟수 초과. 포기합니다.");
                }
            };

            detailEventSource.onerror = handleError("detail");
            toxicEventSource.onerror = handleError("toxic");
        };

        connectSSE();

        return () => {
            retryTimer && clearTimeout(retryTimer);
            retryTimer = null;

            sseDetailRef.current?.close();
            sseToxicRef.current?.close();
            sseDetailRef.current = null;
            sseToxicRef.current = null;
        };
    }, [user?.user_id]);

    useEffect(() => {
        if (fetchSignFlag.current) return;
        fetchSignFlag.current = true;

        async function fetchSign() {
            try {
                const res = await fetchUserSign();
                if (res?.sign_uri_list) setSignUrlList(res.sign_uri_list);
            } catch (e) {
                console.error("서명 조회 실패", e);
            }
        }

        fetchSign();
    }, []);

    const ownerSignPosition = useMemo(() => {
        if (
            contract?.owner_sign_x != null &&
            contract.owner_sign_y != null &&
            contract.owner_sign_page != null
        ) {
            return {
                x: contract.owner_sign_x / scale,
                y: contract.owner_sign_y / scale,
                page: contract.owner_sign_page,
            };
        }
        return null;
    }, [contract]);

    const workerSignPosition = useMemo(() => {
        if (
            contract?.worker_sign_x != null &&
            contract.worker_sign_y != null &&
            contract.worker_sign_page != null
        ) {
            return {
                x: contract.worker_sign_x / scale,
                y: contract.worker_sign_y / scale,
                page: contract.worker_sign_page,
            };
        }
        return null;
    }, [contract]);

    const role = useMemo(
        () => (user?.user_id === contract?.worker_id ? "worker" : "owner"),
        [user, contract]
    );

    const showSignButton = useMemo(() => {
        if (!contract) return false;
        if (role === "owner") {
            return (
                (!contract.worker_email && !contract.is_owner_signed) ||
                (contract.worker_email && !contract.is_owner_signed)
            );
        } else {
            return !contract.is_worker_signed;
        }
    }, [role, contract]);

    const showInviteButton = useMemo(() => {
        if (!contract) return false;
        return role === "owner" && !contract.worker_email && contract.is_owner_signed;
    }, [role, contract]);

    const isSigned = useMemo(() => {
        if (!contract || !user) return false;
        return (
            (role === "owner" && contract.is_owner_signed) ||
            (role === "worker" && contract.is_worker_signed)
        );
    }, [contract, role, user]);

    const handlePdfClick = useCallback(
        (x: number, y: number, page: number) => {
            if (isSigned) return;
            setClickPosition({ x, y, page });
        },
        [isSigned]
    );

    const handleSignUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await uploadUserSign(file);
            const url = URL.createObjectURL(file);
            setSignUrlList((prev) => [...prev, url]);
        } catch {
            toast.error("서명 업로드 실패");
        }
    }, []);

    const handleESignClick = () => {
        if (!contract?.file_processed) {
            toast.error("계약서를 분석하는 중입니다. 잠시만 기다려주세요.");
            return;
        }
        if (!selectedSignUrl) {
            toast.error("서명을 선택해주세요.");
            return;
        }
        if (!clickPosition) {
            toast.error("PDF 위에 서명 위치를 지정해주세요.");
            return;
        }

        const checkedCount = document.querySelectorAll("input[type='checkbox']:checked").length;
        const totalClauses = contract?.clauses?.length ?? 0;

        if (checkedCount < totalClauses) {
            toast.error("모든 독소조항 확인 체크를 완료해주세요.");
            return;
        }

        setIsModalOpen(true);
        setAuthStep(1);
    };

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 1000,
                    style: {
                        background: "#333",
                        color: "#fff",
                        borderRadius: "0.75rem",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                        fontSize: "1rem",
                        fontWeight: 600,
                    },
                }}
            />
            <div className="flex h-screen w-screen bg-zinc-100 overflow-hidden">
                {!contract ? (
                    <div>계약 정보를 불러오는 중...</div>
                ) : (
                    <>
                        <ToxicClauseList
                            contract={contract}
                            onAllChecked={setAllChecked}
                            isSigned={isSigned}
                            hoveredClauseText={hoveredClauseText}
                        />
                        <main className="flex-1 flex flex-col pt-32 pl-24 overflow-hidden justify-between">
                            <div className="flex h-full gap-16">
                                <div
                                    className="flex-1 overflow-y-auto"
                                    style={{ maxWidth: 850, maxHeight: "100%" }}
                                >
                                    <PDFViewer
                                        contract={contract}
                                        onPdfClick={handlePdfClick}
                                        markerPosition={isSigned ? undefined : clickPosition}
                                        ownerSignPosition={ownerSignPosition}
                                        workerSignPosition={workerSignPosition}
                                        onHighlightHover={setHoveredClauseText}
                                    />
                                </div>

                                {!contract.file_processed ? (
                                    <div className="flex flex-col w-72 justify-between">
                                        <div className="flex flex-col w-72 justify-center items-center h-full">
                                            <Loading phrase="독소조항 검사 중" />
                                        </div>
                                    </div>
                                ) : (

                                    <div className="flex flex-col w-72 justify-between">
                                        <div className="flex flex-col items-center">
                                            <p className="text-blue-500 text-lg font-bold my-4 text-center">
                                                {getContractState(
                                                    contract.worker_email,
                                                    contract.is_invite_accepted,
                                                    contract.is_owner_signed,
                                                    contract.is_worker_signed,
                                                    role
                                                )}
                                            </p>
                                            {showSignButton && (
                                                <div className="w-60 flex flex-col items-start mb-6">
                                                    <button
                                                        onClick={() => setIsOpen((prev) => !prev)}
                                                        className="w-full h-12 pl-7 pr-6 py-2 bg-white rounded-2xl outline outline-2 outline-offset-[-2px] outline-neutral-400 flex justify-between items-center"
                                                    >
                                                        <div className="text-blue-500 text-xl font-semibold leading-loose">
                                                            사인
                                                        </div>
                                                        <img
                                                            src={isOpen ? Up : Down}
                                                            alt="toggle"
                                                            className="w-6 h-6"
                                                        />
                                                    </button>

                                                    <div
                                                        className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                                            } w-full flex flex-col`}
                                                    >
                                                        {signUrlList.map((signUrl, idx) => {
                                                            const isSelected = selectedSignUrl === signUrl;
                                                            const isFirst = idx === 0;
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    onClick={() => setSelectedSignUrl(signUrl)}
                                                                    className={`
                                    flex items-center gap-3 px-4 py-2 w-full h-16
                                    ${isSelected
                                                                            ? "border-4 border-sky-600 bg-sky-50"
                                                                            : "border border-gray-300"
                                                                        }
                                    ${isFirst ? "rounded-t-2xl" : ""}
                                    hover:bg-sky-100 transition-all duration-200
                                  `}
                                                                >
                                                                    <img
                                                                        className="w-28 h-full object-contain"
                                                                        src={signUrl}
                                                                        alt="내 서명"
                                                                    />
                                                                    {isSelected && (
                                                                        <span className="text-sky-600 font-bold ml-auto">✔</span>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                        <label
                                                            htmlFor="sign-upload"
                                                            className="h-12 pl-7 pr-6 py-2 bg-white rounded-b-2xl shadow flex justify-between items-center w-full cursor-pointer border border-gray-300"
                                                        >
                                                            <span className="text-neutral-400 text-xl font-semibold leading-loose">
                                                                추가하기
                                                            </span>
                                                            <img src={Plus} alt="plus" className="w-6 h-6" />
                                                            <input
                                                                id="sign-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleSignUpload}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center gap-4 pb-10">
                                            {showInviteButton && (
                                                <button
                                                    type="button"
                                                    className="inline-flex w-52 items-center justify-center gap-2.5 rounded-2xl bg-sky-700 px-5 py-2 shadow"
                                                    onClick={() => setIsInviteModalOpen(true)}
                                                >
                                                    <img src={Upload} alt="이메일로 초대" className="w-6 h-6" />
                                                    <span className="text-2xl font-bold leading-9 text-white">
                                                        이메일로 초대
                                                    </span>
                                                </button>
                                            )}
                                            {showSignButton && (
                                                <button
                                                    type="button"
                                                    onClick={handleESignClick}
                                                    className="inline-flex w-52 items-center justify-center gap-2.5 rounded-2xl bg-sky-700 px-5 py-2 shadow"
                                                >
                                                    <img src={Check} alt="전자서명" className="w-6 h-6" />
                                                    <span className="text-2xl font-bold leading-9 text-white">
                                                        전자서명
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </main>

                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => {
                                setAuthStep(null);
                                setIsModalOpen(false);
                            }}
                        >
                            {authStep === 1 && <SignStepOne onNext={() => setAuthStep(2)} />}
                            {authStep === 2 && <SignStepTwo onNext={() => setAuthStep(3)} />}
                            {authStep === 3 && (
                                <SignStepThree
                                    isSigning={isSigning}
                                    onConfirm={async () => {
                                        let res;
                                        try {
                                            if (!clickPosition || !contract?.id) return;
                                            setIsSigning(true);
                                            const xInt = Math.round(clickPosition.x * scale);
                                            const yInt = Math.round(clickPosition.y * scale);
                                            res = await signContract(
                                                contract.id,
                                                xInt,
                                                yInt,
                                                clickPosition.page,
                                                selectedSignUrl
                                            );
                                            toast.success("서명이 완료되었습니다.");
                                        } catch {
                                            toast.error("서명에 실패했습니다.");
                                        } finally {
                                            setAuthStep(null);
                                            setIsModalOpen(false);
                                            setIsSigning(false);
                                            if (res) setContract(res);
                                        }
                                    }}
                                />
                            )}
                        </Modal>

                        <InviteModal
                            email={email}
                            isInviting={isInviting}
                            setEmail={setEmail}
                            isOpen={isInviteModalOpen}
                            onClose={() => setIsInviteModalOpen(false)}
                            handleInvite={async () => {
                                if (!email) {
                                    toast.error("이메일을 입력해주세요.");
                                    return;
                                }

                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!emailRegex.test(email)) {
                                    toast.error("올바른 이메일 형식을 입력해주세요.");
                                    return;
                                }

                                if (!contract?.id) {
                                    toast.error("계약 정보가 없습니다.");
                                    return;
                                }

                                try {
                                    setIsInviting(true);
                                    const subject = "[FairAct] 전자 서명을 위한 계약에 초대되었습니다.";
                                    const inviteUrl = `${window.location.origin}/contract/${contract.id}?invited=true`;
                                    const finalHtml = emailTemplate.replace("{{inviteUrl}}", inviteUrl);

                                    await sendContractInviteEmail(contract.id, email, subject, finalHtml);
                                    const updatedContract = await fetchContractDetail(contract.id);
                                    setContract(updatedContract);

                                    toast.success("초대가 완료되었습니다.");
                                } catch (error) {
                                    toast.error("초대에 실패했습니다.");
                                    console.error(error);
                                } finally {
                                    setEmail("");
                                    setIsInviteModalOpen(false);
                                    setIsInviting(false);
                                }
                            }}
                        />
                    </>
                )}
            </div>
        </>
    );
}
