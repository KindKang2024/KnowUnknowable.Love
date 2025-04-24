import React, {useEffect, useRef, useState} from 'react';
import {FloatingPanel, Section} from './components/FloatingPanel.tsx';
import {useToast} from '@/hooks/use-toast.ts';
import {Button} from '@/components/ui/button.tsx';
import {GuaSection, MutationGuaSection} from './components/GuaSection.tsx';
import {ResultGrid} from './components/ResultGrid.tsx';
import {useDivinationStore} from '@/stores/divineStore';
import {useUIStore} from '@/stores/uiStore';
import {DivinationRequest, useCreateDivination} from '@/services/api';
import DiviButton from '@/pages/divi/components/DiviButton.tsx';
import {ModalType} from '@/types/common.ts';
import {Gua} from '@/stores/Gua.ts';
import {DiviState} from '@/types/divi';
import {useNavigate} from 'react-router-dom';
import {NiceButton} from '@/components/ui/styled/nice-button.tsx';
import {keccak256, stringToHex} from 'viem';
import {AmountSelect} from '@/components/AmountSelect.tsx';
import {Loader2} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {DiviPanelData} from '@/i18n/data_types.ts';
import {DukiInActionToDeepseekDAO} from '@/components/DukiInActionToDeepseekDAO.tsx';

const DiviPanel: React.FC<{ diviPanelData: DiviPanelData }> = ({ diviPanelData }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const { will, isDivinationCompleted, divinationCompleted,
        getTotalMutationCount, gua, getMutationGua, reset,
        divide, getTotalDivisions, getCurrentRound, mutate,
        willSignature, setWillSignature,
        setStage, stage,
        visibility,
        entry,
        recordDivination
    } = useDivinationStore();

    const [selectedAmount, setSelectedAmount] = useState<number>(1);

    const { setElevated, setDivideReady, speedMode, setSpeedMode,
        autoReviewInterval, dividePhase,
        setAutoReviewInterval, setDiviFocusKey } = useUIStore();
    const [selectedYinCount, setSelectedYinCount] = useState<number>(6);
    const panelRef = useRef<HTMLDivElement>(null);

    // Handle exit/return navigation
    const handleExit = () => {
        if (window.history.length > 2) {
            navigate(-1); // Go back one step in history
        } else {
            navigate('/'); // Navigate to home
        }
        setElevated(false);
        setDivideReady(false);
        reset();
    };
    const { toast } = useToast();

    const { mutateAsync: createDivination,
        isError: createDivinationError,
        isPending: createDivinationPending,
        isSuccess: createDivinationSuccess } = useCreateDivination();

    const handleCreateDivination = async () => {
        if (entry || createDivinationPending) {
            // Already created or in progress
            return;
        }

        try {
            const divinationData: DivinationRequest = {
                will: will,
                will_hash: keccak256(stringToHex(will)),
                will_signature: willSignature,
                manifestation: gua.toOpsString(),
                interpretation: "",
                visibility: visibility,
                dao_money: 0,
                dao_hash: '',
                //other info
                lang: i18n.language,
                gua: gua.getBinaryString(),
                mutability: gua.getMutabilityArray(),
            };

            const data = await createDivination(divinationData);

            data.gua = Gua.createFromOpsString(data.manifestation);

            recordDivination(data);
            toast({
                title: diviPanelData.toasts.divinationComplete.title,
                description: diviPanelData.toasts.divinationComplete.description,
            });
            // toast({
            //     title: "Your Divination is Complete And Saved",
            //     description: "You can connect with the DAO to deep seek its meaning.",
            // });
        } catch (error) {
            console.error("DeepSeek error:", error);

            // Extract the error message from the API response if available
            let errorMessage = "Failed to process your reading. Please try again.";

            if (error instanceof Error) {
                // Use the error message from the API if available
                errorMessage = error.message || errorMessage;
            }

            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        }
    };

    useEffect(() => {
        if (divinationCompleted && (entry === null || entry === undefined)
            && !createDivinationPending && !createDivinationSuccess) {
            handleCreateDivination();
        }
    }, [divinationCompleted]);

    const handleTestDivide = () => {
        if (isDivinationCompleted()) {
            console.log("Reset", selectedYinCount);
            reset(true);
            return;
        }
        // console.log("Divide", selectedYinCount);
        for (let i = 0; i < 17; i++) {
            const yinCountArray = [2, 3, 4, 6, 7, 8, 9, 10];
            // random one
            const yinCount = yinCountArray[Math.floor(Math.random() * yinCountArray.length)] * 3;
            divide(yinCount);
        }
    };

    const { openModal } = useUIStore();

    // Determine step completion status
    const isStep1Completed = willSignature !== '';
    const isStep2Completed = isStep1Completed && isDivinationCompleted();
    const isStep3Completed = isStep2Completed && entry?.interpretation !== '';
    console.log(isStep1Completed, isStep2Completed, isStep3Completed);

    return (
        <FloatingPanel
            title={diviPanelData.title}
            defaultPosition={{ x: "1%", y: "10%" }}
            showExitButton={true}
            onExit={handleExit}
        >
            <Section
                title={diviPanelData.step1.title}
                stepNumber={1}
                isCompleted={isStep1Completed}
                defaultOpen={false}
            >
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex flex-col gap-3">
                            <div className="text-sm text-indigo-300 bg-indigo-950/30 backdrop-blur-sm rounded-md p-2.5 border border-indigo-500/20">
                                {will}
                            </div>
                            <div className="self-end">
                                <NiceButton
                                    onClick={() => openModal(ModalType.WILL_SIGNATURE)}>
                                    {willSignature !== '' ? diviPanelData.step1.divinationConsentProof : diviPanelData.step1.divinationConsentLabel}
                                </NiceButton>
                            </div>
                        </div>
                    </div>
                </div >
            </Section>

            <Section
                title={diviPanelData.step2.title}
                stepNumber={2}
                isCompleted={isStep2Completed}
                defaultOpen={stage !== DiviState.FREE}
            >
                <div className="space-y-4">

                    <div className="space-y-2">
                        <ResultGrid
                            label="Division"
                            type="number"
                            textProgress={`${diviPanelData.step2.textProgress}`}
                            textLineChangeable={diviPanelData.step2.textLineChangeable}
                            textLineNotChangeable={diviPanelData.step2.textLineNotChangeable}
                        />
                    </div>

                    <GuaSection
                        currentDivisions={getTotalDivisions()}
                        binaryCodeString={gua.getBinaryString()}
                    />

                    <MutationGuaSection
                        currentDivisions={getTotalDivisions()}
                        binaryCodeString={gua.getMutationGuaId()}
                        totalMutationCount={getTotalMutationCount()}
                    />

                    <div className="flex flex-col gap-2 pt-2">
                        <div className="text-xs text-indigo-300 text-center">
                            {!isDivinationCompleted() ? (
                                <div className="text-center">
                                    {`(${getTotalDivisions()}/18) ${diviPanelData.step2.textChangesInProgress}: ${diviPanelData.dividePhasesTextArray[dividePhase] ?? diviPanelData.beforeDividePhaseText}`}
                                </div>
                            ) : isDivinationCompleted() && !createDivinationSuccess ? (
                                createDivinationError ? (
                                    <span>{diviPanelData.createDivinationError}</span>
                                ) : (
                                    <span>
                                        {/* Divination completed. Ready to save. */}
                                        {diviPanelData.step3.textDivinationCompleted}
                                    </span>
                                )
                            ) : isDivinationCompleted() && createDivinationSuccess ? (
                                <div className="">
                                    <div>
                                        <span>{diviPanelData.mutationsCountPrefix} {gua.getTotalManifestationsCount()} {diviPanelData.mutationsCountSuffix} </span>
                                    </div>
                                    {gua.getTotalManifestationsCount() > 1 && (
                                        <div className="text-xs text-indigo-300 font-medium mb-2 text-center">
                                            {diviPanelData.inspectMutationTip}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span>{diviPanelData.startDivideTip}</span>
                            )}
                        </div>
                        {/* diving including start  */}
                        {
                            !isDivinationCompleted() && (
                                <DiviButton
                                    divinationStarted={stage !== DiviState.FREE}
                                    disabled={willSignature === ''}
                                    onStartDivination={() => {
                                        if (stage === DiviState.FREE) {
                                            setStage(DiviState.DIVI_START);
                                            setElevated(true);
                                        }
                                    }}
                                    onChangeSpeedMode={(nextMode) => {
                                        setSpeedMode(nextMode);
                                    }}
                                    speedMode={speedMode}
                                />
                            )
                        }

                        {/* saving divination */}
                        {isDivinationCompleted() && (
                            <Button
                                onClick={handleCreateDivination}
                                disabled={createDivinationSuccess || createDivinationPending}
                                className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white border border-indigo-500/50 shadow-lg shadow-indigo-900/20 font-medium py-2 px-4 rounded-md transition-all duration-300"
                            >
                                {createDivinationPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {/* Saving... */}
                                        {diviPanelData.textSaving}
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {/* {createDivinationError ? "Retry Save" : "Divination Completed"} */}
                                        {createDivinationError ? diviPanelData.textRetrySave : diviPanelData.textSaveSuccess}
                                    </span>
                                )}
                            </Button>
                        )}


                        {/* <Button
                            onClick={handleTestDivide}
                            className="bg-gradient-to-r from-indigo-600/90 to-purple-700/90 hover:from-indigo-600 hover:to-purple-700 text-white border border-indigo-500/50 mt-4"
                        >
                            {isDivinationCompleted() ? "Reset Divination" : "Divide"}
                        </Button> */}

                    </div>


                </div>
            </Section>

            <Section
                title={diviPanelData.step3.title}
                stepNumber={3}
                isCompleted={isStep3Completed}
                defaultOpen={false}
            >
                <div className="text-sm text-indigo-300/80 bg-indigo-950/20 backdrop-blur-sm rounded-md p-2.5 border border-indigo-500/10 mb-3">
                    {/* Connect the DAO and deep seek its meaning by paying any amount of money. The money will be used to demonstrate the concept of 'DUKI in action'. DUKI /dju:ki/ is Decentralized Universal Kindness Income For All lives. */}
                    {diviPanelData.step3.description}
                </div>

                <div className="mb-4">
                    <AmountSelect
                        amounts={[1, 2, 3]}
                        onSelect={setSelectedAmount}
                        defaultAmount={selectedAmount}
                        readonly={entry?.dao_tx !== ''}
                    />
                </div>

                <DukiInActionToDeepseekDAO
                    divination={entry}
                    selectedAmount={selectedAmount}
                    onSuccess={(data) => {
                        recordDivination(data);
                    }}
                />
            </Section>
        </FloatingPanel >
    );
};

export default DiviPanel; 