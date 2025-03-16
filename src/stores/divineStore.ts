/**
 * DivinationStore manages the complete I Ching divination process using Zustand.
 * It coordinates the creation of YAO instances and builds a complete Gua (hexagram).
 * Each divination requires 18 divisions (3 divisions for each of the 6 lines).
 */
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {Gua} from './Gua';
import {DiviState, Visibility} from '@/types/divi';
import {DivinationEntry} from '@/services/api';


interface DivinationState {
    will: string;
    visibility: Visibility;
    willSignature: string;
    gua: Gua;
    stage: DiviState;
    id: string;
    entry: DivinationEntry | null;
}

// Define the store actions interface
interface DivinationActions {
    divide: (yinCount: number) => void;
    isDivinationCompleted: () => boolean;
    getCurrentRound: () => number;
    getTotalDivisions: () => number;
    getMutationGua: () => string;
    getTotalMutationCount: () => number;
    getSummary: () => string;

    setStage: (stage: DiviState) => void;
    getStage: () => DiviState;

    setWillSignature: (signature: string) => void;
    setVisibility: (visibility: Visibility) => void;
    reset: () => void;
    setWill: (will: string) => void;
    mutate: (mutated: boolean, at: number) => void;

    recordDivination: (entry: DivinationEntry) => void;

}

// Create the Zustand store with immer middleware for easier state updates
export const useDivinationStore = create<DivinationState & DivinationActions>()(
    immer((set, get) => ({
        // Initial state
        id: '',
        will: 'x',
        willSignature: '',
        gua: Gua.createEmpty(),
        interpretation: '',
        visibility: 1,
        entry: null,
        stage: DiviState.FREE,

        setStage: (stage: DiviState) => {
            set(state => {
                state.stage = stage;
            });
        },
        yaos: () => get().gua.yaos,
        getStage: () => get().stage,

        // Actions
        reset: () => {
            set(state => {
                state.will = get().will;
                // state.yaos = Array.from({ length: 6 }, () => YAO.createEmpty());
                state.gua = Gua.createEmpty();
            });
        },
        setWillSignature: (signature: string) => {
            set(state => {
                state.willSignature = signature
            })
        },
        setVisibility: (visibility: Visibility) => {
            set(state => {
                state.visibility = visibility
            })
        },
        setWill: (will: string) => {
            set(state => {
                state.will = will
            })
        },
        divide: (yinCount: number) => {
            set(state => {
                state.gua.divide(yinCount);

            });
        },

        recordDivination: (entry: DivinationEntry) => {
            set(state => {
                state.entry = entry;
            })
        },

        getGua: () => get().gua,
        getMutationGua: () => get().gua.getMutationGuaId(),
        getTotalMutationCount: () => get().gua.totalMutationCount,

        mutate: (mutated: boolean, at: number) => {
            set(state => {
                if (!state.isDivinationCompleted()) {
                    return;
                }
                console.log("mutate", mutated, at);
                state.gua.mutate(mutated, at);
            });
        },

        // isDivinationCompleted: () => get().yaos[5].isCompleted(),
        isDivinationCompleted: () => get().gua.isDivinationCompleted(),

        // getCurrentRound: () => get().yaos.filter(yao => yao.isCompleted()).length,
        getCurrentRound: () => get().gua.getCurrentRound(),

        getTotalDivisions: () => {
            return get().gua.getTotalDivisions();
        },
        // getCurrentYao: () => get().yaos[get().yaos.length - 1],
        getCurrentYao: () => get().gua.getCurrentYao(),

        getSummary: () => {
            const { will } = get();
            let summary = `Divination for: "${will}"\n`;
            summary += `Progress: ${get().getTotalDivisions()}/18 divisions, ${get().getCurrentRound()}/6 lines\n`;

            if (get().isDivinationCompleted()) {
                summary += `\nFinal Hexagram:\n${get().gua.getSummary()}`;
            } else {
                summary += `\nIn progress: Building line ${get().getCurrentRound() + 1}, \n`;
            }

            return summary;
        }
    }))
);
