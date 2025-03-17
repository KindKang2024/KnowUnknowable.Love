import React, {ReactNode, useState} from 'react';
import {DragWrapper} from './DragWrapper.tsx';
import {ArrowRight, CheckCircle2, Circle, LogOut, Triangle} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useDivinationStore} from '@/stores/divineStore';
import {DiviState} from '@/types/divi';

interface SectionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    stepNumber?: number;
    isCompleted?: boolean;
}

const Section: React.FC<SectionProps> = ({
    title,
    children,
    defaultOpen = false,
    stepNumber,
    isCompleted = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const { stage, isDivinationCompleted } = useDivinationStore();

    // Determine if this section is active based on step number and current stage
    const isActive = stepNumber !== undefined && (
        (stepNumber === 1 && stage === DiviState.FREE) ||
        (stepNumber === 2 && stage !== DiviState.FREE && !isDivinationCompleted()) ||
        (stepNumber === 3 && isDivinationCompleted())
    );

    // Get the appropriate status icon
    const getStatusIcon = () => {
        if (isCompleted) {
            return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
        } else if (isActive) {
            return <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />;
        } else {
            return <Circle className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="border-b border-indigo-900/30 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full py-3 flex items-center gap-2 text-left transition-all duration-300",
                    isActive
                        ? "bg-indigo-950/20 hover:bg-indigo-950/30"
                        : "hover:bg-gray-800/50"
                )}
            >
                <div className="relative w-6 flex justify-center">
                    {stepNumber ? (
                        getStatusIcon()
                    ) : (
                        <Triangle
                            className={`text-indigo-400 w-2.5 h-2.5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : 'transform rotate-90'}`}
                            fill="currentColor"
                        />
                    )}
                </div>
                <span className={cn(
                    "text-sm font-medium tracking-wide",
                    isActive
                        ? "bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent"
                        : isCompleted
                            ? "text-emerald-300"
                            : "text-gray-300"
                )}>
                    {stepNumber ? `Step ${stepNumber}: ${title}` : title}
                </span>
            </button>
            {isOpen && (
                <div className="relative px-3 py-3 transition-all duration-300 ease-in-out">
                    {/* Vertical line aligned with the triangle icon */}
                    <div className={cn(
                        "absolute top-0 bottom-1 w-px",
                        isActive ? "bg-indigo-500/30" :
                            isCompleted ? "bg-emerald-500/30" : "bg-gray-700/50"
                    )}></div>
                    {/* Add padding-left to ensure content doesn't cross the line */}
                    <div className="pl-4">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

interface FloatingPanelProps {
    title?: string;
    defaultPosition?: { x: number; y: number };
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    onExit?: () => void;
    showExitButton?: boolean;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
    title,
    defaultPosition = { x: 20, y: 20 },
    children,
    className = '',
    defaultOpen = false,
    onExit,
    showExitButton = false,
}) => {
    const [isPanelOpen, setIsPanelOpen] = useState(defaultOpen);

    return (
        <DragWrapper>
            <div className={`bg-gray-900/90 backdrop-blur-md rounded-md shadow-xl border border-indigo-900/30 scrollbar-none overflow-hidden w-full ${className}`}>
                <div className="bg-gradient-to-r from-gray-800 to-indigo-950/80 px-3 py-2.5 text-gray-100 font-medium text-sm cursor-move flex items-center justify-between scrollbar-none">
                    <div className="flex items-center">
                        <Triangle
                            className={`cursor-pointer w-3 h-4 text-indigo-300 transition-transform duration-300 ${isPanelOpen ? 'transform rotate-180' : 'transform rotate-90'}`}
                            fill="currentColor"
                            onClick={() => setIsPanelOpen(!isPanelOpen)}
                        />
                        <span className="ml-2 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent font-semibold tracking-wide">
                            {title}
                        </span>
                    </div>

                    {showExitButton && onExit && (
                        <button
                            onClick={onExit}
                            className="flex items-center gap-1 px-3 py-1 bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 hover:text-indigo-200 rounded-md border border-indigo-700/30 transition-all duration-300 group"
                            title="Return to Previous Screen"
                        >
                            <span className="text-xs">Exit</span>
                            <LogOut className="w-3 h-3 -rotate-90" />
                        </button>
                    )}
                </div>
                {isPanelOpen && (
                    <div className="max-h-[85vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {children}
                    </div>
                )}
            </div>
        </DragWrapper>
    );
};

// Export both the panel and section component
export { FloatingPanel, Section }; 