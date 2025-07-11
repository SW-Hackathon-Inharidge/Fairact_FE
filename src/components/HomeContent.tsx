import { useEffect, useState } from "react";
import State from "@/components/State";
import {
    fetchRecentContracts,
    fetchContractsRequiringMySign,
    fetchContractsRequiringOpponentSign,
} from "@/services/contract";

export default function HomeContent() {
    const [recentContracts, setRecentContracts] = useState([]);
    const [mySignContracts, setMySignContracts] = useState([]);
    const [opponentSignContracts, setOpponentSignContracts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const title = "김인하 근로계약서 - (주)인천SW";
    const owner = "이인덕";
    const worker = "김인하";
    const date = "25-05-28 13:00";
    const state = "상대방 서명 필요";

    return (
        <>
            <State
                beforeAccept={mySignContracts.length}
                beforeSign={opponentSignContracts.length}
                complete={recentContracts.length}
            />

            <div className="py-2 flex flex-col space-y-2">
                <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                    최근 열람한 계약
                </div>
                <div className="bg-white rounded-2xl shadow p-12 flex justify-center shadow-md">
                    {/* <ContractRow
                        status="진행중"
                        iconSrc="./src/assets/icon/loader.png"
                        title="김인하 근로계약서 - (주)인천SW"
                        owner="김인하"
                        worker="이인덕"
                        date="25-05-28 13:00"
                        state="상대방 서명 필요"
                    /> */}
                    {loading ? (
                        "로딩 중..."
                    ) : recentContracts.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {recentContracts.map((contract) => (
                                <li key={contract.id}>{contract.title}</li>
                            ))}
                        </ul>
                    ) : (
                        "최근 계약이 없습니다."
                    )}
                </div>
            </div>

            <div className="py-2 flex gap-6">
                <div className="flex flex-col flex-1 space-y-2">
                    <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                        내 서명 필요
                    </div>
                    <div className="bg-white rounded-2xl shadow p-5 flex-grow flex shadow-md">
                        {/* <div className="flex p-2">
                            <ContractInfo title={title} owner={owner} worker={worker} />
                        </div> */}

                        {loading ? (
                            "로딩 중..."
                        ) : mySignContracts.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {mySignContracts.map((contract) => (
                                    <li key={contract.id}>{contract.title}</li>
                                ))}
                            </ul>
                        ) : (
                            "서명 필요 계약이 없습니다."
                        )}
                    </div>
                </div>

                <div className="flex flex-col flex-1 space-y-2">
                    <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                        상대 서명 필요
                    </div>
                    <div className="bg-white rounded-2xl shadow p-5 flex-grow flex shadow-md">
                        {/* <div className="flex p-2">
                            <ContractInfo title={title} owner={owner} worker={worker} />
                        </div> */}
                        {loading ? (
                            "로딩 중..."
                        ) : opponentSignContracts.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {opponentSignContracts.map((contract) => (
                                    <li key={contract.id}>{contract.title}</li>
                                ))}
                            </ul>
                        ) : (
                            "상대 서명 필요 계약이 없습니다."
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}