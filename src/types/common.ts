export type VerifyStatus = 'idle' | 'verifying' | 'verified' | 'unverified';
export type VerificationIntent = 'idle' | 'view' | 'unlock'

// export type ModalType = 'login' | 'subscribe' | 'invest' | 'joinCommunityLottery' | 'willSignature' | 'enlightenment' | 'gua';

export enum ModalType {
    // LOGIN = 'LOGIN',
    WILL_SIGNATURE = 'WILL_SIGNATURE',
    ENLIGHTENMENT = 'ENLIGHTENMENT',
    GUA = 'GUA',
    INVEST = 'INVEST',
    VERIFICATION = 'VERIFICATION',
    CONNECT_DAO = 'CONNECT_DAO',
    // JOIN_COMMUNITY_LOTTERY = 'joinCommunityLottery',
}


export type SpeedMode = "slow" | "normal" | "fast";

export const SpeedModeConfig: Record<SpeedMode, { label: string, speed: number, next: SpeedMode }> = {
    slow: { label: "Slow", speed: 0.05, next: "normal" },
    normal: { label: "Normal", speed: 0.1, next: "fast" },
    fast: { label: "Fast", speed: 0.2, next: "slow" }
}