import {LocateFixed} from "lucide-react";
import {Button} from "../../../components/ui/button.tsx";
import {useLocaleData, usePageCommonData} from "@/i18n/DataProvider.tsx";
import {useUIStore} from "@/stores/uiStore.ts";
import {cn} from "@/lib/utils";

interface GuaSectionProps {
  binaryCodeString: string;
  currentDivisions: number;
  totalMutationCount?: number;
}

export const GuaSection = ({ binaryCodeString, currentDivisions }: GuaSectionProps) => {
  // const iChing: IChingGuaMap = useIChing();
  const { iChing, ui } = useLocaleData();
  const commonData = usePageCommonData();
  const { focusGuaBinary } = useUIStore();

  // if (currentDivisions <= 17) {
  //   return (
  //     <div className="flex items-center justify-between">
  //       <label className="text-sm text-[#9b87f5]/60">{type === "gua" ? ui.gua : ui.mutation}:</label>
  //       <span className="text-xs text-gray-400">  {type === "gua" ? `Divining Progress: ${currentDivisions + 1} / 18` : '?'} </span>
  //     </div>
  //   )
  // }

  if (!binaryCodeString || binaryCodeString.length !== 6 || iChing === undefined || iChing === null) {
    return (
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-indigo-300/80 tracking-wide">
          {/* {ui.gua}: */}
          {commonData.gua}:
        </label>
        <span className="text-xs text-gray-400">?</span>
      </div>
    )
  }

  const gua = iChing[binaryCodeString];
  console.log(gua);

  const { name, symbol, gua_ci, yao_ci } = gua;

  return (
    <div className="space-y-2 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-indigo-300/80 tracking-wide">
          {/* {ui.gua}: */}
          {commonData.gua}:
        </label>
        <span className="text-xs bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent font-semibold">
          {name}{symbol}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 bg-indigo-950/30 backdrop-blur-sm rounded-md p-2 border border-indigo-500/20">
          <div className="text-xs text-indigo-200">{gua_ci}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full bg-indigo-900/30 hover:bg-indigo-800/50 border border-indigo-500/30 p-0 transition-all duration-300"
          onClick={() => {
            focusGuaBinary(binaryCodeString);
          }}
        >
          <LocateFixed className="h-3.5 w-3.5 text-indigo-300" />
        </Button>
      </div>
    </div>
  );
}

export const MutationGuaSection = ({ binaryCodeString, currentDivisions, totalMutationCount = 0 }: GuaSectionProps) => {
  const { iChing, ui } = useLocaleData();
  const commonData = usePageCommonData();
  console.log(binaryCodeString);
  const { focusGuaBinary } = useUIStore();

  if (currentDivisions <= 17) {
    return (
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-purple-300/80 tracking-wide">
          {/* {ui.mutation}: */}
          {commonData.mutation}:
        </label>
        <span className="text-xs text-gray-400">?</span>
      </div>
    )
  }

  if (binaryCodeString.length !== 6) {
    return (
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-purple-300/80 tracking-wide">
          {/* {ui.mutation}: */}
          {commonData.mutation}:
        </label>
        <span className={cn(
          "text-xs",
          totalMutationCount > 0
            ? "bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent font-semibold"
            : "text-gray-400"
        )}>
          {totalMutationCount} {commonData.mutationCountSuffix}
        </span>
      </div>
    )
  }

  const gua = iChing[binaryCodeString];
  // console.log(gua);

  const { name, symbol, gua_ci, yao_ci } = gua;

  return (
    <div className="space-y-2 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-purple-300/80 tracking-wide">
          {/* {ui.mutation}: */}
          {commonData.mutation}:
        </label>
        <span className="text-xs bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent font-semibold">
          {name}{symbol}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 bg-purple-950/30 backdrop-blur-sm rounded-md p-2 border border-purple-500/20">
          <div className="text-xs text-purple-200">{gua_ci}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/30 p-0 transition-all duration-300"
          onClick={() => {
            focusGuaBinary(binaryCodeString);
          }}
        >
          <LocateFixed className="h-3.5 w-3.5 text-purple-300" />
        </Button>
      </div>
    </div>
  );
}
