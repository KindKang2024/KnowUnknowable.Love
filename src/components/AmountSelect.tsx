import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AmountSelectProps {
  amounts?: number[];
  onSelect: (amount: number) => void;
  label?: string;
  currency?: string;
}

export const AmountSelect = ({
  amounts = [1, 2, 3],
  onSelect,
  label = "Select Amount",
  currency = "USDT"
}: AmountSelectProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleSelect = (amount: number | null) => {
    setSelectedAmount(amount);
    setIsCustom(amount === null);
    if (amount !== null) {
      onSelect(amount);
    }
  };

  const handleCustomChange = (value: string) => {
    setCustomValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onSelect(numValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-indigo-300/80 tracking-wide">
          {label} ({currency})
        </label>
        <div className="grid grid-cols-4 gap-2">
          {amounts.map((amount) => (
            <Button
              key={amount}
              onClick={() => handleSelect(amount)}
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
            onClick={() => handleSelect(null)}
            variant="outline"
            size="sm"
            className={cn(
              "h-9 bg-indigo-900/30 border-indigo-700/50 hover:bg-indigo-800/40 text-indigo-300 transition-all duration-300",
              isCustom && "ring-1 ring-indigo-500/70 bg-indigo-800/40"
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
            className="h-9 bg-indigo-900/30 border-indigo-700/50 text-sm text-indigo-300 focus-visible:ring-indigo-500/50"
            placeholder="Enter any amount "
          />
        </div>
      )}
    </div>
  );
}; 