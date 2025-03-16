export type VerifyStatus = 'idle' | 'verifying' | 'verified' | 'unverified';
export type VerificationIntent = 'idle' | 'view' | 'unlock'

// export type ModalType = 'login' | 'subscribe' | 'invest' | 'joinCommunityLottery' | 'willSignature' | 'enlightenment' | 'gua';

export enum ModalType {
    LOGIN = 'LOGIN',
    WILL_SIGNATURE = 'WILL_SIGNATURE',
    ENLIGHTENMENT = 'ENLIGHTENMENT',
    GUA = 'GUA',
    INVEST = 'INVEST',
    // JOIN_COMMUNITY_LOTTERY = 'joinCommunityLottery',
}


export type SpeedMode = "normal" | "fast" | "instant";