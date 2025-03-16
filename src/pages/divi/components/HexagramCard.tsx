import React from "react";
import {Circle, X} from "lucide-react";
import {a, useSpring} from "@react-spring/web";
import {IChing} from "@/i18n/data_types.ts";
import {Gua} from "@/stores/Gua.ts";

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
    return <a.div className={`relative w-full flex justify-center max-w-4xl mx-auto  overflow-hidden ${className}`} style={cardAnimation}>
        <div id="hex" className="p-6 w-full">
            <div className="flex items-end mb-4  ">
                <h2 className="text-5xl font-bold text-white text-nowrap" id="hexagram-name">{hexagram.name} </h2>
                <div className="flex flex-col pr-2 text-left" id="hexagram-representation">
                    <p className="text-gray-300 text-[10px]">{gua.getDecimalNumberString()}</p>
                    <p className="text-gray-300 text-[10px]">{gua.getBinaryString()}</p>
                    <p className="text-gray-300 text-xs">{gua.getGeneticCode()}</p>
                </div>

                <div className="flex-grow" id="hexagram-ci">
                    <p className="text-gray-300 text-wrap text-left">{hexagram.gua_ci} {hexagram.yong_ci ? `(${hexagram.yong_ci})` : ""}</p>
                </div>
            </div>

            <div className="w-full grid grid-cols-1 gap-4">
                {/* Display 6 rows from top to bottom (6th to 1st) */}
                {Array.from({ length: 6 }, (_, index) => {
                    let yao = gua.yaos[5 - index];
                    
                    const isHighlighted = false;
                    const lineClass = isHighlighted ? "border-2 border-blue-500" : "";

                    const isBroken = yao.isYin();
                    const isMutable = yao.isMutable();
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

                                {/* Text - inline on larger screens taking 2/3 width */}
                                <div className="hidden md:block w-2/3 pl-2 truncate text-left ">
                                    <p className="text-white text-sm text-wrap">{hexagram.yao_ci[5 - index]}</p>
                                </div>
                            </div>

                            {/* Mobile: Icon below line */}


                            {/* Text - below on mobile, full width */}
                            <div className="md:hidden w-full">
                                <p className="text-white text-sm text-left">{hexagram.yao_ci[5 - index]}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </a.div>;
};
export default HexagramCard;
