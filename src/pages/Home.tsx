import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import UnLoginContent from "@/components/UnLoginContent";
import HomeContent from "@/components/HomeContent";
import MyContent from "@/components/MyContent";
import ListContent from "@/components/ListContent";
import useUserStore from "@/stores/useUserStore";

const categories = [
    { key: "home", label: "서명 요약" },
    // { key: "myDocuments", label: "나의 문서" },
    // { key: "invitationPending", label: "초대 대기" },
    // { key: "mySignaturePending", label: "내 서명 대기" },
    // { key: "otherSignaturePending", label: "상대 서명 대기" },
    // { key: "completedContracts", label: "완료 계약" },
];

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState("home");
    const { userInfo } = useUserStore();

    const renderContent = () => {
        if (!userInfo) {
            return <UnLoginContent />;
        }

        switch (selectedCategory) {
            case "home":
                return <HomeContent />;
            case "myDocuments":
                return <MyContent />;
            default:
                return <ListContent category={selectedCategory} />;
        }
    };

    return (
        <div className="flex h-screen w-screen bg-zinc-100 overflow-hidden">
            <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <main className="flex-1 flex flex-col overflow-y-auto pt-32 px-10">
                {categories.map(({ key, label }) => (
                    selectedCategory === key && (
                        <div key={key} className="space-y-4 item-center">
                            {userInfo ? (
                                renderContent()
                            ) : (
                                <UnLoginContent />
                            )}
                        </div>
                    )
                ))}
            </main>
        </div>
    );
}
