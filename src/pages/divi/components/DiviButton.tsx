import React from 'react';
import {Hourglass, Loader2, Play, Timer, Zap} from 'lucide-react';
import {Button} from '@/components/ui/button.tsx';
import {useDivinationStore} from '@/stores/divineStore';
import {cn} from '@/lib/utils';
import {useUIStore} from "@/stores/uiStore.ts";
import {DiviState} from '@/types/divi';

interface DiviActionButtonProps {
    isDeepSeekUsed: boolean;
    isError: boolean;
    isPending: boolean;
    // handleDeepSeek: () => void;
    // openEnlightenmentModal: () => void;
}

const DiviButton: React.FC<DiviActionButtonProps> = ({
    // isDeepSeekUsed,
    isError,
    isPending,
    // handleDeepSeek,
    // openEnlightenmentModal,
}) => {
    const {
        isDivinationCompleted,
        stage,
        setStage,
        getTotalDivisions,
        getCurrentRound,
    } = useDivinationStore();

    const {
        setDivideReady,
        setElevated,
        getSpeedMode,
        setSpeedMode,
    } = useUIStore();

    // if (isError) {
    //     return (
    //         <Button
    //             variant="outline"
    //             className="w-full border-red-500/20 hover:bg-red-500/10 text-red-500 transition-all duration-300 shadow-sm"
    //             onClick={handleDeepSeek}
    //         >
    //             <AlertCircle className="w-4 h-4 mr-2" />
    //             Retry DeepSeek
    //         </Button>
    //     );
    // }

    const handleClick = () => {
        // if (isDivinationCompleted()) {
        //     if (isDeepSeekUsed) {
        //         openEnlightenmentModal();
        //     } else {
        //         handleDeepSeek();
        //     }
        // } else 
        if (stage === DiviState.FREE) {
            setStage(DiviState.DIVI_START);
            setDivideReady(true);
            setElevated(true);
        } else {
            const currentSpeedMode = getSpeedMode();
            if (currentSpeedMode === "normal") {
                setSpeedMode("fast");
            } else if (currentSpeedMode === "fast") {
                setSpeedMode("instant");
            } else {
                setSpeedMode("normal");
            }
        }
    };

    // Separate speed control button when divining
    const renderSpeedButton = () => {
        // if (stage !== DiviState.FREE && !isDivinationCompleted() && !isPending) {
        if (stage !== DiviState.FREE && !isPending) {
            const currentSpeedMode = getSpeedMode();
            return (
                <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 border-indigo-700/50 bg-indigo-900/30 hover:bg-indigo-800/40 text-indigo-300 backdrop-blur-sm transition-all duration-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        const currentSpeedMode = getSpeedMode();
                        if (currentSpeedMode === "normal") {
                            setSpeedMode("fast");
                        } else if (currentSpeedMode === "fast") {
                            setSpeedMode("instant");
                        } else {
                            setSpeedMode("normal");
                        }
                    }}
                >
                    {currentSpeedMode === "normal" && <Hourglass className="w-4 h-4" />}
                    {currentSpeedMode === "fast" && <Timer className="w-4 h-4" />}
                    {currentSpeedMode === "instant" && <Zap className="w-4 h-4" />}
                </Button>
            );
        }
        return null;
    };

    const renderButtonContent = () => {
        if (isPending) {
            return (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                </span>
            );
        }

        const opsName = isDivinationCompleted() ? "Review" : "Divination";

        // if (isDivinationCompleted()) {
        //     if (isDeepSeekUsed) {
        //         return (
        //             <span className="flex items-center justify-center gap-2">
        //                 <Sparkles className="w-4 h-4" />
        //                 Meditate on Results
        //                 <MoveRight className="w-4 h-4" />
        //             </span>
        //         );
        //     }
        //     return (
        //         <span className="flex items-center justify-center gap-2">
        //             <Sparkles className="w-4 h-4" />
        //             DeepSeek It
        //         </span>
        //     );
        // }

        if (stage === DiviState.FREE) {
            return (
                <span className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Divine
                </span>
            );
        }

        // Divining state with different speed modes
        const currentSpeedMode = getSpeedMode();
        return (
            <span className="flex items-center justify-center gap-2">
                {currentSpeedMode === "normal" && (
                    <>
                        <Hourglass className="w-4 h-4" />
                       Normal {opsName} 
                    </>
                )}
                {currentSpeedMode === "fast" && (
                    <>
                        <Timer className="w-4 h-4 animate-pulse" />
                        Fast {opsName}
                    </>
                )}
                {currentSpeedMode === "instant" && (
                    <>
                        <Zap className="w-4 h-4" />
                        Super Fast {opsName}
                    </>
                )}
            </span>
        );
    };

    const getButtonStyle = () => {
        if (isPending) {
            return "bg-indigo-900/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50";
        }

        if (stage === DiviState.FREE) {
            return "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white border border-indigo-500/50 shadow-lg shadow-indigo-900/20";
        }

        // if (isDivinationCompleted()) {
        //     return isDeepSeekUsed
        //         ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
        //         : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";
        // }

        // Divining state
        const currentSpeedMode = getSpeedMode();
        if (currentSpeedMode === "normal") {
            return "bg-gradient-to-r from-indigo-600/90 to-purple-700/90 hover:from-indigo-600 hover:to-purple-700 text-white border border-indigo-500/50";
        } else if (currentSpeedMode === "fast") {
            return "bg-gradient-to-r from-purple-600/90 to-fuchsia-700/90 hover:from-purple-600 hover:to-fuchsia-700 text-white border border-purple-500/50";
        } else {
            return "bg-gradient-to-r from-fuchsia-600/90 to-pink-700/90 hover:from-fuchsia-600 hover:to-pink-700 text-white border border-fuchsia-500/50";
        }
    };

    // Render stage-specific hint label
    const renderHintLabel = () => {
        if (isPending) {
            return (
                <div className="text-xs text-indigo-400/80 mb-2 text-center">
                    <span>Processing your divination...</span>
                </div>
            );
        }

        if (isDivinationCompleted()) {
            // if (isDeepSeekUsed) {
            //     return (
            //         <div className="text-xs text-indigo-300 mb-2 text-center">
            //             <span>Divination complete - explore your insights</span>
            //         </div>
            //     );
            // }
            return (
                <div className="text-xs text-indigo-300 mb-2 text-center">
                    <span>Completed - Please Review Divine Answer</span>
                </div>
            );
        }

        if (stage === DiviState.FREE) {
            return (
                <div className="text-xs text-indigo-300 mb-2 text-center">
                    <span>Ready to begin your divination journey</span>
                </div>
            );
        }

        // Special operation stages
        if (stage === DiviState.DIVI_HEAVEN_EARTH_BORN) {
            return (
                <div className="text-xs text-indigo-300 mb-2 text-center">
                    <span>Heaven and Earth Born (天地生)</span>
                </div>
            );
        }

        if (stage === DiviState.DIVI_HUMAN_BORN) {
            return (
                <div className="text-xs text-indigo-300 mb-2 text-center">
                    <span>Human Born (挂一象三 ❤️)</span>
                </div>
            );
        }

        if (stage === DiviState.DIVI_REMINDER_COMPUTATION) {
            return (
                <div className="text-xs text-indigo-300 mb-2 text-center">
                    <span>Reminder Computation (揲四)</span>
                </div>
            );
        }

        if (stage === DiviState.DIVI_REMINDER_TAKEN) {
            return (
                <div className="text-xs text-indigo-300 mb-2 text-center">
                    <span>Reminder Taken (归奇)</span>
                </div>
            );
        }

        // Divining in progress (default case)
        const currentSpeedMode = getSpeedMode();
        const totalDivisions = getTotalDivisions();
        const currentRound = getCurrentRound();
        const progressText = totalDivisions > 0 ? `${currentRound}/6` : "";

        return (
            <div className="text-xs mb-2 text-center">
                <span className={
                    currentSpeedMode === "normal" ? "text-indigo-300" :
                        currentSpeedMode === "fast" ? "text-purple-300" :
                            "text-fuchsia-300"
                }>
                    Divining in progress {progressText && `(${progressText})`}
                </span>
                <div className="text-indigo-400/60 mt-1">Click speed button to change pace</div>
            </div>
        );
    };

    return (
        <div className="w-full">
            {renderHintLabel()}
            <div className="flex items-center">
                <Button
                    className={cn(
                        "flex-1 font-medium py-2 px-4 rounded-md transition-all duration-300",
                        getButtonStyle()
                    )}
                    onClick={handleClick}
                    disabled={isPending}
                >
                    {renderButtonContent()}
                </Button>
                {renderSpeedButton()}
            </div>
        </div>
    );
};

export default DiviButton;