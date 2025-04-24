import {InfoIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";

interface TooltipIconProps {
  content: string | React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
}

export const TooltipIcon = ({ 
  content, 
  icon, 
  className,
  side = "top",
  align = "center",
  delayDuration = 200
}: TooltipIconProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center">
            {icon || (
              <InfoIcon className={cn(
                "ml-1 h-4 w-4 text-white-500 hover:text-white-300 transition-colors duration-200", 
                className
              )} />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          align={align}
          sideOffset={5}
          className="max-w-[280px] w-fit px-3 py-1.5 text-left"
        >
          {typeof content === "string" ? (
            <p className="text-sm whitespace-normal text-left">{content}</p>
          ) : (
            content
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
