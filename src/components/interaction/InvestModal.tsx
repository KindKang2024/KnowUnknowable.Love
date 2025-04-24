import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import {
    useReadLoveDaoContractBaguaDaoAgg4Me,
    useReadErc20Allowance,
    useReadErc20BalanceOf,
    useWriteLoveDaoContractConnectDaoToInvest,
    useWriteErc20Approve
} from '@/contracts/generated';
import { toast } from '@/hooks/use-toast';
import {
    defaultChainWhenNotConnected,
    dukiDaoContractConfig,
    InvestFeeBaseAmount,
    InvestFeeDollarAmount
} from '@/contracts/externalContracts';
import { waitForTransactionReceipt } from 'viem/actions';
import { useQueryClient } from '@tanstack/react-query';
import { config } from '@/wagmi';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Coins, Crown } from "lucide-react";
import { usePageCommonData } from '@/i18n/DataProvider';

interface InvestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InvestModal = ({ isOpen, onClose }: InvestModalProps) => {
    const queryClient = useQueryClient();

    const { address, isConnected, chainId } = useAccount();
    const targetChainId = chainId || defaultChainWhenNotConnected;

    const [error, setError] = useState('');
    const [transactionHash, setTransactionHash] = useState<string | null>(null);

    const commonPageData = usePageCommonData();

    const { writeContractAsync: connectDaoToInvest,
        isSuccess: connectDaoToInvestSuccess,
        isPending: connectDaoToInvestPending,
        isError: isConnectDaoToInvestError,
        error: connectDaoToInvestError
    } = useWriteLoveDaoContractConnectDaoToInvest();

    const { data: balance } = useReadErc20BalanceOf({
        address: dukiDaoContractConfig[targetChainId]?.stableCoin || '0x',
        args: [address!],
        query: { enabled: true }
    });

    const { data: allowance } = useReadErc20Allowance({
        address: dukiDaoContractConfig[targetChainId]?.stableCoin || '0x',
        args: [address!, dukiDaoContractConfig[targetChainId]?.address || '0x'],
        query: { enabled: true }
    });

    const { writeContractAsync: approve,
        isSuccess: approveSuccess,
        isPending: approvePending,
        isError: isApproveError,
        error: approveError
    } = useWriteErc20Approve();

    const {
        refetch: refetchBaguaDaoAgg4Me,
      } = useReadLoveDaoContractBaguaDaoAgg4Me({
        address: dukiDaoContractConfig[targetChainId]?.address || '0x',
        args: [address || dukiDaoContractConfig[targetChainId].ZeroAddress],
        query: {
          enabled: true,
          refetchInterval: 8000 // Refetch every 8 seconds
        }
      })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setTransactionHash(null);

        if (isConnected !== true) {
            toast({
                // title: 'Please connect your wallet',
                title: commonPageData.connectWallet,
                variant: 'destructive',
            });
            return;
        }

        try {
            if ((balance !== undefined) && balance < InvestFeeBaseAmount) {
                // setError(`Insufficient balance: invest amount is ${InvestFeeDollarAmount} `);
                setError(commonPageData.modals.insufficientBalanceError);
                return;
            }

            if ((allowance === undefined || allowance === 0n) || allowance < InvestFeeBaseAmount) {
                const approveTx = await approve({
                    address: dukiDaoContractConfig[targetChainId]?.stableCoin || '0x',
                    args: [dukiDaoContractConfig[targetChainId]?.address || '0x', InvestFeeBaseAmount]
                });

                const approveReceipt = await waitForTransactionReceipt(
                    config.getClient(),
                    {
                        hash: approveTx,
                    }
                );

                if (approveReceipt.status === 'success') {
                    console.log('Approval successful');
                } else {
                    // setError('Approval failed');
                    setError(commonPageData.modals.approvalFailed);
                    return;
                }
            }

            const subscribeTx = await connectDaoToInvest({
                address: dukiDaoContractConfig[targetChainId]?.address || '0x',
                args: []
            });

            const subscribeReceipt = await waitForTransactionReceipt(
                config.getClient(),
                {
                    hash: subscribeTx
                });

            if (subscribeReceipt.status === 'success') {
                toast({
                    // title: 'Successfully become an Investor!',
                    title: commonPageData.modals.successfullyBecomeAnInvestor,
                    variant: 'default',
                });
                refetchBaguaDaoAgg4Me();
                // } else {
                // setError('Subscription failed');
                // return;
            }
            onClose();
        } catch (err) {
            console.log("err", err);
            setError((err as Error).message);
            toast({
                title: 'Transaction failed',
                description: (err as Error).message,
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#1A1F2C] border border-white/10 max-w-lg">
                <DialogHeader className="space-y-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/20">
                            <Crown className="w-6 h-6 text-purple-400" />
                        </div>
                        <DialogTitle className="text-[#9b87f5] text-2xl font-semibold">
                            {/* Become an Investor */}
                            {commonPageData.modals.becomeAnInvestor}
                        </DialogTitle>
                        <DialogDescription className="text-white/70 text-base max-w-md">
                            {/* Join our exclusive community of investors and support the growth of KnowUnknowable.Love */}
                            {commonPageData.modals.joinAsInvestorToSupport}
                        </DialogDescription>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                        <Coins className="w-4 h-4" />
                        <span>
                            {/* Investment Amount: */}
                            {commonPageData.modals.investmentAmountLabel}:
                        </span>
                        <span className="text-purple-400 font-medium">
                            {InvestFeeDollarAmount.toString()} USDC
                        </span>
                    </div>
                </DialogHeader>

                {error && (
                    <div className="text-red-500 text-sm mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20 max-h-18 overflow-y-auto">
                        Error: {error || 'An error occurred during the transaction.'}
                    </div>
                )}

                <div className="py-6">
                    <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-purple-500/10 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
                                <Crown className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-white/90 text-lg font-medium">
                                {/* Why become an Investor */}
                                {commonPageData.modals.whyBecomeAnInvestor}
                            </h3>
                        </div>
                        <ul className="space-y-4">
                            {commonPageData.modals.investorBenefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3 text-white/80">
                                    <CheckCircle2 className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                    <span className="text-sm">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800/50 px-6"
                            onClick={onClose}
                            disabled={connectDaoToInvestPending || approvePending}
                        >
                            {/* Cancel */}
                            {commonPageData.buttons.cancel}
                        </Button>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none px-6"
                            onClick={handleSubmit}
                            disabled={connectDaoToInvestPending || approvePending}
                        >
                            {connectDaoToInvestPending || approvePending ? (
                                <>
                                    <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    {/* Processing... */}
                                    {commonPageData.modals.processing}
                                </>
                            ) : (
                                `${commonPageData.modals.becomeAnInvestor}`
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
