import {YinYangCircleVisualization} from "../../../components/divination/YinYangCircleVisualization.tsx";
import {useDivinationStore} from "@/stores/divineStore.ts";
import {a, config, useSpring} from "@react-spring/web";
import {YaoLine} from "./yao_line.tsx";
import {MutationControl} from "./MutationControl.tsx";
import {cn} from "@/lib/utils.ts";

// YaoLine component to visualize the trigram lines


interface ResultGridProps {
  label: string;
  type: "number" | "checkbox";
  onCheckboxChange?: (index: number) => void;
  disabledIndexes?: number[];
  textProgress?: string;
  textLineChangeable?: string;
  textLineNotChangeable?: string;
}

export const ResultGrid = ({
  label,
  type,
  onCheckboxChange,
  disabledIndexes = [],
  textProgress,
  textLineChangeable,
  textLineNotChangeable
}: ResultGridProps) => {
  // Convert DivinationAgg to YAO array for visualization
  const { isDivinationCompleted, mutate, divide, gua, getTotalDivisions, getCurrentRound } = useDivinationStore();


  // Animation for the entire grid
  const gridAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle
  });

  // Calculate progress percentage
  // const progressPercentage = Math.min(100, (getTotalDivisions() / 18) * 100);

  return (
    <a.div className="space-y-1" style={{
      opacity: 0,
      ...gridAnimation
    }}>
      <div className="text-center">
        <div className="text-center items-center align-center  text-xs gap-2">
          <label className=" text-[#9b87f5]/60">
            {textProgress} ( {getCurrentRound()} / 6 )
          </label>
        </div>

      </div>

      <div className="flex flex-col">
        {Array.from({ length: 6 }, (_, index) => {
          const yaoIndex = 5 - index;
          const yao = gua.yaos[yaoIndex];

          const isCompleted = yao.isCompleted();
          const rowOpacity = isCompleted ? 1 : 0.6;

          return (
            <div
              key={yaoIndex}
              style={{
                // ...rowAnimation,
                opacity: rowOpacity
              }}
              className={cn(
                "grid grid-cols-5 items-center gap-2 p-1 rounded-md transition-all duration-300",
                yaoIndex === 2 ? "mt-2" : ""
              )}
            >
              <div className="col-span-1">
                <YinYangCircleVisualization
                  yao={yao}
                  size={24}
                  dotSize={0.6}
                  circleStrokeWidth={0.6}
                />
              </div>

              <div className="col-span-3">
                <YaoLine
                  value={yao.isCompleted() ? yao.getFinalUndividedGroupCount() : 0}
                  index={yaoIndex}
                />
                {!yao.isCompleted() && (
                  <div className="text-xs text-indigo-300/60 text-center mt-1" />
                )}
              </div>

              <div className="col-span-1">
                <MutationControl
                  isMutable={yao.isMutable()}
                  isCompleted={yao.isCompleted()}
                  index={yaoIndex}
                  onMutate={mutate}
                  textLineChangeable={textLineChangeable}
                  textLineNotChangeable={textLineNotChangeable}
                />
              </div>
            </div>
          );
        })}
      </div>
    </a.div>
  );
};
