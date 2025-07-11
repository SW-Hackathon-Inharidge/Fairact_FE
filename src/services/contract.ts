import axiosInstance from "@/services/axiosInstance";

// 최근 열람 계약 3건 조회
export async function fetchRecentContracts() {
    try {
        const response = await axiosInstance.get("/contract/list/recent");
        return response.data; // ContractSummaryDTO[]
    } catch (error) {
        console.error("최근 계약 3건 조회 실패:", error);
        throw error;
    }
}

// 내 서명 필요 계약 3건 조회
export async function fetchContractsRequiringMySign() {
    try {
        const response = await axiosInstance.get("/contract/list/require/me");
        return response.data; // ContractSummaryDTO[]
    } catch (error) {
        console.error("내 서명 필요 계약 3건 조회 실패:", error);
        throw error;
    }
}

// 상대방 서명 필요 계약 3건 조회
export async function fetchContractsRequiringOpponentSign() {
    try {
        const response = await axiosInstance.get("/contract/list/require/opponent");
        return response.data; // ContractSummaryDTO[]
    } catch (error) {
        console.error("상대방 서명 필요 계약 3건 조회 실패:", error);
        throw error;
    }
}
