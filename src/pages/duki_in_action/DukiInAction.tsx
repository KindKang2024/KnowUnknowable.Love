import React, { useEffect, useState } from 'react';
// import { BaguaDukiDAO } from '../components/assets/BaguaDukiDao';
import { ArrowRight, Coins, ExternalLinkIcon, Gift, Heart, InfoIcon, Package, Scale, Users } from 'lucide-react';
import {
  useReadBaguaDukiDaoContractBuaguaDaoAgg4Me,
  useReadErc20BalanceOf,
  useReadErc20Allowance,
  useWriteBaguaDukiDaoContractClaim0LoveFounderFairDrop,
  useWriteBaguaDukiDaoContractClaim1LoveMaintainerFairDrop,
  useWriteBaguaDukiDaoContractClaim2LoveInvestorFairDrop,
  useWriteBaguaDukiDaoContractClaim3LoveContributorFairDrop,
  useWriteBaguaDukiDaoContractClaim4LoveBuilderFairDrop,
  useWriteBaguaDukiDaoContractClaim5LoveCommunityLotteryFairDrop,
  useWriteBaguaDukiDaoContractClaim7LoveWorldDukiInActionFairDrop,
  useWriteBaguaDukiDaoContractRequestDaoEvolution
} from '@/contracts/generated';
import { useUIStore } from '@/stores/uiStore';
import { useAccount } from 'wagmi';
import { dukiDaoContractConfig } from '@/contracts/externalContracts';
import { waitForTransactionReceipt } from 'viem/actions';
import { config } from '@/wagmi';
import { BaguaDukiDAO } from '@/pages/divi/components/BaguaDukiDao.tsx';
import { BaguaSections, getWillColor, Section } from '@/i18n/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DukiInActionEvents from './DukiInActionEvents';
import { ModalType } from '@/types/common';
import { usePageCommonData, usePageDaoData } from '@/i18n/DataProvider';
import { YinYangIcon } from '@/components/icons';

// Helper function to safely get values from baguaDaoAgg4Me
const getBaguaValue = (baguaDaoAgg4Me: any, chainId: number, index: number,

  type: 'unitAmount' | 'unitNumber' | 'unitTotal', defaultValue: string = '1') => {
  try {
    console.log("baguaDaoAgg4Me here", baguaDaoAgg4Me, type);
    if (baguaDaoAgg4Me != undefined && type === 'unitAmount') {
      const amount = Number(baguaDaoAgg4Me?.fairDrops[index]?.unitAmount) * 1.0;
      console.log("why why amount", amount);
      return (amount / dukiDaoContractConfig[chainId].StableCoinBase);
    } else {
      console.log("baguaDaoAgg4Me here empty", type);
      return baguaDaoAgg4Me?.fairDrops?.[index]?.[type]?.toString() || defaultValue;
    }
  } catch (error) {
    console.log("why why amount", error);
    return defaultValue;
  }
};

const DukiInAction = () => {
  const [selectedSection, setSelectedSection] = useState<Section>(BaguaSections[0]);
  const { openModal } = useUIStore();
  const { address, isConnected, chainId } = useAccount();

  const handleSectionClick = (selectedSection: Section) => {
    console.log("selectedSection", selectedSection);
    setSelectedSection(selectedSection)
  };

  const {
    data: baguaDaoAgg4Me,
    isLoading: baguaDaoAgg4MeLoading,
    refetch: refetchBaguaDukiDao,
    error: baguaDaoAgg4MeError
  } = useReadBaguaDukiDaoContractBuaguaDaoAgg4Me({
    address: dukiDaoContractConfig[chainId].address,
    args: [address],
    query: {
      enabled: true
    }
  })

  // Add balance check before approval
  const { data: totalBalanceOfDao } = useReadErc20BalanceOf({
    address: dukiDaoContractConfig[chainId].stableCoin,
    args: [dukiDaoContractConfig[chainId].address],
    query: { enabled: true }
  });
  console.log("totalBalanceOfDao", totalBalanceOfDao);


  const { writeContractAsync: requestDaoEvolution } = useWriteBaguaDukiDaoContractRequestDaoEvolution();


  const { writeContractAsync: claim7AlmDukiInActionFairDrop } = useWriteBaguaDukiDaoContractClaim7LoveWorldDukiInActionFairDrop();
  const { writeContractAsync: claim5CommunityLotteryDrop } = useWriteBaguaDukiDaoContractClaim5LoveCommunityLotteryFairDrop();
  const { writeContractAsync: claim4BuilderFairDrop } = useWriteBaguaDukiDaoContractClaim4LoveBuilderFairDrop();
  const { writeContractAsync: claim3ContributorFairDrop } = useWriteBaguaDukiDaoContractClaim3LoveContributorFairDrop();
  const { writeContractAsync: claim2UnsInvestorFairDrop } = useWriteBaguaDukiDaoContractClaim2LoveInvestorFairDrop();
  const { writeContractAsync: claim1MaintainerFairDrop } = useWriteBaguaDukiDaoContractClaim1LoveMaintainerFairDrop();
  const { writeContractAsync: claim0FounderFairDrop } = useWriteBaguaDukiDaoContractClaim0LoveFounderFairDrop();


  const handleEvolve = async () => {
    const tx = await requestDaoEvolution({
      address: dukiDaoContractConfig[chainId].address,
      args: [dukiDaoContractConfig[chainId].requestDaoEvolutionGasLimit]
    });
    console.log(tx);
    // Wait for the transaction to be mined
    const txReceipt = await waitForTransactionReceipt(config.getClient(), {
      hash: tx,
    });
    console.log("txReceipt", txReceipt);
    refetchBaguaDukiDao();
  }


  const handleClaim = async (seq: number) => {
    console.log("handleClaim", seq);
    const getClaimTx = async (seq: number): Promise<`0x${string}`> => {
      switch (seq) {
        case 0:
          return await claim0FounderFairDrop({
            address: dukiDaoContractConfig[chainId].address,
            args: [],
          });
        case 1:
          return await claim1MaintainerFairDrop({
            address: dukiDaoContractConfig[chainId].address,
            args: [],
          });
        case 2:
          return await claim2UnsInvestorFairDrop({
            address: dukiDaoContractConfig[chainId].address,
            args: []
          });
        case 3:
          return await claim3ContributorFairDrop({
            address: dukiDaoContractConfig[chainId].address,
            args: []
          });
        case 4:
          return await claim4BuilderFairDrop({
            address: dukiDaoContractConfig[chainId].address,
            args: []
          });
        case 5:
          return await claim5CommunityLotteryDrop({
            address: dukiDaoContractConfig[chainId].address,
            args: []
          });
        case 7:
          return await claim7AlmDukiInActionFairDrop({
            address: dukiDaoContractConfig[chainId].address,
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
  }


  // convert bigint to v/100 
  // const notEmptyBpsArr = baguaDaoAgg4Me?.bpsArr.map(bps => Number(bps) / 100) ?? [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const notEmptyBpsArr = baguaDaoAgg4Me?.bpsArr.map(bps => Number(bps) / 100) ?? [10, 10, 10, 10, 10, 10, 10, 10, 10];

  console.log("baguaDaoAgg4Me", baguaDaoAgg4Me);

  const pageDaoData = usePageDaoData();
  const commonData = usePageCommonData();


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
                  <span>AllLiveMmatter.World</span>
                </a>
              </span>
              <span className="text-white text-xs text-center ">DUKI In Action</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
              {pageDaoData.daoTerm}
            </h1>
            <a
              href={`${dukiDaoContractConfig[chainId].explorer}/address/${dukiDaoContractConfig[chainId].address}`}
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
                      {pageDaoData.dukiDefinition}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            {pageDaoData.daoTermDefinitionSuffix}
          </p>

          {false && address === '0x70F0f595b9eA2E3602BE780cc65263513A72bba3' && (
            <button onClick={() => handleEvolve()} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 mb-4 rounded">
              Evolve
            </button>
          )}

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
                {pageDaoData.fairDrop}
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {getBaguaValue(baguaDaoAgg4Me, chainId, 1, 'unitAmount')}
              </p>
              <p className="text-sm text-gray-400">
                {pageDaoData.usdcAvailable}
              </p>
            </div>

            {/* Block 3 - DAO Balance */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
              <div className="text-blue-400 text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                {pageDaoData.treasury}
              </div>
              <p className="text-xl font-bold text-white mb-1">
                {totalBalanceOfDao ?
                  new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  }).format(Number(totalBalanceOfDao) / (10 ** 6)) : '0'}
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
                #{getBaguaValue(baguaDaoAgg4Me, chainId, 0, 'unitNumber')}
              </p>
              <p className="text-sm text-gray-400">
                {getBaguaValue(baguaDaoAgg4Me, chainId, 3, 'unitAmount')} USDC Prize
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 items-center">
          {/* BaguaDuki Diagram - Added scaling classes */}
          <div className="relative w-full flex justify-center items-center border border-gray-700 rounded-xl">
            <div className="w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] animate-[spin_60s_linear_infinite]">
              <BaguaDukiDAO onElementClick={handleSectionClick} bpsArr={notEmptyBpsArr} />
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
                  {selectedSection.seq !== 8 && selectedSection.seq.toString()}
                  - {selectedSection.id}
                  &nbsp;({selectedSection.ch_symbol}
                  <Heart className="h-5 w-5 inline-block ml-1" />)
                </h2>
                <p className="text-gray-100 text-xl sm:text-sm">
                  {pageDaoData.sections?.[selectedSection.seq].description}
                </p>
              </div>

              {/* SECTION 2: Details section with stats and information */}
              <div className="flex-grow border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-purple-400 whitespace-nowrap">
                    {pageDaoData.sections?.[selectedSection.seq].title}
                  </h3>

                  {
                    selectedSection.hasClaimed && (
                      <button
                        onClick={() => {
                          handleClaim(selectedSection.seq);
                        }}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors flex items-center gap-2">
                        <Gift className="h-5 w-5" />
                        Claim
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
                            <button
                              onClick={() => openModal(requirements?.btn?.modal as ModalType)}
                              className="rounded flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg text-white transition-all">
                              <span className="font-medium">{requirements?.btn?.text}</span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
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