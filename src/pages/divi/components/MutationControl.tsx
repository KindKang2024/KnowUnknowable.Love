import React from 'react';
import {Checkbox} from '../../../components/ui/checkbox.tsx';
import {Ban} from 'lucide-react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "../../../components/ui/tooltip.tsx";

interface MutationControlProps {
    isMutable: boolean;
    isCompleted: boolean;
    index: number;
    onMutate: (checked: boolean, index: number) => void;
    textLineChangeable?: string;
    textLineNotChangeable?: string;
}

export const MutationControl: React.FC<MutationControlProps> = ({
    isMutable,
    isCompleted,
    index,
    onMutate,
    textLineChangeable,
    textLineNotChangeable
}) => {
    if (!isCompleted) {
        return <div className="w-4 h-4" />;
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <div className="flex items-center justify-center">
                        {isMutable ? (
                            <>
                                <Checkbox
                                    className="w-4 h-4 text-[#9b87f5]/60 data-[state=checked]:bg-[#9b87f5] data-[state=checked]:text-white border-[#9b87f5]/60"
                                    id={`mutation-${index}`}
                                    onCheckedChange={(checked) => onMutate(checked as boolean, index)}
                                />
                            </>
                        ) : (
                            <Ban className="w-4 h-4 text-gray-500/60" strokeWidth={1.5} />
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    align="end"
                    sideOffset={5}
                    className="max-w-[280px] w-fit px-4 py-2  text-center"
                >
                    {isMutable ? (
                        <>
                            <p className="whitespace-normal">{textLineChangeable}</p>
                            {/* <p className="text-xs text-gray-400 whitespace-normal">
                                Position {6 - index} from bottom
                            </p> */}
                        </>
                    ) : (
                        <>
                            <p className="whitespace-normal">
                                {textLineNotChangeable}
                            </p>
                            {/* <p className="text-xs text-gray-400 whitespace-normal">
                                Position {6 - index} from bottom
                            </p> */}
                        </>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}; 