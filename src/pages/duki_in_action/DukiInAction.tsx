import React, { useState } from 'react';
// import { BaguaDukiDAO } from '../components/assets/BaguaDukiDao';
import { ArrowRight, Coins, ExternalLinkIcon, Gift, Heart, InfoIcon, Package, Scale, Sigma, Users } from 'lucide-react';
import {
  useReadLoveDaoContractBaguaDaoAgg4Me,
  useReadErc20BalanceOf,
  useWriteLoveDaoContractClaim0LoveFounderFairDrop,
  useWriteLoveDaoContractClaim1LoveMaintainerFairDrop,
  useWriteLoveDaoContractClaim2LoveInvestorFairDrop,
  useWriteLoveDaoContractClaim3LoveContributorFairDrop,
  useWriteLoveDaoContractClaim4LoveDukiInfluencerFairDrop,
  useWriteLoveDaoContractClaim5LoveCommunityLotteryFairDrop,
  useWriteLoveDaoContractClaim7LoveWorldDukiInActionFairDrop,
  useWriteLoveDaoContractRequestDaoEvolution,
  useSimulateLoveDaoContractRequestDaoEvolution
} from '@/contracts/generated';
import { useUIStore } from '@/stores/uiStore';
import { useAccount } from 'wagmi';
import { defaultChainWhenNotConnected, dukiDaoContractConfig, MaxInvestorCount } from '@/contracts/externalContracts';
import { waitForTransactionReceipt } from 'viem/actions';
import { config } from '@/wagmi';
import { BaguaDukiDAO } from '@/pages/divi/components/BaguaDukiDao.tsx';
import { BaguaSections, getWillColor, Section } from '@/i18n/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DukiInActionEvents from './DukiInActionEvents';
import { ModalType } from '@/types/common';
import { useIChing, usePageCommonData, usePageDaoData } from '@/i18n/DataProvider';
import { YinYangIcon } from '@/components/icons';
import { formatContractMoney, getContractLink } from '@/utils/commonUtils';
import { TooltipIcon } from '@/components/ui/TooltipIcon';
import { toast } from 'sonner';

// Helper function to safely get values from baguaDaoAgg4Me
const getBaguaValue = (baguaDaoAgg4Me: any, chainId: number, index: number,

  type: 'unitAmount' | 'unitNumber' | 'unitTotal', defaultValue: string = '0') => {
  try {
    // console.log("baguaDaoAgg4Me here", baguaDaoAgg4Me, type);

    if (baguaDaoAgg4Me != undefined && type === 'unitAmount') {
      const amount = baguaDaoAgg4Me?.fairDrops[index]?.unitAmount;
      // console.log("why why amount", amount);
      // return formatNumber(amount);
      return formatContractMoney(amount);
    } else {
      // console.log("baguaDaoAgg4Me here empty", type);
      return baguaDaoAgg4Me?.fairDrops?.[index]?.[type]?.toString() || defaultValue;
    }
  } catch (error) {
    // console.log("why why amount", error);
    return defaultValue;
  }
};

const getCurrentEvolutionTotalDrop = (baguaDaoAgg4Me: any, chainId: number) => {
  // iterate baguaDaoAgg4Me.fairDrops and sum up the unitTotal
  let total = 0n;
  baguaDaoAgg4Me?.fairDrops?.forEach((drop: any) => {
    total = total + BigInt(drop.unitTotal) * BigInt(drop.unitAmount);
  });
  // return Number(total) / dukiDaoContractConfig[defaultChainId].StableCoinBase;
  const result = formatContractMoney(total);
  console.log("result", result);
  return result;
}

const isClaimable = (baguaDaoAgg4Me: any, index: number) => {
  let claimedRound = baguaDaoAgg4Me?.claimedRoundArr?.[index];
  let evolveNum = baguaDaoAgg4Me?.evolveNum;
  debugger;
  if (claimedRound == null || claimedRound <= 0) {
    if (index == 7) {
      return baguaDaoAgg4Me?.stableCoinBalance >= 1 * 10 ** 6;
    }
    return false;
  }
  if (claimedRound < evolveNum) {
    return true;
  }
  return false;
}

const hasClaimed = (baguaDaoAgg4Me: any, index: number) => {
  let claimedRound = baguaDaoAgg4Me?.claimedRoundArr?.[index];
  let evolveNum = baguaDaoAgg4Me?.evolveNum;
  if (claimedRound == null || claimedRound <= 0) {
    return false;
  }
  if (claimedRound >= evolveNum) {
    return true;
  }
  return false;
}

type InvestStatusCheck = "not_invested" | "already_invested" | "max_investor_count_reached";

const checkInvestStatus = (baguaDaoAgg4Me: any): InvestStatusCheck => {
  let investorCount = baguaDaoAgg4Me?.bpsNumArr?.[2];

  if (investorCount == null || investorCount >= MaxInvestorCount) {
    return "max_investor_count_reached";
  }

  let claimedRound = baguaDaoAgg4Me?.claimedRoundArr?.[2]; // 2 is investor

  if (claimedRound != null && claimedRound > 0) {
    return "already_invested";
  }

  return "not_invested";
}


const DukiInAction = () => {
  const [selectedSection, setSelectedSection] = useState<Section>(BaguaSections[0]);
  const { openModal } = useUIStore();
  const iChing = useIChing();
  const { address, isConnected, chainId } = useAccount();
  const targetChainId = chainId || defaultChainWhenNotConnected;
  console.log("targetChainId", targetChainId);

  const handleSectionClick = (selectedSection: Section) => {
    console.log("selectedSection", selectedSection);
    setSelectedSection(selectedSection)
  };

  const {
    data: baguaDaoAgg4Me,
    isLoading: baguaDaoAgg4MeLoading,
    refetch: refetchBaguaDukiDao,
    error: baguaDaoAgg4MeError
  } = useReadLoveDaoContractBaguaDaoAgg4Me({
    address: dukiDaoContractConfig[targetChainId]?.address || '0x',
    args: [address || dukiDaoContractConfig[targetChainId].ZeroAddress],
    query: {
      // enabled: !!dukiDaoContractConfig[defaultChainId]?.address,
      enabled: true,
      refetchInterval: 30000 // Refetch every 30 seconds
    }
  })
  console.log("baguaDaoAgg4Me", baguaDaoAgg4Me);

  // Add balance check before approval
  const { data: totalBalanceOfDao } = useReadErc20BalanceOf({
    address: dukiDaoContractConfig[targetChainId]?.stableCoin || '0x',
    args: [dukiDaoContractConfig[targetChainId]?.address || '0x'],
    query: { enabled: true }
  });
  console.log("totalBalanceOfDao", totalBalanceOfDao);


  // const { writeContractAsync: requestDaoEvolution } = useWriteLoveDaoContractRequestDaoEvolution();


  const { writeContractAsync: claim7AlmDukiInActionFairDrop } = useWriteLoveDaoContractClaim7LoveWorldDukiInActionFairDrop();
  const { writeContractAsync: claim5CommunityLotteryDrop } = useWriteLoveDaoContractClaim5LoveCommunityLotteryFairDrop();
  const { writeContractAsync: claim4DukiInfluencerFairDrop } = useWriteLoveDaoContractClaim4LoveDukiInfluencerFairDrop();
  const { writeContractAsync: claim3ContributorFairDrop } = useWriteLoveDaoContractClaim3LoveContributorFairDrop();
  const { writeContractAsync: claim2UnsInvestorFairDrop } = useWriteLoveDaoContractClaim2LoveInvestorFairDrop();
  const { writeContractAsync: claim1MaintainerFairDrop } = useWriteLoveDaoContractClaim1LoveMaintainerFairDrop();
  const { writeContractAsync: claim0FounderFairDrop } = useWriteLoveDaoContractClaim0LoveFounderFairDrop();


  const handleClaim = async (seq: number) => {
    console.log("handleClaim", seq);
    const getClaimTx = async (seq: number): Promise<`0x${string}`> => {
      switch (seq) {
        case 0:
          return await claim0FounderFairDrop({
            address: dukiDaoContractConfig[targetChainId].address,
            args: [],
          });
        case 1:
          return await claim1MaintainerFairDrop({
            address: dukiDaoContractConfig[targetChainId].address,
            args: [],
          });
        case 2:
          return await claim2UnsInvestorFairDrop({
            address: dukiDaoContractConfig[targetChainId].address,
            args: []
          });
        case 3:
          return await claim3ContributorFairDrop({
            address: dukiDaoContractConfig[targetChainId].address,
            args: []
          });
        case 4:
          return await claim4DukiInfluencerFairDrop({
            address: dukiDaoContractConfig[targetChainId].address,
            args: []
          });
        case 5:
          return await claim5CommunityLotteryDrop({
            address: dukiDaoContractConfig[targetChainId].address,
            args: []
          });
        case 7:
          return await claim7AlmDukiInActionFairDrop({
            address: dukiDaoContractConfig[targetChainId].address,
            args: []
          });
        default:
          throw new Error("Invalid seq");
      }
    }
    const tx = await getClaimTx(seq);
    console.log("tx", tx);
    const txReceipt = await waitForTransactionReceipt(config.getClient(), {
      hash: tx,
    });
    console.log("txReceipt", txReceipt);
    if (txReceipt.status === 'success') {
      refetchBaguaDukiDao();
    }
  }


  // convert bigint to v/100 
  // const notEmptyBpsArr = baguaDaoAgg4Me?.bpsArr.map(bps => Number(bps) / 100) ?? [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const notEmptyBpsArr = baguaDaoAgg4Me?.bpsArr.map(bps => Number(bps) / 100) ?? [10, 10, 10, 10, 10, 10, 10, 10, 10];


  const pageDaoData = usePageDaoData();
  const commonData = usePageCommonData();

  const { writeContractAsync: requestDaoEvolution } = useWriteLoveDaoContractRequestDaoEvolution();


  // Just for local testing
  // const msgValue = 16000000000000000n;
  // const maxCallbackGasLimit = 300000n;
  // const { data: simulateData, error: simulateError, refetch: refetchSimulation } = useSimulateLoveDaoContractRequestDaoEvolution({
  //   address: dukiDaoContractConfig[targetChainId].address,
  //   args: [maxCallbackGasLimit],
  //   value: msgValue,
  //   query: {
  //     enabled: false, // Don't run automatically on mount
  //   }
  // });
  // console.log("simulateData", simulateData, simulateError);

  // const handleEvolve = async () => {
  //   try {
  //     console.log("Attempting simulation before evolve...");
  //     const { data: simData, error: simError } = await refetchSimulation();

  //     if (simError || !simData?.request) {
  //       console.error("Simulation failed:", simError);
  //       toast.error(`Simulation failed: ${simError?.message || 'Unknown error'}`);
  //       return;
  //     }

  //     console.log("Simulation successful, proceeding with evolution request.", simData.request);
  //     const tx = await requestDaoEvolution({
  //       address: dukiDaoContractConfig[targetChainId].address,
  //       args: [maxCallbackGaseipit],
  //       value: msgValue
  //     }); // Use the request from simulation result
  //     console.log("tx", tx);

  //     toast.info("Evolution transaction sent. Waiting for confirmation...");

  //     const txReceipt = await waitForTransactionReceipt(config.getClient(), {
  //       hash: tx,
  //     });
  //     console.log("txReceipt", txReceipt);

  //     if (txReceipt.status === 'success') {
  //       toast.success("Dao Evolution Successful!");
  //       refetchBaguaDukiDao();
  //     } else {
  //       toast.error("Dao Evolution Transaction Failed.");
  //     }
  //   } catch (error: any) {
  //     console.error("Error during evolution process:", error);
  //     toast.error(`Evolution failed: ${error.shortMessage || error.message || 'Unknown error'}`);
  //   }
  // }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">

            <div className="flex flex-col items-center mb-2">
              <span className="text-white text-xs">
                <a
                  href={`https://alllivesmatter.world`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300 ease-in-out transform hover:scale-110 flex items-center gap-1"
                >
                  <ExternalLinkIcon className="h-3 w-3 transform rotate-[-90deg]" />
                  <span>AllLiveMatter.World</span>
                </a>
              </span>
              <span className="text-white text-xs text-center ">
                {/* DUKI In Action */}
                {pageDaoData.dukiInAction}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
              {pageDaoData.daoTerm}
            </h1>
            <a
              // href={`${dukiDaoContractConfig[defaultChainId].explorer}/address/${dukiDaoContractConfig[defaultChainId].address}`}
              href={getContractLink(chainId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-300 transition-colors duration-300 ease-in-out transform hover:scale-110"
            >
              <ExternalLinkIcon className="h-6 w-6" />
            </a>
          </div>
          <p className='text-white-400 text-sm text-center pb-4'>
            {pageDaoData.daoTermDefinitionPrefix}
            <span className="relative inline-block ml-1">
              {pageDaoData.daoTermDefinitionMiddle}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center ml-0.5 align-top">
                      <InfoIcon className="h-3 w-3 text-white-400 hover:text-white-300" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-white-400 
                          text-sm 
                          whitespace-normal 
                          break-words">
                      <div dangerouslySetInnerHTML={{ __html: pageDaoData.dukiDefinition }} />
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            {pageDaoData.daoTermDefinitionSuffix}
          </p>

          {/* {process.env.NODE_ENV === 'development' && address === '0x70F0f595b9eA2E3602BE780cc65263513A72bba3' && (
            <button onClick={() => {
              // handleEvolve();
            }} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 mb-4 rounded">
              Evolve
            </button>
          )} */}


          <div className='max-w-6xl mx-auto backdrop-blur-sm text-white rounded-lg p-2 shadow-lg flex items-center'>
            <div className="text-xs text-gray-100">
              <InfoIcon className="h-3 w-3 text-red-500 mr-1 inline-block" />
              {pageDaoData.daoEvolutionDescPrefix}
              <a
                href={getContractLink(targetChainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-yellow-500 mr-1 hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-110"
              >
                {dukiDaoContractConfig[targetChainId].name}.
              </a>
              {pageDaoData.daoEvolutionDesc}
            </div>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">

            {/* Block 1 - Evolution Info */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
              <div className="text-purple-400 text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                {/* Evolution Status */}
                {pageDaoData.evolutionStatus}
              </div>


              <p className="text-3xl font-bold text-white mb-1">
                {baguaDaoAgg4Me?.evolveNum?.toString() || '0'}
              </p>
              <p className="text-sm text-gray-400">
                {pageDaoData.currentBlock}
              </p>
            </div>

            {/* Block 2 - FairDrop Info */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
              <div className="text-green-400 text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                {pageDaoData.currentEvolutionDrop}
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {/* {getBaguaValue(baguaDaoAgg4Me, chainId, 1, 'unitAmount')} */}
                {getCurrentEvolutionTotalDrop(baguaDaoAgg4Me, chainId)?.toString() || '0'}
              </p>
              <p className="text-sm text-gray-400">
                <Sigma className="h-4 w-4 inline-block mb-1" />
                {pageDaoData.historyTotalDrop} {formatContractMoney(baguaDaoAgg4Me?.totalClaimedAmount)} USDC
              </p>
            </div>

            {/* Block 3 - DAO Balance */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
              <div className="text-blue-400 text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                {pageDaoData.treasury}
              </div>
              <p className="text-xl font-bold text-white mb-1">
                {/* {getBaguaValue(baguaDaoAgg4Me, chainId, 5, 'unitAmount')}  */}
                {formatContractMoney(totalBalanceOfDao)}
              </p>
              <p className="text-sm text-gray-400">
                {pageDaoData.usdcBalance}
              </p>
            </div>

            {/* Block 4 - Lottery Info */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
              <div className="text-yellow-400 text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                {pageDaoData.lottery}
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                #{baguaDaoAgg4Me?.communityLuckyNumber.toString() || '?'}
              </p>
              <p className="text-sm text-gray-400">
                {pageDaoData.maxPrize}: {getBaguaValue(baguaDaoAgg4Me, chainId, 5, 'unitAmount')}
                <TooltipIcon content={pageDaoData.lotteryPrizeRule} />
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 items-center">
          {/* BaguaDuki Diagram - Added scaling classes */}
          <div className="relative w-full flex justify-center items-center border border-gray-700 rounded-xl">
            <div className="w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
              <BaguaDukiDAO onElementClick={handleSectionClick} bpsArr={notEmptyBpsArr} showText={true} />
            </div>
          </div>

          {/* Info Panel */}
          <div className="border border-gray-700 rounded-xl p-3 sm:px-8 w-full min-h-[250px] sm:h-[400px] lg:h-[500px] overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* SECTION 1: Header with title and description */}
              <div className="mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 break-words"
                  style={{ color: getWillColor(selectedSection.seq) }}>
                  {selectedSection.seq === 8 && (
                    <YinYangIcon className="h-6 w-6 inline-block mr-1" />)
                  }
                  {selectedSection.seq !== 8 && `${selectedSection.cn_seq.toString()} `}
                  {/* ${selectedSection.seq.toString()}b  */}



                  {/* - {selectedSection.id} */}
                  - {iChing[selectedSection.bid]?.name || 'DAO'}
                  &nbsp;
                  ({selectedSection.ch_symbol}
                  <Heart className="h-5 w-5 inline-block ml-1" />)
                  &nbsp;
                  <span className="inline-block">
                    <div className="flex flex-col items-center">
                      <span className="text-gray-400 text-[8px]">
                        {selectedSection.seq !== 8 && `${selectedSection.bid.toString()}`} &nbsp;
                        {selectedSection.seq !== 8 && `${selectedSection.seq.toString()}b`}
                      </span>
                    </div>
                  </span>
                </h2>
                <p className="text-gray-100 text-xl sm:text-sm">
                  {pageDaoData.sections?.[selectedSection.seq].description}
                </p>
              </div>

              {/* SECTION 2: Details section with stats and information */}
              <div className="flex-grow border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-purple-400 whitespace-nowrap">
                    {selectedSection.seq === 8 ? '100% ' : (notEmptyBpsArr[selectedSection.seq] ? `${notEmptyBpsArr[selectedSection.seq]}% ` : '·')} - {pageDaoData.sections?.[selectedSection.seq].title}
                  </h3>

                  {
                    selectedSection.supportClaimed && (
                      <button
                        onClick={() => {
                          handleClaim(selectedSection.seq);
                        }}
                        // className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors flex items-center gap-2">
                        disabled={!isClaimable(baguaDaoAgg4Me, selectedSection.seq)}
                        className={`px-3 py-2 ${isClaimable(baguaDaoAgg4Me, selectedSection.seq) ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'} text-white rounded text-sm transition-colors flex items-center gap-2`}>
                        <Gift className="h-5 w-5" />
                        {/* Claim */}
                        {hasClaimed(baguaDaoAgg4Me, selectedSection.seq) ? pageDaoData.claimed : pageDaoData.claim}
                      </button>
                    )
                  }
                </div>

                <div className="text-gray-400 text-sm">
                  {baguaDaoAgg4MeLoading ? (
                    <div className="flex justify-center items-center h-20">
                      <p>{commonData.loading}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      {selectedSection.seq === 8 ? (
                        <div className="flex flex-col space-y-4">
                          <div>
                            <span className="text-white flex items-center gap-1 text-ml font-bold">
                              <Heart className="h-4 w-4" />
                              {pageDaoData.almWorldSlogons[0].slogon}
                            </span>
                            <span className="text-gray-400 text-xs block mt-1">
                              {pageDaoData.almWorldSlogons[0].desc}
                            </span>
                          </div>

                          <div>
                            <span className="text-white text-gray-400 flex items-center gap-1 text-ml font-bold">
                              <Scale className="h-4 w-4" />
                              {pageDaoData.almWorldSlogons[1].slogon}
                            </span>
                            <span className="text-gray-400 text-xs block mt-1">
                              {pageDaoData.almWorldSlogons[1].desc}
                            </span>
                          </div>

                          <div>
                            <span className="text-white flex items-center gap-1 text-ml font-bold">
                              <Coins className="h-4 w-4" />
                              {pageDaoData.almWorldSlogons[2].slogon}
                            </span>
                            <span className="text-gray-400 text-xs block mt-1">
                              {pageDaoData.almWorldSlogons[2].desc}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {pageDaoData.dropUnits}
                            </span>
                            <span className="text-white font-medium">
                              {getBaguaValue(baguaDaoAgg4Me, chainId, selectedSection.seq, 'unitNumber')}
                              /{getBaguaValue(baguaDaoAgg4Me, chainId, selectedSection.seq, 'unitTotal')}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Coins className="h-4 w-4" />
                              {pageDaoData.dropDollars}
                            </span>
                            <span className="text-white font-medium">
                              {getBaguaValue(baguaDaoAgg4Me, chainId, selectedSection.seq, 'unitAmount')} USDC
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {pageDaoData.totalParticipants}
                            </span>
                            <span className="text-white font-medium flex items-center gap-1">
                              {(baguaDaoAgg4Me?.bpsNumArr?.[selectedSection.seq] || 0).toString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: Requirements section */}
              <div className="border-t border-gray-700 pt-4 mt-auto">
                <h4 className="text-lg font-semibold text-purple-400 mb-2">
                  {selectedSection.seq === 8 ? pageDaoData.philosophy : pageDaoData.claimRequirements}
                </h4>
                <div>
                  {(() => {
                    if (true) {
                      const requirements = pageDaoData?.sections?.[selectedSection.seq].requirements;
                      return (
                        <div className="space-y-2">
                          <p className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: requirements?.p1 || '' }}>
                          </p>
                          {requirements?.p2?.length > 0 && (
                            <p className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: requirements?.p2 || '' }}>
                            </p>
                          )}

                          {requirements?.btn && (
                            (() => {
                              const status = checkInvestStatus(baguaDaoAgg4Me);
                              switch (status) {
                                case "not_invested":
                                  return (
                                    <button
                                      onClick={() => {
                                        openModal(requirements?.btn?.modal as ModalType)
                                      }}
                                      className="rounded flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg text-white transition-all">
                                      <span className="font-medium">{requirements?.btn?.text}</span>
                                      <ArrowRight className="h-4 w-4" />
                                    </button>
                                  );
                                case "already_invested":
                                  return (
                                    <div className="inline-block px-3 py-2 text-green-500 text-sm bg-green-500/10 rounded-lg border border-green-500/20">
                                      {/* You have already an investor. */}
                                      {pageDaoData.alreadyAnInvestor}
                                    </div>
                                  );
                                case "max_investor_count_reached":
                                  return (
                                    <div className="inline-block px-3 py-2 text-amber-500 text-sm bg-amber-500/10 rounded-lg border border-amber-500/20">
                                      {/* The investor count has already reached {MaxInvestorCount}. */}
                                      {pageDaoData.maxInvestorCountReached}
                                    </div>
                                  );
                                default:
                                  return null;
                              }
                            })()
                          )}
                        </div>

                      );
                    }
                  })()}

                </div>

              </div>

            </div>
          </div>
        </div>

        <DukiInActionEvents chainId={chainId} />
      </div>
    </div >
  );
};

export default DukiInAction;