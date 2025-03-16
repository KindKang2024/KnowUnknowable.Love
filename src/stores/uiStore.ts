import {create} from 'zustand';
import {Vector3} from 'three';
import {AuthenticationStatus} from '@rainbow-me/rainbowkit';
import {ModalType, SpeedMode, VerificationIntent, VerifyStatus} from '@/types/common';
import {immer} from 'zustand/middleware/immer';

enum CameraState {
    FREE = 'FREE',
    DIVINATION = 'DIVINATION',
}


export const Constants = {
    DA_YAN_ROW_SIZE: 4,
    GAO_DAO_GUA_ROW_SIZE: 8,
    GAO_DAO_CHANGE_ROW_SIZE: 6,

    SPHERE_RADIUS: 9.5,
    SPHERE_WIDTH_SEGMENTS: 18,
    SPHERE_HEIGHT_SEGMENTS: 24,
    SPHERE_OPACITY: 0.8,

    SPHERE_COLOR: '#404040',

}

export type UnitProps = {
    position: [number, number, number];
    state: string;
    group: number;
    subgroup: number | undefined;
    color?: string;
    opacity?: number;
    velocity?: Vector3;
    targetPosition?: [number, number, number];
}

enum CutState {
    READY = 'READY',
    FIRST_POINT = 'FIRST_POINT',
    SECOND_POINT = 'SECOND_POINT',
    CUTTING = 'CUTTING',
    DONE = 'DONE'
}

// Subgroups colors
const COLORS = {
    GROUP1: ['#ff0000', '#ff6b6b', '#ff9999'],
    GROUP2: ['#00ff00', '#6bff6b', '#99ff99'],
    YIN: '#0000ff',
    YANG: '#ff00ff',
    UNKNOWN: '#808080'
};


// State interface
interface UIState {
    cameraState: CameraState;
    cutState: CutState;
    units: UnitProps[];
    ringPosition: number;
    ringRotation: number;
    ringHeight: number;
    // isShatterAnimating: boolean;

    diviFocusKey: string;


    // Modal state
    activeModal: ModalType | null;
    modalData: any;

    divideReady: boolean;
    elevated: boolean;
    speedMode: SpeedMode;


    error: string;
    open: boolean;
    verificationIntent: VerificationIntent;
    verification: boolean;
    status: VerifyStatus;
    authStatus: AuthenticationStatus;

    focusedGuaBinary: string;
    guaEvolutionPlaying: boolean;


}


// Actions interface
interface UIActions {
    setAuthStatus: (status: AuthenticationStatus) => void;
    setCameraState: (state: CameraState) => void;
    setCutState: (state: CutState) => void;
    setRingPosition: (position: number) => void;
    setRingRotation: (rotation: number) => void;

    setDiviFocusKey: (key: string) => void;

    // Modal actions
    setError: (error: string) => void;
    openModal: (type: ModalType, data?: any) => void;
    closeModal: () => void;

    setVerification: (intent: VerificationIntent) => void;
    setOpen: (open: boolean) => void;
    setStatus: (status: VerifyStatus) => void;
    setDivideReady: (ready: boolean) => void;

    // result view
    focusGuaBinary: (binary: string) => void;
    setGuaEvolutionPlaying: (playing: boolean) => void;

    setElevated: (elevated: boolean) => void;
    setSpeedMode: (speedMode: SpeedMode) => void;
    getSpeedMode: () => SpeedMode;

}

// Combined store type
type UIStore = UIState & UIActions;



export const useUIStore = create<UIStore>()(
    immer((set, get) => ({
        // State
        setAuthStatus: (status: AuthenticationStatus) => set({
            authStatus: status
        }),
        guaEvolutionPlaying: true,
        setGuaEvolutionPlaying: (playing: boolean) => set({ guaEvolutionPlaying: playing }),
        focusedGuaBinary: '',
        divideReady: false,
        elevated: false,
        speedMode: 'normal',
        cameraState: CameraState.FREE,
        cutState: CutState.READY,
        diviLoaded: false,
        diviFocusKey: '',
        ringPosition: 0,
        ringRotation: 0,
        ringHeight: 0,
        isShatterAnimating: false,
        units: [],
        activeModal: null,
        modalData: null,
        error: '',
        open: false,
        verificationIntent: 'idle' as VerificationIntent,
        verification: false,
        status: 'loading' as VerifyStatus,
        authStatus: 'loading' as AuthenticationStatus,
        divination: {
            will_to_manifest: '',
            radius: 0,
            divisions: [{
                points: [
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 }
                ],
                division_line: [
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 }
                ],
                reminder_count: 0
            }],
            yao: [6, 6, 6, 6, 6, 6],
            gua: "010101"
        },
        focusGuaBinary: (binary: string) => set({ focusedGuaBinary: binary }),
        setSpeedMode: (speedMode: SpeedMode) => {
            set(state => {
                state.speedMode = speedMode;
            });
        },
        getSpeedMode: () => get().speedMode,
        setDivideReady: (ready: boolean) => {
            set(state => {
                state.divideReady = ready;
            });
        },
        setElevated: (elevated: boolean) => {
            set(state => {
                state.elevated = elevated;
            });
        },
        // Actions
        setCameraState: (state: CameraState) => set({ cameraState: state }),
        setCutState: (state: CutState) => set({ cutState: state }),
        setDiviFocusKey: (key: string) => set({ diviFocusKey: key }),
        setRingPosition: (position: number) => set({ ringPosition: position }),
        setRingRotation: (rotation: number) => set({ ringRotation: rotation }),
        setError: (error: string) => set({ error }),
        setOpen: (open) => set({ open }),
        setVerification: (intent) => set({
            verificationIntent: intent,
            verification: intent !== 'idle'
        }),
        // Modal actions
        openModal: (type, data) => set({
            activeModal: type,
            modalData: data
        }),
        closeModal: () => set({
            activeModal: null,
            modalData: null
        }),
        setStatus: (status: VerifyStatus) => set({
            status
        })
    }))
);

export { COLORS, CameraState, CutState };