import React, { useRef, useState } from "react";
import { AlertCircle, DollarSign, ExternalLink, MoveRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageCommonData } from "@/i18n/DataProvider";
import { DeepseekDAOState } from "@/types/divi";
import { DivinationEntry, useDeepseekDao } from "@/services/api";
import { getTxLink, objectIsEmpty, objectIsNotEmpty } from "@/utils/commonUtils";
import { defaultChainWhenNotConnected, dukiDaoContractConfig } from "@/contracts/externalContracts";
import { useAccount, useBlockNumber } from "wagmi";
import { ModalType } from "@/types/common";
import { useUIStore } from "@/stores/uiStore";
import { useToast } from "@/hooks/use-toast";
import { parseUnits, TransactionReceipt } from "viem";
import {
    useReadErc20Allowance,
    useReadErc20BalanceOf,
    useSimulateLoveDaoContract,
    useWriteLoveDaoContractConnectDaoToKnow,
    useWriteErc20Approve
} from "@/contracts/generated";
import { waitForTransactionReceipt } from "viem/actions";
import { config } from "@/wagmi";

interface DukiInActionToDeepseekDaoProps {
    divination: DivinationEntry | null | undefined;
    selectedAmount: number;
    onSuccess?: (data: DivinationEntry) => void;
}

export const DukiInActionToDeepseekDAO: React.FC<DukiInActionToDeepseekDaoProps> = ({
    divination,
    selectedAmount,
    onSuccess
}) => {
    const [deepseekDAOState, setDeepseekDAOState] = useState<DeepseekDAOState>(
        divination && divination.interpretation !== '' ? DeepseekDAOState.DEEPSEEK_DAO_SUCCESS : DeepseekDAOState.PAY_TO_CONNECT
    );
    const { toast } = useToast();
    const { address, isConnected, chainId } = useAccount();
    const targetChainId = chainId || defaultChainWhenNotConnected;
    const commonData = usePageCommonData();
    const { openModal } = useUIStore();

    const { data: latestBlock } = useBlockNumber({
        chainId: targetChainId,
        watch: false
    });

    const txReceiptRef = useRef<TransactionReceipt | null>(null);

    const { data: usdcBalance } = useReadErc20BalanceOf({
        address: dukiDaoContractConfig[chainId]?.stableCoin,
        args: [address],
        query: { enabled: !!address && !!chainId }
    });
    console.log("usdcBalance", usdcBalance, address, chainId, address, dukiDaoContractConfig[chainId]?.stableCoin);

    const [newDivination, setNewDivination] = useState<DivinationEntry | null | undefined>(divination);

    const {
        mutate: deepseekDao,
        isPending: isDeepseekDaoPending,
        isSuccess: isDeepseekDaoSuccess,
    } = useDeepseekDao({
        latestBlock: latestBlock,
        onSuccess: (data) => {
            setDeepseekDAOState(DeepseekDAOState.DEEPSEEK_DAO_SUCCESS);
            if (divination) {
                const updatedDivination = {
                    ...divination,
                    dao_tx: data.dao_tx,
                    dao_tx_amount: data.dao_tx_amount,
                    interpretation: data.interpretation
                };
                setNewDivination(updatedDivination);
                onSuccess?.(updatedDivination);
            }
        },
        onError: (error) => {
            setDeepseekDAOState(DeepseekDAOState.ERROR);
            toast({
                variant: "destructive",
                // title: "DAO解析请求失败",
                // description: "交易成功，但解析获取失败。可点击按钮重试获取解析。",
                title: commonData.modals.deepseekDaoError,
                description: commonData.modals.deepseekDaoErrorDescription,
            });
        }
    });

    const { writeContractAsync: connectDaoToKnow, data: connectDaoToKnowData,
        error: connectDaoToKnowError } =
        useWriteLoveDaoContractConnectDaoToKnow();

    const { writeContractAsync: approve } = useWriteErc20Approve();

    const { data: allowance, refetch: refetchAllowance } = useReadErc20Allowance({
        address: dukiDaoContractConfig[chainId]?.stableCoin,
        args: [address, dukiDaoContractConfig[chainId]?.address],
        query: { enabled: !!address && !!chainId }
    });

    const { data: balance } = useReadErc20BalanceOf({
        address: dukiDaoContractConfig[chainId]?.stableCoin,
        args: [address],
        query: { enabled: !!address && !!chainId }
    });

    const initiatePayment = async () => {
        if (!divination) {
            toast({
                variant: "destructive",
                title: "无效请求",
                description: "请先完成占卜才能连接DAO"
            });
            return;
        }

        if (!isConnected || !address) {
            toast({
                variant: "destructive",
                // title: "请先连接钱包",
                // description: "需要连接钱包才能进行支付"
                title: commonData.connectWallet,
            });
            return;
        }

        if (isDeepseekDaoPending) {
            toast({
                variant: "destructive",
                // title: "DAO处理中",
                // description: "请等待当前请求完成"
                title: commonData.modals.processing,
            });
            return;
        }

        if (deepseekDAOState === DeepseekDAOState.CONNECTED && isDeepseekDaoSuccess) {
            return;
        }

        if (deepseekDAOState === DeepseekDAOState.CONNECTED
            && !isDeepseekDaoSuccess
            && (divination.dao_tx || objectIsNotEmpty(txReceiptRef.current))) {
            try {
                deepseekDao({
                    entry: divination,
                    daoTx: divination.dao_tx,
                    daoTxAmount: divination.dao_tx_amount
                });
            } catch (error) {
                console.error("DeepseekDAO API错误:", error);
                toast({
                    variant: "destructive",
                    title: commonData.modals.deepseekDaoError,
                    description: commonData.modals.deepseekDaoErrorDescription,
                });
            }
            return;
        }

        if (!selectedAmount || selectedAmount <= 0) {
            toast({
                variant: "destructive",
                title: commonData.modals.invalidAmount,
                description: commonData.modals.invalidAmountDescription,
            });
            return;
        }

        const amountInStableCoin = parseUnits(
            selectedAmount.toString(),
            dukiDaoContractConfig[chainId]?.StableCoinDecimals
        );

        if (balance && balance < amountInStableCoin) {
            toast({ variant: "destructive", title: "USDC balance insufficient", description: "USDC balance is insufficient" });
            return;
        }

        setDeepseekDAOState(DeepseekDAOState.CONNECTING);

        try {
            if (objectIsEmpty(txReceiptRef.current)) {
                if (allowance !== undefined && allowance < amountInStableCoin) {
                    const approveTx = await approve({
                        address: dukiDaoContractConfig[chainId].stableCoin,
                        args: [dukiDaoContractConfig[chainId].address, amountInStableCoin],
                    });

                    const approveReceipt = await waitForTransactionReceipt(
                        config.getClient(),
                        { hash: approveTx }
                    );

                    if (approveReceipt.status !== 'success') {
                        // throw new Error(commonData.modals.approveAllowanceFailed);
                        toast({
                            variant: "default",
                            title: commonData.modals.approveAllowanceFailed,
                        });
                        return;
                    }

                    refetchAllowance();
                }

                const manifestationStr = divination.manifestation
                const pendingTxHash = await connectDaoToKnow({
                    args: [
                        divination.uuid,
                        divination.will_hash,
                        manifestationStr,
                        amountInStableCoin
                    ],
                    address: dukiDaoContractConfig[chainId].address,
                });

                const txReceipt = await waitForTransactionReceipt(
                    config.getClient(),
                    { hash: pendingTxHash }
                );
                txReceiptRef.current = txReceipt;

                if (txReceipt.status !== 'success') {
                    // throw new Error("交易失败");
                    deepseekDao({
                        entry: divination,
                        daoTx: '',
                        daoTxAmount: 0
                    });
                    return;
                }
            }

            const txHash = txReceiptRef.current?.transactionHash;
            const updatedDivination = { ...divination, dao_tx: txHash, dao_tx_amount: selectedAmount };
            setNewDivination(updatedDivination);
            onSuccess?.(updatedDivination);
            setDeepseekDAOState(DeepseekDAOState.CONNECTED);

            toast({
                // title: "DAO连接成功",
                // description: "区块链交易成功完成",
                title: commonData.modals.daoConnected,
                description: commonData.modals.daoConnectedDescription,
            });

            deepseekDao({
                entry: divination,
                daoTx: txHash,
                daoTxAmount: selectedAmount
            });

        } catch (error) {
            console.log("error", error);
            // Check if it's a user cancellation
            if (error.code === 4001 || error.message?.includes('user rejected') || error.message?.includes('User denied')) {
                // User cancelled the transaction
                toast({
                    variant: "default",
                    title: "Transaction cancelled",
                    description: "You cancelled the transaction",
                });
                setDeepseekDAOState(DeepseekDAOState.PAY_TO_CONNECT);
                return;
            }
            
            // Handle other errors
            setDeepseekDAOState(DeepseekDAOState.ERROR);
            console.error("DeepseekDAO ERROR:", error);
            toast({
                variant: "default",
                // title: "DAO解析请求失败",
                // description: "交易成功，但解析获取失败。可点击按钮重试获取解析。",
                title: commonData.modals.deepseekDaoError,
                description: commonData.modals.deepseekDaoErrorDescription,
            });
        }
    };

    // If divination is null or undefined, show disabled button with message
    if (!divination) {
        return (
            <Button
                disabled={true}
                className="w-full h-9 bg-gradient-to-r from-indigo-600/50 to-purple-700/50 text-white/70 border border-indigo-500/30"
            >
                {commonData.modals.finishDivinationFirst}
            </Button>
        );
    }

    switch (deepseekDAOState) {
        case DeepseekDAOState.ERROR:
            const isPaymentSuccessful = objectIsNotEmpty(txReceiptRef.current);
            return (
                <>
                    {isPaymentSuccessful && (
                        <div className="text-sm text-green-400 mb-2 text-center">
                            {commonData.modals.paymentSuccessful}
                        </div>
                    )}

                    <Button
                        onClick={initiatePayment}
                        className="w-full h-9 bg-transparent border-red-700/50 hover:bg-red-900/20 text-red-400"
                        variant="outline"
                    >
                        <AlertCircle className="h-3 w-3 mr-2" />
                        {isPaymentSuccessful
                            ? (commonData.modals.retryDaoRequest)
                            : (commonData.modals.retryPayment)}
                    </Button>
                    {isPaymentSuccessful && divination?.dao_tx && (
                        <div className="mt-2">
                            <Button
                                variant="outline"
                                className="w-full bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-900/40 hover:to-indigo-900/40 text-blue-300 border-blue-700/50 transition-all duration-300 shadow-sm"
                                onClick={() => window.open(getTxLink(divination.dao_tx, targetChainId), "_blank")}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    {commonData.modals.viewDaoTx}
                                </span>
                            </Button>
                        </div>
                    )}
                </>
            );

        case DeepseekDAOState.CONNECTING:
            return (
                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-indigo-300">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
                        <span>
                            {commonData.modals.connectingDao}
                        </span>
                    </div>
                    <Button
                        disabled={true}
                        className="w-full h-9 bg-gradient-to-r from-indigo-600 to-purple-700 text-white border border-indigo-500/50"
                    >
                        {commonData.modals.processing}
                    </Button>
                </div>
            );

        case DeepseekDAOState.CONNECTED:
            return (
                <>
                    <Button
                        onClick={initiatePayment}
                        className="w-full h-9 bg-indigo-900/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50"
                    >
                        {isDeepseekDaoPending ? (
                            <span className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-400"></div>
                                {commonData.modals.deepseeking}
                            </span>
                        ) : isDeepseekDaoSuccess ? (
                            <span className="flex items-center gap-2">
                                {commonData.modals.deepseekResult || "View Deepseek Result"}
                                <MoveRight className="h-3 w-3" />
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                {commonData.modals.deepseekDao || "Deepseek with DAO"}
                                <Sparkles className="h-3 w-3" />
                            </span>
                        )}
                    </Button>
                    <div className="mt-2">
                        <Button
                            variant="outline"
                            className="w-full bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-900/40 hover:to-indigo-900/40 text-blue-300 border-blue-700/50 transition-all duration-300 shadow-sm"
                            onClick={() => window.open(getTxLink(divination.dao_tx, targetChainId), "_blank")}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                {commonData.modals.viewDaoTx}
                            </span>
                        </Button>
                    </div>
                </>
            );

        case DeepseekDAOState.DEEPSEEK_DAO_SUCCESS:
            return (
                <>
                    <Button
                        onClick={() => {
                            openModal(ModalType.ENLIGHTENMENT, newDivination);
                        }}
                        className="w-full mb-2 h-9 bg-indigo-900/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50"
                    >
                        <span className="flex items-center gap-2">
                            {commonData.modals.deepseekExplanation || "View Deepseek Explanation"}
                            <MoveRight className="h-3 w-3" />
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-900/40 hover:to-indigo-900/40 text-blue-300 border-blue-700/50 transition-all duration-300 shadow-sm"
                        onClick={() => window.open(getTxLink(divination.dao_tx, targetChainId), "_blank")}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            {commonData.modals.viewDaoTx}
                        </span>
                    </Button>
                </>
            );

        case DeepseekDAOState.PAY_TO_CONNECT:
            if (usdcBalance !== undefined && usdcBalance < parseUnits(selectedAmount.toString(), dukiDaoContractConfig[chainId]?.StableCoinDecimals)) {
                return (
                    <Button
                        disabled={true}
                        className="w-full h-9 bg-gradient-to-r from-red-600/50 to-pink-700/50 text-white/80 border border-red-500/30 cursor-not-allowed"
                    >
                        {commonData.modals.insufficientBalance}
                    </Button>
                );
            }

            return (
                <>
                    <Button
                        onClick={initiatePayment}
                        disabled={!isConnected}
                        className="w-full h-9 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white border border-indigo-500/50"
                    >
                        {!isConnected ? (
                            commonData.modals.connectWalletToPay
                        ) : (
                            <>
                                <DollarSign className="h-3 w-2" />
                                <span className="text-xs translate-x-[-9px]">
                                    {selectedAmount}
                                    &nbsp;
                                    {commonData.modals.joinDaoToDeepseek}
                                </span>
                            </>
                        )}
                    </Button>
                </>
            );
    }
}; 