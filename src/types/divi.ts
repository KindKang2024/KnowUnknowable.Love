import {PointUserData} from "@/i18n/types";
import * as THREE from 'three';


export enum DiviState {
    FREE = 'FREE',
    DIVI_START = 'DIVI_START', // 50个粒子 1一个不用，一个 在上面
    DIVI_YAO_START = 'DIVI_YAO_START',
    DIVI_CHANGE_START = 'DIVI_CHANGE_START',
    DIVI_CHANGE_CONTINUE = 'DIVI_CHANGE_CONTINUE',
    DIVI_CHANGING = 'DIVI_CHANGING',
    DIVI_HEAVEN_EARTH_BORN = 'DIVI_HEAVEN_EARTH_BORN',
    DIVI_HUMAN_BORN = 'DIVI_HUMAN_BORN', // 挂一象三 （❤️） 
    DIVI_REMINDER_COMPUTATION = 'DIVI_REMINDER_COMPUTATION', // 揲四 
    DIVI_REMINDER_TAKEN = 'DIVI_REMINDER_TAKEN', //  归奇
    DIVI_CHANGE_END = 'DIVI_CHANGE_END', //  一变
    DIVI_YAO_END = 'DIVI_YAO_END', //  一yao
    DIVI_END = 'DIVI_END', //  
}

export enum DividePhase {
    WaitDivide = 0,       // Wait for the divide
    DivideIntoYinYang = 1,       // Divide Yin and Yang like make a judgement
    BornOfHeavenAndEarth = 2,  // Born of Heaven and Earth
    SetOneForThreePowers = 3,    // Set One Aside to Represent the Three Powers: Heaven, Earth, Human
    CountByFours = 4,            // Count by Fours
    GatherTheRemainders = 5      // Gather the Remainders
}

export enum DeepseekDAOState {
    PAY_TO_CONNECT = "PAY_TO_CONNECT",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    DEEPSEEK_DAO_SUCCESS = "DEEPSEEK_DAO_SUCCESS",
    ERROR = "ERROR"
  }


export type Visibility = 0 | 1;

// Animation state machine types
export type AnimationState = {
    name: DiviState;
    onEnter?: (context: DiviContext) => void;
    onUpdate?: (context: DiviContext) => void;
    onExit?: (context: DiviContext) => void;
    transitions: {
        condition: (context: DiviContext) => boolean;
        nextState: DiviState;
    }[];
};

export type DiviContext = {
    stateStartTime: number;
    stateElapsedTime: number;
    allAnimationComplete: boolean;
    firstIntersectionPoint: THREE.Vector3 | null;
    secondIntersectionPoint: THREE.Vector3 | null;
    firstIntersectionTime: number;
    lastPoint: THREE.Vector3 | null;
    diviPositions: Float32Array;
    velocities: Float32Array;
    diviData: PointUserData[];
    yinCount: number;
}


export interface StateMachine {
    currentState: DiviState;
    states: Record<DiviState, AnimationState>;
}

