import { Button } from "../ui/button";
import { useAccount } from 'wagmi';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, } from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import { DiviSearchIcon } from "../icons/index.tsx";
import {
    ArrowRightFromLine,
    BookOpen,
    Calendar,
    Camera,
    CheckCircle,
    HelpCircle,
    Share2,
    Gavel,
    Shield,
    ShieldQuestion,
    Trash2,
    TrendingUpDown,
    User,
    X,
    XCircle,
    GavelIcon,
    ListX,
    ListCheck,
    FileQuestion,
    Split,
    CalendarHeart,
    CalendarSearch
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import * as htmlToImage from 'html-to-image';
import { useIChing, usePageCommonData } from "@/i18n/DataProvider";
import HexagramCard from "../../pages/divi/components/HexagramCard.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DivinationEntry } from "@/services/api.ts";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TwitterShareButton } from 'react-share';
import { DivineIcon, GrokDivineIcon, JudgeGavelIcon } from "../icons/index.tsx";
import { Gua } from "@/stores/Gua.ts";

interface EnlightenmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: DivinationEntry;
}

export const EnlightenmentModal = ({ isOpen, onClose, entry }: EnlightenmentModalProps) => {

    // const { gua, interpretation, will } = useDivinationStore();
    const { toast } = useToast();
    const [localEntry, setLocalEntry] = useState<DivinationEntry>(entry);
    const [shareUrl, setShareUrl] = useState('');
    const [shareTitle, setShareTitle] = useState('');

    const [animateIn, setAnimateIn] = useState(false);
    const resultCardRef = useRef<HTMLDivElement>(null);
    // verified correct
    const commonPageData = usePageCommonData();

    const iChing = useIChing();
    // const hexagram = iChing[localEntry.gua.getBinaryString()];
    // localEntry.gua.getAllPossibleMutationSymbols(false)
    const [allRepresentationGuaList, setAllRepresentationGuaList] = useState<Gua[]>([]);
    const [hexagram, setHexagram] = useState(iChing[localEntry.gua.getBinaryString()]);
    const [selectedGuaIndex, setSelectedGuaIndex] = useState(0);

    useEffect(() => {
        setAllRepresentationGuaList(localEntry.gua.getAllRepresentationGuaList(false));
    }, [localEntry]);

    useEffect(() => {
        // setHexagram(iChing[localEntry.gua.getBinaryString()]);
        if (allRepresentationGuaList.length > 0) {
            const gua = allRepresentationGuaList[selectedGuaIndex];
            setHexagram(iChing[gua.getBinaryString()]);
        }
    }, [selectedGuaIndex, localEntry]);


    useEffect(() => {
        if (open) {
            setAnimateIn(true);
        } else {
            setAnimateIn(false);
        }
    }, [open]);

    useEffect(() => {
        // Set share data when entry changes
        const baseUrl = window.location.origin;
        setShareUrl(`${baseUrl}`);
        setShareTitle(`I consulted the I Ching and received ${localEntry.gua.symbol()} - ${hexagram?.name || ''} #iching #knowunknowable`);
    }, [localEntry, hexagram]);

    // const iterateIndex = useRef(0);
    // useEffect(() => {
    //     const allKeys = Object.keys(iChing).filter(key => key.length === 6);
    //     // iterate iChing every 1 second
    //     const interval = setInterval(() => {
    //         // iterateIndex.current = (iterateIndex.current + 1) % allKeys.length;
    //         // setHexagram(iChing[allKeys[iterateIndex.current]]);
    //         iterateIndex.current = iterateIndex.current + 1;
    //         let myLocalEntry = {
    //             ...localEntry,
    //             known_status: iterateIndex.current % 4
    //         }

    //         setLocalEntry(myLocalEntry);
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);

    const captureAndDownload = async () => {
        const captureElement = document.getElementById('capture-card');
        if (captureElement) {
            try {
                // Use html-to-image to create a PNG
                const dataUrl = await htmlToImage.toPng(captureElement, {
                    quality: 1.0,
                    pixelRatio: 2,
                    skipAutoScale: true,
                    cacheBust: true,
                });

                // Create download link
                const link = document.createElement('a');
                link.download = `${localEntry.gua.getBinaryString()}-${new Date().toLocaleDateString()}.png`;
                link.href = dataUrl;
                link.click();

            } catch (error) {
                toast({
                    title: "Failed to generate screenshot",
                    description: "Please try refreshing the page and retrying",
                    variant: "destructive"
                });
            }
        }
    };

    const { address } = useAccount();

    const getVerificationBadge = () => {
        if (localEntry.known_status === 3) {
            return (
                <>
                    <Trash2 className="h-4 w-4 mr-1 text-white/70" />
                </>
            );
        } else if (localEntry.known_status === 1) {
            return (
                <ListCheck className="h-4 w-4 mr-1 text-green-400" />
            );
        } else if (localEntry.known_status === 2) {
            return (
                <ListX className="h-4 w-4 mr-1 text-red-400" />
            );
        } else {
            return (
                <DiviSearchIcon className="h-5 w-4 text-white/90" />
            );
        }
    };

    const handleShare = () => {
        // Handle the share button click - will open Twitter sharing dialog
        document.getElementById('twitter-share-button')?.click();
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent
                    className="bg-[#1A1F2C] border border-white/10 fixed z-50 pointer-events-auto max-w-3xl w-[100vw] py-3 [&>button:last-child]:hidden"
                    onPointerDownOutside={(e) => {
                        // Prevent events from propagating to elements underneath
                        e.preventDefault();
                    }}
                >
                    {/* Hidden Twitter share button that will be triggered programmatically */}
                    <div className="hidden">
                        <TwitterShareButton
                            id="twitter-share-button"
                            url={shareUrl}
                            title={shareTitle}
                        >
                            {/* Share */}
                            {commonPageData.modals.share}
                        </TwitterShareButton>
                    </div>

                    <DialogHeader>
                        <DialogTitle className="text-[#9b87f5] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                {/* Divination Result */}
                                {commonPageData.modals.divinationResult}
                            </div>

                            <div className="flex items-center ml-auto">
                                <div className="flex gap-2 mr-1">
                                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-none" onClick={captureAndDownload}>
                                        <Camera className="mr-1 h-3 w-3" />
                                        {/* Save Image */}
                                        {commonPageData.modals.saveImage}
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-none"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="mr-1 h-3 w-3" />
                                        {/* Share */}
                                        {commonPageData.modals.share}
                                    </Button>

                                    <DialogClose asChild>
                                        <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-none" onClick={() => {
                                            onClose()
                                        }}>
                                            <X className="mr-1 h-3 w-3" />
                                            {/* Close */}
                                            {commonPageData.close}
                                        </Button>
                                    </DialogClose>
                                </div>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 mt-4 ">
                        <div className="rounded-lg">
                            <ScrollArea className="h-[70vh] pr-4 scrollbar-none" scrollHideDelay={0} type="always">
                                <div ref={resultCardRef} id="divination-result-card" className={`p-3 sm:p-4 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 rounded-xl border border-purple-300/30 backdrop-blur-md shadow-xl transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <div id="capture-card" className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 " style={{
                                        display: 'block',
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden',
                                        padding: '1rem'
                                    }}>
                                        <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
                                            {/* Personal Information - fully responsive */}
                                            <div className="w-full">
                                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-xl">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                                        {/* Question - full width on mobile, 2 columns on larger screens */}
                                                        <div className="flex items-center col-span-3">
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <HelpCircle className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <div className="text-white">
                                                                        {commonPageData.diviFields.diviWill}
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-white break-words">{localEntry.will}</p>
                                                            </div>
                                                        </div>

                                                        {/* Diviner */}
                                                        <div className="flex items-center col-span-3">
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <User className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <div className="text-white">
                                                                        {/* Diviner */}
                                                                        {commonPageData.diviFields.diviner}
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <div className="min-w-0">
                                                                <p className="text-white break-words">{address}</p>
                                                            </div>
                                                        </div>

                                                        {/* Date */}
                                                        <div className="flex items-center col-span-3">
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <CalendarSearch className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <div className="text-white">
                                                                        {/* Create Time */}
                                                                        {commonPageData.diviFields.diviTime}
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <div className="min-w-0">
                                                                <p className="text-white break-words">
                                                                    {new Date(localEntry.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                                                                </p>
                                                            </div>



                                                            {/* Known At (if available) */}
                                                            {(localEntry.known_at || true) && (localEntry.known_status === 1 || localEntry.known_status === 2) && (
                                                                <div className="flex items-center ml-4">
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            {/* Using GavelIcon similar to the status icon */}
                                                                            <CalendarHeart className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <div className="text-white">
                                                                                {commonPageData.diviFields.knowTime}
                                                                            </div>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                    <div className="min-w-0 flex items-center">
                                                                        <p className="text-white break-words text-xs">
                                                                            {/* {new Date(localEntry.known_at).toISOString().replace('T', ' ').substring(0, 19)} */}
                                                                            {new Date().toISOString().replace('T', ' ').substring(0, 19)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Verification Status */}
                                                            <div className="flex items-center ml-4">
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <JudgeGavelIcon className="h-4 w-4 text-purple-300 mr-2 flex-shrink-0" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <div className="text-white">
                                                                            {/* Verification Status */}
                                                                            {commonPageData.diviFields.knowDaoStatus}
                                                                        </div>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                                <div className="min-w-0 flex items-center">
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            {getVerificationBadge()}
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <div className="text-white">
                                                                                {commonPageData.epistemicEnums[localEntry.known_status]}
                                                                            </div>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Combine Gua Manifestation on one row */}
                                                    <div className="flex items-center justify-between col-span-3">
                                                        {/* Gua Manifestation */}
                                                        <div className="flex flex-start items-center">
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <ArrowRightFromLine className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <div className="text-white">
                                                                        {/* Primary Hexagram */}
                                                                        {commonPageData.textPrimaryHexagram}
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            <div className="min-w-0 flex items-left">
                                                                {allRepresentationGuaList.map((symbol, index) => (
                                                                    <>
                                                                        {index === 1 && (
                                                                            // <span className="h-4 border-l border-white/30 mx-2 inline-block mt-1"></span>
                                                                            // <TrendingUpDown className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                                            <Tooltip>
                                                                                <TooltipTrigger>
                                                                                    <Split className="h-4 w-4 mx-2 text-purple-300 rotate-90 mt-1.2 ml-6" />
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    <div className="text-white">
                                                                                        {commonPageData.textRelatingHexagram}
                                                                                    </div>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        )}

                                                                        <span key={index} className={`text-white break-words cursor-pointer relative ${index === 0 ? 'w-3' : ''} ${index === selectedGuaIndex ? 'text-lg' : 'text-base'}`} onClick={() => setSelectedGuaIndex(index)}>
                                                                            {symbol.symbol()}

                                                                            {index === selectedGuaIndex && (
                                                                                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/10 w-1  h-1 bg-red-600 rounded-full"></span>
                                                                            )}
                                                                        </span>

                                                                    </>
                                                                ))}

                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Hexagram Result Display */}
                                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2 sm:p-3 rounded-xl mb-4 sm:mb-6">
                                            <HexagramCard
                                                // gua={localEntry.gua}
                                                gua={allRepresentationGuaList[selectedGuaIndex]}
                                                hexagram={hexagram}
                                                className="mb-2"
                                            />
                                        </div>


                                        <div className="mt-3 opacity-70 flex flex-col items-center text-center md:flex-row md:justify-center md:items-center text-xs text-gray-400 gap-1 md:gap-2">
                                            <div className="flex items-center gap-1">
                                                <GrokDivineIcon className="w-6 h-6" />
                                                <span className="text-purple-300 font-medium">KNOW UNKNOWABLE . LOVE</span>
                                            </div>
                                            <span className="hidden md:inline text-gray-500">·</span>
                                            <span>{commonPageData.textLoveBeTheWayToKnow.toLowerCase()}</span>
                                        </div>
                                    </div>
                                    <div className="w-full flex items-center justify-center my-4 sm:my-6">
                                        <div className="w-full border-t border-dashed border-purple-300/30"></div>
                                    </div>


                                    <div className="space-y-2">
                                        <div className="text-white/80 text-sm italic">
                                            {commonPageData.modals.enlightenmentText}
                                        </div>
                                    </div>

                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2 sm:p-3 rounded-xl my-4 sm:mb-6">
                                        <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                                            {!localEntry.interpretation || localEntry.interpretation.trim() === '' ? (
                                                <div className="text-center py-4 italic text-white/60">
                                                    {commonPageData.modals.emptyInterpretationPlaceholder}
                                                </div>
                                            ) : (() => {
                                                // Split content by <think> tags
                                                const segments = localEntry.interpretation.split(/<think>|<\/think>/);
                                                const result = [];

                                                // Process alternate segments
                                                for (let i = 0; i < segments.length; i++) {
                                                    if (segments[i].trim() === '') continue;

                                                    if (i % 2 === 0) {
                                                        // Regular markdown content
                                                        result.push(
                                                            <div key={`segment-${i}`} className="prose prose-invert prose-sm max-w-none prose-headings:text-purple-300 prose-p:text-white/90 prose-a:text-blue-300 prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:italic prose-code:bg-black/40 prose-code:text-yellow-300 prose-strong:text-purple-200 prose-em:text-indigo-200">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {segments[i]}
                                                                </ReactMarkdown>
                                                            </div>
                                                        );
                                                    } else {
                                                        // DeepSeek AI insight content
                                                        result.push(
                                                            <div key={`think-${i}`} style={{
                                                                margin: '1rem 0',
                                                                padding: '0.75rem 1rem',
                                                                borderLeft: '3px solid #d946ef',
                                                                borderRadius: '0 0.3rem 0.3rem 0',
                                                                background: 'linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(126, 34, 206, 0.05))',
                                                                fontSize: '0.5em'
                                                            }}>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    marginBottom: '0.5rem',
                                                                    fontWeight: 'bold',
                                                                    color: '#d8b4fe'
                                                                }}>
                                                                    <span style={{ marginRight: '0.5rem' }}>✨</span>
                                                                    <span>DeepSeek AI:</span>
                                                                </div>
                                                                <div style={{
                                                                    fontStyle: 'italic',
                                                                    color: '#e9d5ff'
                                                                }}>
                                                                    {segments[i].trim()}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                }

                                                return result;
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
}; 