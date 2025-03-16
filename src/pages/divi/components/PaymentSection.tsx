import {useState} from "react";
import {AlertCircle, DollarSign, ExternalLink, Lock, MoveRight, Sparkles} from "lucide-react";
import {Button} from "../../../components/ui/button.tsx";
import {Input} from "../../../components/ui/input.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {useAccount} from "wagmi";
import {parseUnits} from "viem";
import {
    useReadBaguaDukiDaoContractBuaguaDaoAgg4Me,
    useWriteBaguaDukiDaoContractPayLoveIntoDao
} from "@/contracts/generated.ts";
import {dukiDaoContractConfig} from "@/contracts/externalContracts.ts";
import {waitForTransactionReceipt} from "viem/actions";
import {config} from "@/wagmi.ts";
import {cn} from "@/lib/utils";

interface PaymentSectionProps {
  selectedAmount: number;
  showCustomAmount: boolean;
  customAmount: string;
  onAmountSelect: (amount: number | null) => void;
  onCustomAmountChange: (value: string) => void;
  onPayment: (amount: number) => void;
  isDeepSeekUsed?: boolean;
  handleDeepSeek?: () => void;
  openEnlightenmentModal?: () => void;
  isDivinationCompleted?: boolean;
}

export const PaymentSection = ({
  selectedAmount,
  showCustomAmount,
  customAmount,
  onAmountSelect,
  onCustomAmountChange,
  onPayment,
  isDeepSeekUsed = false,
  handleDeepSeek = () => { },
  openEnlightenmentModal = () => { },
  isDivinationCompleted = false,
}: PaymentSectionProps) => {
  const { toast } = useToast();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [hasPaymentError, setHasPaymentError] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const { address, isConnected } = useAccount();

  // Get contract details
  const {
    data: baguaDaoAgg4Me,
    isLoading: baguaDaoAgg4MeLoading,
    refetch: refetchBaguaDukiDao  // Get the refetch function
  } = useReadBaguaDukiDaoContractBuaguaDaoAgg4Me({
    address: dukiDaoContractConfig.address,
    query: {
      enabled: true
    }
  })
  const { writeContractAsync: payLoveIntoDao } = useWriteBaguaDukiDaoContractPayLoveIntoDao()

  const handlePayment = async () => {
    if (isPaymentComplete && !hasPaymentError) {
      window.open('/dao-info', '_blank');
      return;
    }

    if (!isConnected || !address) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a payment.",
      });
      return;
    }

    setIsPaymentProcessing(true);
    setHasPaymentError(false);

    try {
      // Get the payment amount in the correct format
      const paymentAmount = showCustomAmount
        ? parseFloat(customAmount)
        : selectedAmount;

      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        throw new Error("Invalid payment amount");
      }

      // Convert to wei (assuming 18 decimals)
      const amountInWei = parseUnits(paymentAmount.toString(), 18);

      // Call the contract function
      const txHash = await payLoveIntoDao({
        args: [
          "Love message", // willMessage
          "Signature",    // willSignature
          1n,      // willDivinationResult
          amountInWei     // loveAsMoneyAmount
        ],
        address: dukiDaoContractConfig.address,
      });
      // Wait for the transaction to be mined
      const txReceipt = await waitForTransactionReceipt(config.getClient(), {
        hash: txHash,
      });
      console.log("txReceipt", txReceipt);

      // Check if the transaction was successful
      if (txReceipt.status === 'success') {
        // Transaction was successful
        // Notify the parent component about the payment
        onPayment(paymentAmount);

        setIsPaymentComplete(true);
        setIsPaymentProcessing(false);

        toast({
          title: "Payment Successful",
          description: "Click to learn about DAO flow.",
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
      <div className="space-y-2">
        <label className="text-sm font-medium text-indigo-300/80 tracking-wide">Select Amount (USDT)</label>
        <div className="grid grid-cols-4 gap-2">
          {[3, 6, 10].map((amount) => (
            <Button
              key={amount}
              onClick={() => onAmountSelect(amount)}
              variant="outline"
              size="sm"
              className={cn(
                "h-9 bg-indigo-900/30 border-indigo-700/50 hover:bg-indigo-800/40 text-indigo-300 transition-all duration-300",
                selectedAmount === amount && "ring-1 ring-indigo-500/70 bg-indigo-800/40"
              )}
            >
              ${amount}
            </Button>
          ))}
          <Button
            onClick={() => onAmountSelect(null)}
            variant="outline"
            size="sm"
            className={cn(
              "h-9 bg-indigo-900/30 border-indigo-700/50 hover:bg-indigo-800/40 text-indigo-300 transition-all duration-300",
              showCustomAmount && "ring-1 ring-indigo-500/70 bg-indigo-800/40"
            )}
          >
            Other
          </Button>
        </div>
      </div>

      {showCustomAmount && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={customAmount}
            onChange={(e) => onCustomAmountChange(e.target.value)}
            min={0.1}
            step={0.1}
            className="h-9 bg-indigo-900/30 border-indigo-700/50 text-sm text-indigo-300 focus-visible:ring-indigo-500/50"
            placeholder="Enter amount"
          />
        </div>
      )}

      {hasPaymentError ? (
        <Button
          onClick={handlePayment}
          className="w-full h-9 bg-transparent border-red-700/50 hover:bg-red-900/20 text-red-400"
          variant="outline"
        >
          <AlertCircle className="h-3 w-3 mr-2" />
          Retry Payment
        </Button>
      ) : (
        <Button
          onClick={handlePayment}
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
            <span className="flex items-center gap-2">
              View DAO Flow
              <ExternalLink className="h-3 w-3" />
            </span>
          ) : !isConnected ? (
            "Connect Wallet to Pay"
          ) : (
            <>
              <DollarSign className="h-3 w-2" />
              <span className="text-xs translate-x-[-9px]">
                {showCustomAmount ? customAmount : selectedAmount}
                &nbsp;
                Into DAO To Gain Insights
              </span>
            </>
          )}
        </Button>
      )}

      {/* DeepSeek Button - Disabled until payment is complete */}
      {!isPaymentComplete ? (
        <div className="mt-2">
          <Button
            variant="outline"
            className="w-full bg-gray-800/50 hover:bg-gray-800/50 text-gray-500 border-gray-700/50 transition-all duration-300 cursor-not-allowed"
            disabled={true}
          >
            <span className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              DeepSeek Locked
            </span>
          </Button>
          <div className="text-xs text-center mt-1 text-gray-500">
            Complete payment to unlock DeepSeek insights
          </div>
        </div>
      ) : (
        <div className="mt-2">
          {isDeepSeekUsed ? (
            <Button
              variant="outline"
              className="w-full bg-gradient-to-r from-emerald-900/30 to-teal-900/30 hover:from-emerald-900/40 hover:to-teal-900/40 text-emerald-300 border-emerald-700/50 transition-all duration-300 shadow-sm"
              onClick={openEnlightenmentModal}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Meditate on Results
                <MoveRight className="w-4 h-4" />
              </span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-900/40 hover:to-indigo-900/40 text-blue-300 border-blue-700/50 transition-all duration-300 shadow-sm"
              onClick={handleDeepSeek}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                DeepSeek It
              </span>
            </Button>
          )}
          <div className="text-xs text-center mt-1">
            {isDeepSeekUsed ? (
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
