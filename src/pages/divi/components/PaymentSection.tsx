import { useEffect, useState } from "react";
import { AlertCircle, DollarSign, ExternalLink, Lock, MoveRight, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useAccount } from "wagmi";
import { scrollTxLink } from "@/utils/commonUtils.ts";
import { parseUnits, formatUnits } from "viem";
import {
  useReadBaguaDukiDaoContractBuaguaDaoAgg4Me,
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteBaguaDukiDaoContractConnectDaoToKnow,
  useWriteErc20Approve
} from "@/contracts/generated.ts";
import { dukiDaoContractConfig } from "@/contracts/externalContracts.ts";
import { waitForTransactionReceipt } from "viem/actions";
import { config } from "@/wagmi.ts";
import { cn } from "@/lib/utils";
import { useDivinationStore } from "@/stores/divineStore.ts";
import { DivinationEntry, useDeepseekDao } from "@/services/api.ts";
import { AmountSelect } from "@/components/AmountSelect";
import { useUIStore } from "@/stores/uiStore.ts";
import { ModalType } from "@/types/common.ts";

interface PaymentSectionProps {
  handleDeepSeek?: () => void;
  isDivinationCompleted?: boolean;
}

export const PaymentSection = ({
  // handleDeepSeek = () => { },
  isDivinationCompleted = false,
}: PaymentSectionProps) => {
  const { toast } = useToast();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [daoTx, setDaoTx] = useState<string | null>(null);
  const [hasPaymentError, setHasPaymentError] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { openModal } = useUIStore();

  const { entry, recordDeepseekDao } = useDivinationStore();

  const { mutate: deepseekDao,
    isPending: isDeepseekDaoPending, isSuccess: isDeepseekDaoSuccess, data: deepseekDaoAnswer } = useDeepseekDao(
      {
        onSuccess: (data) => {
          recordDeepseekDao(
            data.interpretation,
            data.dao_tx,
            data.dao_tx_amount
          );
        }
      }
    );

  const [selectedAmount, setSelectedAmount] = useState<number>(1);
 
  const { writeContractAsync: connectDaoToKnow } = useWriteBaguaDukiDaoContractConnectDaoToKnow()

  const { data: allowance, refetch: refetchAllowance } = useReadErc20Allowance({
    address: dukiDaoContractConfig[chainId].stableCoin,
    args: [dukiDaoContractConfig[chainId].address, address],
    query: { enabled: !!address }
  })

  const { writeContractAsync: approve } = useWriteErc20Approve();

  const { data: balance } = useReadErc20BalanceOf({
    address: dukiDaoContractConfig[chainId].stableCoin,
    args: [address],
    query: { enabled: !!address }
  })

  const payToDeepseekDao = async () => {
    if (!isConnected || !address) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a payment.",
      });
      return;
    }

    if (isDeepseekDaoPending) {
      toast({
        variant: "destructive",
        title: "Deepseek DAO is still in progress",
        description: "Please wait for the deepseek DAO to complete.",
      });
      return;
    }

    if (isPaymentComplete && !hasPaymentError && isDeepseekDaoSuccess) {
      // const manifestation = dukiDaoContractConfig[chainId].explorer + "/tx/" + entry.manifestation;
      // window.open(manifestation, "_blank");
      openModal(ModalType.ENLIGHTENMENT, entry);
      return;
    }

    if (!isDivinationCompleted) {
      toast({
        variant: "destructive",
        title: "Divination Not Completed",
        description: "Please complete the divination first.",
      });
      return;
    }

    // Get the payment amount in the correct format
    const paymentAmount = selectedAmount;

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Payment Amount",
        description: "You must offer something to connect DAO.",
      });
      return;
    }

    // Convert to stable coin units
    const amountInStableCoin = parseUnits(paymentAmount.toString(), dukiDaoContractConfig[chainId].StableCoinDecimals);

    if (balance && balance < amountInStableCoin) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "Insufficient USDC balance in your wallet.",
      });
      return;
    }

    setIsPaymentProcessing(true);
    setHasPaymentError(false);

    try {
      if (allowance !== undefined && allowance < amountInStableCoin) {
        // Approve the contract to spend the stable coin
        const approveTx = await approve({
          address: dukiDaoContractConfig[chainId].stableCoin,
          args: [dukiDaoContractConfig[chainId].address, amountInStableCoin],
        });

        // // Wait for the transaction to be mined
        const approveReceipt = await waitForTransactionReceipt(
          config.getClient(),
          {
            hash: approveTx,
            // timeout: 30_000 // Add 60 second timeout
          }
        );
        if (approveReceipt.status === 'success') {
          // Transaction was successful
          console.log('Approval successful');
          refetchAllowance();
        } else {
          toast({
            variant: "destructive",
            title: "Approval Failed",
            description: "Please try again.",
          });
          return;
        }
      }

      debugger;
      // Call the contract function TODO
      const manifestationStr = entry.manifestation.startsWith('0x') ? entry.manifestation : `0x${entry.manifestation}`;
      const pendingTxHash = await connectDaoToKnow({
        args: [
          entry.uuid,
          entry.will_hash,
          manifestationStr,
          amountInStableCoin
        ],
        address: dukiDaoContractConfig[chainId].address,
      });
      // Wait for the transaction to be mined
      const txReceipt = await waitForTransactionReceipt(config.getClient(), {
        hash: pendingTxHash,
      });

      console.log("txReceipt", txReceipt);

      // Check if the transaction was successful
      if (txReceipt.status === 'success') {
        // Transaction was successful
        // Notify the parent component about the payment
        // onPaymentSuccess(paymentAmount, txReceipt.transactionHash);

      setDaoTx(txReceipt.transactionHash);
        setIsPaymentComplete(true);
        setIsPaymentProcessing(false);

        // Call deepseekDao and handle the response
        deepseekDao({
          entry,
          daoTx: txReceipt.transactionHash,
          daoTxAmount: paymentAmount
        });

        toast({
          title: "Connect DAO Successful",
          description: "You can ask DAO to explain the meaning of your divination.",
        });

      } else {
        // Transaction failed
        throw new Error("Transaction failed: " + (txReceipt.status === 'reverted' ? "Reverted" : "Unknown error"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      setHasPaymentError(true);
      setIsPaymentProcessing(false);

      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <AmountSelect
        amounts={[1, 2, 3]}
        onSelect={setSelectedAmount}
      />

      {hasPaymentError ? (
        <Button
          onClick={payToDeepseekDao}
          className="w-full h-9 bg-transparent border-red-700/50 hover:bg-red-900/20 text-red-400"
          variant="outline"
        >
          <AlertCircle className="h-3 w-3 mr-2" />
          Retry Payment
        </Button>
      ) : (
        <Button
          onClick={payToDeepseekDao}
          disabled={isPaymentProcessing || (!isConnected)}
          className={cn(
            "w-full h-9 transition-all duration-300",
            isPaymentComplete
              ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white border border-emerald-500/50"
              : "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white border border-indigo-500/50"
          )}
        >
          {isPaymentProcessing ? (
            "Processing..."
          ) : isPaymentComplete ? (
            isDeepseekDaoSuccess ? (
              <span className="flex items-center gap-2">
                Meditate on Results
                <MoveRight className="h-3 w-3" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Deepseeking DAO
                <Sparkles className="h-3 w-3" />
              </span>
            )
          ) : !isConnected ? (
            "Connect Wallet to Pay"
          ) : (
            <>
              <DollarSign className="h-3 w-2" />
              <span className="text-xs translate-x-[-9px]">
                {selectedAmount}
                &nbsp;
                Into DAO To Gain Insights
              </span>
            </>
          )}
        </Button>
      )}

      {/* DeepSeek Button - Shows View DAO Flow when paid */}
      {!isPaymentComplete ? (
        <div className="mt-2">
          <Button
            variant="outline"
            className="w-full bg-gray-800/50 hover:bg-gray-800/50 text-gray-500 border-gray-700/50 transition-all duration-300 cursor-not-allowed"
            disabled={true}
          >
            <span className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              No Proof of DAO Connection
            </span>
          </Button>
        </div>
      ) : (
        <div className="mt-2">
          <Button
            variant="outline"
            className="w-full bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-900/40 hover:to-indigo-900/40 text-blue-300 border-blue-700/50 transition-all duration-300 shadow-sm"
            onClick={() => {
              window.open(scrollTxLink(daoTx), "_blank");
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View On Scroll
            </span>
          </Button>
          <div className="text-xs text-center mt-1">
            {isDeepseekDaoSuccess ? (
              <span className="text-emerald-400/80">
                Divination complete - explore your insights
              </span>
            ) : (
              <span className="text-blue-400/80">
                Payment complete - Get insights with DeepSeek
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
