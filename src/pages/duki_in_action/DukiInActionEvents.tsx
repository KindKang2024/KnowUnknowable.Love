import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { defaultChainWhenNotConnected, dukiDaoContractConfig } from '@/contracts/externalContracts';
import { useAccount, useBlockNumber, useChainId, usePublicClient } from 'wagmi';
import { usePageCommonData, usePageDaoData } from '@/i18n/DataProvider';
import { getAccountLink, getTxLink } from '@/utils/commonUtils';
import { useQuery } from '@tanstack/react-query';
import { parseAbiItem } from 'viem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DaoEvent, Transaction,  useDaoInvestors, useLatestDaoEvents, useMyDaoEvents } from '@/services/api';
import { cn } from '@/lib/utils';
import { RefreshCcw } from 'lucide-react';
import { useReadLoveDaoContractBaguaDaoAgg4Me } from '@/contracts/generated';


// interface TransactionListProps {
//     transactions: Transaction[];
// }
interface DaoEventListProps {
    events: DaoEvent[];
    emptyEventText?: string;
}

const DaoEventList: React.FC<DaoEventListProps> = ({ events, emptyEventText }) => {
    const chainId = useChainId();
    const pageDaoData = usePageDaoData();
    const stableCoinBase = dukiDaoContractConfig[chainId].StableCoinBase;

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px]">
                <div className="grid grid-cols-5 text-sm text-gray-500 mb-4 px-4">
                    {/* <div className="text-left">AGE</div>
                    <div className="text-left">Interaction</div>
                    <div className="text-left">AMOUNT</div>
                    <div className="text-left">CREATOR</div>
                    <div className="text-left">TX HASH</div> */}
                    <div className="text-left">{pageDaoData.manifestation.age}</div>
                    <div className="text-left">{pageDaoData.manifestation.interaction}</div>
                    <div className="text-left">{pageDaoData.manifestation.amount}</div>
                    <div className="text-left">{pageDaoData.manifestation.creator}</div>
                    <div className="text-left">{pageDaoData.manifestation.txHash}</div>
                </div>

                {events.length > 0 ? (
                    <div className="space-y-2">
                        {events.map((evt) => (
                            <div key={evt.tx_hash} className="grid grid-cols-5 p-4 border border-gray-700 hover:bg-gray-800/50 rounded-lg mb-2">
                                <div className="text-gray-400">
                                    {formatDistanceToNow(new Date(evt.event_data.timestamp * 1000), { addSuffix: false, includeSeconds: false })}
                                </div>

                                <div className={`${evt.event_data.interactType < 3 ? 'text-green-400' : 'text-red-400'}`}>
                                    {/* {InteractTypes[tx.interactType].label} */}
                                    {pageDaoData.manifestation.interactTypes[evt.event_data.interactType]}
                                </div>
                                <div className={`${evt.event_data.interactType < 3 ? 'text-green-400' : 'text-red-400'}`}>
                                    {evt.event_data.interactType < 3 ? '+' : '-'}  {(evt.event_data.amount / stableCoinBase).toFixed(2)} USDC
                                </div>
                                <div className="text-gray-400 overflow-hidden text-ellipsis">
                                    {/* <a href={`https://sepolia.etherscan.io/address/${tx.account}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors duration-300"> */}
                                    <a href={`${getAccountLink(evt.event_data.user, chainId)}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                                        {`${evt.event_data.user.slice(0, 6)}...${evt.event_data.user.slice(-4)}`}
                                    </a>
                                </div>
                                <div className="text-gray-400 overflow-hidden text-ellipsis">
                                    {/* <a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors duration-300"> */}
                                    <a href={`${getTxLink(evt.tx_hash, chainId)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors duration-300">
                                        {evt.tx_hash.slice(0, 6)}...{evt.tx_hash.slice(-4)}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        {/* No transactions found */}
                        {emptyEventText}
                    </div>
                )}
            </div>
        </div>
    );
};

const DukiInActionEvents = ({ chainId }: { chainId: number }) => {
    const pageDaoData = usePageDaoData();
    const commonData = usePageCommonData();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const { address, isConnected } = useAccount();
    const targetChainId = chainId || defaultChainWhenNotConnected;

    const {
        data: baguaDaoAgg4Me,
        isLoading: baguaDaoAgg4MeLoading,
        refetch: refetchBaguaDukiDao,
        error: baguaDaoAgg4MeError
    } = useReadLoveDaoContractBaguaDaoAgg4Me({
        address: dukiDaoContractConfig[targetChainId]?.address || '0x',
        args: [address],
        query: {
            enabled: isConnected,
            refetchInterval: 30000 // Refetch every 30 seconds
        }
    })

    // Convert basis points to percentage (1 basis point = 0.01%)
    const investorSharedRevenueBps= Number(baguaDaoAgg4Me?.bpsArr[2]) ?? 2000;
    const investorSharedRatioPercentage = (investorSharedRevenueBps / 100.0).toFixed(2) + '%';
    const formattedNoInvestorPromotion = pageDaoData.noInvestorPromotion?.replace('%s', investorSharedRatioPercentage);

    // get latest block, use wagmi
    const { data: latestBlock, refetch: refetchLatestBlock, isLoading: isBlockLoading, isFetching: isBlockFetching } = useBlockNumber({
        chainId: targetChainId,
        watch: false
    });
    // const { data: allInvestors, isLoading: isAllInvestorsLoading, isFetching: isAllInvestorsFetching } = useAllInvestors(latestBlock);
    const { data: latestDaoEvents, isLoading: isLatestDaoEventsLoading, 
        refetch: refetchLatestDaoEvents,
        isFetching: isLatestDaoEventsFetching } = useLatestDaoEvents(latestBlock);
    const { data: myEvents, isLoading: isMyLoading, isFetching: isMyFetching, fetchNextPage: fetchMoreEvents, hasNextPage: hasMoreEvents } = useMyDaoEvents(latestBlock);

    const { data: daoInvestors, isLoading: isDaoInvestorsLoading, isFetching: isDaoInvestorsFetching } = useDaoInvestors(latestBlock);


    const handleRefresh = () => {
        setIsRefreshing(true);
        refetchLatestBlock();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    };


    // const { data: allEvents = [], isLoading: isAllLoading, isFetching: isAllFetching } = useQuery({
    //     queryKey: ['latestEvents', lastUpdate],
    //     queryFn: async () => {
    //         const logs = await publicClient.getLogs({
    //             address: dukiDaoContractConfig[targetChainId]?.address,
    //             event: dukiInActionEvent,
    //             fromBlock: 0n,
    //             toBlock: 'latest'
    //         });

    //         return logs
    //             .map(log => ({
    //                 timestamp: Number(log.args.timestamp) * 1000,
    //                 txHash: log.transactionHash,
    //                 account: log.args.user,
    //                 amount: Number(log.args.amount) / dukiDaoContractConfig[targetChainId].StableCoinBase,
    //                 interactType: log.args.interactType,
    //                 units: Number(log.args.unitNumber),
    //                 evolveNum: Number(log.args.daoEvolveRound),
    //                 metaDomain: log.args.metaDomain
    //             }))
    //             .slice(0, 64);
    //     },
    //     staleTime: 1000 * 60 * 5,
    //     gcTime: 1000 * 60 * 30,
    //     refetchOnWindowFocus: false,
    //     refetchOnMount: false,
    //     refetchOnReconnect: false
    // });


    return (
        <div className="w-full mt-6">
            <div className="border border-gray-700 rounded-xl p-6 min-h-[600px] flex flex-col">
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                        <span className="text-purple-400">
                            {/* DAO IN ACTION */}
                            {pageDaoData.dukiInAction}
                        </span>
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {/* Track the latest manifestations as they unfold. */}
                        {pageDaoData.trackLatestTransactions}
                    </p>
                </div>

                {/* shadcn Tabs with custom styling */}
                <Tabs defaultValue="dao" className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <TabsList className="bg-transparent p-0 h-auto">
                            <TabsTrigger
                                value="dao"
                                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-gray-800 text-gray-400 hover:bg-gray-700 data-[state=active]:shadow-none px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                {pageDaoData.allTransactions}
                            </TabsTrigger>

                            <TabsTrigger
                                value="daoInvestmentNews"
                                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-gray-800 text-gray-400 hover:bg-gray-700 data-[state=active]:shadow-none px-4 py-2 rounded-lg font-medium transition-colors ml-4"
                            >
                                {pageDaoData.daoInvestmentNews}
                            </TabsTrigger>

                            <TabsTrigger
                                value="me"
                                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-gray-800 text-gray-400 hover:bg-gray-700 data-[state=active]:shadow-none px-4 py-2 rounded-lg font-medium transition-colors ml-4"
                            >
                                {pageDaoData.myTransactions}
                            </TabsTrigger>
                        </TabsList>

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <RefreshCcw className={cn("w-4 h-4", isRefreshing || isBlockLoading || isBlockFetching || isLatestDaoEventsLoading || isLatestDaoEventsFetching ? 'animate-spin' : '')} />
                            {commonData.buttons.refresh}
                        </button>
                    </div>

                    <TabsContent value="dao" className="flex-1 data-[state=inactive]:hidden">
                        {isLatestDaoEventsLoading ? (
                            <div className="text-center py-8 text-gray-400">
                                {commonData.loading}
                            </div>
                        ) : (
                            <div className={`${isLatestDaoEventsLoading ? 'opacity-50' : ''}`}>
                                <DaoEventList events={latestDaoEvents || []} emptyEventText={pageDaoData.noTransactionsFound} />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="daoInvestmentNews" className="flex-1 data-[state=inactive]:hidden">
                        {isDaoInvestorsLoading ? (
                            <div className="text-center py-8 text-gray-400">
                                {commonData.loading}
                            </div>
                        ) : (
                            <div className={`${isDaoInvestorsLoading ? 'opacity-50' : ''}`}>

                                {/* // add some text here, if empty  */}
                                <DaoEventList events={daoInvestors || []} emptyEventText={formattedNoInvestorPromotion} />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="me" className="flex-1 data-[state=inactive]:hidden">
                        {isMyLoading ? (
                            <div className="text-center py-8 text-gray-400">
                                {commonData.loading}
                            </div>
                        ) : (
                            <div className={`${isMyFetching ? 'opacity-50' : ''}`}>
                                <DaoEventList events={myEvents?.pages?.flatMap(page => page.data) || []} emptyEventText={pageDaoData.noTransactionsFound} />
                                {hasMoreEvents && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={() => fetchMoreEvents()}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                            disabled={isMyFetching}
                                        >
                                            {isMyFetching ? commonData.loading : commonData.loadMore}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default DukiInActionEvents;