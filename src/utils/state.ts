type Role = "owner" | "worker";

export function getContractState(
  workerEmail: string | null,
  isInviteAccepted: boolean,
  isOwnerSigned: boolean,
  isWorkerSigned: boolean,
  myRole: Role
): string {
  if (workerEmail === null && myRole === "owner") {
    if(!isOwnerSigned) return "내 서명 대기";
    return "초대 전";
  }

  if (!isInviteAccepted) {
    return "초대 수락 대기";
  }

  if (isOwnerSigned && isWorkerSigned) {
    return "계약 완료";
  }

  if (
    (myRole === "owner" && !isOwnerSigned) ||
    (myRole === "worker" && !isWorkerSigned)
  ) {
    return "내 서명 대기";
  }

  return "상대 서명 대기";
}
