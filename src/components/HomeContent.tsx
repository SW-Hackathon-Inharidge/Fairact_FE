import { useEffect, useState } from "react";
import {
    fetchRecentContracts,
    fetchContractsRequiringMySign,
    fetchContractsRequiringOpponentSign,
} from "@/services/contract";
import ContractInfo from "./ContractInfo";
import { useNavigate } from "react-router-dom";
import ContractRow from "./ContractRow";
import { getContractState } from "@/utils/state";
import useUserStore from "@/stores/useUserStore";
import { formatShortDate } from "@/utils/dateFormat";

export default function HomeContent() {
    const [recentContracts, setRecentContracts] = useState([]);
    const [mySignContracts, setMySignContracts] = useState([]);
    const [opponentSignContracts, setOpponentSignContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useUserStore((state) => state.userInfo);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadContracts() {
            try {
                setLoading(true);
                const [recent, mySign, opponentSign] = await Promise.all([
                    fetchRecentContracts(),
                    fetchContractsRequiringMySign(),
                    fetchContractsRequiringOpponentSign(),
                ]);
                setRecentContracts(recent);
                setMySignContracts(mySign);
                setOpponentSignContracts(opponentSign);
            } catch (error) {
                console.error("계약 데이터 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        }

        loadContracts();
    }, []);

    const handleContractClick = (contractId: string) => {
        navigate(`/contract/${contractId}`);
    };

    return (
        <>
            <div className="py-2 flex flex-col space-y-2">
                <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                    최근 열람한 계약
                </div>
                <div className="bg-white rounded-2xl shadow px-4 py-6 flex justify-center shadow-md cursor-pointer">
                    {loading ? (
                        "로딩 중..."
                    ) : recentContracts.length > 0 ? (
                        <ul className="divide-y divide-gray-700 w-full">
                            {(() => {
                                const storageKey = "recentContractIds";
                                const idOrder = JSON.parse(sessionStorage.getItem(storageKey) || "[]") as string[];

                                const sortedContracts = idOrder
                                    .map((id) => recentContracts.find((c) => c.id === id))
                                    .filter((c): c is typeof recentContracts[number] => !!c);

                                return sortedContracts.map((contract) => {
                                    const state = getContractState(
                                        contract.worker_email,
                                        contract.is_invite_accepted,
                                        contract.is_owner_signed,
                                        contract.is_worker_signed,
                                        user.user_id === contract.worker_id ? "worker" : "owner"
                                    );
                                    const formattedDate = formatShortDate(new Date(contract.modified_at * 1000));

                                    return (
                                        <div className="flex p-2 cursor-pointer" key={contract.id} onClick={() => handleContractClick(contract.id)}>
                                            <ContractRow
                                                status={state === "계약 완료" ? "완료" : "진행중"}
                                                iconSrc={state === "계약 완료" ? "./src/assets/icon/good.png" : "./src/assets/icon/loader.png"}
                                                title={contract.title}
                                                owner={contract.owner_name}
                                                worker={
                                                    !contract.worker_id
                                                        ? ""
                                                        : contract.worker_name
                                                            ? contract.worker_name
                                                            : contract.worker_email
                                                }
                                                date={formattedDate}
                                                state={state}
                                            />
                                        </div>
                                    );
                                });
                            })()}
                        </ul>
                    ) : (
                        <div className="flex w-full py-24 justify-center items-center h-full text-gray-400 text-lg">
                            최근 열람한 계약이 없습니다.
                        </div>
                    )}
                </div>
            </div>

            <div className="py-2 flex gap-6">
                {/* 내 서명 필요 */}
                <div className="flex flex-col flex-1 space-y-2">
                    <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                        내 서명 필요
                    </div>
                    <div className="bg-white rounded-2xl shadow p-5 flex-grow flex shadow-md">
                        {loading ? (
                            "로딩 중..."
                        ) : mySignContracts.length > 0 ? (
                            <ul className="divide-y divide-gray-700 w-full max-h-[17rem] overflow-y-auto">
                                {mySignContracts.map((contract) => (
                                    <div
                                        className="flex p-4 cursor-pointer"
                                        key={contract.id}
                                        onClick={() => handleContractClick(contract.id)}
                                    >
                                        <ContractInfo
                                            title={contract.title}
                                            owner={contract.owner_name}
                                            worker={
                                                !contract.worker_id
                                                    ? ""
                                                    : contract.worker_name
                                                        ? contract.worker_name
                                                        : contract.worker_email
                                            }
                                        />
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex p-16 w-full justify-center items-center h-full text-gray-400 text-lg">
                                상대 서명 필요 계약이 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* 상대 서명 필요 */}
                <div className="flex flex-col flex-1 space-y-2">
                    <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                        상대 서명 필요
                    </div>
                    <div className="bg-white rounded-2xl shadow p-5 flex-grow flex shadow-md">
                        {loading ? (
                            "로딩 중..."
                        ) : opponentSignContracts.length > 0 ? (
                            <ul className="divide-y divide-gray-700 w-full max-h-[17rem] overflow-y-auto">
                                {opponentSignContracts.map((contract) => (
                                    <div
                                        className="flex p-4 cursor-pointer"
                                        key={contract.id}
                                        onClick={() => handleContractClick(contract.id)}
                                    >
                                        <ContractInfo
                                            title={contract.title}
                                            owner={contract.owner_name}
                                            worker={
                                                !contract.worker_id
                                                    ? ""
                                                    : contract.worker_name
                                                        ? contract.worker_name
                                                        : contract.worker_email
                                            }
                                        />
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex p-16 w-full justify-center items-center h-full text-gray-400 text-lg">
                                상대 서명 필요 계약이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}