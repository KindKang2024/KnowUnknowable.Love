import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Calendar, Camera, Clock, Copy, HelpCircle, MessageSquare, Share2, User, X} from "lucide-react";
import {useToast} from "@/components/ui/use-toast.ts";
import html2canvas from 'html2canvas';
import {Gua} from "@/stores/Gua.ts";
import {YAO} from "@/stores/YAO.ts";
import HexagramCard from "./HexagramCard.tsx";
import {useIChing} from "@/i18n/DataProvider.tsx";
import {Dialog, DialogClose, DialogContent,} from "@/components/ui/dialog.tsx";

interface ShareCardProps {
    open: boolean;
    gua: Gua;
    yaos: YAO[];
    onClose?: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ open, gua, yaos, onClose }) => {
    const { toast } = useToast();
    const [animateIn, setAnimateIn] = useState(false);
    const resultCardRef = useRef<HTMLDivElement>(null);

    const iChing = useIChing();
    const hexagram = iChing[gua.getBinaryString()];

    // Mock divination result data
    const divinationResult = {
        question: "What guidance does the universe have for me at this time?",
        date: new Date().toLocaleDateString(),
        diviner: "Seeker",
        background: "Traditional yarrow stalk method",
        method: gua.getMutationGuaId() ? "See changing lines" : "None"
    };

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
                link.download = `易经占卜-${gua.getBinaryString()}-${new Date().toLocaleDateString()}.png`;
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

    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent className="max-w-5xl w-[95vw] p-5 [&>button:last-child]:hidden overflow-y-auto h-full no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                {/* Action buttons - responsive layout */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="border-purple-300/50 bg-white/10 text-white hover:bg-white/20" onClick={handleCopyLink}>
                            <Copy className="mr-1 h-3 w-3" /> 复制链接
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-none" onClick={captureAndDownload}>
                            <Camera className="mr-1 h-3 w-3" /> 保存图片
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-none" onClick={() => {
                            window.open("https://lovable.dev", "_blank");
                        }}>
                            <Share2 className="mr-1 h-3 w-3" /> 分享
                        </Button>
                    </div>
                    <DialogClose asChild>
                        <Button variant="outline" size="sm" className="border-purple-300/50 bg-white/10 text-white hover:bg-white/20">
                            <X className="mr-1 h-3 w-3" /> 关闭
                        </Button>
                    </DialogClose>
                </div>

                <div ref={resultCardRef} className={`p-3 sm:p-4 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 rounded-xl border border-purple-300/30 backdrop-blur-md shadow-xl transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {/* Main Hexagram Result Display */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2 sm:p-3 rounded-xl mb-4 sm:mb-6">
                        <HexagramCard
                            gua={gua}
                            hexagram={hexagram}
                            yaos={yaos}
                            className="mb-2"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-4 sm:mt-6">
                        {/* Personal Information - fully responsive */}
                        <div className="w-full">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-xl">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                    {/* Question - full width on mobile, 2 columns on larger screens */}
                                    <div className="flex items-center col-span-1 sm:col-span-2">
                                        <HelpCircle className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-blue-200">问题</p>
                                            <p className="text-white break-words">{divinationResult.question}</p>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-blue-200">时间</p>
                                            <p className="text-white break-words">{divinationResult.date}</p>
                                        </div>
                                    </div>

                                    {/* Diviner */}
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-blue-200">占卜人</p>
                                            <p className="text-white break-words">{divinationResult.diviner}</p>
                                        </div>
                                    </div>

                                    {/* Process */}
                                    <div className="flex items-center">
                                        <MessageSquare className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-blue-200">占卜过程</p>
                                            <p className="text-white break-words">{divinationResult.background}</p>
                                        </div>
                                    </div>

                                    {/* Possible Mutations */}
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-blue-200">可能的变卦</p>
                                            <p className="text-white break-words">{divinationResult.method}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 opacity-70 flex justify-center items-center">
                        <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors text-xs">
                            风火家人 · 易经智慧
                        </a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareCard;
