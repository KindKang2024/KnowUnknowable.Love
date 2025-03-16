import {ReactNode, useState} from "react";
import {useDrag} from "@use-gesture/react";

interface DragWrapperProps {
  children: ReactNode;
  position?: "left" | "right";
  defaultPosition?: { x: number, y: number };
}

export const DragWrapper = ({ children, position = "left", defaultPosition = { x: 30, y: 0 } }: DragWrapperProps) => {
  const [panelPosition, setPanelPosition] = useState(defaultPosition);

  const bind = useDrag(({ movement: [x, y], first, memo = panelPosition }) => {
    if (first) {
      return memo;
    }
    setPanelPosition({
      x: memo.x + x,
      y: memo.y + y
    });
    return memo;
  });

  // @ts-ignore
  const bindProps = bind();

  return (
    <div
      {...bindProps}
      style={{
        transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
        touchAction: 'none'
      }}
      className={`
        fixed ${position} top-20
        duration-300 rounded-r-lg
        w-80
        border border-white/5 
        scrollbar-none
      `}
    >
      {children}
    </div>
  );
};
