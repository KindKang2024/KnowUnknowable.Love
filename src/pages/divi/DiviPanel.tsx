import React, {useEffect, useRef, useState} from 'react';
import {FloatingPanel, Section} from './components/FloatingPanel.tsx';
import html2canvas from "html2canvas";
import {dataURLtoBlob} from "@/utils/imageUtils.ts";
import {useToast} from '@/hooks/use-toast.ts';
import {PaymentSection} from './components/PaymentSection.tsx';
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
import { keccak256, stringToHex } from 'viem';

const DiviPanel: React.FC = () => {
    const navigate = useNavigate();
    const [showCustomAmount, setShowCustomAmount] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number>(3);
    const [customAmount, setCustomAmount] = useState<string>("0.1");
    const [shareImage, setShareImage] = useState<string>("");

    const { will, isDivinationCompleted,divinationCompleted,
        getTotalMutationCount, gua, getMutationGua, reset,
        divide, getTotalDivisions, getCurrentRound, mutate,
        willSignature,  setWillSignature,
        setStage, stage,
        id,
        visibility,
        recordDivination
    } = useDivinationStore();


    const [selectedYinCount, setSelectedYinCount] = useState<number>(6);
    const panelRef = useRef<HTMLDivElement>(null);

    // Handle exit/return navigation
    const handleExit = () => {
        if (window.history.length > 2) {
            navigate(-1); // Go back one step in history
        } else {
            navigate('/'); // Navigate to home
        }
    };

    const handleAmountSelect = (amount: number | null) => {
        if (amount === null) {
            setShowCustomAmount(true);
            setSelectedAmount(Number(customAmount));
        } else {
            setShowCustomAmount(false);
            setSelectedAmount(amount);
        }
    };

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value);
        setSelectedAmount(Number(value));
    };

    const downloadCardAsImage = async () => {
        if (panelRef.current) {
            try {
                const canvas = await html2canvas(panelRef.current);
                const image = canvas.toDataURL("image/png", 0.8);
                setShareImage(image);
            } catch (error) {
                console.error('Error capturing image:', error);
            }
        }
    };

    const handleShare = async () => {
    };

    const handleShareToTwitter = () => {
        const imageBlob = dataURLtoBlob(shareImage);
        const imageUrl = URL.createObjectURL(imageBlob);

        const tweetText = `Just received my divine guidance through the I-Ching! 🔮\nRound ${getCurrentRound()}/${getTotalDivisions()}\n#iching #divination\n\nView my reading: ${imageUrl}`;
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

        window.open(shareUrl, '_blank');

        setTimeout(() => {
            URL.revokeObjectURL(imageUrl);
        }, 60000);

    };



    const handleDownload = () => {
        const link = document.createElement('a');
        link.download = 'iching-divination.png';
        link.href = shareImage;
        link.click();
    };
    const { toast } = useToast();
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [hasPaymentError, setHasPaymentError] = useState(false);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);

    const handlePayment = async () => {
        if (isPaymentComplete && !hasPaymentError) {
            window.open('/dao-info', '_blank');
            return;
        }

        setIsPaymentProcessing(true);
        setHasPaymentError(false);

        try {
            // Simulate payment processing with 30% success rate
            await new Promise(resolve => setTimeout(resolve, 2000));
            const isSuccess = Math.random() < 0.3;

            if (!isSuccess) {
                throw new Error("Payment failed");
            }

            setIsPaymentComplete(true);
            setIsPaymentProcessing(false);

            toast({
                title: "Payment Successful",
                description: "Click to learn about DAO flow.",
            });
        } catch (error) {
            setHasPaymentError(true);
            setIsPaymentProcessing(false);

            toast({
                variant: "destructive",
                title: "Payment Failed",
                description: "Please try again.",
            });
        }
    };
    const { mutateAsync: createDivination,
        isError: createDivinationError,
        isPending: createDivinationPending,
        isSuccess: createDivinationSuccess,
        data: entry } = useCreateDivination();

    const [showMeditationDialog, setShowMeditationDialog] = useState(false);

    const handleCreateDivination = async () => {
        if (id !== '' && !createDivinationError) {
            setShowMeditationDialog(true);
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
                lang: 'en', // todo : multiple language
                gua: gua.getBinaryString(),
                mutability: gua.getMutabilityArray(),
            };

            const data = await createDivination(divinationData);

            data.gua = Gua.createFromOpsBigint(BigInt(data.manifestation));

            recordDivination(data);
            toast({
                title: "Your Divination is Complete And Saved",
                description: "You can connect with the DAO to deep seek its meaning.",
            });
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
            // handleDeepSeek();
            handleCreateDivination();
        }
    }, [divinationCompleted]);


    const handleDeepSeek = async () => {
        if (id !== '' && !createDivinationError) {
            setShowMeditationDialog(true);
            return;
        }

        try {

            const divinationData: DivinationRequest = {
                will: will,
                will_signature: willSignature,
                manifestation: gua.toOpsString(),
                interpretation: "",
                visibility: visibility,
                dao_money: selectedAmount,
                dao_hash: willSignature,
                //other info
                lang: 'en', // todo : multiple language
                gua: gua.getBinaryString(),
                mutability: gua.getMutabilityArray(),
            };

            const data = await createDivination(divinationData);

            data.gua = Gua.createFromOpsBigint(BigInt(data.manifestation));

            recordDivination(data);
            toast({
                title: "Reading Complete",
                description: "Your divine reading is ready for meditation.",
            });
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

    const handleTestDivide = () => {
        if (isDivinationCompleted()) {
            console.log("Reset", selectedYinCount);
            reset();
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
    const isStep2Completed = isDivinationCompleted();
    const isStep3Completed = createDivinationSuccess;

    return (
        <FloatingPanel
            title="DAO IS ALL LOVE"
            showExitButton={true}
            onExit={handleExit}
        >
            <Section
                title="Will Awaken"
                stepNumber={1}
                isCompleted={isStep1Completed}
                defaultOpen={true}
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
                                    {willSignature !== '' ? 'View Divinable Proof' : 'Sign to Prove it is Divineable'}
                                </NiceButton>
                            </div>
                        </div>
                    </div>
                </div >
            </Section>

            <Section
                title="Divide To Divine"
                stepNumber={2}
                isCompleted={isStep2Completed}
                defaultOpen={stage !== DiviState.FREE}
            >
                <div className="space-y-4">

                    <div className="space-y-2">
                        <ResultGrid
                            label="Division"
                            type="number"
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
                        <DiviButton
                            isDeepSeekUsed={createDivinationSuccess}
                            isError={createDivinationError}
                            isPending={createDivinationPending}
                            // handleDeepSeek={handleDeepSeek}
                            // openEnlightenmentModal={() => openModal(ModalType.ENLIGHTENMENT, entry)}
                        />
                    </div>


                </div>
            </Section>
            <Section
                title="Love Into DAO"
                stepNumber={3}
                isCompleted={isStep3Completed}
                defaultOpen={isStep2Completed}
            >
                <div className="text-sm text-indigo-300/80 bg-indigo-950/20 backdrop-blur-sm rounded-md p-2.5 border border-indigo-500/10 mb-3">
                    The DAO is used an proof of concept for DUKI in action. DUKI /dju:ki/ is Decentralized Universal Kindness Income For All lives.
                    You must connect with the DAO to deep seek its meaning.
                </div>

                <PaymentSection
                    selectedAmount={selectedAmount}
                    showCustomAmount={showCustomAmount}
                    customAmount={customAmount}
                    onAmountSelect={handleAmountSelect}
                    onCustomAmountChange={handleCustomAmountChange}
                    onPayment={handlePayment}
                    isDeepSeekUsed={createDivinationSuccess}
                    handleDeepSeek={handleDeepSeek}
                    openEnlightenmentModal={() => openModal(ModalType.ENLIGHTENMENT, entry)}
                    isDivinationCompleted={isDivinationCompleted()}
                />
            </Section>

            {/* <Section title="Debug">
                <Button
                    onClick={handleTestDivide}
                    className="bg-gradient-to-r from-indigo-600/90 to-purple-700/90 hover:from-indigo-600 hover:to-purple-700 text-white border border-indigo-500/50 mt-4"
                >
                    {isDivinationCompleted() ? "Reset Divination" : "Divide"}
                </Button>
            </Section> */}
        </FloatingPanel >
    );
};

export default DiviPanel; 