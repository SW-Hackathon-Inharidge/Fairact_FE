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
    pageIndex: number;
    vertices: { x: number; y: number }[];
}

export interface Clause {
    id: number;
    text: string;
    segmentPositions: SegmentPosition[];
    reasonType: string;
    reason: string;
    suggestion: string;
    checkedAt: number;
    isChecked: boolean;
}

export interface UploadContractResponse {
    id: string;
    title: string;
    owner_id: number;
    worker_id: number;
    is_owner_signed: boolean;
    is_worker_signed: boolean;
    is_invite_accepted: boolean;
    file_uri: string;
    file_hash: string;
    file_processed: boolean;
    worker_sign_x: number;
    worker_sign_y: number;
    worker_sign_scale: number;
    owner_sign_x: number;
    owner_sign_y: number;
    owner_sign_scale: number;
    clauses: Clause[];
}

// 최근 열람 계약 3건 조회
export async function fetchRecentContracts(): Promise<ContractSummaryDTO[]> {
    try {
        const response = await contractAxiosInstance.get<ContractSummaryDTO[]>("/contract/list/recent");
        return response.data;
    } catch (error) {
        console.error("최근 계약 3건 조회 실패:", error);
        throw error;
    }
}

// 내 서명 필요 계약 3건 조회
export async function fetchContractsRequiringMySign(): Promise<ContractSummaryDTO[]> {
    try {
        const response = await contractAxiosInstance.get<ContractSummaryDTO[]>("/contract/list/require/me");
        return response.data;
    } catch (error) {
        console.error("내 서명 필요 계약 3건 조회 실패:", error);
        throw error;
    }
}

// 상대방 서명 필요 계약 3건 조회
export async function fetchContractsRequiringOpponentSign(): Promise<ContractSummaryDTO[]> {
    try {
        const response = await contractAxiosInstance.get<ContractSummaryDTO[]>("/contract/list/require/opponent");
        return response.data;
    } catch (error) {
        console.error("상대방 서명 필요 계약 3건 조회 실패:", error);
        throw error;
    }
}

// 계약서 업로드 및 계약 생성
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

// 이메일 초대 전송 함수
export async function sendContractInviteEmail(contractId: string, email: string, subject: string, html: string): Promise<void> {
    try {
        const payload = {
            opponent_email: email,
            subject: subject,
            html_content: html,
        };

        await contractAxiosInstance.post(`/contract/${contractId}/email`, payload);
        console.log("초대 이메일 전송 성공");
    } catch (error: any) {
        console.error(`계약서 재업로드 실패 (contractId: ${contractId}):`, error);
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

export async function signContract(contractId: string, sign_x: number, sign_y: number): Promise<UploadContractResponse> {
    try {
        const response = await contractAxiosInstance.patch<UploadContractResponse>(
            `/contract/${contractId}/sign`,
            {
                sign_x,
                sign_y,
            }
        );
        return response.data;
    } catch (error) {
        console.error("서명 요청 실패:", error);
        throw error;
    }
}