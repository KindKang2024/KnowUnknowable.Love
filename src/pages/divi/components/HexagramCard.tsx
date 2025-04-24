import React, { useEffect, useRef, useState } from "react";
import { Circle, X } from "lucide-react";
import { a, useSpring } from "@react-spring/web";
import { IChing } from "@/i18n/data_types.ts";
import { Gua } from "@/stores/Gua.ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { commonIChingMap } from "@/i18n/symbols";

interface HexagramCardProps {
    hexagram: IChing;
    gua: Gua;
    className?: string;
}

const HexagramCard: React.FC<HexagramCardProps> = ({
    hexagram,
    gua,
    className = ""
}) => {
    const cardAnimation = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 500 }
    });

    const [overflowingLines, setOverflowingLines] = useState<boolean[]>(Array(6).fill(false));
    // Separate refs for desktop and mobile
    const desktopTextRefs = useRef<(HTMLParagraphElement | null)[]>(Array(6).fill(null));
    const mobileTextRefs = useRef<(HTMLParagraphElement | null)[]>(Array(6).fill(null));

    useEffect(() => {
        const checkOverflow = () => {
            const isDesktop = window.matchMedia('(min-width: 768px)').matches;
            const currentRefs = isDesktop ? desktopTextRefs.current : mobileTextRefs.current;
            const newOverflowingLines = Array(6).fill(false);

            currentRefs.forEach((ref, index) => {
                // Ensure the ref corresponds to the *currently visible* element
                if (ref && ref.offsetParent !== null) {
                    const isOverflowing = ref.scrollHeight > ref.clientHeight;
                    newOverflowingLines[index] = isOverflowing;
                }
            });

            // Only update if state changes
            if (JSON.stringify(newOverflowingLines) !== JSON.stringify(overflowingLines)) {
                setOverflowingLines(newOverflowingLines);
            }
        };

        // Debounced resize handler
        let timeoutId = null;
        const handleResize = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(checkOverflow, 150);
        };

        checkOverflow(); // Initial check
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
        // Rerun effect when content or overflowing state changes (state added to ensure re-check after update)
    }, [hexagram.yao_ci, overflowingLines]);

    return <a.div className={`relative w-full flex justify-center w-full  overflow-hidden ${className}`} style={cardAnimation}>
        <div id="hex" className="p-6 w-full">
            <div className="flex items-end mb-4" id="gua_header">
                <h2 className="text-5xl font-bold text-white text-nowrap" id="hexagram-name">{hexagram.name} </h2>
                <div className="flex flex-col pr-2 text-left" id="hexagram-representation">
                    <div className="flex items-center flex-row justify-between">
                        <span className="text-white/80 text-bold text-[10px]">{commonIChingMap[gua.getBinaryString()].num}</span>
                        <span className="text-gray-300 text-[6px] text-bold mt-1">{gua.getDecimalNumberString()}b &nbsp;</span>
                    </div>
                    <p className="text-gray-300 text-[10px]">{gua.getBinaryString()}</p>
                    <p className="text-gray-300 text-xs">{gua.getGeneticCode()}</p>
                </div>
            </div>

            <div className="max-h-20 overflow-y-auto mb-4" id="hexagram-ci">
                <p className="text-gray-300 text-sm text-left pr-2">
                    {hexagram.gua_ci} {hexagram.yong_ci ?? ""}
                </p>
            </div>

            <div className="w-full grid grid-cols-1 gap-3">
                {/* Display 6 rows from top to bottom (6th to 1st) */}
                {Array.from({ length: 6 }, (_, index) => {
                    let yao = gua.yaos[5 - index];

                    const isHighlighted = false;
                    // const lineClass = isHighlighted ? "border-2 border-blue-500" : "";
                    // top_extra_space using margin-top, if index =2 ; bottom_space, using margin-bottom    , if index =3; 
                    const lineClass = index === 3 ? "mt-2" : index === 2 ? "mb-2" : "";

                    const isBroken = yao.isYin();
                    const isMutable = yao.isMutable();

                    const textContent = hexagram.yao_ci[5 - index];

                    // Desktop version
                    const desktopText = (
                        <div className="flex items-center min-h-[2.5rem]">
                            {overflowingLines[index] ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-full">
                                            <p
                                                ref={el => desktopTextRefs.current[index] = el}
                                                className="text-red-500 w-full line-clamp-2 overflow-hidden font-bold"
                                            >
                                                <span className="text-white text-sm font-normal">
                                                    {textContent}
                                                </span>
                                            </p>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-64 bg-gray-900 p-2 text-white z-50">
                                        <p className="text-sm">{textContent}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <p
                                    ref={el => desktopTextRefs.current[index] = el}
                                    className="text-white text-sm line-clamp-2 overflow-hidden text-ellipsis m-0"
                                >
                                    {textContent}
                                </p>
                            )}
                        </div>
                    );

                    // Mobile version
                    const mobileText = (
                        <div className="flex items-center min-h-[2.5rem]">
                            {overflowingLines[index] ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-full">
                                            <p
                                                ref={el => mobileTextRefs.current[index] = el}
                                                className="text-red-500 w-full line-clamp-2 overflow-hidden font-bold"
                                            >
                                                <span className="text-white text-sm text-left font-normal">
                                                    {textContent}
                                                </span>
                                            </p>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-64 bg-gray-900 p-2 text-white z-50">
                                        <p className="text-sm">{textContent}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <p
                                    ref={el => mobileTextRefs.current[index] = el}
                                    className="text-white text-sm text-left line-clamp-2 overflow-hidden text-ellipsis m-0"
                                >
                                    {textContent}
                                </p>
                            )}
                        </div>
                    );

                    return (
                        <div key={index} className={`${lineClass} relative`}>
                            {/* Line and symbol - always horizontal */}
                            <div className="flex items-center w-full justify-center">
                                {/* Mobile: full width lines */}
                                <div className="md:hidden w-full flex-shrink-0 flex items-center">
                                    {isBroken ? (
                                        <div className="flex space-x-4 w-full">
                                            <div className="h-8 bg-red-600 w-1/2"></div>
                                            <div className="h-8 bg-red-600 w-1/2"></div>
                                        </div>
                                    ) : (
                                        <div className="h-8 bg-red-600 w-full"></div>
                                    )}
                                </div>

                                {/* Desktop: 1/3 width lines */}
                                <div className="hidden md:flex w-1/3 flex-shrink-0 items-center">
                                    {isBroken ? (
                                        <div className="flex space-x-4 w-full">
                                            <div className="h-6 bg-red-600 w-1/2"></div>
                                            <div className="h-6 bg-red-600 w-1/2"></div>
                                        </div>
                                    ) : (
                                        <div className="h-6 bg-red-600 w-full"></div>
                                    )}
                                </div>

                                {isMutable && (<div className="block">
                                    {isBroken ? (
                                        <X className="w-3 h-3 text-yellow-300 mx-2 flex-shrink-0" />
                                    ) : (
                                        <Circle className="w-3 h-3 text-yellow-300 mx-2 flex-shrink-0" />
                                    )}
                                </div>)
                                }

                                {!isMutable && (<div className="block">
                                    <div className="w-3 h-3 mx-2 flex-shrink-0"></div>
                                </div>)
                                }

                                {/* Text - inline on larger screens taking 2/3 width */}
                                <div className="hidden md:block w-2/3 pl-2 text-left">
                                    {desktopText}
                                </div>
                            </div>

                            {/* Mobile: Icon below line */}


                            {/* Text - below on mobile, full width */}
                            <div className="md:hidden w-full ml-[-10px]">
                                {mobileText}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </a.div>;
};
export default HexagramCard;
