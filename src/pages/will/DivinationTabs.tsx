import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ArrowRight, Clock, Folder, Star} from "lucide-react";
import {useUIStore} from "@/stores/uiStore";
import MyDivinations from "@/pages/will/MyDivinations";
import LatestDaoDivinations from "@/pages/will/LatestDaoDivinations";
import {useQueryClient} from "@tanstack/react-query";
import {useUserData} from "@/services/api";
import {useAccount} from "wagmi";
import {useConnectModal} from "@rainbow-me/rainbowkit";
import {Button} from "@/components/ui/button";
import {FeaturedDaoDivinations} from "./FeaturedDaoDivinations";
import {usePageCommonData, usePageWillData} from "@/i18n/DataProvider";

export const DivinationTabs = () => {

    const { openModal } = useUIStore();
    const queryClient = useQueryClient();
    const { address, isConnected } = useAccount();
    const { data: userData } = useUserData(address);
    const { openConnectModal } = useConnectModal();

    const pageWillData = usePageWillData();
    const commonData = usePageCommonData();

    // Check if user is logged in
    const isUserLoggedIn = isConnected && userData && (userData.address !== '0x' && userData.expire_at !== 0);

    return (
        <Tabs
            defaultValue="my-divination"
            // value={activeTab}
            // onValueChange={handleTabChange}
            className="w-full max-w-6xl mx-auto min-h-[300px]"
        >
            <div className="flex items-center justify-center mb-4">
                <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl overflow-hidden w-full max-w-3xl">
                    <TabsList className="bg-transparent flex w-full h-full [&>*]:border-r [&>*:last-child]:border-r-0 [&>*]:border-r-[#333333]">
                        <TabsTrigger
                            value="my-divination"
                            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 flex-1 
                                ? "bg-[#2a2a2a] text-white"
                                : "text-white/70 hover:text-white"
                                }`}
                        >
                            <Folder className="w-5 h-5" />
                            {/* <span className="text-xs sm:text-sm mt-1 sm:mt-0">My Divinations</span> */}
                            <span className="text-xs sm:text-sm mt-1 sm:mt-0">{pageWillData.myDivinations}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="latest"
                            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 flex-1
                                ? "bg-[#2a2a2a] text-white"
                                : "text-white/70 hover:text-white"
                                }`}
                        >
                            <Clock className="w-5 h-5" />
                            {/* <span className="text-xs sm:text-sm mt-1 sm:mt-0">Latest Divinations</span> */}
                            <span className="text-xs sm:text-sm mt-1 sm:mt-0">{pageWillData.daoLatestDivinations}</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="featured"
                            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 flex-1 
                                ? "bg-[#2a2a2a] text-white"
                                : "text-white/70 hover:text-white"
                                }`}
                        >
                            <Star className="w-5 h-5" />
                            {/* <span className="text-xs sm:text-sm mt-1 sm:mt-0 whitespace-nowrap">Featured Divinations</span> */}
                            <span className="text-xs sm:text-sm mt-1 sm:mt-0 whitespace-nowrap">
                                {pageWillData.daoFeaturedDivinations}
                            </span>
                        </TabsTrigger>
                    </TabsList>
                </div>
            </div>

            <TabsContent value="my-divination" className="m-0">
                {isUserLoggedIn ? (
                    <div className="max-w-4xl mx-auto">
                        <MyDivinations />
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row items-center justify-center py-16 px-4 text-center md:text-left md:space-x-6">
                        <div className="mb-6 md:mb-0">
                            <p className="text-gray-400 max-w-md">
                                {/* Connect to view your divination history and insights */}
                                {pageWillData.connectToViewTips}
                            </p>
                        </div>
                        <Button
                            onClick={openConnectModal}
                            className="bg-[#2a2a2a] hover:bg-[#333333] text-white/80 hover:text-white border border-[#333333] transition-all whitespace-nowrap"
                            variant="outline"
                        >
                            <span className="mr-2">
                                {/* Connect Wallet */}
                                {commonData.connectWallet}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="latest" className="m-0">
                <div className="max-w-4xl mx-auto">
                    <LatestDaoDivinations />
                </div>
            </TabsContent>

            <TabsContent value="featured" className="m-0">
                <div className="max-w-4xl mx-auto">
                    <FeaturedDaoDivinations />
                </div>
            </TabsContent>
        </Tabs >
    );
};

export default DivinationTabs; 