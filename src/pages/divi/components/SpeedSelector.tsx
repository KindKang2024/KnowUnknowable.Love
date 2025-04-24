import React from 'react';
import {Rabbit, Turtle, Zap} from 'lucide-react';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {cn} from '@/lib/utils';
import {SpeedMode} from '@/types/common';
import {usePageDiviData} from '@/i18n/DataProvider';

interface SpeedSelectorProps {
    speedMode: SpeedMode;
    onChangeSpeedMode: (speedMode: SpeedMode) => void;
}

export const SpeedSelector: React.FC<SpeedSelectorProps> = ({
    speedMode,
    onChangeSpeedMode,
}) => {
    const handleSpeedChange = (value: string) => {
        onChangeSpeedMode(value as SpeedMode);
    };

    const pageDiviData = usePageDiviData();


    const renderIcon = (mode: SpeedMode) => {
        switch (mode) {
            case "slow":
                return <Turtle className="w-4 h-4" />;
            case "normal":
                return <Rabbit className="w-4 h-4" />;
            case "fast":
                return <Zap className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full space-y-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md py-2 px-4 shadow-lg">
            <div className="flex items-center gap-4 h-6">
                <div className="text-white/90 font-medium text-xs flex items-center whitespace-nowrap">
                    {pageDiviData.diviPanelData.step2.diviSpeed}
                </div>
                <RadioGroup
                    defaultValue={speedMode}
                    value={speedMode}
                    onValueChange={handleSpeedChange}
                    className="flex items-center gap-4"
                >

                    {(["slow", "normal", "fast"] as SpeedMode[]).map((mode) => (
                        <label
                            key={mode}
                            htmlFor={`speed-${mode}`}
                            className={cn(
                                "flex items-center gap-0.5 cursor-pointer transition-all duration-200 flex-shrink-0",
                                "hover:text-white",
                                speedMode === mode && "text-white"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-all",
                                "border border-white/20 hover:border-white/40",
                                speedMode === mode && "bg-white border-indigo-300 shadow-lg"
                            )}>
                                <RadioGroupItem
                                    value={mode}
                                    id={`speed-${mode}`}
                                    className="sr-only"
                                />
                                <div className={cn(
                                    "text-white/50",
                                    speedMode === mode && "text-indigo-600 scale-110"
                                )}>
                                    {renderIcon(mode)}
                                </div>
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium whitespace-nowrap pl-1",
                                "text-white/60 hover:text-white/90",
                                speedMode === mode && "text-white font-semibold"
                            )}>
                                {pageDiviData.diviPanelData.step2.diviSpeedOptions[mode]}
                            </span>
                        </label>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
};

export default SpeedSelector; 