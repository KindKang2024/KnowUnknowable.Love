import { Button } from "../ui/button";
import { useAccount } from 'wagmi';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, } from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import { BookOpen, Calendar, Camera, Check, CheckCircle, HelpCircle, MessageSquare, Pencil, Share2, Shield, TrendingUpDown, User, X, XCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useIChing } from "@/i18n/DataProvider";
import HexagramCard from "../../pages/divi/components/HexagramCard.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DivinationEntry, useCreateDivination, useUpdateDivinationStatus } from "@/services/api.ts";
import { ArrowRightFromLine } from "lucide-react";
import { VerificationDialog } from "../ui/VerificationDialog";


interface EnlightenmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: DivinationEntry;
}


export const EnlightenmentModal = ({ isOpen, onClose, entry }: EnlightenmentModalProps) => {

    // const { gua, interpretation, will } = useDivinationStore();
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<number>(entry?.known_status || 0);
    const [localEntry, setLocalEntry] = useState<DivinationEntry>(entry);

    const [animateIn, setAnimateIn] = useState(false);
    const resultCardRef = useRef<HTMLDivElement>(null);

    const iChing = useIChing();
    const hexagram = iChing[localEntry.gua.getBinaryString()];

    const { mutate: createDivination, data: divinationResult } = useCreateDivination();
    
    // TODO: not implemented yet
    const { mutate: updateStatus, status } = useUpdateDivinationStatus({
        onSuccess: (updatedEntry) => {
            // Update local entry with the new data
            setLocalEntry(updatedEntry);
            toast({
                title: "Verification Successful",
                description: "The divination status has been updated.",
            });
            setIsVerifyDialogOpen(false);
        }
    });
    
    const isUpdatingStatus = status === 'pending';

    useEffect(() => {
        // Update local entry when props change
        setLocalEntry(entry);
        setVerificationStatus(entry?.known_status || 0);
    }, [entry]);

    useEffect(() => {
        if (open) {
            setAnimateIn(true);
        } else {
            setAnimateIn(false);
        }
    }, [open]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: "链接已复制",
            description: "您可以将此链接分享给他人查看占卜结果"
        });
    };

    const captureAndDownload = async () => {
        if (resultCardRef.current) {
            try {
                toast({
                    title: "正在生成图片...",
                    description: "请稍候片刻"
                });
                const canvas = await html2canvas(resultCardRef.current, {
                    scale: 2,
                    backgroundColor: null,
                    logging: false
                });
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `易经占卜-${entry.gua.getBinaryString()}-${new Date().toLocaleDateString()}.png`;
                link.click();
                toast({
                    title: "图片已生成",
                    description: "占卜结果图片已保存到您的设备"
                });
            } catch (error) {
                console.error("截图生成失败", error);
                toast({
                    title: "截图生成失败",
                    description: "请尝试刷新页面后重试",
                    variant: "destructive"
                });
            }
        }
    };

    const { address } = useAccount();

    const handleCopyInterpretation = () => {
        navigator.clipboard.writeText(entry.interpretation);
        setCopied(true);

        toast({
            title: "Copied to clipboard",
            description: "The interpretation has been copied to your clipboard.",
        });

        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenVerifyDialog = () => {
        setIsVerifyDialogOpen(true);
        // Reset to current status when opening dialog
        setVerificationStatus(localEntry.known_status);
    };

    const handleCloseVerifyDialog = () => {
        setIsVerifyDialogOpen(false);
    };

    const handleSubmitVerification = async () => {
        try {
            // Call API to update verification status
            updateStatus({
                uuid: localEntry.uuid,
                status: verificationStatus
            });
        } catch (error) {
            toast({
                title: "Verification Failed",
                description: "There was an error submitting your verification.",
                variant: "destructive"
            });
        }
    };

    // Function to get the verification badge element
    const getVerificationBadge = () => {
        if (localEntry.known_status === 3) {
            return (
                <p className="text-white break-words flex items-center">
                    <ArrowRightFromLine className="h-3 w-3 mr-1 text-gray-400" />
                    deprecated
                </p>
            );
        } else if (localEntry.known_status === 1) {
            return (
                <p className="text-white break-words flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                    verified correct
                </p>
            );
        } else if (localEntry.known_status === 2) {
            return (
                <p className="text-white break-words flex items-center">
                    <XCircle className="h-3 w-3 mr-1 text-red-400" />
                    verified incorrect
                </p>
            );
        } else {
            return <p className="text-white break-words">unknown</p>;
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent
                    className="bg-[#1A1F2C] border border-white/10 fixed z-50 pointer-events-auto max-w-2xl w-[95vw] py-3 [&>button:last-child]:hidden"
                    onPointerDownOutside={(e) => {
                        // Prevent events from propagating to elements underneath
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className="text-[#9b87f5] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Interpretation
                            </div>
                                
                            <div className="flex items-center ml-auto">
                                <div className="flex gap-2 mr-1">
                                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-none" onClick={captureAndDownload}>
                                        <Camera className="mr-1 h-3 w-3" />
                                        Save Image
                                    </Button>

                                    <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-none" onClick={() => {

                                    }}>
                                        <Share2 className="mr-1 h-3 w-3" />
                                        Share
                                    </Button>

                                    <DialogClose asChild>
                                        <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-none" onClick={() => {
                                            onClose()
                                        }}>
                                            <X className="mr-1 h-3 w-3" />
                                            Close
                                        </Button>
                                    </DialogClose>
                                </div>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        <div className="bg-[#0D1117] rounded-lg p-4 border border-[#30363D]">
                            <ScrollArea className="h-[70vh] pr-4">
                                <div ref={resultCardRef} className={`p-3 sm:p-4 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 rounded-xl border border-purple-300/30 backdrop-blur-md shadow-xl transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

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
                                                                <div className="text-white">问题</div>
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
                                                                    Diviner
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-white break-words">{address}</p>
                                                        </div>
                                                    </div>

                                                    {/* Date */}
                                                    <div className="flex items-center col-span-3">
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Calendar className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className="text-white">
                                                                    Create Time
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-white break-words">
                                                                {new Date(localEntry.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Process */}
                                                    <div className="flex items-center">
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <ArrowRightFromLine className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className="text-white">
                                                                    Divination Process
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-white break-words">{localEntry.gua.symbol()}</p>
                                                        </div>
                                                    </div>

                                                    {/* Possible Mutations */}
                                                    <div className="flex items-center">
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <TrendingUpDown className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className="text-white">
                                                                    Possible Mutations
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-white break-words">
                                                                {localEntry.gua.getAllPossibleMutationSymbols(true).join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Verification Status TODO */}
                                                    <div className="flex items-center">
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Shield className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className="text-white">
                                                                    Verification Status - Click the pencil to update
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <div className="min-w-0 flex-1 flex items-center">
                                                            {getVerificationBadge()}
                                                            
                                                            {/* Show verification button if status is unknown or if the user is the diviner */}
                                                            {(false && (localEntry.known_status === 0 || localEntry.diviner === address)) && (
                                                                <Button 
                                                                    variant="outline"
                                                                    className="ml-2 p-1 h-4 w-4 rounded-full border border-red-400 bg-red-900/40 hover:bg-red-700/50 hover:border-red-300 transition-all shadow-sm shadow-red-500/20" 
                                                                    onClick={handleOpenVerifyDialog}
                                                                    title="Update verification status"
                                                                >
                                                                    <Pencil className="h-3 w-3 text-white p-1" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Hexagram Result Display */}
                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2 sm:p-3 rounded-xl mb-4 sm:mb-6">
                                        <HexagramCard
                                            gua={localEntry.gua}
                                            hexagram={hexagram}
                                            className="mb-2"
                                        />
                                    </div>


                                    <div className="w-full flex items-center justify-center my-4 sm:my-6">
                                        <div className="w-full border-t border-dashed border-purple-300/30"></div>
                                    </div>



                                    <div className="space-y-2">
                                        <div className="text-white/80 text-sm italic">
                                            Reflect on this interpretation with an open mind. The I Ching speaks in metaphors that may reveal deeper truths about your situation over time. Return to this reading when you need guidance.
                                        </div>
                                    </div>

                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2 sm:p-3 rounded-xl my-4 sm:mb-6">
                                        <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                                            {localEntry.interpretation}
                                        </div>
                                    </div>

                                    <div className="mt-3 opacity-70 flex justify-center items-center">
                                        <a href="https://knowunknowable.love" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors text-xs">
                                            Love Be The Way To Know
                                        </a>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Use the extracted VerificationDialog component */}
            <VerificationDialog
                isOpen={isVerifyDialogOpen}
                onClose={handleCloseVerifyDialog}
                status={verificationStatus}
                onStatusChange={setVerificationStatus}
                onSubmit={handleSubmitVerification}
                isSubmitting={isUpdatingStatus}
            />
        </>
    );
}; 