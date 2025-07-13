export default function updateRecentContractIds(newId: string): void {
    const storageKey = "recentContractIds";

    try {
        const existing = JSON.parse(sessionStorage.getItem(storageKey) || "[]") as string[];

        const withoutNewId = existing.filter((id) => id !== newId);

        const updated = [newId, ...withoutNewId].slice(0, 3);

        sessionStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
        console.error("recentContractIds 업데이트 실패:", e);
        sessionStorage.setItem(storageKey, JSON.stringify([newId]));
    }
}