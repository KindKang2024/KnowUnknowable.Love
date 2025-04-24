import TaiChiDiagram from "@/components/bagua/TaiChiDiagram";
import {useUIStore} from "@/stores/uiStore";
import {ModalType} from "@/types/common";
import ZeroKnowledgeDemo from "./ZeroKnowledgeDemo";
import References from "./References";
import {usePageIChingData} from "@/i18n/DataProvider";

interface ProofSystemProps {
    defaultBinary?: string;
}

export const IChingProofSystem = ({ defaultBinary = "111111" }: ProofSystemProps) => {
    const iChingPageData = usePageIChingData();

    const { openModal } = useUIStore();
    return (
        <div className="max-w-4xl mx-auto">
            <div className="rounded-xl backdrop-blur-sm bg-black/20 p-8 mt-4">
                <div className="flex flex-col space-y-12">
                    {/* Title Section */}
                    <div className="text-center">
                        <h3 className="text-2xl text-purple-300 mb-4">
                            {/* How I Ching Divination Works */}
                            {iChingPageData.howIChingWorks}
                        </h3>
                    </div>

                    {/* Introduction Section */}
                    <div className="space-y-6">
                        {iChingPageData.quotes.map((quote) => (
                            <blockquote key={quote.author} className="italic border-l-4 border-purple-500/50 pl-6 py-4 bg-black/20 rounded-r-lg">
                                <p className="mb-4 text-white/80">
                                    {quote.quote}
                                </p>
                                <footer className="text-sm text-purple-300 text-right">{quote.author}</footer>
                            </blockquote>
                        ))}

                        <div className="p-4 border border-purple-500/30 rounded-lg bg-black/30">
                            <p className="text-yellow-200 font-medium text-center text-lg">
                                {iChingPageData.prerequisite}
                            </p>
                            <p className="text-purple-300/80 text-center mt-2 italic">
                                {iChingPageData.prerequisiteDescription}
                            </p>
                        </div>
                    </div>

                    {/* Tai Chi Diagram Section */}
                    <div className="relative">
                        <div className="w-full aspect-square max-w-2xl mx-auto animate-[spin_256s_linear_infinite]">
                            <TaiChiDiagram
                                onItemClick={(item) => {
                                    openModal(ModalType.GUA, item);
                                }}
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Zero Knowledge Proof Section */}
                    <div className="space-y-6">
                        <h3 className="text-2xl text-purple-300 text-center">
                            {iChingPageData.iChingAndZkProofAndRandomness}
                        </h3>
                        <div className="w-full">
                            <ZeroKnowledgeDemo data={iChingPageData.zkDemo} />
                        </div>
                    </div>

                    {/* I Ching, Will, Love, DNA Section */}
                    <div className="space-y-3 border-t border-purple-500/30 pt-8">

                        <h3 className="text-2xl text-purple-300 text-center">
                            {iChingPageData.iChingAndWillAndLoveAndDNA}
                        </h3>
                        <div className="w-full flex flex-col items-center">
                            <img
                                width={100}
                                src="/images/Fuxi_and_Nuwa.jpg"
                                alt="Fu Xi and Nüwa"
                                className="max-w-xs md:max-w-sm rounded-lg shadow-lg shadow-purple-900/30 mb-2"
                            />
                            <p className="text-xs text-purple-300/70 text-center">
                                Image source: {' '}
                                <a
                                    href="https://commons.wikimedia.org/wiki/Category:Fuxi_and_N%C3%BCwa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-purple-200"
                                >
                                    Wikimedia Commons
                                </a>
                            </p>
                        </div>

                        <p className="text-xs italic text-purple-300/60">
                            (Note: {iChingPageData.perspectiveExplanation})
                        </p>
                        <div className="text-sm text-left space-y-2">
                            {iChingPageData.iChingAndWillAndLoveAndDNADetails.map((detail, index) => (
                                <p key={index}>{detail}</p>
                            ))}
                        </div>
                    </div>

                    {/* References Section */}
                    <div className="w-full">
                        <References references={iChingPageData.references} />
                    </div>
                </div>
            </div>
        </div>
    );
};