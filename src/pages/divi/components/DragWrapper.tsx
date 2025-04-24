import {ReactNode, useEffect, useRef, useState} from "react";
import {useDrag} from "@use-gesture/react";

interface DragWrapperProps {
  children: ReactNode;
  position?: "left" | "right";
  defaultPosition?: { x: string | number, y: string | number };
}

export const DragWrapper = ({ children, position = "left", defaultPosition = { x: "5%", y: "5%" } }: DragWrapperProps) => {
  const [panelPosition, setPanelPosition] = useState(defaultPosition);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const initialPositionSet = useRef(false);

  useEffect(() => {
    if (!initialPositionSet.current && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPanelPosition({
        x: rect.left,
        y: rect.top
      });
      initialPositionSet.current = true;
    }
  }, []);

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
      ref={wrapperRef}
      {...bindProps}
      style={{
        position: 'fixed',
        top: typeof panelPosition.y === 'string' ? panelPosition.y : panelPosition.y + 'px',
        left: typeof panelPosition.x === 'string' ? panelPosition.x : panelPosition.x + 'px',
        transform: 'none',
        touchAction: 'none',
        willChange: 'transform'
      }}
      className={`
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
