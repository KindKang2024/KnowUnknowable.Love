import React from 'react';
import {Checkbox} from '../../../components/ui/checkbox.tsx';
import {Ban} from 'lucide-react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "../../../components/ui/tooltip.tsx";

interface MutationCheckboxProps {
    mutability: boolean;
    index: number;
    onMutate: (checked: boolean, index: number) => void;
}

export const MutationCheckbox: React.FC<MutationCheckboxProps> = ({ index, mutability, onMutate }) => {
    return (
        <div className="flex flex-row gap-3 items-center">
            <label className="text-xs text-[#9b87f5]/60">
                Mutations:
            </label>

            {mutability ? (
                <div className="flex flex-row gap-2 items-center">
                    <div key={index} className="flex items-center gap-1">
                        {mutability ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div>
                                            <Checkbox
                                                className="w-4 h-4 text-[#9b87f5]/60"
                                                id={`mutation-${index}`}
                                                onCheckedChange={(checked) => {
                                                    onMutate(checked as boolean, index);
                                                }}
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        sideOffset={5}
                                        className="max-w-[280px] w-fit px-4 py-2"
                                    >
                                        <p className="whitespace-normal">Click to transform this line (爻) into its opposite</p>
                                        <p className="text-xs text-gray-400 whitespace-normal">Position {6 - index} from bottom</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <TooltipProvider>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <Ban className="w-4 h-4 text-gray-500/60" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[280px] w-fit">
                                        <p className="whitespace-normal">This line (爻) cannot be transformed</p>
                                        <p className="text-xs text-gray-400 whitespace-normal">Position {6 - index} from bottom</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 bg-gray-800/30 px-3 py-1.5 rounded-md">
                                <Ban className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-400">No Mutations Available</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] w-fit">
                            <p className="whitespace-normal">This hexagram has no changing lines</p>
                            <p className="text-xs text-gray-400 whitespace-normal">All lines are stable in their current state</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
}; 