import React from 'react';
import {Play} from 'lucide-react';
import {Button} from '@/components/ui/button.tsx';
import {cn} from '@/lib/utils';
import {SpeedMode} from '@/types/common';
import SpeedSelector from './SpeedSelector';
import {usePageCommonData} from '@/i18n/DataProvider';

interface DiviActionButtonProps {
    divinationStarted: boolean;
    onStartDivination: () => void;
    onChangeSpeedMode: (speedMode: SpeedMode) => void;
    speedMode: SpeedMode;
    disabled: boolean;
}

const DiviButton: React.FC<DiviActionButtonProps> = ({
    divinationStarted,
    onStartDivination,
    onChangeSpeedMode,
    speedMode,
    disabled
}) => {
    const commonData = usePageCommonData();

    const getStartButtonStyle = () => {
        if (disabled) {
            return "w-full h-9 bg-gradient-to-r from-indigo-600/50 to-purple-700/50 text-white/70 border border-indigo-500/30";
        }

        return "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white border border-indigo-500/50 shadow-lg shadow-indigo-900/20";
                                        // className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white border border-indigo-500/50 shadow-lg shadow-indigo-900/20 font-medium py-2 px-4 rounded-md transition-all duration-300"
    };

    return (
        <div className="w-full space-y-3">
            {!divinationStarted ? (
                <Button
                    className={cn(
                        "w-full font-medium py-2 px-4 rounded-md transition-all duration-300",
                        getStartButtonStyle()
                    )}
                    onClick={onStartDivination}
                    disabled={disabled}
                >
                    <span className="flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        {disabled ? commonData.modals.finishConsentFirst : commonData.buttons.startDivine}
                    </span>
                </Button>
            ) : (
                <SpeedSelector
                    speedMode={speedMode} 
                    onChangeSpeedMode={onChangeSpeedMode} 
                />
            )}
        </div>
    );
};

export default DiviButton;