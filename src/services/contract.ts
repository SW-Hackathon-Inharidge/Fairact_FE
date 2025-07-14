import { contractAxiosInstance } from "@/services/axiosInstance";
export interface ContractSummaryDTO {
    id: string;
    title: string;
    owner_id: number;
    worker_id: number;
    is_owner_signed: boolean;
    is_worker_signed: boolean;
    is_invite_accepted: boolean;
}

export interface SegmentPosition {
    page_index: number;
    vertices: { x: number; y: number }[];
}

export interface Clause {
    id: number;
    text: string;
    segment_positions: SegmentPosition[];
}

export interface Clauses {
    clause: Clause;
    reason_type: string;
    reason: string;
    suggestion: string;
    checked_at: number;
    is_checked: boolean;
}

export interface UploadContractResponse {
    id: string;
    title: string;
    owner_id: number;
    owner_name: string;
    worker_id: number;
    worker_email: string;
    worker_name: string;
    is_owner_signed: boolean;
    is_worker_signed: boolean;
    is_invite_accepted: boolean;
    file_uri: string;
    file_hash: string;
    file_processed: boolean;
    worker_sign_x: number;
    worker_sign_y: number;
    worker_sign_url: string;
    worker_sign_page: number;
    worker_sign_scale: number;
    owner_sign_x: number;
    owner_sign_y: number;
    owner_sign_page: number;
    owner_sign_url: string;
    owner_sign_scale: number;
    clauses: Clauses[];
    created_at: number;
    modified_at: number;
}

export async function fetchRecentContracts(): Promise<ContractSummaryDTO[]> {
    const storageKey = "recentContractIds";
    const contractIdList = JSON.parse(sessionStorage.getItem(storageKey) || "[]") as string[];

    if (contractIdList.length === 0) return [];

    try {
        const response = await contractAxiosInstance.post<ContractSummaryDTO[]>("/contract/list/recent", {
            contractIdList,
        });
        return response.data;
    } catch (error) {
        console.error("최근 계약 3건 조회 실패:", error);
        throw error;
    }
}

export async function fetchContractsRequiringMySign(): Promise<ContractSummaryDTO[]> {
    try {
        const response = await contractAxiosInstance.get<ContractSummaryDTO[]>("/contract/list/require/me");
        return response.data;
    } catch (error) {
        console.error("내 서명 필요 계약 3건 조회 실패:", error);
        throw error;
    }
}

export async function fetchContractsRequiringOpponentSign(): Promise<ContractSummaryDTO[]> {
    try {
        const response = await contractAxiosInstance.get<ContractSummaryDTO[]>("/contract/list/require/opponent");
        return response.data;
    } catch (error) {
        console.error("상대방 서명 필요 계약 3건 조회 실패:", error);
        throw error;
    }
}

export async function createContract(file: File): Promise<UploadContractResponse> {
    try {
        const formData = new FormData();
        formData.append("contract_file", file);

        const response = await contractAxiosInstance.post<UploadContractResponse>("/contract/file/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("계약서 업로드 및 계약 생성 실패:", error);
        throw error;
    }
}

export async function fetchContractDetail(contractId: string): Promise<UploadContractResponse> {
    try {
        const response = await contractAxiosInstance.get<UploadContractResponse>(
            `/contract/${contractId}/detail`
        );
        return response.data;
    } catch (error) {
        console.error(`계약 상세 조회 실패 (contractId: ${contractId}):`, error);
        throw error;
    }
}

export async function signContract(contractId: string, sign_x: number, sign_y: number, sign_page: number, pre_signed_sign_uri: string): Promise<UploadContractResponse> {
    try {
        console.log(pre_signed_sign_uri);

        const response = await contractAxiosInstance.patch<UploadContractResponse>(
            `/contract/${contractId}/sign`,
            {
                sign_x,
                sign_y,
                sign_page,
                pre_signed_sign_uri
            }
        );
        return response.data;
    } catch (error) {
        console.error("서명 요청 실패:", error);
        throw error;
    }
}

export async function sendContractInviteEmail(contractId: string, email: string, subject: string, html: string): Promise<void> {
    try {
        await contractAxiosInstance.post(`/contract/${contractId}/email`, {
            opponent_email: email,
            subject: subject,
            html_content: html,
        });
    } catch (error: any) {
        console.error(`초대 이메일 전송 실패 (contractId: ${contractId}):`, error);
        throw error;
    }
}

export async function acceptContractInvite(contractId: string): Promise<UploadContractResponse> {
    try {
        const response = await contractAxiosInstance.patch<UploadContractResponse>(
            `/contract/${contractId}/email`
        );
        return response.data;
    } catch (error) {
        console.error("초대 이메일 수락 실패:", error);
        throw error;
    }
}

// 계약서 재업로드
export async function reuploadContract(contractId: string, file: File): Promise<UploadContractResponse> {
    try {
        const formData = new FormData();
        formData.append("contract_file", file);

        const response = await contractAxiosInstance.patch<UploadContractResponse>(
            `/contract/${contractId}/file/reupload/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(`계약서 재업로드 실패 (contractId: ${contractId}):`, error);
        throw error;
    }
}