import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import {useReadErc20BalanceOf} from "@/contracts/generated";
import {defaultChainWhenNotConnected, dukiDaoContractConfig} from "@/contracts/externalContracts";
import {formatUnits} from "viem";
import {usePageCommonData} from "@/i18n/DataProvider";

interface AmountSelectProps {
  amounts?: number[];
  onSelect: (amount: number) => void;
  currency?: string;
  defaultAmount?: number;
  readonly?: boolean;
}

export const AmountSelect = ({
  amounts = [1, 2, 3],
  onSelect,
  currency = "USDC",
  defaultAmount,
  readonly = false,
}: AmountSelectProps) => {
  const commonData = usePageCommonData();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    typeof defaultAmount === 'number' ? defaultAmount : null
  );
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState("");

  const { address, isConnected, chainId } = useAccount();
  const targetChainId = chainId || defaultChainWhenNotConnected;
  const stableCoinConfig = dukiDaoContractConfig[targetChainId];

  const { data: balance, isLoading: isBalanceLoading } = useReadErc20BalanceOf({
    address: stableCoinConfig?.stableCoin,
    args: [address!],
    query: {
      enabled: isConnected && !!address && !!stableCoinConfig?.stableCoin,
      refetchInterval: 5000,
    },
  });

  const formattedBalance = balance !== undefined && stableCoinConfig?.StableCoinDecimals !== undefined
    ? parseFloat(formatUnits(balance, stableCoinConfig.StableCoinDecimals)).toFixed(2)
    : null;

  useEffect(() => {
    if (typeof defaultAmount === 'number') {
      onSelect(defaultAmount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (amount: number | null) => {
    if (readonly) return;
    setSelectedAmount(amount);
    setIsCustom(amount === null);
    if (amount !== null && amount > 0) {
      onSelect(amount);
    }
  };

  const handleCustomChange = (value: string) => {
    if (readonly) return;
    setCustomValue(value);
    setIsCustom(true);
    setSelectedAmount(null);

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onSelect(numValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-indigo-300/80 tracking-wide flex items-center">
          <span>{commonData.amountSelectLabel} ({currency})</span>
          {isConnected && (
            <span className="ml-2 text-xs text-indigo-400/70">
              ({commonData.walletTotalUSDCLabel}: {isBalanceLoading ? "Loading..." : formattedBalance !== null ? formattedBalance : "N/A"})
            </span>
          )}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {amounts.map((amount) => (
            <Button
              key={amount}
              onClick={() => handleSelect(amount)}
              variant="outline"
              size="sm"
              disabled={readonly}
              className={cn(
                "h-9 bg-indigo-900/30 border-indigo-700/50 hover:bg-indigo-800/40 text-indigo-300 transition-all duration-300",
                selectedAmount === amount && "ring-2 ring-indigo-400 bg-indigo-800/60 border-indigo-500/70 font-medium shadow-lg shadow-indigo-900/20",
                readonly && "bg-indigo-900/50 border-indigo-600/50 text-indigo-200/90 cursor-default"
              )}
            >
              ${amount}
            </Button>
          ))}
          <Button
            onClick={() => handleCustomChange(customValue)}
            variant="outline"
            size="sm"
            disabled={readonly}
            className={cn(
              "h-9 bg-indigo-900/30 border-indigo-700/50 hover:bg-indigo-800/40 text-indigo-300 transition-all duration-300",
              isCustom && "ring-2 ring-indigo-400 bg-indigo-800/60 border-indigo-500/70 font-medium shadow-lg shadow-indigo-900/20",
              readonly && "bg-indigo-900/50 border-indigo-600/50 text-indigo-200/90 cursor-default"
            )}
          >
            Any
          </Button>
        </div>
      </div>

      {isCustom && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={customValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            min={0.1}
            step={0.1}
            disabled={readonly}
            className={cn(
              "h-9 bg-indigo-900/30 border-indigo-700/50 text-sm text-indigo-300 focus-visible:ring-indigo-500/50",
              readonly && "bg-indigo-900/50 border-indigo-600/50 text-indigo-200/90 cursor-default"
            )}
            placeholder={commonData.modals.amountSelectPlaceholder}
          />
        </div>
      )}
    </div>
  );
}; 