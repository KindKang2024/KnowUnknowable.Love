import React, {ReactNode, useState} from 'react';
import {DragWrapper} from './DragWrapper.tsx';
import {ArrowRight, CheckCircle2, LogOut, Triangle} from 'lucide-react';
import {cn} from '@/lib/utils';

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

    return (
        <div className="border-b border-indigo-900/30 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full py-3 flex items-center gap-2 text-left transition-all duration-300",
                    "hover:bg-indigo-950/10"
                )}
            >
                <div className="relative w-6 flex justify-center">
                    {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <ArrowRight className="w-4 h-4 text-indigo-400  animate-pulse" />
                    )}
                </div>
                <span className={cn(
                    "text-sm font-medium tracking-wide",
                    isCompleted
                        ? "text-emerald-300"
                        : "bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent"
                )}>
                    {stepNumber ? `${stepNumber}: ${title}` : title}
                </span>
            </button>
            <div 
                className={cn(
                    "relative px-3 py-3 transition-all duration-300 ease-in-out",
                    isOpen 
                        ? "max-h-[1000px] opacity-100" 
                        : "max-h-0 opacity-0 overflow-hidden py-0"
                )}
            >
                {/* Vertical line aligned with the triangle icon */}
                <div className={cn(
                    "absolute top-0 bottom-1 w-px",
                    // isActive ? "bg-indigo-500/30" :
                    isCompleted ? "bg-emerald-500/30" : "bg-indigo-500/30"
                )}></div>
                {/* Add padding-left to ensure content doesn't cross the line */}
                <div className="pl-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface FloatingPanelProps {
    title?: string;
    defaultPosition?: { x: string | number; y: string | number };
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    onExit?: () => void;
    showExitButton?: boolean;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
    title,
    defaultPosition = { x: "5%", y: "5%" },
    children,
    className = '',
    defaultOpen = true,
    onExit,
    showExitButton = false,
}) => {
    const [isPanelOpen, setIsPanelOpen] = useState(defaultOpen);

    return (
        <DragWrapper defaultPosition={defaultPosition}>
            <div className={`bg-transparent backdrop-blur-sm rounded-md shadow-xl border border-indigo-900/30 scrollbar-none overflow-hidden w-full ${className}`}>
                <div className="px-3 py-2.5 text-gray-100 font-medium text-sm cursor-move flex items-center justify-between scrollbar-none">
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
                <div 
                    className={cn(
                        "max-h-[85vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300",
                        isPanelOpen 
                            ? "max-h-[85vh] opacity-100" 
                            : "max-h-0 opacity-0 overflow-hidden"
                    )}
                >
                    {children}
                </div>
            </div>
        </DragWrapper>
    );
};

// Export both the panel and section component
export { FloatingPanel, Section }; 