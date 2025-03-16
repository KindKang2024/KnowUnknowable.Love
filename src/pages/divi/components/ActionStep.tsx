import {ReactNode} from "react";
import {ChevronDown} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../../../components/ui/collapsible.tsx";
import {StepNumber} from "./StepNumber.tsx";

interface ActionStepProps {
  number: number;
  title: string;
  isActive?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  actions?: ReactNode;
  showChevron?: boolean;
}

export const ActionStep = ({
  number,
  title,
  isActive = true,
  isOpen,
  onOpenChange,
  children,
  actions,
  showChevron = false,
}: ActionStepProps) => (
  <Collapsible
    open={isOpen}
    onOpenChange={onOpenChange}
    className="relative bg-[#1E2433] rounded-2xl overflow-hidden"
  >
    <CollapsibleTrigger className="flex items-center gap-3 w-full text-left group p-3 hover:bg-[#262B3B] transition-colors">
      <StepNumber number={number} isActive={isActive} />
      <div className="flex-1">
        <span className={`
          text-sm font-medium group-hover:text-[#D6BCFA] transition-colors
          ${isActive ? 'text-[#9b87f5]' : 'text-[#9b87f5]/50'}
        `}>
          {title}
        </span>
      </div>
      {actions}
      {showChevron && (
        <ChevronDown 
          className={`
            w-4 h-4 transition-transform text-[#9b87f5]
            ${isOpen ? 'transform rotate-180' : ''}
          `} 
        />
      )}
    </CollapsibleTrigger>
    {children && (
      <CollapsibleContent className="px-3 pb-3 pt-0 pl-12 pr-4 space-y-4 bg-[#1E2433] data-[state=open]:animate-collapsible-slide-in data-[state=closed]:animate-collapsible-slide-out">
        {children}
      </CollapsibleContent>
    )}
  </Collapsible>
);
